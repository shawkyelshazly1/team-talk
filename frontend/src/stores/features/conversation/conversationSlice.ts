import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface ConversationState {
    selectedConversation: string;

}

const initialState: ConversationState = {
    selectedConversation: "",

};

export const conversationsSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setSelectedConversation: (state, action: PayloadAction<string>) => {
            state.selectedConversation = action.payload;
        },

    }
});

// Selectors
export const selectSelectedConversation = (state: RootState) => state.conversation.selectedConversation;


export const {
    setSelectedConversation,

} = conversationsSlice.actions;

export default conversationsSlice.reducer;