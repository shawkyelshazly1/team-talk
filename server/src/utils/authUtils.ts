import { fromNodeHeaders } from "better-auth/node";
import { Request, Response } from "express";
import { auth } from "../lib/auth/auth";

export const getUser = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as any)
    });

    if (!session?.user) {
        throw new Error("User not found");
    }



    return session?.user;
};