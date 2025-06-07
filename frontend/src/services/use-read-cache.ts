'use client';

import type { Conversation, Message } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
export function useReadCache() {
    const queryClient = useQueryClient();


    const readConversation = (conversationId: string) => {
        const conversation: Conversation | undefined = queryClient.getQueryData([
            "conversation",
            conversationId,
        ]) as Conversation | undefined;

        return conversation;
    };

    const readConversationMessages = (conversationId: string) => {
        const messages: Message[] | undefined = queryClient.getQueryData([
            "conversation_messages",
            conversationId,
        ]) as Message[] | undefined;
        return messages;
    };

    return { readConversation, readConversationMessages };
}









