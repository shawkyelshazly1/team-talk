"use client";

import ResultsContainer from "./ResultsContainer";
import FiltersPane from "./FiltersPane";
import { useSelector } from "react-redux";
import { selectUserStatus } from "@/stores/features/user/userSlice";

export default function HistoricalConversationsContainer() {
	const currentStatus = useSelector(selectUserStatus);

	return currentStatus === "offline" ? (
		<div className="w-full min-h-screen flex-1 flex flex-col gap-6 py-4">
			<h1 className="text-2xl font-bold">Historical Conversations</h1>
			<div className="flex flex-col gap-4 bg-accent/50 rounded-xl border shadow-sm p-2 md:p-4 h-[90vh]">
				<FiltersPane />
				<ResultsContainer />
			</div>
		</div>
	) : null;
}
