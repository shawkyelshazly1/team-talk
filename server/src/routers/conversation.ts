import { Router } from "express";
import { ensureAgent, ensureAuth, ensureTeamleader } from "../middlewares/auth";
import { conversationsGetHandlers, conversationsPostHandlers } from "../handlers";



const conversationRouter = Router();

/*

** GET /conversations

*/


// get csr  conversations by status
conversationRouter.get("/csr", ensureAgent, conversationsGetHandlers.getCsrConversations);// used

// get tls assigned conversations by status
conversationRouter.get("/team_lead", ensureTeamleader, conversationsGetHandlers.getTlsAssignedConversations); // used

// search conversations by query & filters
conversationRouter.get("/search", ensureAuth, conversationsGetHandlers.getConversationsBySearchQuery); // used

// get conversations with search query
conversationRouter.get("/load/all", ensureTeamleader, conversationsGetHandlers.getHistoricalConversations); // used

// get conversation by id
conversationRouter.get("/load/conversation/:id", ensureAuth, conversationsGetHandlers.getConversationById);

// get conversation messages by conversation id
conversationRouter.get("/load/conversation/:id/messages", ensureAuth, conversationsGetHandlers.getConversationMessages);


/*

** POST /conversations

*/


// create conversation by csr
conversationRouter.post("/create", ensureAgent, conversationsPostHandlers.createConversation);

// set conversation status
conversationRouter.post("/update/status", ensureTeamleader, conversationsPostHandlers.setConversationStatus);



export default conversationRouter;