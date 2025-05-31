import { Router } from "express";
import { ensureAgent, ensureAuth, ensureTeamleader } from "../middlewares/auth";
import { filtersHandlers } from "../handlers";



const filtersRouter = Router();



// get all agents emails
filtersRouter.get("/agents", ensureAuth, filtersHandlers.getAgents);

// get all teamleaders emails
filtersRouter.get("/teamleaders", ensureAuth, filtersHandlers.getTeamleaders);

export default filtersRouter;