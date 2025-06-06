import ConversationContainer from "@/components/app/conversation/ConversationContainer";
import { requireAuth } from "@/lib/auh/auth-utils";
export default async function ConversationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	await requireAuth();

	return (
		<div className="  h-[100vh] pb-4 pt-1 w-full px-2 gap-2 flex flex-col">
			<ConversationContainer conversationId={id} />
		</div>
	);
}
