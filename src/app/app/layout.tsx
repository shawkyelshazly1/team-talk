import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Providers from "../../stores/provider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { ConversationProvider } from "../contexts/ConversationContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
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
		</Providers>
	);
}
