"use client";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
export default function MessageInput() {
	const [message, setMessage] = useState("");
	return (
		<div className="border-2 border-border rounded-lg  max-h-[100px]  flex flex-row justify-between">
			<Textarea
				onChange={(e) => setMessage(e.target.value)}
				className="resize-none focus-visible:outline-none w-full  p-2  break-words  overflow-y-auto focus-visible:ring-0 focus-visible:border-0 border-0 outline-0 ring-0 ring-offset-0 shadow-none"
			/>
			<SendHorizonal
				onClick={() => {
					console.log(message);
				}}
				className=" mr-2 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer mt-auto mb-1"
				size={35}
			/>
		</div>
	);
}
