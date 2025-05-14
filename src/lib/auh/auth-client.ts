import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL as string,
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                }
            }
        })
    ]
});

export const { signIn, signUp, useSession, signOut } = authClient;