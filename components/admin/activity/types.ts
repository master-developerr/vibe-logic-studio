export type ActivityCategory = "All" | "Students" | "Content" | "Payments" | "System";
export type ActivityStatus = "SUCCESS" | "COMPLETED" | "PAID" | "REMOVED" | "WARNING" | "ERROR" | "ALL";
export type ActivityTypeFilter =
  | "ALL"
  | "student"
  | "instructor"
  | "admin"
  | "payment"
  | "system"
  | "attendance"
  | "announcement"
  | "material"
  | "recording"
  | "review";

export type DateRangeFilter = "ALL" | "TODAY" | "YESTERDAY" | "LAST_7" | "LAST_30";

export interface BatchActivityEvent {
  id: string;
  type: string;
  category: ActivityCategory;
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  actorInitials: string;
  action: string;
  target: string;
  timestamp: number;
  status: "SUCCESS" | "COMPLETED" | "PAID" | "REMOVED" | "WARNING" | "ERROR";
  ipAddress?: string;
  details?: string;
}

export interface BatchActivityKPIs {
  totalEvents: number;
  studentEvents: number;
  contentEvents: number;
  paymentEvents: number;
  systemEvents: number;
  todayEvents: number;
  weeklyEvents: number;
  monthlyEvents: number;
}

export interface BatchActivitySummaryItem {
  name: string;
  percentage: number;
  color: string;
}

export interface BatchContributor {
  name: string;
  role: string;
  avatar: string;
  events: number;
}

export interface BatchAlert {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  severity: "error" | "warning";
}

export interface BatchCalendarDate {
  day: number;
  isToday: boolean;
  hasActivity: boolean;
}

export interface BatchActivityGroup {
  groupTitle: string;
  dateKey: string;
  items: BatchActivityEvent[];
}

export interface BatchActivityExtendedData {
  batch: {
    id: string;
    title: string;
    status: string;
  };
  course: {
    id: string;
    title: string;
    category: string;
  } | null;
  kpis: BatchActivityKPIs;
  events: BatchActivityEvent[];
  groupedEvents: BatchActivityGroup[];
  activitySummary: BatchActivitySummaryItem[];
  topContributors: BatchContributor[];
  recentAlerts: BatchAlert[];
  calendarDates: BatchCalendarDate[];
}

export interface ActivityFilterState {
  search: string;
  category: ActivityCategory;
  eventType: ActivityTypeFilter;
  dateRange: DateRangeFilter;
  status: ActivityStatus;
  selectedDay?: number | null;
}
