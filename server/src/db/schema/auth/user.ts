import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { conversation } from "../app/conversation";
import { message } from "../app/message";
import { teamleadersOnConversations } from "../app/teamleadersToConversations";

export const userRoles = pgEnum("user_role", ["csr", "team_lead", "admin"]);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: userRoles().default("csr"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    uniqueIndex("email_id").on(table.email)
]);

export const userRelations = relations(user, ({ many }) => ({
    conversations: many(conversation, { relationName: "CSRConversations" }),
    messages: many(message),
    teamleadersConversations: many(teamleadersOnConversations, { relationName: "teamleadersConversations" }),
    assignedConversations: many(conversation, { relationName: "assignedTLConversations" }),
}));
