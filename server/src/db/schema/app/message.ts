
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { conversation } from "./conversation";
import { user } from "../auth/user";
import { relations } from "drizzle-orm";


export const message = pgTable("message", {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
    isRead: boolean("is_read").notNull().default(false),
    conversationId: text("conversation_id").references(() => conversation.id, { onDelete: "cascade" }).notNull(),
    senderId: text("sender_id").references(() => user.id),
});

export const messageRelations = relations(message, ({ one }) => ({
    conversation: one(conversation, {
        fields: [message.conversationId],
        references: [conversation.id],

    }),
    sender: one(user, {
        fields: [message.senderId],
        references: [user.id],
    }),
}));
