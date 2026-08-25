"use client";

import React, { useState } from "react";
import { AnalyticsGlobalFilters } from "./AnalyticsGlobalFilters";
import { AnalyticsKPIGrid } from "./AnalyticsKPIGrid";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { SmartInsights } from "./SmartInsights";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState("30d");

  // Fetch the massive dashboard aggregation payload
  const dashboardData = useQuery(api.analytics_admin.getDashboardMetrics, { timeRange });
  const isLoading = dashboardData === undefined;

  const handleExport = () => {
    // Basic CSV mock generation for now
    alert("In a full production environment, this would convert the visible analytics payload to a CSV string and trigger a browser download.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <AnalyticsGlobalFilters 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        onExport={handleExport} 
      />

      <AnalyticsKPIGrid 
        kpis={dashboardData?.kpis as any} 
        isLoading={isLoading} 
      />

      <AnalyticsCharts 
        chartData={dashboardData?.chartData as any} 
        deviceDistribution={dashboardData?.deviceDistribution as any}
        geoDistribution={dashboardData?.geoDistribution as any}
        isLoading={isLoading} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <SmartInsights 
            insights={dashboardData?.insights as any}
            leaderboards={dashboardData?.leaderboards as any}
            isLoading={isLoading}
          />
        </div>
        <div className="xl:col-span-1">
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
}
