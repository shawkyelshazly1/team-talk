"use client";

import { useSelector } from "react-redux";
import { selectBasket } from "@/stores/features/user/userSlice";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BasketTabs() {
	const basket = useSelector(selectBasket);
	// FIXME: redux state causing hydration issue due to SSR-ed component
	// const selectedConversationId = useSelector(selectSelectedConversation);

	const searchParams = useSearchParams();

	const selectedConversationId = searchParams.get("conversation_id");

	// set the conversation id in the url params
	const setConversationIdInParams = (conversationId: string) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set("conversation_id", conversationId);
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	return (
		<div className="flex flex-row justify-between gap-0 w-full max-w-[90vw] items-center">
			{basket.map((conversation) => (
				<Button
					key={conversation.id}
					variant="outline"
					className={cn(
						"w-full flex-1 cursor-pointer border-b-0 shadow-none rounded-b-none",

						selectedConversationId?.toString() === conversation.id.toString()
							? "bg-black/80 text-white hover:bg-black/80 hover:text-white"
							: ""
					)}
					onClick={() => {
						setConversationIdInParams(conversation.id);
					}}
				>
					{conversation.agent.email}
				</Button>
			))}
		</div>
	);
}
