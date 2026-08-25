import React from "react";
import { DrawerStudentRow } from "./types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { Shield, Key, Smartphone, MapPin } from "lucide-react";

export function SecurityTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1 px-1">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight">Security & Access</h3>
        <p className="text-[12px] text-text-muted">Manage account security, active sessions, and access logs.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-background/50">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-[13px] font-bold text-text-primary">Authentication</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Account Status</span>
            <StatusBadge status={student.accountStatus || "active"} />
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Two-Factor Auth</span>
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded border", 
              student.security?.mfaEnabled 
                ? "bg-success/10 text-success border-success/20" 
                : "bg-background text-text-muted border-border/60"
            )}>
              {student.security?.mfaEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Identity Verification</span>
            <span className={cn(
              "font-semibold",
              student.security?.verificationStatus === "Verified" ? "text-success" : "text-text-muted"
            )}>
              {student.security?.verificationStatus || "Unverified"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-background/50">
          <Smartphone className="w-4 h-4 text-text-secondary" />
          <h3 className="text-[13px] font-bold text-text-primary">Recent Access</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Last Login</span>
            <span className="text-text-primary font-semibold">
              {student.security?.lastLogin ? new Date(student.security.lastLogin).toLocaleString() : "Never"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">IP Address</span>
            <span className="text-text-secondary font-mono bg-background px-1.5 py-0.5 rounded border border-border/40">
              {student.security?.ip || "Unknown"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Primary Device</span>
            <span className="text-text-primary font-medium">
              {student.security?.device || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button className="w-full h-10 bg-surface border border-border/80 rounded-xl text-[13px] font-semibold text-text-primary hover:border-border hover:bg-background transition-all flex items-center justify-center gap-2">
          <Key className="w-4 h-4 text-text-muted" />
          Send Password Reset Link
        </button>
        <button className="w-full h-10 bg-surface border border-border/80 rounded-xl text-[13px] font-semibold text-text-primary hover:border-border hover:bg-background transition-all flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4 text-text-muted" />
          Force Logout All Devices
        </button>
      </div>
    </div>
  );
}
