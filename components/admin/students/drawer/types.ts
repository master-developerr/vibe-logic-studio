export const DRAWER_TABS = [
  "Overview",
  "Enrollment",
  "Learning",
  "Attendance",
  "Assignments",
  "Payments",
  "Certificates",
  "Communication",
  "Notes",
  "Insights",
  "Security",
  "Activity",
  "Audit"
] as const;

export type DrawerTabId = (typeof DRAWER_TABS)[number];

export type DrawerStudentRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  progress: number;
  courseName: string;
  batchName: string;
  paymentStatus: string;
  enrollmentsCount: number;
  enrolledAt: string | null;
  enrollmentStatus: string;
  createdAt: string;
  role?: string;
  permissions?: string[];
  adminNotes?: Array<{ text: string; authorId: string; authorName: string; createdAt: number }>;
  roleHistory?: Array<{ oldRole: string; newRole: string; changedBy: string; reason: string; date: number }>;
  accountStatus?: string;
  security?: { lastLogin: number; ip: string; device: string; mfaEnabled: boolean; verificationStatus: string };
};
