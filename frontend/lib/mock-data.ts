import type {
  UserProfile,
  AttendanceRecord,
  Holiday,
  Rating,
  Comment,
  Message,
  Announcement,
  EmployeeCard,
  ApprovalRequest,
  Grievance,
  Notification,
} from '@/types';

// ==================== Users ====================
export const mockUsers: UserProfile[] = [
  {
    id: 'EMP001',
    name: 'John Anderson',
    email: 'john.anderson@company.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    profileImage: null,
    bannerImage: null,
    about: 'Passionate software engineer with 5+ years of experience in full-stack development. I love building scalable applications and mentoring junior developers.',
    links: [
      { id: 'l1', label: 'GitHub', url: 'https://github.com/johnanderson', icon: 'github' },
      { id: 'l2', label: 'LinkedIn', url: 'https://linkedin.com/in/johnanderson', icon: 'linkedin' },
    ],
    rating: 4.5,
    ratingCount: 12,
    joinDate: '2022-03-15',
    wfhEligible: true,
    attendanceCorrectionUsed: 2,
    sickLeaveUsed: 1,
  },
  {
    id: 'EMP002',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@company.com',
    role: 'EMPLOYEE',
    department: 'Design',
    position: 'UX Designer',
    profileImage: null,
    bannerImage: null,
    about: 'Creative UX designer focused on creating intuitive and accessible user experiences.',
    links: [
      { id: 'l3', label: 'Portfolio', url: 'https://sarahmitchell.design', icon: 'website' },
    ],
    rating: 4.8,
    ratingCount: 15,
    joinDate: '2021-08-20',
    wfhEligible: true,
    attendanceCorrectionUsed: 0,
    sickLeaveUsed: 2,
  },
  {
    id: 'EMP003',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    position: 'DevOps Engineer',
    profileImage: null,
    bannerImage: null,
    about: 'Infrastructure and DevOps specialist. Kubernetes enthusiast.',
    links: [],
    rating: 4.2,
    ratingCount: 8,
    joinDate: '2023-01-10',
    wfhEligible: false,
    attendanceCorrectionUsed: 3,
    sickLeaveUsed: 0,
  },
  {
    id: 'EMP004',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'EMPLOYEE',
    department: 'Marketing',
    position: 'Marketing Manager',
    profileImage: null,
    bannerImage: null,
    about: 'Marketing professional with expertise in digital campaigns and brand strategy.',
    links: [
      { id: 'l4', label: 'LinkedIn', url: 'https://linkedin.com/in/emilyrodriguez', icon: 'linkedin' },
      { id: 'l5', label: 'Twitter', url: 'https://twitter.com/emilyrodriguez', icon: 'twitter' },
    ],
    rating: 4.6,
    ratingCount: 10,
    joinDate: '2022-06-01',
    wfhEligible: true,
    attendanceCorrectionUsed: 1,
    sickLeaveUsed: 1,
  },
  {
    id: 'EMP005',
    name: 'David Park',
    email: 'david.park@company.com',
    role: 'EMPLOYEE',
    department: 'Finance',
    position: 'Financial Analyst',
    profileImage: null,
    bannerImage: null,
    about: 'Detail-oriented financial analyst with strong analytical skills.',
    links: [],
    rating: 4.0,
    ratingCount: 6,
    joinDate: '2023-04-15',
    wfhEligible: false,
    attendanceCorrectionUsed: 0,
    sickLeaveUsed: 3,
  },
  {
    id: 'ADM001',
    name: 'Jennifer Williams',
    email: 'jennifer.williams@company.com',
    role: 'ADMIN',
    department: 'Human Resources',
    position: 'HR Director',
    profileImage: null,
    bannerImage: null,
    about: 'HR professional dedicated to building a positive workplace culture.',
    links: [
      { id: 'l6', label: 'Email', url: 'mailto:jennifer.williams@company.com', icon: 'email' },
    ],
    rating: 4.9,
    ratingCount: 20,
    joinDate: '2020-01-15',
    wfhEligible: true,
    attendanceCorrectionUsed: 0,
    sickLeaveUsed: 0,
  },
];

