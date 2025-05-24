"use client";

import ConversationsSearchResultCard from "../cards/ConversationsSearchResultCard";
import { useSearchParams } from "next/navigation";
import { useSearchConversations } from "@/services/queries/conversation";
import { SyncLoader } from "react-spinners";
import NoResults from "@/public/no-results.svg?url";
import Image from "next/image";
import { useEffect } from "react";

export default function ConversationsSearchResults() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("query");
	const agents = searchParams.get("agents");

	const {
		data: conversations,
		isLoading,
		error,
		refetch,
	} = useSearchConversations({
		query: searchQuery ?? "",
		agents: agents ?? "",
		teamLeaders: "",
	});

	return (
		<div className="flex flex-col w-full gap-2 h-[80vh] overflow-y-auto">
			{searchQuery?.trim() === undefined ? (
				<div className="flex flex-col justify-center items-center h-full">
					<h1 className="text-2xl font-bold">
						Find a conversation by typing a keyword...
					</h1>
				</div>
			) : isLoading && !error ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader />
				</div>
			) : error || conversations?.length === 0 ? (
				<div className="flex flex-col justify-center items-center h-full">
					<Image src={NoResults} alt="No results" width={150} height={150} />
					<h1 className="text-2xl font-bold">No results found</h1>
				</div>
			) : (
				conversations?.map((conversation) => (
					<ConversationsSearchResultCard
						key={conversation.id}
						conversation={conversation}
					/>
				))
			)}
		</div>
	);
}
