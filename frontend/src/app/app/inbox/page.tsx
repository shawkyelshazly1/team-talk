import InboxChatSection from "@/components/app/inbox/chate_pane/InboxChatSection";
import InboxConversationsArea from "@/components/app/inbox/conversation_pane/InboxConversationsArea";
import { requireAuth } from "@/lib/auh/auth-utils";

export default async function InboxPage() {
	await requireAuth();

	return (
		<div className="flex h-screen px-4">
			<div className="w-full h-full flex flex-col md:flex-row gap-4 justify-between">
				<InboxConversationsArea />
				<InboxChatSection />
			</div>
		</div>
	);
}
