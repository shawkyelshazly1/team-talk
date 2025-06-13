import type { Message } from "@shared/types";
import moment from "moment";

export default function SentMessage({
	message,
	nextMessage,
}: {
	message: Message;
	nextMessage: Message | null;
}) {
	const isSameSenderNext = message.sender.id === nextMessage?.sender.id;
	return (
		<div className="flex flex-row-reverse gap-1 w-fit max-w-2/3 ml-auto break-all">
			<div className="flex flex-col gap-1 ml-auto">
				<p className="text-sm text-foreground bg-[#ecf3fe] rounded-lg p-2">
					{message.content}
				</p>
				{isSameSenderNext ? null : (
					<p className="text-xs text-muted-foreground ml-auto">
						{moment(message.createdAt).format("h:mm A")}
					</p>
				)}
			</div>
		</div>
	);
}
