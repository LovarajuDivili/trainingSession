import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

type ChatState = {
  messages: ChatMessage[];
  conversationId: string | null;
};


const initialState: ChatState = {
  messages: [],
  conversationId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
    },

    setHistory(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },

    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },

    clearChat(state) {
      state.messages = [];
      state.conversationId = null;
    },
  },
});

export const { setConversationId, setHistory, addMessage, clearChat } =
  chatSlice.actions;

export default chatSlice.reducer;