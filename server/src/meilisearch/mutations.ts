import { meilisearch } from "../lib/meilisearch";
import type { Message } from "@shared/types";

// add single message to meilisearch
export const addMessageToMeilisearch = async (message: Message) => {
    const result = await meilisearch.index("messages").addDocuments([message]);
    return result;
};

// add multiple messages to meilisearch
export const addMessagesToMeilisearch = async (messages: Message[]) => {
    const result = await meilisearch.index("messages").addDocuments(messages);
    return result;
};

// delete single message from meilisearch
export const deleteMessageFromMeilisearch = async (messageId: string) => {
    const result = await meilisearch.index("messages").deleteDocument(messageId);
    return result;
};

// delete multiple messages from meilisearch
export const deleteMessagesFromMeilisearch = async (messageIds: string[]) => {
    const result = await meilisearch.index("messages").deleteDocuments(messageIds);
    return result;
};

// delete all messages from meilisearch