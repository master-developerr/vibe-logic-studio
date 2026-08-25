"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, Sun, Moon } from "lucide-react";
import { QuickCreateModal } from "./QuickCreateModal";

/* ─────────────────────────────────────────
   Breadcrumb helper
───────────────────────────────────────── */
function useBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [];
  let accum = "";
  parts.forEach((part) => {
    accum += `/${part}`;
    // Humanize segment — detect Convex IDs (long alphanumeric strings)
    const isId = part.length >= 20 && /^[a-z0-9]+$/.test(part);
    const label = isId
      ? "Workspace"
      : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    crumbs.push({ label, href: accum });
  });
  return crumbs;
}

/* ─────────────────────────────────────────
   Dark mode hook — reads/writes localStorage
   and applies the class to <html>
───────────────────────────────────────── */
function useDarkMode() {
  const [dark, setDark] = useState(false);

  // Initialise from localStorage on mount (client-only)
  useEffect(() => {
    const stored = localStorage.getItem("admin-dark-mode");
    const isDark = stored === "true";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("admin-dark-mode", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return { dark, toggle };
}

/* ─────────────────────────────────────────
   AdminTopNav
───────────────────────────────────────── */
export function AdminTopNav() {
  const [quickCreate, setQuickCreate] = useState(false);
  const { dark, toggle: toggleDark } = useDarkMode();
  const crumbs = useBreadcrumbs();

  return (
    <>
      <QuickCreateModal open={quickCreate} onOpenChange={setQuickCreate} />

      <header className="h-14 border-b border-border bg-surface flex items-center px-6 gap-4 shrink-0">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[13px] text-text-muted flex-1 min-w-0">
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <span className="text-border select-none">/</span>}
              <span
                className={
                  idx === crumbs.length - 1
                    ? "text-text-primary font-semibold truncate"
                    : "hover:text-text-primary transition-colors truncate"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Global Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-8 w-52 pl-8 pr-3 rounded-lg border border-border bg-background text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all focus:w-72"
          />
        </div>

        {/* Quick Create */}
        <button
          onClick={() => setQuickCreate(true)}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-white text-[13px] font-semibold shadow-sm hover:bg-[#e04a17] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Create</span>
        </button>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>
    </>
  );
}
