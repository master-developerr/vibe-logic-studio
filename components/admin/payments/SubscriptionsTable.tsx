"use client";

import React from "react";
import { Repeat, Calendar, CheckCircle2, PauseCircle } from "lucide-react";

interface SubscriptionItem {
  id: string;
  customerName: string;
  customerEmail: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  renewalDate: number;
}

interface SubscriptionsTableProps {
  subscriptions: SubscriptionItem[];
  upcomingRenewals: SubscriptionItem[];
}

export function SubscriptionsTable({
  subscriptions,
  upcomingRenewals,
}: SubscriptionsTableProps) {
  const formatCurrency = (val: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Upcoming 30-day Renewals */}
      {upcomingRenewals.length > 0 && (
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                {upcomingRenewals.length} Subscription Renewal(s) Upcoming
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Expected recurring billing flow over the next 30 days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {upcomingRenewals.map((r) => (
              <div
                key={r.id}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold shrink-0"
              >
                <span className="text-text-primary">{r.customerName}</span> •{" "}
                <span className="text-primary">{formatCurrency(r.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Subscriptions Table */}
      <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-text-primary">
              Recurring Subscriptions & Memberships
            </h3>
          </div>
          <span className="text-xs font-semibold text-text-muted">
            {subscriptions.length} Total Subscriber(s)
          </span>
        </div>

        {subscriptions.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-muted">
            No recurring subscription memberships active yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-border/20 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4 text-right">MRR Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Next Billing / Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm font-medium">
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-border/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-text-primary">
                          {sub.customerName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {sub.customerEmail}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-border/40 text-text-primary">
                        {sub.plan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-text-primary">
                      {formatCurrency(sub.amount, sub.currency || "USD")}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs text-text-muted">
                      {new Date(sub.renewalDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
