import { create } from "zustand";
import { devtools } from 'zustand/middleware';

interface UIStore {
    selectedConversationId: string;
    basket: string[]; // for team leaders only
    viewMode: "csr-inbox" | "team-leader-multi" | "single-conversation";

    // actions
    setSelectedConversationId: (conversationId: string) => void;
    addToBasket: (conversationId: string) => void;
    removeFromBasket: (conversationId: string) => void;
    clearBasket: () => void;
    isInBasket: (conversationId: string) => boolean;
    // view mode
    setViewMode: (mode: "csr-inbox" | "team-leader-multi" | "single-conversation") => void;
}


export const useUIStore = create<UIStore>()(devtools((set, get) => ({
    selectedConversationId: "",
    basket: [],
    viewMode: "single-conversation",

    setSelectedConversationId: (selectedConversationId) => set({ selectedConversationId }),

    addToBasket: (conversationId) => set((state) => ({
        basket: state.basket.includes(conversationId) ? state.basket : [...state.basket, conversationId]
    })),

    removeFromBasket: (conversationId) => set((state) => ({
        basket: state.basket.filter((id) => id !== conversationId)
    })),

    clearBasket: () => set({ basket: [] }),

    isInBasket: (conversationId) => get().basket.includes(conversationId),


    setViewMode: (viewMode) => set({ viewMode }),
})));