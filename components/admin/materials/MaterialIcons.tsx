"use client";

import React from "react";

export function FormatIcon({ format, className = "w-5 h-5" }: { format: string; className?: string }) {
  const fmt = format.toUpperCase();
  if (fmt === "PDF") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M10 12H8v6" />
        <path d="M10 12h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2" />
        <path d="M14 15h2" />
        <path d="M14 12h2" />
      </svg>
    );
  }
  if (fmt === "DOCX" || fmt === "DOC") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    );
  }
  if (fmt === "PPTX" || fmt === "PPT") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h20" />
        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
        <path d="m7 21 5-5 5 5" />
      </svg>
    );
  }
  if (fmt === "ZIP" || fmt === "ARCHIVE") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 2v2" />
        <path d="M14 2v2" />
        <path d="M10 6v2" />
        <path d="M14 6v2" />
        <path d="M10 10v2" />
        <path d="M14 10v2" />
        <rect x="6" y="2" width="12" height="20" rx="2" />
      </svg>
    );
  }
  if (fmt === "MP4" || fmt === "VIDEO") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    );
  }
  if (fmt === "CODE" || fmt === "TSX" || fmt === "JS") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (fmt === "LINK" || fmt === "URL") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  // Default File icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function getFormatColor(format: string) {
  const fmt = format.toUpperCase();
  switch (fmt) {
    case "PDF":
      return "bg-red-500/10 text-red-600 border-red-200/60";
    case "DOCX":
    case "DOC":
      return "bg-blue-500/10 text-blue-600 border-blue-200/60";
    case "PPTX":
    case "PPT":
      return "bg-orange-500/10 text-orange-600 border-orange-200/60";
    case "ZIP":
    case "ARCHIVE":
      return "bg-purple-500/10 text-purple-600 border-purple-200/60";
    case "MP4":
    case "VIDEO":
      return "bg-teal-500/10 text-teal-600 border-teal-200/60";
    case "CODE":
    case "TSX":
    case "JS":
      return "bg-green-500/10 text-green-600 border-green-200/60";
    case "LINK":
    case "URL":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-200/60";
    default:
      return "bg-gray-500/10 text-text-secondary border-border";
  }
}
