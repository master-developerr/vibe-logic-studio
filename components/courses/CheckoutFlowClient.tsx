"use client";

import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "./CheckoutClient";
import { Calendar, User, Mail, Sparkles } from "lucide-react";

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
  purchaseId: string;
  buyerName: string;
  buyerEmail: string;
  appliedCoupon?: string;
  discountAmount?: number;
  currentAmount: number;
};

export function CheckoutFlowClient({
  course,
  batch,
  purchaseId,
  buyerName,
  buyerEmail,
  appliedCoupon,
  discountAmount = 0,
  currentAmount,
}: CheckoutFlowClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Course & Buyer details */}
      <div className="lg:col-span-7 space-y-6 text-left">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Review & Finalize Order
          </h1>
          <p className="text-sm text-text-secondary">
            Confirm your student information and cohort schedule before proceeding to payment.
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

        {/* Student Profile Card */}
        <div className="p-6 md:p-7 bg-surface border border-border rounded-3xl space-y-4 shadow-sm text-left">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Student Enrollment Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                <User className="w-3 h-3" />
                Full Name
              </label>
              <div className="mt-1 text-sm font-semibold text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl">
                {buyerName}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Registered Email
              </label>
              <div className="mt-1 text-sm font-semibold text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl truncate">
                {buyerEmail}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            * Note: Your course access credentials, invoice, and dashboard link will be dispatched directly to this email address once payment is verified.
          </p>
        </div>
      </div>

      {/* Right Column: Pricing & Checkout trigger client */}
      <div className="lg:col-span-5">
        <CheckoutClient
          purchaseId={purchaseId}
          courseSlug={course.slug}
          batchId={batch.id}
          originalPrice={course.price}
          initialAmount={currentAmount}
          initialCoupon={appliedCoupon}
          initialDiscount={discountAmount}
          studentName={buyerName}
          studentEmail={buyerEmail}
        />
      </div>
    </div>
  );
}
