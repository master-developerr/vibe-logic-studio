import React from "react";
import { DrawerStudentRow } from "./types";
import { BookOpen } from "lucide-react";

export function EnrollmentTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-surface rounded-xl border border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2 bg-background/50">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-[13px] font-bold text-text-primary">Current Enrollment</h3>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Course", value: student.courseName },
            { label: "Batch", value: student.batchName },
            { label: "Status", value: student.enrollmentStatus },
            { label: "Enrolled", value: student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-[13px]">
              <span className="text-text-muted">{label}</span>
              <span className="font-semibold text-text-primary">{value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight px-1">Enrollment History</h3>
        <div className="bg-surface rounded-xl border border-border/60 divide-y divide-border/40">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[13px] text-text-muted text-center italic">Detailed history will be available soon.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
