"use client";

import { Suspense } from "react";
import MessageInput from "../../common/message_inputs/MessageInput";
import MessagesSection from "../../common/sections/MessagesSection";
import ChatHeader from "./ChatHeader";
import { useLoadConversationById } from "@/services/queries/conversation";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

export default function ChatContainer() {
	const searchParams = useSearchParams();

	const selectedConversationId = searchParams.get("conversation_id");
	const { data: conversation, isLoading: isConversationLoading } =
		useLoadConversationById(selectedConversationId ?? "");

	return isConversationLoading ? (
		<div className="flex justify-center items-center h-full">
			<SyncLoader size={10} color="#000" />
		</div>
	) : (
		<>
			<ChatHeader conversation={conversation!} />
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
		</>
	);
}
