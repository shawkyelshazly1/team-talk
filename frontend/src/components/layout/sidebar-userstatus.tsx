"use client";

import { selectUserStatus } from "@/stores/features/user/userSlice";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useSidebar } from "../ui/sidebar";

export default function SidebarUserStatus() {
	const userStatus = useSelector(selectUserStatus);
	const { state } = useSidebar();

	return (
		<span
			className={cn(
				"bg-green-500 absolute  h-3 w-3 rounded-full",
				userStatus === "online" ? "bg-green-500" : "bg-black",
				state === "expanded" ? "-top-2 -right-1" : "top-0 right-0"
			)}
		></span>
	);
}
