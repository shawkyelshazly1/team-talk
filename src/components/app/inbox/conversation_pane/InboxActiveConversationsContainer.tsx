"use client";
import InboxConversationCard from "./InboxConversationCard";
import { useLoadCsrConversations } from "@/services/queries/conversation";
import { SyncLoader } from "react-spinners";

export default function InboxActiveConversationsContainer() {
	const { data: activeConversations, isLoading } =
		useLoadCsrConversations("active");

	return (
		<div className="flex flex-col gap-2 overflow-y-auto h-[86vh] pt-4 px-2">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader color="#000" />
				</div>
			) : (
				activeConversations?.map((conversation) => (
					<InboxConversationCard
						key={conversation.id}
						conversation={conversation}
					/>
				))
			)}
		</div>
	);
}
