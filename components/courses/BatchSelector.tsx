"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useAuth } from "@clerk/nextjs";
import { getRemainingSeats, type CourseBatch } from "@/lib/course-data";

type BatchSelectorProps = {
  batches: CourseBatch[];
  price: number;
  courseSlug: string;
};

export function BatchSelector({ batches, price, courseSlug }: BatchSelectorProps) {
  const { isSignedIn } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id ?? "");
  const selectedBatch = useMemo(() => batches.find((batch) => batch.id === selectedBatchId), [batches, selectedBatchId]);
  const isFull = !selectedBatch || getRemainingSeats(selectedBatch) === 0;

  return (
    <aside className="space-y-6 p-2 rounded-[2rem] ring-1 ring-border bg-surface/40 shadow-sm lg:sticky lg:top-8 transition-shadow duration-500 hover:shadow-md">
      <div className="rounded-[calc(2rem-0.5rem)] bg-surface p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-8">
        
        {/* Price Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">Program fee</p>
          <p className="text-4xl font-bold tracking-tight text-text-primary">₹{price.toLocaleString("en-IN")}</p>
          <p className="text-xs text-text-muted mt-2">One-time payment. No subscription.</p>
        </div>

        {/* Selector Section */}
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary">Choose your batch</span>
            <div className="relative">
              <select 
                className="w-full h-12 appearance-none rounded-xl border border-border/50 bg-background/50 px-4 text-sm font-medium text-text-primary outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 ease-[var(--ease-out)]" 
                onChange={(event) => setSelectedBatchId(event.target.value)} 
                value={selectedBatchId}
              >
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.title} - {getRemainingSeats(batch)} seats left
                  </option>
                ))}
              </select>
              {/* Custom arrow for select */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="size-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </label>

          {/* Availability Bar */}
          {selectedBatch && (
            <div className="rounded-xl border border-border/40 bg-background/30 p-4 space-y-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-text-secondary">
                  {getRemainingSeats(selectedBatch)} <span className="text-text-muted">of {selectedBatch.capacity} seats open</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {selectedBatch.status === "live" ? "Live now" : "Upcoming"}
                </span>
              </div>
              <div aria-label={`${getRemainingSeats(selectedBatch)} seats remaining`} className="h-1.5 overflow-hidden rounded-full bg-border/50">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-[var(--ease-out)]" 
                  style={{ width: `${(getRemainingSeats(selectedBatch) / selectedBatch.capacity) * 100}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="space-y-4 pt-2">
          {isFull ? (
            <button className="flex h-14 w-full items-center justify-center rounded-full bg-secondary/50 text-sm font-semibold text-surface/50 opacity-50 cursor-not-allowed" disabled type="button">
              This batch is full
            </button>
          ) : (
            <Link 
              className="group flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-sm font-semibold text-surface transition-transform duration-300 ease-[var(--ease-out)] active:scale-[0.98]" 
              href={
                isSignedIn
                  ? `/checkout?courseSlug=${courseSlug}&batchId=${selectedBatchId}`
                  : `/sign-up?fallback_redirect_url=${encodeURIComponent(
                      `/checkout?courseSlug=${courseSlug}&batchId=${selectedBatchId}`
                    )}`
              }
            >
              <span>Enroll now</span>
              <span className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </span>
            </Link>
          )}
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-text-secondary">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2} />
            Secure your place now and receive batch information before the first class.
          </p>
        </div>

      </div>
    </aside>
  );
}
