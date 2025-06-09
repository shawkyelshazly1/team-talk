import { redisClient } from "../redis/connection";

export class RedisCleanupService {
    /**
     * Graceful shutdown cleanup - called when worker/server stops
     */

    async gracefulshutdown(): Promise<void> {
        console.info("Starting graceful shutdown Rediscleanup...");

        try {
            // clear heartbeat
            await redisClient.del("worker:heartbeat");

            // clear active assignments
            await this.returnAllAssignmentsToQueue();

            console.info("Graceful shutdown Rediscleanup completed");
        } catch (error) {
            console.error("Error during graceful shutdown Rediscleanup:", error);
            throw error;
        }
    }

    /**
     * Return all active assignments to the queue on graceful shutdown
     */
    private async returnAllAssignmentsToQueue(): Promise<void> {
        const teamLeaderIds = await redisClient.hKeys("users:online_teamleaders");

        // going through each teamleader basket and return all assignments to the queue
        for (const tlId of teamLeaderIds) {
            const basketItems = await redisClient.sMembers(`tl:${tlId}:basket`);

            if (basketItems.length > 0) {
                // return to queue
                await redisClient.lPush("conversations:queue", basketItems);

                // clear basket
                await redisClient.del(`tl:${tlId}:basket`);

                console.info(
                    `Returned ${basketItems.length} assignments to queue for teamleader ${tlId}`
                );
            }
        }

        // clear all team leaders
        await redisClient.del("users:online_teamleaders");
    }

    /**
     * Stale data cleanup - remove expired/orphaned data
     */
    async cleanupStaleData(): Promise<void> {
        console.info("Starting stale data cleanup...");

        // clean stale heartbeats (more than 10 seconds old)
        await this.cleanupStaleHeartbeats();

        // Clean orphaned baskets (team leaders not online)
        await this.cleanupOrphanedBaskets();

        // clean empty keys
        await this.cleanupEmptyKeys();
    }

    private async cleanupStaleHeartbeats(): Promise<void> {
        const heartbeat = await redisClient.get("worker:heartbeat");

        if (heartbeat) {
            const age = Date.now() - parseInt(heartbeat);
            if (age > 10000) {
                await redisClient.del("worker:heartbeat");
                console.info("Cleaned stale heartbeat");
            }
        }
    }

    private async cleanupOrphanedBaskets(): Promise<void> {
        // get all basket keys
        const basketKeys = await redisClient.keys("tl:*:basket");
        const onlineTeamleaders = await redisClient.hKeys(
            "users:online_teamleaders"
        );
        const onlineSet = new Set(onlineTeamleaders);

        for (const basketKey of basketKeys) {
            const tlId = basketKey.split(":")[1];

            if (!onlineSet.has(tlId)) {
                // Orphaned basket - return to queue
                const basketItems = await redisClient.sMembers(basketKey);

                if (basketItems.length > 0) {
                    await redisClient.lPush("conversations:queue", basketItems);
                    console.info(
                        `Returned ${basketItems.length} assignments to queue for teamleader ${tlId}`
                    );
                }

                // delete basket
                await redisClient.del(basketKey);
            }
        }
    }

    private async cleanupEmptyKeys(): Promise<void> {
        const emptyBaskets = await redisClient.keys("tl:*:basket");

        for (const key of emptyBaskets) {
            const size = await redisClient.sCard(key);
            if (size === 0) {
                await redisClient.del(key);
            }
        }
    }

    /**
     * Health check cleanup - fix inconsistencies
     */
    async healthCheckCleanup(): Promise<void> {
        console.info("Starting health check cleanup...");

        // Sync team leader slots with actual basket sizes
        await this.syncTeamLeaderSlots();

        // Remove duplicate queue entries;
        await this.deduplicateQueue();
    }

    private async syncTeamLeaderSlots(): Promise<void> {
        const MAX_BASKET_SIZE = 4;
        const teamLeaders = await redisClient.hGetAll("users:online_teamleaders");

        for (const [tlId, reportedSlots] of Object.entries(teamLeaders)) {
            const actualBasketSize = await redisClient.sCard(`tl:${tlId}:basket`);
            const actualSlots = MAX_BASKET_SIZE - actualBasketSize;

            if (parseInt(reportedSlots) !== actualSlots) {
                await redisClient.hSet(
                    "users:online_teamleaders",
                    tlId,
                    actualSlots
                );
                console.info(
                    `Fixed slots for ${tlId}: ${reportedSlots} → ${actualSlots}`
                );
            }
        }
    }

    private async deduplicateQueue(): Promise<void> {
        const queueItems = await redisClient.lRange("conversations:queue", 0, -1);
        const uniqueItems = [...new Set(queueItems)];

        if (uniqueItems.length !== queueItems.length) {
            await redisClient.del("conversations:queue");
            if (uniqueItems.length > 0) {
                await redisClient.lPush("conversations:queue", uniqueItems);
            }
            console.info(
                `Deduplicated queue: ${queueItems.length} → ${uniqueItems.length}`
            );
        }
    }

    /**
     * Nuclear cleanup - clear everything (development only)
     */

    async nuclearCleanup(): Promise<void> {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Nuclear cleanup not allowed in production!");
        }

        console.warn("NUCLEAR CLEANUP - Clearing all data!");

        const patterns = [
            "conversations:queue",
            "users:online_teamleaders",
            "users:online_agents",
            "tl:*:basket",
            "worker:heartbeat",
        ];

        for (const pattern of patterns) {
            if (pattern.includes("*")) {
                const keys = await redisClient.keys(pattern);
                if (keys.length > 0) {
                    await redisClient.del(keys);
                }
            } else {
                await redisClient.del(pattern);
            }
        }

        console.warn("Nuclear cleanup completed!");
    }
}

export const redisCleanupService = new RedisCleanupService();
