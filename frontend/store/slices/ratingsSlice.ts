import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RatingsState, Rating } from '@/types';
import { mockRatings } from '@/lib/mock-data';

const initialState: RatingsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchRatings = createAsyncThunk(
  'ratings/fetch',
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockRatings) {
      return rejectWithValue('Failed to fetch ratings');
    }

    return mockRatings;
  }
);

export const submitRating = createAsyncThunk(
  'ratings/submit',
  async (
    { fromEmployeeId, toEmployeeId, score }: { fromEmployeeId: string; toEmployeeId: string; score: number },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (score < 1 || score > 5) {
      return rejectWithValue('Invalid rating score');
    }

    const newRating: Rating = {
      id: `r-${Date.now()}`,
      fromEmployeeId,
      toEmployeeId,
      score,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return newRating;
  }
);

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatings.fulfilled, (state, action: PayloadAction<Rating[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRating.fulfilled, (state, action: PayloadAction<Rating>) => {
        state.loading = false;
        // Remove existing rating from same user to same employee if exists
        state.data = state.data.filter(
          (r) => !(r.fromEmployeeId === action.payload.fromEmployeeId && r.toEmployeeId === action.payload.toEmployeeId)
        );
        state.data.push(action.payload);
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ratingsSlice.reducer;
