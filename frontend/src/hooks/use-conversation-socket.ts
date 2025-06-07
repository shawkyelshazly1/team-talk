import { useSocket } from "./use-socket";
import { useCallback, useEffect } from "react";
import type { Message } from "@shared/types";
import { useUpdateCache } from "@/services/use-update-cache";



interface ConversationSocketProps {
    conversationId: string;
}

export const useConversationSocket = ({ conversationId }: ConversationSocketProps) => {
    const { socket, isConnected } = useSocket();
    const { updateMessage } = useUpdateCache();

    const handleNewMessage = useCallback((data: { message: Message, conversation_id: string; }) => {
        updateMessage(data); // Call the hook with the data
    }, []);

    // handle real-time events
    useEffect(() => {
        if (!socket || !isConnected || !conversationId) return;

        // join conversation room
        socket.emit("join_conversation", { conversation_id: conversationId });

        // receive new message
        socket.on("new_message", handleNewMessage);



        // leave conversation room
        return () => {
            socket.off("new_message", handleNewMessage);
            socket.emit("leave_conversation", { conversation_id: conversationId });
        };

    }, [socket, isConnected, conversationId]);


    const sendMessage = useCallback((message: string, conversation_id: string) => {
        socket?.emit("new_message", { message, conversation_id });
    }, [socket, conversationId]);


    return { sendMessage };
};