// ==================== Attendance Records ====================
function generateAttendanceRecords(employeeId: string): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({
        id: `att-${employeeId}-${date.toISOString().split('T')[0]}`,
        date: date.toISOString().split('T')[0],
        clockIn: null,
        clockOut: null,
        mode: 'OFFICE',
        status: 'WEEKEND',
        workHours: 0,
        isCorrected: false,
      });
      continue;
    }
    
    // Random attendance patterns
    const isLate = Math.random() < 0.15;
    const isEarly = Math.random() < 0.1;
    const isRemote = Math.random() < 0.2;
    
    const clockInHour = isLate ? 10 + Math.floor(Math.random() * 2) : 9 + Math.floor(Math.random() * 2);
    const clockInMinute = Math.floor(Math.random() * 60);
    const workHours = 8 + Math.random() * 2 - (isEarly ? 1 : 0);
    
    records.push({
      id: `att-${employeeId}-${date.toISOString().split('T')[0]}`,
      date: date.toISOString().split('T')[0],
      clockIn: `${clockInHour.toString().padStart(2, '0')}:${clockInMinute.toString().padStart(2, '0')}`,
      clockOut: isEarly ? '17:30' : '19:00',
      mode: isRemote ? 'REMOTE' : 'OFFICE',
      status: isLate ? 'LATE' : isEarly ? 'EARLY' : 'ON_TIME',
      workHours: Math.round(workHours * 10) / 10,
      isCorrected: false,
    });
  }
  
  return records;
}

export const mockAttendance: Record<string, AttendanceRecord[]> = {
  EMP001: generateAttendanceRecords('EMP001'),
  EMP002: generateAttendanceRecords('EMP002'),
  EMP003: generateAttendanceRecords('EMP003'),
  EMP004: generateAttendanceRecords('EMP004'),
  EMP005: generateAttendanceRecords('EMP005'),
  ADM001: generateAttendanceRecords('ADM001'),
};

// ==================== Holidays ====================
export const mockHolidays: Holiday[] = [
  { id: 'h1', date: '2026-01-26', occasion: 'Republic Day' },
  { id: 'h2', date: '2026-03-14', occasion: 'Holi' },
  { id: 'h3', date: '2026-04-14', occasion: 'Ambedkar Jayanti' },
  { id: 'h4', date: '2026-05-01', occasion: 'May Day' },
  { id: 'h5', date: '2026-08-15', occasion: 'Independence Day' },
  { id: 'h6', date: '2026-10-02', occasion: 'Gandhi Jayanti' },
  { id: 'h7', date: '2026-10-20', occasion: 'Diwali' },
  { id: 'h8', date: '2026-12-25', occasion: 'Christmas' },
];

// ==================== Ratings ====================
export const mockRatings: Rating[] = [
  { id: 'r1', fromEmployeeId: 'EMP002', toEmployeeId: 'EMP001', score: 5, createdAt: '2026-01-10' },
  { id: 'r2', fromEmployeeId: 'EMP003', toEmployeeId: 'EMP001', score: 4, createdAt: '2026-01-08' },
  { id: 'r3', fromEmployeeId: 'EMP004', toEmployeeId: 'EMP001', score: 5, createdAt: '2026-01-05' },
  { id: 'r4', fromEmployeeId: 'EMP001', toEmployeeId: 'EMP002', score: 5, createdAt: '2026-01-12' },
  { id: 'r5', fromEmployeeId: 'EMP003', toEmployeeId: 'EMP002', score: 4, createdAt: '2026-01-09' },
];

// ==================== Comments ====================
export const mockComments: Comment[] = [
  { id: 'c1', fromEmployeeId: 'EMP002', targetEmployeeId: 'EMP001', content: 'Great team player! Always willing to help with complex problems.', flagged: false, createdAt: '2026-01-15' },
  { id: 'c2', fromEmployeeId: 'EMP003', targetEmployeeId: 'EMP001', content: 'John has excellent technical skills and communicates clearly.', flagged: false, createdAt: '2026-01-10' },
  { id: 'c3', fromEmployeeId: 'EMP004', targetEmployeeId: 'EMP001', content: 'Very helpful in cross-team collaborations.', flagged: false, createdAt: '2026-01-08' },
  { id: 'c4', fromEmployeeId: 'EMP001', targetEmployeeId: 'EMP002', content: 'Sarah creates amazing designs that users love!', flagged: false, createdAt: '2026-01-14' },
  { id: 'c5', fromEmployeeId: 'EMP005', targetEmployeeId: 'EMP003', content: 'Michael keeps our systems running smoothly.', flagged: false, createdAt: '2026-01-12' },
];

