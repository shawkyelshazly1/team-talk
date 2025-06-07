import { useAppContext } from "@/contexts/AppContext";

export const useSocket = () => {
    const { socket, isConnected } = useAppContext();


    return { socket, isConnected };
};