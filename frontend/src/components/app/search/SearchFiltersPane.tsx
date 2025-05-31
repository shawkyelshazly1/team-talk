"use client";
import SearchConversationsInput from "../common/inpus/SearchConversationsInput";
import ClearFiltersButton from "../common/buttons/ClearFiltersButton";
import MyConversations from "./filters/MyConversations";
import { useSearchParams } from "next/navigation";

export default function SearchFiltersPane() {
	const searchParams = useSearchParams();
	return (
		<div className="flex  flex-row flex-wrap  items-center gap-4">
			<SearchConversationsInput query={searchParams.get("query")} />
			<MyConversations
				agentsParams={searchParams.get("agents")}
				query={searchParams.get("query")}
			/>
			<ClearFiltersButton searchParams={searchParams} />
		</div>
	);
}
