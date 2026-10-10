"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, ShieldAlert, Loader2, Sparkles } from "lucide-react";

type EnrollModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  courseTitle: string;
  batchId?: string;
  price?: number;
};

export function EnrollModal({
  isOpen,
  onClose,
  courseSlug,
  courseTitle,
  batchId,
  price,
}: EnrollModalProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: trimmedName,
          buyerEmail: trimmedEmail,
          courseSlug,
          batchId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout session");
      }

      // Navigate directly to the payment-first checkout page
      router.push(`/checkout?purchaseId=${data.purchaseId}`);
    } catch (err: unknown) {
      console.error("[EnrollModal] Submit error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-[#FAF7F3] border border-[#0D0D0D] rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#525252] hover:text-[#0D0D0D] hover:bg-[#E6E2DC] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
            <Sparkles className="w-3 h-3" />
            Quick Enrollment
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0D0D0D]">
            Join {courseTitle}
          </h2>
          <p className="text-xs text-[#525252] leading-relaxed">
            Enter your details below to proceed directly to checkout. No account creation or password needed right now.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full h-12 px-4 rounded-xl border border-[#0D0D0D]/20 bg-white text-sm text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full h-12 px-4 rounded-xl border border-[#0D0D0D]/20 bg-white text-sm text-[#0D0D0D] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
            />
          </div>

          {/* Mandatory Warning Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF8E6] border border-[#F59E0B]/30 text-[#92400E]">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
            <p className="text-[11px] leading-relaxed">
              <strong>Make sure your email address is correct.</strong> Your course access instructions will be sent to this email. An incorrect email may prevent you from receiving them.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 flex items-center justify-center gap-2 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  <span>Continue to Payment</span>
                  {price && <span className="opacity-80">· ₹{price.toLocaleString("en-IN")}</span>}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
