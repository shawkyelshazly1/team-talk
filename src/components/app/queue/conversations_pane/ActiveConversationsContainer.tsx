import { conversationsMockData } from "@/lib/mockData";
import ConversationCard from "./ConversationCard";

export default function ActiveConversationsContainer() {
	let activeConversations = conversationsMockData
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
			{activeConversations.map((conversation) => (
				<ConversationCard key={conversation.id} conversation={conversation} />
			))}
		</div>
	);
}
