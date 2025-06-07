"use client";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@shared/types";
import { cn } from "@/lib/utils";

interface StatusBagdeProps {
	status?: Conversation["status"];
}

export default function StatusBagde({
	conversation,
}: {
	conversation: Conversation;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"bg-[#4A90E2] text-white font-medium rounded-full text-sm w-18 text-center h-fit my-auto py-1 capitalize",
				conversation?.status! === "pending" && "bg-[#F5A623]",
				conversation?.status! === "active" && "bg-[#4A90E2]",
				conversation?.status! === "solved" && "bg-[#27AE60]",
				conversation?.status! === "closed" && "bg-black/70"
			)}
		>
			{conversation?.status!}
		</Badge>
	);
}
