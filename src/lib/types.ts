export type Conversation = {
    id: string;
    agent: Agent;
    createdAt: string;
    status: "pending" | "active" | "closed";
    teamLeaders?: TeamLeader[];
    topic: string;
    messages?: Message[];
    lastMessage?: Message;
    unreadMessagesCount?: number;
    updatedAt: string;

};

export type ConversationSearchResults = Omit<Conversation, 'teamLeaders' | 'status' | 'topic'> & {
    message: Omit<Message, 'isRead'>;
};

export type User = {
    id: string;
    name: string;
    email: string;
    image: string;
    role: "team_lead" | "csr";
};

export type TeamLeader = User & {
    role: "team_lead";
};

export type Agent = User & {
    role: "csr";
};

export type Message = {
    id: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    sender: Agent | TeamLeader;
    conversationId: string;
    isRead: boolean;
};

export type UserEvent = {
    id: string;
    createdAt: string;
    type: "user_status_change";
    user: TeamLeader;
    status: "online" | "offline";
};

export type ConversationEvent = {
    id: string;
    createdAt: string;
    type: "status_change";
    conversation: Conversation;
    status?: "pending" | "active" | "closed";
};



