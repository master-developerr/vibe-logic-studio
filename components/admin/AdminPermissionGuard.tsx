"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { hasPermission, GranularPermission } from "@/lib/permissions";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminPermissionGuardProps {
  permission: GranularPermission;
  children: React.ReactNode;
}

export function AdminPermissionGuard({ permission, children }: AdminPermissionGuardProps) {
  const { user } = useUser();
  const dbUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (dbUser === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dbUser || !hasPermission(dbUser, permission)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-surface border border-border rounded-2xl p-8">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Access Restricted</h2>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed">
          You do not have the required permission standard (<code className="bg-background px-1.5 py-0.5 rounded text-xs text-primary font-mono">{permission}</code>) to access this administrative section.
        </p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary/90 transition-all mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
