import { create } from "zustand";
import type { User } from "@shared/types";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface UserStore {
    user: User | null;
    userStatus: "online" | "offline";
    setUser: (user: User | null) => void;
    setUserStatus: (status: "online" | "offline") => void;
}

// user store
export const useUserStore = create<UserStore>()(
    persist(
        devtools((set) => ({
            user: null,
            userStatus: "offline",

            setUser: (user) => set({ user }),
            setUserStatus: (userStatus) => set({ userStatus }),
        })),
        {
            name: "team-talk-user",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userStatus: state.userStatus,
            }),
            version: 1,
        }
    )
);

if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === "team-talk-user") {
            useUserStore.persist.rehydrate();
        }
    });
}
