import { requireAuth } from "@/lib/auh/auth-utils";
export default async function ConversationsPage() {
	await requireAuth();

	return <div className="flex min-h-screen px-4">conversations</div>;
}
