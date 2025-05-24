"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OpenTicketButton() {
	return (
		<Button
			variant="default"
			className="bg-blue-500 font-medium hover:bg-blue-600"
		>
			<Link href="#" target="_blank">
				Open Ticket
			</Link>
		</Button>
	);
}
