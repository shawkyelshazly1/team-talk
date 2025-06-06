"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateConversation } from "@/services/mutations/conversation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useConversationContext } from "@/contexts/ConversationContext";

export default function NewConversationModal() {
	const [ticketLink, setTicketLink] = useState("");
	const [message, setMessage] = useState("");
	const [open, setOpen] = useState(false);
	const { setSelectedConversationId } = useConversationContext();

	const queryClient = useQueryClient();

	const { mutate: createConversation, isPending } =
		useCreateConversation(queryClient);

	const clearState = () => {
		setTicketLink("");
		setMessage("");
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
							value={ticketLink}
							onChange={(e) => setTicketLink(e.target.value)}
							type="url"
							id="ticket_link"
							placeholder="https://backoffice.com/tickets/123456"
						/>
					</div>
					<div className="grid w-full  items-center gap-1.5">
						<Label htmlFor="message">
							Message
							<span className="text-sm text-red-500">*</span>
						</Label>
						<Textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={8}
							id="message"
							placeholder="Type your message here..."
							className="max-h-50"
						/>
					</div>
					<div className="flex flex-row w-full gap-2 items-center justify-center">
						<Button
							className="cursor-pointer min-w-[10rem]"
							onClick={() => {
								if (!message.trim()) {
									toast.error("Please enter your question");
									return;
								}
								createConversation(
									{ ticketLink, message },
									{
										onSuccess: (data) => {
											clearState();
											// set the conversation as selected in store
											setSelectedConversationId(data.data.id);

											// set the conversation Id in the url
											const params = new URLSearchParams(
												window.location.search
											);
											params.set("conversation_id", data.data.id);
											window.history.pushState(
												{},
												"",
												`${window.location.pathname}?${params.toString()}`
											);
										},
									}
								);
							}}
							disabled={isPending || !message.trim()}
						>
							{isPending ? (
								<ClipLoader color="#fff" size={25} />
							) : (
								"Start Conversation"
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
