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
}


