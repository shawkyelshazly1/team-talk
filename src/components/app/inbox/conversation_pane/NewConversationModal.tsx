import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewConversationModal() {
	return (
		<Dialog>
			<DialogTrigger className="w-full mt-auto" asChild>
				<Button className="w-full text-lg py-6 cursor-pointer ">
					Start New Conversations
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Start New Conversation</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-6 items-center w-full justify-center">
					<div className="grid w-full  items-center gap-1.5">
						<Label htmlFor="ticket_link">
							Ticket Link
							<span className="text-xs text-muted-foreground">(optional)</span>
						</Label>
						<Input
							type="url"
							id="ticket_link"
							placeholder="https://backoffice.com/tickets/123456"
						/>
					</div>
					<div className="flex flex-row w-full gap-2 items-center justify-center">
						{/* TODO: Add the logic to handle the button clicks */}
						<Button className="cursor-pointer bg-blue-600 hover:bg-blue-500">
							General Question
						</Button>
						<Button className="cursor-pointer">Start with Ticket</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
