"use client";
import { Button } from "@/components/ui/button";
import InboxConversationCard from "./InboxConversationCard";
import { useLoadCsrConversations } from "@/services/queries/conversation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { Conversation } from "@/lib/types";
import { useSelector } from "react-redux";
import { selectSelectedConversation } from "@/stores/features/conversation/conversationSlice";

export default function InboxConversationsContainer({
	status,
}: {
	status: Conversation["status"];
}) {
	const [pagination, setPagination] = useState({
		take: 10,
		skip: 0,
	});
	const [total, setTotal] = useState(0);
	const { data, isLoading } = useLoadCsrConversations(
		status,
		pagination.take,
		pagination.skip
	);
	const selectedConversation = useSelector(selectSelectedConversation);

	useEffect(() => {
		setTotal(data?.total ?? 0);
	}, [data?.total]);

	return (
		<div className="flex flex-col gap-2 overflow-y-auto h-[86vh] pt-4 px-2">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader color="#000" />
				</div>
			) : (
				data?.conversations?.map((conversation) => (
					<InboxConversationCard
						key={conversation.id}
						conversation={conversation}
						selected={selectedConversation === conversation.id}
					/>
				))
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
