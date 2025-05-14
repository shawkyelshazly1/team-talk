"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Inbox, MessagesSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// Menu items.
const items = [
	{
		title: "Queue",
		url: "/app",
		icon: Inbox,
	},
	{
		title: "Conversations",
		url: "/app/conversations",
		icon: MessagesSquare,
	},
];
export default function SidebarMenuLinks() {
	const pathname = usePathname();
	return (
		<SidebarMenu>
			{items.map((item) => (
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
						<Link href={item.url}>
							<item.icon size={20} />
							<h2 className="text-sm font-normal">{item.title}</h2>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
