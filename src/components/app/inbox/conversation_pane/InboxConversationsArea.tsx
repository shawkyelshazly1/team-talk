import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import NewConversationModal from "./NewConversationModal";
import InboxConversationsContainer from "./InboxConversationsContainer";
import { Conversation } from "@/lib/types";

export default function InboxConversationsArea() {
	const statuses = ["active", "pending", "closed"] as Conversation["status"][];
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
							{status}
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
