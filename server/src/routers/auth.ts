
import { Router } from "express";
import { auth } from "../lib/auth/auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

const authRouter = Router();

// All routes are handled by better-auth 
authRouter.all('/api/auth/{*any}', toNodeHandler(auth));

// Get session endpoint
authRouter.get('/', async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });
    res.json(session);
});

export default authRouter;