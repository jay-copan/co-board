import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { HolidaysState, Holiday } from '@/types';
import { mockHolidays } from '@/lib/mock-data';

const initialState: HolidaysState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchHolidays = createAsyncThunk(
  'holidays/fetch',
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockHolidays) {
      return rejectWithValue('Failed to fetch holidays');
    }

    return mockHolidays;
  }
);

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action: PayloadAction<Holiday[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default holidaysSlice.reducer;
