"use client";

import { TechIcon } from "./TechIcons";
import Link from "next/link";

const stages = [
  {
    step: "Stage 01",
    title: "Understand the Tools",
    headline: "AI Prompting & Scaffold Architecture",
    description: "Learn how to prompt AI models with precise context, architectural constraints, and clean directory scaffolding.",
    tools: ["cursor", "gemini", "google ai studio"],
    visual: (
      <div className="bg-[#171717] rounded-xl p-3 border border-[#333333] text-[11px] font-mono text-[#E5E5E5] space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#A3A3A3] pb-1.5 border-b border-[#2E2E2E]">
          <span className="text-[#FF5722]">✦ Context Spec</span>
          <span>vibe-ai / prompt.md</span>
        </div>
        <p className="text-[#A3A3A3]">
          &quot;Scaffold a responsive landing page with Tailwind v4, mobile drawer, and checkout CTA.&quot;
        </p>
        <div className="flex items-center gap-2 text-[#22C55E] text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>Architecture synthesized (0.6s)</span>
        </div>
      </div>
    ),
  },
  {
    step: "Stage 02",
    title: "Build the Interface",
    headline: "React Components & Fluid Layouts",
    description: "Compose interactive UI elements, layout wrappers, and mobile-first responsive breakpoints using Tailwind CSS.",
    tools: ["react", "next.js", "html5", "css3"],
    visual: (
      <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#D7D0C4] text-[11px] space-y-2 text-[#171717]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E0D8]">
          <span className="font-bold text-[11px]">HeroComponent.tsx</span>
          <span className="text-[9px] bg-[#22C55E]/20 text-[#16A34A] px-1.5 py-0.5 rounded font-mono font-bold">RSC READY</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-white p-2 rounded border border-[#E5E0D8]">
            <span className="text-[#737373]">Desktop:</span>
            <div className="font-bold">12-col grid</div>
          </div>
          <div className="bg-white p-2 rounded border border-[#E5E0D8]">
            <span className="text-[#737373]">Mobile:</span>
            <div className="font-bold">Stack layout</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "Stage 03",
    title: "Refine & Test",
    headline: "Debugging, Forms & Accessibility",
    description: "Harden user enquiry forms, audit cross-browser touch targets, and fix layout shifts using Chrome DevTools and AI.",
    tools: ["chrome", "vscode", "typescript"],
    visual: (
      <div className="bg-[#171717] rounded-xl p-3 border border-[#333333] text-[11px] font-mono text-white space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#A3A3A3] pb-1.5 border-b border-[#2E2E2E]">
          <span className="text-[#22C55E]">✓ Lighthouse Audit</span>
          <span>Performance: 99</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#E5E5E5]">
          <span>Accessibility</span>
          <span className="text-[#22C55E]">100%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#E5E5E5]">
          <span>Touch Targets</span>
          <span className="text-[#22C55E]">Passed</span>
        </div>
      </div>
    ),
  },
  {
    step: "Stage 04",
    title: "Publish the Website",
    headline: "Git Versioning & Global Edge CDN",
    description: "Push repository commits to GitHub, connect to Vercel edge infrastructure, and publish a live public domain URL.",
    tools: ["github", "vercel", "cloudflare"],
    visual: (
      <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#D7D0C4] text-[11px] space-y-2 text-[#171717]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E0D8]">
          <span className="font-mono text-[10px] text-[#22C55E] font-bold">● Production Deployed</span>
          <span className="text-[9px] font-mono text-[#737373]">Edge Network</span>
        </div>
        <div className="bg-white p-2 rounded border border-[#E5E0D8] font-mono text-[10px] text-[#171717] truncate">
          https://my-studio-build.vercel.app
        </div>
        <div className="text-[9px] text-[#5C5851] flex items-center justify-between">
          <span>SSL Certificate Active</span>
          <span className="text-[#16A34A] font-bold">200 OK</span>
        </div>
      </div>
    ),
  },
];

export default function LearningExperience() {
  return (
    <section className="py-24 bg-[#F1EDE4] border-b border-[#D7D0C4]" id="experience" aria-label="Learning Progression">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/80 text-[11px] font-mono uppercase tracking-widest text-[#5C5851] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span>[01] // Practical Progression</span>
          </div>
          <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05]">
            How ideas become working software.
          </h2>
          <p className="text-[16px] text-[#5C5851] mt-3 leading-relaxed max-w-[65ch]">
            A clear four-stage progression that removes the guesswork from web development. You build alongside real tools, step-by-step, until your project is live.
          </p>
        </div>

        {/* 4 Connected Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl p-6 flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(23,23,23,0.06),0_1px_3px_-1px_rgba(23,23,23,0.04)] hover:border-[#171717]/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group"
            >
              <div>
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-bold text-[#FF5722] uppercase tracking-wider">
                    {stage.step}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {stage.tools.map((t, tIdx) => (
                      <div key={tIdx} className="w-5 h-5 flex items-center justify-center" title={t}>
                        <TechIcon name={t} className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-[19px] text-[#171717] tracking-tight mb-1">
                  {stage.title}
                </h3>
                <h4 className="font-mono text-[11px] text-[#737373] mb-3">
                  {stage.headline}
                </h4>
                <p className="text-[13px] text-[#5C5851] leading-relaxed mb-6">
                  {stage.description}
                </p>
              </div>

              {/* Stage Visual Artifact */}
              <div>
                {stage.visual}
              </div>
            </div>
          ))}
        </div>

        {/* Action Handoff */}
        <div className="mt-12 bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_2px_10px_-2px_rgba(23,23,23,0.06)]">
          <div>
            <h4 className="font-bold text-[17px] text-[#171717] tracking-tight">
              Want to see the daily module schedule?
            </h4>
            <p className="text-[13px] text-[#5C5851] mt-1 max-w-[65ch]">
              Explore how these 4 stages are taught across the seven structured days.
            </p>
          </div>
          <Link
            href="#curriculum"
            className="inline-flex items-center gap-2 bg-[#171717] text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#FF5722] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shadow-xs"
          >
            <span>View 7-Day Curriculum</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
