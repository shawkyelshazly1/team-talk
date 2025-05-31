import { Request, Response } from "express";
import { filtersRepo } from "../repos";

// get all agents emails
export const getAgents = async (req: Request, res: Response) => {


    // load all agents emails from DB
    try {


        const agents = await filtersRepo.loadAgents();

        res.status(200).json(agents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 
// get all teamleaders emails
export const getTeamleaders = async (req: Request, res: Response) => {

    // load all teamleaders emails from DB
    try {

        const teamleaders = await filtersRepo.loadTeamleaders();

        res.status(200).json(teamleaders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};