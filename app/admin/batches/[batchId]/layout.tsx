"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Users,
  Calendar,
  FileText,
  Video,
  Megaphone,
  Settings,
  Activity,
  LayoutDashboard,
  MessageCircle,
  IndianRupee,
  Share2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/AdminCard";

export default function BatchWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const batchId = params.batchId as any;

  const workspace = useQuery(api.admin.getBatchWorkspace, { batchId });

  if (workspace === undefined) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (workspace === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <p className="text-text-muted text-lg">Cohort batch not found</p>
        <Link href="/admin/batches">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return to Cohort Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const { batch, course, students, revenue } = workspace;

  const tabs = [
    { href: `/admin/batches/${batchId}/overview`, label: "Overview", icon: LayoutDashboard },
    { href: `/admin/batches/${batchId}/students`, label: "Students", icon: Users, count: students.length },
    { href: `/admin/batches/${batchId}/calendar`, label: "Calendar", icon: Calendar },
    { href: `/admin/batches/${batchId}/materials`, label: "Study Materials", icon: FileText },
    { href: `/admin/batches/${batchId}/recordings`, label: "Recordings", icon: Video },
    { href: `/admin/batches/${batchId}/announcements`, label: "Announcements", icon: Megaphone },
    { href: `/admin/batches/${batchId}/settings`, label: "Settings", icon: Settings },
    { href: `/admin/batches/${batchId}/activity`, label: "Activity", icon: Activity },
  ];

  let statusBg = "bg-slate-100 text-slate-700 border-slate-200";
  if (batch.status === "live") statusBg = "bg-green-100 text-green-700 border-green-200";
  if (batch.status === "upcoming") statusBg = "bg-blue-100 text-blue-700 border-blue-200";

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Back link */}
      <div>
        <Link
          href="/admin/batches"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cohort Catalog
        </Link>
      </div>

      {/* Persistent Cohort Header */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-background border border-border text-text-secondary">
                {course?.title || "Cohort Program"}
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusBg}`}
              >
                {batch.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {batch.title}
            </h1>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
              <span>
                {new Date(batch.startDate).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(batch.endDate).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>Workspace ID: {batch.id.slice(0, 8)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {batch.whatsappLink && (
              <a
                href={batch.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs font-semibold border border-green-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Community
              </a>
            )}
            <Link href={`/admin/batches/${batchId}/settings`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit3 className="w-3.5 h-3.5" />
                Edit Batch
              </Button>
            </Link>
          </div>
        </div>

        {/* Persistent KPI Bar below header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <span className="block text-[11px] font-semibold uppercase text-text-secondary">
              Seats Occupancy
            </span>
            <span className="text-lg font-bold text-text-primary mt-0.5 block">
              {batch.enrolledCount} / {batch.capacity} seats
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold uppercase text-text-secondary">
              Cohort Revenue
            </span>
            <span className="text-lg font-bold text-text-primary mt-0.5 block">
              ₹{(revenue ?? 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold uppercase text-text-secondary">
              Tuition Price
            </span>
            <span className="text-lg font-bold text-text-primary mt-0.5 block">
              ₹{(course?.price ?? 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold uppercase text-text-secondary">
              Cohort Status
            </span>
            <span className="text-lg font-bold text-text-primary mt-0.5 block capitalize">
              {batch.status}
            </span>
          </div>
        </div>

        {/* Persistent 8-Tab Workspace Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border pt-3 -mb-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-text-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-background"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-border text-text-secondary"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Workspace Tab Content */}
      <div className="w-full">{children}</div>
    </div>
  );
}
