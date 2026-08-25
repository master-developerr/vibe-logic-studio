"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  CreditCard,
  Star,
  Globe,
  ImageIcon,
  Megaphone,
  BarChart3,
  LogOut,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

/* ─────────────────────────────────────────
   Navigation map — grouped by section
───────────────────────────────────────── */
const navGroups = [
  {
    label: "MAIN",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/courses",   label: "Courses",   icon: BookOpen },
      { href: "/admin/batches",   label: "Batches",   icon: Layers },
      { href: "/admin/students",  label: "Students",  icon: Users },
    ],
  },
  {
    label: "FINANCIALS",
    items: [
      { href: "/admin/payments",  label: "Payments",  icon: CreditCard },
      { href: "/admin/reviews",   label: "Reviews",   icon: Star },
    ],
  },
  {
    label: "MARKETING",
    items: [
      { href: "/admin/announcements", label: "Announcements",    icon: Megaphone },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-[200px] min-w-[200px] h-screen border-r border-border bg-surface flex flex-col overflow-hidden">
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2.5 px-5 py-5 border-b border-border shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
            <path d="M8 2L2 14h12L8 2z" fill="currentColor" />
          </svg>
        </div>
        <div className="leading-none">
          <span className="block text-[13px] font-bold text-text-primary tracking-tight">
            VibeLogic
          </span>
          <span className="block text-[10px] font-semibold text-text-muted mt-0.5 uppercase tracking-widest">
            Admin
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href || pathname === "/admin"
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-background"
                    }`}
                  >
                    <Icon
                      className="w-4 h-4 shrink-0"
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="px-3 py-4 border-t border-border shrink-0 flex items-center gap-2.5">
        <UserButton />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-text-primary truncate">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Admin"}
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors mt-0.5"
          >
            <LogOut className="w-3 h-3" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
