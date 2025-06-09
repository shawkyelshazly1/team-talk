import { assignConversationToTeamleader } from "../services/conversation";
import { redisClient } from "../redis/connection";
import { redisCleanupService } from "../services/redisCleanupService";

interface WorkerStats {
    processed: number;
    errors: number;
    lastProcessed: Date | null;
    uptime: Date;
    currentInterval: number;
}

interface Assignment {
    conversationId: string;
    teamleaderId: string;
}

class QueueWorker {
    private isRunning: boolean = false;
    private pollInterval: number = 1000;
    private readonly maxInterval: number = 10000; // 30 seconds if idle
    private readonly minInterval: number = 100; // 100ms when busy
    private heartbeatInterval: NodeJS.Timeout | null = null; // heartbeat interval

    private stats: WorkerStats = {
        processed: 0,
        errors: 0,
        lastProcessed: null,
        uptime: new Date(),
        currentInterval: this.pollInterval,
    };

    constructor() {
        console.info("Queue worker initialized");
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            console.log("Queue worker is already running");
            return;
        }

        // cleanup stale data before starting
        await redisCleanupService.cleanupStaleData();

        this.isRunning = true;
        console.info("Queue worker started");

        // start heartbeat interval
        this.startHeartbeat();
        this.startPeriodicCleanup(); // Start periodic cleanup

