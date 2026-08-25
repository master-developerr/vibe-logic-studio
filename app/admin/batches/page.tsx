"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2,
  Layers,
  Plus,
  Users,
  Calendar,
  IndianRupee,
  MessageSquare,
  ArrowRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuickCreateModal } from "@/components/admin/QuickCreateModal";

export default function AdminBatchesCatalogPage() {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const batches = useQuery(api.admin.getAllBatches);

  if (batches === undefined) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredBatches = batches.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  // KPI Calculations
  const activeCount = batches.filter((b) => b.status === "live").length;
  const upcomingCount = batches.filter((b) => b.status === "upcoming").length;
  const totalStudents = batches.reduce((acc, b) => acc + b.enrolledCount, 0);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <QuickCreateModal open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Cohort Workspaces
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Dedicated operational workspaces for all live, upcoming, and archived batches.
          </p>
        </div>
        <Button
          onClick={() => setQuickCreateOpen(true)}
          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Spawn Cohort Batch
        </Button>
      </div>

      {/* Cohort Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Live Cohorts
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Upcoming Cohorts
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{upcomingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Cohort Learners
            </span>
            <p className="text-2xl font-bold text-text-primary mt-1">{totalStudents}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Cohorts" },
            { id: "live", label: "Live Active" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-text-primary text-white shadow-sm"
                  : "bg-surface text-text-secondary border border-border hover:bg-background"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cohorts Grid */}
      {filteredBatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-surface rounded-2xl border border-dashed border-border">
          <Layers className="w-12 h-12 text-text-muted mb-3" />
          <h3 className="text-lg font-bold text-text-primary">No Cohorts Found</h3>
          <p className="text-sm text-text-muted mt-1 max-w-sm">
            We couldn't find any cohorts matching this status filter. Spawn a new cohort batch to get started.
          </p>
          <Button onClick={() => setQuickCreateOpen(true)} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            Spawn Cohort Batch
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBatches.map((batch) => {
            const fillPct =
              batch.capacity > 0
                ? Math.min(Math.round((batch.enrolledCount / batch.capacity) * 100), 100)
                : 0;

            let statusBg = "bg-slate-100 text-slate-700 border-slate-200";
            if (batch.status === "live") statusBg = "bg-green-100 text-green-700 border-green-200";
            if (batch.status === "upcoming") statusBg = "bg-blue-100 text-blue-700 border-blue-200";

            return (
              <Link
                key={batch.id}
                href={`/admin/batches/${batch.id}/overview`}
                className="group bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top bar: course badge + status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-background border border-border text-text-secondary">
                      {batch.courseTitle}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusBg}`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors">
                    {batch.title}
                  </h3>

                  {/* Date range */}
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                    <Calendar className="w-3.5 h-3.5" />
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
                  </div>
                </div>

                {/* Seat Capacity Bar */}
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-text-secondary">Seat Occupancy</span>
                    <span className="text-text-primary">
                      {batch.enrolledCount} / {batch.capacity} seats ({fillPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between mt-4 text-xs">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <IndianRupee className="w-3.5 h-3.5 text-text-muted" />
                      <span className="font-semibold text-text-primary">
                        ₹{(batch.revenue ?? 0).toLocaleString("en-IN")}
                      </span>
                      <span>earned</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
