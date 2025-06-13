import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import SideBarLogo from "./sidebar-header";
import SidebarUserFooter from "./sidebar-footer";
import SidebarMenuLinks from "./sidebar-menu";
import CustomSidebarTrigger from "./CustomSidebarTrigger";

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
