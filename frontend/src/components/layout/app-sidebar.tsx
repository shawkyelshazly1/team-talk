import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import SideBarLogo from "./sidebar-header";
import SidebarUserFooter from "./sidebar-footer";
import SidebarMenuLinks from "./sidebar-menu";

export async function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SideBarLogo />

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenuLinks />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarUserFooter />
		</Sidebar>
	);
}
