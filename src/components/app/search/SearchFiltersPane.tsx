import SearchConversationsInput from "../common/inpus/SearchConversationsInput";

import ClearFiltersButton from "../common/buttons/ClearFiltersButton";
import MyConversations from "./filters/MyConversations";

export default function SearchFiltersPane() {
	return (
		<div className="flex  flex-row flex-wrap  items-center gap-4">
			<SearchConversationsInput />
			<MyConversations />
			<ClearFiltersButton />
		</div>
	);
}
