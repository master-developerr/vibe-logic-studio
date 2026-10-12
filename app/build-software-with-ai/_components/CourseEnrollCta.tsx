import React from "react";
import Link from "next/link";

type CourseEnrollCtaProps = {
  courseSlug: string;
  courseTitle?: string;
  price?: number;
  label?: string;
  className?: string;
};

export default function CourseEnrollCta({
  courseSlug,
  label = "Enroll now",
  className = "button button-primary",
}: CourseEnrollCtaProps) {
  return (
    <Link
      href={`/checkout?courseSlug=${encodeURIComponent(courseSlug)}`}
      className={className}
    >
      <span>{label}</span>
      <span className="button-icon">
        <svg aria-hidden="true" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h15m-6-6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
