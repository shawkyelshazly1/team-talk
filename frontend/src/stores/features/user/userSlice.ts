import { Conversation, User } from "@/lib/types";
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import moment from "moment";

// create entity adapters
const userAdapter = createEntityAdapter<User>();

interface UserState {
    user: ReturnType<typeof userAdapter.getInitialState> & {
        status: "online" | "offline";
    };
    basket: Conversation[];
}

const initialState: UserState = {
    user: {
        ...userAdapter.getInitialState(),
        // TODO: change to offline
        status: "offline"
    },
    basket: [{
        "createdAt": "2025-05-17 22:26:20.651913",
        "id": "conv1",
        "status": "pending",
        "topic": "",
        "updatedAt": "2025-05-17 22:26:20.651913",
        "agent": {
            "id": "mYc6kaHzqWMuTe9Y59BtHaEpjMrbCqpO",
            "name": "shawky ahmed",
            "email": "shawkyelshazly1@gmail.com",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocLmefYfn78jB0Sz0F1uoFKFQxJFStj8hH_RzXYk7eFojefGtw=s96-c",
            "role": "csr"
        }
    }, {
        "createdAt": "2025-05-24 17:00:57.151997",
        "id": "4abb8a34-d12c-49fb-8aa0-8c911ddcd9d0",
        "status": "active",
        "topic": "",
        "updatedAt": "2025-05-24 17:00:57.151997",
        "agent": {
            "id": "mYc6kaHzqWMuTe9Y59BtHaEpjMrbCqpO",
            "name": "shawky ahmed",
            "email": "shawkyelshazly1@gmail.com",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocLmefYfn78jB0Sz0F1uoFKFQxJFStj8hH_RzXYk7eFojefGtw=s96-c",
            "role": "csr"
        }
    }

    ]
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserStatus: (state, action: PayloadAction<{ status: "online" | "offline"; }>) => {
            state.user.status = action.payload.status;
        },
        setUser: (state, action: PayloadAction<User>) => {
            userAdapter.setAll(state.user, [action.payload]);
        },
        addToBasket: (state, action: PayloadAction<Conversation>) => {
            state.basket.push(action.payload);
        },
        removeFromBasket: (state, action: PayloadAction<Conversation>) => {
            state.basket = state.basket.filter(conversation => conversation.id !== action.payload.id);
        },
        clearBasket: (state) => {
            state.basket = [];
        }
    }
});

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.user.status;
export const selectBasket = (state: RootState) => state.user.basket;
export const { setUserStatus, setUser, addToBasket, removeFromBasket, clearBasket } = userSlice.actions;
export default userSlice.reducer;


