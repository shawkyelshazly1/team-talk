import type { ExtendedSocket } from "@/lib/socketio/types";
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";
import type { Conversation, Message } from "@shared/types";
import type { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// URL management helpers
const updateUrlWithConversationId = (conversationId: string) => {
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.set("conversation_id", conversationId);
	const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
	window.history.replaceState({}, "", newUrl);
};

const clearConversationIdFromUrl = () => {
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.delete("conversation_id");
	const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
	window.history.replaceState({}, "", newUrl);
};

const syncUrlWithSelectedConversation = (conversationId: string | null) => {
	if (conversationId) {
		updateUrlWithConversationId(conversationId);
	} else {
		clearConversationIdFromUrl();
	}
};

export const setupSocketEvents = (
	socket: ExtendedSocket,
	queryClient: QueryClient
) => {
	// 🎯 Handle current status response
	socket.on("current_status", (data) => {
		useUserStore.getState().setUserStatus(data.status);
	});

	// user status events
	socket.on("ack_status", (data) => {
		if (data.success) {
			useUserStore.getState().setUserStatus(data.status);

			const user = useUserStore.getState().user;
			if (data.status === "offline") {
				useUIStore.getState().clearBasket();
				// Clear conversation ID from URL
				clearConversationIdFromUrl();
			} else if (data.status === "online" && user?.role === "team_lead") {
				// 🎯 Trigger custom event instead of direct navigation
				if (
					typeof window !== "undefined" &&
					window.location.pathname !== "/app"
				) {
					window.dispatchEvent(
						new CustomEvent("force-navigate", {
							detail: { path: "/app" },
						})
					);
				}
				// 🎯Start delayed function to set conversation_id
				setInitialConversationWithDelay();
			}
		}
	});

	// conversation assignment events - store ID only, React Query has the data
	socket.on("assign_conversation", (data) => {
		const { selectedConversationId, setSelectedConversationId } = useUIStore.getState();

		// add id to basket
		useUIStore.getState().addToBasket(data.conversation.id);

		// update react query cache with full conversation data
		queryClient.setQueryData(
			["conversation", data.conversation.id],
			data.conversation
		);

		// If no conversation is currently selected, select this new one and update URL
		if (!selectedConversationId) {
			setSelectedConversationId(data.conversation.id);
			syncUrlWithSelectedConversation(data.conversation.id);
		}

		// invalidate conversation list to show updates
		invalidateAllCSRConversationTabs(queryClient);
	});

	// remove from basket
	socket.on("remove_from_basket", (data) => {
		const { selectedConversationId, basket, setSelectedConversationId } =
			useUIStore.getState();

		useUIStore.getState().removeFromBasket(data.conversation_id);

		// Handle URL sync if the removed conversation was currently selected
		if (selectedConversationId === data.conversation_id) {
			const remainingBasket = basket.filter(
				(id) => id !== data.conversation_id
			);

			if (remainingBasket.length > 0) {
				// Select first remaining conversation and update URL
				const newSelectedId = remainingBasket[0];
				setSelectedConversationId(newSelectedId);
				syncUrlWithSelectedConversation(newSelectedId);
			} else {
				// No conversations left, clear selection and URL
				setSelectedConversationId("");
				syncUrlWithSelectedConversation(null);
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
		queryClient.invalidateQueries({ queryKey: ["tl_assigned_conversations"] });
	});

	// message events - always update cache, components decide what to show
	socket.on("new_message", (data) => {
		// Get all query cache entries that match the conversation messages pattern
		const queryCache = queryClient.getQueryCache();
		const messageCacheEntries = queryCache.findAll({
			predicate: (query) => {
				const [type, conversationId] = query.queryKey;
				return type === "conversation_messages" && conversationId === data.conversationId;
			},
			type: "active"
		});

		// Update each matching cache entry
		messageCacheEntries.forEach((cacheEntry) => {
			queryClient.setQueryData(
				cacheEntry.queryKey,
				(oldData: any) => {
					if (!oldData)
						return { pages: [{ messages: [data.message], total: 1 }] };

					const newPages = [...oldData.pages];

					// Check if message already exists to prevent duplicates
					const messageExists = newPages.some(page =>
						page.messages.some((m: Message) => m.id === data.message.id)
					);

					if (!messageExists && newPages[0]) {
						// 🎯 FIX: DON'T increment total - server count already includes this message
						newPages[0] = {
							...newPages[0],
							messages: [data.message, ...newPages[0].messages],
							// total stays the same - server already counted this message
						};
					}

					return { ...oldData, pages: newPages };
				}
			);
		});

		const user = useUserStore.getState().user;
		if (user?.role === "csr") {
			const conversationExists = queryClient.getQueryData([
				"conversation",
				data.conversationId,
			]);

			if (!conversationExists) {
				fetchAndAddConversationToCSRLists(queryClient, data.conversationId);
			} else {
				invalidateAllCSRConversationTabs(queryClient);
			}
		}
	});

	// heartbeat events
	socket.on("heartbeat_ack", (data) => {
		if (!data.success) {
			toast.error(data.message || "Failed to refresh TTL");
		}
	});

	// error events
	socket.on("error", (data) => {
		toast.error(data.message || "Something went wrong");
	});

	// sync basket events
	socket.on("sync_basket", (data) => {
		const { basket: serverBasket } = data;
		const {
			basket: localBasket,
			clearBasket,
			setSelectedConversationId,
		} = useUIStore.getState();

		if (JSON.stringify(serverBasket.sort()) !== JSON.stringify(localBasket.sort())) {

			clearBasket();
			serverBasket.forEach((id: string) => useUIStore.getState().addToBasket(id));

			// update selected conversation
			const currentSelected = useUIStore.getState().selectedConversationId;

			if (currentSelected && !serverBasket.includes(currentSelected)) {
				if (serverBasket.length > 0) {
					setSelectedConversationId(serverBasket[0]);
					syncUrlWithSelectedConversation(serverBasket[0]);
				} else {
					setSelectedConversationId("");
					syncUrlWithSelectedConversation(null);
				}
			}
		}
	});
};

const fetchAndAddConversationToCSRLists = async (
	queryClient: QueryClient,
	conversationId: string
) => {
	// TODO: change to use the query function
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/conversations/load/conversation/${conversationId}`,
			{
				credentials: "include",
			}
		);
		const conversation: Conversation = await response.json();

		queryClient.setQueryData(["conversation", conversationId], conversation);

		queryClient.setQueryData(
			["csr_conversations", conversation.status, { take: 10 }],
			(oldData: any) => {
				if (!oldData)
					return { pages: [{ conversations: [conversation], total: 1 }] };

				const newPages = [...oldData.pages];
				if (newPages[0]) {
					const exists = newPages[0].conversations.some(
						(c: Conversation) => c.id === conversationId
					);
					if (!exists) {
						newPages[0] = {
							...newPages[0],
							conversations: [conversation, ...newPages[0].conversations],
							total: newPages[0].total + 1,
						};
					}
				}

				return { ...oldData, pages: newPages };
			}
		);
	} catch (error) {
		console.error("Failed to fetch conversation:", error);
		invalidateAllCSRConversationTabs(queryClient);
	}
};

const invalidateAllCSRConversationTabs = (queryClient: QueryClient) => {
	//FIXME: this is a hack to invalidate the conversation tabs, we should use the query function instead and trigger what tab user is in & as well as moving conversation to the correct tab
	queryClient.invalidateQueries({ queryKey: ["csr_conversations", "active"] });
	queryClient.invalidateQueries({ queryKey: ["csr_conversations", "pending"] });
	queryClient.invalidateQueries({ queryKey: ["csr_conversations", "solved"] });
	queryClient.invalidateQueries({ queryKey: ["csr_conversations", "closed"] });
};

export const cleanupSocketEvents = (socket: ExtendedSocket) => {
	socket.off("ack_status");
	socket.off("assign_conversation");
	socket.off("remove_from_basket");
	socket.off("update_conversation");
	socket.off("new_message");
};

// Function to set initial conversation after delay
const setInitialConversationWithDelay = () => {
	setTimeout(() => {
		// Only proceed if user is on /app and no conversation_id in URL
		if (window.location.pathname === "/app") {
			const urlParams = new URLSearchParams(window.location.search);
			const hasConversationInUrl = urlParams.has("conversation_id");

			if (!hasConversationInUrl) {
				const { basket, selectedConversationId } = useUIStore.getState();

				if (!selectedConversationId && basket.length > 0) {
					// Pick first conversation
					const firstConversationId = basket[0];
					useUIStore.getState().setSelectedConversationId(firstConversationId);

					syncUrlWithSelectedConversation(firstConversationId);
				}
			}
		}
	}, 1000); // 1 second delay to let all assign_conversation events complete
};
