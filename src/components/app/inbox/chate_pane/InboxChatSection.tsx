import { Suspense } from "react";
import InboxChatHeader from "./InboxChatHeader";
import MessagesSection from "../../common/sections/MessagesSection";
import MessageInput from "../../common/message_inputs/MessageInput";
export default function InboxChatSection() {
	return (
		<div className="  h-[100vh] py-4 w-1/2 lg:w-2/3 px-2 gap-2 flex flex-col">
			<InboxChatHeader />
			<Suspense fallback={<h1>loading</h1>}>
				<MessagesSection />
			</Suspense>
			<Suspense fallback={<h1>loading</h1>}>
				<MessageInput />
				{/* <RichMessageInput /> */}
			</Suspense>
			<p className="text-xs text-muted-foreground text-center">
				This conversation will be closed in 30 minutes
			</p>
		</div>
	);
}
