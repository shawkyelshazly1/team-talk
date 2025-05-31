import { Conversation, ConversationSearchResults, Message } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";



// search conversations
type SearchConversationsProps = {
    query: string,
    agents: string,
    teamLeaders: string,
    limit: number,
};
// search conversations by query and filters
export function useInfiniteSearchConversations(props: SearchConversationsProps) {

    return useInfiniteQuery<{ searchResults: ConversationSearchResults[], total: number; }>({
        queryKey: ["conversations", { ...props }],
        queryFn: ({ pageParam = 0 }) => axiosInstance.get(`/conversations/search?query=${props.query}${props.agents ? `&agents=${props.agents}` : ""}${props.teamLeaders ? `&teamLeaders=${props.teamLeaders}` : ""}${props.limit ? `&limit=${props.limit}` : ""}${pageParam as number >= 0 ? `&offset=${pageParam}` : ""}`).then(res => res.data),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((sum, page) => sum + page.searchResults.length, 0);
            return totalFetched < lastPage.total ? totalFetched : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (allPages.length <= 1) return undefined;
            const prevPagesCount = allPages.length - 2;
            return prevPagesCount * props.limit;
        },
        enabled: props.query.trim() !== "" || props.query.trim() === undefined,
        retry: props.query.trim() !== "" || props.query.trim() === undefined,
    });
}

// load conversations  "TLs view"
type LoadConversationsProps = {
    agents: string,
    teamLeaders: string,
    take: number,
};
export function useLoadInfiniteHistoricalConversations(props: LoadConversationsProps) {
    return useInfiniteQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ["conversations", { agents: props.agents, teamLeaders: props.teamLeaders, take: props.take }],
        queryFn: ({ pageParam = 0 }) => axiosInstance.get(`/conversations/load/all?${props.agents ? `&agents=${props.agents}` : ""}${props.teamLeaders ? `&teamLeaders=${props.teamLeaders}` : ""}${props.take ? `&take=${props.take}` : ""}${pageParam as number >= 0 ? `&skip=${pageParam}` : ""}`).then(res => res.data),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((sum, page) => sum + page.conversations.length, 0);
            return totalFetched < lastPage.total ? totalFetched : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (allPages.length <= 1) return undefined;
            const prevPagesCount = allPages.length - 2;
            return prevPagesCount * props.take;
        },
    });
}



// load infinite csr conversations by status
export function useLoadInfiniteCsrConversations(status: Conversation['status'], take: number) {
    return useInfiniteQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ['csr_conversations', status, { take }],
        queryFn: ({ pageParam = 0 }) =>
            axiosInstance.get(`/conversations/csr?status=${status}&take=${take}&skip=${pageParam}`)
                .then(res => res.data)
        ,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((sum, page) => sum + page.conversations.length, 0);
            return totalFetched < lastPage.total ? totalFetched : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (allPages.length <= 1) return undefined;
            const prevPagesCount = allPages.length - 2;
            return prevPagesCount * take;
        },
    });
}

// load tl assigned conversations by status
export function useLoadTlAssignedConversations(status: Conversation['status'], take: number, skip: number) {
    return useQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ["tl_assigned_conversations", status, { take, skip }],
        queryFn: () => axiosInstance.get(`/conversations/team_lead?status=${status}&take=${take}&skip=${skip}`).then(res => res.data),
    });
}

// load infinite tl assigned conversations by status
export function useLoadInfiniteTlAssignedConversations(status: Conversation['status'], take: number) {
    return useInfiniteQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ["tl_assigned_conversations", status, { take }],
        queryFn: ({ pageParam = 0 }) =>
            axiosInstance.get(`/conversations/team_lead?status=${status}&take=${take}&skip=${pageParam}`)
                .then(res => res.data)
        ,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((sum, page) => sum + page.conversations.length, 0);
            return totalFetched < lastPage.total ? totalFetched : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (allPages.length <= 1) return undefined;
            const prevPagesCount = allPages.length - 2;
            return prevPagesCount * take;
        },
    });
}

// load conversation by id
export function useLoadConversationById(id: string) {
    return useQuery<Conversation>({
        queryKey: ["conversation", id],
        queryFn: () => axiosInstance.get(`/conversations/load/conversation/${id}`).then(res => res.data),
        enabled: !!id,
    });
}

// load conversation messages by id
export function useLoadConversationMessagesById(id: string, take: number) {
    return useInfiniteQuery<{ messages: Message[], total: number; }>({
        queryKey: ["conversation_messages", id, { take }],
        queryFn: ({ pageParam = 0 }) => axiosInstance.get(`/conversations/load/conversation/${id}/messages?take=${take}&skip=${pageParam}`).then(res => res.data),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((sum, page) => sum + page.messages.length, 0);
            return totalFetched < lastPage.total ? totalFetched : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (allPages.length <= 1) return undefined;
            const prevPagesCount = allPages.length - 2;
            return prevPagesCount * take;
        },
        enabled: !!id,
    });
}