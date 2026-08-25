"use client";

import React from "react";
import { 
  DollarSign, Users, BookOpen, Layers, 
  CheckCircle, Award, Clock, HeartHandshake,
  TrendingUp, TrendingDown
} from "lucide-react";

interface KPIData {
  totalRevenue: number;
  revenueGrowth: number;
  activeStudents: number;
  studentsGrowth: number;
  activeCourses: number;
  totalBatches: number;
  courseCompletionRate: number;
  completionGrowth: number;
  certificatesIssued: number;
  averageSessionDuration: string;
  engagementScore: number;
  engagementGrowth: number;
  attendanceRate: number;
  attendanceGrowth: number;
  studentSatisfaction: number;
}

interface AnalyticsKPIGridProps {
  kpis: KPIData;
  isLoading: boolean;
}

export function AnalyticsKPIGrid({ kpis, isLoading }: AnalyticsKPIGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const MetricCard = ({ 
    title, value, icon: Icon, trend, trendLabel = "vs last period", 
    colorClass, bgClass, inverseTrend = false 
  }: any) => {
    const isPositive = trend > 0;
    const isNegative = trend < 0;
    const isGood = inverseTrend ? isNegative : isPositive;
    const isBad = inverseTrend ? isPositive : isNegative;
    
    return (
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-colors">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl ${bgClass}`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
              isGood ? 'bg-success/10 text-success' : isBad ? 'bg-error/10 text-error' : 'bg-surface text-text-muted'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider truncate" title={title}>
            {title}
          </p>
          <div className="flex flex-col mt-1">
            <h4 className="text-2xl font-extrabold text-text-primary">
              {isLoading ? "-" : value}
            </h4>
            {trend !== undefined && (
              <span className="text-[10px] text-text-secondary mt-1">{trendLabel}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        title="Total Revenue" 
        value={formatCurrency(kpis?.totalRevenue || 0)} 
        icon={DollarSign} 
        trend={kpis?.revenueGrowth}
        colorClass="text-success" bgClass="bg-success/10" 
      />
      <MetricCard 
        title="Active Students" 
        value={(kpis?.activeStudents || 0).toLocaleString()} 
        icon={Users} 
        trend={kpis?.studentsGrowth}
        colorClass="text-primary" bgClass="bg-primary/10" 
      />
      <MetricCard 
        title="Active Courses" 
        value={kpis?.activeCourses || 0} 
        icon={BookOpen} 
        colorClass="text-info" bgClass="bg-info/10" 
      />
      <MetricCard 
        title="Completion Rate" 
        value={`${(kpis?.courseCompletionRate || 0).toFixed(1)}%`} 
        icon={CheckCircle} 
        trend={kpis?.completionGrowth}
        colorClass="text-success" bgClass="bg-success/10" 
      />
      <MetricCard 
        title="Engagement Score" 
        value={`${kpis?.engagementScore || 0}/100`} 
        icon={HeartHandshake} 
        trend={kpis?.engagementGrowth}
        colorClass="text-warning" bgClass="bg-warning/10" 
      />
      <MetricCard 
        title="Avg Attendance" 
        value={`${(kpis?.attendanceRate || 0).toFixed(1)}%`} 
        icon={Clock} 
        trend={kpis?.attendanceGrowth}
        colorClass="text-primary" bgClass="bg-primary/10" 
      />
      <MetricCard 
        title="Certificates Issued" 
        value={(kpis?.certificatesIssued || 0).toLocaleString()} 
        icon={Award} 
        colorClass="text-warning" bgClass="bg-warning/10" 
      />
      <MetricCard 
        title="Avg Session" 
        value={kpis?.averageSessionDuration || "0m"} 
        icon={Layers} 
        colorClass="text-info" bgClass="bg-info/10" 
      />
    </div>
  );
}
