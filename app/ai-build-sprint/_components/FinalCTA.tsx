import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-28 bg-[#171717] text-white relative overflow-hidden border-b border-[#2E2E2E]" aria-label="Final Call to Action">
      {/* Subtle Warm Grid Backing */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 select-none"
        style={{
          backgroundImage: "linear-gradient(#333333 1px, transparent 1px), linear-gradient(90deg, #333333 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#333333] bg-[#222222]/80 text-[11px] font-mono uppercase tracking-widest text-[#FF5722] mb-5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
          <span>[07] // Commence The Sprint</span>
        </div>

        {/* Oversized Headline */}
        <h2 className="text-[44px] sm:text-[64px] lg:text-[76px] font-bold tracking-[-0.035em] [text-wrap:balance] text-white leading-[1.02] max-w-[900px] mx-auto mb-6">
          Your ideas deserve to be{" "}
          <span className="text-[#FF5722]">built.</span>
        </h2>

        <p className="text-[17px] sm:text-[19px] text-[#A3A3A3] max-w-[65ch] mx-auto mb-10 leading-relaxed">
          Stop staring at blank idea lists or endless tutorial playlists. Spend the next seven days building and publishing a real website with AI.
        </p>

        {/* Action Button & Price Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-[500px] mx-auto">
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3.5 bg-[#FF5722] hover:bg-[#e64b17] text-white font-bold text-[16px] pl-8 pr-3 py-4 rounded-xl shadow-[0_12px_32px_rgba(255,87,34,0.3)] transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
          >
            <span>Join the Bootcamp — ₹999</span>
            <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </Link>

          <Link
            href="#curriculum"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#404040] hover:border-white text-[#E5E5E5] hover:text-white font-medium text-[15px] px-6 py-4 rounded-xl active:scale-[0.98] transition-all duration-150"
          >
            <span>Review 7 Modules</span>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[12px] font-mono text-[#737373]">
          <span>7 modules across 7 days</span>
          <span>·</span>
          <span>7 total hours of live instruction</span>
          <span>·</span>
          <span>Lifetime recording access</span>
        </div>

      </div>
    </section>
  );
}
