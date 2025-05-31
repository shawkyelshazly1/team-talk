import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";


// load all agents emails
export const loadAgents = async () => {

    const agents = await db.query.user.findMany({
        where: eq(user.role, "csr"),
        columns: {
            email: true
        }
    });

    const agentsEmails = agents.map((agent: { email: string; }) => agent.email);

    return agentsEmails;
};


// load all teamleaders emails
export const loadTeamleaders = async () => {
    const teamleaders = await db.query.user.findMany({
        where: eq(user.role, "team_lead"),
        columns: {
            email: true
        }
    });

    const teamleadersEmails = teamleaders.map((teamleader: { email: string; }) => teamleader.email);

    return teamleadersEmails;
};