import { conversationSearchResults } from "@/lib/mockData";
import ConversationsSearchResultCard from "../cards/ConversationsSearchResultCard";

export default function ConversationsSearchResults() {
	return (
		<div className="flex flex-col w-full gap-2 h-[80vh] overflow-y-auto">
			{conversationSearchResults.map((conversation) => (
				<ConversationsSearchResultCard
					key={conversation.id}
					conversation={conversation}
				/>
			))}
		</div>
	);
}
