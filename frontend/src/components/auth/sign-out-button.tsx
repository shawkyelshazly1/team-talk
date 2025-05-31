"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auh/auth-client";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";
export function SignOutButton() {
	const router = useRouter();
	return (
		<span
			className="flex items-center gap-2 w-full cursor-pointer"
			onClick={async () => {
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push("/");
						},
					},
				});
			}}
		>
			<LogOut />
			Log out
		</span>
	);
}
