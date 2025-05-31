import { Badge } from "@/components/ui/badge";
export default function PendingBadge() {
	return (
		<Badge
			variant="outline"
			className="bg-[#F5A623] text-white font-medium rounded-full w-18  text-sm h-fit my-auto py-1"
		>
			Pending
		</Badge>
	);
}
