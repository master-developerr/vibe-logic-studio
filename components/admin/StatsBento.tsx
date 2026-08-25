"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Users, BookOpen, IndianRupee } from "lucide-react";

interface StatsBentoProps {
  totalRevenue: number;
  activeStudents: number;
  activeCourses: number;
}

export function StatsBento({ totalRevenue, activeStudents, activeCourses }: StatsBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Premium stagger reveal on mount
    gsap.fromTo(
      ".bento-card",
      { opacity: 0, y: 24, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power4.out"
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense mb-10"
    >
      <div className="bento-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-text-secondary" />
            </div>
            <span className="text-sm font-medium text-text-secondary">Total Revenue</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold tracking-tight text-text-primary">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-sm text-text-muted mt-1">+12% from last month</p>
          </div>
        </div>
      </div>

      <div className="bento-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-success/10 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-text-secondary" />
            </div>
            <span className="text-sm font-medium text-text-secondary">Active Students</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold tracking-tight text-text-primary">
              {activeStudents.toLocaleString()}
            </h3>
            <p className="text-sm text-text-muted mt-1">+8 new this week</p>
          </div>
        </div>
      </div>

      <div className="bento-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-info/10 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-text-secondary" />
            </div>
            <span className="text-sm font-medium text-text-secondary">Active Courses</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold tracking-tight text-text-primary">
              {activeCourses}
            </h3>
            <p className="text-sm text-text-muted mt-1">All courses running smoothly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
