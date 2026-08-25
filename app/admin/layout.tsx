import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

/**
 * AdminLayout — root layout for every /admin/* route.
 *
 * Architecture:
 *   ┌─────────────────────────────────────┐
 *   │  AdminSidebar (200px fixed)         │
 *   │  + AdminTopNav (14-height bar)      │
 *   │  + Content Area (scrollable)        │
 *   └─────────────────────────────────────┘
 *
 * Only {children} changes per route.
 * Sidebar, TopNav, Search, QuickCreate, Notifications,
 * and Profile area are all inherited from this layout.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ── Auth + role guard ─────────────────────────────── */
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = (await getToken({ template: "convex" })) ?? undefined;
  const user = await fetchQuery(
    api.users.getUserByClerkId,
    { clerkId: userId },
    { token }
  );
  if (!user || user.role !== "admin") redirect("/dashboard");

  /* ── Shell ─────────────────────────────────────────── */
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar — persistent across all admin pages */}
      <AdminSidebar />

      {/* Right Panel: Top Nav + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navigation Bar — persistent breadcrumb, search, quick create, notifications */}
        <AdminTopNav />

        {/* Page Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/*
            Global page container:
            - consistent horizontal padding
            - consistent vertical padding
            - max-width constraint
            Every page only renders its own content inside this wrapper.
          */}
          <div className="mx-auto max-w-[1280px] px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
