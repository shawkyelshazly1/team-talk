"use client";
import { useAppSocket } from "@/hooks/use-app-socket";
import { useSession } from "@/lib/auh/auth-client";
import { useUserStore } from "@/stores/useUserStore";
import type { User } from "@shared/types";
import { useEffect } from "react";

export const UserStoreInitializer = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { data: session } = useSession();
	const { setUser } = useUserStore();
	// Initialize socket connection and URL sync
	useAppSocket();

	useEffect(() => {
		if (session?.user) {
			setUser(session.user as User);
		} else {
			setUser(null);
		}
	}, [session, setUser]);

	return <>{children}</>;
};
