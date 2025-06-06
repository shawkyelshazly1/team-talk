import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { registerListeners } from "./listeners";
import { registerUserDisconnectionListeners } from "./listeners/user";
import { ExtendedSocket } from "./types";


// socketio client instance
export let socketIOClient: Server;

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
    });

    // regiser disconnecting event
    socketIOClient.on("disconnect", (socket: ExtendedSocket) => {
        registerUserDisconnectionListeners(socket);
    });
};



