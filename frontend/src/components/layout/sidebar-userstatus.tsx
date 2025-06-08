"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { useUserStore } from "@/stores/useUserStore";

export default function SidebarUserStatus() {
	const { userStatus } = useUserStore();
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
