import { Request, Response } from "express";
import { getUser } from "../utils/authUtils";
import { conversationRepo } from "../repos";

import { Agent } from "../lib/types";

// create conversation by csr
export const createConversation = async (req: Request, res: Response) => {

    const user = await getUser(req);

    const { ticketLink, message } = req.body;

    if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
    }

    try {
        const conversation = await conversationRepo.createConversation(user as Agent, ticketLink, message);

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

    try {
        const conversation = await conversationRepo.setConversationStatus(conversationId, status, topic);

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }


};