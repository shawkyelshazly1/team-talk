"use client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import type { Conversation } from "@shared/types";
import { useConversationSocket } from "@/hooks/use-conversation-socket";
import { useUserStore } from "@/stores/useUserStore";
export default function MessageInput({
	conversation,
}: {
	conversation: Conversation;
}) {
	const [messageContent, setMessageContent] = useState("");

	const { sendMessage } = useConversationSocket({
		conversationId: conversation.id,
	});

	const user = useUserStore.getState().user;

	return (
		<div className="border-2 border-border rounded-lg  max-h-[100px]  flex flex-row justify-between">
			<Textarea
				value={messageContent}
				disabled={conversation?.status === "closed"}
				onChange={(e) => setMessageContent(e.target.value)}
				className="resize-none focus-visible:outline-none w-full  p-2  break-words  overflow-y-auto focus-visible:ring-0 focus-visible:border-0 border-0 outline-0 ring-0 ring-offset-0 shadow-none"
			/>
			<SendHorizonal
				onClick={() => {
					if (conversation?.status === "closed" || !messageContent.trim()) {
						return;
					}
					sendMessage(messageContent.trim(), user?.id!, conversation.agent.id);
					setMessageContent("");
				}}
				className={cn(
					" mr-2 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer mt-auto mb-1 disabled:opacity-50",
					conversation?.status === "closed" && "opacity-50 cursor-not-allowed"
				)}
				size={35}
			/>
		</div>
	);
}
