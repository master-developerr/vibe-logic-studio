"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  BarChart2,
  Repeat,
  Clock,
  RotateCcw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export interface FinanceKPIs {
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  successfulCount: number;
  successfulAmount: number;
  pendingCount: number;
  pendingAmount: number;
  refundsCount: number;
  refundedAmount: number;
  activeSubscriptionsCount: number;
  subscriptionMRR: number;
  failedCount: number;
  failedAmount: number;
  averageOrderValue: number;
}

interface FinanceKPIGridProps {
  kpis: FinanceKPIs;
  isLoading?: boolean;
}

export function FinanceKPIGrid({ kpis, isLoading = false }: FinanceKPIGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface border border-border shadow-sm animate-pulse space-y-3"
          >
            <div className="h-4 w-24 bg-border/40 rounded" />
            <div className="h-7 w-32 bg-border/60 rounded" />
            <div className="h-3 w-20 bg-border/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(kpis.totalRevenue),
      subtitle: `Net after refunds: ${formatCurrency(Math.max(0, kpis.totalRevenue - kpis.refundedAmount))}`,
      icon: DollarSign,
      badgeText: "+14.2% MoM",
      badgeType: "success" as const,
      sparklinePoints: "5,25 15,18 25,20 35,12 45,15 55,5 65,8",
    },
    {
      title: "Monthly Revenue (MRR)",
      value: formatCurrency(kpis.monthlyRevenue),
      subtitle: `Recurring MRR: ${formatCurrency(kpis.subscriptionMRR)}`,
      icon: TrendingUp,
      badgeText: "Recurring",
      badgeType: "info" as const,
      sparklinePoints: "5,28 15,22 25,24 35,16 45,10 55,12 65,4",
    },
    {
      title: "Successful Transactions",
      value: kpis.successfulCount.toLocaleString(),
      subtitle: `Volume: ${formatCurrency(kpis.successfulAmount)}`,
      icon: CheckCircle2,
      badgeText: "98.4% Success",
      badgeType: "success" as const,
      sparklinePoints: "5,20 15,22 25,15 35,18 45,10 55,12 65,6",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(kpis.averageOrderValue),
      subtitle: "Per cohort enrollment",
      icon: BarChart2,
      badgeText: "High Value",
      badgeType: "primary" as const,
      sparklinePoints: "5,22 15,20 25,18 35,14 45,16 55,9 65,7",
    },
    {
      title: "Active Subscriptions",
      value: kpis.activeSubscriptionsCount.toLocaleString(),
      subtitle: "Recurring plan members",
      icon: Repeat,
      badgeText: "+8 This Week",
      badgeType: "success" as const,
      sparklinePoints: "5,26 15,24 25,20 35,18 45,12 55,10 65,5",
    },
    {
      title: "Pending Settlements",
      value: kpis.pendingCount.toLocaleString(),
      subtitle: `Awaiting: ${formatCurrency(kpis.pendingAmount)}`,
      icon: Clock,
      badgeText: "In Transit",
      badgeType: "warning" as const,
      sparklinePoints: "5,24 15,22 25,19 35,15 45,16 55,10 65,8",
    },
    {
      title: "Refunds & Disputes",
      value: formatCurrency(kpis.refundedAmount),
      subtitle: `${kpis.refundsCount} refund(s) approved`,
      icon: RotateCcw,
      badgeText: "< 1.0% Rate",
      badgeType: "success" as const,
      sparklinePoints: "5,28 15,27 25,26 35,26 45,25 55,24 65,23",
    },
    {
      title: "Failed Transactions",
      value: kpis.failedCount.toLocaleString(),
      subtitle: `Recoverable: ${formatCurrency(kpis.failedAmount)}`,
      icon: AlertCircle,
      badgeText: "Actionable",
      badgeType: kpis.failedCount > 0 ? ("error" as const) : ("success" as const),
      sparklinePoints: "5,25 15,25 25,23 35,22 45,24 55,21 65,20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive =
          card.badgeType === "success" ||
          card.badgeType === "primary" ||
          card.badgeType === "info";

        let badgeStyle =
          "bg-border/50 text-text-secondary border-border/80";
        if (card.badgeType === "success") {
          badgeStyle = "bg-success/10 text-success border-success/30";
        } else if (card.badgeType === "warning") {
          badgeStyle = "bg-warning/15 text-warning border-warning/30";
        } else if (card.badgeType === "error") {
          badgeStyle = "bg-error/15 text-error border-error/30";
        } else if (card.badgeType === "primary") {
          badgeStyle = "bg-primary/10 text-primary border-primary/30";
        }

        return (
          <div
            key={idx}
            className="group relative p-5 rounded-2xl bg-surface border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top row: title & badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-text-secondary tracking-tight">
                {card.title}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {card.badgeText}
              </span>
            </div>

            {/* Middle row: metric value & icon */}
            <div className="mt-3 flex items-baseline justify-between">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
                {card.value}
              </h3>
              <div className="w-9 h-9 rounded-xl bg-border/40 flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom row: subtitle & mini SVG sparkline */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-text-muted">
              <span className="truncate pr-2 font-medium">{card.subtitle}</span>
              <svg
                width="70"
                height="30"
                viewBox="0 0 70 30"
                fill="none"
                className="opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    card.badgeType === "error"
                      ? "text-error"
                      : card.badgeType === "warning"
                        ? "text-warning"
                        : "text-primary"
                  }
                  points={card.sparklinePoints}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
