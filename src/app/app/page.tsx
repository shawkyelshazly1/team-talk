import { requireAuth } from "@/lib/auh/auth-utils";
import ConversationsArea from "@/components/app/conversations_pane/ConversationsArea";
import ChatSection from "@/components/app/chate_pane/ChatSection";
export default async function AppPage() {
	await requireAuth();

	return (
		<div className="flex min-h-screen px-4">
			<div className="w-full min-h-screen flex-1 flex flex-row">
				<ConversationsArea />
				<ChatSection />
			</div>
		</div>
	);
}
