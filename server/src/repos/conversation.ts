import { and, desc, eq, inArray, not, sql } from "drizzle-orm";
import { db } from "../db";
import { v4 as uuidv4 } from 'uuid';
import {
    conversation,
    message,
    statusEnum,
    teamleadersOnConversations,
    user
} from "../db/schema";
import {
    Agent,
    ConversationSearchResults,
    Message,
    TeamLeader,
    User,
    Conversation,
} from "@shared/types";

import { meilisearchQueries } from "../meilisearch";

// load csr conversations from DB by
export const loadCsrConversations = async (
    userId: string,
    status: (typeof statusEnum.enumValues)[number],
    take: number,
    skip: number
) => {
    try {
        const results = await db.query.conversation.findMany({
            where: and(
                eq(conversation.status, status),
                eq(conversation.agentId, userId)
            ),
            with: {
                agent: {
                    columns: {
                        id: true,
                        email: true,
                        image: true,
                        name: true,
                        role: true,
                    },
                },
                messages: {
                    orderBy: [desc(message.createdAt)],
                    limit: 1,
                    columns: {
                        id: true,
                        content: true,
                        createdAt: true,
                        isRead: true,
                        conversationId: true,
                    },
                    with: {
                        sender: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                role: true,
                            }
                        }
                    }
                }
            },
            columns: {
                createdAt: true,
                id: true,
                status: true,
                topic: true,
                updatedAt: true,
            },
            orderBy: [desc(conversation.updatedAt)],
            limit: take,
            offset: skip,
        });

        // get total count of conversations
        const [documents]: { count: number; }[] = await db.select({
            count: sql<number>`COUNT(*)`
        }).from(conversation).where(and(eq(conversation.agentId, userId), eq(conversation.status, status)));

        // load unread messages count
        const unreadMessagesCount = await db.query.message.findMany({
            where: and(
                eq(message.isRead, false),
                not(eq(message.senderId, userId)),
                inArray(message.conversationId, results.map((conv) => conv.id))
            ),
        });

        // group unread messages by conversation id
        const unreadMessagesCountByConversationId = unreadMessagesCount.reduce((acc, msg) => {
            acc[msg.conversationId ?? ""] = (acc[msg.conversationId ?? ""] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const conversations = results.map((conv) => {
            const { messages, ...rest } = conv;
            return {
                ...rest,
                unreadMessagesCount: unreadMessagesCountByConversationId[conv.id] ?? 0,
                agent: conv.agent as Agent,
                topic: conv.topic ?? "",
                lastMessage: {
                    id: conv.messages[0]?.id ?? "",
                    content: conv.messages[0]?.content ?? "",
                    createdAt: conv.messages[0]?.createdAt ?? "",
                    conversationId: conv.messages[0]?.conversationId ?? "",
                    isRead: conv.messages[0]?.isRead ?? false,
                    sender: conv.messages[0]?.sender as User,
                } satisfies Message,
            } satisfies Conversation;
        });

        return {
            conversations,
            total: documents.count ?? 0,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// load tl conversations from DB by status along with teamleaders and last message
export const loadTlsAssignedConversations = async (
    status: (typeof statusEnum.enumValues)[number],
    take: number,
    skip: number,
    userId: string
) => {

    try {
        const results = await db.query.conversation.findMany({
            where: and(eq(conversation.assigneeId, userId), eq(conversation.status, status)),
            with: {
                messages: {
                    orderBy: [desc(message.createdAt)],
                    limit: 1,
                    columns: {
                        id: true,
                        content: true,
                        conversationId: true,
                        createdAt: true,
                        isRead: true,
                        senderId: true,
                    },
                    with: {
                        sender: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                role: true,
                            }
                        }
                    }
                },
                agent: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    }
                },
                assignee: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    }
                }
            },
            columns: {
                createdAt: true,
                id: true,
                status: true,
                updatedAt: true,
                assigneeId: true,
                agentId: true,
            },

            limit: take,
            offset: skip,
            orderBy: [desc(conversation.updatedAt)],
        });

        // get total count of conversations
        const [documents]: { count: number; }[] = await db.select({
            count: sql<number>`COUNT(*)`
        }).from(conversation).where(and(eq(conversation.assigneeId, userId), eq(conversation.status, status)));



        const conversations = results.map((result) => {
            const { messages, ...rest } = result;
            return {
                ...rest,
                lastMessage: messages[0] as Message,
                agent: result.agent as Agent,
                assignee: result.assignee as TeamLeader,

            };
        }) satisfies Omit<Conversation, "topic" | "ticketLink">[];


        return {
            conversations,
            total: documents.count ?? 0,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// search conversations by search query
export const searchConversations = async (
    query: string,
    agents: string,
    teamLeaders: string,
    limit: number,
    offset: number
) => {
    try {
        // search results from meilisearch
        const results = await meilisearchQueries.searchMessagesByQueryPagination(query, limit, offset);



        // extract IDs
        const messageIds = results.hits.map((msg) => msg.id);
        const conversationIds = results.hits.map((msg) => msg.conversationId);

        // split agents & teamleaders emails by comma
        const filteredAgents = (agents || "").split(",") || [];
        const filteredTeamLeaders = (teamLeaders || "").split(",") || [];

        // get agents & teamleaders Ids from DB
        const filteredAgentsIds = (
            await db.query.user.findMany({
                where: inArray(user.email, filteredAgents),
                columns: {
                    id: true,
                },
            })
        ).map((agent: { id: string; }) => agent.id);

        const filteredTeamLeadersIds = (
            await db.query.user.findMany({
                where: inArray(user.email, filteredTeamLeaders),
                columns: {
                    id: true,
                },
            })
        ).map((teamLeader: { id: string; }) => teamLeader.id);

        // get messages from DB
        const messages = await db.query.message.findMany({
            where: inArray(message.id, messageIds),
            columns: {
                content: true,
                createdAt: true,
                id: true,
                conversationId: true,
                senderId: true,
            },
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });

        // construct where filter for conversations
        const whereFilter = and(
            inArray(conversation.id, conversationIds),
            filteredAgentsIds.length > 0
                ? inArray(conversation.agentId, filteredAgentsIds)
                : undefined
        );

        // get conversations and agents from DB
        let conversations = await db.query.conversation.findMany({
            where: whereFilter,
            columns: {
                createdAt: true,
                id: true,
                agentId: true,
                updatedAt: true,
            },
            with: {
                agent: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                teamLeaders: {
                    columns: {
                        teamleaderId: true,
                    },
                },
            },
        });

        // filter conversations by teamleaders

        if (filteredTeamLeadersIds.length > 0) {
            conversations = conversations.filter((conv) =>
                conv.teamLeaders.some((tl) =>
                    filteredTeamLeadersIds.includes(tl.teamleaderId)
                )
            );
        }

        const serchResults = conversations.map((conv) => {
            const lastMessage = messages.find((msg) => msg.conversationId === conv.id);

            return {
                id: conv?.id ?? "",
                createdAt: conv?.createdAt ?? "",
                updatedAt: conv?.updatedAt ?? "",
                agent: conv?.agent as unknown as Agent,
                message: {
                    id: lastMessage?.id ?? "",
                    content: lastMessage?.content ?? "",
                    createdAt: lastMessage?.createdAt ?? "",
                    conversationId: lastMessage?.conversationId ?? "",
                    sender: lastMessage?.sender as unknown as User,
                } satisfies ConversationSearchResults["message"],
            } satisfies ConversationSearchResults;


        });

        return {
            searchResults: serchResults,
            total: results.estimatedTotalHits,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// load conversation by id
export const loadConversationById = async (id: string) => {
    try {
        const conv = await db.query.conversation.findFirst({
            where: eq(conversation?.id, id),
            with: {
                agent: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                assignee: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                }
            },
            columns: {
                createdAt: true,
                id: true,
                status: true,
                topic: true,
                updatedAt: true,
                ticketLink: true,
            },
        });

        if (!conv) {
            return null;
        }

        return {
            ...conv,
            agent: conv.agent as Agent,
            topic: conv.topic ?? "",
            assignee: conv.assignee as TeamLeader,
        } satisfies Conversation;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// load conversation messages by conversation id
export const loadConversationMessages = async (id: string, take: number, skip: number) => {
    try {
        const messages = await db.query.message.findMany({
            where: eq(message.conversationId, id),
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
            columns: {
                content: true,
                createdAt: true,
                id: true,
                conversationId: true,
                isRead: true,
                updatedAt: true,
            },
            orderBy: [desc(message.createdAt)],
            limit: take,
            offset: skip,

        });

        // get total count of messages
        const [documents]: { count: number; }[] = await db.select({
            count: sql<number>`COUNT(*)`
        }).from(message).where(eq(message.conversationId, id));

        if (messages.length === 0) {
            return {
                messages: [],
                total: 0,
            };
        }

        return {
            messages: messages.map((msg) => ({
                ...msg,
                sender: msg.sender as User,
                conversationId: msg.conversationId ?? "",
            })),
            total: documents.count ?? 0,
        } satisfies { messages: Message[], total: number; };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// load conversations for "TLs view"
export const loadHistoricalConversations = async (
    agents: string,
    teamLeaders: string,
    take: number,
    skip: number
) => {
    try {
        // split agents & teamleaders emails by comma
        const agentsEmails = (agents || "").split(",") || [];
        const teamleadersEmails = (teamLeaders || "").split(",") || [];

        // get agent & teamleader ids from DB
        const agentIds = (await db.query.user.findMany({
            where: inArray(user.email, agentsEmails),
            columns: {
                id: true,
            },
        })).map((agent: { id: string; }) => agent.id);

        const teamleaderIds = (await db.query.user.findMany({
            where: inArray(user.email, teamleadersEmails),
            columns: {
                id: true,
            },
        })).map((teamleader: { id: string; }) => teamleader.id);



        // get conversations from DB
        const results = await db.query.conversation.findMany({
            where: and(agentIds.length > 0 ? inArray(conversation.agentId, agentIds) : undefined,
                teamleaderIds.length > 0 ? sql`
            EXISTS (
                SELECT 1 FROM ${teamleadersOnConversations} AS tloc
                WHERE tloc.conversation_id = conversation.id
                AND tloc.teamleader_id IN (${sql.join(teamleaderIds, sql`, `)})
            )
            ` : undefined
            ),
            with: {
                agent: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                assignee: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                teamLeaders: {
                    columns: {
                        teamleaderId: true,
                    },
                    with: {
                        teamleader: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                role: true,
                            },
                        },
                    },
                },
            },
            limit: take,
            offset: skip,
        });

        // get total count of conversations
        const [documents]: { count: number; }[] = await db.select({
            count: sql<number>`COUNT(*)`
        }).from(conversation).where(and(agentIds.length > 0 ? inArray(conversation.agentId, agentIds) : undefined,
            teamleaderIds.length > 0 ? sql`
        EXISTS (
            SELECT 1 FROM ${teamleadersOnConversations} AS tloc
            WHERE tloc.conversation_id = conversation.id
            AND tloc.teamleader_id IN (${sql.join(teamleaderIds, sql`, `)})
        )
        ` : undefined
        ));



        const conversations = results.map(result => {
            const { agent, assignee, teamLeaders, agentId, assigneeId, ...conversation } = result;
            return {
                ...conversation,
                agent: agent as Agent,
                assignee: assignee as User,
                teamLeaders: teamLeaders.map((tl) => tl.teamleader as TeamLeader),
            };
        });


        return {
            conversations,
            total: documents.count ?? 0,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }


};


// create conversation by csr
export const createConversation = async (user: Agent, ticketLink: string, messageContent: string) => {
    try {
        // create new conversation
        const newConversation = await db.insert(conversation).values({
            agentId: user.id,
            ticketLink,
            id: uuidv4(),
        }).returning();

        //create new message
        const newMessage = await db.insert(message).values({
            id: uuidv4(),
            conversationId: newConversation[0].id,
            content: messageContent,
            senderId: user.id,
        }).returning();

        return {
            ...newConversation[0],
            agent: {
                ...user,
                role: "csr",
            },
            lastMessage: {
                ...newMessage[0],
                conversationId: newConversation[0].id,
                sender: {
                    ...user,
                    role: "csr",
                } satisfies Agent,
            },

        } satisfies Conversation;

    } catch (error) {
        console.error(error);
        throw new Error("Failed to create conversation");
    }
};

// set conversation status
export const setConversationStatus = async (conversationId: string, status: (typeof statusEnum.enumValues)[number], topic: string, user: Agent) => {
    try {
        const updatedConversation = await db.update(conversation).set({ status, topic }).where(and(eq(conversation.id, conversationId), not(eq(conversation.status, "closed")), eq(conversation.assigneeId, user.id))).returning();



        if (updatedConversation.length === 0) {
            throw new Error("Conversation not found, already closed, or you don't have permission to update it");
        }



        return updatedConversation[0];

    } catch (error) {
        console.error(error);
        throw error;
    }
};

// assign conversation to teamleader
export const assignToTeamleader = async <T extends Conversation>(
    conversationId: string, teamleaderId: string
): Promise<T> => {
    try {
        await db.update(conversation).set({ assigneeId: teamleaderId }).where(eq(conversation.id, conversationId));

        // add to participants
        await db.insert(teamleadersOnConversations).values({
            conversationId,
            teamleaderId,
        }).onConflictDoNothing();

        const updatedConversation = await loadConversationById(conversationId);

        if (!updatedConversation) {
            throw new Error("Conversation not found");
        }

        return updatedConversation as T;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

// unassign conversation from teamleader
export const unassignFromTeamleader = async (conversationId: string): Promise<string> => {
    ;
    try {
        const updatedConversation = await db.update(conversation).set({ assigneeId: null }).where(and(eq(conversation.id, conversationId), eq(conversation.status, 'active'))).returning();

        if (updatedConversation.length === 0) {
            throw new Error("Conversation not found");
        }

        return updatedConversation[0].id;

    } catch (error) {
        console.error(error);
        throw error;
    }
};