        // main processing loop
        while (this.isRunning) {
            try {
                const processed = await this.processQueue();
                this.updateStats(processed);
                this.adjustInterval(processed);
                await this.sleep(this.pollInterval);
            } catch (error) {
                console.error("Queue worker error:", error);
                this.stats.errors++;
                await this.sleep(5000); // back off on errors
            }
        }
    }

    stop(): void {
        console.info("Stopping queue worker");
        this.isRunning = false;
        this.stopHeartbeat();
        this.stopPeriodicCleanup(); // Stop periodic cleanup

        // 🧹 Graceful cleanup on shutdown
        redisCleanupService.gracefulshutdown().catch(console.error);
    }

    private startHeartbeat(): void {
        // set initial heartbeat
        this.updateHeartbeat();

        // update every 30 seconds
        this.heartbeatInterval = setInterval(() => {
            this.updateHeartbeat();
        }, 5000);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        // Clear the heartbeat from Redis when stopping
        redisClient.del('worker:heartbeat').catch(console.error);
    }

    private async updateHeartbeat(): Promise<void> {
        try {
            // set heartbeat in Redis
            await redisClient.setEx('worker:heartbeat', 10, Date.now().toString());
        } catch (error) {
            console.error('Error updating heartbeat:', error);
        }
    }

    private async processQueue(): Promise<number> {
        let processedCount = 0;

        // Process up to 5 assignments per cycle to avoid blocking too long
        for (let i = 0; i < 5; i++) {
            const assignment = await this.assignNextConversation();
            if (!assignment) break;

            // assign conversation to teamleader in DB
            try {
                // assign conversation to teamleader in DB
                const success = await assignConversationToTeamleader({
                    conversationId: assignment.conversationId,
                    teamleaderId: assignment.teamleaderId,
                }, true);

                if (success) {
                    console.info(
                        `Assigned conversation ${assignment.conversationId} to team leader ${assignment.teamleaderId}`
                    );

                    processedCount++;
                } else {
                    console.error(
                        `Failed to assign conversation ${assignment.conversationId} to team leader ${assignment.teamleaderId}`
                    );

                    // Rollback Redis changes since database/socket failed
                    await this.rollbackAssignment(assignment);
                }
            } catch (error) {
                console.error(
                    `Failed to complete assignment ${assignment.conversationId}:`,
                    error
                );

                // Rollback Redis changes since database/socket failed
                await this.rollbackAssignment(assignment);
                // TODO: Add to retry queue or dead letter queue
            }
        }

        if (processedCount > 0) {
            console.info(`Processed ${processedCount} assignments this cycle`);
        }

        return processedCount;
    }

    private async assignNextConversation(): Promise<Assignment | null> {
        // Lua script for atomic assignment

        const luaScript = `
            -- Get next conversation from your queue
            local conv_id = redis.call('LPOP', 'conversations:queue')
            if not conv_id then
                return nil
            end

            -- Get all online team leaders from the hash
            local tl_data = redis.call('HGETALL','users:online_teamleaders')
            if #tl_data == 0 then
                -- no team leaders online, put conversation back in queue
                redis.call('LPUSH','conversations:queue',conv_id)
                return nil
            end

            -- Find team leader with smallest basket
            local best_tl = nil
            local max_available_slots = 0

            -- Process team leaders (tl_data comes as [key1, value1, key2, value2, ...])
            for i = 1, #tl_data, 2 do
                local tl_id = tl_data[i]
                local available_slots = tonumber(tl_data[i + 1]) or 0

                if available_slots > 0 and available_slots > max_available_slots then
                    best_tl = tl_id
                    max_available_slots = available_slots
                end
            end

            if not best_tl then
                -- No available team leader (all full), put conversation back
                redis.call('LPUSH', 'conversations:queue', conv_id)
                return nil
            end

            -- Decrease available slots by 1
            redis.call('HINCRBY', 'users:online_teamleaders', best_tl, -1)

            -- Assign conversation to team leader's basket
            redis.call('SADD', 'tl:' .. best_tl .. ':basket', conv_id)

            return { conv_id, best_tl }
        
        `;

        try {
            const result = (await redisClient.EVAL(luaScript, {
                arguments: [],
                keys: [],
            })) as [string, string] | null;

            if (result) {
                return {
                    conversationId: result[0],
                    teamleaderId: result[1],
                };
            }
            return null;
        } catch (error) {
            console.error("Error assigning conversation:", error);
            return null;
        }
    }

    // update database with conversation assignment
    private async rollbackAssignment(assignment: Assignment): Promise<void> {
        try {
            console.info(
                `Rolling back assignment for conversation ${assignment.conversationId} to queue`
            );

            // remove from basket
            await redisClient.SREM(
                `tl:${assignment.teamleaderId}:basket`,
                assignment.conversationId
            );

            // increase team leader available slots back
            await redisClient.HINCRBY(
                "users:online_teamleaders",
                assignment.teamleaderId,
                1
            );

            // put conversation back in queue
            await redisClient.LPUSH("conversations:queue", assignment.conversationId);

            console.info(
                `Rolled back assignment for conversation ${assignment.conversationId}`
            );
        } catch (rollbackError) {
            console.error(
                `Rollback failed for ${assignment.conversationId}:`,
                rollbackError
            );
        }
    }

    private adjustInterval(processed: number): void {
        if (processed > 0) {
            // busy - poll faster
            this.pollInterval = Math.max(this.minInterval, this.pollInterval / 2);
        } else {
            // idle - poll slower
            this.pollInterval = Math.min(this.maxInterval, this.pollInterval * 1.5);
        }

        this.stats.currentInterval = this.pollInterval;
    }

    private updateStats(processed: number): void {
        this.stats.processed += processed;
        if (processed > 0) {
            this.stats.lastProcessed = new Date();
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getStats(): WorkerStats {
        return { ...this.stats };
    }

    // helper to monitor queue status
    async getQueueStatus(): Promise<{
        queueLength: number;
        onlineTeamLeaders: number;
        totalBasketItems: number;
    }> {
        const queueLength = await redisClient.LLEN("conversations:queue");
        const teamLeaderIds = await redisClient.HKEYS("users:online_teamleaders");

        let totalBasketItems = 0;

        for (const tlId of teamLeaderIds) {
            const basketSize = await redisClient.SCARD(`tl:${tlId}:basket`);
            totalBasketItems += basketSize;
        }

        return {
            queueLength,
            onlineTeamLeaders: teamLeaderIds.length,
            totalBasketItems,
        };
    }

    // Periodic cleanup every 5 minutes
    private cleanupInterval: NodeJS.Timeout | null = null;

    private startPeriodicCleanup(): void {
        this.cleanupInterval = setInterval(async () => {
            try {
                await redisCleanupService.healthCheckCleanup();
            } catch (error) {
                console.error('Periodic cleanup error:', error);
            }
        }, 300000); // 5 minutes
    }

    private stopPeriodicCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

export { QueueWorker };
