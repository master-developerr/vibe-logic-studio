"use client";

import React from "react";
import { CreditCard, GraduationCap, Star, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function LiveActivityFeed() {
  const feed = useQuery(api.analytics_admin.getLiveActivity);
  const isLoading = feed === undefined;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 mb-6">
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-muted" /> Live Platform Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-background animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-background rounded animate-pulse w-3/4" />
                <div className="h-3 bg-background rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm flex flex-col mb-6 overflow-hidden">
      <div className="p-6 border-b border-border bg-background/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-muted" /> Live Platform Activity
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[400px] space-y-6">
        {feed?.map((event: any) => {
          let Icon = GraduationCap;
          let iconColor = "text-info";
          let iconBg = "bg-info/10";
          let message = "";

          if (event.type === "payment") {
            Icon = CreditCard;
            iconColor = "text-success";
            iconBg = "bg-success/10";
            message = `Paid $${event.amount} for ${event.courseTitle}`;
          } else if (event.type === "enrollment") {
            Icon = GraduationCap;
            iconColor = "text-primary";
            iconBg = "bg-primary/10";
            message = `Enrolled in ${event.courseTitle}`;
          } else if (event.type === "completion") {
            Icon = GraduationCap;
            iconColor = "text-warning";
            iconBg = "bg-warning/10";
            message = `Completed course ${event.courseTitle}`;
          } else if (event.type === "review") {
            Icon = Star;
            iconColor = "text-warning";
            iconBg = "bg-warning/10";
            message = `Left a ${event.rating} star review for ${event.courseTitle}`;
          }

          const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

          return (
            <div key={event.id} className="flex gap-4 group">
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                {/* Vertical connecting line */}
                <div className="w-px h-full bg-border absolute top-8 group-last:hidden" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-baseline justify-between mb-0.5">
                  <p className="text-sm font-semibold text-text-primary">{event.user}</p>
                  <span className="text-[10px] text-text-muted font-medium ml-2">{dateStr} at {timeStr}</span>
                </div>
                <p className="text-xs text-text-secondary">{message}</p>
              </div>
            </div>
          );
        })}
        {feed?.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">No recent activity found.</p>
        )}
      </div>
    </div>
  );
}
