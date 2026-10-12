"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "./CheckoutClient";
import { Calendar, User, Mail, Sparkles, ShieldAlert, AlertCircle } from "lucide-react";

type CheckoutFlowClientProps = {
  course: {
    id: Id<"courses">;
    slug: string;
    category: string;
    title: string;
    price: number;
  };
  batch: {
    id: Id<"batches">;
    title: string;
    startDate: number;
  };
  initialPurchaseId?: string;
  initialBuyerName?: string;
  initialBuyerEmail?: string;
  appliedCoupon?: string;
  discountAmount?: number;
  currentAmount: number;
};

export function CheckoutFlowClient({
  course,
  batch,
  initialPurchaseId,
  initialBuyerName = "",
  initialBuyerEmail = "",
  appliedCoupon,
  discountAmount = 0,
  currentAmount,
}: CheckoutFlowClientProps) {
  const [purchaseId, setPurchaseId] = useState<string | undefined>(initialPurchaseId);
  const [fullName, setFullName] = useState(initialBuyerName);
  const [email, setEmail] = useState(initialBuyerEmail);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      setNameError("Please enter your full name (minimum 2 characters).");
      isValid = false;
    } else {
      setNameError(null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    return {
      valid: isValid,
      name: trimmedName,
      email: trimmedEmail,
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Course details & Embedded Student Form */}
      <div className="lg:col-span-7 space-y-6 text-left">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Review & Finalize Order
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Confirm your student details and cohort schedule before proceeding to payment.
          </p>
        </div>

        {/* Course & Cohort Batch Card */}
        <div className="p-6 md:p-7 bg-surface border border-border rounded-3xl space-y-5 shadow-sm text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {course.category}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-text-primary">
              {course.title}
            </h2>
          </div>

          <div className="h-px bg-border/60" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-background/50 border border-border/40">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Cohort Batch
              </p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {batch.title}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-background/50 border border-border/40">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Start Date
              </p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {new Date(batch.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Student Information Card */}
        <div className="p-6 md:p-7 bg-surface border border-border rounded-3xl space-y-5 shadow-sm text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Student Information
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Enter your student details below. No account creation or password needed right now.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label 
                htmlFor="checkout-full-name"
                className="block text-[11px] font-bold text-text-primary uppercase tracking-wider mb-1.5"
              >
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                onBlur={() => {
                  if (fullName.trim() && fullName.trim().length < 2) {
                    setNameError("Please enter your full name (minimum 2 characters).");
                  }
                }}
                placeholder="e.g. Alex Morgan"
                className={`w-full h-12 px-4 rounded-xl border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                  nameError
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-border/80 focus:border-primary focus:ring-primary/20"
                }`}
              />
              {nameError && (
                <p className="text-[11px] font-medium text-error mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="checkout-email"
                className="block text-[11px] font-bold text-text-primary uppercase tracking-wider mb-1.5"
              >
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onBlur={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (email.trim() && !emailRegex.test(email.trim().toLowerCase())) {
                    setEmailError("Please enter a valid email address.");
                  }
                }}
                placeholder="alex@example.com"
                className={`w-full h-12 px-4 rounded-xl border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                  emailError
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-border/80 focus:border-primary focus:ring-primary/20"
                }`}
              />
              {emailError && (
                <p className="text-[11px] font-medium text-error mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Mandatory Email Accuracy Advisory Banner */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF8E6] border border-[#F59E0B]/30 text-[#92400E]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
              <p className="text-[11px] leading-relaxed">
                <strong>Make sure your email address is correct.</strong> Your course access instructions, invoice, and dashboard link will be sent to this email. An incorrect email may prevent you from receiving them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Breakdown & Payment CTA */}
      <div className="lg:col-span-5 w-full">
        <CheckoutClient
          purchaseId={purchaseId}
          courseSlug={course.slug}
          batchId={batch.id}
          originalPrice={course.price}
          initialAmount={currentAmount}
          initialCoupon={appliedCoupon}
          initialDiscount={discountAmount}
          studentName={fullName}
          studentEmail={email}
          onValidateForm={validateForm}
          onPurchaseSessionCreated={(newId) => setPurchaseId(newId)}
        />
      </div>
    </div>
  );
}
