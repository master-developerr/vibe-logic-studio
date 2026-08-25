"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface TransactionItem {
  _id: string;
  razorpayOrderId: string;
  amount: number;
  status: string;
  createdAt: number;
  currency: string;
  gateway: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  invoiceNumber: string;
  taxAmount: number;
  couponCode?: string;
  discountAmount?: number;
  netAmount?: number;
  subscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  renewalDate?: number;
  refundStatus?: string;
  refundAmount?: number;
  refundReason?: string;
  errorCode?: string;
  errorMessage?: string;
}

interface TransactionDetailModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
}

export function TransactionDetailModal({
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState("Accidental Duplicate Order");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approveRefund = useMutation(api.payments_admin.approveRefund);
  const retryPayment = useMutation(api.payments_admin.retryFailedPayment);

  if (!transaction) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: transaction.currency || "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(transaction.razorpayOrderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleIssueRefund = async () => {
    try {
      setIsSubmitting(true);
      await approveRefund({
        paymentId: transaction._id as any,
        refundAmount: transaction.amount,
      });
      setIsRefunding(false);
      onClose();
    } catch (err) {
      console.error("Refund failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryPayment = async () => {
    try {
      setIsSubmitting(true);
      await retryPayment({
        paymentId: transaction._id as any,
      });
      onClose();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess = transaction.status === "successful";
  const isRefunded =
    transaction.status === "refunded" ||
    transaction.refundStatus === "Approved";
  const isFailed = transaction.status === "failed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                  Invoice {transaction.invoiceNumber}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isSuccess && !isRefunded
                      ? "bg-success/15 text-success border-success/30"
                      : isRefunded
                        ? "bg-info/15 text-info border-info/30"
                        : isFailed
                          ? "bg-error/15 text-error border-error/30"
                          : "bg-warning/15 text-warning border-warning/30"
                  }`}
                >
                  {isRefunded
                    ? "Refunded"
                    : isSuccess
                      ? "Paid"
                      : isFailed
                        ? "Failed"
                        : "Pending"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Recorded on{" "}
                {new Date(transaction.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-border/40 hover:bg-border flex items-center justify-center text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top customer card */}
          <div className="p-4 rounded-2xl bg-border/20 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {transaction.customerName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">
                  {transaction.customerName}
                </p>
                <p className="text-xs text-text-muted">
                  {transaction.customerEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                {transaction.gateway} • {transaction.paymentMethod}
              </span>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-border/20 border border-border/50">
              <span className="block text-xs font-semibold text-text-muted">
                Gateway Order ID
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-text-primary truncate">
                  {transaction.razorpayOrderId}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="text-text-muted hover:text-primary transition-colors"
                  title="Copy Order ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-border/20 border border-border/50">
              <span className="block text-xs font-semibold text-text-muted">
                Plan / Enrollment
              </span>
              <span className="mt-1 block text-xs font-bold text-text-primary">
                {transaction.subscriptionPlan || "One-Time Cohort"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-border/20 border border-border/50">
              <span className="block text-xs font-semibold text-text-muted">
                Course Title
              </span>
              <span className="mt-1 block text-xs font-bold text-text-primary truncate">
                {transaction.courseTitle}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <h4 className="text-sm font-bold text-text-primary pb-2 border-b border-border/60">
              Financial Accounting Breakdown
            </h4>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Gross Amount</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.couponCode && (
              <div className="flex items-center justify-between text-sm text-success">
                <span>Coupon Applied ({transaction.couponCode})</span>
                <span className="font-semibold">
                  - {formatCurrency(transaction.discountAmount || 0)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                Tax Amount (GST / VAT)
              </span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(transaction.taxAmount)}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-base font-extrabold text-text-primary">
              <span>Net Settled Amount</span>
              <span className="text-primary">
                {formatCurrency(
                  transaction.netAmount ??
                    Math.max(0, transaction.amount - transaction.taxAmount)
                )}
              </span>
            </div>

            {isRefunded && (
              <div className="pt-2 flex items-center justify-between text-sm text-info font-bold">
                <span>Refund Approved ({transaction.refundReason})</span>
                <span>- {formatCurrency(transaction.refundAmount || transaction.amount)}</span>
              </div>
            )}

            {isFailed && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-xs text-error flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {transaction.errorCode || "ERR_GATEWAY_DECLINE"}
                  </p>
                  <p>{transaction.errorMessage || "Transaction declined by customer bank."}</p>
                </div>
              </div>
            )}
          </div>

          {/* Refund Input Area (when toggled) */}
          {isRefunding && (
            <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30 space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold text-text-primary">
                Confirm Refund for {transaction.customerName}
              </h4>
              <p className="text-xs text-text-secondary">
                This will reverse the payment of{" "}
                {formatCurrency(transaction.amount)} and mark the invoice as
                refunded in your financial registry.
              </p>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Refund Reason
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="Accidental Duplicate Order">
                    Accidental Duplicate Order
                  </option>
                  <option value="Course mismatch / Customer request">
                    Course mismatch / Customer request
                  </option>
                  <option value="Technical enrollment error">
                    Technical enrollment error
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsRefunding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-text-secondary hover:bg-border/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssueRefund}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Full Refund"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border bg-border/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-border/30 flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-primary" />
            Print Receipt / PDF
          </button>

          <div className="flex items-center gap-2">
            {isFailed && (
              <button
                onClick={handleRetryPayment}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 flex items-center gap-2 transition-opacity disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isSubmitting ? "Retrying..." : "Retry Transaction"}
              </button>
            )}

            {isSuccess && !isRefunded && !isRefunding && (
              <button
                onClick={() => setIsRefunding(true)}
                className="px-4 py-2 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-bold hover:bg-error/20 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Issue Refund
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-border/40 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
