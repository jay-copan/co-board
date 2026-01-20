import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AttendanceState, AttendanceRecord, AttendanceMode, AttendanceStatus } from '@/types';
import { mockAttendance } from '@/lib/mock-data';

const initialState: AttendanceState = {
  data: [],
  loading: false,
  error: null,
  today: {
    clockedIn: false,
    clockInTime: null,
    mode: null,
  },
};

// Fetch attendance records
export const fetchAttendance = createAsyncThunk(
  'attendance/fetch',
  async (userId: string, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const records = mockAttendance[userId];
    if (!records) {
      return rejectWithValue('No attendance records found');
    }

    return records;
  }
);

// Clock in
export const clockIn = createAsyncThunk(
  'attendance/clockIn',
  async (
    { userId, mode }: { userId: string; mode: AttendanceMode },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const now = new Date();
    const clockInTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Determine status based on time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const targetMinutes = 10 * 60; // 10:00 AM
    const bufferMinutes = 10;

    let status: AttendanceStatus = 'ON_TIME';
    if (totalMinutes > targetMinutes + bufferMinutes) {
      status = 'LATE';
    }

    const record: AttendanceRecord = {
      id: `att-${userId}-${now.toISOString().split('T')[0]}`,
      date: now.toISOString().split('T')[0],
      clockIn: clockInTime,
      clockOut: null,
      mode,
      status,
      workHours: 0,
      isCorrected: false,
    };

    return { record, clockInTime, mode };
  }
);

// Clock out
export const clockOut = createAsyncThunk(
  'attendance/clockOut',
  async (userId: string, { getState, rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const state = getState() as { attendance: AttendanceState };
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = state.attendance.data.find((r) => r.date === today);

    if (!todayRecord || !todayRecord.clockIn) {
      return rejectWithValue('No clock-in record found for today');
    }

    const now = new Date();
    const clockOutTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Calculate work hours
    const [inHours, inMinutes] = todayRecord.clockIn.split(':').map(Number);
    const outHours = now.getHours();
    const outMinutes = now.getMinutes();
    const workHours = (outHours - inHours) + (outMinutes - inMinutes) / 60;

    // Check if leaving early
    const totalMinutes = outHours * 60 + outMinutes;
    const targetMinutes = 19 * 60; // 7:00 PM
    const bufferMinutes = 10;

    let status = todayRecord.status;
    if (totalMinutes < targetMinutes - bufferMinutes && status === 'ON_TIME') {
      status = 'EARLY';
    }

    return {
      date: today,
      clockOutTime,
      workHours: Math.round(workHours * 10) / 10,
      status,
    };
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.data = [];
      state.today = {
        clockedIn: false,
        clockInTime: null,
        mode: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action: PayloadAction<AttendanceRecord[]>) => {
        state.loading = false;
        state.data = action.payload;
        
        // Check if already clocked in today
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = action.payload.find((r) => r.date === today);
        if (todayRecord && todayRecord.clockIn && !todayRecord.clockOut) {
          state.today = {
            clockedIn: true,
            clockInTime: todayRecord.clockIn,
            mode: todayRecord.mode,
          };
        }
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clockIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(clockIn.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload.record);
        state.today = {
          clockedIn: true,
          clockInTime: action.payload.clockInTime,
          mode: action.payload.mode,
        };
      })
      .addCase(clockIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clockOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((r) => r.date === action.payload.date);
        if (index !== -1) {
          state.data[index].clockOut = action.payload.clockOutTime;
          state.data[index].workHours = action.payload.workHours;
          state.data[index].status = action.payload.status;
        }
        state.today = {
          clockedIn: false,
          clockInTime: null,
          mode: null,
        };
      })
      .addCase(clockOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
