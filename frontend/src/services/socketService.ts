import type { ExtendedSocket } from '@/lib/socketio/types';
import type { User } from '@shared/types';
import { io } from 'socket.io-client';


/**
 * Creates a socket connection to the server
 * @param user - The user to connect to the socket
 * @returns The socket connection
 */
export const createSocketConnection = (user: User): ExtendedSocket => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
        timeout: 10000,
        autoConnect: true
    }) as ExtendedSocket;

    return socket;
};


export const authenticateSocket = (socket: ExtendedSocket, user: User) => {
    socket.emit("authenticate", { user });
};

export const setUserStatus = (socket: ExtendedSocket, status: 'online' | 'offline') => {
    socket.emit("set_status", { status });
};

export const joinConversation = (socket: ExtendedSocket, conversationId: string) => {
    socket.emit("join_conversation", { conversation_id: conversationId });
};

export const leaveConversation = (socket: ExtendedSocket, conversationId: string) => {
    socket.emit("leave_conversation", { conversation_id: conversationId });
};

export const sendMessage = (socket: ExtendedSocket, message: string, conversationId: string) => {
    socket.emit("new_message", { message, conversation_id: conversationId });
};

export const disconnectSocket = (socket: ExtendedSocket) => {
    socket.disconnect();
};

export const requestCurrentUserStatus = (socket: ExtendedSocket) => {
    socket.emit("get_current_status");
};

export const sendHeartbeat = (socket: ExtendedSocket) => {
    socket.emit("heartbeat");
};

export const startHeartbeat = (socket: ExtendedSocket) => {
    return setInterval(() => {
        if (socket.connected) {
            sendHeartbeat(socket);
        }
    }, 5000); // 5 seconds
};
