import { Socket } from "socket.io";
import { registerUserListeners } from "./user";

// register listeners
export const registerListeners = (socket: Socket) => {
    registerUserListeners(socket);
};



