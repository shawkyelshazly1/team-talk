"use client";
import { Suspense } from "react";
import InboxChatHeader from "./InboxChatHeader";
import MessagesSection from "../../common/sections/MessagesSection";
import MessageInput from "../../common/message_inputs/MessageInput";
import { useSearchParams } from "next/navigation";
import { useLoadConversationById } from "@/services/queries/conversation";
import { useConversationSocket } from "@/hooks/use-conversation-socket";

export default function InboxChatSection() {
	const searchParams = useSearchParams();

	const conversationId = searchParams.get("conversation_id");

	const { data: conversation } = useLoadConversationById(conversationId ?? "");

	useConversationSocket({
		conversationId: conversationId!,
	});

	return conversationId && conversation ? (
		<div className="py-4 w-full h-full  px-2 gap-2 flex flex-col">
			<InboxChatHeader conversation={conversation!} />
			<Suspense fallback={<h1>loading</h1>}>
				<MessagesSection conversation={conversation!} />
			</Suspense>
			<Suspense fallback={<h1>loading</h1>}>
				{conversation && conversation.status !== "closed" ? (
					<MessageInput conversation={conversation!} />
				) : null}
				{/* <RichMessageInput /> */}
			</Suspense>
			<p className="text-xs text-muted-foreground text-center">
				This conversation will be closed in 30 minutes
			</p>
		</div>
	) : (
		<div className="py-4 w-full h-full px-2 gap-2 flex flex-col">
			<div className="flex justify-center items-center h-full">
				<p className="text-muted-foreground">No conversation selected</p>
			</div>
		</div>
	);
}
