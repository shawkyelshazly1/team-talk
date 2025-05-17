import {
	Dialog,
	DialogDescription,
	DialogTitle,
	DialogHeader,
	DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SelectTopicMenu from "../menus/SelectTopicMenu";

type TopicsModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	setStatus: (status: "solved" | "pending") => void;
	statusHolder: "solved" | "pending" | "";
	selectedTopic: string;
	setSelectedTopic: (topic: string) => void;
};

export default function TopicsModal({
	open,
	setOpen,
	setStatus,
	statusHolder,
	selectedTopic,
	setSelectedTopic,
}: TopicsModalProps) {
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
					disabled={!selectedTopic}
					className=" w-fit mx-auto cursor-pointer capitalize"
					onClick={() => {
						if (selectedTopic) {
							setOpen(false);
							setStatus(statusHolder as "solved" | "pending");
						}
					}}
				>
					set as {statusHolder}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
