"use client";

import ConversationsSearchResultCard from "../cards/ConversationsSearchResultCard";
import { useSearchParams } from "next/navigation";
import { useInfiniteSearchConversations } from "@/services/queries/conversation";
import { ClipLoader, SyncLoader } from "react-spinners";
import NoResults from "@/public/no-results.svg?url";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ConversationsSearchResults() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("query");
	const agents = searchParams.get("agents");

	const [limit, setLimit] = useState(10);

	const {
		data: conversations,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetchingPreviousPage,
		isLoading,
		error,
		status,
	} = useInfiniteSearchConversations({
		query: searchQuery ?? "",
		agents: agents ?? "",
		teamLeaders: "",
		limit,
	});

	return (
		<div className="flex flex-col w-full gap-2 h-[80vh] overflow-y-auto">
			{searchQuery?.trim() === undefined ? (
				<div className="flex flex-col justify-center items-center h-full">
					<h1 className="text-2xl font-bold">
						Find a conversation by typing a keyword...
					</h1>
				</div>
			) : isLoading || (status === "pending" && !error) ? (
				<div className="flex justify-center items-center h-full">
					<SyncLoader />
				</div>
			) : error || conversations?.pages[0]?.searchResults.length === 0 ? (
				<div className="flex flex-col justify-center items-center h-full">
					<Image src={NoResults} alt="No results" width={150} height={150} />
					<h1 className="text-2xl font-bold">No results found</h1>
				</div>
			) : (
				conversations?.pages.map((page) =>
					page.searchResults.map((conversation) => (
						<ConversationsSearchResultCard
							key={conversation.id}
							conversation={conversation}
						/>
					))
				)
			)}
			{hasNextPage && (
				<div className="flex justify-center items-center">
					<Button
						className="w-[8rem]"
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<ClipLoader color="#fff" size={10} />
						) : (
							"Load more"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
