"use client";

import TopicsModal from "@/components/app/common/dialogs/TopicsModal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function SubmitAsButton() {
	const [selectedTopic, setSelectedTopic] = useState<string>("");
	const [status, setStatus] = useState<"solved" | "pending" | "">("");
	const [statusHolder, setStatusHolder] = useState<"solved" | "pending" | "">(
		""
	);

	const [isOpenTopicsModal, setIsOpenTopicsModal] = useState(false);
	return (
		<>
			<Select
				value={status}
				onValueChange={(value) => {
					setStatusHolder(value as "solved" | "pending");
					setIsOpenTopicsModal(true);
				}}
			>
				<SelectTrigger className="w-[120px] cursor-pointer bg-black/80 text-white font-semibold placeholder:text-white data-[placeholder]:text-white mb-1 mr-1 rounded-lg">
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
				selectedTopic={selectedTopic}
				setSelectedTopic={setSelectedTopic}
			/>
		</>
	);
}
