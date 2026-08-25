"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

/**
 * FAQ — "BEFORE YOU START."
 * Two-column editorial accordion.
 */

const faqs = [
  {
    q: "What is VibeLogic Studio?",
    a: "An independent learning studio focused on practical software building.",
  },
  {
    q: "Who is this for?",
    a: "People who would rather understand how something works by making it.",
  },
  {
    q: "Do I need experience?",
    a: "Enough curiosity to start. The course takes you through the rest.",
  },
  {
    q: "How do I access a course?",
    a: "Purchase once and the course appears automatically in your student dashboard.",
  },
  {
    q: "What happens after I enrol?",
    a: "You get access to the course workspace, lessons, materials, recordings, assignments, and progress tracking.",
  },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 border-b border-[#E6E2DC] bg-[#FAF7F3]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">

          {/* LEFT */}
          <ScrollReveal>
            <div className="md:sticky md:top-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8A8A] mb-4">Before You Start</p>
              <h2
                className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D]"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                BEFORE<br />
                YOU<br />
                START.
              </h2>
            </div>
          </ScrollReveal>

          {/* RIGHT — Accordion */}
          <ScrollReveal delay={80}>
            <div>
              {faqs.map(({ q, a }, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={q} className="border-t border-[#E6E2DC] last:border-b">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <span className="text-[15px] md:text-[16px] font-medium text-[#0D0D0D] pr-6 group-hover:text-[#FF5A1F] transition-colors duration-150 uppercase tracking-[-0.01em]">
                        {q}
                      </span>
                      <span
                        className={`text-[#FF5A1F] font-mono text-[18px] flex-shrink-0 font-bold transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={`faq-answer-${i}`}
                      className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48 pb-5" : "max-h-0"}`}
                      role="region"
                    >
                      <p className="text-[14px] md:text-[15px] text-[#525252] leading-[1.65]">{a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
