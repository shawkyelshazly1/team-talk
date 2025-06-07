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
		<Button
			variant="default"
			className="bg-blue-500 font-medium hover:bg-blue-600"
		>
			<Link href={conversation?.ticketLink} target="_blank">
				Open Ticket
			</Link>
		</Button>
	) : null;
}
