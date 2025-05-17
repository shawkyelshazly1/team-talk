import FiltersPane from "@/components/app/conversations/FiltersPane";
import { requireAuth } from "@/lib/auh/auth-utils";
import ResultsContainer from "@/components/app/conversations/ResultsContainer";
export default async function ConversationsPage() {
	await requireAuth();

	return (
		<div className="flex min-h-screen px-4">
			<div className="w-full min-h-screen flex-1 flex flex-col gap-6 py-4">
				<h1 className="text-2xl font-bold">Historical Conversations</h1>
				<div className="flex flex-col gap-4 bg-accent/50 rounded-xl border shadow-sm p-2 md:p-4 h-[90vh]">
					<FiltersPane />
					<ResultsContainer />
				</div>
			</div>
		</div>
	);
}
