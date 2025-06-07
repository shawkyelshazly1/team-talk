// events types & generic types

import { DefaultEventsMap, Socket } from "socket.io";
import { Conversation, Message, User, UserStatus } from "../lib/types";


// extended socket data type
export interface SocketData {
    user?: User;
}


// server to client events types
export interface ServerToClientEvents {
    authenticated: (data: { status: string, message: string; }) => void;
    unauthorized: (data: { status: string, message: string; }) => void;
    new_message: (data: { message: Message, conversation_id: string; }) => void;
    ack_status: (data: { success: boolean, status: UserStatus; }) => void;
    assign_conversation: (data: { conversation: Conversation; }) => void;
    update_conversation: (data: { conversation: Omit<Conversation, "agent">; }) => void;
    remove_from_basket: (data: { conversation_id: string; }) => void;
}


// client to server events types
export interface ClientToServerEvents {
    authenticate: (data: { user: User; }) => void;
    new_message: (data: { message: string, conversation_id: string; }) => void;
    join_conversation: (data: { conversation_id: string; }) => void;
    leave_conversation: (data: { conversation_id: string; }) => void;
    set_status: (data: { status: "online" | "offline"; }) => void;

}


// extended Socket type
export type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;
