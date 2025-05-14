import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ActiveConversationsContainer from "./ActiveConversationsContainer";
import PendingConversationsContainer from "./PendingConversationsContainer";

export default function ConversationsArea() {
	return (
		<div className="min-h-screen flex-1 py-4 border-r border-border w-1/2 lg:w-1/3 px-1">
			<Tabs defaultValue="active_conversations" className="w-full">
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
							"data-[state=active]:cursor-auto cursor-pointer data-[state=active]:bg-black/80 data-[state=active]:text-white"
						)}
					>
						Pending
					</TabsTrigger>
				</TabsList>
				<TabsContent value="active_conversations">
					<ActiveConversationsContainer />
				</TabsContent>
				<TabsContent value="pending_conversations">
					<PendingConversationsContainer />
				</TabsContent>
			</Tabs>
		</div>
	);
}
