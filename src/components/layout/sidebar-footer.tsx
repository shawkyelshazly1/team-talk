import { BadgeCheck, LogOut } from "lucide-react";
import { Bell } from "lucide-react";
import React from "react";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarFooter, SidebarMenuButton } from "../ui/sidebar";
import {
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { DropdownMenu } from "../ui/dropdown-menu";
import { SidebarMenuItem } from "../ui/sidebar";
import { SidebarMenu } from "../ui/sidebar";
import { getUser } from "@/lib/auh/auth-utils";
import { ChevronsUpDown, CreditCardIcon, Sparkles } from "lucide-react";
import { SignOutButton } from "../auth/sign-out-button";
export default async function SidebarUserFooter() {
	const user = await getUser();

	if (!user) {
		return null;
	}

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image ?? ""} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side="right"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={user.image ?? ""} alt={user.name} />
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>

							<DropdownMenuSeparator />
							<DropdownMenuItem className="cursor-pointer hover:bg-sidebar-accent">
								<SignOutButton />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}
