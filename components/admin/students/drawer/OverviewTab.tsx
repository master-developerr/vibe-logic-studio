import React from "react";
import { DrawerStudentRow } from "./types";
import { 
  Mail, Calendar, BookOpen, Activity, 
  ShieldAlert, CheckCircle2 
} from "lucide-react";

export function OverviewTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Mail, label: "Email", value: student.email },
          { icon: Calendar, label: "Joined", value: new Date(student.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          { icon: BookOpen, label: "Courses Enrolled", value: `${student.enrollmentsCount} course${student.enrollmentsCount !== 1 ? "s" : ""}` },
          { icon: Activity, label: "Account Status", value: student.accountStatus || "Active" },
          { icon: ShieldAlert, label: "System Role", value: (student.role || "student").toUpperCase() },
          { icon: CheckCircle2, label: "Identity", value: student.security?.verificationStatus || "Unverified" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-surface rounded-xl p-4 border border-border/60 flex flex-col justify-center hover:border-border transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-text-muted" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</span>
            </div>
            <p className="text-[14px] font-semibold text-text-primary truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Engagement Summary */}
      <div className="space-y-4">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight">Recent Engagement</h3>
        <div className="bg-surface rounded-xl border border-border/60 divide-y divide-border/40">
          <div className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-text-primary">Last Active</span>
              <span className="text-[12px] text-text-muted">
                {student.security?.lastLogin 
                  ? `Logged in on ${new Date(student.security.lastLogin).toLocaleDateString()} from ${student.security.device || "Web"}` 
                  : "Never logged in"}
              </span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-text-primary">Learning Streak</span>
              <span className="text-[12px] text-text-muted">
                {student.progress > 0 ? "Active learner" : "No recent activity"}
              </span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/10 text-warning text-[14px] font-bold">
              🔥
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
