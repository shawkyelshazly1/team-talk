import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ActiveConversationsContainer from "./ActiveConversationsContainer";

export default function ConversationsArea() {
	return (
		<div className="min-h-screen flex-1 p-4 border-r border-border w-1/3 ">
			<Tabs defaultValue="account" className="w-full">
				<TabsList className="w-full">
					<TabsTrigger
						value="active"
						className={cn("data-[state=active]:cursor-auto cursor-pointer")}
					>
						Active
					</TabsTrigger>
					<TabsTrigger
						value="pending"
						className={cn("data-[state=active]:cursor-auto cursor-pointer")}
					>
						Pending
					</TabsTrigger>
				</TabsList>
				<TabsContent value="active">
					<ActiveConversationsContainer />
				</TabsContent>
				<TabsContent value="pending">pending conversations</TabsContent>
			</Tabs>
		</div>
	);
}
