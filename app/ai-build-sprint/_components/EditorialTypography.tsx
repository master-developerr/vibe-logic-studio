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

  // Spring physics configuration for responsive, smooth scrub without jitter
  const springConfig = { stiffness: 100, damping: 24, mass: 0.12 };

  // 1. Upper extension: originates at top boundary divider (y = -34) and draws DOWNWARD to meet 'I' at y = 0
  const rawUpperHeight = useTransform(scrollYProgress, [0.06, 0.42], [6, 34]);
  const smoothUpperHeight = useSpring(rawUpperHeight, springConfig);

  // 2. Lower extension: originates at 'P' baseline (y = 100) and draws DOWNWARD toward bottom boundary divider (y = 136)
  const rawLowerHeight = useTransform(scrollYProgress, [0.16, 0.58], [6, 36]);
  const smoothLowerHeight = useSpring(rawLowerHeight, springConfig);

  // Reduced motion fallbacks: render full static extensions with zero motion
  const activeUpperHeight = shouldReduceMotion ? 34 : smoothUpperHeight;
  const activeLowerHeight = shouldReduceMotion ? 36 : smoothLowerHeight;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0E0E0E] text-[#F1EDE4] py-8 sm:py-12 lg:py-14 overflow-visible z-20 border-b border-[#242424] select-none"
      aria-label="Editorial Statement — Imagine. Build with AI. Ship."
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

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* ========================================================= */}
        {/* TOP METADATA ROW: Studio Manifesto Label & Supporting Copy */}
        {/* Strictly aligned to main content grid                      */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3.5 sm:pb-5 border-b border-[#222222]">
          
          {/* Studio Index Label */}
          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#888888] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span className="text-[#FF5722] font-semibold">01 / AI BUILD SPRINT</span>
            <span className="text-[#444444] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#777777]">MANIFESTO</span>
          </div>

          {/* Supporting Description */}
          <div className="max-w-[42ch]">
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-sans font-normal">
              Seven days. Real projects. Go from an idea to a live website using modern AI tools.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN TYPOGRAPHIC COMPOSITION                               */}
        {/* Compact, architectural, zero loose gaps                    */}
        {/* ========================================================= */}
        <div
          className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 relative flex flex-col justify-center"
          role="heading"
          aria-level={2}
          aria-label="IMAGINE. BUILD WITH AI. SHIP."
        >
          
          {/* ------------------------------------------------------- */}
          {/* LINE 1: "IMAGINE." with scroll-revealing upper stroke    */}
          {/* Stroke originates ABOVE and extends DOWNWARD to 'I'      */}
          {/* ------------------------------------------------------- */}
          <div
            className="relative z-10 flex items-baseline leading-none"
            aria-hidden="true"
          >
            <div className="flex items-baseline font-black tracking-[-0.04em] text-[12vw] sm:text-[10vw] lg:text-[7.5rem] xl:text-[8.5rem] leading-none text-[#F1EDE4]">
              
              {/* Custom SVG Glyph for 'I':
                  Cap-height sits from y=0 to baseline y=100 (matching MAGINE.).
                  The upper extension originates at top divider (y=-34) and
                  expands DOWNWARD with height to seamlessly connect to y=0. */}
              <div className="relative inline-flex items-baseline mr-[0.02em] flex-shrink-0">
                <svg
                  viewBox="0 0 20 100"
                  className="inline-block fill-current overflow-visible flex-shrink-0"
                  style={{
                    width: "0.17em",
                    height: "0.95em",
                  }}
                  aria-hidden="true"
                >
                  {/* Base 'I' stem (cap-height 0 to baseline 100) */}
                  <rect x="0" y="0" width="20" height="100" fill="currentColor" />

                  {/* Scroll-animated UPPER EXTENSION:
                      Locked at y=-34 (top boundary divider). Height grows DOWNWARD to reach y=0. */}
                  <motion.rect
                    x="0"
                    y="-34"
                    width="20"
                    height={activeUpperHeight}
                    fill="currentColor"
                  />
                </svg>
              </div>

              <span className="flex-shrink-0">MAGINE.</span>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* LINE 2: GROUNDED ORANGE EDITORIAL PHASE BAND             */}
          {/* Structurally integrated, clean horizontal divider        */}
          {/* ------------------------------------------------------- */}
          <div className="relative z-20 my-2 sm:my-2.5 lg:my-3 w-full">
            <div className="w-full bg-[#FF5722] text-white border-y border-[#FF7043]/30">
              <Link
                href="/checkout?courseSlug=ai-build-sprint"
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 transition-colors hover:bg-[#F4511E] active:bg-[#E64A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
                aria-label="Phase 01: Build with AI — Join the Bootcamp"
              >
                {/* Left: Phase indicator + Build with AI title */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white/90 bg-black/25 px-2.5 py-1 rounded-sm">
                    PHASE // 01
                  </span>
                  <span className="font-black tracking-tight text-lg sm:text-xl lg:text-2xl uppercase text-white">
                    BUILD WITH AI
                  </span>
                </div>

                {/* Right: Integrated Action Button */}
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-black/25 group-hover:bg-black/35 px-4 py-1.5 sm:py-2 rounded-sm transition-all">
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
          </div>

          {/* ------------------------------------------------------- */}
          {/* LINE 3: "SHIP." with scroll-revealing lower stroke       */}
          {/* Stroke originates from 'P' stem and extends DOWNWARD     */}
          {/* ------------------------------------------------------- */}
          <div
            className="relative z-10 flex items-baseline leading-none"
            aria-hidden="true"
          >
            <div className="flex items-baseline font-black tracking-[-0.04em] text-[12vw] sm:text-[10vw] lg:text-[7.5rem] xl:text-[8.5rem] leading-none text-[#F1EDE4]">
              <span className="flex-shrink-0">SHI</span>

              {/* Custom SVG Glyph for Uppercase 'P':
                  Height is exactly 0.95em (matching SHI and '.').
                  Left stem x=0 to x=20.
                  The scroll-animated lower stroke originates at baseline y=100
                  and extends DOWNWARD toward the bottom boundary divider. */}
              <div className="relative inline-flex items-baseline ml-[0.01em] flex-shrink-0">
                <svg
                  viewBox="0 0 84 100"
                  className="inline-block fill-current overflow-visible flex-shrink-0"
                  style={{
                    width: "0.78em",
                    height: "0.95em",
                  }}
                  aria-hidden="true"
                >
                  {/* Uppercase 'P' Bowl & Base Stem */}
                  <path
                    fillRule="evenodd"
                    d="M 0 0 H 50 C 72 0, 84 22, 84 50 C 84 78, 72 100, 50 100 H 20 V 100 H 0 Z M 20 20 H 48 C 60 20, 64 34, 64 50 C 64 66, 60 80, 48 80 H 20 Z"
                    fill="currentColor"
                  />

                  {/* Scroll-animated LOWER EXTENSION:
                      Locked at y=100 (baseline of 'P'). Height grows DOWNWARD. */}
                  <motion.rect
                    x="0"
                    y="100"
                    width="20"
                    height={activeLowerHeight}
                    fill="currentColor"
                  />
                </svg>
              </div>

              <span className="flex-shrink-0">.</span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM METADATA BAR: Accurate Bootcamp Details & Indicator  */}
        {/* Strictly aligned to grid                                  */}
        {/* ========================================================= */}
        <div className="pt-4 sm:pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#888888] relative z-20">
          
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

