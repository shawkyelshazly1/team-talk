import SearchConversationsInput from "../common/inpus/SearchConversationsInput";
import AgentFilter from "./filters/AgentFilter";
import TeamLeaderFilter from "./filters/TeamLeaderFilter";
import ClearFiltersButton from "../common/buttons/ClearFiltersButton";
export default function FiltersPane() {
	return (
		<div className="flex  flex-row flex-wrap  items-center gap-4">
			<SearchConversationsInput />
			<AgentFilter />
			<TeamLeaderFilter />
			<ClearFiltersButton />
		</div>
	);
}
