"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

export default function EditorialTypography() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Bind animation to scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Spring physics configuration for responsive, weighted scrub
  const springConfig = { stiffness: 90, damping: 22, mass: 0.15 };

  // 1. Upper extension: grows UPWARD from 'I' in 'IMAGINE.' into the ivory section
  const rawUpperScaleY = useTransform(scrollYProgress, [0.10, 0.55], [0.1, 1]);
  const smoothUpperScaleY = useSpring(rawUpperScaleY, springConfig);

  // 2. Lower extension: grows DOWNWARD from 'P' in 'SHIP IT.' toward bottom boundary
  const rawLowerScaleY = useTransform(scrollYProgress, [0.20, 0.70], [0.08, 1]);
  const smoothLowerScaleY = useSpring(rawLowerScaleY, springConfig);

  // 3. Secondary parallax glide for the orange CTA bar
  const rawBarY = useTransform(scrollYProgress, [0.18, 0.75], [-25, 65]);
  const smoothBarY = useSpring(rawBarY, springConfig);

  // Reduced motion fallbacks: render full static extensions with zero motion
  const activeUpperScaleY = shouldReduceMotion ? 1 : smoothUpperScaleY;
  const activeLowerScaleY = shouldReduceMotion ? 1 : smoothLowerScaleY;
  const activeBarY = shouldReduceMotion ? 0 : smoothBarY;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0E0E0E] text-[#F1EDE4] py-20 sm:py-28 lg:py-36 overflow-visible z-20 border-b border-[#242424] select-none"
      aria-label="Editorial Statement — Imagine. Build with AI. Ship it."
      id="statement"
    >
      {/* Architectural subtle ambient background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Ambient radial ember glow centered behind the composition */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,87,34,0.08),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* ========================================================= */}
        {/* TOP METADATA ROW: Indented Index Label & Supporting Copy  */}
        {/* Indented left to provide an unobstructed vertical channel */}
        {/* for the upper extension stroke to soar into ivory section */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 sm:pb-12 border-b border-[#222222]">
          
          {/* Studio Index Label (Indented to clear the 'I' stroke corridor) */}
          <div className="pl-12 sm:pl-20 lg:pl-28 flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#888888] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span className="text-[#FF5722] font-semibold">01 / AI BUILD SPRINT</span>
            <span className="text-[#444444] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#777777]">MANIFESTO</span>
          </div>

          {/* Supporting Paragraph (Positioned Right, matching art direction) */}
          <div className="max-w-[42ch]">
            <p className="text-sm sm:text-[15px] text-[#A3A3A3] leading-relaxed font-sans font-normal">
              Seven days. Real projects. Go from an idea to a live website using modern AI tools.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN TYPOGRAPHIC COMPOSITION (3 INDEPENDENT LAYERS)        */}
        {/* Accessible screen reader announcement for entire heading  */}
        {/* ========================================================= */}
        <div
          className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-24 relative"
          role="heading"
          aria-level={2}
          aria-label="IMAGINE. BUILD WITH AI. SHIP IT."
        >
          
          {/* ------------------------------------------------------- */}
          {/* LINE 1: "IMAGINE." with scroll-growing upper extension   */}
          {/* ------------------------------------------------------- */}
          <div
            className="relative z-10 mb-2 sm:mb-3 flex items-baseline"
            aria-hidden="true"
          >
            <div className="flex items-baseline font-black tracking-[-0.04em] text-[13vw] sm:text-[11vw] lg:text-[10rem] leading-none text-[#F1EDE4]">
              
              {/* Custom SVG Glyph for 'I':
                  SVG height is exactly 0.95em (matching cap-height of MAGINE.).
                  Base stem sits on the baseline.
                  The scroll-animated upper stroke extends from y=0 upwards by 380 units,
                  soaring into the preceding ivory section with mix-blend-difference. */}
              <div className="relative inline-flex items-baseline mr-[0.03em] flex-shrink-0">
                <svg
                  viewBox="0 0 24 100"
                  className="inline-block fill-current overflow-visible flex-shrink-0"
                  style={{
                    width: "0.20em",
                    height: "0.95em",
                  }}
                  aria-hidden="true"
                >
                  {/* Base 'I' stem (cap-height 0 to baseline 100) */}
                  <rect x="0" y="0" width="24" height="100" fill="currentColor" />

                  {/* Scroll-animated UPPER EXTENSION (growing upward from y=0 to y=-380):
                      Crossing past the top border into the preceding ivory section.
                      Uses mix-blend-difference: off-white on black, inverts to black on ivory. */}
                  <motion.rect
                    x="0"
                    y="-380"
                    width="24"
                    height="380"
                    fill="currentColor"
                    className="mix-blend-difference will-change-transform"
                    style={{
                      scaleY: activeUpperScaleY,
                      transformOrigin: "0px 0px",
                    }}
                  />
                </svg>
              </div>

              <span className="flex-shrink-0">MAGINE.</span>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* LINE 2: SCROLL-LINKED PARALLAX ORANGE CTA BAR           */}
          {/* Moves vertically through the composition as user scrolls */}
          {/* ------------------------------------------------------- */}
          <motion.div
            style={{ y: activeBarY }}
            className="relative z-30 my-3 sm:my-4 lg:my-5 will-change-transform"
          >
            <div className="w-full sm:w-[92%] lg:w-[86%] bg-[#FF5722] text-white rounded-md sm:rounded-lg shadow-[0_16px_40px_rgba(255,87,34,0.32)] overflow-hidden">
              <Link
                href="/checkout?courseSlug=ai-build-sprint"
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-8 lg:px-10 py-3.5 sm:py-5 lg:py-6 transition-colors hover:bg-[#F4511E] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
                aria-label="Build with AI — Join the Bootcamp for ₹999"
              >
                {/* Left Text inside orange bar: "BUILD WITH AI" */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white/80 bg-black/20 px-2 py-0.5 rounded">
                    PHASE // 01
                  </span>
                  <span className="font-black tracking-tight text-xl sm:text-2xl lg:text-3xl uppercase text-white">
                    BUILD WITH AI
                  </span>
                </div>

                {/* Right Interactive Action Badge */}
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-black/25 px-4 py-2 rounded-md group-hover:bg-black/35 transition-all">
                  <span>Build with AI</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* ------------------------------------------------------- */}
          {/* LINE 3: "SHIP IT." with scroll-growing lower extension   */}
          {/* ------------------------------------------------------- */}
          <div
            className="relative z-20 mt-2 sm:mt-3 flex items-baseline"
            aria-hidden="true"
          >
            <div className="flex items-baseline font-black tracking-[-0.04em] text-[13vw] sm:text-[11vw] lg:text-[10rem] leading-none text-[#F1EDE4]">
              <span className="flex-shrink-0">SHI</span>

              {/* Custom SVG Glyph for Uppercase 'P':
                  SVG height is exactly 0.95em (matching cap-height and baseline of SHI and IT.).
                  Bowl is perfectly level with S, H, I, T.
                  The scroll-animated lower stroke extends from y=100 downwards by 320 units. */}
              <div className="relative inline-flex items-baseline ml-[0.01em] mr-[0.05em] flex-shrink-0">
                <svg
                  viewBox="0 0 84 100"
                  className="inline-block fill-current overflow-visible flex-shrink-0"
                  style={{
                    width: "0.78em",
                    height: "0.95em",
                  }}
                  aria-hidden="true"
                >
                  {/* Uppercase 'P' Bowl & Base Stem (from y=0 to y=100, sitting level with SHI and IT.) */}
                  <path
                    fillRule="evenodd"
                    d="M 0 0 H 50 C 72 0, 84 22, 84 50 C 84 78, 72 100, 50 100 H 22 V 100 H 0 Z M 22 22 H 48 C 60 22, 64 34, 64 50 C 64 66, 60 78, 48 78 H 22 Z"
                    fill="currentColor"
                  />

                  {/* Scroll-animated LOWER EXTENSION (growing downward from y=100 toward bottom boundary):
                      Continuously attached to the stem of 'P' with identical stem width (22). */}
                  <motion.rect
                    x="0"
                    y="100"
                    width="22"
                    height="320"
                    fill="currentColor"
                    className="will-change-transform"
                    style={{
                      scaleY: activeLowerScaleY,
                      transformOrigin: "0px 100px",
                    }}
                  />
                </svg>
              </div>

              <span className="flex-shrink-0 ml-[0.02em]">IT.</span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM METADATA BAR: Accurate Bootcamp Details & Indicator  */}
        {/* ========================================================= */}
        <div className="pt-8 sm:pt-10 border-t border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#888888] relative z-20">
          
          {/* Bottom-left: Accurate Bootcamp Offer details */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#22C55E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span>LIVE COHORT 01</span>
            </span>
            <span className="text-[#333333]">·</span>
            <span>7 DAYS</span>
            <span className="text-[#333333]">·</span>
            <span>7 MODULES</span>
            <span className="text-[#333333]">·</span>
            <span>7 LIVE HOURS</span>
            <span className="text-[#333333]">·</span>
            <span className="text-[#F1EDE4] font-semibold">LIFETIME ACCESS</span>
          </div>

          {/* Bottom-right: Restrained scroll indicator */}
          <div className="flex items-center gap-2 text-[#666666] uppercase tracking-wider text-[11px]">
            <span>SCROLL TO EXPLORE WORK</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
