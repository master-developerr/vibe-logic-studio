"use client";

import React from "react";
import { Monitor, Smartphone, Tablet, Globe, MapPin, TrendingUp, Users } from "lucide-react";

interface AnalyticsChartsProps {
  chartData: {
    labels: string[];
    revenue: number[];
    enrollments: number[];
  };
  deviceDistribution: Array<{ name: string; percentage: number }>;
  geoDistribution: Array<{ name: string; percentage: number }>;
  isLoading: boolean;
}

export function AnalyticsCharts({ chartData, deviceDistribution, geoDistribution, isLoading }: AnalyticsChartsProps) {
  if (isLoading) {
    return <div className="h-96 bg-surface animate-pulse rounded-2xl border border-border shadow-sm mb-6" />;
  }

  const maxRevenue = Math.max(...(chartData?.revenue || [1]));
  const maxEnrollments = Math.max(...(chartData?.enrollments || [1]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Main Trend Chart (Spans 2 columns) */}
      <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-text-primary">Revenue & Growth Trend</h3>
            <p className="text-xs text-text-muted mt-1">Monthly recurring revenue vs new enrollments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-semibold text-text-secondary">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs font-semibold text-text-secondary">Enrollments</span>
            </div>
          </div>
        </div>

        {/* CSS Chart Representation */}
        <div className="flex-1 relative h-64 flex items-end justify-between gap-2 md:gap-4 mt-auto">
          {chartData?.labels.map((label, idx) => {
            const revHeight = `${(chartData.revenue[idx] / maxRevenue) * 100}%`;
            const enrHeight = `${(chartData.enrollments[idx] / maxEnrollments) * 100}%`;
            
            return (
              <div key={label} className="flex-1 h-full flex flex-col justify-end gap-2 group relative">
                <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2">
                  <div 
                    className="w-1/2 bg-primary/80 hover:bg-primary transition-all duration-500 rounded-t-sm"
                    style={{ height: revHeight }}
                  />
                  <div 
                    className="w-1/2 bg-success/80 hover:bg-success transition-all duration-500 rounded-t-sm"
                    style={{ height: enrHeight }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-muted text-center block mt-2">{label}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border shadow-lg rounded-lg p-2 text-xs w-max z-10 pointer-events-none">
                  <div className="font-bold text-text-primary mb-1">{label}</div>
                  <div className="text-primary">${chartData.revenue[idx].toLocaleString()} Revenue</div>
                  <div className="text-success">{chartData.enrollments[idx]} Enrollments</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Column: Distributions */}
      <div className="space-y-6 flex flex-col">
        {/* Device Distribution */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Device Usage</h3>
            <Monitor className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-4">
            {deviceDistribution?.map((dist) => {
              const Icon = dist.name === "Desktop" ? Monitor : dist.name === "Mobile" ? Smartphone : Tablet;
              return (
                <div key={dist.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-xs font-semibold text-text-primary">{dist.name}</span>
                    </div>
                    <span className="text-xs font-bold text-text-secondary">{dist.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${dist.percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Geographic Split</h3>
            <Globe className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-3">
            {geoDistribution?.map((dist) => (
              <div key={dist.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs font-medium text-text-primary">{dist.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-info" style={{ width: `${dist.percentage}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary w-6 text-right">{dist.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
