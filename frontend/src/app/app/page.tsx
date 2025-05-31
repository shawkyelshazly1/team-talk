import HistoricalConversationsContainer from "@/components/app/conversations/HistoricalConversationsContainer";
import ChatSection from "@/components/app/queue/chate_pane/ChatSection";
import { requireAuth } from "@/lib/auh/auth-utils";
export default async function AppPage() {
	await requireAuth();

	return (
		<div className="flex min-h-screen px-4">
			<div className="w-full min-h-screen flex-1 flex flex-row">
				<ChatSection />
				<HistoricalConversationsContainer />
			</div>
		</div>
	);
}
