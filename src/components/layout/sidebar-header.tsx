"use client";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenu,
	SidebarHeader,
	useSidebar,
	SidebarTrigger,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";

export default function SideBarLogo() {
	const { state } = useSidebar();
	return (
		<SidebarHeader className="flex items-center justify-center">
			<SidebarMenu>
				<SidebarMenuItem
					className={cn(
						state === "expanded" && "flex flex-row items-center justify-between"
					)}
				>
					<SidebarMenuButton asChild>
						<span className="text-center">
							<h2
								className={cn(
									state === "expanded" && "hidden",
									"text-xl font-bold transition-all duration-300 text-primary text-center"
								)}
							>
								TT
							</h2>
							<h2
								className={cn(
									state === "collapsed" && "inline",
									"text-2xl font-bold transition-all duration-300 text-primary text-center"
								)}
							>
								Team Talk
							</h2>
						</span>
					</SidebarMenuButton>
					<SidebarTrigger className=" cursor-pointer" />
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
