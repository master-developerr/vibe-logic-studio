"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowUpRight, Calendar } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { getRemainingSeats, type CourseBatch } from "@/lib/course-data";

type BatchSelectorPremiumProps = {
  batches: CourseBatch[];
  price: number;
  courseSlug: string;
};

export function BatchSelectorPremium({ batches, price, courseSlug }: BatchSelectorPremiumProps) {
  const { isSignedIn } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id ?? "");
  const selectedBatch = useMemo(
    () => batches.find((b) => b.id === selectedBatchId),
    [batches, selectedBatchId]
  );
  const remainingSeats = selectedBatch ? getRemainingSeats(selectedBatch) : 0;
  const isFull = !selectedBatch || remainingSeats === 0;
  const fillPct = selectedBatch
    ? ((selectedBatch.capacity - remainingSeats) / selectedBatch.capacity) * 100
    : 0;

  return (
    <aside className="rounded-[2rem] border border-border/60 bg-surface/80 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] overflow-hidden">

      {/* Header band */}
      <div className="border-b border-border/50 px-7 pt-7 pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2">
          Program fee
        </p>
        <div className="flex items-baseline gap-3">
          <p className="text-[2.75rem] font-bold tracking-[-0.04em] text-text-primary leading-none">
            ₹{price.toLocaleString("en-IN")}
          </p>
        </div>
        <p className="text-xs text-text-muted mt-2.5">One-time payment · No subscription</p>
      </div>

      <div className="p-7 space-y-7">

        {/* Batch picker — custom pill list, no native <select> */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Choose your batch
          </p>
          <div className="space-y-2.5">
            {batches.map((batch) => {
              const seats = getRemainingSeats(batch);
              const full = seats === 0;
              const isSelected = batch.id === selectedBatchId;
              return (
                <button
                  key={batch.id}
                  type="button"
                  onClick={() => setSelectedBatchId(batch.id)}
                  disabled={full}
                  className={`w-full text-left rounded-[1.15rem] border px-5 py-4 transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? "border-primary/40 bg-primary/6"
                      : full
                      ? "border-border/40 bg-background/40 opacity-50 cursor-not-allowed"
                      : "border-border/50 bg-background/50 hover:border-border hover:bg-background"
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Selection indicator */}
                      <motion.span
                        animate={{
                          backgroundColor: isSelected ? "var(--color-primary)" : "transparent",
                          borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                          scale: isSelected ? 1 : 0.85,
                        }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="size-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                      >
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="size-1.5 rounded-full bg-white"
                          />
                        )}
                      </motion.span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                          {batch.title}
                        </p>
                        <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Calendar className="size-2.5 shrink-0" />
                          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${batch.startDate}T00:00:00`))}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] shrink-0 ${
                        full ? "text-error" : isSelected ? "text-primary" : "text-text-muted"
                      }`}
                    >
                      {full ? "Full" : `${seats} left`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seat availability bar */}
        <AnimatePresence mode="wait">
          {selectedBatch && (
            <motion.div
              key={selectedBatch.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-xl bg-background/60 border border-border/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">
                  <span className="text-text-primary font-bold">{remainingSeats}</span>
                  {" "}of {selectedBatch.capacity} seats open
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${selectedBatch.status === "live" ? "text-success" : "text-primary"}`}>
                  {selectedBatch.status === "live" ? "Live now" : "Upcoming"}
                </span>
              </div>
              <div className="h-1 bg-border/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isFull ? "bg-error/70" : "bg-primary"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="space-y-4">
          {isFull ? (
            <button
              type="button"
              disabled
              className="flex h-14 w-full items-center justify-center rounded-full bg-border/60 text-sm font-semibold text-text-muted cursor-not-allowed select-none"
            >
              This batch is full
            </button>
          ) : (
            <Link
              href={
                isSignedIn
                  ? `/checkout?courseSlug=${courseSlug}&batchId=${selectedBatchId}`
                  : `/sign-up?redirect_url=${encodeURIComponent(
                      `/checkout?courseSlug=${courseSlug}&batchId=${selectedBatchId}`
                    )}`
              }
              className="group relative flex h-14 w-full items-center justify-between rounded-full bg-text-primary pl-6 pr-2 text-sm font-bold text-surface overflow-hidden transition-transform duration-150 active:scale-[0.98] shadow-lg"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              {/* Hover fill layer */}
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }} />
              <span className="relative z-10 tracking-tight font-bold">Join Now — Enroll in Batch</span>
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  strokeWidth={2.25}
                />
              </span>
            </Link>
          )}

          <p className="flex items-start gap-2.5 text-[11px] leading-relaxed text-text-secondary">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2} aria-hidden />
            Secure your place now and receive batch information before the first class.
          </p>
        </div>

      </div>
    </aside>
  );
}
