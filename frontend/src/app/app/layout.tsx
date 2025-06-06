import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { ConversationProvider } from "../../contexts/ConversationContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "../../contexts/UserContext";
import { AppProvider } from "@/contexts/AppContext";
export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<AppProvider>
			<UserProvider>
				<QueryProvider>
					<SidebarProvider
						style={
							{
								"--sidebar-width": "15rem",
								"--sidebar-width-mobile": "15rem",
								"--sidebar-width-icon": "3.5rem",
							} as React.CSSProperties
						}
						defaultOpen={true}
					>
						<ConversationProvider>
							<AppSidebar />
							<main className="flex-1 relative">{children}</main>
						</ConversationProvider>
						<Toaster position="top-right" />
					</SidebarProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryProvider>
			</UserProvider>
		</AppProvider>
	);
}
