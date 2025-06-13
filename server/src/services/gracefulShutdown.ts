import type { Server } from "http";
import type { AssignmentEventHandler } from "./assignmentEventHandler";
import { redisCleanupService } from "./redisCleanupService";
import { error } from "console";

export class GracefulShutdownService {
    private httpServer: Server;
    private assignmentEventHandler: AssignmentEventHandler;
    private isShuttingDown: boolean = false;

    constructor(
        httpServer: Server,
        assignmentEventHandler: AssignmentEventHandler
    ) {
        this.httpServer = httpServer;
        this.assignmentEventHandler = assignmentEventHandler;
    }

    /**
     * setup all shutdown signal handlers
     */

    public setupShutdownHandlers(): void {
        // handle all shutdown signals
        process.on("SIGTERM", () => this.gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => this.gracefulShutdown("SIGINT"));
        process.on("SIGUSR2", () => this.gracefulShutdown("SIGUSR2"));

        // handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            console.error("Uncaught exception:", error);
            this.gracefulShutdown("UNCAUGHT_EXCEPTION");
        });

        // handle promise rejections if not handled
        process.on("unhandledRejection", (reason, promise) => {
            console.error("Unhandled rejection:", reason);
            this.gracefulShutdown("UNHANDLED_REJECTION");
        });
        console.info("Graceful shutdown handlers registered");
    }

    /**
     * perform graceful shutdown
     */
    private async gracefulShutdown(signal: string): Promise<void> {
        if (this.isShuttingDown) {
            console.info(`Shutdown already in progress with signal: ${signal}`);
            return;
        }

        this.isShuttingDown = true;
        console.info(`Received ${signal}, shutting down gracefully...`);

        try {
            // Step 1: Stop accepting new connections
            console.info("Stopping new connections...");

            // Step 2: Stop assignment event handler
            console.info("Stopping assignment event handler...");
            await this.assignmentEventHandler.stop();
            console.info("Assignment event handler stopped");

            // Step 3: Redis cleanup
            console.info("Cleaning up Redis...");
            await redisCleanupService.gracefulShutdown();
            console.info("Redis cleanup completed");

            // Step 4: Close HTTP server
            console.info("Closing HTTP server...");
            await this.closeHttpServer();
            console.info("HTTP server closed");

            console.info("Graceful shutdown completed successfully");
            process.exit(0);
        } catch (error) {
            console.error("Error during graceful shutdown:", error);
            process.exit(1);
        }
    }

    /**
     * close HTTP server with timeout
     */
    private closeHttpServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            // set timeout for force shutdown after 5 seconds
            const timeout = setTimeout(() => {
                console.warn("HTTP server shutdown timed out, force closing...");
                reject(new Error("HTTP server close timed out"));
            }, 5000);

            this.httpServer.close((error) => {
                clearTimeout(timeout);
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Get shutdown status
     */
    public isShutdownInProgress(): boolean {
        return this.isShuttingDown;
    }
}
