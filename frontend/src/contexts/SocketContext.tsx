"use client";
import { ExtendedSocket } from "@/lib/socketio/types";
import { createContext, ReactNode, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { useSocket } from "@/hooks/use-socket";
import { useAppContext } from "./AppContext";
import { useUpdateCache } from "@/services/use-update-cache";

const SocketContext = createContext<{
	socket: ExtendedSocket | null;
	isConnected: boolean;
}>({
	socket: null,
	isConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const { user, setUserStatus } = useUserContext();
	const { isConnected, socket } = useSocket();
	const { addToBasket, clearBasket, removeFromBasket, updateConversation } =
		useAppContext();
	const { updateConversation: updateConversationCache } = useUpdateCache();

	const removeConversationIdFromUrl = () => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.delete("conversation_id");
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	useEffect(() => {
		if (user && isConnected) {
			socket?.on("ack_status", (data) => {
				if (data.success) {
					setUserStatus(data.status);
					if (data.status === "offline") {
						clearBasket();
						// remove conversation id from url params
						removeConversationIdFromUrl();
					}
				}
			});

			// add conversation to basket on assign conversation event
			socket?.on("assign_conversation", (data) => {
				addToBasket(data.conversation);
			});

			// remove conversation from basket on remove conversation event
			socket?.on("remove_from_basket", (data) => {
				removeFromBasket(data.conversation_id);
			});

			// update conversation on update conversation event
			socket?.on("update_conversation", (data) => {
				updateConversation(data.conversation);
				updateConversationCache({
					conversation_id: data.conversation.id,
					conversation: data.conversation,
				});
			});

			if (user.role === "csr") {
				socket?.emit("set_status", { status: "online" });
			}
		}

		return () => {
			socket?.off("ack_status");
			socket?.off("assign_conversation");
			if (user?.role === "csr") {
				socket?.emit("set_status", { status: "offline" });
			}
			socket?.off("remove_from_basket");
			socket?.off("update_conversation");
		};
	}, [user, isConnected]);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};
