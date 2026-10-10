"use client";

import React, { useState } from "react";
import { EnrollModal } from "./EnrollModal";

type EnrollButtonProps = {
  courseSlug: string;
  courseTitle: string;
  batchId?: string;
  price?: number;
  className?: string;
  children?: React.ReactNode;
};

export function EnrollButton({
  courseSlug,
  courseTitle,
  batchId,
  price,
  className,
  children,
}: EnrollButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider transition-all"}
      >
        {children || "Enroll Now"}
      </button>

      <EnrollModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        batchId={batchId}
        price={price}
      />
    </>
  );
}
