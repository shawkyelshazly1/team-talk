"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "@/lib/auh/auth-client";

export function SignInButton() {
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
			className="w-full flex items-center gap-2"
		>
			<Github className="w-5 h-5" />
			Sign in with GitHub
		</Button>
	);
}
