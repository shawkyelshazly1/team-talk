import { user, userRelations, userRoles } from './auth/user';
import { session } from './auth/session';
import { account } from './auth/account';
import { verification } from './auth/verification';
import { conversation, conversationRelations, statusEnum } from './app/conversation';
import { message, messageRelations } from './app/message';
import { teamleadersOnConversations, teamleadersOnConversationsRelations } from './app/teamleadersToConversations';

// Export all tables
export const tables = {
    user,
    session,
    account,
    verification,
    conversation,
    message,
    teamleadersOnConversations,
    statusEnum,
    userRoles,
    conversationRelations,
    messageRelations,
    teamleadersOnConversationsRelations,
    userRelations,
} as const;

// Export individual tables
export { user, session, account, verification, conversation, message, teamleadersOnConversations, statusEnum, userRoles, conversationRelations, messageRelations, teamleadersOnConversationsRelations, userRelations };

// Export types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type Conversation = typeof conversation.$inferSelect;
export type NewConversation = typeof conversation.$inferInsert;
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
export type TeamleadersOnConversations = typeof teamleadersOnConversations.$inferSelect;
export type NewTeamleadersOnConversations = typeof teamleadersOnConversations.$inferInsert;


