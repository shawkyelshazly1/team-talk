import { SignOutButton } from "@/components/auth/sign-out-button";
import { auth } from "@/lib/auh/auth";
import { headers } from "next/headers";
export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	console.log(session);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold">App!</h1>
					<SignOutButton />
				</div>
			</div>
		</div>
	);
}
