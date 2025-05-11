import { user } from './auth/user';
import { session } from './auth/session';
import { account } from './auth/account';
import { verification } from './auth/verification';

// Export all tables
export const tables = {
    user,
    session,
    account,
    verification,
} as const;

// Export individual tables
export { user, session, account, verification };

// Export types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert; 