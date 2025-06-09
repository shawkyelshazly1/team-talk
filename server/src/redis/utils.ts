import { redisClient } from "./connection";


export const createKey = async (key: string, type: "json" | 'list' | 'set' | 'hash' | 'sortedSet') => {
    await redisClient.exists(key).then(res => {
        if (res === 0) {
            switch (type) {
                case "json":
                    redisClient.json.set(key, "$", {});
                    break;
                case "list":
                    redisClient.lPush(key, "");
                    break;
                case "set":
                    redisClient.sAdd(key, "");
                    break;
                case "hash":
                    redisClient.hSet(key, "", "");
                    break;
                case "sortedSet":
                    redisClient.zAdd(key, {
                        score: 0,
                        value: "",
                    });
                    break;
            }
        }
    });
};

const setTeamleaderOnline = async (teamleaderId: string): Promise<void> => {
    const MAX_BASKET_SIZE = 4;
    // check current basket size
    const currentBasket = await redisClient.SMEMBERS(`tl:${teamleaderId}:basket`);
    const availableSlots = MAX_BASKET_SIZE - currentBasket.length;

    await redisClient.HSET("users:online_teamleaders", teamleaderId, availableSlots);
    // add 10-minute TTL for auto-cleanup
    await redisClient.EXPIRE(`users:online_teamleaders`, 600);
};

const setTeamleaderOffline = async (teamleaderId: string): Promise<void> => {
    await redisClient.HDEL("users:online_teamleaders", teamleaderId);
};

const getConversationFromQueue = async (): Promise<string | null> => {
    const conversationId = await redisClient.RPOP("conversations:queue");
    if (!conversationId) return null;

    return conversationId;
};

const getOnlineTeamleaders = async (): Promise<Record<string, string>> => {
    const onlineTeamleaders = await redisClient.HGETALL("users:online_teamleaders");
    return onlineTeamleaders;
};

const assignConversationToTeamleader = async (conversationId: string, teamleaderId: string): Promise<void> => {
    await redisClient.SADD(`tl:${teamleaderId}:basket`, conversationId);
    await redisClient.HINCRBY("users:online_teamleaders", teamleaderId, -1);

    // set basket TTL ( 2 HOURS )
    await redisClient.EXPIRE(`tl:${teamleaderId}:basket`, 7200);
};

const refreshTeamleaderTTL = async (teamleaderId: string): Promise<void> => {
    // refresh if team leadedr is online and active
    const exists = await redisClient.HEXISTS("users:online_teamleaders", teamleaderId);
    if (exists) {
        await redisClient.EXPIRE(`users:online_teamleaders`, 600);

        const basketExists = await redisClient.EXISTS(`tl:${teamleaderId}:basket`);
        if (basketExists) {
            await redisClient.EXPIRE(`tl:${teamleaderId}:basket`, 7200);
        }
    }
};

const addConversationToQueue = async (conversationId: string): Promise<void> => {
    await redisClient.LPUSH("conversations:queue", conversationId);
};

const setAgentOnline = async (agentId: string): Promise<void> => {
    await redisClient.SADD("users:online_agents", agentId);
};

const setAgentOffline = async (agentId: string): Promise<void> => {
    await redisClient.SREM("users:online_agents", agentId);
};

const getOnlineAgents = async (): Promise<string[]> => {
    const onlineAgents = await redisClient.SMEMBERS("users:online_agents");
    return onlineAgents;
};

const getTeamleaderBasket = async (teamleaderId: string): Promise<string[]> => {
    const basket = await redisClient.SMEMBERS(`tl:${teamleaderId}:basket`);
    return basket;
};

const clearTeamleaderBasket = async (teamleaderId: string): Promise<void> => {
    await redisClient.DEL(`tl:${teamleaderId}:basket`);
};

const removeConversationFromBasket = async (conversationId: string, teamleaderId: string): Promise<void> => {
    await redisClient.SREM(`tl:${teamleaderId}:basket`, conversationId);
};

const getAgentStatus = async (agentId: string): Promise<"online" | "offline"> => {
    const isOnline = await redisClient.SISMEMBER("users:online_agents", agentId);
    return isOnline ? "online" : "offline";
};

const getTeamleaderStatus = async (teamleaderId: string): Promise<"online" | "offline"> => {
    const isOnline = await redisClient.HGET("users:online_teamleaders", teamleaderId);
    return isOnline === "1" ? "online" : "offline";
};

// When conversation is completed (increase available slots)
const conversationCompleted = async (conversationId: string, teamLeaderId: string): Promise<void> => {
    // Remove from basket
    await redisClient.SREM(`tl:${teamLeaderId}:basket`, conversationId);

    // Increase available slots by 1
    await redisClient.HINCRBY('users:online_teamleaders', teamLeaderId, 1);
};


export {
    setTeamleaderOnline,
    setTeamleaderOffline,
    getConversationFromQueue, getOnlineTeamleaders, assignConversationToTeamleader, addConversationToQueue, setAgentOnline, setAgentOffline, getOnlineAgents, getTeamleaderBasket, clearTeamleaderBasket, removeConversationFromBasket, getAgentStatus, getTeamleaderStatus, conversationCompleted, refreshTeamleaderTTL
};


