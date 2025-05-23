"use client";
import ConversationCard from "./ConversationCard";
import { selectBasket } from "@/stores/features/user/userSlice";
import { useSelector } from "react-redux";

export default function ActiveConversationsContainer() {
	const basket = useSelector(selectBasket);
	let activeConversations = basket
		// TODO: Remove this filter once we have the real data only active conversations are fetched
		.filter((conversation) => conversation.status === "active")
		.sort((a, b) => {
			// Sort by unread messages count just push ones with unread messages to the top
			const aZero = (a.unreadMessagesCount ?? 0) === 0;
			const bZero = (b.unreadMessagesCount ?? 0) === 0;

			if (aZero !== bZero) {
				return aZero ? 1 : -1; // a goes down if it has 0, up otherwise
			}

			// Otherwise, sort by date
			return (
				new Date(a.lastMessage?.createdAt ?? "").getTime() -
				new Date(b.lastMessage?.createdAt ?? "").getTime()
			);
		});
	return (
		<div className="flex flex-col gap-2 overflow-y-auto h-[92vh] pt-4 px-2">
			<h1 className="text-lg font-medium mx-auto">
				No Assigned Active Conversations
			</h1>
			{activeConversations.map((conversation) => (
				<ConversationCard key={conversation.id} conversation={conversation} />
			))}
		</div>
	);
}
