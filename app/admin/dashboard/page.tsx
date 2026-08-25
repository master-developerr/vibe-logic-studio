"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  IndianRupee,
  Users,
  Video,
  Star,
  TrendingUp,
  Plus,
  BookOpen,
  Layers,
  Megaphone,
  ImageIcon,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Button } from "@/components/ui/button";
import { QuickCreateModal } from "@/components/admin/QuickCreateModal";

/* ─── Mock weekly revenue data ───────────────────────────── */
const weeklyRevenue = [
  { day: "Mon", revenue: 4200, enrollments: 8 },
  { day: "Tue", revenue: 6800, enrollments: 14 },
  { day: "Wed", revenue: 5900, enrollments: 11 },
  { day: "Thu", revenue: 9200, enrollments: 22 },
  { day: "Fri", revenue: 7100, enrollments: 16 },
  { day: "Sat", revenue: 5300, enrollments: 9 },
  { day: "Sun", revenue: 4600, enrollments: 7 },
];

/* ─── Mock course popularity ─────────────────────────────── */
const coursePopularity = [
  { name: "AI Product Management", pct: 84, full: true },
  { name: "Python for Data Science", pct: 62, full: false },
  { name: "UX for AI Interfaces", pct: 95, full: true },
];

/* ─── Mock upcoming live sessions ───────────────────────── */
const upcomingSessions = [
  { id: "1", date: "OCT\n26", title: "Prompt Engineering Q&A", time: "06:00 PM", instructor: "Sarah Parker" },
  { id: "2", date: "OCT\n26", title: "Advanced LLM Training", time: "08:00 PM", instructor: "David Chan" },
];

