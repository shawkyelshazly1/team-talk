import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";
import { relations } from "drizzle-orm";
import { message } from "./message";
import { teamleadersOnConversations } from "./teamleadersToConversations";

export const statusEnum = pgEnum("status", ["pending", "active", "closed", "solved"]);

export const conversation = pgTable("conversation", {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
    status: statusEnum("status").notNull().default("active"),
    topic: text("topic"),
    agentId: text("agent_id").references(() => user.id),
    assigneeId: text("assignee_id").references(() => user.id),
    ticketLink: text("ticket_link"),
});

export const conversationRelations = relations(conversation, ({ one, many }) => ({
    agent: one(user, {
        fields: [conversation.agentId],
        references: [user.id],
        relationName: "CSRConversations",
    }),
    messages: many(message),
    assignee: one(user, {
        fields: [conversation.assigneeId],
        references: [user.id],
        relationName: "assignedTLConversations",
    }),
    teamLeaders: many(teamleadersOnConversations, { relationName: "conversationParticipants" }),
}));
