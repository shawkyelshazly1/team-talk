"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auh/auth-client";
import { FcGoogle } from "react-icons/fc";

export function SignInButtonGoogle() {
	return (
		<Button
			onClick={async () => {
				await signIn.social({
					provider: "google",
					callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/app`,
					newUserCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/app`,
				});
			}}
			className="w-full flex items-center gap-2 p-2  hover:cursor-pointer"
		>
			<FcGoogle size={50} />
			<span className="font-medium text-lg">Sign in with Google</span>
		</Button>
	);
}
