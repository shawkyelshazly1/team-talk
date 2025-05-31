import AuthForm from "@/components/auth/auth-form";
import { requireNoAuth } from "@/lib/auh/auth-utils";

export default async function HomePage() {
	await requireNoAuth();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<AuthForm />
		</div>
	);
}
