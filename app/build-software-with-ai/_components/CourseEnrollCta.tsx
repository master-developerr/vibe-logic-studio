"use client";

import React, { useState } from "react";
import { EnrollModal } from "@/components/courses/EnrollModal";

type CourseEnrollCtaProps = {
  courseSlug: string;
  courseTitle: string;
  price?: number;
  label?: string;
  className?: string;
};

export default function CourseEnrollCta({
  courseSlug,
  courseTitle,
  price,
  label = "Enroll now",
  className = "button button-primary",
}: CourseEnrollCtaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <span>{label}</span>
        <span className="button-icon">
          <svg aria-hidden="true" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h15m-6-6 6 6-6 6" />
          </svg>
        </span>
      </button>

      <EnrollModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        price={price}
      />
    </>
  );
}
