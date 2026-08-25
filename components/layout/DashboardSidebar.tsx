"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Award,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/certificates", label: "Certificates", icon: Award },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-border bg-surface flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">VibeLogic</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-background"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex items-center gap-3 px-5">
        <UserButton />
        <span className="text-sm font-semibold text-text-primary">Account</span>
      </div>
    </div>
  );
}
