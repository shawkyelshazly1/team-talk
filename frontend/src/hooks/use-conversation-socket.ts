import { sendMessage } from "@/services/socketService";
import { useSocket } from "./use-socket";
import { useCallback } from "react";



interface ConversationSocketProps {
    conversationId: string;
}

export const useConversationSocket = ({ conversationId }: ConversationSocketProps) => {
    const { socket } = useSocket();


    // Room joining/leaving is now handled by useConversationRooms
    // This hook only handles message sending

    const handleSendMessage = useCallback((content: string, senderId: string, agentId: string) => {
        if (socket && conversationId) {
            sendMessage(socket, content, conversationId, senderId, agentId);
        }
    }, [socket, conversationId]);

    return { sendMessage: handleSendMessage };
};



