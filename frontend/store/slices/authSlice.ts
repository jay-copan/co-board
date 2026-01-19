import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserRole } from '@/types';
import { mockCredentials, mockUsers } from '@/lib/mock-data';

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  userId: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockCredentials[credentials.username];
    if (!user || user.password !== credentials.password) {
      return rejectWithValue('Invalid username or password');
    }

    const userProfile = mockUsers.find((u) => u.id === user.userId);
    if (!userProfile) {
      return rejectWithValue('User not found');
    }

    return {
      userId: user.userId,
      role: userProfile.role as UserRole,
    };
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ userId: string; role: UserRole }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
          state.role = action.payload.role;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.role = null;
        state.userId = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
