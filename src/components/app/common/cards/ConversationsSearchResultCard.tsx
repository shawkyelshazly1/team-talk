"use client";
import { ConversationSearchResults } from "@/lib/types";

import moment from "moment";
import MessageResult from "./MessageResult";
import UserInfoAvatar from "./UserInfoAvatar";

export default function ConversationsSearchResultCard({
	conversation,
}: {
	conversation: ConversationSearchResults;
}) {
	return (
		<div
			className="flex flex-col w-full gap-4 bg-white rounded-lg hover:bg-gray-200 p-4 cursor-pointer shadow-md"
			onClick={() => {
				// TODO: navigate to the conversation
				console.log(conversation.id);
			}}
		>
			<div className="flex flex-row justify-between">
				<UserInfoAvatar user={conversation.agent} />
				<p className="text-sm text-gray-500">
					{moment().isSame(conversation.message.createdAt, "day")
						? moment(conversation.message.createdAt).format("h:mm A")
						: moment(conversation.message.createdAt).format("MMM D, h:mm A")}
				</p>
			</div>
			<div className="">
				<span className="text-sm text-gray-600 font-medium">
					{conversation.message.sender.name}:{" "}
				</span>

				<MessageResult message={conversation.message} />
			</div>
		</div>
	);
}
