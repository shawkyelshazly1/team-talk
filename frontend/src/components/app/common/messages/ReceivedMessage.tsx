import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColorFromUsername } from "@/lib/utils";
import type { Message } from "@shared/types";

export default function ReceivedMessage({ message }: { message: Message }) {
	return (
		<div className="flex flex-row gap-1 w-fit max-w-2/3">
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
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium capitalize">{message.sender.name}</p>
				<p className="text-sm text-muted-foreground bg-[#f2f2f2] rounded-lg p-2">
					{message.content}
				</p>
				<p className="text-xs text-muted-foreground ml-auto">2:30 PM</p>
			</div>
		</div>
	);
}
