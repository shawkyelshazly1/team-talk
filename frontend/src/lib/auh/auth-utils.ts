'use server';

import { cache } from "react";
import { authClient } from "./auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Get the current user
export const geCurrentSession = cache(async () => {
    try {
        const response = await authClient.getSession({
            fetchOptions: {
                headers: await headers(),
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
});

// Require the user to be authenticated
export async function requireAuth(redirectTo: string = "/") {
    const currentSession = await geCurrentSession();

    if (!currentSession || !currentSession.user || !currentSession.session) {
        redirect(redirectTo);
    }

    return currentSession;
}

// Require the user to be unauthenticated
export async function requireNoAuth(redirectTo: string = "/app") {
    const currentSession = await geCurrentSession();

    if (currentSession && currentSession.user && currentSession.session) {
        redirect(redirectTo);
    }
}

// Get the current user
export async function getUser() {
    const currentSession = await geCurrentSession();

    if (!currentSession || !currentSession.user || !currentSession.session) {
        return null;
    }

    return currentSession.user;
}