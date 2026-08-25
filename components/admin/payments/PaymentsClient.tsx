"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DollarSign,
  TrendingUp,
  FileText,
  Repeat,
  RotateCcw,
  Activity,
  Trash2,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { FinanceKPIGrid } from "./FinanceKPIGrid";
import { RevenueAnalyticsSection } from "./RevenueAnalyticsSection";
import { TransactionsTable } from "./TransactionsTable";
import { SubscriptionsTable } from "./SubscriptionsTable";
import { RefundsTable } from "./RefundsTable";
import { InvoicesTable } from "./InvoicesTable";
import { FinancialActivityLog } from "./FinancialActivityLog";

type FinanceTab =
  | "overview"
  | "transactions"
  | "subscriptions"
  | "refunds"
  | "invoices";

export function PaymentsClient() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview");
  const [isClearing, setIsClearing] = useState(false);

  const overview = useQuery(api.payments_admin.getFinanceOverview);
  const clearSamples = useMutation(api.payments_admin.clearSampleTransactions);

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear all payment transactions?")) return;
    try {
      setIsClearing(true);
      await clearSamples();
    } catch (err) {
      console.error("Clearing failed:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const isLoading = overview === undefined;

  const kpis = overview?.kpis || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    successfulCount: 0,
    successfulAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    refundsCount: 0,
    refundedAmount: 0,
    activeSubscriptionsCount: 0,
    subscriptionMRR: 0,
    failedCount: 0,
    failedAmount: 0,
    averageOrderValue: 0,
  };

  const tabs = [
    {
      id: "overview" as FinanceTab,
      label: "Financial Overview",
      icon: TrendingUp,
      count: undefined,
    },
    {
      id: "transactions" as FinanceTab,
      label: "All Transactions",
      icon: CreditCard,
      count: overview?.transactions?.length,
    },
    {
      id: "subscriptions" as FinanceTab,
      label: "Subscriptions (MRR)",
      icon: Repeat,
      count: overview?.activeSubscriptions?.length,
    },
    {
      id: "refunds" as FinanceTab,
      label: "Refunds & Disputes",
      icon: RotateCcw,
      count: overview?.refundRequests?.length,
    },
    {
      id: "invoices" as FinanceTab,
      label: "Invoices & Audit Log",
      icon: FileText,
      count: overview?.invoices?.length,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SaaS Financial Hub • GAAP Compliant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/15 text-success">
              Live Gateway Settlement
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
            Enterprise Payments & Billing Console
          </h1>
          <p className="text-sm text-text-secondary">
            Manage multi-gateway transactions, recurring SaaS subscriptions,
            dispute resolution, and tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleClear}
            disabled={isClearing}
            className="px-4 py-2.5 rounded-xl bg-surface border border-error/30 text-xs font-bold text-error hover:bg-error/10 hover:border-error flex items-center gap-2 transition-all shadow-sm"
            title="Clear all transactions (Sample Data)"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? "Clearing..." : "Clear Sample Data"}
          </button>
        </div>
      </div>

      {/* 8 Enterprise KPI Cards Bento Grid */}
      <FinanceKPIGrid kpis={kpis} isLoading={isLoading} />

      {/* Tab Navigation */}
      <div className="border-b border-border/80">
        <nav className="flex space-x-2 overflow-x-auto pb-px" aria-label="Tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {typeof t.count === "number" && t.count > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-border/60 text-text-secondary"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panel Content */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <RevenueAnalyticsSection
              revenueByMonth={overview?.revenueByMonth || []}
              gatewayDistribution={overview?.gatewayDistribution || []}
              courseRevenue={overview?.courseRevenue || []}
              totalRevenue={kpis.totalRevenue}
            />

            {/* Quick Preview of Recent Transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-text-primary">
                    Recent Settlement Activity
                  </h3>
                  <p className="text-xs text-text-muted">
                    Most recent payment transactions across all gateways
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View All Transactions <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <TransactionsTable
                initialTransactions={overview?.transactions || []}
              />
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <TransactionsTable
            initialTransactions={overview?.transactions || []}
          />
        )}

        {activeTab === "subscriptions" && (
          <SubscriptionsTable
            subscriptions={overview?.activeSubscriptions || []}
            upcomingRenewals={overview?.upcomingRenewals || []}
          />
        )}

        {activeTab === "refunds" && (
          <RefundsTable refunds={overview?.refundRequests || []} />
        )}

        {activeTab === "invoices" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <InvoicesTable invoices={overview?.invoices || []} />
            </div>
            <div>
              <FinancialActivityLog
                activityLog={overview?.activityLog || []}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
