import { Badge } from "@/components/ui/badge";
import UserInfoAvatar from "../../common/cards/UserInfoAvatar";
import { Conversation } from "@/lib/types";
import moment from "moment";

export default function ConversationCard({
	conversation,
}: {
	conversation: Conversation;
}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex  flex-col gap-2 justify-between p-2 md:p-4 bg-card rounded-xl border shadow-sm hover:bg-accent/50 cursor-pointer transition-colors">
				<div className="flex flex-row justify-between w-full">
					<UserInfoAvatar user={conversation.agent} />
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
					<p className="text-xs text-muted-foreground line-clamp-2 ">
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
