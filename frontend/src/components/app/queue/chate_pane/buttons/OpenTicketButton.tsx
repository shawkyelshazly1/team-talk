"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Conversation } from "@shared/types";

export default function OpenTicketButton({
	conversation,
}: {
	conversation: Conversation;
}) {
	return conversation?.ticketLink ? (
		<Link
			href={conversation?.ticketLink}
			target="_blank"
			className="cursor-pointer"
		>
			<Button
				variant="default"
				className="bg-blue-500 font-medium hover:bg-blue-600 cursor-pointer" 
			>
				Open Ticket
			</Button>
		</Link>
	) : null;
}
