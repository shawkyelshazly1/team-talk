import { axiosInstance } from "@/services/axiosInstance";
import { useUIStore } from "@/stores/useUIStore";
import type { Conversation } from "@shared/types";
import { useQueries, useQueryClient } from "@tanstack/react-query";



export const useBasket = () => {
    const { basket, addToBasket, removeFromBasket, clearBasket, isInBasket } = useUIStore();
    const queryClient = useQueryClient();

    // Use useQueries to fetch any missing conversations
    const conversationQueries = useQueries({
        queries: basket.map(id => ({
            queryKey: ['conversation', id],
            queryFn: () => axiosInstance.get(`/conversations/load/conversation/${id}`).then(res => res.data),
            enabled: !!id,
            staleTime: 5 * 60 * 1000, // 5 minutes
        }))
    });

    const basketConversations = conversationQueries
        .map(query => query.data)
        .filter(Boolean) as Conversation[];


    return {
        basketIds: basket,
        basketConversations,
        addToBasket,
        removeFromBasket,
        clearBasket,
        isInBasket,
        basketCount: basket.length,
    };


};