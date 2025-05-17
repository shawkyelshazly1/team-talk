// import RichMessageInput from "./message_input/RichMessageInput";
import ChatHeader from "./ChatHeader";
import { Suspense } from "react";
import MessagesSection from "../../common/sections/MessagesSection";
import MessageInput from "../../common/message_inputs/MessageInput";
export default function ChatSection() {
	return (
		<div className="  h-[100vh] py-4 w-1/2 lg:w-2/3 px-2 gap-2 flex flex-col">
			<ChatHeader />
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
