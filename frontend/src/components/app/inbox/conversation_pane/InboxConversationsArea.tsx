"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Suspense, useEffect } from "react";
import NewConversationModal from "./NewConversationModal";
import InboxConversationsContainer from "./InboxConversationsContainer";
import type { Conversation } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/stores/useUIStore";
import CustomSidebarTrigger from "@/components/layout/CustomSidebarTrigger";
import { useSidebar } from "@/components/ui/sidebar";

export default function InboxConversationsArea() {
	const statuses = [
		"active",
		"pending",
		"solved",
		"closed",
	] as Conversation["status"][];
	const { isMobile } = useSidebar();

	const { setSelectedConversationId } = useUIStore();

	// clear state when navigating to a different route
	useEffect(() => {
		return () => {
			setSelectedConversationId("");
		};
	}, [setSelectedConversationId]);

	return (
		<>
			<div className="py-4 border-r border-border h-full w-full 2xl:w-1/4 xl:w-1/3 lg:w-2/5 md:w-4/8 px-1 justify-between flex flex-col gap-4">
				<Tabs defaultValue="active_conversations" className=" w-full">
					<div className="flex flex-row gap-1 items-center">
						{isMobile && <CustomSidebarTrigger />}
						<TabsList className="w-full ">
							{statuses.map((status, idx) => (
								<TabsTrigger
									value={`${status}_conversations`}
									key={idx}
									className={cn(
										"data-[state=active]:cursor-auto cursor-pointer data-[state=active]:bg-black/80 data-[state=active]:text-white capitalize"
									)}
								>
									<span className="flex flex-row gap-2 items-center">
										{status}
										<Badge
											variant="default"
											className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
										>
											1
										</Badge>
									</span>
								</TabsTrigger>
							))}
						</TabsList>
					</div>
					{statuses.map((status, idx) => (
						<TabsContent value={`${status}_conversations`} key={idx}>
							<Suspense fallback={<h1>loading</h1>}>
								<InboxConversationsContainer
									status={status as Conversation["status"]}
								/>
							</Suspense>
						</TabsContent>
					))}
				</Tabs>

				<NewConversationModal />
			</div>
			<div className="md:hidden w-full h-[1px] bg-border" />
		</>
	);
}
