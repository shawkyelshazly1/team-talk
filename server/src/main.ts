import express from "express";
import authRouter from "./routers/auth";
import cors from "cors";
import conversationRouter from "./routers/conversation";
import filtersRouter from "./routers/filters";
import { verifyConnections } from "./utils/verifyConnections";
import healthCheckRouter from "./utils/healthChecks";
import { connectRedis } from "./redis/connection";
import { initializeSocketIO } from "./socketio";
import { createServer } from 'http';
import { AssignmentEventHandler } from "./services/assignmentEventHandler";
import workerStatsRouter from "./routers/monitoring";
import { GracefulShutdownService } from "./services/gracefulShutdown";

// initialize PORT
const PORT = 5000;

// create express app instance
const app = express();
const httpServer = createServer(app);

// Configure CORS middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

// register routers
app.use(authRouter);

// register json middleware
app.use(express.json());

// register routers
app.use("/api/conversations", conversationRouter);
app.use("/api/filters", filtersRouter);
app.use("/", workerStatsRouter);

// register health check router
app.use(healthCheckRouter);


// init redis connection
connectRedis();

// init socketIo connection
initializeSocketIO(httpServer);

// Initialize assignment event handler
const assignmentEventHandler = new AssignmentEventHandler();
assignmentEventHandler.start();

// Initialize graceful shutdown service
const shutdownService = new GracefulShutdownService(httpServer, assignmentEventHandler);
shutdownService.setupShutdownHandlers();

httpServer.listen(PORT, () => {
    verifyConnections();
    console.info(`Server is running on port ${PORT}`);
});
