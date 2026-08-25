"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import {
  Loader2,
  Users,
  Calendar,
  Video,
  FileText,
  Megaphone,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type StudentRow = {
  enrollmentId: string;
  name: string;
  email: string;
  status: string;
  progress: number;
  enrolledAt: string;
};

const columns: ColumnDef<StudentRow>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-text-primary text-sm">{row.original.name}</p>
        <p className="text-xs text-text-muted">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-700 border border-green-200">
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${row.original.progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-text-secondary">
          {row.original.progress}%
        </span>
      </div>
    ),
  },
  {
    accessorKey: "enrolledAt",
    header: "Enrolled",
    cell: ({ row }) => (
      <span className="text-xs text-text-muted">
        {new Date(row.original.enrolledAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

export default function BatchOverviewTab() {
  const params = useParams();
  const batchId = params.batchId as any;

  const workspace = useQuery(api.admin.getBatchWorkspace, { batchId });

  if (workspace === undefined) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (workspace === null) return null;

  const { batch, course, students, liveClasses, studyMaterials, announcements, revenue } = workspace;

  return (
    <div className="flex flex-col gap-8">
      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href={`/admin/batches/${batchId}/students`}
          className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Enrolled Students
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{students.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href={`/admin/batches/${batchId}/calendar`}
          className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Live Sessions
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{liveClasses.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href={`/admin/batches/${batchId}/materials`}
          className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Study Materials
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{studyMaterials.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href={`/admin/batches/${batchId}/announcements`}
          className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Announcements
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{announcements.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Megaphone className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Main Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Enrolled Students */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-text-primary">
                Learner Cohort Roster
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Students actively enrolled in this cohort batch
              </p>
            </div>
            <Link
              href={`/admin/batches/${batchId}/students`}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Manage Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {students.length === 0 ? (
            <div className="py-12 text-center bg-background rounded-xl border border-dashed border-border my-auto">
              <Users className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary">No students enrolled yet.</p>
              <p className="text-xs text-text-muted mt-0.5">
                Use the Students tab to manually enroll learners.
              </p>
              <Link href={`/admin/batches/${batchId}/students`} className="mt-3 inline-block">
                <Button size="sm">Enroll Student</Button>
              </Link>
            </div>
          ) : (
            <DataTable columns={columns} data={students as StudentRow[]} />
          )}
        </div>

        {/* Right 1 Col: Upcoming Sessions & Recent Announcements */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Scheduled Live Sessions Panel */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary">Scheduled Sessions</h3>
              <Link
                href={`/admin/batches/${batchId}/calendar`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Calendar
              </Link>
            </div>

            {liveClasses.length === 0 ? (
              <div className="py-6 text-center bg-background rounded-xl border border-dashed border-border">
                <p className="text-xs text-text-muted">No live sessions scheduled.</p>
                <Link href={`/admin/batches/${batchId}/calendar`} className="mt-2 inline-block">
                  <Button size="sm" variant="outline" className="text-xs">
                    Schedule Class
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {liveClasses.slice(0, 3).map((lc) => (
                  <div
                    key={lc.id}
                    className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text-primary line-clamp-1">
                          {lc.title}
                        </h4>
                        <p className="text-[11px] text-text-muted">
                          {new Date(lc.startTime).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <a
                      href={lc.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      Join
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements Feed */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary">Recent Broadcasts</h3>
              <Link
                href={`/admin/batches/${batchId}/announcements`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                New
              </Link>
            </div>

            {announcements.length === 0 ? (
              <div className="py-6 text-center bg-background rounded-xl border border-dashed border-border">
                <p className="text-xs text-text-muted">No announcements posted for this cohort.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-xs text-text-primary">{a.title}</h4>
                    <p className="text-[11px] text-text-muted mt-1 line-clamp-2">{a.content}</p>
                    <span className="text-[10px] text-text-secondary mt-2 block">
                      {new Date(a.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
