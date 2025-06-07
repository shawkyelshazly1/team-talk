"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/lib/types";

export default function AgentInfoAvatar({
	conversation,
}: {
	conversation: Conversation;
}) {
	return (
		conversation?.agent && (
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={conversation?.agent?.image ?? ""} />
					<AvatarFallback className="uppercase">
						{conversation?.agent?.name?.charAt(0) +
							conversation?.agent?.name?.charAt(1)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-0">
					<h3 className="text-sm font-medium">{conversation?.agent?.name}</h3>
					<h3 className="text-sm  text-gray-500">
						{conversation?.agent?.email}
					</h3>
				</div>
			</div>
		)
	);
}
