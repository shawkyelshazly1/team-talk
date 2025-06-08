"use client";
import { Button } from "@/components/ui/button";
import InboxConversationCard from "./InboxConversationCard";
import { useLoadInfiniteCsrConversations } from "@/services/queries/conversation";
import { ClipLoader, SyncLoader } from "react-spinners";
import type { Conversation } from "@shared/types";
import { useUIStore } from "@/stores/useUIStore";

export default function InboxConversationsContainer({
	status,
}: {
	status: Conversation["status"];
}) {
	const { selectedConversationId } = useUIStore();

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status: infiniteStatus,
	} = useLoadInfiniteCsrConversations(status, 10);

	return (
		<div className="flex flex-col gap-2 overflow-y-auto h-[86vh] pt-4 px-2">
			{infiniteStatus === "pending" ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader color="#000" />
				</div>
			) : (
				data?.pages?.map((page) =>
					page.conversations.map((conversation) => (
						<InboxConversationCard
							key={conversation.id}
							conversation={conversation}
							selected={selectedConversationId === conversation.id}
						/>
					))
				)
			)}
			{hasNextPage && (
				<div className="flex justify-center items-center mt-2">
					<Button
						className="w-[7rem] cursor-pointer"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<ClipLoader color="#fff" size={10} />
						) : (
							"Load More"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
