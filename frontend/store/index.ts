import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import attendanceReducer from './slices/attendanceSlice';
import holidaysReducer from './slices/holidaysSlice';
import ratingsReducer from './slices/ratingsSlice';
import commentsReducer from './slices/commentsSlice';
import messagesReducer from './slices/messagesSlice';
import announcementsReducer from './slices/announcementsSlice';
import directoryReducer from './slices/directorySlice';
import adminReducer from './slices/adminSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    attendance: attendanceReducer,
    holidays: holidaysReducer,
    ratings: ratingsReducer,
    comments: commentsReducer,
    messages: messagesReducer,
    announcements: announcementsReducer,
    directory: directoryReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
