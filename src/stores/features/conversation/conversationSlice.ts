import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface ConversationState {
    selectedConversation: string;
    isConnected: boolean;
    wsConnection: WebSocket | null;
}

const initialState: ConversationState = {
    selectedConversation: "",
    isConnected: false,
    wsConnection: null
};

export const conversationsSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setSelectedConversation: (state, action: PayloadAction<string>) => {
            state.selectedConversation = action.payload;
        },
        initializeWebSocket: (state, action: PayloadAction<string>) => {
            if (state.wsConnection) {
                state.wsConnection.close();
            }

            const ws = new WebSocket(`ws://your-api/messages/${action.payload}`);
            state.wsConnection = ws;
            state.isConnected = false;
        },
        setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        }
    }
});

// Selectors
export const selectSelectedConversation = (state: RootState) => state.conversation.selectedConversation;
export const selectIsWebSocketConnected = (state: RootState) => state.conversation.isConnected;
export const selectWebSocketConnection = (state: RootState) => state.conversation.wsConnection;

export const {
    setSelectedConversation,
    initializeWebSocket,
    setWebSocketConnected
} = conversationsSlice.actions;

export default conversationsSlice.reducer;