"use client";

import React from "react";
import { Star, MessageSquare, CheckCircle, Clock, AlertTriangle, User, Award, TrendingUp } from "lucide-react";

interface KPIData {
  overallRating: number;
  totalReviews: number;
  publishedCount: number;
  pendingCount: number;
  flaggedCount: number;
  averageCourseRating: number;
  averageInstructorRating: number;
  monthlyGrowth: number;
}

interface ReviewsKPIGridProps {
  kpis: KPIData;
  isLoading: boolean;
}

export function ReviewsKPIGrid({ kpis, isLoading }: ReviewsKPIGridProps) {
  const cards = [
    {
      title: "Overall Platform Rating",
      value: isLoading ? "-" : kpis.overallRating.toFixed(1),
      icon: Star,
      trend: `+${kpis.monthlyGrowth}%`,
      trendLabel: "vs last month",
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
    },
    {
      title: "Total Reviews",
      value: isLoading ? "-" : kpis.totalReviews.toLocaleString(),
      icon: MessageSquare,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      title: "Published Reviews",
      value: isLoading ? "-" : kpis.publishedCount.toLocaleString(),
      icon: CheckCircle,
      colorClass: "text-success",
      bgClass: "bg-success/10",
    },
    {
      title: "Pending Moderation",
      value: isLoading ? "-" : kpis.pendingCount.toLocaleString(),
      icon: Clock,
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
      alert: kpis.pendingCount > 0,
    },
    {
      title: "Flagged & Reported",
      value: isLoading ? "-" : kpis.flaggedCount.toLocaleString(),
      icon: AlertTriangle,
      colorClass: "text-error",
      bgClass: "bg-error/10",
      alert: kpis.flaggedCount > 0,
    },
    {
      title: "Avg. Course Rating",
      value: isLoading ? "-" : kpis.averageCourseRating.toFixed(1),
      icon: Award,
      colorClass: "text-info",
      bgClass: "bg-info/10",
    },
    {
      title: "Avg. Instructor Rating",
      value: isLoading ? "-" : kpis.averageInstructorRating.toFixed(1),
      icon: User,
      colorClass: "text-info",
      bgClass: "bg-info/10",
    },
    {
      title: "Review Velocity",
      value: isLoading ? "-" : `${kpis.monthlyGrowth}%`,
      icon: TrendingUp,
      colorClass: "text-success",
      bgClass: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${card.bgClass}`}>
                <Icon className={`w-5 h-5 ${card.colorClass}`} />
              </div>
              {card.trend && (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-success/10 text-success">
                  {card.trend}
                </span>
              )}
              {card.alert && (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-error/10 text-error animate-pulse">
                  Action Needed
                </span>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-extrabold text-text-primary">
                  {card.value}
                </h4>
                {card.title.includes("Rating") && !isLoading && (
                  <Star className="w-4 h-4 text-warning fill-warning" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
