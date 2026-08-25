import Link from "next/link";

/**
 * Hero — Split composition: left editorial text + right studio console artifact.
 * WE MAKE SOFTWARE MAKERS.
 */
export default function Hero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center pt-[60px] border-b border-[#E6E2DC] overflow-hidden"
      aria-label="VibeLogic Studio — Hero"
    >
      {/* Subtle grid background — hero only */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(#0D0D0D08 1px, transparent 1px), linear-gradient(90deg, #0D0D0D08 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1280px] w-full mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-16 xl:gap-24 items-center py-24 lg:py-20">

          {/* LEFT — Editorial text */}
          <div className="flex flex-col items-start">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#525252] border border-[#D8D4CE] px-3 py-1.5 rounded-full">
                <span className="w-[5px] h-[5px] rounded-full bg-[#FF5A1F] flex-shrink-0" aria-hidden="true" />
                VibeLogic Studio / 01
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-bold tracking-[-0.03em] leading-[0.88] text-[#0D0D0D] mb-8"
              style={{ fontSize: "clamp(64px, 8.5vw, 108px)" }}
            >
              WE MAKE<br />
              SOFTWARE<br />
              <span className="text-[#FF5A1F]">MAKERS.</span>
            </h1>

            {/* Supporting copy */}
            <p className="text-[17px] md:text-[18px] text-[#525252] leading-[1.65] max-w-[460px] mb-10">
              VibeLogic Studio is a practical space for learning how modern
              software actually gets designed, built, shipped, and improved.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <Link
                href="#lab"
                className="inline-flex items-center gap-2.5 bg-[#0D0D0D] !text-white text-[13px] font-bold px-6 py-3.5 uppercase tracking-wider hover:bg-[#FF5A1F] hover:!text-white active:scale-[0.97] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:ring-offset-2"
                style={{ color: "#FFFFFF" }}
              >
                <span className="text-white" style={{ color: "#FFFFFF" }}>Explore the Lab</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-0.5 transition-transform" style={{ stroke: "#FFFFFF" }} aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0D0D0D] uppercase tracking-wider hover:text-[#FF5A1F] transition-colors border-b border-[#D8D4CE] pb-0.5 hover:border-[#FF5A1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F]"
              >
                See the Courses
              </Link>
            </div>

            {/* Microcopy */}
            <p className="font-mono text-[11px] text-[#8A8A8A] tracking-[0.06em]">
              Projects over lectures. Systems over shortcuts.
            </p>
          </div>

          {/* RIGHT — Studio build artifact */}
          <div className="w-full">
            <StudioBuildArtifact />
          </div>
        </div>
      </div>
    </section>
  );
}

/** 
 * StudioBuildArtifact — Layered "BUILD SYSTEM" visual artifact
 * Communicates software construction through overlapping technical surfaces,
 * subtle depth, controlled dark accents (~40%), and precise status nodes.
 */
function StudioBuildArtifact() {
  return (
    <div className="relative w-full max-w-[480px] lg:max-w-none mx-auto select-none" aria-hidden="true">
      {/* Background ambient framing accents */}
      <div className="absolute -top-6 -left-6 w-24 h-24 border-l border-t border-[#D8D4CE] pointer-events-none hidden sm:block" />
      <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r border-b border-[#D8D4CE] pointer-events-none hidden sm:block" />

      <div className="relative flex flex-col space-y-4">

        {/* 1. TOP-RIGHT LAYER: System Status Card (Light surface) */}
        <div className="relative z-20 w-full sm:w-[280px] sm:self-end bg-white/95 backdrop-blur-sm border border-[#E6E2DC] rounded-[10px] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)] font-mono text-[11px]">
          <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-2 mb-3">
            <span className="text-[#8A8A8A] text-[9px] uppercase tracking-widest font-semibold">
              System Status
            </span>
            <span className="text-[9px] text-[#525252] bg-[#FAF7F3] border border-[#E6E2DC] px-1.5 py-0.5 rounded">
              BUILD / 07
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#0D0D0D] font-bold text-[12px]">AI Workspace</span>
              <span className="flex items-center gap-1.5 text-[#FF5A1F] text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
                Building... 87%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-[#FAF7F3] border border-[#EFEBE5] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF5A1F] rounded-full" style={{ width: "87%" }} />
            </div>
          </div>
        </div>

        {/* 2. CENTER LAYER: Dark Code Surface (~40% of visual area) */}
        <div className="relative z-10 w-full sm:-mt-6 bg-[#0D0D0D] border border-[#262626] rounded-[12px] p-4 sm:p-5 shadow-[0_24px_50px_rgba(0,0,0,0.22)] font-mono text-[11px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5656]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[#525252] text-[10px] ml-2 tracking-wider">
                components / workspace.tsx
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#22C55E] text-[9px] uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Syncing
            </div>
          </div>

          {/* Code snippet */}
          <div className="space-y-1 text-[11px] leading-[1.7] text-[#8A8A8A]">
            <div>
              <span className="text-[#6B9CEA]">export function</span>{" "}
              <span className="text-[#4EC9B0]">Workspace</span>() {"{"}
            </div>
            <div className="pl-4">
              <span className="text-[#6B9CEA]">const</span>{" "}
              <span className="text-[#9CDCFE]">session</span> ={" "}
              <span className="text-[#DCDAB6]">useSession</span>();
            </div>
            <div className="pl-4">
              <span className="text-[#6B9CEA]">return</span> (
            </div>
            <div className="pl-8">
              <span className="text-[#4EC9B0]">&lt;StudioLayout</span>{" "}
              <span className="text-[#9CDCFE]">pipeline</span>=
              <span className="text-[#CE9178]">&quot;active&quot;</span>{" "}
              <span className="text-[#9CDCFE]">ready</span>{" "}
              <span className="text-[#4EC9B0]">/&gt;</span>
            </div>
            <div className="pl-4">);</div>
            <div>
              {"}"}
              <span className="cursor-blink text-[#FF5A1F] ml-0.5" />
            </div>
          </div>
        </div>

        {/* 3. BOTTOM LAYER: Overlapping Component Node Matrix + Live Capsule */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-end gap-3 sm:-mt-6">
          {/* Component readiness box */}
          <div className="w-full sm:w-[310px] bg-white border border-[#E6E2DC] rounded-[10px] p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.08)] font-mono text-[10px]">
            <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-2 mb-2.5">
              <span className="text-[#8A8A8A] uppercase tracking-widest font-semibold">
                Components
              </span>
              <span className="text-[#525252] text-[9px]">v1.0.0</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#525252] flex items-center gap-1.5">
                  <span className="text-[#8A8A8A]">01</span> Auth System
                </span>
                <span className="text-[#22C55E] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  READY
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#525252] flex items-center gap-1.5">
                  <span className="text-[#8A8A8A]">02</span> Database
                </span>
                <span className="text-[#22C55E] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  CONNECTED
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#525252] flex items-center gap-1.5">
                  <span className="text-[#8A8A8A]">03</span> UI &amp; State
                </span>
                <span className="text-[#FF5A1F] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                  BUILDING
                </span>
              </div>
            </div>
          </div>

          {/* Micro Terminal Capsule */}
          <div className="hidden sm:inline-flex items-center gap-2 bg-[#0D0D0D] border border-[#262626] text-white px-3 py-2 rounded-[8px] shadow-[0_10px_25px_rgba(0,0,0,0.18)] font-mono text-[10px] whitespace-nowrap self-start sm:self-auto sm:mb-1">
            <span className="text-[#22C55E] font-bold">✓</span>
            <span className="text-[#8A8A8A]">Compiled in 2.1s</span>
            <span className="text-[#3A3A3A]">•</span>
            <span className="text-[#FF5A1F]">Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
}
