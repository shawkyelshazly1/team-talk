import { Conversation } from "@/lib/types";
import StatusBagde from "../../common/badges/StatusBagde";
import OpenTicketButton from "../../queue/chate_pane/buttons/OpenTicketButton";
export default function InboxChatHeader({
	conversation,
}: {
	conversation: Conversation;
}) {
	return (
		<div className="flex flex-row items-center justify-between border-b border-border pb-4">
			<div className="flex flex-row gap-2">
				<StatusBagde conversation={conversation} />
			</div>
			<div className="flex flex-row gap-2">
				<div className="flex flex-row gap-2">
					<OpenTicketButton conversation={conversation} />
				</div>
			</div>
		</div>
	);
}
