import SubmitAsButton from "./buttons/SubmitAsButton";
import OpenTicketButton from "./buttons/OpenTicketButton";
import StatusBagde from "../../common/badges/StatusBagde";
import AgentInfoAvatar from "../../common/cards/AgentInfoAvatar";
import { Conversation, User } from "@/lib/types";
import { useSession } from "@/lib/auh/auth-client";

export default function ChatHeader({
	conversation,
}: {
	conversation: Conversation;
}) {
	const { data: session } = useSession();

	return (
		<div className="flex flex-row items-center justify-between border-b border-border pb-4">
			<div className="flex flex-row gap-2">
				{conversation.agent.id === session?.user?.id ? null : (
					<AgentInfoAvatar conversation={conversation} />
				)}

				<StatusBagde conversation={conversation} />
			</div>
			<div className="flex flex-row gap-2">
				<OpenTicketButton conversation={conversation} />
				{conversation?.status !== "closed" &&
					session?.user?.role !== ("csr" as User["role"]) && (
						<SubmitAsButton conversation={conversation} />
					)}
			</div>
		</div>
	);
}
