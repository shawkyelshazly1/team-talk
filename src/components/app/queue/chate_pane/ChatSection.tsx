"use client";
// import RichMessageInput from "./message_input/RichMessageInput";
import { useSelector } from "react-redux";
import {
	selectBasket,
	selectUserStatus,
} from "@/stores/features/user/userSlice";
import { SyncLoader } from "react-spinners";
import BasketTabs from "./BasketTabs";
import ChatContainer from "./ChatContainer";
import { useEffect } from "react";
export default function ChatSection() {
	const basket = useSelector(selectBasket);
	const userStatus = useSelector(selectUserStatus);

	useEffect(() => {
		// on first load, set the conversation id for 1st in basket in the url params
		if (basket.length > 0 && userStatus === "online") {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set("conversation_id", basket[0].id);
			const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
			window.history.pushState({}, "", newUrl);
		}
	}, []);

	return userStatus === "online" ? (
		<div className="  h-[100vh] pb-4 pt-1 w-full px-2 gap-2 flex flex-col">
			{userStatus === "online" && basket.length === 0 ? (
				<div className="w-full h-full flex flex-col items-center justify-center gap-2">
					<h1 className="text-2xl font-bold">Queue is empty</h1>
					<SyncLoader size={10} color="#000" />
				</div>
			) : (
				<>
					<BasketTabs />
					<ChatContainer />
				</>
			)}
		</div>
	) : null;
}
