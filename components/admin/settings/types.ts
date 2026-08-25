export interface BatchSettingsData {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  startDate: number;
  endDate: number;
  capacity: number;
  enrolledCount: number;
  status: string;
  description?: string;
  instructorName?: string;
  timezone?: string;
  enrollmentStatus?: string;
  allowWaitlist?: boolean;
  whatsappLink?: string;
  googleMeetLink?: string;
  discordLink?: string;
  notionLink?: string;
  extraLinks?: Array<{ title: string; url: string }>;
  attendanceEnabled?: boolean;
  assignmentsEnabled?: boolean;
  certificatesEnabled?: boolean;
  communityEnabled?: boolean;
  aiTutorEnabled?: boolean;
  sandboxEnabled?: boolean;
  isArchived?: boolean;
}

export interface BatchResourcesSummary {
  studyMaterialsCount: number;
  recordingsCount: number;
  announcementsCount: number;
  enrolledStudentsCount: number;
}

export interface BatchHealthAlert {
  type: "warning" | "info" | "error" | string;
  message: string;
}

export interface BatchAuditLogItem {
  id: string;
  action: string;
  user: string;
  timeAgo: string;
}

export interface BatchHealthMetrics {
  completenessScore: number;
  alerts: BatchHealthAlert[];
  auditLog: BatchAuditLogItem[];
}
