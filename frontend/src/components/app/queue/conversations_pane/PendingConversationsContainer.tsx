"use client";
import { Button } from "@/components/ui/button";
import ConversationCard from "./ConversationCard";
import { useLoadTlAssignedConversations } from "@/services/queries/conversation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { ChevronLeftIcon } from "lucide-react";

export default function PendingConversationsContainer() {
	const [pagination, setPagination] = useState({
		take: 10,
		skip: 0,
	});
	const [total, setTotal] = useState(0);
	const { data, isLoading } = useLoadTlAssignedConversations(
		"pending",
		pagination.take,
		pagination.skip
	);

	useEffect(() => {
		setTotal(data?.total ?? 0);
	}, [data?.total]);

	let conversations = data?.conversations
		?.filter((conversation) => conversation.status === "pending")
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
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader color="#000" />
				</div>
			) : conversations && conversations.length > 0 ? (
				conversations?.map((conversation) => (
					<ConversationCard key={conversation.id} conversation={conversation} />
				))
			) : (
				<div className="flex justify-center items-center h-full">
					<p className="text-muted-foreground">No pending conversations</p>
				</div>
			)}
			{total > pagination.skip + pagination.take && (
				<div className="flex justify-center items-center mt-2">
					<Button
						className="cursor-pointer"
						onClick={() =>
							setPagination({
								take: pagination.take + 10,
								skip: pagination.skip + 10,
							})
						}
						disabled={isLoading}
					>
						{isLoading ? <SyncLoader color="#000" /> : "Load More"}
					</Button>
				</div>
			)}
		</div>
	);
}
