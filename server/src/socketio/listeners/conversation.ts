import { conversationServices } from "../../services";
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

    socket.on("new_message", async (data) => {

        try {
            // create new message
            const newMessage = await conversationServices.createNewMessage(data.content, data.sender_id, data.conversation_id);

            const { socketIOClient } = await import("../index");

            socketIOClient.to(data.conversation_id).emit("new_message", {
                message: newMessage,
                conversationId: data.conversation_id,
            });

            if (socket.data.user?.role === "csr") {
                socketIOClient.to(`user_${data.agent_id}`).emit("new_message", {
                    message: newMessage,
                    conversationId: data.conversation_id,
                });
            }

            if (data.sender_id !== data.agent_id) {
                // send message to agent room
                socket.to(`user_${data.agent_id}`).emit("new_message", {
                    message: newMessage,
                    conversationId: data.conversation_id,
                });
            }
            return;
        } catch (error) {
            console.error(error);
            socket.emit("error", {
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            });
            return;
        }
    });
};