/* ─── Mock recent activity ───────────────────────────────── */
const mockActivity = [
  {
    id: "a1",
    type: "payment",
    message: "Payment completed by",
    name: "Sarah Jenkins",
    sub: "Course: AI Prompt Engineering Mastery",
    time: "2 mins ago",
    icon: CheckCircle2,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: "a2",
    type: "enrollment",
    message: "New student enrolled:",
    name: "Mark Thompson",
    sub: "Batch: LLM Ops Weekend · Nov '23",
    time: "15 mins ago",
    icon: UserPlus,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    id: "a3",
    type: "review",
    message: "New review received from",
    name: "Emily Wong",
    sub: "★★★★★  \"Life changing course!\"",
    time: "1 hour ago",
    icon: Star,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
];

/* ═══════════════════════════════════════════════════════════
   Dashboard Page
═══════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const { user } = useUser();
  const stats = useQuery(api.admin.getDashboardStats);
  const batches = useQuery(api.admin.getAllBatches);
  const [chartMode, setChartMode] = useState<"revenue" | "enrollments">("revenue");
  const [quickCreate, setQuickCreate] = useState(false);

  /* Loading state */
  if (stats === undefined || batches === undefined) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  /* Dehydrated/cached query safeguard */
  const safeStats = {
    totalRevenue: stats.totalRevenue ?? 0,
    activeStudents: stats.activeStudents ?? 0,
    todaysLiveClasses: stats.todaysLiveClasses ?? 0,
    pendingReviews: stats.pendingReviews ?? 0,
    activeCourses: stats.activeCourses ?? 0,
    recentEnrollments: stats.recentEnrollments ?? [],
  };

  const today = new Date().toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <QuickCreateModal open={quickCreate} onOpenChange={setQuickCreate} />

      {/* ── Page Header ──────────────────────────────── */}
      <AdminPageHeader
        title={`Welcome back, ${user?.firstName || user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Admin"}`}
        emoji="👋"
        subtitle="Here's what's happening at VibeLogic Studio today."
        controls={
          <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-surface text-[12px] text-text-secondary shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
        }
      />

      {/* ── Row 1: 5 Stat Cards ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={`₹${safeStats.totalRevenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee className="w-4 h-4" />}
          trend="+12%"
          trendPositive
        />
        <StatCard
          label="Active Students"
          value={safeStats.activeStudents.toLocaleString()}
          icon={<Users className="w-4 h-4" />}
          trend="+8%"
          trendPositive
        />
        <StatCard
          label="Today's Live Classes"
          value={safeStats.todaysLiveClasses.toString()}
          icon={<Video className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Reviews"
          value={safeStats.pendingReviews.toString()}
          icon={<Star className="w-4 h-4" />}
          badge={safeStats.pendingReviews > 0 ? "Pending" : undefined}
          badgeColor="warning"
        />
        <StatCard
          label="Completion Rate"
          value="78.4%"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* ── Row 2: Chart + Right Panel ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-6">
        {/* Revenue & Enrollments chart */}
        <AdminCard padding="md">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-semibold text-text-primary">
              Revenue &amp; Enrollments Trend
            </h2>
            {/* Toggle tabs */}
            <div className="flex items-center gap-1 bg-background rounded-lg p-0.5 border border-border">
              {(["revenue", "enrollments"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-all capitalize ${
                    chartMode === mode
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {mode === "revenue" ? "Revenue" : "Enrollments"}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  dx={-8}
                  tickFormatter={
                    chartMode === "revenue"
                      ? (v) => `₹${v / 1000}k`
                      : (v) => `${v}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                  }}
                  formatter={(val: any) =>
                    chartMode === "revenue"
                      ? [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]
                      : [`${val}`, "Enrollments"]
                  }
                />
                <Bar
                  dataKey={chartMode}
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                  /* Inactive bars get lighter fill — achieved via opacity on cell-level */
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        {/* Right side panel */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions card */}
          <AdminCard padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Course",  icon: BookOpen,  href: "/admin/courses",   onClick: null },
                { label: "New Batch",   icon: Layers,    href: "/admin/batches",   onClick: null },
                { label: "Announce",    icon: Megaphone, href: null,               onClick: () => setQuickCreate(true) },
                { label: "Media",       icon: ImageIcon, href: "/admin/media",     onClick: null },
              ].map((action) => {
                const Icon = action.icon;
                const inner = (
                  <>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-background border border-border text-text-secondary group-hover:text-primary group-hover:border-primary/30 transition-colors mb-1.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      {action.label}
                    </span>
                  </>
                );

                if (action.onClick) {
                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="group flex flex-col items-center justify-center py-3 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      {inner}
                    </button>
                  );
                }

                return (
                  <Link
                    key={action.label}
                    href={action.href!}
                    className="group flex flex-col items-center justify-center py-3 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </AdminCard>

          {/* Course Popularity card */}
          <AdminCard padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">
              Course Popularity
            </h3>
            <div className="space-y-3">
              {coursePopularity.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="text-text-secondary font-medium truncate max-w-[140px]">
                      {c.name}
                    </span>
                    <span
                      className={`font-semibold ${
                        c.full ? "text-error" : "text-text-primary"
                      }`}
                    >
                      {c.pct}%{c.full ? " Full" : ""}
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* ── Row 3: Recent Activity + Next Live Sessions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Recent Activity */}
        <AdminCard padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">
              Recent Activity
            </h3>
            <Link
              href="/admin/students"
              className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {mockActivity.length === 0 ? (
            <AdminEmptyState
              title="No recent activity"
              description="Student enrollments and payment events will appear here."
            />
          ) : (
            <div className="space-y-0">
              {mockActivity.map((ev, idx) => {
                const Icon = ev.icon;
                return (
                  <div
                    key={ev.id}
                    className={`flex items-start gap-3.5 py-3.5 ${
                      idx < mockActivity.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {/* Activity icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ev.iconBg}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${ev.iconColor}`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-text-secondary leading-snug">
                        {ev.message}{" "}
                        <span className="font-semibold text-text-primary">
                          {ev.name}
                        </span>
                      </p>
                      <p className="text-[12px] text-text-muted mt-0.5 truncate">
                        {ev.sub}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span className="text-[11px] text-text-muted shrink-0 mt-0.5">
                      {ev.time}
                    </span>
                  </div>
                );
              })}

              {/* Real enrollments from Convex, appended */}
              {safeStats.recentEnrollments.slice(0, 2).map((en, idx) => (
                <div
                  key={en.id}
                  className="flex items-start gap-3.5 py-3.5 border-t border-border"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-info/10">
                    <UserPlus className="w-3.5 h-3.5 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-secondary leading-snug">
                      Enrolled:{" "}
                      <span className="font-semibold text-text-primary">
                        {en.studentName}
                      </span>
                    </p>
                    <p className="text-[12px] text-text-muted mt-0.5 truncate">
                      {en.courseName}
                    </p>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0 mt-0.5">
                    <StatusBadge status={en.status} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Next Live Sessions */}
        <AdminCard padding="md">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">
            Next Live Sessions
          </h3>

          {upcomingSessions.length === 0 ? (
            <AdminEmptyState
              title="No upcoming sessions"
              description="Schedule a live class to see it here."
            />
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((s) => {
                const [month, day] = s.date.split("\n");
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                  >
                    {/* Date block */}
                    <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-primary uppercase leading-none">
                        {month}
                      </span>
                      <span className="text-[14px] font-bold text-primary leading-none">
                        {day}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary truncate">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {s.time} · {s.instructor}
                      </p>
                    </div>

                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-border text-text-muted hover:text-primary hover:border-primary/40 transition-colors shrink-0"
                      aria-label="View session"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active batches quick glance */}
          {batches.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                Live Cohorts
              </h4>
              <div className="space-y-2">
                {batches
                  .filter((b) => b.status === "live" || b.status === "upcoming")
                  .slice(0, 2)
                  .map((b) => (
                    <Link
                      key={b.id}
                      href={`/admin/batches/${b.id}/overview`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-[12px] text-text-secondary truncate group-hover:text-primary transition-colors">
                        {b.title}
                      </span>
                      <StatusBadge status={b.status} className="text-[10px]" />
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </>
  );
}
