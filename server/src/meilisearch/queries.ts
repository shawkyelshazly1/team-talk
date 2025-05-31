import { meilisearch } from "../lib/meilisearch";


// search messages by query pagination
export const searchMessagesByQueryPagination = async (query: string, limit: number, offset: number) => {

    const results = await meilisearch.index("messages").search(query, {
        distinct: "conversationId",
        limit,
        offset,
    });

    return results;
};