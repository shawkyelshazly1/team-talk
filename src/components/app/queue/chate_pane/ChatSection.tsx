"use client";
// import RichMessageInput from "./message_input/RichMessageInput";
import ChatHeader from "./ChatHeader";
import { Suspense } from "react";
import MessagesSection from "../../common/sections/MessagesSection";
import MessageInput from "../../common/message_inputs/MessageInput";
import { useSelector } from "react-redux";
import {
	selectBasket,
	selectUserStatus,
} from "@/stores/features/user/userSlice";
import { SyncLoader } from "react-spinners";
export default function ChatSection() {
	const basket = useSelector(selectBasket);
	const userStatus = useSelector(selectUserStatus);
	return (
		<div className="  h-[100vh] py-4 w-1/2 lg:w-2/3 px-2 gap-2 flex flex-col">
			{userStatus === "online" && basket.length === 0 ? (
				<div className="w-full h-full flex flex-col items-center justify-center gap-2">
					<h1 className="text-2xl font-bold">Queue is empty</h1>
					<SyncLoader size={10} color="#000" />
				</div>
			) : (
				<>
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
				</>
			)}
		</div>
	);
}
