import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/lib/auh/auth-client";
import { memo, useEffect, useState } from "react";

export default memo(function MyConversations({
	agentsParams,
	query,
}: {
	agentsParams: string | null;
	query: string | null;
}) {
	const { data: session } = useSession();

	let userEmail = session?.user?.email;

	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (agentsParams) {
			setChecked(agentsParams.split(",").includes(userEmail ?? ""));
		} else {
			setChecked(false);
		}
	}, [agentsParams]);

	return (
		<div className="flex items-center space-x-2">
			<Checkbox
				id="my-conversations"
				checked={checked}
				disabled={query?.trim() === undefined}
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
});
