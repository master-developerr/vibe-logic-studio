import React from "react";
import { DrawerStudentRow } from "./types";

export function AuditTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1 px-1">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight">Audit Trail</h3>
        <p className="text-[12px] text-text-muted">A secure log of all administrative actions taken on this account.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border/60 p-6">
        <div className="relative pl-6 border-l-2 border-border/40 space-y-8">
          {student.roleHistory && student.roleHistory.length > 0 ? (
            student.roleHistory.slice().reverse().map((entry, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-border ring-4 ring-surface group-hover:bg-primary transition-colors" />
                <p className="text-[13px] text-text-primary leading-relaxed">
                  <span className="font-bold text-text-primary">{entry.changedBy}</span> changed role from{" "}
                  <span className="font-mono bg-background px-1.5 py-0.5 border border-border/60 rounded text-text-secondary">{entry.oldRole}</span>{" "}
                  to{" "}
                  <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 border border-primary/20 rounded font-semibold">{entry.newRole}</span>
                </p>
                <p className="text-[12px] text-text-muted mt-1.5 italic bg-background/50 px-3 py-2 rounded-lg border border-border/40 inline-block">
                  "{entry.reason}"
                </p>
                <p className="text-[10px] text-text-muted/80 mt-2 uppercase tracking-wider font-semibold">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-[13px] text-text-muted pb-2">No audit logs found for this student.</div>
          )}
        </div>
      </div>
    </div>
  );
}
