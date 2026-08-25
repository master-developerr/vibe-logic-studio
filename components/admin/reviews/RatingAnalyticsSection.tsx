"use client";

import React from "react";
import { Star, Smile, Meh, Frown, Users, BookOpen } from "lucide-react";

interface AnalyticsProps {
  ratingDistribution: Array<{ stars: number; count: number; percentage: number }>;
  sentimentDistribution: Array<{ name: string; count: number; percentage: number }>;
  reviewsByMonth: Array<{ month: string; count: number; avgRating: number }>;
  instructorRankings: Array<{ name: string; courseCount: number; reviewCount: number; avgRating: number }>;
  courseRankings: Array<{ title: string; category: string; reviewCount: number; avgRating: number }>;
  isLoading: boolean;
}

export function RatingAnalyticsSection({
  ratingDistribution,
  sentimentDistribution,
  reviewsByMonth,
  instructorRankings,
  courseRankings,
  isLoading,
}: AnalyticsProps) {
  if (isLoading) {
    return <div className="h-64 animate-pulse bg-surface rounded-2xl" />;
  }

  const maxMonthCount = Math.max(...reviewsByMonth.map((m) => m.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1: Rating Distribution & Sentiment */}
      <div className="space-y-6 flex flex-col">
        {/* Rating Distribution */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-sm font-bold text-text-primary mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3">
                <span className="text-xs font-semibold w-12 text-right text-text-muted flex items-center justify-end gap-1">
                  {dist.stars} <Star className="w-3 h-3 fill-warning text-warning" />
                </span>
                <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-1000"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right text-text-secondary">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex-1">
          <h3 className="text-sm font-bold text-text-primary mb-4">Sentiment Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            {sentimentDistribution.map((sent) => {
              const isPositive = sent.name === "Positive";
              const isNeutral = sent.name === "Neutral";
              const Icon = isPositive ? Smile : isNeutral ? Meh : Frown;
              const colorClass = isPositive ? "text-success" : isNeutral ? "text-warning" : "text-error";
              const bgClass = isPositive ? "bg-success/10" : isNeutral ? "bg-warning/10" : "bg-error/10";

              return (
                <div key={sent.name} className="flex flex-col items-center justify-center text-center">
                  <div className={`p-3 rounded-full mb-2 ${bgClass}`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                  <span className="text-xl font-bold text-text-primary">{sent.percentage}%</span>
                  <span className="text-xs font-medium text-text-muted mt-1">{sent.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Column 2: Volume Trends & Instructor Rankings */}
      <div className="space-y-6 flex flex-col">
        {/* Trend Chart (Simple CSS Bar Chart) */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-sm font-bold text-text-primary mb-4">Review Volume (6 Months)</h3>
          <div className="h-32 flex items-end justify-between gap-2 mt-4">
            {reviewsByMonth.map((month) => {
              const height = `${(month.count / maxMonthCount) * 100}%`;
              return (
                <div key={month.month} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full relative h-full flex flex-col justify-end bg-background rounded-t-md overflow-hidden">
                    <div
                      className="w-full bg-primary/80 rounded-t-md transition-all duration-1000 group-hover:bg-primary"
                      style={{ height }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                      {month.count} reviews • {month.avgRating} avg
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructor Rankings */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Top Instructors</h3>
            <Users className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-4">
            {instructorRankings.map((inst, idx) => (
              <div key={inst.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted w-4">{idx + 1}.</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{inst.name}</p>
                    <p className="text-[10px] text-text-muted">{inst.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-md">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-xs font-bold text-warning">{inst.avgRating.toFixed(1)}</span>
                </div>
              </div>
            ))}
            {instructorRankings.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Column 3: Course Rankings */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary">Top Rated Courses</h3>
          <BookOpen className="w-4 h-4 text-text-muted" />
        </div>
        <div className="space-y-4 flex-1">
          {courseRankings.map((course, idx) => (
            <div key={course.title} className="flex items-start justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                <span className="text-xs font-bold text-text-muted w-4 mt-0.5">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-background rounded-full text-text-secondary truncate">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{course.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-sm font-extrabold text-text-primary">{course.avgRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
          {courseRankings.length === 0 && (
            <p className="text-sm text-text-muted text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
