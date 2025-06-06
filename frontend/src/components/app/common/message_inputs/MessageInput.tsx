"use client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Conversation } from "@/lib/types";
export default function MessageInput({
	conversation,
}: {
	conversation: Conversation;
}) {
	const [message, setMessage] = useState("");

	return (
		<div className="border-2 border-border rounded-lg  max-h-[100px]  flex flex-row justify-between">
			<Textarea
				disabled={conversation?.status === "closed"}
				onChange={(e) => setMessage(e.target.value)}
				className="resize-none focus-visible:outline-none w-full  p-2  break-words  overflow-y-auto focus-visible:ring-0 focus-visible:border-0 border-0 outline-0 ring-0 ring-offset-0 shadow-none"
			/>
			<SendHorizonal
				onClick={() => {
					if (conversation?.status === "closed") {
						return;
					}
					console.log(message);
				}}
				className={cn(
					" mr-2 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer mt-auto mb-1 disabled:opacity-50",
					conversation?.status === "closed" && "opacity-50 cursor-not-allowed"
				)}
				size={35}
			/>
		</div>
	);
}
