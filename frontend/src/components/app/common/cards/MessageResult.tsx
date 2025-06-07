"use client";
import type { ConversationSearchResults } from "@shared/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import ShowMoreButon from "../buttons/ShowMoreButon";

export default function MessageResult({
	message,
}: {
	message: ConversationSearchResults["message"];
}) {
	const [isExpanded, setIsExpanded] = useState(
		!(message?.content?.length > 100)
	);
	const searchParams = useSearchParams();
	const searchTerm = searchParams.get("query");
	return (
		<span className="text-sm text-gray-500">
			{!isExpanded ? (
				<Highlighter
					highlightClassName="bg-yellow-200"
					searchWords={
						searchTerm
							? searchTerm?.trim() == ""
								? [""]
								: searchTerm?.split(" ")
							: [""]
					}
					autoEscape={true}
					textToHighlight={message?.content?.slice(0, 100) + "..." + " "}
				/>
			) : (
				<Highlighter
					highlightClassName="bg-yellow-200"
					searchWords={
						searchTerm
							? searchTerm?.trim() == ""
								? [""]
								: searchTerm?.split(" ")
							: [""]
					}
					autoEscape={true}
					textToHighlight={message?.content}
				/>
			)}
			{!isExpanded && <ShowMoreButon setIsExpanded={setIsExpanded} />}
		</span>
	);
}
