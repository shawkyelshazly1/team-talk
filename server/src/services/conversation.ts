import { Agent, Conversation } from "../lib/types";
import { meilisearchMutations } from "../meilisearch";
import { conversationRepo } from "../repos";
import { redisUtils } from "../redis";
import { triggerQueueAssignment } from "./queueAssignment";
import { socketIOClient } from "../socketio";

// create a new conversation service
export const createNewConversation = async (user: Agent, ticketLink: string, message: string) => {
    try {

        // create conversation in DB
        const conversation = await conversationRepo.createConversation(user as Agent, ticketLink, message);

        // add message to meilisearch
        await meilisearchMutations.addMessageToMeilisearch({
            ...conversation.lastMessage, sender: {
                ...user, role: "csr"
            } satisfies Agent,
        });

        // add conversation to queue
        await redisUtils.addConversationToQueue(conversation.id);

        // 🎯 EVENT-DRIVEN TRIGGER
        setImmediate(() => triggerQueueAssignment());

        return conversation;
    } catch (error) {
        throw error;
    }
};

// change conversation status service
export const changeConversationStatus = async (conversationId: string, status: (Conversation["status"]), topic: string, user: Agent) => {
    try {

        const conversation = await conversationRepo.setConversationStatus(conversationId, status, topic, user);

        // send update to all connected users in the conversation room
        socketIOClient.to(conversationId).emit("update_conversation", {
            conversation: conversation,
        });

        // 🎯 EVENT-DRIVEN TRIGGER
        setTimeout(() => {
            socketIOClient.emit("remove_from_basket", { conversation_id: conversationId });
            // remove conversation from basket
            redisUtils.removeConversationFromBasket(conversationId, conversation?.assigneeId ?? "");
            triggerQueueAssignment();
        }, 7000);

        return conversation;

    } catch (error) {
        throw error;
    }
};

// assign conversation to teamleader service
export const assignConversationToTeamleader = async (): Promise<boolean> => {
    try {

        // get conversation from queue based on FIFO
        const conversationId = await redisUtils.getConversationFromQueue();
        if (!conversationId) return false;

        // get online teamleaders
        const onlineTls = await redisUtils.getOnlineTeamleaders();

        // find best teamleader based on priority
        let bestTl = null;
        let mostAvailableSlots = 0;

        for (const [tlId, availableSlots] of Object.entries(onlineTls)) {
            const slots = parseInt(availableSlots);
            if (slots > mostAvailableSlots) {
                mostAvailableSlots = slots;
                bestTl = tlId;
            }
        }

        if (bestTl && mostAvailableSlots > 0) {

            // Update database
            const updatedConversation = await conversationRepo.assignToTeamleader<Conversation>(conversationId, bestTl);

            // assign conversation to teamleader
            await redisUtils.assignConversationToTeamleader(conversationId, bestTl);

            // TODO: send conversation to teamleader basket
            socketIOClient.to(bestTl).emit("assign_conversation", {
                conversation: updatedConversation,
            });

            return true;
        } else {
            // add back to queue
            await redisUtils.addConversationToQueue(conversationId);
            return false;
        }


    } catch (error) {
        throw error;
    }
};

// unassign conversation from teamleader service
export const clearTeamleaderBasket = async (teamleaderId: string) => {
    try {

        // get conversations from teamleader basket
        const conversations = await redisUtils.getTeamleaderBasket(teamleaderId);

        const unassignedConversations = [];

        // update conversations assignee to null  and return to queue
        for (const conversationId of conversations) {
            const unassignedConversationId = await conversationRepo.unassignFromTeamleader(conversationId);
            unassignedConversations.push(unassignedConversationId);
        }

        // clear teamleader basket
        await redisUtils.clearTeamleaderBasket(teamleaderId);

        if (unassignedConversations.length > 0) {
            // add conversations to queue
            for (const conversationId of unassignedConversations) {
                await redisUtils.addConversationToQueue(conversationId);
            }
        }

        return true;

    } catch (error) {
        throw error;
    }
};