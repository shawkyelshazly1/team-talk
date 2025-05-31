"use client";
import {
	clearBasket,
	selectUserStatus,
	setUserStatus,
} from "@/stores/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { setSelectedConversation } from "@/stores/features/conversation/conversationSlice";

export default function SidebarStatusSelector() {
	const dispatch = useDispatch();
	const userStatus = useSelector(selectUserStatus);
	const router = useRouter();

	const removeAllParamsFromUrl = () => {
		const newUrl = `${window.location.pathname}`;
		window.history.pushState({}, "", newUrl);
	};

	return (
		<>
			<DropdownMenuItem
				onClick={() => {
					dispatch(setUserStatus({ status: "online" }));
				}}
				className={cn("cursor-pointer hover:bg-sidebar-accent p-0")}
			>
				<div
					className={cn(
						"flex flex-row gap-1 items-center  w-full p-2  rounded-sm",
						userStatus === "online" && "bg-black/70  text-white"
					)}
				>
					<span className="bg-green-500  h-4 w-4 rounded-full"></span>
					<span className="text-sm font-medium">Online</span>
				</div>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => {
					dispatch(setUserStatus({ status: "offline" }));
					dispatch(clearBasket());
					dispatch(setSelectedConversation(""));
					// TODO: unassign conversations on server side
					// remove all params from the url
					removeAllParamsFromUrl();
				}}
				className={cn("cursor-pointer hover:bg-sidebar-accent p-0")}
			>
				<div
					className={cn(
						"flex flex-row gap-1 items-center w-full p-2  rounded-sm",
						userStatus === "offline" && "bg-black/70  text-white"
					)}
				>
					<span className="bg-black  h-4 w-4 rounded-full"></span>
					<span className="text-sm font-medium">Offline</span>
				</div>
			</DropdownMenuItem>
		</>
	);
}
