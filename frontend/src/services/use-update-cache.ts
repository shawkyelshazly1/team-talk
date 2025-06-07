'use client';

import type { Conversation, Message } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { useReadCache } from "./use-read-cache";


export const useUpdateCache = () => {
    const queryClient = useQueryClient();

    const { readConversationMessages } = useReadCache();

    const updateMessage = (data: { conversation_id: string, message: Message; }) => {
        const queryKey = ["conversation_messages", data.conversation_id];

        const existingMessages = readConversationMessages(data.conversation_id);

        if (existingMessages) {
            queryClient.setQueryData(queryKey, (oldMessages: Message[] = []) => {
                const messageExists = oldMessages.some(m => m.id === data.message.id);
                if (messageExists) return oldMessages;
                return [...oldMessages, data.message];
            });
        }
    };


    const updateConversation = (data: { conversation_id: string, conversation: Omit<Conversation, "agent">; }) => {
        const queryKey = ["conversation", data.conversation_id];

        const existingConversation = queryClient.getQueryData<Conversation>(queryKey);

        if (existingConversation) {
            queryClient.setQueryData(queryKey, (oldConversation: Conversation) => {
                return {
                    ...oldConversation,
                    ...data.conversation,
                };
            });
        }
    };


    return {
        updateMessage, updateConversation
    };


};


