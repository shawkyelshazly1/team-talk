import { Agent, Conversation } from "../lib/types";
import { meilisearchMutations } from "../meilisearch";
import { conversationRepo } from "../repos";

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

        // TODO: set in redis queue to be assigned to a teamleader

        return conversation;
    } catch (error) {
        throw error;
    }
};

// change conversation status service
export const changeConversationStatus = async (conversationId: string, status: (Conversation["status"]), topic: string, user: Agent) => {
    try {

        const conversation = await conversationRepo.setConversationStatus(conversationId, status, topic, user);

        //TODO: send update to connected users

        return conversation;

    } catch (error) {
        throw error;
    }
};

// assign conversation to teamleader service
export const assignConversationToTeamleader = async () => {
    try {

    } catch (error) {
        throw error;
    }
};