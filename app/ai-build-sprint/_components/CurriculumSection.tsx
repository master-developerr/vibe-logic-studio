"use client";

import { useState } from "react";
import Link from "next/link";
import { TechIcon } from "./TechIcons";

type Module = {
  day: string;
  phase: "Setup" | "Building" | "Refinement" | "Publishing";
  phaseColor: string;
  title: string;
  hours: string;
  tools: string[];
  description: string;
  topics: string[];
  outcome: string;
};

const modules: Module[] = [
  {
    day: "Day 01",
    phase: "Setup",
    phaseColor: "bg-[#3B82F6]/15 text-[#2563EB] border-[#3B82F6]/30",
    title: "AI-Assisted Workflow & Environment Setup",
    hours: "1 hour live + lab",
    tools: ["vscode", "cursor", "gemini"],
    description:
      "Configure your code editor, terminal, and modern AI tools. Learn prompt engineering patterns, context grounding, and error-free project scaffolding.",
    topics: ["Editor configuration & terminal basics", "AI prompt & context engineering", "Scaffolding modern web projects", "Project directory architecture"],
    outcome: "Configured AI development environment and initial repository scaffolding.",
  },
  {
    day: "Day 02",
    phase: "Building",
    phaseColor: "bg-[#FF5722]/15 text-[#FF5722] border-[#FF5722]/30",
    title: "Responsive Layouts & Visual Hierarchy",
    hours: "1 hour live + lab",
    tools: ["html5", "css3"],
    description:
      "Turn design concepts into clean semantic HTML and Tailwind CSS. Learn mobile-first techniques, flexbox, CSS grid, and art-directed typography.",
    topics: ["Semantic HTML5 layout structure", "Tailwind CSS utility architecture", "Mobile-first responsive breakpoints", "Typography & spacing scales"],
    outcome: "Fully responsive multi-breakpoint landing page wireframe.",
  },
  {
    day: "Day 03",
    phase: "Building",
    phaseColor: "bg-[#FF5722]/15 text-[#FF5722] border-[#FF5722]/30",
    title: "React Components & Interactive States",
    hours: "1 hour live + lab",
    tools: ["react", "next.js"],
    description:
      "Deconstruct interfaces into reusable React components. Master state hooks, click handlers, active states, and interactive tabs and accordions.",
    topics: ["Component boundaries & props", "State management with React hooks", "Interactive navigation & accordions", "Clean client vs server boundaries"],
    outcome: "Interactive website interface with dynamic menus and accordions.",
  },
  {
    day: "Day 04",
    phase: "Building",
    phaseColor: "bg-[#FF5722]/15 text-[#FF5722] border-[#FF5722]/30",
    title: "Form Handling & User Enquiry Flows",
    hours: "1 hour live + lab",
    tools: ["typescript", "javascript"],
    description:
      "Capture and validate user inputs with confidence. Build lead capture forms, input error states, and automated WhatsApp/email client redirection.",
    topics: ["Input validation & state feedback", "Lead capture & enquiry patterns", "WhatsApp redirect triggers", "Error state handling"],
    outcome: "Functional enquiry form with client-side feedback & validation.",
  },
  {
    day: "Day 05",
    phase: "Building",
    phaseColor: "bg-[#FF5722]/15 text-[#FF5722] border-[#FF5722]/30",
    title: "AI Integration & Generative Workflows",
    hours: "1 hour live + lab",
    tools: ["gemini", "google ai studio"],
    description:
      "Learn how modern applications leverage generative AI APIs. Connect prompt endpoints to transform user prompts into dynamic recommendations or UI updates.",
    topics: ["AI API architecture & secure calls", "Model parameters & streaming", "Structured JSON output handling", "Displaying AI responses gracefully"],
    outcome: "AI-powered capability integrated directly into your web project.",
  },
  {
    day: "Day 06",
    phase: "Refinement",
    phaseColor: "bg-[#A855F7]/15 text-[#9333EA] border-[#A855F7]/30",
    title: "Debugging, Performance & Accessibility",
    hours: "1 hour live + lab",
    tools: ["chrome", "vscode"],
    description:
      "Harden your web application for real users. Debug layout bugs with AI, audit mobile performance via Lighthouse, and ensure keyboard accessibility.",
    topics: ["Debugging edge-cases with AI", "Lighthouse performance & asset sizing", "Semantic accessibility & screen-readers", "Cross-browser consistency checks"],
    outcome: "Performance-audited, mobile-tested web project ready for deployment.",
  },
  {
    day: "Day 07",
    phase: "Publishing",
    phaseColor: "bg-[#22C55E]/15 text-[#16A34A] border-[#22C55E]/30",
    title: "GitHub, Cloud Edge Deployment & Publishing",
    hours: "1 hour live + lab",
    tools: ["github", "vercel", "cloudflare"],
    description:
      "Push code to GitHub and deploy to global edge infrastructure on Vercel. Configure SEO meta tags, social share preview cards, and custom domain DNS.",
    topics: ["Git version control essentials", "One-click deployment on Vercel", "Meta tags & Open Graph social cards", "Custom domain DNS records"],
    outcome: "Your completed project published live on a public URL.",
  },
];

