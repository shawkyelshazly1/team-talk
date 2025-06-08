import { ExtendedSocket } from "../types";


export const registerConversationListeners = (socket: ExtendedSocket) => {

    // join conversation room
    socket.on("join_conversation", (data) => {
        socket.join(data.conversation_id);
    });
    // leave conversation room
    socket.on("leave_conversation", (data) => {
        socket.leave(data.conversation_id);
    });

    socket.on("new_message", (data) => {
        console.log("new_message", data);

        // TODO:handle creating new message
        return;
    });
};