import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import { userRoles } from "../lib/constants";



export const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as any)
    });
    if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
};

export const ensureAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as any)
    });
    if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    if (session?.user.role !== userRoles.admin) {
        res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};

export const ensureTeamleader = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as any)
    });
    if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    if (session?.user.role !== userRoles.team_leader) {
        res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};

export const ensureAgent = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as any)
    });
    if (!session) {
        res.status(401).json({ message: 'Unauthorized' });

    }

    if (session?.user.role !== userRoles.csr) {
        res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};
