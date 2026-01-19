import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { MessagesState, Message } from '@/types';
import { mockMessages, mockUsers } from '@/lib/mock-data';

const initialState: MessagesState = {
  data: [],
  loading: false,
  error: null,
  selectedMessageId: null,
};

export const fetchMessages = createAsyncThunk(
  'messages/fetch',
  async (userId: string, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter messages where user is sender or receiver
    const userMessages = mockMessages.filter(
      (m) => m.senderId === userId || m.receiverId === userId
    );

    return userMessages;
  }
);

export const sendMessage = createAsyncThunk(
  'messages/send',
  async (
    {
      senderId,
      receiverId,
      subject,
      body,
    }: {
      senderId: string;
      receiverId: string;
      subject: string;
      body: string;
    },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sender = mockUsers.find((u) => u.id === senderId);
    const receiver = mockUsers.find((u) => u.id === receiverId);

    if (!sender || !receiver) {
      return rejectWithValue('Invalid sender or receiver');
    }

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId,
      senderName: sender.name,
      receiverId,
      receiverName: receiver.name,
      subject,
      body,
      timestamp: new Date().toISOString(),
      read: false,
    };

    return newMessage;
  }
);

export const markMessageAsRead = createAsyncThunk(
  'messages/markRead',
  async (messageId: string, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return messageId;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    selectMessage: (state, action: PayloadAction<string | null>) => {
      state.selectedMessageId = action.payload;
    },
    clearMessages: (state) => {
      state.data = [];
      state.selectedMessageId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const index = state.data.findIndex((m) => m.id === action.payload);
        if (index !== -1) {
          state.data[index].read = true;
        }
      });
  },
});

export const { selectMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
