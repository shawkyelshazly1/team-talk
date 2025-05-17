"use client";

import { DataTable } from "@/components/app/conversations/conversations_table/data-table";
import { columns } from "@/components/app/conversations/conversations_table/columns";
import { conversationsMockData } from "@/lib/mockData";
import { Conversation } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import ConversationsSearchResults from "../common/sections/ConversationsSearchResults";

export default function ResultsContainer() {
	const searchParams = useSearchParams();
	const search = searchParams.get("search");

	return (
		<>
			{!search ? (
				<DataTable<Conversation, unknown>
					columns={columns}
					data={conversationsMockData}
				/>
			) : (
				<ConversationsSearchResults />
			)}
		</>
	);
}
