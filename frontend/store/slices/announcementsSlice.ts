import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Announcement } from "@/types";
import { mockAnnouncements, mockUsers } from "@/lib/mock-data";

export interface AnnouncementsState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  selectedAnnouncementId: string | null;
}

const initialState: AnnouncementsState = {
  announcements: [],
  loading: false,
  error: null,
  selectedAnnouncementId: null,
};

export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetch",
  async (_, { rejectWithValue }) => {
    await new Promise((r) => setTimeout(r, 500));

    if (!mockAnnouncements) {
      return rejectWithValue("Failed to fetch announcements");
    }

    return mockAnnouncements;
  }
);

export const createAnnouncement = createAsyncThunk(
  "announcements/create",
  async (
    {
      title,
      subject,
      content,
      authorId,
      priority,
    }: {
      title: string;
      subject: string;
      content: string;
      authorId: string;
      priority: "low" | "medium" | "high";
    },
    { rejectWithValue }
  ) => {
    await new Promise((r) => setTimeout(r, 500));

    const author = mockUsers.find((u) => u.id === authorId);
    if (!author) {
      return rejectWithValue("Author not found");
    }

    const newAnnouncement: Announcement = {
      id: `a-${Date.now()}`,
      title,
      subject,
      content,
      author: author.name,
      authorId,
      createdAt: new Date().toISOString(),
      priority,
    };

    return newAnnouncement;
  }
);

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    selectAnnouncement: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnouncementId = action.payload;
    },

    addAnnouncement: (state, action: PayloadAction<Announcement>) => {
      state.announcements.unshift(action.payload);
    },

    updateAnnouncement: (state, action: PayloadAction<Announcement>) => {
      const index = state.announcements.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) {
        state.announcements[index] = action.payload;
      }
    },

    deleteAnnouncement: (state, action: PayloadAction<string>) => {
      state.announcements = state.announcements.filter(
        (a) => a.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.unshift(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  selectAnnouncement,
} = announcementsSlice.actions;

export default announcementsSlice.reducer;
