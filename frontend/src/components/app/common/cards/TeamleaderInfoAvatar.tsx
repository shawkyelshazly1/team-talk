"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColorFromUsername } from "@/lib/utils";
import type { TeamLeader } from "@shared/types";

export default function TeamleaderInfoAvatar({
	teamleader,
}: {
	teamleader: TeamLeader;
}) {
	return (
		teamleader && (
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={teamleader.image ?? ""} />
					<AvatarFallback
						className="uppercase"
						style={{
							backgroundColor: generateColorFromUsername(teamleader.name ?? "")
								.backgroundColor,
							color: generateColorFromUsername(teamleader.name ?? "").textColor,
						}}
					>
						{teamleader.name?.charAt(0) + teamleader.name?.charAt(1)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-0">
					<h3 className="text-sm font-medium">{teamleader.name}</h3>
					<h3 className="text-sm  text-gray-500">{teamleader.email}</h3>
				</div>
			</div>
		)
	);
}
