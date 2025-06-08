"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useSocket } from "./use-socket";
import { useUIStore } from "@/stores/useUIStore";
import { useEffect, useRef } from "react";
import { joinConversation, leaveConversation } from "@/services/socketService";

export const useConversationRooms = () => {

    const { user } = useUserStore();
    const { socket, isConnected } = useSocket();
    const { selectedConversationId, viewMode, basket } = useUIStore();

    // track currently joined conversationsToJoin
    const joinedConversationsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!socket || !user || !isConnected) return;

        let conversationsToJoin: string[] = [];

        // check what to join based on view mode
        if (viewMode === "single-conversation" && selectedConversationId) {
            // join single conversation based on selection
            conversationsToJoin = [selectedConversationId];
        } else if (viewMode === "team-leader-multi" && user.role === "team_lead") {
            conversationsToJoin = basket;
        }

        // csr inbox view mode - no join cause messaegs received through user room

        const conversationsToJoinSet = new Set(conversationsToJoin);
        const currentlyJoined = joinedConversationsRef.current;

        // Leave conversations that are no longer needed
        for (const conversationId of currentlyJoined) {
            if (!conversationsToJoinSet.has(conversationId)) {
                leaveConversation(socket, conversationId);
                currentlyJoined.delete(conversationId);
            }
        }

        // Join new conversations
        for (const conversationId of conversationsToJoin) {
            if (!currentlyJoined.has(conversationId)) {
                joinConversation(socket, conversationId);
                currentlyJoined.add(conversationId);
            }
        }


    }, [socket, isConnected, user, selectedConversationId, viewMode, basket]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                for (const conversationId of joinedConversationsRef.current) {
                    leaveConversation(socket, conversationId);
                }
                joinedConversationsRef.current.clear();
            }
        };
    }, [socket]);

};