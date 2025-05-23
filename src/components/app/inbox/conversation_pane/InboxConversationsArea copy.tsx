import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import InboxActiveConversationsContainer from "./InboxActiveConversationsContainer";
import InboxClosedConversationsContainer from "./InboxClosedConversationsContainer";
import { Button } from "@/components/ui/button";
import NewConversationModal from "./NewConversationModal";

export default function InboxConversationsArea() {
	return (
		<div className="h-[100vh] flex-1 py-4 border-r border-border w-1/2 lg:w-1/3 px-1 justify-between flex flex-col gap-4">
			<Tabs defaultValue="active_conversations" className="w-full ">
				<TabsList className="w-full ">
					<TabsTrigger
						value="active_conversations"
						className={cn(
							"data-[state=active]:cursor-auto cursor-pointer data-[state=active]:bg-black/80 data-[state=active]:text-white "
						)}
					>
						Active
					</TabsTrigger>
					<TabsTrigger
						value="pending_conversations"
						className={cn(
							"data-[state=active]:cursor-auto cursor-pointer data-[state=active]:bg-black/80 data-[state=active]:text-white "
						)}
					>
						Pending
					</TabsTrigger>
					<TabsTrigger
						value="closed_conversations"
						className={cn(
							"data-[state=active]:cursor-auto cursor-pointer data-[state=active]:bg-black/80 data-[state=active]:text-white"
						)}
					>
						Closed
					</TabsTrigger>
				</TabsList>
				<TabsContent value="active_conversations">
					<Suspense fallback={<h1>loading</h1>}>
						<InboxActiveConversationsContainer />
					</Suspense>
				</TabsContent>
				<TabsContent value="pending_conversations">
					<Suspense fallback={<h1>loading</h1>}>
						<InboxPendingConversationsContainer />
					</Suspense>
				</TabsContent>
				<TabsContent value="closed_conversations">
					<Suspense fallback={<h1>loading</h1>}>
						<InboxClosedConversationsContainer />
					</Suspense>
				</TabsContent>
			</Tabs>
			<NewConversationModal />
		</div>
	);
}
