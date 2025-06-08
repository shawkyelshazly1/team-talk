import { create } from "zustand";
import type { ExtendedSocket } from "@/lib/socketio/types";
import { devtools } from 'zustand/middleware';


interface SocketStore {
    socket: ExtendedSocket | null;
    isConnected: boolean;
    setSocket: (socket: ExtendedSocket | null) => void;
    setIsConnected: (isConnected: boolean) => void;
}

// socket store
export const useSocketStore = create<SocketStore>()(devtools((set) => ({
    socket: null,
    isConnected: false,

    setSocket: (socket) => set({ socket }),
    setIsConnected: (isConnected) => set({ isConnected }),
})));