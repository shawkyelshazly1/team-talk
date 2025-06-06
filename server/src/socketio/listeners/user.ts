
import { ExtendedSocket } from "../types";
// register user listeners
export const registerUserListeners = (socket: ExtendedSocket) => {

    // authenticate user event listener
    socket.on("authenticate", async (data) => {
        const { user } = data;

        if (!user) {
            // emit unauthorized event
            socket.emit("unauthorized", {
                status: "error",
                message: "Unauthorized",
            });
            return;
        }

        // emit authenticated event
        socket.emit("authenticated", {
            status: "success",
            message: "Authenticated",
        });

        // join user to room by userId
        socket.join(user.id);

        // set user data
        socket.data.user = user;

    });
};

// register user disconnection listeners
export const registerUserDisconnectionListeners = (socket: ExtendedSocket) => {
    // exit user from room by userId
    if (socket.data.user) {
        socket.leave(socket.data.user?.id);
    }
};