import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { DirectoryState, EmployeeCard } from "@/types";
import { mockDirectory } from "@/lib/mock-data";

/**
 * INITIAL STATE
 * ─────────────────────────────
 * - `filters` → legacy / inbox / sorting
 * - flat filters → directory UI
 */
const initialState: DirectoryState = {
  data: [],
  loading: false,
  error: null,

  // ✅ UI filters (Directory page)
  searchQuery: "",
  departmentFilter: "all",
  statusFilter: "all",

  // ✅ Existing filters (Inbox / shared logic)
  filters: {
    search: "",
    department: "",
    sortBy: "name",
    sortOrder: "asc",
  },
};

export const fetchDirectory = createAsyncThunk(
  "directory/fetch",
  async (_, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockDirectory) {
      return rejectWithValue("Failed to fetch directory");
    }

    return mockDirectory;
  }
);

const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
    /* ──────────────── */
    /* DIRECTORY (UI)   */
    /* ──────────────── */

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
    },

    setStatusFilter: (
      state,
      action: PayloadAction<"active" | "on_leave" | "inactive" | "all">
    ) => {
      state.statusFilter = action.payload;
    },

    resetDirectoryFilters: (state) => {
      state.searchQuery = "";
      state.departmentFilter = "all";
      state.statusFilter = "all";
    },

    /* ──────────────── */
    /* LEGACY / INBOX   */
    /* ──────────────── */

    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setLegacyDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.department = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<"name" | "department" | "rating">
    ) => {
      state.filters.sortBy = action.payload;
    },

    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.filters.sortOrder = action.payload;
    },

    resetLegacyFilters: (state) => {
      state.filters = initialState.filters;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDirectory.fulfilled,
        (state, action: PayloadAction<EmployeeCard[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchDirectory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  // Directory page
  setSearchQuery,
  setDepartmentFilter,
  setStatusFilter,
  resetDirectoryFilters,

  // Inbox / legacy
  setSearchFilter,
  setLegacyDepartmentFilter,
  setSortBy,
  setSortOrder,
  resetLegacyFilters,
} = directorySlice.actions;

export default directorySlice.reducer;
