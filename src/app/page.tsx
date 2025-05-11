import { SignInButton } from "@/components/auth/sign-in-button";

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold">Welcome</h1>
					<p className="mt-2 text-gray-600">Sign in to get started</p>
				</div>
				<SignInButton />
			</div>
		</div>
	);
}
