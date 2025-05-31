export type Conversation = {
    id: string;
    agent: Agent;
    createdAt: string;
    status: "pending" | "active" | "closed" | "solved";
    teamLeaders?: TeamLeader[];
    topic?: string | null;
    messages?: Message[];
    lastMessage?: Message;
    unreadMessagesCount?: number;
    updatedAt: string;
    assignee?: TeamLeader;
    ticketLink?: string | null;
};

export type ConversationSearchResults = Omit<Conversation, 'teamLeaders' | 'status' | 'topic'> & {
    message: Omit<Message, 'isRead'>;
};

export type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null | undefined;
    role: "team_lead" | "csr";
};

export type TeamLeader = User & {
    role: "team_lead";
    assignedConversations?: Conversation[];
};

export type Agent = User & {
    role: "csr";
};

export type Message = {
    id: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    sender: Agent | TeamLeader | User;
    conversationId: string;
    isRead: boolean;
};

export type UserEvent = {
    id: string;
    createdAt: string;
    type: "user_status_change";
    user: TeamLeader;
    status: UserStatus;
};

export type ConversationEvent = {
    id: string;
    createdAt: string;
    type: "status_change";
    conversation: Conversation;
    status?: "pending" | "active" | "closed";
};

export type UserStatus = "online" | "offline";



