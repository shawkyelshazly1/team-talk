import type { Agent, Conversation } from "@shared/types";
import { meilisearchMutations } from "../meilisearch";
import { conversationRepo } from "../repos";
import { redisUtils } from "../redis";
import { socketIOClient } from "../socketio";
import { redisClient } from "../redis/connection";

// create a new conversation service
export const createNewConversation = async (
    user: Agent,
    ticketLink: string,
    message: string
) => {
    try {
        // create conversation in DB
        const conversation = await conversationRepo.createConversation(
            user as Agent,
            ticketLink,
            message
        );

        // add message to meilisearch
        await meilisearchMutations.addMessageToMeilisearch({
            ...conversation.lastMessage,
            sender: {
                ...user,
                role: "csr",
            } satisfies Agent,
        });

        // add conversation to queue
        await redisUtils.addConversationToQueue(conversation.id);

        return conversation;
    } catch (error) {
        throw error;
    }
};

// change conversation status service
export const changeConversationStatus = async (
    conversationId: string,
    status: Conversation["status"],
    topic: string,
    user: Agent
) => {
    try {
        const conversation = await conversationRepo.setConversationStatus(
            conversationId,
            status,
            topic,
            user
        );

        // send update to all connected users in the conversation room
        socketIOClient.to(conversationId).emit("update_conversation", {
            conversation: conversation,
        });

        // 🎯 EVENT-DRIVEN TRIGGER
        setTimeout(() => {
            socketIOClient.emit("remove_from_basket", {
                conversation_id: conversationId,
            });
            // remove conversation from basket
            redisUtils.removeConversationFromBasket(
                conversationId,
                conversation?.assigneeId ?? ""
            );
        }, 10000);

        return conversation;
    } catch (error) {
        throw error;
    }
};

// assign conversation to teamleader service
export const assignConversationToTeamleader = async (assignment: {
    conversationId: string;
    teamleaderId: string;
}, isWorkerContext: boolean = false): Promise<boolean> => {
    try {
        // Update database
        const updatedConversation =
            await conversationRepo.assignToTeamleader<Conversation>(
                assignment.conversationId,
                assignment.teamleaderId
            );

        // Handle socket events differently in worker context
        if (isWorkerContext) {
            // Publish event to Redis for main server to handle
            await redisClient.publish('assignment_events', JSON.stringify({
                type: 'assign_conversation',
                teamleaderId: assignment.teamleaderId,
                conversation: updatedConversation
            }));

        } else {
            // Direct socket emission (for main server context)
            socketIOClient
                .to(`user_${assignment.teamleaderId}`)
                .emit("assign_conversation", {
                    conversation: updatedConversation,
                });
        }

        return true;
    } catch (error) {
        console.error(
            `Failed to assign conversation in DB ${assignment.conversationId} to teamleader ${assignment.teamleaderId}:`,
            error
        );
        return false;
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
            const unassignedConversationId =
                await conversationRepo.unassignFromTeamleader(conversationId);
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
