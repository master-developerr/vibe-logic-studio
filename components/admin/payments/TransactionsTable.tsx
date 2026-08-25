"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  TransactionDetailModal,
  TransactionItem,
} from "./TransactionDetailModal";

interface TransactionsTableProps {
  initialTransactions?: TransactionItem[];
}

export function TransactionsTable({
  initialTransactions = [],
}: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customer">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeModalItem, setActiveModalItem] =
    useState<TransactionItem | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const seedSamples = useMutation(api.payments_admin.seedSampleTransactions);

  // Fetch filtered from backend
  const filteredQuery = useQuery(api.payments_admin.listTransactions, {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    gateway: gatewayFilter !== "all" ? gatewayFilter : undefined,
    currency: currencyFilter !== "all" ? currencyFilter : undefined,
  });

  const transactions = filteredQuery ?? initialTransactions;

  // Sorting
  const sortedTransactions = useMemo(() => {
    const list = [...transactions];
    list.sort((a, b) => {
      let res = 0;
      if (sortBy === "date") {
        res = a.createdAt - b.createdAt;
      } else if (sortBy === "amount") {
        res = a.amount - b.amount;
      } else if (sortBy === "customer") {
        res = a.customerName.localeCompare(b.customerName);
      }
      return sortOrder === "asc" ? res : -res;
    });
    return list;
  }, [transactions, sortBy, sortOrder]);

  // Pagination
  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / pageSize)
  );
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage]);

  const toggleSort = (column: "date" | "amount" | "customer") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedRows.map((r) => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const rowsToExport =
      selectedIds.length > 0
        ? sortedTransactions.filter((r) => selectedIds.includes(r._id))
        : sortedTransactions;

    const headers = [
      "Invoice Number",
      "Gateway Order ID",
      "Customer Name",
      "Customer Email",
      "Course Title",
      "Amount",
      "Currency",
      "Gateway",
      "Status",
      "Date",
    ];

    const csvContent = [
      headers.join(","),
      ...rowsToExport.map((r) =>
        [
          `"${r.invoiceNumber}"`,
          `"${r.razorpayOrderId}"`,
          `"${r.customerName}"`,
          `"${r.customerEmail}"`,
          `"${r.courseTitle}"`,
          r.amount,
          `"${r.currency || "USD"}"`,
          `"${r.gateway || "Razorpay"}"`,
          `"${r.status}"`,
          `"${new Date(r.createdAt).toISOString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `VibeLogic_SaaS_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedSamples = async () => {
    try {
      setIsSeeding(true);
      await seedSamples();
    } catch (err) {
      console.error("Seeding error:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const formatCurrency = (val: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Top Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by customer, invoice, order ID, course..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-border/30 border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-border/30 border border-border text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Paid / Successful</option>
            <option value="pending">Pending Settlement</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed / Declined</option>
          </select>

          {/* Gateway filter */}
          <select
            value={gatewayFilter}
            onChange={(e) => {
              setGatewayFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-border/30 border border-border text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Gateways</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Stripe">Stripe</option>
            <option value="Paddle">Paddle</option>
            <option value="Wire">Wire Transfer</option>
          </select>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-border/30 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Download formatted CSV report"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            {selectedIds.length > 0
              ? `Export (${selectedIds.length})`
              : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-border/20 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedRows.length > 0 &&
                      paginatedRows.every((r) => selectedIds.includes(r._id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-0"
                  />
                </th>
                <th className="py-3.5 px-4">Invoice</th>
                <th
                  className="py-3.5 px-4 cursor-pointer select-none hover:text-text-primary transition-colors"
                  onClick={() => toggleSort("customer")}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Course / Plan</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th
                  className="py-3.5 px-4 text-right cursor-pointer select-none hover:text-text-primary transition-colors"
                  onClick={() => toggleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th
                  className="py-3.5 px-4 text-right cursor-pointer select-none hover:text-text-primary transition-colors"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 text-sm font-medium">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-border/40 mx-auto flex items-center justify-center text-text-muted">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-text-primary">
                        No Transactions Found
                      </h4>
                      <p className="text-xs text-text-muted">
                        We couldn&apos;t find any payments matching your search or
                        filter criteria.
                      </p>
                      <button
                        onClick={handleSeedSamples}
                        disabled={isSeeding}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 inline-flex items-center gap-2 transition-opacity"
                      >
                        <Database className="w-3.5 h-3.5" />
                        {isSeeding ? "Seeding..." : "Seed Sample SaaS Data"}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  const isChecked = selectedIds.includes(row._id);
                  const isSuccess = row.status === "successful";
                  const isRefunded =
                    row.status === "refunded" ||
                    row.refundStatus === "Approved";
                  const isFailed = row.status === "failed";

                  return (
                    <tr
                      key={row._id}
                      className={`hover:bg-border/20 transition-colors cursor-pointer ${
                        isChecked ? "bg-primary/5" : ""
                      }`}
                      onClick={() => setActiveModalItem(row)}
                    >
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(row._id)}
                          className="rounded border-border text-primary focus:ring-0"
                        />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-text-primary">
                        {row.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {row.customerName
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </div>
                          <div className="truncate max-w-[160px]">
                            <p className="text-sm font-bold text-text-primary truncate">
                              {row.customerName}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {row.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-[180px]">
                          <p className="text-xs font-bold text-text-primary truncate">
                            {row.courseTitle}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {row.subscriptionPlan || "One-Time Cohort"}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-semibold text-text-secondary">
                        <span className="px-2.5 py-1 rounded-lg bg-border/40 text-text-secondary">
                          {row.gateway || "Razorpay"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-text-primary">
                        {formatCurrency(row.amount, row.currency || "USD")}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isSuccess && !isRefunded
                              ? "bg-success/10 text-success border-success/30"
                              : isRefunded
                                ? "bg-info/10 text-info border-info/30"
                                : isFailed
                                  ? "bg-error/10 text-error border-error/30"
                                  : "bg-warning/10 text-warning border-warning/30"
                          }`}
                        >
                          {isSuccess && !isRefunded && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {isRefunded && <RotateCcw className="w-3 h-3" />}
                          {isFailed && <AlertCircle className="w-3 h-3" />}
                          {!isSuccess && !isRefunded && !isFailed && (
                            <Clock className="w-3 h-3" />
                          )}
                          {isRefunded
                            ? "Refunded"
                            : isSuccess
                              ? "Successful"
                              : isFailed
                                ? "Failed"
                                : "Pending"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right text-xs text-text-muted whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setActiveModalItem(row)}
                          className="p-1.5 rounded-lg hover:bg-border/40 text-text-secondary hover:text-primary transition-colors"
                          title="View complete transaction details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-text-muted">
          <div>
            Showing{" "}
            <span className="text-text-primary">
              {paginatedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="text-text-primary">
              {Math.min(currentPage * pageSize, sortedTransactions.length)}
            </span>{" "}
            of{" "}
            <span className="text-text-primary font-bold">
              {sortedTransactions.length}
            </span>{" "}
            transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-border/40 hover:bg-border/70 text-text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            <span className="px-3 py-1.5 rounded-xl bg-border/30 text-text-primary">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-border/40 hover:bg-border/70 text-text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}
