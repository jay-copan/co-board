import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CommentsState, Comment } from '@/types';
import { mockComments } from '@/lib/mock-data';

const initialState: CommentsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockComments) {
      return rejectWithValue('Failed to fetch comments');
    }

    return mockComments;
  }
);

export const submitComment = createAsyncThunk(
  'comments/submit',
  async (
    { fromEmployeeId, targetEmployeeId, content }: { fromEmployeeId: string; targetEmployeeId: string; content: string },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!content.trim()) {
      return rejectWithValue('Comment cannot be empty');
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      fromEmployeeId,
      targetEmployeeId,
      content: content.trim(),
      flagged: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return newComment;
  }
);

export const flagComment = createAsyncThunk(
  'comments/flag',
  async (commentId: string, { getState, rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const state = getState() as { comments: CommentsState };
    const comment = state.comments.data.find((c) => c.id === commentId);

    if (!comment) {
      return rejectWithValue('Comment not found');
    }

    return commentId;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(submitComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(flagComment.fulfilled, (state, action: PayloadAction<string>) => {
        const index = state.data.findIndex((c) => c.id === action.payload);
        if (index !== -1) {
          state.data[index].flagged = true;
        }
      });
  },
});

export default commentsSlice.reducer;
