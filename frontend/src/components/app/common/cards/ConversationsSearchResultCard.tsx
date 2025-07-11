"use client";
import type { ConversationSearchResults } from "@shared/types";

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
				router.push(
					`/app/conversation/${conversation.id}?targetedMessage=${conversation.message.id}`
				);
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
					{session?.user?.id !== conversation.message.sender.id
						? conversation.message?.sender.name
						: "You"}
					:{" "}
				</span>

				<MessageResult message={conversation.message} />
			</div>
		</div>
	);
}
