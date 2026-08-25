"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BatchCalendarWorkspace } from "@/components/admin/BatchCalendarWorkspace";

export default function BatchCalendarTab() {
  // STRICT RULES OF HOOKS: All hooks called unconditionally at top level
  const params = useParams();
  const batchId = params?.batchId as any;

  const workspace = useQuery(
    api.admin.getBatchWorkspace,
    batchId ? { batchId } : "skip"
  );

  const batchTitle = workspace?.batch?.title || "Cohort Batch";

  if (workspace === undefined && batchId) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Breadcrumb context for active batch calendar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Cohort Schedule & Operations
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage sessions, milestones, exams, and attendance for {batchTitle}
          </p>
        </div>
      </div>

      {/* Complete Classroom Operating System Calendar Workspace */}
      <BatchCalendarWorkspace
        batchId={String(batchId || "default-batch")}
        batchName={batchTitle}
      />
    </div>
  );
}
