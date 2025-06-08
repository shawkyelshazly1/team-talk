import { useConversationRooms } from "./use-conversation-rooms";
import { useConversationUrlSync } from "./use-conversation-url-sync";
import { useSocketConnection } from "./use-socket-connection";


export const useAppSocket = () => {
    // 1. Establish socket connection
    const { socket, isConnected } = useSocketConnection();

    // 2. Sync URL with UI state
    useConversationUrlSync();

    // 3. Manage conversation room joining/leaving
    useConversationRooms();

    return { socket, isConnected };
};