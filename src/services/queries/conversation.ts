import { Conversation, ConversationSearchResults } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";



// search conversations
type SearchConversationsProps = {
    query: string,
    agents: string,
    teamLeaders: string,

};
// search conversations query and filters
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
export function useLoadConversations(props: LoadConversationsProps) {
    return useQuery<Conversation[]>({
        queryKey: ["conversations", props.agents, props.teamLeaders],
        queryFn: () => axiosInstance.get(`/conversations/load/all?agents=${props.agents}&teamLeaders=${props.teamLeaders}&take=${props.take}&skip=${props.skip}`).then(res => res.data),
    });
}

// load csr conversations by status
export function useLoadCsrConversations(status: Conversation['status']) {
    return useQuery<Conversation[]>({
        queryKey: ["csr_conversations", status],
        queryFn: () => axiosInstance.get(`/conversations/csr?status=${status}`).then(res => res.data),
    });
}