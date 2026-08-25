"use client";

import React from "react";
import {
  Activity,
  Users,
  FolderOpen,
  DollarSign,
  Settings,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { BatchActivityKPIs as KPIsType, ActivityCategory } from "./types";

interface BatchActivityKPIsProps {
  kpis: KPIsType;
  selectedCategory: ActivityCategory;
  onSelectCategory: (category: ActivityCategory) => void;
}

export default function BatchActivityKPIs({
  kpis,
  selectedCategory,
  onSelectCategory,
}: BatchActivityKPIsProps) {
  const cards = [
    {
      id: "All" as const,
      label: "TOTAL EVENTS",
      count: kpis.totalEvents,
      sub: `${kpis.todayEvents} recorded today`,
      icon: Activity,
      iconBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      activeBorder: "border-blue-500 bg-blue-500/5",
    },
    {
      id: "Students" as const,
      label: "STUDENTS",
      count: kpis.studentEvents,
      sub: "Enrollment & check-ins",
      icon: Users,
      iconBg: "bg-green-500/10 text-green-600 border-green-500/20",
      activeBorder: "border-green-500 bg-green-500/5",
    },
    {
      id: "Content" as const,
      label: "CONTENT",
      count: kpis.contentEvents,
      sub: "Materials & recordings",
      icon: FolderOpen,
      iconBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      activeBorder: "border-amber-500 bg-amber-500/5",
    },
    {
      id: "Payments" as const,
      label: "PAYMENTS",
      count: kpis.paymentEvents,
      sub: "Tuition & invoices",
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      activeBorder: "border-emerald-500 bg-emerald-500/5",
    },
    {
      id: "System" as const,
      label: "SYSTEM",
      count: kpis.systemEvents,
      sub: "Bots & automation",
      icon: Settings,
      iconBg: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
      activeBorder: "border-neutral-500 bg-neutral-500/5",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 5-Card Bento KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedCategory === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onSelectCategory(card.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-150 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                  : "border-border bg-surface hover:border-text-secondary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold tracking-wider text-text-muted uppercase">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-text-primary tracking-tight">
                  {card.count.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 font-medium truncate">
                {card.sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Secondary Time Horizon Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-6 text-xs text-text-secondary font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <strong className="text-text-primary">{kpis.todayEvents}</strong> today
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <strong className="text-text-primary">{kpis.weeklyEvents}</strong> this week
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>
            <strong className="text-text-primary">{kpis.monthlyEvents}</strong> this month
          </span>
        </div>

        {/* Quick Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Students", "Content", "Payments", "System"] as ActivityCategory[]).map(
            (cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "bg-background text-text-secondary hover:bg-border/60 hover:text-text-primary"
                  }`}
                >
                  {cat === "All" ? "All Activity" : cat}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
