"use client";

import { useSearchParams } from "next/navigation";
import ConversationsSearchResults from "../common/sections/ConversationsSearchResults";
import { ConversationsTable } from "./conversations_table/data-table";

export default function ResultsContainer() {
	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	return !query ? <ConversationsTable /> : <ConversationsSearchResults />;
}
