import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/**
 * FinalCTA — "MAKE SOMETHING WORTH KEEPING."
 * Orange: WORTH KEEPING.
 * Left-aligned, enormous type, black background.
 */
export default function FinalCTA() {
  return (
    <section className="bg-[#0D0D0D] py-40 relative overflow-hidden">
      {/* Subtle orange radial glow at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 110%, rgba(255,90,31,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Corner annotations — studio detail */}
      <div className="absolute top-8 left-8 font-mono text-[10px] text-white/15" aria-hidden="true">
        Studio / 01
      </div>
      <div className="absolute top-8 right-8 font-mono text-[10px] text-white/15" aria-hidden="true">
        Version 01.0
      </div>
      <div className="absolute bottom-8 left-8 font-mono text-[10px] text-white/15" aria-hidden="true">
        System / Online
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-white/15" aria-hidden="true">
        Build / Passing
      </div>

      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 relative z-10 flex flex-col items-start">
        <ScrollReveal>
          <h2
            className="font-bold tracking-[-0.03em] leading-[0.88] text-white mb-6"
            style={{ fontSize: "clamp(56px, 8.5vw, 108px)" }}
          >
            MAKE<br />
            SOMETHING<br />
            <span className="text-[#FF5A1F]">WORTH<br />KEEPING.</span>
          </h2>
          <p className="text-[15px] text-white/35 font-mono tracking-[0.04em] mb-12 leading-[1.6]">
            Start with a problem.<br />End with something that works.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/build-software-with-ai#course-offer"
              className="inline-flex items-center gap-3 bg-white text-[#0D0D0D] text-[12px] font-bold px-7 py-4 uppercase tracking-wider hover:bg-[#FF5A1F] hover:text-white active:scale-[0.97] transition-all duration-200 group"
            >
              Explore the Studio
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="#courses"
              className="text-[12px] font-semibold text-white/40 hover:text-white/70 transition-colors uppercase tracking-wider underline underline-offset-4 decoration-white/15"
            >
              View Courses →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
