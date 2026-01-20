import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState, UserProfile, UserLink } from '@/types';
import { mockUsers } from '@/lib/mock-data';

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return rejectWithValue('User not found');
    }

    return user;
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    updates: Partial<Pick<UserProfile, 'about' | 'profileImage' | 'bannerImage' | 'links'>>,
    { getState, rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const state = getState() as { user: UserState };
    if (!state.user.data) {
      return rejectWithValue('No user logged in');
    }

    return { ...state.user.data, ...updates };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.data = null;
      state.error = null;
    },
    addLink: (state, action: PayloadAction<UserLink>) => {
      if (state.data) {
        state.data.links.push(action.payload);
      }
    },
    removeLink: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.links = state.data.links.filter((link) => link.id !== action.payload);
      }
    },
    updateLink: (state, action: PayloadAction<UserLink>) => {
      if (state.data) {
        const index = state.data.links.findIndex((link) => link.id === action.payload.id);
        if (index !== -1) {
          state.data.links[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData, addLink, removeLink, updateLink } = userSlice.actions;
export default userSlice.reducer;
