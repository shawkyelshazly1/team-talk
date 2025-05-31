"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auh/auth-client";
import { FaGithub } from "react-icons/fa";

export function SignInButtonGithub() {
	return (
		<Button
			onClick={async () => {
				await signIn.social({
					provider: "github",
					callbackURL: "/app",
					newUserCallbackURL: "/app",
				});
			}}
			variant="outline"
			className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 hover:cursor-pointer"
		>
			<FaGithub size={40} />
			<span className="font-medium">Sign in with GitHub</span>
		</Button>
	);
}
