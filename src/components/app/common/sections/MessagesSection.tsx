"use client";

import { JSX, useEffect, useRef, useState } from "react";
import NewMessages from "../buttons/NewMessages";
import EventMessage from "../messages/EventMessage";
import SentMessage from "../messages/SentMessage";
import ReceivedMessage from "../messages/ReceivedMessage";

export default function MessagesSection() {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [messages, setMessages] = useState<JSX.Element[]>([
		// TODO: remove this
		<SentMessage key={0} />,
		<ReceivedMessage key={1} />,
		<ReceivedMessage key={2} />,
		<ReceivedMessage key={3} />,
		<ReceivedMessage key={4} />,
		<ReceivedMessage key={5} />,
		<ReceivedMessage key={6} />,
		<ReceivedMessage key={7} />,
		<ReceivedMessage key={8} />,
		<ReceivedMessage key={9} />,
		<ReceivedMessage key={10} />,
		<ReceivedMessage key={11} />,
		<ReceivedMessage key={12} />,
		<ReceivedMessage key={13} />,
		<ReceivedMessage key={14} />,
		<ReceivedMessage key={15} />,
		<ReceivedMessage key={16} />,
		<ReceivedMessage key={17} />,
		<SentMessage key={18} />,
		<SentMessage key={19} />,
	]);
	const [isMessagesEndRefInView, setIsMessagesEndRefInView] = useState(false);
	const [isNewMessages, setIsNewMessages] = useState(false);

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
		<div className="flex-1   overflow-y-auto gap-3 flex-col-reverse flex w-full pt-2 px-2">
			<div ref={messagesEndRef}></div>
			{messages}
			<EventMessage />
			{/* FIXME: FIX THIS ON MESSAGES FETCHING  */}
			{isNewMessages && <NewMessages scrollToBottom={scrollToBottom} />}
		</div>
	);
}
