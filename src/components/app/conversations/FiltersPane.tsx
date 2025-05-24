"use client";
import SearchConversationsInput from "../common/inpus/SearchConversationsInput";
import AgentFilter from "./filters/AgentFilter";
import TeamLeaderFilter from "./filters/TeamLeaderFilter";
import ClearFiltersButton from "../common/buttons/ClearFiltersButton";
import { useSearchParams } from "next/navigation";
export default function FiltersPane() {
	const searchParams = useSearchParams();

	return (
		<div className="flex  flex-row flex-wrap  items-center gap-4">
			<SearchConversationsInput query={searchParams.get("query")} />
			<AgentFilter agentsParams={searchParams.get("agents")} />
			<TeamLeaderFilter teamLeadersParams={searchParams.get("teamLeaders")} />
			<ClearFiltersButton searchParams={searchParams} />
		</div>
	);
}
