"use client";

import React from "react";
import { FileText, Download, CheckCircle2, Printer } from "lucide-react";

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  amount: number;
  taxAmount: number;
  netAmount: number;
  createdAt: number;
  status: string;
}

interface InvoicesTableProps {
  invoices: InvoiceItem[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Tax-Compliant Invoices & Receipts
            </h3>
            <p className="text-xs text-text-muted">
              Auto-generated GAAP-ready invoice accounting logs
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintAll}
          className="px-3.5 py-1.5 rounded-xl bg-border/40 hover:bg-border/70 text-xs font-bold text-text-primary flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-primary" />
          Print / Export Report
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          No paid invoices recorded in the ledger yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-border/20 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Course Title</th>
                <th className="py-3.5 px-4 text-right">Gross</th>
                <th className="py-3.5 px-4 text-right">Tax (18% GST/VAT)</th>
                <th className="py-3.5 px-4 text-right">Net Settled</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Issued Date</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm font-medium">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-border/20 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-text-primary">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-text-primary">
                        {inv.customerName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {inv.customerEmail}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-bold text-text-primary max-w-[180px] truncate">
                    {inv.courseTitle}
                  </td>

                  <td className="py-3.5 px-4 text-right text-text-secondary">
                    {formatCurrency(inv.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-right text-text-muted">
                    {formatCurrency(inv.taxAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-primary">
                    {formatCurrency(inv.netAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right text-xs text-text-muted">
                    {new Date(inv.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg hover:bg-border/40 text-text-secondary hover:text-primary transition-colors"
                      title="Download PDF Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
