import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ConversationCard() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex  flex-col gap-2 justify-between p-2 md:p-4 bg-card rounded-xl border shadow-sm hover:bg-accent/50 cursor-pointer transition-colors">
				<div className="flex flex-row justify-between w-full">
					<div className="flex flex-row gap-2">
						<Avatar className="w-10 h-10">
							<AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
							<AvatarFallback>un</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<h1 className="text-sm font-medium">John Doe</h1>
							<p className="text-xs text-muted-foreground">email@example.com</p>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">2:30 PM</p>
				</div>
				<div className="flex flex-row justify-between">
					<p className="text-xs text-muted-foreground line-clamp-2 ">
						Last message preview goes here...Last message preview goes
						here...Last message preview goes here...Last message preview goes
						here...Last message preview goes here...Last message preview goes
						here...Last message preview goes here...Last message preview goes
						here...Last message preview goes here...Last message preview goes
						here...Last message preview goes here...Last message preview goes
						here...Last message preview goes here...
					</p>
					<Badge
						variant="outline"
						className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
					>
						3
					</Badge>
				</div>
			</div>
		</div>
	);
}
