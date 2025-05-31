"use client";
import { Suspense } from "react";
import InboxChatHeader from "./InboxChatHeader";
import MessagesSection from "../../common/sections/MessagesSection";
import MessageInput from "../../common/message_inputs/MessageInput";
import { useSearchParams } from "next/navigation";
import { useLoadConversationById } from "@/services/queries/conversation";

export default function InboxChatSection() {
	const searchParams = useSearchParams();

	const conversationId = searchParams.get("conversation_id");

	const { data: conversation } = useLoadConversationById(conversationId ?? "");

	return conversationId ? (
		<div className="  h-[100vh] py-4 w-1/2 lg:w-2/3 px-2 gap-2 flex flex-col">
			<InboxChatHeader conversation={conversation!} />
			<Suspense fallback={<h1>loading</h1>}>
				<MessagesSection conversation={conversation!} />
			</Suspense>
			<Suspense fallback={<h1>loading</h1>}>
				<MessageInput conversation={conversation!} />
				{/* <RichMessageInput /> */}
			</Suspense>
			<p className="text-xs text-muted-foreground text-center">
				This conversation will be closed in 30 minutes
			</p>
		</div>
	) : (
		<div className="  h-[100vh] py-4 w-1/2 lg:w-2/3 px-2 gap-2 flex flex-col">
			<div className="flex justify-center items-center h-full">
				<p className="text-muted-foreground">No conversation selected</p>
			</div>
		</div>
	);
}
