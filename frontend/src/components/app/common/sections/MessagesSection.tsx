"use client";

import { useEffect, useRef, useState } from "react";
import NewMessages from "../buttons/NewMessages";
import EventMessage from "../messages/EventMessage";
import SentMessage from "../messages/SentMessage";
import ReceivedMessage from "../messages/ReceivedMessage";
import { useLoadConversationMessagesById } from "@/services/queries/conversation";
import type { Conversation, Message } from "@shared/types";
import { useSession } from "@/lib/auh/auth-client";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function MessagesSection({
	conversation,
}: {
	conversation: Conversation;
}) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const targetedMessageRef = useRef<string | null>(null);
	const { data: session } = useSession();

	const [messages, setMessages] = useState<Message[]>([]);
	const [isMessagesEndRefInView, setIsMessagesEndRefInView] = useState(false);
	const [isNewMessages, setIsNewMessages] = useState(false);
	const [lastKnownMessageId, setLastKnownMessageId] = useState<string | null>(
		null
	);
	const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
	const [showHighlight, setShowHighlight] = useState(true);

	// Initialize the ref once
	if (!targetedMessageRef.current && typeof window !== "undefined") {
		const urlParams = new URLSearchParams(window.location.search);
		targetedMessageRef.current = urlParams.get("targetedMessage");
	}

	const {
		data: loadedMessages,
		status,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useLoadConversationMessagesById(
		conversation?.id ?? "",
		10,
		targetedMessageRef.current ?? ""
	);

	useEffect(() => {
		if (loadedMessages) {
			setMessages(loadedMessages.pages.flatMap((page) => page.messages));

			// Scroll to targeted message after first load
			if (targetedMessageRef.current && !hasScrolledToTarget) {
				// Small delay to ensure DOM is updated
				setTimeout(() => {
					const targetElement = document.getElementById(
						`message-${targetedMessageRef.current}`
					);
					if (targetElement) {
						targetElement.scrollIntoView({
							behavior: "smooth",
							block: "center", // Centers the message in view
						});
						setHasScrolledToTarget(true);

						// Remove highlight after 4 seconds
						setTimeout(() => {
							setShowHighlight(false);
						}, 1000);
					}
				}, 100);
			}
		}
	}, [loadedMessages, hasScrolledToTarget]);

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
		if (
			messagesEndRef.current &&
			isMessagesEndRefInView &&
			!hasScrolledToTarget
		) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	// Set the new messages flag when a new message is added and the messages end ref is not in view
	useEffect(() => {
		if (messages.length === 0) return;

		const newestMessage = messages[0];

		if (
			!isMessagesEndRefInView &&
			lastKnownMessageId !== newestMessage.id &&
			newestMessage.sender.id !== session?.user?.id
		) {
			setIsNewMessages(true);
		}

		setLastKnownMessageId(newestMessage.id);
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
			{messages.map((message, idx) => {
				const isTargetedMessage = message.id === targetedMessageRef.current;

				return (
					<div
						key={message.id}
						id={isTargetedMessage ? `message-${message.id}` : undefined}
						className={`
						${isTargetedMessage ? "transition-all duration-500 ease-in-out rounded-lg" : ""}
						${isTargetedMessage && showHighlight ? "bg-yellow-100" : ""}
					`}
					>
						{message.sender.id === session?.user?.id ? (
							<SentMessage
								key={message.id}
								message={message}
								nextMessage={messages[idx - 1] ?? null}
							/>
						) : (
							<ReceivedMessage
								key={message.id}
								message={message}
								prevMessage={messages[idx + 1] ?? null}
								nextMessage={messages[idx - 1] ?? null}
							/>
						)}
					</div>
				);
			})}
			<EventMessage />
			{isNewMessages && <NewMessages scrollToBottom={scrollToBottom} />}
			{hasNextPage && (
				<div className="flex justify-center items-center mt-2">
					<Button
						className="cursor-pointer w-[8rem]"
						onClick={() => {
							targetedMessageRef.current = "";
							fetchNextPage();
						}}
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
