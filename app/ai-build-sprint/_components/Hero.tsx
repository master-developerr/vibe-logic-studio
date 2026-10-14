"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#F1EDE4] text-[#171717] pt-12 pb-16 md:pt-16 md:pb-24 border-b border-[#D7D0C4] overflow-hidden">
      {/* Subtle Architectural Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 select-none"
        style={{
          backgroundImage:
            "linear-gradient(#D7D0C4 1px, transparent 1px), linear-gradient(90deg, #D7D0C4 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#D7D0C4] bg-white/85 text-[11px] font-mono uppercase tracking-widest text-[#5C5851] mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" aria-hidden="true" />
          Seven-Day Beginner AI-Assisted Coding Bootcamp
        </div>

        {/* Two-Column Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Primary Actions */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h1 className="font-bold tracking-[-0.035em] leading-[1.03] text-[#171717] text-[42px] sm:text-[56px] xl:text-[66px] mb-6">
              Build real web projects{" "}
              <span className="text-[#FF5722]">with AI.</span>
            </h1>

            <p className="text-[17px] sm:text-[19px] text-[#5C5851] leading-[1.6] max-w-[510px] mb-8">
              Complete beginners can use modern AI tools to build, refine, and publish real websites. Seven days of guided lessons, practical exercises, and zero prior coding experience required.
            </p>

            {/* Primary & Secondary CTAs (Double-Bezel Button-in-Button Architecture) */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-9">
              <Link
                href="/checkout?courseSlug=ai-build-sprint"
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3.5 bg-[#FF5722] text-white font-semibold text-[15px] pl-7 pr-3 py-3.5 rounded-xl shadow-[0_8px_20px_rgba(255,87,34,0.22)] hover:bg-[#E64B17] active:scale-[0.98] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
              >
                <span>Join the Bootcamp — ₹999</span>
                <span className="w-8 h-8 rounded-lg bg-black/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </Link>

              <Link
                href="#curriculum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#D7D0C4] bg-white hover:bg-[#FAF8F5] active:scale-[0.98] text-[#171717] font-semibold text-[15px] px-6 py-4 rounded-xl transition-all duration-150 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              >
                <span>Explore the Curriculum</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Workflow Milestones Strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-[#D7D0C4] text-[12px] font-mono text-[#5C5851]">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D7D0C4] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span>01 Prompt & Spec</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D7D0C4] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span>02 Synthesize with Cursor</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D7D0C4] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
                <span>03 Deploy to Vercel</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Building Workspace Visual */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Workspace Label Header */}
            <div className="flex items-center justify-between gap-3 mb-2.5 px-1 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] flex-shrink-0" />
                <span className="text-[#171717] font-semibold flex-shrink-0">STUDIO ENVIRONMENT:</span>
                <span className="text-[#666158] truncate">
                  AI-Assisted Full-Stack Synthesis
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#22C55E] flex-shrink-0 font-medium bg-white/80 border border-[#D7D0C4] px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>ACTIVE WORKSPACE</span>
              </span>
            </div>

            {/* Machine Shell (Double-Bezel Architecture) */}
            <div className="bg-[#1A1A1A] p-2 sm:p-2.5 rounded-2xl sm:rounded-[22px] border border-[#2D2D2D] shadow-[0_20px_50px_rgba(23,23,23,0.18)] ring-1 ring-white/10 flex flex-col">
              
              {/* Inner Core: Cohesive AI Building Interface */}
              <div className="bg-[#121212] rounded-xl sm:rounded-[16px] overflow-hidden border border-[#262626] flex flex-col">
                
                {/* 01 Window Header Bar */}
                <div className="bg-[#161616] px-4 py-2.5 border-b border-[#242424] flex items-center justify-between gap-3 text-xs">
                  {/* Window Controls & Title */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block opacity-80" />
                    </div>
                    <span className="text-[12px] font-mono text-[#D4D4D4] font-medium truncate">
                      vibe-studio // ticket-platform-spec
                    </span>
                  </div>

                  {/* Environment Status Badge */}
                  <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                    <span className="text-[#22C55E] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>Ready</span>
                    </span>
                    <span className="text-[#444444] hidden sm:inline">•</span>
                    <span className="text-[#888888] hidden sm:inline">Next.js 15</span>
                  </div>
                </div>

                {/* 02 Prompt Panel */}
                <div className="p-3.5 sm:p-4 bg-[#141414] border-b border-[#222222]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#888888] mb-2">
                    <div className="flex items-center gap-1.5 text-[#FF5722] font-semibold">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.2-6.8l-2.8 2.8m-8 8l-2.8 2.8m13.6 0l-2.8-2.8m-8-8L4.2 5.2" />
                      </svg>
                      <span>PROMPT SPECIFICATION</span>
                    </div>
                    <span className="text-[10px] bg-[#1F1F1F] text-[#A3A3A3] px-2 py-0.5 rounded border border-[#2B2B2B]">
                      AI Assisted Mode
                    </span>
                  </div>
                  <div className="bg-[#0B0B0B] rounded-lg p-3 border border-[#262626] font-mono text-[12px] sm:text-[13px] text-[#EDEDED] leading-snug">
                    <span className="text-[#FF5722] mr-1.5">✦</span>
                    <span>&quot;Build a modern event ticketing platform with QR check-in &amp; responsive ticket tiers.&quot;</span>
                    <span className="inline-block w-1.5 h-3.5 bg-[#FF5722] animate-pulse ml-1.5 align-middle" aria-hidden="true" />
                  </div>
                </div>

                {/* 03 AI Build Activity Pipeline Rows */}
                <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#111111] border-b border-[#222222] flex items-center justify-between gap-2 text-[11px] font-mono overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-1.5 text-[#22C55E] flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>Structuring pages</span>
                  </div>
                  <span className="text-[#333333] flex-shrink-0">/</span>
                  <div className="flex items-center gap-1.5 text-[#22C55E] flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>Building components</span>
                  </div>
                  <span className="text-[#333333] flex-shrink-0">/</span>
                  <div className="flex items-center gap-1.5 text-[#38BDF8] flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span>Synthesizing styles</span>
                  </div>
                  <span className="text-[#333333] flex-shrink-0">/</span>
                  <div className="flex items-center gap-1.5 text-[#FF5722] flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
                    <span>Preparing deploy</span>
                  </div>
                </div>

                {/* 04 Authentic Code / Component Preview Area */}
                <div className="bg-[#0A0A0A] flex flex-col">
                  {/* Editor File Tab Strip */}
                  <div className="flex items-center justify-between px-3 pt-2 border-b border-[#202020] bg-[#111111] text-[11px] font-mono">
                    <div className="flex items-center gap-1">
                      <div className="px-3 py-1.5 bg-[#0A0A0A] text-white border-t-2 border-[#FF5722] border-x border-[#202020] rounded-t font-medium flex items-center gap-2">
                        <span className="text-[#38BDF8] text-[10px] font-bold">TSX</span>
                        <span>TicketTier.tsx</span>
                      </div>
                      <div className="px-3 py-1.5 text-[#666666] flex items-center gap-2 cursor-default hidden sm:flex">
                        <span className="text-[#FBBF24] text-[10px] font-bold">TS</span>
                        <span>schema.ts</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#555555] hidden sm:inline">TypeScript Strict · React 19</span>
                  </div>

                  {/* Clean Syntax Highlighted Code Lines */}
                  <div className="p-3.5 sm:p-4 font-mono text-[11px] sm:text-[12px] leading-[1.65] text-[#D4D4D4] overflow-x-auto">
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">01</span>
                      <span><span className="text-[#F472B6]">export function</span> <span className="text-[#FBBF24]">TicketTier</span>({'{'} <span className="text-[#93C5FD]">name, price, perks</span> {'}'}: <span className="text-[#A78BFA]">TierProps</span>) {'{'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">02</span>
                      <span className="pl-4"><span className="text-[#F472B6]">return</span> (</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">03</span>
                      <span className="pl-8">&lt;<span className="text-[#38BDF8]">div</span> <span className="text-[#94A3B8]">className</span>=<span className="text-[#A7F3D0]">&quot;rounded-xl border border-neutral-800 p-4 bg-neutral-900&quot;</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">04</span>
                      <span className="pl-12">&lt;<span className="text-[#38BDF8]">div</span> <span className="text-[#94A3B8]">className</span>=<span className="text-[#A7F3D0]">&quot;flex justify-between items-center mb-2&quot;</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">05</span>
                      <span className="pl-16">&lt;<span className="text-[#38BDF8]">span</span> <span className="text-[#94A3B8]">className</span>=<span className="text-[#A7F3D0]">&quot;font-semibold text-white&quot;</span>&gt;{'{'}<span className="text-[#93C5FD]">name</span>{'}'}&lt;/<span className="text-[#38BDF8]">span</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">06</span>
                      <span className="pl-16">&lt;<span className="text-[#38BDF8]">span</span> <span className="text-[#94A3B8]">className</span>=<span className="text-[#FF5722] font-semibold">&quot;font-mono text-[#FF5722]&quot;</span>&gt;₹{'{'}<span className="text-[#93C5FD]">price</span>{'}'}&lt;/<span className="text-[#38BDF8]">span</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">07</span>
                      <span className="pl-12">&lt;/<span className="text-[#38BDF8]">div</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">08</span>
                      <span className="pl-12">&lt;<span className="text-[#FBBF24]">QRCheckInModal</span> <span className="text-[#94A3B8]">eventId</span>={'{'}<span className="text-[#93C5FD]">tier.id</span>{'}'} /&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">09</span>
                      <span className="pl-8">&lt;/<span className="text-[#38BDF8]">div</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">10</span>
                      <span className="pl-4">);</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-[#4B5563] select-none flex-shrink-0 text-right pr-3 text-[10px]">11</span>
                      <span>{'}'}</span>
                    </div>
                  </div>
                </div>

                {/* 05 Deployment Result Footer Bar */}
                <div className="px-3.5 py-3 sm:px-4 bg-[#141414] border-t border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0" />
                    <span className="text-[#22C55E] font-semibold text-[11px] sm:text-xs">Build complete</span>
                    <span className="text-[#555555]">·</span>
                    <span className="text-[#A3A3A3] text-[11px] truncate">Ready to deploy</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-[#0B0B0B] px-2.5 py-1 rounded-md border border-[#262626] text-[10px] text-[#A3A3A3] flex items-center gap-1.5">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-[#22C55E]"
                        aria-hidden="true"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <span className="truncate">tickets.vibelogic.build</span>
                    </div>
                    <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2 py-0.5 rounded font-bold">
                      200 OK
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
