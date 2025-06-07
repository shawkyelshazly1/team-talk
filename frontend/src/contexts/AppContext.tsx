"use client";
import { ExtendedSocket } from "@/lib/socketio/types";
import { Conversation } from "@/lib/types";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useUserContext } from "./UserContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

interface AppContextType {
	socket: ExtendedSocket | null;
	basket: Conversation[];
	isConnected: boolean;
	addToBasket: (conversation: Conversation) => void;
	removeFromBasket: (conversationId: string) => void;
	clearBasket: () => void;
	updateConversation: (conversation: Omit<Conversation, "agent">) => void;
}

export const AppContext = createContext<AppContextType>({
	socket: null,
	basket: [],
	isConnected: false,
	addToBasket: () => {},
	removeFromBasket: () => {},
	clearBasket: () => {},
	updateConversation: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useUserContext();
	const [socket, setSocket] = useState<ExtendedSocket | null>(null);

	const [basket, setBasket] = useState<Conversation[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	const addToBasket = (conversation: Conversation) => {
		setBasket((prev) => [...prev, conversation]);
	};
	const removeFromBasket = (conversationId: string) => {
		setBasket((prev) => prev.filter((c) => c.id !== conversationId));
	};
	const clearBasket = () => {
		setBasket([]);
	};

	const updateConversation = (conversation: Omit<Conversation, "agent">) => {
		setBasket((prev) =>
			prev.map((c) =>
				c.id === conversation.id ? { ...c, ...conversation } : c
			)
		);
	};

	useEffect(() => {
		if (user && !socket) {
			const toastId = toast.loading("Connecting to server...");

			const newSocket = io(process.env.NEXT_PUBLIC_WS_URL, {
				timeout: 10000,
				autoConnect: true,
			});

			newSocket.on("connect", () => {
				// Emit authenticate event with user data
				newSocket.emit("authenticate", { user });
			});

			newSocket.on("authenticated", () => {
				setIsConnected(true);
				setSocket(newSocket);
				toast.success("Connected", { id: toastId });
			});

			newSocket.on("unauthorized", () => {
				setIsConnected(false);
				setSocket(null);
				toast.error("Authentication failed", { id: toastId });
			});

			newSocket.on("disconnect", () => {
				setIsConnected(false);
				setSocket(null);
				if (user) {
					toast.loading("Reconnecting...", { id: toastId });
				} else {
					toast.error("Disconnected", { id: toastId });
				}
			});

			return () => {
				newSocket.disconnect();
				setSocket(null);
				setIsConnected(false);
			};
		} else {
			if (socket) {
				socket.disconnect();
			}
			toast.dismiss();
		}
	}, [user]);

	return (
		<AppContext.Provider
			value={{
				socket,
				basket,
				isConnected,
				addToBasket,
				removeFromBasket,
				clearBasket,
				updateConversation,
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
