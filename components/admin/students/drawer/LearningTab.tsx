import React from "react";
import { DrawerStudentRow } from "./types";
import { PlayCircle, Download, CheckCircle2 } from "lucide-react";

export function LearningTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Overall Progress */}
      <div className="bg-surface rounded-xl border border-border/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-text-primary">Overall Completion</span>
          <span className="text-[24px] font-black text-primary">{student.progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${student.progress}%` }}
          />
        </div>
        <p className="text-[12px] text-text-muted">
          {student.progress >= 80 ? "Excellent progress — on track to complete!" :
           student.progress >= 50 ? "Good progress, keep it going!" :
           student.progress >= 25 ? "Getting started — needs encouragement." :
           "Early stage — may need attention."}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight px-1">Recent Learning Activity</h3>
        <div className="bg-surface rounded-xl border border-border/60 divide-y divide-border/40">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[13px] text-text-muted text-center italic">Detailed learning activity will be available soon.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
