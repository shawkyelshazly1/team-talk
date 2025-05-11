"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auh/auth-client";
import { useRouter } from "next/navigation";
export function SignOutButton() {
	const router = useRouter();
	return (
		<Button
			onClick={async () => {
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push("/");
						},
					},
				});
			}}
			variant="outline"
			className="w-full flex items-center gap-2"
		>
			<LogOut className="w-5 h-5" />
			Sign out
		</Button>
	);
}
