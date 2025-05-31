"use client";

import TopicsModal from "@/components/app/common/dialogs/TopicsModal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Conversation } from "@/lib/types";

export default function SubmitAsButton({
	conversation,
}: {
	conversation: Conversation;
}) {
	const [status, setStatus] = useState<"pending" | "solved" | "">("");
	const [statusHolder, setStatusHolder] = useState<Conversation["status"] | "">(
		""
	);

	// set status from conversation on conversation change
	useEffect(() => {
		if (["pending", "solved"].includes(conversation?.status ?? "")) {
			setStatus(conversation?.status as "pending" | "solved" | "");
		} else {
			setStatus("");
		}
	}, [conversation]);

	const [isOpenTopicsModal, setIsOpenTopicsModal] = useState(false);
	return (
		<>
			<Select
				value={status! as string}
				onValueChange={(value) => {
					setStatusHolder(value as "solved" | "pending");
					setIsOpenTopicsModal(true);
				}}
			>
				<SelectTrigger
					className={cn(
						" w-[120px] cursor-pointer bg-black/80  text-white font-semibold placeholder:text-white data-[placeholder]:text-white mb-1 mr-1 rounded-lg",
						status === "solved" && "bg-[#27AE60]",
						status === "pending" && "bg-[#F5A623]"
					)}
					disabled={conversation?.status === "closed"}
				>
					<SelectValue
						placeholder="Submit as"
						className="text-white placeholder:text-white"
					/>
				</SelectTrigger>
				<SelectContent className="bg-black border-0 text-white">
					<SelectItem
						value="solved"
						className="cursor-pointer text-white bg-black/80 font-medium"
					>
						Solved
					</SelectItem>
					<SelectItem
						value="pending"
						className="cursor-pointer text-white bg-black/80 font-medium"
					>
						Pending
					</SelectItem>
				</SelectContent>
			</Select>

			<TopicsModal
				open={isOpenTopicsModal}
				setOpen={setIsOpenTopicsModal}
				setStatus={setStatus}
				statusHolder={statusHolder}
			/>
		</>
	);
}
