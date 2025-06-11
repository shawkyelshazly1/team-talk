import { Request, Response } from "express";
import { getUser } from "../utils/authUtils";
import { statusEnum } from "../db/schema/app/conversation";
import { conversationRepo } from "../repos";

// get csr conversations by status
export const getCsrConversations = async (req: Request, res: Response) => {
    const { status, take, skip } = req.query;

    // validate status type and value
    if (!status || typeof status !== "string") {
        res.status(400).json({ message: "Status is required" });
        return;
    } else {
        if (!statusEnum.enumValues.includes(status as typeof statusEnum.enumValues[number])) {
            res.status(400).json({ message: "Invalid status" });
            return;
        }
    }

    // load csr conversations from DB by status
    try {
        const user = await getUser(req);

        const conversations = await conversationRepo.loadCsrConversations(user?.id ?? "", status as typeof statusEnum.enumValues[number], Number(take) as number, Number(skip) as number);

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get tls assigned conversations by status
export const getTlsAssignedConversations = async (req: Request, res: Response) => {
    const { status, take, skip } = req.query;

    const user = await getUser(req);


    // validate status type and value
    if (!status || typeof status !== "string") {
        res.status(400).json({ message: "Status is required" });
        return;
    } else {
        if (!statusEnum.enumValues.includes(status as typeof statusEnum.enumValues[number])) {
            res.status(400).json({ message: "Invalid status" });
            return;
        }
    }

    // load tls assignedconversations from DB by status along with teamleaders and last message
    try {

        const conversations = await conversationRepo.loadTlsAssignedConversations(status as typeof statusEnum.enumValues[number], Number(take) as number, Number(skip) as number, user?.id ?? "");

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get conversations by search query
export const getConversationsBySearchQuery = async (req: Request, res: Response) => {
    const { query, agents, teamLeaders, limit, offset } = req.query;

    // validate search type and value
    if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    // validate other filters
    if (agents && typeof agents !== "string") {
        res.status(400).json({ message: "Agents must be a string" });
        return;
    }
    if (teamLeaders && typeof teamLeaders !== "string") {
        res.status(400).json({ message: "Team leaders must be a string" });
        return;
    }

    // search conversations by search query
    try {

        const conversations = await conversationRepo.searchConversations(query as string, agents as string, teamLeaders as string, Number(limit) as number, Number(offset) as number);

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get conversation by id
export const getConversationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const conversation = await conversationRepo.loadConversationById(id as string);

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get conversation messages by conversation id
export const getConversationMessages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { take, skip, targetedMessageId } = req.query;

    try {
        const messages = await conversationRepo.loadConversationMessages(id as string, Number(take) as number, Number(skip) as number, targetedMessageId as string);

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// load conversations for "TLs view"
export const getHistoricalConversations = async (req: Request, res: Response) => {
    const { agents, teamLeaders, take, skip } = req.query;
    // validate other filters
    if (agents && typeof agents !== "string") {
        res.status(400).json({ message: "Agents must be a string" });
        return;
    }
    if (teamLeaders && typeof teamLeaders !== "string") {
        res.status(400).json({ message: "Team leaders must be a string" });
        return;
    }


    try {
        const conversations = await conversationRepo.loadHistoricalConversations(agents as string, teamLeaders as string, Number(take) as number, Number(skip) as number);

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


