"use client";

import React from "react";
import { Lightbulb, TrendingUp, AlertTriangle, Info, BookOpen, Users } from "lucide-react";

interface Insight {
  type: "positive" | "warning" | "info";
  title: string;
  description: string;
}

interface LeaderboardCourse {
  id: string;
  title: string;
  revenue: number;
  enrollments: number;
}

interface LeaderboardInstructor {
  name: string;
  rating: number;
  students: number;
}

interface SmartInsightsProps {
  insights: Insight[];
  leaderboards: {
    topCourses: LeaderboardCourse[];
    topInstructors: LeaderboardInstructor[];
  };
  isLoading: boolean;
}

export function SmartInsights({ insights, leaderboards, isLoading }: SmartInsightsProps) {
  if (isLoading) {
    return <div className="h-64 bg-surface animate-pulse rounded-2xl border border-border shadow-sm mb-6" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Smart Highlights */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h3 className="text-base font-bold text-text-primary">Smart Insights</h3>
        </div>
        <div className="space-y-4 flex-1">
          {insights?.map((insight, idx) => {
            const isPos = insight.type === "positive";
            const isWarn = insight.type === "warning";
            const Icon = isPos ? TrendingUp : isWarn ? AlertTriangle : Info;
            const colorClass = isPos ? "text-success" : isWarn ? "text-error" : "text-info";
            const bgClass = isPos ? "bg-success/10 border-success/20" : isWarn ? "bg-error/10 border-error/20" : "bg-info/10 border-info/20";
            
            return (
              <div key={idx} className={`p-4 rounded-xl border ${bgClass} flex gap-3 items-start`}>
                <div className={`p-1.5 rounded-md bg-background shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${colorClass} mb-1`}>{insight.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{insight.description}</p>
                </div>
              </div>
            );
          })}
          {(!insights || insights.length === 0) && (
            <p className="text-sm text-text-muted text-center py-8">No new insights right now.</p>
          )}
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary">Top Performing Courses</h3>
          <BookOpen className="w-4 h-4 text-text-muted" />
        </div>
        <div className="space-y-3 flex-1">
          {leaderboards?.topCourses.map((course, idx) => (
            <div key={course.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border">
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                <span className="text-xs font-bold text-text-muted w-4">{idx + 1}.</span>
                <p className="text-sm font-semibold text-text-primary truncate">{course.title}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-success">
                  ${course.revenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted">{course.enrollments} sales</span>
              </div>
            </div>
          ))}
          {(!leaderboards?.topCourses || leaderboards.topCourses.length === 0) && (
            <p className="text-sm text-text-muted text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Top Instructors */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary">Top Instructors</h3>
          <Users className="w-4 h-4 text-text-muted" />
        </div>
        <div className="space-y-3 flex-1">
          {leaderboards?.topInstructors.map((inst, idx) => (
            <div key={inst.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border">
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                <span className="text-xs font-bold text-text-muted w-4">{idx + 1}.</span>
                <p className="text-sm font-semibold text-text-primary truncate">{inst.name}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-warning flex items-center gap-1">
                  {inst.rating.toFixed(1)} ★
                </span>
                <span className="text-[10px] text-text-muted">{inst.students.toLocaleString()} students</span>
              </div>
            </div>
          ))}
          {(!leaderboards?.topInstructors || leaderboards.topInstructors.length === 0) && (
            <p className="text-sm text-text-muted text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
