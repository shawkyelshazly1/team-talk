import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColorFromUsername } from "@/lib/utils";
import type { User } from "@shared/types";

export default function UserInfoAvatar({ user }: { user: User }) {
	return (
		<div className="flex items-center gap-2">
			<Avatar>
				<AvatarImage src={user?.image ?? ""} />
				<AvatarFallback
					className="uppercase"
					style={{
						backgroundColor: generateColorFromUsername(user?.name ?? "")
							.backgroundColor,
						color: generateColorFromUsername(user?.name ?? "").textColor,
					}}
				>
					{user?.name?.charAt(0) + user?.name?.charAt(1)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-0">
				<h3 className="text-sm font-medium">{user?.name}</h3>
				<h3 className="text-sm  text-gray-500">{user?.email}</h3>
			</div>
		</div>
	);
}
