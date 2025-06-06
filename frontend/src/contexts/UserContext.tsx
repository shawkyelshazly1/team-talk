"use client";
import { useSession } from "@/lib/auh/auth-client";
import { User } from "@/lib/types";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export const UserContext = createContext<{
	user: User | null;
	setUser: (user: User) => void;
	userStatus: "online" | "offline";
	setUserStatus: (status: "online" | "offline") => void;
}>({
	user: null,
	setUser: () => {},
	userStatus: "offline",
	setUserStatus: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [userStatus, setUserStatus] = useState<"online" | "offline">("offline");

	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user) {
			setUser(session.user as User);
		}

		return () => {
			setUser(null);
		};
	}, [session]);

	return (
		<UserContext.Provider value={{ user, setUser, userStatus, setUserStatus }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used within an UserProvider");
	}
	return context;
};
