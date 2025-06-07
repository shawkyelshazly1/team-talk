import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { conversation } from "./conversation";
import { user } from "../auth/user";
import { relations } from "drizzle-orm";

export const teamleadersOnConversations = pgTable("conversation_participants", {
    conversationId: text("conversation_id").notNull().references(() => conversation.id, { onDelete: "cascade" }),
    teamleaderId: text("teamleader_id").notNull().references(() => user.id)
}, (t) => [
    primaryKey({ columns: [t.conversationId, t.teamleaderId] })
]);


export const teamleadersOnConversationsRelations = relations(teamleadersOnConversations, ({ one }) => ({
    conversation: one(conversation, {
        fields: [teamleadersOnConversations.conversationId],
        references: [conversation.id],
        relationName: "conversationParticipants"
    }),
    teamleader: one(user, {
        fields: [teamleadersOnConversations.teamleaderId],
        references: [user.id],
        relationName: "teamleadersConversations"
    })
}));
