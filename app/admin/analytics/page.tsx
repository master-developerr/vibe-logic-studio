import React from "react";
import { AnalyticsClient } from "@/components/admin/analytics/AnalyticsClient";
import { AdminPermissionGuard } from "@/components/admin/AdminPermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | VibeLogic Admin",
  description: "Comprehensive platform analytics and telemetry.",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 md:p-8 min-h-screen">
      <AdminPermissionGuard permission="settings:write">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Platform Analytics
          </h1>
          <p className="text-sm md:text-base text-text-secondary mt-1">
            Monitor revenue, track student engagement, and measure course performance.
          </p>
        </div>

        <AnalyticsClient />
      </AdminPermissionGuard>
    </div>
  );
}
