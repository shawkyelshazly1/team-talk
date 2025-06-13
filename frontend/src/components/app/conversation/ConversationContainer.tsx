"use client";

import { Suspense, useEffect } from "react";

import { useLoadConversationById } from "@/services/queries/conversation";
import { SyncLoader } from "react-spinners";
import ChatHeader from "../queue/chate_pane/ChatHeader";
import MessagesSection from "../common/sections/MessagesSection";
import MessageInput from "../common/message_inputs/MessageInput";
import { useConversationSocket } from "@/hooks/use-conversation-socket";
import type { User } from "@shared/types";
import { useUserStore } from "@/stores/useUserStore";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function ConversationContainer({
	conversationId,
}: {
	conversationId: string;
}) {
	const { data: conversation, isLoading: isConversationLoading } =
		useLoadConversationById(conversationId ?? "");

	useEffect(() => {
		if (!conversation && !isConversationLoading) {
			toast.error("Conversation not found");
			redirect("/app");
		}
	}, [conversation, isConversationLoading]);

	const { user } = useUserStore();

	useConversationSocket({
		conversationId:
			conversationId && !isConversationLoading ? conversationId : "",
	});

	return isConversationLoading ? (
		<div className="flex justify-center items-center h-full">
			<SyncLoader size={10} color="#000" />
		</div>
	) : !conversation ? (
		<div className="flex justify-center items-center h-full">
			<h1>Conversation not found</h1>
		</div>
	) : (
		<>
			<ChatHeader conversation={conversation!} />
			<Suspense fallback={<h1>loading</h1>}>
				<MessagesSection conversation={conversation!} />
			</Suspense>
			<Suspense fallback={<h1>loading</h1>}>
				{conversation && conversation.status !== "closed" ? (
					(user?.role === ("csr" as User["role"]) &&
						user.id === conversation.agent.id) ||
					user?.role === ("team_lead" as User["role"]) ? (
						<MessageInput conversation={conversation!} />
					) : null
				) : null}
				{/* <RichMessageInput /> */}
			</Suspense>
			<p className="text-xs text-muted-foreground text-center">
				This conversation will be closed in 30 minutes
			</p>
		</>
	);
}
