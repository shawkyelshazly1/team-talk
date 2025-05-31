"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Suspense, useEffect } from "react";
import NewConversationModal from "./NewConversationModal";
import InboxConversationsContainer from "./InboxConversationsContainer";
import { Conversation } from "@/lib/types";
import { setSelectedConversation } from "@/stores/features/conversation/conversationSlice";
import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { useReadCache } from "@/services/readCache";

export default function InboxConversationsArea() {
	const statuses = [
		"active",
		"pending",
		"solved",
		"closed",
	] as Conversation["status"][];

	const dispatch = useDispatch();

	// clear state when navigating to a different route
	useEffect(() => {
		return () => {
			dispatch(setSelectedConversation(""));
		};
	}, []);

	

	return (
		<div className="h-[100vh] flex-1 py-4 border-r border-border w-1/2 lg:w-1/3 px-1 justify-between flex flex-col gap-4">
			<Tabs defaultValue="active_conversations" className="w-full ">
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
	);
}
