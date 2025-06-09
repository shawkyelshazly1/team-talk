// events types & generic types

import type { Conversation, Message, User, UserStatus } from "./types";


// extended socket data type
export interface SocketData {
    user?: User;
}


// server to client events types
export interface ServerToClientEvents {
    authenticated: (data: { status: string, message: string; }) => void;
    unauthorized: (data: { status: string, message: string; }) => void;
    new_message: (data: { message: Message, conversationId: string; }) => void;
    // new_message: (data: { content: string, conversationId: string, senderId: string; }) => void;
    ack_status: (data: { success: boolean, status: UserStatus; }) => void;
    assign_conversation: (data: { conversation: Conversation; }) => void;
    update_conversation: (data: { conversation: Omit<Conversation, "agent">; }) => void;
    remove_from_basket: (data: { conversation_id: string; }) => void;
    current_status: (data: { status: UserStatus; }) => void;
    heartbeat_ack: (data: { timestamp: number; success: boolean; message?: string; }) => void;
    sync_basket: (data: { basket: string[]; }) => void;
}


// client to server events types
export interface ClientToServerEvents {
    authenticate: (data: { user: User; }) => void;
    new_message: (data: { content: string, conversation_id: string, sender_id: string, agent_id: string; }) => void;
    join_conversation: (data: { conversation_id: string; }) => void;
    leave_conversation: (data: { conversation_id: string; }) => void;
    set_status: (data: { status: "online" | "offline"; }) => void;
    get_current_status: () => void;
    heartbeat: () => void;

}