// ==================== Messages ====================
export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'EMP002',
    senderName: 'Sarah Mitchell',
    receiverId: 'EMP001',
    receiverName: 'John Anderson',
    subject: 'Design Review Meeting',
    body: 'Hi John,\n\nCould we schedule a design review meeting for the new dashboard feature? I have some mockups ready for your feedback.\n\nBest,\nSarah',
    timestamp: '2026-01-18T10:30:00Z',
    read: false,
  },
  {
    id: 'm2',
    senderId: 'ADM001',
    senderName: 'Jennifer Williams',
    receiverId: 'EMP001',
    receiverName: 'John Anderson',
    subject: 'Performance Review Scheduled',
    body: 'Dear John,\n\nYour quarterly performance review has been scheduled for next Monday at 2 PM. Please prepare your self-assessment document.\n\nRegards,\nJennifer',
    timestamp: '2026-01-17T14:00:00Z',
    read: true,
  },
  {
    id: 'm3',
    senderId: 'EMP003',
    senderName: 'Michael Chen',
    receiverId: 'EMP001',
    receiverName: 'John Anderson',
    subject: 'Server Maintenance Notice',
    body: 'Hi John,\n\nJust a heads up that we will be performing server maintenance this weekend. The staging environment will be down from Saturday 10 PM to Sunday 6 AM.\n\nLet me know if you have any concerns.\n\nMichael',
    timestamp: '2026-01-16T09:15:00Z',
    read: true,
  },
  {
    id: 'm4',
    senderId: 'EMP001',
    senderName: 'John Anderson',
    receiverId: 'EMP002',
    receiverName: 'Sarah Mitchell',
    subject: 'Re: Component Library',
    body: 'Hi Sarah,\n\nI have reviewed the component library documentation. It looks great! I have a few suggestions for the button variants.\n\nLet me know when you are free to discuss.\n\nJohn',
    timestamp: '2026-01-15T16:45:00Z',
    read: true,
  },
];

// ==================== Announcements ====================
export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'New Remote Work Policy',
    subject: 'Updated Guidelines for Work From Home',
    content: 'We are pleased to announce our updated remote work policy effective from February 1st, 2026.\n\n**Key Changes:**\n- Eligible employees can work remotely up to 3 days per week\n- Remote work requests must be submitted 24 hours in advance\n- All team meetings should be scheduled considering hybrid attendance\n\nPlease review the full policy document in the HR portal and reach out to your manager with any questions.',
    author: 'Jennifer Williams',
    authorId: 'ADM001',
    createdAt: '2026-01-18T09:00:00Z',
    priority: 'high',
  },
  {
    id: 'a2',
    title: 'Q1 Company All-Hands Meeting',
    subject: 'Quarterly Update and Town Hall',
    content: 'Join us for our Q1 All-Hands meeting on January 25th at 3 PM.\n\n**Agenda:**\n- Q4 Performance Review\n- Q1 Goals and Objectives\n- New Product Roadmap Preview\n- Open Q&A Session\n\nThe meeting will be held in the main conference room with virtual attendance options available.',
    author: 'Jennifer Williams',
    authorId: 'ADM001',
    createdAt: '2026-01-15T11:00:00Z',
    priority: 'medium',
  },
  {
    id: 'a3',
    title: 'Office Renovation Update',
    subject: 'Third Floor Renovation Schedule',
    content: 'The third floor renovation will begin next week. During this period:\n\n- Engineering team will be temporarily relocated to the fourth floor\n- Please use the east stairwell as the west side will be blocked\n- Expected completion: February 15th\n\nWe apologize for any inconvenience.',
    author: 'Jennifer Williams',
    authorId: 'ADM001',
    createdAt: '2026-01-12T14:30:00Z',
    priority: 'low',
  },
];

// ==================== Directory (derived from users) ====================
export const mockDirectory: EmployeeCard[] = mockUsers.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  department: user.department,
  position: user.position,
  rating: user.rating,
  ratingCount: user.ratingCount,
  profileImage: user.profileImage,
}));

