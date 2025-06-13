import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, generateColorFromUsername } from "@/lib/utils";
import type { Message } from "@shared/types";
import moment from "moment";

export default function ReceivedMessage({
	message,
	prevMessage,
	nextMessage,
}: {
	message: Message;
	prevMessage: Message | null;
	nextMessage: Message | null;
}) {
	const isSameSender = message.sender.id === prevMessage?.sender.id;
	const isSameSenderNext = message.sender.id === nextMessage?.sender.id;
	return (
		<div className="flex flex-row gap-1 w-fit max-w-2/3 break-all">
			{isSameSender ? null : (
				<Avatar className="w-10 h-10">
					<AvatarImage
						loading="lazy"
						src={message.sender.image ?? ""}
						alt="User avatar"
					/>
					<AvatarFallback
						style={{
							backgroundColor: generateColorFromUsername(
								message.sender.name ?? ""
							).backgroundColor,
							color: generateColorFromUsername(message.sender.name ?? "")
								.textColor,
						}}
						className="uppercase"
					>
						{message.sender.name?.charAt(0) + message.sender.name?.charAt(1)}
					</AvatarFallback>
				</Avatar>
			)}

			<div className="flex flex-col gap-1">
				{isSameSender ? null : (
					<p className="text-sm font-medium capitalize">
						{message.sender.name}
					</p>
				)}
				<p
					className={cn(
						"text-sm text-muted-foreground bg-[#f2f2f2] rounded-lg p-2",
						isSameSender ? "ml-10" : "w-fit"
					)}
				>
					{message.content}
				</p>
				{isSameSenderNext ? null : (
					<p className={cn("text-xs text-muted-foreground ml-auto")}>
						{moment(message.createdAt).format("hh:mm A")}
					</p>
				)}
			</div>
		</div>
	);
}
