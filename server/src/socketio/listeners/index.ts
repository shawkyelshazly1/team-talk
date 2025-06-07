import { Socket } from "socket.io";
import { registerUserListeners } from "./user";
import { registerConversationListeners } from "./conversation";

// register listeners
export const registerListeners = (socket: Socket) => {
    registerUserListeners(socket);
    registerConversationListeners(socket);
};



