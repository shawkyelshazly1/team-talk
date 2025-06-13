import SubmitAsButton from "./buttons/SubmitAsButton";
import OpenTicketButton from "./buttons/OpenTicketButton";
import StatusBagde from "../../common/badges/StatusBagde";
import AgentInfoAvatar from "../../common/cards/AgentInfoAvatar";
import type { Conversation, User } from "@shared/types";
import { useSession } from "@/lib/auh/auth-client";
import TeamleaderInfoAvatar from "../../common/cards/TeamleaderInfoAvatar";

export default function ChatHeader({
	conversation,
}: {
	conversation: Conversation;
}) {
	const { data: session } = useSession();

	return (
		<div className="flex flex-row items-center justify-between border-b border-border pb-4 w-full">
			<div className="flex flex-row gap-2 w-full">
				{conversation.agent.id === session?.user?.id ? null : (
					<AgentInfoAvatar conversation={conversation} />
				)}
				<StatusBagde conversation={conversation} />
				<div className="flex flex-row gap-2 items-center mx-auto">
					<h2 className="text-sm font-medium">Assignee: </h2>
					{conversation.assignee ? (
						<TeamleaderInfoAvatar teamleader={conversation.assignee} />
					) : (
						<h2 className="text-sm font-medium">-</h2>
					)}
				</div>
			</div>
			<div className="flex flex-row gap-2">
				<OpenTicketButton conversation={conversation} />
				{conversation?.status !== "closed" &&
					session?.user?.role !== ("csr" as User["role"]) &&
					conversation.assignee?.id === session?.user?.id && (
						<SubmitAsButton conversation={conversation} />
					)}
			</div>
		</div>
	);
}
