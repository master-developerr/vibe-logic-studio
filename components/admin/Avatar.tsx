import React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ name, url, size = 9 }: { name: string; url: string; size?: number }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-primary/15 text-primary",
    "bg-info/15 text-info",
    "bg-success/15 text-success",
    "bg-warning/15 text-warning",
  ];
  const color = colors[(name || "A").charCodeAt(0) % colors.length];

  if (url) {
    return (
      <div
        className={cn("rounded-full overflow-hidden shrink-0 border border-border")}
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      >
        <img src={url} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-full shrink-0 flex items-center justify-center font-bold border border-border",
        color
      )}
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, fontSize: `${size * 1.4}px` }}
    >
      {initials}
    </div>
  );
}
