import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db"; // your drizzle instance
import { user, session, account, verification } from '../../db/schema';
import type { User, Session, Account, Verification } from '../../db/schema';
import { tables } from '../../db/schema';
import { userRoles } from "../../db/schema/auth/user";
import { createAuthMiddleware } from "better-auth/api";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: tables
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                enum: userRoles
            }
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    trustedOrigins: [process.env.FRONTEND_URL as string],
}); 
