import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/lib/types";
import moment from "moment";
import { useSession } from "@/lib/auh/auth-client";
import { cn } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";

export default function InboxConversationCard({
	conversation,
	selected,
}: {
	conversation: Omit<Conversation, "teamLeaders" | "topic">;
	selected: boolean;
}) {
	const { data: session } = useSession();

	// set the conversation id in the url params
	const setConversationIdInParams = (conversationId: string) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set("conversation_id", conversationId);
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	const {  selectedConversationId } = useConversationContext();

	return (
		<div className="flex flex-col gap-3">
			<div
				className={cn(
					"flex   flex-col gap-2 justify-between p-2 md:p-4 bg-card rounded-xl border shadow-sm hover:bg-accent/50 cursor-pointer transition-colors",
					selected && "bg-blue-100 hover:bg-blue-100"
				)}
				onClick={() => {
					selectedConversationId !== conversation.id &&
						setConversationIdInParams(conversation.id);
				}}
			>
				<div className="flex flex-row w-fit ml-auto">
					<p className="text-xs text-muted-foreground">
						{moment(conversation.lastMessage?.createdAt).calendar(null, {
							sameDay: "h:mm A",
							lastDay: "[Yesterday] h:mm A",
							lastWeek: "MMM D h:mm A",
							sameElse: "MMM D h:mm A",
						})}
					</p>
				</div>
				<div className="flex flex-row justify-between">
					<p className="text-sm text-muted-foreground line-clamp-2 ">
						<span className="font-semibold text-foreground">
							{session?.user?.id === conversation.lastMessage?.sender.id
								? "You: "
								: conversation.lastMessage?.sender.name + ": "}
						</span>
						{conversation.lastMessage?.content}
					</p>
					{conversation.unreadMessagesCount
						? conversation.unreadMessagesCount > 0 && (
								<Badge
									variant="outline"
									className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
								>
									{conversation.unreadMessagesCount}
								</Badge>
						  )
						: null}
				</div>
			</div>
		</div>
	);
}
