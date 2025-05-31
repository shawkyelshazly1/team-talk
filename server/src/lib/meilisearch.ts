import { MeiliSearch } from 'meilisearch';

export const meilisearch = new MeiliSearch({
    host: process.env.MEILI_HOST || 'http://127.0.0.1:7701',
    apiKey: process.env.MEILI_ADMIN_API_KEY, // Optional if public instance
});
