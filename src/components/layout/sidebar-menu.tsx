"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Inbox, MessagesSquare, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auh/auth-client";
import Loading from "@/app/app/loading";
import { ClipLoader } from "react-spinners";

// Team_lead Menu items.
const team_lead_menu_items = [
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
	const { data: session, isPending } = useSession();
	const pathname = usePathname();
	const menu_items =
		session?.user.role === "csr" ? csr_menu_items : team_lead_menu_items;

	if (isPending)
		return (
			<div className="flex items-center justify-center h-full">
				<ClipLoader className="mx-auto" size={20} />;
			</div>
		);
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
