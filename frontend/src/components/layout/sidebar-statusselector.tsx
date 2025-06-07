"use client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";
import { useUserContext } from "@/contexts/UserContext";
import { useAppContext } from "@/contexts/AppContext";
import { UserStatus } from "@/lib/types";
import { useSocket } from "@/hooks/use-socket";
import toast from "react-hot-toast";

export default function SidebarStatusSelector() {
	const { clearBasket } = useAppContext();
	const { userStatus } = useUserContext();
	const { setSelectedConversationId } = useConversationContext();
	const { socket, isConnected } = useSocket();

	const removeAllParamsFromUrl = () => {
		const newUrl = `${window.location.pathname}`;
		window.history.pushState({}, "", newUrl);
	};

	const handleSetStatus = (status: UserStatus) => {
		if (socket && isConnected) {
			socket.emit("set_status", { status });
		} else {
			toast.error("Failed to set status");
		}
	};

	return (
		<>
			<DropdownMenuItem
				onClick={() => {
					handleSetStatus("online");
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
					handleSetStatus("offline");
					// TODO: unassign conversations on server side
					// clearBasket();
					// setSelectedConversationId("");
					// remove all params from the url
					// removeAllParamsFromUrl();
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
