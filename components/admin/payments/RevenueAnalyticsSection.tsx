"use client";

import React, { useState } from "react";
import { TrendingUp, PieChart, Award, ArrowUpRight } from "lucide-react";

interface RevenueMonth {
  month: string;
  gross: number;
  net: number;
  refunds: number;
}

interface GatewayStat {
  name: string;
  count: number;
  amount: number;
  percentage: number;
}

interface CourseRevenue {
  courseId: string;
  title: string;
  category: string;
  enrollmentsCount: number;
  revenue: number;
}

interface RevenueAnalyticsProps {
  revenueByMonth: RevenueMonth[];
  gatewayDistribution: GatewayStat[];
  courseRevenue: CourseRevenue[];
  totalRevenue: number;
}

export function RevenueAnalyticsSection({
  revenueByMonth,
  gatewayDistribution,
  courseRevenue,
  totalRevenue,
}: RevenueAnalyticsProps) {
  const [activeMetric, setActiveMetric] = useState<"gross" | "net">("gross");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Compute SVG coordinates for the 6-month chart
  const maxVal = Math.max(
    ...revenueByMonth.map((m) => Math.max(m.gross, m.net, 100)),
    100
  );
  const chartHeight = 220;
  const chartWidth = 600;
  const stepX = chartWidth / Math.max(1, revenueByMonth.length - 1);

  const getPoints = (key: "gross" | "net") => {
    return revenueByMonth
      .map((m, idx) => {
        const x = idx * stepX;
        const y = chartHeight - (m[key] / maxVal) * (chartHeight - 40) - 20;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const grossPoints = getPoints("gross");
  const netPoints = getPoints("net");

  return (
    <div className="space-y-6">
      {/* Top row: 2-column layout (Chart left, Gateway right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-text-primary">
                  Revenue Trajectory (Last 6 Months)
                </h3>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Comparing Gross recognized billing vs. Net realized revenue
              </p>
            </div>

            {/* Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-border/40 border border-border text-xs font-semibold">
              <button
                onClick={() => setActiveMetric("gross")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMetric === "gross"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Gross Revenue
              </button>
              <button
                onClick={() => setActiveMetric("net")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMetric === "net"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Net Revenue
              </button>
            </div>
          </div>

          {/* SVG Line / Area Chart */}
          <div className="mt-6">
            <div className="relative h-[240px] w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
              >
                {/* Horizontal grid lines */}
                {[0.2, 0.5, 0.8].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-border/60"
                  />
                ))}

                {/* Area under curve */}
                <polygon
                  points={`0,${chartHeight} ${activeMetric === "gross" ? grossPoints : netPoints} ${chartWidth},${chartHeight}`}
                  className="fill-primary/10 transition-all duration-500"
                />

                {/* Main line */}
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary transition-all duration-500"
                  points={activeMetric === "gross" ? grossPoints : netPoints}
                />

                {/* Hover dots & labels */}
                {revenueByMonth.map((m, idx) => {
                  const x = idx * stepX;
                  const val = m[activeMetric];
                  const y =
                    chartHeight - (val / maxVal) * (chartHeight - 40) - 20;

                  return (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className="fill-surface stroke-primary stroke-2 group-hover:r-7 transition-all"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-text-primary opacity-80 group-hover:opacity-100 transition-opacity"
                      >
                        {formatCurrency(val)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs font-semibold text-text-muted">
              {revenueByMonth.map((m, idx) => (
                <span key={idx}>{m.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Gateway Market Share Breakdown (1 Col) */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-border/60 pb-5">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">
                Payment Gateways
              </h3>
            </div>

            <div className="mt-6 space-y-5">
              {gatewayDistribution.map((g, idx) => {
                const colorClass =
                  idx === 0
                    ? "bg-primary"
                    : idx === 1
                      ? "bg-info"
                      : idx === 2
                        ? "bg-success"
                        : "bg-warning";

                return (
                  <div key={g.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-text-primary">{g.name}</span>
                      <span className="text-text-secondary">
                        {g.percentage}%{" "}
                        <span className="text-xs font-normal text-text-muted">
                          ({formatCurrency(g.amount)})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClass} transition-all duration-700`}
                        style={{ width: `${g.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-medium text-text-muted">
            <span>Multi-currency routing active</span>
            <span className="inline-flex items-center gap-1 text-primary font-semibold">
              Real-time balance <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Course Revenue Attribution Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-text-primary">
              Revenue Attribution by Course
            </h3>
          </div>
          <span className="text-xs font-semibold text-text-muted">
            Top Performing Cohorts
          </span>
        </div>

        {courseRevenue.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-muted">
            No course revenue attribution data available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Enrollments</th>
                  <th className="py-3 px-4 text-right">Recognized Revenue</th>
                  <th className="py-3 px-4 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm font-medium">
                {courseRevenue.map((item) => {
                  const share =
                    totalRevenue > 0
                      ? Math.round((item.revenue / totalRevenue) * 100)
                      : 0;
                  return (
                    <tr
                      key={item.courseId}
                      className="hover:bg-border/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-text-primary">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-border/40 text-text-secondary">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-text-primary">
                        {item.enrollmentsCount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-text-primary">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-text-muted">
                        <span className="font-semibold text-primary">
                          {share}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
