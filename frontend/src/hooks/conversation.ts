'use client';

import { Conversation } from "@/lib/types";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";


export const useSelectedConversation = () => {
    const searchParams = useSearchParams();
    const conversationId = searchParams.get("conversation_id") ?? "";

    const queryClient = useQueryClient();
    const conversation: Conversation | undefined = queryClient.getQueryData([
        "conversation",
        conversationId,
    ]) as Conversation | undefined;

    return conversation! satisfies Conversation;
};