export default function CurriculumSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#F1EDE4] border-b border-[#D7D0C4]" id="curriculum" aria-label="Curriculum">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/80 text-[11px] font-mono uppercase tracking-widest text-[#FF5722] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
              <span>[03] // Curriculum Specification</span>
            </div>
            <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05]">
              Seven days. Seven progressive modules.
            </h2>
            <p className="text-[16px] text-[#5C5851] mt-3 leading-relaxed max-w-[65ch]">
              Seven structured days with seven total hours of live instruction. From workspace setup to deploying a live website on your own public URL.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] px-4 py-3 rounded-xl text-[13px] text-[#171717] font-medium flex-shrink-0 shadow-[0_2px_8px_-2px_rgba(23,23,23,0.06)] tabular-nums">
            <span className="font-bold text-[#FF5722]">7 Modules</span>
            <span className="text-[#D7D0C4]">·</span>
            <span>7 Live Hours</span>
            <span className="text-[#D7D0C4]">·</span>
            <span>Lifetime Access</span>
          </div>
        </div>

        {/* Visual Timeline Cards */}
        <div className="space-y-4">
          {modules.map((m, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div
                key={m.day}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#171717] ring-1 ring-black/10 shadow-md"
                    : "border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] hover:border-[#171717]/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] active:scale-[0.99] transition-transform duration-100"
                  aria-expanded={isOpen}
                  aria-controls={`module-body-${index}`}
                  id={`module-btn-${index}`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Day Pill */}
                    <span className="font-mono text-[13px] font-bold text-[#171717] bg-[#F1EDE4] px-3 py-1.5 rounded-lg border border-[#D7D0C4] flex-shrink-0 tabular-nums">
                      {m.day}
                    </span>

                    {/* Phase Badge */}
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${m.phaseColor}`}>
                      {m.phase}
                    </span>

                    <div>
                      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#171717] tracking-tight">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1EDE4]">
                    {/* Tool Logos */}
                    <div className="flex items-center gap-2">
                      {m.tools.map((t, tIdx) => (
                        <div key={tIdx} className="w-5 h-5 flex items-center justify-center" title={t}>
                          <TechIcon name={t} className="w-4 h-4" />
                        </div>
                      ))}
                    </div>

                    <span className="font-mono text-[11px] text-[#737373]">
                      {m.hours}
                    </span>

                    <div className="w-8 h-8 rounded-full border border-[#D7D0C4] flex items-center justify-center text-[#171717] bg-[#FAF8F5] transition-transform duration-200">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`module-body-${index}`}
                    role="region"
                    aria-labelledby={`module-btn-${index}`}
                    className="px-6 pb-7 sm:px-7 pt-2 border-t border-[#F1EDE4] grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200"
                  >
                    <div className="md:col-span-7">
                      <p className="text-[14px] text-[#5C5851] leading-relaxed mb-4 max-w-[65ch]">
                        {m.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#171717]">
                        {m.topics.map((topic, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-[#FAF8F5] border border-[#D7D0C4] p-5 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF5722] font-semibold">
                          Daily Milestone Deliverable
                        </span>
                        <p className="text-[13px] text-[#171717] font-bold mt-1 leading-snug">
                          {m.outcome}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E8E3D8] text-[11px] font-mono text-[#737373]">
                        Includes starter repository & code walkthrough
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-7 bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl shadow-[0_2px_10px_-2px_rgba(23,23,23,0.06)]">
          <p className="text-[14px] text-[#5C5851] max-w-[65ch]">
            All seven live sessions are recorded with lifetime access in your dashboard.
          </p>
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            className="inline-flex items-center gap-3 bg-[#FF5722] hover:bg-[#e64b17] active:scale-[0.98] text-white font-bold text-[14px] pl-5 pr-2.5 py-2.5 rounded-xl shadow-md transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
          >
            <span>Join Cohort for ₹999</span>
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
