// events types & generic types

import { DefaultEventsMap, Socket } from "socket.io";
import { User } from "../lib/types";


// extended socket data type
export interface SocketData {
    user?: User;
}


// server to client events types
export interface ServerToClientEvents {
    authenticated: (data: { status: string, message: string; }) => void;
    unauthorized: (data: { status: string, message: string; }) => void;
}


// client to server events types
export interface ClientToServerEvents {
    authenticate: (data: { user: User; }) => void;
}

// extended Socket type
export type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;
