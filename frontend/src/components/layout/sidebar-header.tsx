"use client";
import { useState } from "react";
import { useEffect } from "react";
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
	const [showFullText, setShowFullText] = useState(state !== "collapsed");

	useEffect(() => {
		if (state === "collapsed") {
			// Immediately show abbreviated text when collapsing
			setShowFullText(false);
		} else {
			// Delay showing full text when expanding
			const timer = setTimeout(() => {
				setShowFullText(true);
			}, 150);

			return () => clearTimeout(timer);
		}
	}, [state]);
	return (
		<SidebarHeader className="flex items-center justify-center">
			<SidebarMenu>
				<SidebarMenuItem
					className={cn(
						state === "expanded" && "flex flex-row items-center justify-between"
					)}
				>
					<SidebarMenuButton asChild>
						<div className="text-center overflow-hidden">
							<h2
								className={cn(
									"font-bold transition-all duration-300 ease-in-out text-primary text-center",
									state === "collapsed" ? "text-xl" : "text-2xl"
								)}
							>
								{showFullText ? "Team Talk" : "TT"}
							</h2>
						</div>
					</SidebarMenuButton>
					<SidebarTrigger className=" cursor-pointer" />
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
