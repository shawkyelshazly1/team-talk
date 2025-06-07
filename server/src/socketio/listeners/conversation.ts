import { ExtendedSocket } from "../types";


export const registerConversationListeners = (socket: ExtendedSocket) => {

    // join conversation room
    socket.on("join_conversation", (data) => {
        console.log("user joined conversation", data.conversation_id);
        socket.join(data.conversation_id);
    });
    // leave conversation room
    socket.on("leave_conversation", (data) => {
        console.log("user left conversation", data.conversation_id);
        socket.leave(data.conversation_id);
    });

    socket.on("new_message", (data) => {
        console.log("new_message", data);

        // TODO:handle creating new message
        return;
    });
};