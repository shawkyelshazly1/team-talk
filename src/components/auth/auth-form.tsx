import Link from "next/link";
import { SignInButtonGithub } from "./sign-in-button-github";
import Image from "next/image";
import { SignInButtonGoogle } from "./sign-in-button-google";

export default function AuthForm() {
	return (
		<div className=" h-fit w-full flex flex-col  p-4 max-w-92 m-auto">
			<div className="flex flex-col  ">
				<Link href="/" aria-label="go home">
					<Image
						src="/logo.png"
						alt="logo"
						width={100}
						height={100}
						className="w-15"
					/>
				</Link>
				<h1 className="mb-1 mt-4 text-xl font-semibold">
					Sign In to Team Talk
				</h1>
				<p>Welcome back! Sign in to continue</p>
			</div>

			<div className="mt-6 flex flex-col gap-2 items-center justify-center w-full">
				{/* <SignInButtonGithub /> */}
				<SignInButtonGoogle />
			</div>
		</div>
	);
}
