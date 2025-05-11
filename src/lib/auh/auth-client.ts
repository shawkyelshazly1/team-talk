import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL as string,
});

export const { signIn, signUp, useSession, signOut } = authClient;