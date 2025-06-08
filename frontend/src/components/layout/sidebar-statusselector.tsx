"use client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@shared/types";
import { useSocket } from "@/hooks/use-socket";
import toast from "react-hot-toast";
import { useUserStore } from "@/stores/useUserStore";
import { useUIStore } from "@/stores/useUIStore";
import { useBasket } from "@/hooks/use-basket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SidebarStatusSelector() {
	const router = useRouter();
	const { clearBasket } = useBasket();
	const { userStatus } = useUserStore();
	const { setSelectedConversationId } = useUIStore();
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
	// handle when goes online and not on queue view for team leader event triggered from socketEvents
	useEffect(() => {
		const handleForceNavigate = (event: CustomEvent) => {
			router.push(event.detail.path);
		};

		window.addEventListener(
			"force-navigate",
			handleForceNavigate as EventListener
		);

		return () => {
			window.removeEventListener(
				"force-navigate",
				handleForceNavigate as EventListener
			);
		};
	}, [router]);

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
					// FIXME: unassign conversations on server side
					clearBasket();
					setSelectedConversationId("");
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
