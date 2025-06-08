import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserStoreInitializer } from "@/providers/UserStoreInitializer";
export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<QueryProvider>
			<UserStoreInitializer>
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
					<AppSidebar />
					<main className="flex-1 relative">{children}</main>
					<Toaster position="top-right" />
				</SidebarProvider>
			</UserStoreInitializer>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryProvider>
	);
}
