import { redisUtils } from "../../redis";
import { conversationServices } from "../../services";
import { triggerQueueAssignment } from "../../services/queueAssignment";
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

        } else {
            // emit authenticated event
            socket.emit("authenticated", {
                status: "success",
                message: "Authenticated",
            });

            // join user to room by userId
            socket.join(`user_${user.id}`);

            // set user data
            socket.data.user = user;
        }
    });

    // hanle setting status event listener
    socket.on("set_status", async (data) => {
        const { status } = data;
        if (!socket.data.user) return;

        if (socket.data.user.role === 'csr') {
            // set csr status
            await redisUtils.setAgentOnline(socket.data.user.id);
        } else {
            // set teamleader status
            switch (status) {
                case "online":
                    await redisUtils.setTeamleaderOnline(socket.data.user.id);
                    socket.emit("ack_status", { success: true, status: "online" });
                    // 🎯 EVENT-DRIVEN TRIGGER
                    setImmediate(() => triggerQueueAssignment());
                    break;
                case "offline":
                    await redisUtils.setTeamleaderOffline(socket.data.user.id);
                    await conversationServices.clearTeamleaderBasket(socket.data.user.id);
                    socket.emit("ack_status", { success: true, status: "offline" });
                    break;
            }
        }

    });

    // 🎯 Handle current status response
    socket.on("get_current_status", async () => {
        const user = socket.data.user;


        if (!user) return;

        if (user.role === "csr") {
            const status = await redisUtils.getAgentStatus(user.id);
            socket.emit("current_status", { status });
        } else {
            const status = await redisUtils.getTeamleaderStatus(user.id);

            socket.emit("current_status", { status });
        }
    });
};

// register user disconnection listeners
export const registerUserDisconnectionListeners = async (socket: ExtendedSocket) => {
    // exit user from room by userId
    if (socket.data.user) {
        socket.leave(`user_${socket.data.user?.id}`);
        // set user offline in redis
        switch (socket.data.user.role) {
            case "csr":
                await redisUtils.setAgentOffline(socket.data.user.id);
                break;
            case "team_lead":
                await conversationServices.clearTeamleaderBasket(socket.data.user.id);

                await redisUtils.setTeamleaderOffline(socket.data.user.id);
                break;
        }
    }
};
