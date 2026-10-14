import React, { useState } from "react";
import { DrawerStudentRow } from "./types";
import { 
  Mail, Calendar, BookOpen, Activity, 
  ShieldAlert, CheckCircle2, AlertCircle, Clock, Send, Loader2 
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function OnboardingEmailCard({ student }: { student: DrawerStudentRow }) {
  const resendEmail = useMutation(api.emails.resendDashboardAccessEmail);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const status = student.onboardingEmailStatus || "pending";
  const sentAt = student.onboardingEmailSentAt
    ? new Date(student.onboardingEmailSentAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleResend = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      await resendEmail({
        studentId: student.id as any,
        enrollmentId: student.enrollmentId as any,
      });
      setFeedback({
        type: "success",
        text: `Dashboard access email re-queued for ${student.email}`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.message || "Failed to trigger email resend",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-text-primary">Dashboard Access Email</h4>
            <p className="text-[11px] text-text-muted">Onboarding & access delivery status</p>
          </div>
        </div>

        {/* Status Chip */}
        {status === "sent" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sent
          </span>
        ) : status === "failed" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 text-[12px] border-t border-border/40">
        <div>
          <span className="text-text-muted block text-[11px]">Recipient</span>
          <span className="font-semibold text-text-primary truncate block">{student.email}</span>
        </div>
        <div>
          <span className="text-text-muted block text-[11px]">Delivered At</span>
          <span className="font-semibold text-text-primary">{sentAt || "Awaiting dispatch"}</span>
        </div>
      </div>

      {student.onboardingEmailLastError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[12px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{student.onboardingEmailLastError}</span>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3 rounded-lg text-[12px] flex items-start gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full h-9 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Re-queueing Email...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Resend Dashboard Access Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function OverviewTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Onboarding Email Status Card */}
      <OnboardingEmailCard student={student} />

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
