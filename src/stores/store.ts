"use client";
import { configureStore } from '@reduxjs/toolkit';
import conversationsReducer from './features/conversation/conversationSlice';
import userReducer from './features/user/userSlice';
export const store = configureStore({
    reducer: {
        conversation: conversationsReducer,
        user: userReducer
    }
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

