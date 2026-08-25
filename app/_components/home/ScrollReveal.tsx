"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay before animation starts
  threshold?: number; // 0–1, how much of element must be visible
}

/**
 * Wraps children in a div that animates in when it enters the viewport.
 * Uses IntersectionObserver + CSS data attributes — no JS animation libraries.
 * 
 * Add delay prop for stagger effects (pass 0, 100, 200ms etc.)
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay then mark as visible
            const timer = setTimeout(() => {
              el.setAttribute("data-visible", "true");
            }, delay);
            observer.unobserve(el);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold, rootMargin: "-40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} data-reveal="true" className={className}>
      {children}
    </div>
  );
}
