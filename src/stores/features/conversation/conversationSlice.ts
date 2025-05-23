import { Conversation, Message } from "@/lib/types";
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";




// create entity adapters
const conversationAdapter = createEntityAdapter<Conversation>();
const messageAdapter = createEntityAdapter<Message>();


interface ConversationState {
    conversations: ReturnType<typeof conversationAdapter.getInitialState> & {
        activeIds: string[];
        pendingIds: string[];
    };
    messages: ReturnType<typeof messageAdapter.getInitialState> & {
        byConversationId: { [key: string]: string[]; };
    };
}

const initialState: ConversationState = {
    conversations: {
        ...conversationAdapter.getInitialState(),
        activeIds: [],
        pendingIds: []
    },
    messages: {
        ...messageAdapter.getInitialState(),
        byConversationId: {}
    }
};

// export interface ConversationState {
//     activeConversations: Conversation[];
//     pendingConversations: Conversation[];
//     messages: Message[];
// }

// const initialState: ConversationState = {
//     activeConversations: [],
//     pendingConversations: [],
//     messages: [],
// };


export const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        addNewConversation: (state, action: PayloadAction<Conversation>) => {
            conversationAdapter.addOne(state.conversations, action.payload);
            state.conversations.activeIds.push(action.payload.id);
        },
        addPendingConversation: (state, action: PayloadAction<Conversation>) => {
            conversationAdapter.addOne(state.conversations, action.payload);
            state.conversations.pendingIds.push(action.payload.id);
        },
        moveConversationToPending: (state, action: PayloadAction<Conversation>) => {
            const { id } = action.payload;
            state.conversations.pendingIds.push(id);
            state.conversations.activeIds = state.conversations.activeIds.filter(id => id !== id);
            conversationAdapter.updateOne(state.conversations, { id, changes: { status: "pending" } });
        },
        moveConversationToActive: (state, action: PayloadAction<Conversation>) => {
            const { id } = action.payload;
            state.conversations.activeIds.push(id);
            state.conversations.pendingIds = state.conversations.pendingIds.filter(id => id !== id);
            conversationAdapter.updateOne(state.conversations, { id, changes: { status: "active" } });
        },
        updateConversation: (state, action: PayloadAction<{ id: string, fields: Partial<Conversation>; }>) => {
            conversationAdapter.updateOne(state.conversations, { id: action.payload.id, changes: action.payload.fields });
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;

            messageAdapter.addOne(state.messages, message);
            const conversationId = message.conversationId;
            if (!state.messages.byConversationId[conversationId]) {
                state.messages.byConversationId[conversationId] = [];
            }
            state.messages.byConversationId[conversationId].push(message.id);
        },
        updateMessage: (state, action: PayloadAction<{ id: string, fields: Partial<Message>; }>) => {
            messageAdapter.updateOne(state.messages, { id: action.payload.id, changes: action.payload.fields });
        },
    },
});

// conversationsselectors
export const {
    selectAll: selectAllConversations,
    selectById: selectConversationById,
    selectIds: selectConversationIds,
} = conversationAdapter.getSelectors((state: RootState) => state.conversation.conversations);

// messages selectors
export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds,
} = messageAdapter.getSelectors((state: RootState) => state.conversation.messages);

// custom selectors
export const selectActiveConversations = (state: RootState) => state.conversation.conversations.activeIds.map(id => selectConversationById(state, id));
export const selectPendingConversations = (state: RootState) => state.conversation.conversations.pendingIds.map(id => selectConversationById(state, id));
export const selectConversationMessages = (conversationId: string) => (state: RootState) => state.conversation.messages.byConversationId[conversationId]?.map(id => selectMessageById(state, id)) || [];


export const { addMessage, addNewConversation, addPendingConversation, moveConversationToActive, moveConversationToPending, updateConversation, updateMessage } = conversationSlice.actions;

export default conversationSlice.reducer;
