"use client";

import { ExtendedSocket } from "@/lib/socketio/types";
import { setSelectedConversation } from "@/stores/features/conversation/conversationSlice";
import { selectUserStatus } from "@/stores/features/user/userSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const ConversationContext = createContext<null>(null);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const pathname = usePathname();
	const router = useRouter();

	const userStatus = useSelector(selectUserStatus);

	useEffect(() => {
		const conversationId = searchParams.get("conversation_id");
		if (conversationId) {
			dispatch(setSelectedConversation(conversationId));
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

	useEffect(() => {
		const socket: ExtendedSocket = io(
			process.env.NEXT_PUBLIC_API_URL as string
		);
	}, []);

	return (
		<ConversationContext.Provider value={null}>
			{children}
		</ConversationContext.Provider>
	);
};
