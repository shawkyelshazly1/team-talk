import { useSocketStore } from "@/stores/useSocketStore";

export const useSocket = () => {
    const { socket, isConnected } = useSocketStore();


    return { socket, isConnected };
};