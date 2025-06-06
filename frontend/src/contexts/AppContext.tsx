"use client";
import { ExtendedSocket } from "@/lib/socketio/types";
import { Conversation } from "@/lib/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
	socket: ExtendedSocket | null;
	basket: Conversation[];
	isConnected: boolean;
	addToBasket: (conversation: Conversation) => void;
	removeFromBasket: (conversation: Conversation) => void;
	clearBasket: () => void;
}

export const AppContext = createContext<AppContextType>({
	socket: null,
	// TODO: remove this
	basket: [],
	isConnected: false,
	addToBasket: () => {},
	removeFromBasket: () => {},
	clearBasket: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [socket, setSocket] = useState<ExtendedSocket | null>(null);
	const [basket, setBasket] = useState<Conversation[]>([
		{
			createdAt: "2025-05-17 22:26:20.651913",
			id: "conv1",
			status: "pending",
			topic: "",
			updatedAt: "2025-05-17 22:26:20.651913",
			agent: {
				id: "mYc6kaHzqWMuTe9Y59BtHaEpjMrbCqpO",
				name: "shawky ahmed",
				email: "shawkyelshazly1@gmail.com",
				image:
					"https://lh3.googleusercontent.com/a/ACg8ocLmefYfn78jB0Sz0F1uoFKFQxJFStj8hH_RzXYk7eFojefGtw=s96-c",
				role: "csr",
			},
		},
		{
			createdAt: "2025-05-24 17:00:57.151997",
			id: "4abb8a34-d12c-49fb-8aa0-8c911ddcd9d0",
			status: "active",
			topic: "",
			updatedAt: "2025-05-24 17:00:57.151997",
			agent: {
				id: "mYc6kaHzqWMuTe9Y59BtHaEpjMrbCqpO",
				name: "shawky ahmed",
				email: "shawkyelshazly1@gmail.com",
				image:
					"https://lh3.googleusercontent.com/a/ACg8ocLmefYfn78jB0Sz0F1uoFKFQxJFStj8hH_RzXYk7eFojefGtw=s96-c",
				role: "csr",
			},
		},
	]);
	const [isConnected, setIsConnected] = useState(false);

	const addToBasket = (conversation: Conversation) => {
		setBasket((prev) => [...prev, conversation]);
	};
	const removeFromBasket = (conversation: Conversation) => {
		setBasket((prev) => prev.filter((c) => c.id !== conversation.id));
	};
	const clearBasket = () => {
		setBasket([]);
	};

	return (
		<AppContext.Provider
			value={{
				socket,
				basket,
				isConnected,
				addToBasket,
				removeFromBasket,
				clearBasket,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
