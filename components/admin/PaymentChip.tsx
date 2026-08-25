import React from "react";
import { cn } from "@/lib/utils";

export function PaymentChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    successful: "bg-success/10 text-success border-success/20",
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    partial: "bg-warning/10 text-warning border-warning/20",
    unpaid: "bg-error/10 text-error border-error/20",
    failed: "bg-error/10 text-error border-error/20",
  };
  const cls = map[status?.toLowerCase()] ?? "bg-border text-text-secondary border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide",
        cls
      )}
    >
      {status || "Unknown"}
    </span>
  );
}
