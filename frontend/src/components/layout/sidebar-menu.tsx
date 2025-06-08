"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Inbox, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";

// Team_lead Menu items.
const team_lead_menu_items = [
	{
		title: "Chat",
		url: "/app",
		icon: Inbox,
	},
];

// CSR Menu items.
const csr_menu_items = [
	{
		title: "Inbox",
		url: "/app/inbox",
		icon: Inbox,
	},
	{
		title: "Search",
		url: "/app/search",
		icon: Search,
	},
];
export default function SidebarMenuLinks() {
	const { user } = useUserStore();
	const pathname = usePathname();

	const menu_items =
		user?.role === "csr" ? csr_menu_items : team_lead_menu_items;

	return (
		<SidebarMenu>
			{menu_items.map((item) => (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton
						disabled={pathname === item.url}
						asChild
						className={cn(
							pathname === item.url
								? "bg-black/80 text-white hover:bg-black/80 cursor-auto hover:text-white active:bg-black/80 active:text-white"
								: "hover:bg-black/10"
						)}
					>
						<Link
							className={cn(pathname === item.url && "pointer-events-none")}
							tabIndex={pathname === item.url ? -1 : 0}
							href={item.url}
						>
							<item.icon size={20} />
							<h2 className="text-sm font-normal">{item.title}</h2>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
