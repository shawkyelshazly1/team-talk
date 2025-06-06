"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useUserContext } from "./UserContext";
import { Conversation } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export const ConversationContext = createContext<{
	selectedConversationId: string;
	setSelectedConversationId: (conversation: string) => void;
	selectedConversation: Conversation | null;
	setSelectedConversation: (conversation: Conversation | null) => void;
}>({
	selectedConversationId: "",
	setSelectedConversationId: () => {},
	selectedConversation: null,
	setSelectedConversation: () => {},
});

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
	const [selectedConversationId, setSelectedConversationId] =
		useState<string>("");
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { userStatus } = useUserContext();

	useEffect(() => {
		const conversationId = searchParams.get("conversation_id");
		if (conversationId) {
			setSelectedConversationId(conversationId);
		}
	}, [searchParams.get("conversation_id")]);

	useEffect(() => {
		if (
			pathname !== "/app" &&
			!pathname.startsWith("/app?") &&
			userStatus === "online"
		) {
			router.push("/app");
		}
	}, [userStatus]);

	// Update selected conversation when selectedConversationId changes
	useEffect(() => {
		if (selectedConversationId) {
			const conversation: Conversation | undefined = queryClient.getQueryData([
				"conversation",
				selectedConversationId,
			]) as Conversation | undefined;
			setSelectedConversation(conversation!);
		} else {
			setSelectedConversation(null);
		}
	}, [selectedConversationId, queryClient]);

	return (
		<ConversationContext.Provider
			value={{
				selectedConversationId,
				setSelectedConversationId,
				selectedConversation,
				setSelectedConversation,
			}}
		>
			{children}
		</ConversationContext.Provider>
	);
};

export const useConversationContext = () => {
	const context = useContext(ConversationContext);
	if (!context) {
		throw new Error(
			"useConversationContext must be used within an ConversationProvider"
		);
	}
	return context;
};
