import { createClient } from "redis";
import { createKey } from "./utils";

export let redisClient: ReturnType<typeof createClient>;

export async function connectRedis() {
    redisClient = createClient({
        url: process.env.REDIS_URL,
        database: 2,
        password: process.env.REDIS_PASSWORD,
    });

    redisClient.connect();

    redisClient.on("error", (err) => {
        console.error("Redis error:", err);
    });

    redisClient.on("connect", async () => {
        // stablish keys
        await createKey("users:online_teamleaders", "set");
        await createKey("users:online_agents", "set");
        await createKey("conversations:in_queue", "json");
        await createKey("conversations:messages", "json");
        console.log("Redis connected");
    });
}
