"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auh/auth-client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyConversations() {
	const { data: session, isPending } = useSession();

	let userEmail = session?.user?.email;

	const searchParams = useSearchParams();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const agents = searchParams.get("agents");

		if (agents) {
			setChecked(agents.split(",").includes(userEmail ?? ""));
		} else {
			setChecked(false);
		}
	}, [searchParams]);

	return (
		<div className="flex items-center space-x-2">
			<Checkbox
				id="my-conversations"
				checked={checked}
				onCheckedChange={() => {
					const searchParams = new URLSearchParams(window.location.search);
					if (!checked) {
						searchParams.set("agents", userEmail ?? "");
					} else {
						searchParams.delete("agents");
					}
					const newUrl = `${
						window.location.pathname
					}?${searchParams.toString()}`;
					window.history.pushState({}, "", newUrl);
				}}
			/>
			<label
				htmlFor="my-conversations"
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				My Conversations
			</label>
		</div>
	);
}
