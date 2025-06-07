import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { registerListeners } from "./listeners";
import { registerUserDisconnectionListeners } from "./listeners/user";
import type { ClientToServerEvents, SocketData, ServerToClientEvents } from "@shared/socket-types";
import type { ExtendedSocket } from "./types";

// socketio client instance
export let socketIOClient: Server<ClientToServerEvents, ServerToClientEvents, SocketData>;

// initialize socketio
export const initializeSocketIO = (httpServer: HttpServer) => {
    socketIOClient = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    // initialize listeners
    socketIOClient.on("connection", (socket: ExtendedSocket) => {
        registerListeners(socket);

        socket.on("error", (error) => {
            console.log("socket error: ", error);
        });

        // regiser disconnecting event
        socket.on("disconnect", () => {
            registerUserDisconnectionListeners(socket);
        });
    });
};
