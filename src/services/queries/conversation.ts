import { Conversation, ConversationSearchResults } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";



// search conversations
type SearchConversationsProps = {
    query: string,
    agents: string,
    teamLeaders: string,

};
// search conversations by query and filters
export function useSearchConversations(props: SearchConversationsProps) {

    return useQuery<ConversationSearchResults[]>({
        queryKey: ["conversations", props.query, props.agents, props.teamLeaders],
        queryFn: () => axiosInstance.get(`/conversations/search?query=${props.query}${props.agents ? `&agents=${props.agents}` : ""}${props.teamLeaders ? `&teamLeaders=${props.teamLeaders}` : ""}`).then(res => res.data),
        enabled: props.query.trim() !== "" || props.query.trim() === undefined,
        retry: props.query.trim() !== "" || props.query.trim() === undefined
    });
}

// load conversations  "TLs view"
type LoadConversationsProps = {
    agents: string,
    teamLeaders: string,
    take: number,
    skip: number,
};
export function useLoadhistoricalConversations(props: LoadConversationsProps) {
    return useQuery<Conversation[]>({
        queryKey: ["conversations", props.agents, props.teamLeaders, props.take, props.skip],
        queryFn: () => axiosInstance.get(`/conversations/load/all?${props.agents ? `&agents=${props.agents}` : ""}${props.teamLeaders ? `&teamLeaders=${props.teamLeaders}` : ""}${props.take ? `&take=${props.take}` : ""}${props.skip >= 0 ? `&skip=${props.skip}` : ""}`).then(res => res.data),
    });
}

// load csr conversations by status
export function useLoadCsrConversations(status: Conversation['status'], take: number, skip: number) {
    return useQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ["csr_conversations", status, take, skip],
        queryFn: () => axiosInstance.get(`/conversations/csr?status=${status}&take=${take}&skip=${skip}`).then(res => res.data),
    });
}

// load tl assigned conversations by status
export function useLoadTlAssignedConversations(status: Conversation['status'], take: number, skip: number) {
    return useQuery<{ conversations: Conversation[], total: number; }>({
        queryKey: ["tl_assigned_conversations", status, take, skip],
        queryFn: () => axiosInstance.get(`/conversations/team_lead?status=${status}&take=${take}&skip=${skip}`).then(res => res.data),
    });
}