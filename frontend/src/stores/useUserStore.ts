import { create } from "zustand";
import type { User } from '@shared/types';
import { devtools } from 'zustand/middleware';


interface UserStore {
    user: User | null;
    userStatus: 'online' | 'offline';
    setUser: (user: User | null) => void;
    setUserStatus: (status: 'online' | 'offline') => void;
}

// user store
export const useUserStore = create<UserStore>()(devtools((set) => ({
    user: null,
    userStatus: 'offline',

    setUser: (user) => set({ user }),
    setUserStatus: (userStatus) => set({ userStatus }),
})));
