import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminState, ApprovalRequest, Grievance, ApprovalStatus, GrievanceCategory, UserRole } from '@/types';
import { mockApprovals, mockGrievances, mockUsers, departments } from '@/lib/mock-data';

const initialState: AdminState = {
  approvals: {
    data: [],
    loading: false,
    error: null,
  },
  grievances: {
    data: [],
    loading: false,
    error: null,
  },
};

// Fetch approvals
export const fetchApprovals = createAsyncThunk(
  'admin/fetchApprovals',
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockApprovals) {
      return rejectWithValue('Failed to fetch approvals');
    }

    return mockApprovals;
  }
);

// Fetch grievances
export const fetchGrievances = createAsyncThunk(
  'admin/fetchGrievances',
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockGrievances) {
      return rejectWithValue('Failed to fetch grievances');
    }

    return mockGrievances;
  }
);

// Update approval status
export const updateApprovalStatus = createAsyncThunk(
  'admin/updateApproval',
  async (
    { approvalId, status, adminId }: { approvalId: string; status: ApprovalStatus; adminId: string },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      approvalId,
      status,
      resolvedAt: new Date().toISOString(),
      resolvedBy: adminId,
    };
  }
);

// Resolve grievance
export const resolveGrievance = createAsyncThunk(
  'admin/resolveGrievance',
  async ({ grievanceId, adminId }: { grievanceId: string; adminId: string }, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      grievanceId,
      resolvedAt: new Date().toISOString(),
      resolvedBy: adminId,
    };
  }
);

// Submit approval request (for employees)
export const submitApprovalRequest = createAsyncThunk(
  'admin/submitRequest',
  async (
    {
      type,
      employeeId,
      date,
      reason,
    }: {
      type: 'ATTENDANCE_FIX' | 'WFH' | 'SICK_LEAVE';
      employeeId: string;
      date: string;
      reason: string;
    },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employee = mockUsers.find((u) => u.id === employeeId);
    if (!employee) {
      return rejectWithValue('Employee not found');
    }

    const newRequest: ApprovalRequest = {
      id: `apr-${Date.now()}`,
      type,
      employeeId,
      employeeName: employee.name,
      date,
      reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedBy: null,
    };

    return newRequest;
  }
);

// Submit grievance
export const submitGrievance = createAsyncThunk(
  'admin/submitGrievance',
  async (
    {
      employeeId,
      category,
      description,
      relatedCommentId,
    }: {
      employeeId: string;
      category: GrievanceCategory;
      description: string;
      relatedCommentId?: string;
    },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employee = mockUsers.find((u) => u.id === employeeId);
    if (!employee) {
      return rejectWithValue('Employee not found');
    }

    const newGrievance: Grievance = {
      id: `g-${Date.now()}`,
      employeeId,
      employeeName: employee.name,
      category,
      description,
      resolved: false,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedBy: null,
      relatedCommentId,
    };

    return newGrievance;
  }
);

// Add employee (admin only)
export const addEmployee = createAsyncThunk(
  'admin/addEmployee',
  async (
    {
      name,
      role,
      department,
      position,
    }: {
      name: string;
      role: UserRole;
      department: string;
      position: string;
    },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!name.trim()) {
      return rejectWithValue('Name is required');
    }

    const prefix = role === 'ADMIN' ? 'ADM' : 'EMP';
    const id = `${prefix}${String(mockUsers.length + 1).padStart(3, '0')}`;

    return {
      id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      role,
      department,
      position,
    };
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Approvals
      .addCase(fetchApprovals.pending, (state) => {
        state.approvals.loading = true;
        state.approvals.error = null;
      })
      .addCase(fetchApprovals.fulfilled, (state, action: PayloadAction<ApprovalRequest[]>) => {
        state.approvals.loading = false;
        state.approvals.data = action.payload;
      })
      .addCase(fetchApprovals.rejected, (state, action) => {
        state.approvals.loading = false;
        state.approvals.error = action.payload as string;
      })
      // Grievances
      .addCase(fetchGrievances.pending, (state) => {
        state.grievances.loading = true;
        state.grievances.error = null;
      })
      .addCase(fetchGrievances.fulfilled, (state, action: PayloadAction<Grievance[]>) => {
        state.grievances.loading = false;
        state.grievances.data = action.payload;
      })
      .addCase(fetchGrievances.rejected, (state, action) => {
        state.grievances.loading = false;
        state.grievances.error = action.payload as string;
      })
      // Update approval
      .addCase(updateApprovalStatus.fulfilled, (state, action) => {
        const index = state.approvals.data.findIndex((a) => a.id === action.payload.approvalId);
        if (index !== -1) {
          state.approvals.data[index].status = action.payload.status;
          state.approvals.data[index].resolvedAt = action.payload.resolvedAt;
          state.approvals.data[index].resolvedBy = action.payload.resolvedBy;
        }
      })
      // Resolve grievance
      .addCase(resolveGrievance.fulfilled, (state, action) => {
        const index = state.grievances.data.findIndex((g) => g.id === action.payload.grievanceId);
        if (index !== -1) {
          state.grievances.data[index].resolved = true;
          state.grievances.data[index].resolvedAt = action.payload.resolvedAt;
          state.grievances.data[index].resolvedBy = action.payload.resolvedBy;
        }
      })
      // Submit approval request
      .addCase(submitApprovalRequest.pending, (state) => {
        state.approvals.loading = true;
      })
      .addCase(submitApprovalRequest.fulfilled, (state, action: PayloadAction<ApprovalRequest>) => {
        state.approvals.loading = false;
        state.approvals.data.unshift(action.payload);
      })
      .addCase(submitApprovalRequest.rejected, (state, action) => {
        state.approvals.loading = false;
        state.approvals.error = action.payload as string;
      })
      // Submit grievance
      .addCase(submitGrievance.pending, (state) => {
        state.grievances.loading = true;
      })
      .addCase(submitGrievance.fulfilled, (state, action: PayloadAction<Grievance>) => {
        state.grievances.loading = false;
        state.grievances.data.unshift(action.payload);
      })
      .addCase(submitGrievance.rejected, (state, action) => {
        state.grievances.loading = false;
        state.grievances.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
