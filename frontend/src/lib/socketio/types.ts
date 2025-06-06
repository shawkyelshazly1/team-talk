// events types & generic types

import { Socket } from "socket.io-client";
import { User } from "../types";


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
export type ExtendedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
