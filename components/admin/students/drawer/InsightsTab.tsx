import React from "react";
import { DrawerStudentRow } from "./types";
import { Clock, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ 
  label, value, icon, trendPositive, trend 
}: { 
  label: string; value: string; icon: React.ReactNode; trendPositive?: boolean; trend?: string 
}) {
  return (
    <div className="bg-surface rounded-xl border border-border/60 p-5 hover:border-border transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-background border border-border/40 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[24px] font-black text-text-primary tracking-tight">{value}</span>
        {trend && (
          <span className={cn(
            "text-[12px] font-bold px-2 py-0.5 rounded border mb-1",
            trendPositive ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
          )}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export function InsightsTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1 px-1">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight">AI-Generated Insights</h3>
        <p className="text-[12px] text-text-muted">Metrics and predictions based on student learning patterns.</p>
      </div>

      <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-surface/50">
        <div className="text-4xl mb-3">🧠</div>
        <h4 className="text-[13px] font-bold text-text-primary mb-1">Gathering Data</h4>
        <p className="text-[12px] text-text-muted max-w-xs mx-auto">
          More learning activity is required before our AI can generate meaningful insights and predictions for {student.name}.
        </p>
      </div>
    </div>
  );
}
