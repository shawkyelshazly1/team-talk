"use client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";
import { useUserContext } from "@/contexts/UserContext";
import { useAppContext } from "@/contexts/AppContext";

export default function SidebarStatusSelector() {
	const { clearBasket } = useAppContext();
	const { userStatus, setUserStatus } = useUserContext();
	const { setSelectedConversationId } = useConversationContext();

	const removeAllParamsFromUrl = () => {
		const newUrl = `${window.location.pathname}`;
		window.history.pushState({}, "", newUrl);
	};

	return (
		<>
			<DropdownMenuItem
				onClick={() => {
					setUserStatus("online");
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
					setUserStatus("offline");
					clearBasket();
					setSelectedConversationId("");
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
