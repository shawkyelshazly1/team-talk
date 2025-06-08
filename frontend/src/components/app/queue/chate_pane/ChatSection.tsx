"use client";
// import RichMessageInput from "./message_input/RichMessageInput";
import { SyncLoader } from "react-spinners";
import BasketTabs from "./BasketTabs";
import ChatContainer from "./ChatContainer";
import { useEffect } from "react";
import { useBasket } from "@/hooks/use-basket";
import { useUserStore } from "@/stores/useUserStore";
import { useUIStore } from "@/stores/useUIStore";

export default function ChatSection() {
	const { basketConversations } = useBasket();
	const { userStatus } = useUserStore();
	const { selectedConversationId } = useUIStore();

	useEffect(() => {
		// on first load, set the conversation id for 1st in basket in the url params
		if (
			basketConversations.length > 0 &&
			userStatus === "online" &&
			selectedConversationId === ""
		) {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set("conversation_id", basketConversations[0].id);
			const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
			window.history.pushState({}, "", newUrl);
		}
	}, [userStatus, basketConversations.length]);

	return userStatus === "online" ? (
		<div className="  h-[100vh] pb-4 pt-1 w-full px-2 gap-2 flex flex-col">
			{userStatus === "online" && basketConversations.length === 0 ? (
				<div className="w-full h-full flex flex-col items-center justify-center gap-2">
					<h1 className="text-2xl font-bold">Queue is empty</h1>
					<SyncLoader size={10} color="#000" />
				</div>
			) : (
				selectedConversationId !== "" && (
					<>
						<BasketTabs />
						<ChatContainer />
					</>
				)
			)}
		</div>
	) : null;
}
