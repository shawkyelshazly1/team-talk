"use client";
import { ConversationSearchResults, User } from "@/lib/types";

import moment from "moment";
import MessageResult from "./MessageResult";
import UserInfoAvatar from "./UserInfoAvatar";
import { useSession } from "@/lib/auh/auth-client";
import { useRouter } from "next/navigation";

export default function ConversationsSearchResultCard({
	conversation,
}: {
	conversation: ConversationSearchResults;
}) {
	const router = useRouter();

	const { data: session } = useSession();

	return (
		<div
			className="flex flex-col w-full gap-4 bg-white rounded-lg hover:bg-gray-200 p-4 cursor-pointer shadow-md"
			onClick={() => {
				session?.user?.role === ("team_lead" as User["role"])
					? router.push(`/app/queue/?conversation_id=${conversation.id}`)
					: router.push(`/app/inbox/?conversation_id=${conversation.id}`);
			}}
		>
			<div className="flex flex-row justify-between">
				<UserInfoAvatar user={conversation.agent} />
				<p className="text-sm text-gray-500">
					{moment().isSame(conversation.message?.createdAt, "day")
						? moment(conversation.message?.createdAt).format("h:mm A")
						: moment(conversation.message?.createdAt).format("MMM D, h:mm A")}
				</p>
			</div>
			<div className="">
				<span className="text-sm text-gray-600 font-medium">
					{conversation.message?.sender.name}:{" "}
				</span>

				<MessageResult message={conversation.message} />
			</div>
		</div>
	);
}
