import React from "react";
import { PaymentsClient } from "@/components/admin/payments/PaymentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Payments & Financial Console | VibeLogic Studio Admin",
  description:
    "Real-time SaaS financial hub, transaction registry, recurring subscription MRR, refunds, GAAP invoices, and audit logging for VibeLogic Studio.",
};

export default function AdminPaymentsPage() {
  return (
    <div className="w-full">
      <PaymentsClient />
    </div>
  );
}
