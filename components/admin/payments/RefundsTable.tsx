"use client";

import React from "react";
import { RotateCcw, Check, X, ShieldAlert } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RefundRequestItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  amount: number;
  refundAmount: number;
  reason: string;
  status: string;
  createdAt: number;
}

interface RefundsTableProps {
  refunds: RefundRequestItem[];
}

export function RefundsTable({ refunds }: RefundsTableProps) {
  const approveRefund = useMutation(api.payments_admin.approveRefund);
  const rejectRefund = useMutation(api.payments_admin.rejectRefund);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApprove = async (paymentId: string, amount: number) => {
    try {
      await approveRefund({
        paymentId: paymentId as any,
        refundAmount: amount,
      });
    } catch (err) {
      console.error("Approve refund error:", err);
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      await rejectRefund({
        paymentId: paymentId as any,
        reason: "Admin review rejected",
      });
    } catch (err) {
      console.error("Reject refund error:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-text-primary">
            Refunds & Dispute Resolution
          </h3>
        </div>
        <span className="text-xs font-semibold text-text-muted">
          {refunds.length} Refund Log(s)
        </span>
      </div>

      {refunds.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          No refund requests or dispute claims logged.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-border/20 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Order / Course</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4 text-right">Refund Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm font-medium">
              {refunds.map((item) => (
                <tr key={item.id} className="hover:bg-border/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-text-primary">
                        {item.customerName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {item.customerEmail}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        {item.courseTitle}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted">
                        {item.orderId}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-text-secondary max-w-[200px] truncate">
                    {item.reason}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-text-primary">
                    {formatCurrency(item.refundAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        item.status === "Approved"
                          ? "bg-success/10 text-success border-success/30"
                          : item.status === "Rejected"
                            ? "bg-error/10 text-error border-error/30"
                            : "bg-warning/10 text-warning border-warning/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right text-xs text-text-muted">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {item.status === "Requested" ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleApprove(item.id, item.refundAmount)}
                          className="px-2.5 py-1 rounded-lg bg-success/15 text-success hover:bg-success/25 text-xs font-bold transition-colors"
                          title="Approve Refund"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-error/15 text-error hover:bg-error/25 text-xs font-bold transition-colors"
                          title="Reject Claim"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
