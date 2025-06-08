import type { ExtendedSocket } from "@/lib/socketio/types";
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";
import type { Conversation, Message } from "@shared/types";
import type { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const setupSocketEvents = (socket: ExtendedSocket, queryClient: QueryClient) => {



    // user status events
    socket.on("ack_status", (data) => {
        if (data.success) {
            useUserStore.getState().setUserStatus(data.status);

            const user = useUserStore.getState().user;
            if (data.status === "offline") {
                useUIStore.getState().clearBasket();
                // remove conversation id from url
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete('conversation_id');
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                window.history.pushState({}, '', newUrl);
            } else if (data.status === "online" && user?.role === "team_lead") {
                // 🎯 Trigger custom event instead of direct navigation
                if (typeof window !== 'undefined' && window.location.pathname !== "/app") {
                    window.dispatchEvent(new CustomEvent('force-navigate', {
                        detail: { path: '/app' }
                    }));
                }
                // 🎯Start delayed function to set conversation_id
                setInitialConversationWithDelay();
            }
        }
    });

    // conversation assignment events - store ID only, React Query has the data
    socket.on("assign_conversation", (data) => {


        // add id to basket
        useUIStore.getState().addToBasket(data.conversation.id);

        // update react query cache with full conversation data
        queryClient.setQueryData(
            ["conversation", data.conversation.id],
            data.conversation
        );

        // invalidate conversation list to show updates
        invalidateAllCSRConversationTabs(queryClient);
    });

    // remove from basket
    socket.on("remove_from_basket", (data) => {
        const { selectedConversationId, basket, setSelectedConversationId } = useUIStore.getState();

        useUIStore.getState().removeFromBasket(data.conversation_id);

        // Handle URL sync if the removed conversation was currently selected
        if (selectedConversationId === data.conversation_id) {
            const remainingBasket = basket.filter(id => id !== data.conversation_id);

            if (remainingBasket.length > 0) {
                // Select first remaining conversation
                const newSelectedId = remainingBasket[0];
                setSelectedConversationId(newSelectedId);

                // Update URL
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set('conversation_id', newSelectedId);
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                window.history.replaceState({}, '', newUrl);
            } else {
                // No conversations left, clear selection and URL
                setSelectedConversationId('');

                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete('conversation_id');
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                window.history.replaceState({}, '', newUrl);
            }
        }
    });

    //conversation updates - React Query handles the data
    socket.on("update_conversation", (data) => {
        queryClient.setQueryData(
            ["conversation", data.conversation.id],
            (oldData: Conversation | undefined) => {
                if (!oldData) return data.conversation;
                return { ...oldData, ...data.conversation };
            }
        );


        // invalidate conversation list to show updates
        invalidateAllCSRConversationTabs(queryClient);
        queryClient.invalidateQueries({ queryKey: ['tl_assigned_conversations'] });
    });

    // message events - always update cache, components decide what to show
    socket.on("new_message", (data) => {
        queryClient.setQueryData(
            ["conversation_messages", data.conversation_id],
            (oldData: any) => {
                if (!oldData) return { pages: [{ messages: [data.message], total: 1 }] };

                const newPages = [...oldData.pages];
                if (newPages[0]) {
                    const messageExists = newPages[0].messages.some((m: Message) => m.id === data.message.id);
                    if (!messageExists) {
                        newPages[0] = {
                            ...newPages[0],
                            messages: [...newPages[0].messages, data.message],
                            total: newPages[0].total + 1
                        };
                    }
                }

                return { ...oldData, pages: newPages };
            }
        );

        const user = useUserStore.getState().user;
        if (user?.role === "csr") {
            const conversationExists = queryClient.getQueryData(['conversation', data.conversation_id]);

            if (!conversationExists) {
                fetchAndAddConversationToCSRLists(queryClient, data.conversation_id);
            } else {
                invalidateAllCSRConversationTabs(queryClient);
            }

        }
    });
};

const fetchAndAddConversationToCSRLists = async (queryClient: QueryClient, conversationId: string) => {
    // TODO: change to use the query function
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/load/conversation/${conversationId}`, {
            credentials: 'include'
        });
        const conversation: Conversation = await response.json();

        queryClient.setQueryData(['conversation', conversationId], conversation);

        queryClient.setQueryData(
            ['csr_conversations', conversation.status, { take: 10 }],
            (oldData: any) => {
                if (!oldData) return { pages: [{ conversations: [conversation], total: 1 }] };

                const newPages = [...oldData.pages];
                if (newPages[0]) {
                    const exists = newPages[0].conversations.some((c: Conversation) => c.id === conversationId);
                    if (!exists) {
                        newPages[0] = {
                            ...newPages[0],
                            conversations: [conversation, ...newPages[0].conversations],
                            total: newPages[0].total + 1
                        };
                    }
                }

                return { ...oldData, pages: newPages };
            }
        );
    } catch (error) {
        console.error('Failed to fetch conversation:', error);
        invalidateAllCSRConversationTabs(queryClient);
    }
};

const invalidateAllCSRConversationTabs = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['csr_conversations', 'active'] });
    queryClient.invalidateQueries({ queryKey: ['csr_conversations', 'pending'] });
    queryClient.invalidateQueries({ queryKey: ['csr_conversations', 'solved'] });
    queryClient.invalidateQueries({ queryKey: ['csr_conversations', 'closed'] });
};


export const cleanupSocketEvents = (socket: ExtendedSocket) => {
    socket.off('ack_status');
    socket.off('assign_conversation');
    socket.off('remove_from_basket');
    socket.off('update_conversation');
    socket.off('new_message');
};

// Function to set initial conversation after delay
const setInitialConversationWithDelay = () => {
    setTimeout(() => {
        // Only proceed if user is on /app and no conversation_id in URL
        if (window.location.pathname === '/app') {
            const urlParams = new URLSearchParams(window.location.search);
            const hasConversationInUrl = urlParams.has('conversation_id');

            if (!hasConversationInUrl) {
                const { basket, selectedConversationId } = useUIStore.getState();

                if (!selectedConversationId && basket.length > 0) {
                    // Pick first conversation
                    const firstConversationId = basket[0];
                    useUIStore.getState().setSelectedConversationId(firstConversationId);

                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('conversation_id', firstConversationId);
                    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                    window.history.replaceState({}, '', newUrl);
                }
            }
        }
    }, 1000); // 1 second delay to let all assign_conversation events complete
};