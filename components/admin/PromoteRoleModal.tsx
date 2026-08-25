"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PromoteRoleModalProps = {
  open: boolean;
  onClose: () => void;
  studentId: Id<"users">;
  studentName: string;
  currentRole: string;
  currentPermissions?: string[];
};

const ROLES = [
  { id: "student", label: "Student", desc: "Standard learning access" },
  { id: "staff", label: "Staff", desc: "Support and moderation access" },
  { id: "instructor", label: "Instructor", desc: "Course creation and grading" },
  { id: "admin", label: "Admin", desc: "Full administrative access" },
];

const PERMISSIONS = [
  { id: "courses:write", label: "Manage Courses" },
  { id: "payments:read", label: "View Payments" },
  { id: "users:write", label: "Manage Users" },
  { id: "settings:write", label: "Manage Settings" },
];

export function PromoteRoleModal({ open, onClose, studentId, studentName, currentRole, currentPermissions = [] }: PromoteRoleModalProps) {
  const updateStudentEnterprise = useMutation(api.admin.updateStudentEnterprise);
  const [selectedRole, setSelectedRole] = useState(currentRole || "student");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(currentPermissions));
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole || "student");
      setSelectedPermissions(new Set(currentPermissions));
      setReason("");
      setConfirm(false);
      setError(null);
    }
  }, [open, currentRole, currentPermissions]);

  const togglePermission = (id: string) => {
    const next = new Set(selectedPermissions);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPermissions(next);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for this role change.");
      return;
    }
    if (!confirm) {
      setError("You must confirm this action.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateStudentEnterprise({
        studentId,
        role: selectedRole,
        permissions: Array.from(selectedPermissions),
        newRoleHistoryEntry: {
          oldRole: currentRole || "student",
          newRole: selectedRole,
          reason: reason.trim(),
        }
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to update role");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-surface rounded-2xl shadow-xl border border-border w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0 bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-text-primary">Manage Role & Permissions</h2>
                  <p className="text-[12px] text-text-muted mt-0.5">Update access for {studentName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-background transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="px-4 py-3 bg-error/10 border border-error/20 rounded-lg text-[13px] font-medium text-error flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Roles */}
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">System Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={cn(
                        "text-left p-3 rounded-xl border transition-all",
                        selectedRole === r.id
                          ? "bg-primary/5 border-primary/40 ring-1 ring-primary/40"
                          : "bg-background border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-[13px] font-bold", selectedRole === r.id ? "text-primary" : "text-text-primary")}>
                          {r.label}
                        </span>
                        {selectedRole === r.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-[11px] text-text-muted leading-tight">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Granular Permissions</label>
                <div className="bg-background border border-border rounded-xl p-2 space-y-1">
                  {PERMISSIONS.map(p => {
                    const active = selectedPermissions.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                          active ? "bg-primary/10" : "hover:bg-surface"
                        )}
                      >
                        <span className={cn("text-[13px] font-medium", active ? "text-primary" : "text-text-primary")}>
                          {p.label}
                        </span>
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", active ? "bg-primary border-primary text-white" : "border-border")}>
                          {active && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Reason for Change *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Promoted to support staff for the new batch"
                  className="w-full h-20 px-3 py-2.5 bg-background border border-border rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Confirm */}
              <label className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-xl cursor-pointer">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                    className="w-4 h-4 rounded accent-warning"
                  />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-warning-strong">Confirm Access Change</p>
                  <p className="text-[11px] text-warning-strong/80 mt-0.5 leading-relaxed">
                    This user will immediately inherit the selected role capabilities across the platform. This action will be recorded in the audit log.
                  </p>
                </div>
              </label>

            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background/50 shrink-0">
              <button type="button" onClick={onClose} className="h-9 px-4 rounded-full text-[13px] font-semibold text-text-secondary hover:bg-background border border-border transition-all">
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={submitting || !confirm || !reason.trim()}
                className="h-9 px-5 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? "Applying..." : "Apply Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
