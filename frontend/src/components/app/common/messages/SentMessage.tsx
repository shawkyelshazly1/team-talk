import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import moment from "moment";

export default function SentMessage({ message }: { message: Message }) {
	return (
		<div className="flex flex-row-reverse gap-1 w-fit max-w-2/3 ml-auto">
			{/* <Avatar className="w-10 h-10">
				<AvatarImage
					loading="lazy"
					src={message.sender.image ?? ""}
					alt="User avatar"
				/>
				<AvatarFallback>{message.sender.name?.charAt(0)}</AvatarFallback>
			</Avatar> */}
			<div className="flex flex-col gap-1 ml-auto">
				{/* <p className="text-sm font-medium ml-auto capitalize">
					{message.sender.name}
				</p> */}
				<p className="text-sm text-foreground bg-[#ecf3fe] rounded-lg p-2 break-words">
					{message.content}
				</p>
				<p className="text-xs text-muted-foreground ">
					{moment(message.createdAt).format("h:mm A")}
				</p>
			</div>
		</div>
	);
}
