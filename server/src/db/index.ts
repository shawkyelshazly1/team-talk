import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { tables } from './schema';

export const db = drizzle(process.env.DATABASE_URL!, {
    // logger: true,
    schema: tables
});
