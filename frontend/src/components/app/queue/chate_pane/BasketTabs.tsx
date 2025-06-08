"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBasket } from "@/hooks/use-basket";
import { useUIStore } from "@/stores/useUIStore";

export default function BasketTabs() {
	const { basketConversations } = useBasket();

	const { selectedConversationId } = useUIStore();

	// set the conversation id in the url params
	const setConversationIdInParams = (conversationId: string) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set("conversation_id", conversationId);
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	return (
		<div className="flex flex-row justify-between gap-0 w-full max-w-[90vw] items-center">
			{basketConversations.map((conversation) => (
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
