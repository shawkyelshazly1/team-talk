"use client";

import { setSelectedConversation } from "@/stores/features/conversation/conversationSlice";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

const ConversationContext = createContext<null>(null);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
	const searchParams = useSearchParams();
	const dispatch = useDispatch();

	useEffect(() => {
		const conversationId = searchParams.get("conversation_id");
		if (conversationId) {
			dispatch(setSelectedConversation(conversationId));
		}
	}, [searchParams.get("conversation_id")]);

	return (
		<ConversationContext.Provider value={null}>
			{children}
		</ConversationContext.Provider>
	);
};
