import { Conversation, User } from "@/lib/types";
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

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
        status: "offline"
    },
    basket: []
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
        }
    }
});

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.user.status;
export const selectBasket = (state: RootState) => state.user.basket;
export const { setUserStatus, setUser, addToBasket, removeFromBasket } = userSlice.actions;
export default userSlice.reducer;


