import React from "react";
import { DrawerStudentRow } from "./types";
import { PaymentChip } from "@/components/admin/PaymentChip";
import { Download, FileText, CreditCard } from "lucide-react";

export function PaymentsTab({ student }: { student: DrawerStudentRow }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-border/60 p-5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-2">Account Status</span>
          <PaymentChip status={student.paymentStatus} />
        </div>
        <div className="bg-surface rounded-xl border border-border/60 p-5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Total Paid</span>
          <span className="text-[24px] font-black text-text-primary tracking-tight">
            {student.paymentStatus.toLowerCase() === "paid" || student.paymentStatus.toLowerCase() === "successful" ? "Paid" : "—"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight px-1">Payment History</h3>
        <div className="bg-surface rounded-xl border border-border/60 divide-y divide-border/40">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[13px] text-text-muted text-center italic">Detailed payment history will be available soon.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
