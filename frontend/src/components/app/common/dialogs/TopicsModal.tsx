import {
	Dialog,
	DialogDescription,
	DialogTitle,
	DialogHeader,
	DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SelectTopicMenu from "../menus/SelectTopicMenu";
import type { Conversation } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSetConversationStatus } from "@/services/mutations/conversation";
import { ClipLoader } from "react-spinners";
import { useUIStore } from "@/stores/useUIStore";
import { useParams } from "next/navigation";
import { useLoadConversationById } from "@/services/queries/conversation";

type TopicsModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	setStatus: (status: "solved" | "pending") => void;
	statusHolder: Conversation["status"] | "";
};

export default function TopicsModal({
	open,
	setOpen,
	setStatus,
	statusHolder,
}: TopicsModalProps) {
	const { selectedConversationId } = useUIStore();
	const params = useParams();
	const conversationId = params.id as string;

	// Get conversation data from React Query cache
	const { data: selectedConversation } = useLoadConversationById(
		selectedConversationId || conversationId
	);

	const queryClient = useQueryClient();

	const [selectedTopic, setSelectedTopic] = useState<string>(
		selectedConversation?.topic ?? ""
	);

	const { mutate: setConversationStatus, isPending } =
		useSetConversationStatus(queryClient);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change Status</DialogTitle>
					<DialogDescription>
						Select a topic to change the status of the ticket
					</DialogDescription>
				</DialogHeader>
				<SelectTopicMenu
					selectedTopic={selectedTopic}
					setSelectedTopic={setSelectedTopic}
				/>
				<Button
					variant="default"
					disabled={!selectedTopic || isPending}
					className=" min-w-[150px] mx-auto cursor-pointer capitalize"
					onClick={() => {
						if (selectedTopic && (selectedConversation?.id || conversationId)) {
							setConversationStatus(
								{
									conversationId: selectedConversation?.id || conversationId,
									status: statusHolder as "solved" | "pending",
									topic: selectedTopic,
								},
								{
									onSuccess: () => {
										setOpen(false);
									},
								}
							);
						}
					}}
				>
					{isPending ? (
						<ClipLoader color="#fff" size={25} />
					) : (
						`set as ${statusHolder}`
					)}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
