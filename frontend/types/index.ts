// ==================== Base Types ====================
export interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// ==================== User Roles ====================
export type UserRole = 'EMPLOYEE' | 'ADMIN';

// ==================== Auth ====================
export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

// ==================== UI ====================
export type ModalType = 
  | null 
  | 'LOGIN' 
  | 'ATTENDANCE_FIX' 
  | 'WFH' 
  | 'SICK_LEAVE' 
  | 'INCIDENT' 
  | 'RULES'
  | 'FEEDBACK'
  | 'PROFILE_EDIT'
  | 'ANNOUNCEMENT_DETAIL'
  | 'MESSAGE_COMPOSE'
  | 'EMPLOYEE_RATE'
  | 'EMPLOYEE_COMMENT';

export interface UIState {
  theme: 'light' | 'dark';
  activeModal: ModalType;
  sidebarOpen: boolean;
}

// ==================== User Profile ====================
export interface UserLink {
  id: string;
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'email' | 'website' | 'twitter';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  profileImage: string | null;
  bannerImage: string | null;
  about: string;
  links: UserLink[];
  rating: number;
  ratingCount: number;
  joinDate: string;
  wfhEligible: boolean;
  attendanceCorrectionUsed: number;
  sickLeaveUsed: number;
}

export interface UserState extends ApiState<UserProfile | null> {}

// ==================== Attendance ====================
export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'EARLY' | 'ABSENT' | 'HOLIDAY' | 'WEEKEND';
export type AttendanceMode = 'OFFICE' | 'REMOTE';

export interface AttendanceRecord {
  id: string;
  date: string; // ISO
  clockIn: string | null;
  clockOut: string | null;
  mode: AttendanceMode;
  status: AttendanceStatus;
  workHours: number;
  isCorrected: boolean;
}

export interface TodayAttendance {
  clockedIn: boolean;
  clockInTime: string | null;
  mode: AttendanceMode | null;
}

export interface AttendanceState extends ApiState<AttendanceRecord[]> {
  today: TodayAttendance;
}

// ==================== Holidays ====================
export interface Holiday {
  id: string;
  date: string;
  occasion: string;
}

export interface HolidaysState extends ApiState<Holiday[]> {}

// ==================== Ratings ====================
export interface Rating {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  score: number; // 1-5
  createdAt: string;
}

export interface RatingsState extends ApiState<Rating[]> {}

// ==================== Comments ====================
export interface Comment {
  id: string;
  fromEmployeeId: string;
  targetEmployeeId: string;
  content: string;
  flagged: boolean;
  createdAt: string;
}

export interface CommentsState extends ApiState<Comment[]> {}

// ==================== Messages ====================
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface MessagesState extends ApiState<Message[]> {
  selectedMessageId: string | null;
}

// ==================== Announcements ====================
export interface Announcement {
  id: string;
  title: string;
  subject: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AnnouncementsState extends ApiState<Announcement[]> {
  selectedAnnouncementId: string | null;
}

// ==================== Directory ====================
export interface EmployeeCard {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  rating: number;
  ratingCount: number;
  profileImage: string | null;
}

export interface DirectoryFilters {
  search: string;
  department: string;
  sortBy: 'name' | 'department' | 'rating';
  sortOrder: 'asc' | 'desc';
}

export interface DirectoryState extends ApiState<EmployeeCard[]> {
  filters: DirectoryFilters;
}

// ==================== Admin ====================
export type ApprovalType = 'ATTENDANCE_FIX' | 'WFH' | 'SICK_LEAVE';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  employeeId: string;
  employeeName: string;
  date: string;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

export type GrievanceCategory = 
  | 'HARASSMENT' 
  | 'THEFT' 
  | 'VERBAL_ABUSE' 
  | 'WORKPLACE_SAFETY' 
  | 'FLAGGED_COMMENT'
  | 'OTHER';

export interface Grievance {
  id: string;
  employeeId: string;
  employeeName: string;
  category: GrievanceCategory;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  relatedCommentId?: string;
}

export interface AdminState {
  approvals: ApiState<ApprovalRequest[]>;
  grievances: ApiState<Grievance[]>;
}

// ==================== Notifications ====================
export type NotificationType = 'ANNOUNCEMENT' | 'MESSAGE' | 'APPROVAL' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

export interface NotificationsState extends ApiState<Notification[]> {
  unreadCount: number;
}

// ==================== Root State ====================
export interface RootState {
  auth: AuthState;
  ui: UIState;
  user: UserState;
  attendance: AttendanceState;
  holidays: HolidaysState;
  ratings: RatingsState;
  comments: CommentsState;
  messages: MessagesState;
  announcements: AnnouncementsState;
  directory: DirectoryState;
  admin: AdminState;
  notifications: NotificationsState;
}
