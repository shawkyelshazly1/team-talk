"use client";

import ResultsContainer from "./ResultsContainer";
import FiltersPane from "./FiltersPane";
import { useUserStore } from "@/stores/useUserStore";
import CustomSidebarTrigger from "@/components/layout/CustomSidebarTrigger";
import { useSidebar } from "@/components/ui/sidebar";

export default function HistoricalConversationsContainer() {
	const { userStatus } = useUserStore();
	const { isMobile } = useSidebar();

	return userStatus === "offline" ? (
		<div className="w-full min-h-screen flex-1 flex flex-col gap-6 py-4">
			<div className="flex items-center gap-2">
				{isMobile && <CustomSidebarTrigger />}
				<h1 className="text-2xl font-bold">Historical Conversations</h1>
			</div>
			<div className="flex flex-col gap-4 bg-accent/50 rounded-xl border shadow-sm p-2 md:p-4 h-[90vh]">
				<FiltersPane />
				<ResultsContainer />
			</div>
		</div>
	) : null;
}
