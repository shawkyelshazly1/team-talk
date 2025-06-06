import { Request, Response } from "express";
import { getUser } from "../utils/authUtils";
import { conversationRepo } from "../repos";

import { Agent } from "../lib/types";
import { conversationServices } from "../services";

// create conversation by csr
export const createConversation = async (req: Request, res: Response) => {

    const user = await getUser(req);

    const { ticketLink, message } = req.body;

    if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
    }

    try {
        const conversation = await conversationServices.createNewConversation(user as Agent, ticketLink, message);

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

};


// set conversation status

export const setConversationStatus = async (req: Request, res: Response) => {
    const user = await getUser(req);

    const { conversationId, status, topic } = req.body;

    if (!conversationId || !status) {
        res.status(400).json({ message: "Conversation ID and status are required" });
        return;
    }

    if (user.role !== "teamleader") {
        res.status(403).json({ message: "You are not authorized to change conversation status" });
        return;
    }

    try {

        const conversation = await conversationServices.changeConversationStatus(conversationId, status, topic, user as Agent);

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }


};