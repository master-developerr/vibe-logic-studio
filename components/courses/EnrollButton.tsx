import React from "react";
import Link from "next/link";

type EnrollButtonProps = {
  courseSlug: string;
  courseTitle?: string;
  batchId?: string;
  price?: number;
  className?: string;
  children?: React.ReactNode;
};

export function EnrollButton({
  courseSlug,
  batchId,
  className,
  children,
}: EnrollButtonProps) {
  const href = batchId
    ? `/checkout?courseSlug=${encodeURIComponent(courseSlug)}&batchId=${encodeURIComponent(batchId)}`
    : `/checkout?courseSlug=${encodeURIComponent(courseSlug)}`;

  return (
    <Link
      href={href}
      className={className || "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider transition-all"}
    >
      {children || "Enroll Now"}
    </Link>
  );
}