// ==================== Approval Requests ====================
export const mockApprovals: ApprovalRequest[] = [
  {
    id: 'apr1',
    type: 'ATTENDANCE_FIX',
    employeeId: 'EMP003',
    employeeName: 'Michael Chen',
    date: '2026-01-15',
    reason: 'Traffic jam due to accident on highway. Was 30 minutes late.',
    status: 'PENDING',
    createdAt: '2026-01-15T11:00:00Z',
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'apr2',
    type: 'WFH',
    employeeId: 'EMP005',
    employeeName: 'David Park',
    date: '2026-01-22',
    reason: 'Plumber visit scheduled for apartment repairs.',
    status: 'PENDING',
    createdAt: '2026-01-18T09:30:00Z',
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'apr3',
    type: 'SICK_LEAVE',
    employeeId: 'EMP004',
    employeeName: 'Emily Rodriguez',
    date: '2026-01-20',
    reason: 'Feeling unwell, need to rest and recover.',
    status: 'PENDING',
    createdAt: '2026-01-19T08:00:00Z',
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'apr4',
    type: 'ATTENDANCE_FIX',
    employeeId: 'EMP002',
    employeeName: 'Sarah Mitchell',
    date: '2026-01-10',
    reason: 'Had a dentist appointment in the morning.',
    status: 'APPROVED',
    createdAt: '2026-01-10T14:00:00Z',
    resolvedAt: '2026-01-11T09:00:00Z',
    resolvedBy: 'ADM001',
  },
];

// ==================== Grievances ====================
export const mockGrievances: Grievance[] = [
  {
    id: 'g1',
    employeeId: 'EMP002',
    employeeName: 'Sarah Mitchell',
    category: 'WORKPLACE_SAFETY',
    description: 'The emergency exit on the second floor has been blocked by storage boxes for the past week. This is a safety hazard.',
    resolved: false,
    createdAt: '2026-01-17T10:00:00Z',
    resolvedAt: null,
    resolvedBy: null,
  },
  {
    id: 'g2',
    employeeId: 'EMP005',
    employeeName: 'David Park',
    category: 'OTHER',
    description: 'The air conditioning in the finance department has been malfunctioning, making it difficult to work comfortably.',
    resolved: false,
    createdAt: '2026-01-16T15:30:00Z',
    resolvedAt: null,
    resolvedBy: null,
  },
];

// ==================== Notifications ====================
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'ANNOUNCEMENT',
    message: 'New announcement: Remote Work Policy Update',
    read: false,
    createdAt: '2026-01-18T09:00:00Z',
    linkTo: '/announcements',
  },
  {
    id: 'n2',
    type: 'MESSAGE',
    message: 'New message from Sarah Mitchell',
    read: false,
    createdAt: '2026-01-18T10:30:00Z',
    linkTo: '/inbox',
  },
  {
    id: 'n3',
    type: 'SYSTEM',
    message: 'Your attendance correction request was approved',
    read: true,
    createdAt: '2026-01-11T09:00:00Z',
  },
];

// ==================== Login Credentials ====================
export const mockCredentials: Record<string, { password: string; userId: string }> = {
  'john.anderson': { password: 'password123', userId: 'EMP001' },
  'sarah.mitchell': { password: 'password123', userId: 'EMP002' },
  'michael.chen': { password: 'password123', userId: 'EMP003' },
  'emily.rodriguez': { password: 'password123', userId: 'EMP004' },
  'david.park': { password: 'password123', userId: 'EMP005' },
  'jennifer.williams': { password: 'admin123', userId: 'ADM001' },
};

// ==================== Departments List ====================
export const departments = [
  'Engineering',
  'Design',
  'Marketing',
  'Finance',
  'Human Resources',
  'Operations',
  'Sales',
];

// ==================== Attendance Rules ====================
export const attendanceRules = [
  {
    title: 'Office Hours',
    description: 'Standard office hours are from 10:00 AM to 7:00 PM, Monday through Friday.',
  },
  {
    title: 'Clock-In Buffer',
    description: 'A 10-minute buffer is allowed for clock-in (9:50 AM - 10:10 AM). Arrivals after 10:10 AM are marked as late.',
  },
  {
    title: 'Clock-Out Buffer',
    description: 'A 10-minute buffer is allowed for clock-out (6:50 PM - 7:10 PM). Departures before 6:50 PM are marked as early.',
  },
  {
    title: 'Weekends',
    description: 'No work is required on Saturdays and Sundays. The clock-in button is disabled on weekends.',
  },
  {
    title: 'Holidays',
    description: 'Official holidays are defined by the organization. No attendance is required on these days.',
  },
  {
    title: 'Attendance Corrections',
    description: 'Each employee can request up to 5 attendance corrections per year. These do not modify total work hours but can excuse late arrivals.',
  },
  {
    title: 'Sick Leave',
    description: 'Each employee is entitled to 3 sick leave days per year. Additional sick leave requires medical documentation.',
  },
  {
    title: 'Work From Home',
    description: 'WFH eligibility is role-based. Non-eligible employees can request WFH with manager approval. Unapproved remote clock-ins will be flagged.',
  },
];
