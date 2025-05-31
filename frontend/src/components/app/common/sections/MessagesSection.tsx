"use client";

import { useEffect, useRef, useState } from "react";
import NewMessages from "../buttons/NewMessages";
import EventMessage from "../messages/EventMessage";
import SentMessage from "../messages/SentMessage";
import ReceivedMessage from "../messages/ReceivedMessage";
import { useLoadConversationMessagesById } from "@/services/queries/conversation";
import { Conversation, Message } from "@/lib/types";
import { useSession } from "@/lib/auh/auth-client";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function MessagesSection({
	conversation,
}: {
	conversation: Conversation;
}) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data: session } = useSession();

	const [messages, setMessages] = useState<Message[]>([]);
	const [isMessagesEndRefInView, setIsMessagesEndRefInView] = useState(false);
	const [isNewMessages, setIsNewMessages] = useState(false);

	const {
		data: loadedMessages,
		status,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useLoadConversationMessagesById(conversation?.id ?? "", 10);

	useEffect(() => {
		if (loadedMessages) {
			setMessages(loadedMessages.pages.flatMap((page) => page.messages));
		}
	}, [loadedMessages]);

	// Set the messages end ref observer
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			setIsMessagesEndRefInView(entry.isIntersecting);
		});

		if (messagesEndRef.current) {
			observer.observe(messagesEndRef.current);
		}
	}, []);

	// Scroll to bottom
	function scrollToBottom() {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
			setIsNewMessages(false);
		}
	}

	// Keep scrolling to bottom when the messages end ref is in view
	function keepScrollToBottom() {
		if (messagesEndRef.current && isMessagesEndRefInView) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	// Set the new messages flag when a new message is added and the messages end ref is not in view
	useEffect(() => {
		if (!isMessagesEndRefInView && messages.length > 0) {
			setIsNewMessages(true);
		}
	}, [messages]);

	// Reset the new messages flag when the messages end ref is in view
	useEffect(() => {
		if (isMessagesEndRefInView) {
			setIsNewMessages(false);
		}
	}, [isMessagesEndRefInView]);

	// Keep scrolling to bottom when new messages are added
	useEffect(() => {
		keepScrollToBottom();
	}, [messages]);

	return (
		<div className="flex-1   overflow-y-auto gap-3 flex-col-reverse flex w-full pt-2 px-2 ">
			<div ref={messagesEndRef}></div>
			{messages.map((message) => {
				if (message.sender.id === session?.user?.id) {
					return <SentMessage key={message.id} message={message} />;
				} else {
					return <ReceivedMessage key={message.id} message={message} />;
				}
			})}
			<EventMessage />
			{/* FIXME: FIX THIS ON MESSAGES FETCHING  */}
			{isNewMessages && <NewMessages scrollToBottom={scrollToBottom} />}
			{hasNextPage && (
				<div className="flex justify-center items-center mt-2">
					<Button
						className="cursor-pointer w-[8rem]"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<ClipLoader color="#fff" size={10} />
						) : (
							"Load More"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
