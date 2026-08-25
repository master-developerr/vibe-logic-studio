"use client";

import { useEffect } from "react";

/**
 * CourseOfferHashScroller
 * Listens for #course-offer or #bootcamp in the URL on mount, hydration,
 * direct navigation, or hash change, and scrolls cleanly to the offer section
 * with retry logic to ensure element existence after async renders.
 */
export default function CourseOfferHashScroller() {
  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;

      if (hash === "#course-offer" || hash === "#bootcamp") {
        let attempts = 0;
        const maxAttempts = 25; // 2.5s maximum retry window

        const tryScroll = () => {
          const element =
            document.getElementById("course-offer") ||
            document.getElementById("bootcamp");

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryScroll, 100);
          }
        };

        // Double rAF ensures browser layout & fonts have completed initial pass
        requestAnimationFrame(() => {
          requestAnimationFrame(tryScroll);
        });
      }
    };

    // Run on initial mount
    handleHashScroll();

    // Listen for client hash changes
    window.addEventListener("hashchange", handleHashScroll);
    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, []);

  return null;
}
