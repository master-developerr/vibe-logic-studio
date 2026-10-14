"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Project = {
  id: string;
  name: string;
  shortName: string;
  displayUrl: string;
  url: string;
  description: string;
  category: string;
  supportsEmbed: boolean;
  screenshot: string;
};

const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 800;

const realProjects: Project[] = [
  {
    id: "diligence",
    name: "Diligence Live",
    shortName: "Diligence",
    displayUrl: "diligencelive.com",
    url: "https://www.diligencelive.com/",
    description: "Corporate and professional advisory platform engineered for institutional governance and compliance.",
    category: "Corporate & Professional Advisory",
    supportsEmbed: false,
    screenshot: "/projects/diligencelive.png",
  },
  {
    id: "ticketlelo",
    name: "TicketLelo",
    shortName: "TicketLelo",
    displayUrl: "ticketlelo.in",
    url: "https://www.ticketlelo.in/",
    description: "Event ticketing and smart digital admission platform with live seat and ticket tier inventory.",
    category: "Event Tech & Booking Platform",
    supportsEmbed: true,
    screenshot: "/projects/ticketlelo.png",
  },
  {
    id: "kbg",
    name: "KBG Advisory",
    shortName: "KBG",
    displayUrl: "kbg-new.vercel.app",
    url: "https://kbg-new.vercel.app/",
    description: "Financial and strategic advisory portal presenting multi-disciplinary practice areas and client consultation funnels.",
    category: "Financial & Strategic Advisory",
    supportsEmbed: true,
    screenshot: "/projects/kbg.png",
  },
  {
    id: "sherhan",
    name: "Sherhan Portfolio",
    shortName: "Sherhan",
    displayUrl: "sherhan.site",
    url: "https://sherhan.site/",
    description: "Creative direction and personal brand showcasing dark editorial aesthetics and curated case studies.",
    category: "Creative Direction & Personal Brand",
    supportsEmbed: true,
    screenshot: "/projects/sherhan.png",
  },
];

export default function ProjectShowcase() {
  const [activeId, setActiveId] = useState<string>("diligence");
  const [viewMode, setViewMode] = useState<"live" | "snapshot">("snapshot");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);

  const current = realProjects.find((p) => p.id === activeId) || realProjects[0];

  // Dynamically calculate uniform scale from available container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setScale(width / DESKTOP_WIDTH);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  const handleSelect = (project: Project) => {
    setActiveId(project.id);
    if (project.supportsEmbed) {
      setViewMode("live");
      setIsLoading(true);
    } else {
      setViewMode("snapshot");
      setIsLoading(false);
    }
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-[#171717] text-[#F1EDE4] border-b border-[#333333] relative overflow-hidden"
      id="showcase"
      aria-label="Selected Work & Project Showcase"
    >
      {/* Ambient warm radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,87,34,0.08),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle architectural background grid line */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Two-column layout: Left Editorial (38%) + Right Browser & Buttons (62%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: Editorial Introduction & Dynamic Project Info  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Small Section Label */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5722]">
                  SELECTED WORK / 2026
                </span>
              </div>

              {/* Main Headline with highlighted phrase */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.035em] [text-wrap:balance] leading-[1.08] mb-4">
                Real projects.<br />
                Real websites.<br />
                <span className="text-[#FF5722]">Actually shipped.</span>
              </h2>

              {/* Supporting Text */}
              <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-[46ch] mb-8">
                Explore digital products, business websites, and online experiences built for real-world use.
              </p>

              {/* Small, Understated Project Count and Production Status */}
              <div className="pt-6 border-t border-[#2A2A2A] mb-8">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-mono text-xs text-[#888888] tracking-wider uppercase">
                    04 PROJECTS SHIPPED
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#22C55E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>PRODUCTION VERIFIED</span>
                  </div>
                </div>

                {/* Subtle Miniature Progression */}
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#666666] py-1.5 px-3 rounded-md bg-[#161616] border border-[#262626]">
                  <span className="text-[#A3A3A3]">IDEA</span>
                  <span>→</span>
                  <span className="text-[#A3A3A3]">BUILD</span>
                  <span>→</span>
                  <span className="text-[#FF5722] font-semibold">SHIP</span>
                </div>
              </div>
            </div>

            {/* Selected Project Dynamic Metadata Area */}
            <div className="pt-6 border-t border-[#2A2A2A] mt-4 lg:mt-0">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {current.name}
                </h3>
                <span className="font-mono text-xs text-[#FF5722]">
                  {current.displayUrl}
                </span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed mb-3.5">
                {current.description}
              </p>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5722] hover:text-[#FFA07A] transition-colors group"
              >
                <span>Open full website</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Single Selector Row DIRECTLY ABOVE Browser    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            
            {/* The ONLY Project Selector: Horizontal Row Directly Above Browser */}
            <div
              className="flex items-center gap-2 mb-3.5 overflow-x-auto pb-1 scrollbar-none"
              role="tablist"
              aria-label="Select Project"
            >
              {realProjects.map((p) => {
                const isSelected = p.id === activeId;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    id={`project-tab-${p.id}`}
                    aria-selected={isSelected}
                    aria-controls={`project-panel-${p.id}`}
                    type="button"
                    onClick={() => handleSelect(p)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap flex-shrink-0 border ${
                      isSelected
                        ? "bg-[#242424] text-white border-[#FF5722] shadow-[0_0_0_1px_rgba(255,87,34,0.35)]"
                        : "bg-[#1A1A1A] text-[#888888] border-[#2A2A2A] hover:text-white hover:bg-[#202020] hover:border-[#383838]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.supportsEmbed ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                      }`}
                      title={
                        p.supportsEmbed
                          ? "Interactive live preview available"
                          : "Origin framing protected: Verified snapshot + external link"
                      }
                    />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Concentric Double-Bezel Browser Mockup Chassis */}
            <div className="w-full bg-[#1A1A1A] p-2 sm:p-2.5 rounded-2xl sm:rounded-[22px] border border-[#2D2D2D] ring-1 ring-white/10 shadow-[0_24px_56px_rgba(0,0,0,0.4)]">
              {/* Persistent Desktop Browser Mockup Window */}
              <div
                className="w-full bg-[#202020] rounded-xl sm:rounded-[14px] border border-[#333333] overflow-hidden shadow-2xl flex flex-col"
                id={`project-panel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`project-tab-${current.id}`}
              >
                {/* Refined Dark Browser Header */}
                <div className="bg-[#191919] px-4 py-2.5 border-b border-[#2D2D2D] flex items-center justify-between gap-3 text-xs">
                {/* 3 Window-Control Dots & Project Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                  </div>
                  <span className="text-xs font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                    {current.name}
                  </span>
                </div>

                {/* Compact Address Bar */}
                <div className="flex items-center gap-1.5 bg-[#121212] px-3 py-1 rounded-md border border-[#2B2B2B] text-xs font-mono text-[#A3A3A3] truncate max-w-[240px] sm:max-w-[280px] w-full justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0 text-[#22C55E]"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="truncate">{current.displayUrl}</span>
                  <span className="hidden sm:inline-block text-[#555555] text-xs">• 1280×800</span>
                </div>

                {/* Universal Mode Switcher & Direct External Link Icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center bg-[#121212] p-0.5 rounded-md border border-[#2B2B2B] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("live");
                        if (current.supportsEmbed) setIsLoading(true);
                      }}
                      className={`px-2.5 py-0.5 rounded transition-colors ${
                        viewMode === "live"
                          ? "bg-[#FF5722] text-white font-semibold"
                          : "text-[#737373] hover:text-white"
                      }`}
                    >
                      Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("snapshot")}
                      className={`px-2.5 py-0.5 rounded transition-colors ${
                        viewMode === "snapshot"
                          ? "bg-[#FF5722] text-white font-semibold"
                          : "text-[#737373] hover:text-white"
                      }`}
                    >
                      Snapshot
                    </button>
                  </div>

                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${current.name} in new tab`}
                    aria-label={`Open ${current.name} in new tab`}
                    className="p-1 text-[#888888] hover:text-white transition-colors"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Scaled Desktop Viewport Wrapper (Fixed internal 1280 CSS px × 800 CSS px) */}
              <div
                ref={containerRef}
                className="relative w-full bg-[#0E0E0E] overflow-hidden"
                style={{
                  height: scale > 0 ? `${Math.round(DESKTOP_HEIGHT * scale)}px` : "430px",
                }}
              >
                {/* Loading indicator for live embed */}
                {current.supportsEmbed && viewMode === "live" && isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#141414] z-20 text-[#888888] text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-[#FF5722] border-t-transparent animate-spin" />
                      <span>Loading desktop session for {current.displayUrl}...</span>
                    </div>
                  </div>
                )}

                {/* Fixed 1280x800 desktop canvas uniformly scaled down */}
                <div
                  style={{
                    width: `${DESKTOP_WIDTH}px`,
                    height: `${DESKTOP_HEIGHT}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  {current.supportsEmbed && viewMode === "live" ? (
                    <iframe
                      key={current.id}
                      src={current.url}
                      title={`${current.name} Desktop Live Preview`}
                      style={{
                        width: "1280px",
                        height: "800px",
                        border: 0,
                        backgroundColor: "#ffffff",
                      }}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      loading="lazy"
                      onLoad={() => setIsLoading(false)}
                    />
                  ) : !current.supportsEmbed && viewMode === "live" ? (
                    /* Truthful, informative view when Live is toggled on an origin that disallows framing */
                    <div className="w-[1280px] h-[800px] flex flex-col items-center justify-center bg-[#141414] p-12 text-center select-none">
                      <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center mb-5 shadow-lg">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202020] border border-[#333333] text-xs font-mono text-[#F59E0B] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        <span>ORIGIN SECURITY POLICY • X-FRAME-OPTIONS: DENY</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">
                        Live Embedding Restricted by {current.displayUrl}
                      </h4>
                      <p className="text-sm text-[#A3A3A3] max-w-lg mb-8 leading-relaxed">
                        The production server for {current.displayUrl} sends strict{" "}
                        <code className="text-[#F1EDE4] bg-[#222222] px-1.5 py-0.5 rounded font-mono text-xs">
                          X-Frame-Options: DENY
                        </code>{" "}
                        headers. In compliance with browser security, external iframes cannot render this domain.
                        You can view the authentic 1280×800 desktop snapshot or open the live site in a new tab.
                      </p>
                      <div className="flex items-center gap-3">
                        <a
                          href={current.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] text-white text-xs font-semibold hover:bg-[#e64b17] transition-all shadow-md group"
                        >
                          <span>Open {current.displayUrl} in New Tab</span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                        <button
                          type="button"
                          onClick={() => setViewMode("snapshot")}
                          className="px-5 py-2.5 rounded-lg bg-[#222222] text-[#D4D4D4] border border-[#3A3A3A] text-xs font-semibold hover:text-white hover:bg-[#2A2A2A] transition-colors"
                        >
                          View Verified Snapshot
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Desktop Snapshot View */
                    <div className="w-[1280px] h-[800px] overflow-y-auto bg-[#0E0E0E]">
                      <Image
                        src={current.screenshot}
                        alt={`${current.name} genuine production desktop screenshot`}
                        width={1280}
                        height={800}
                        className="w-[1280px] h-auto object-top object-cover"
                        priority={current.id === "diligence"}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Refined Bottom Metadata Strip */}
              <div className="px-4 py-2.5 bg-[#171717] border-t border-[#292929] flex items-center justify-between text-xs text-[#888888]">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      current.supportsEmbed ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                    }`}
                  />
                  <span className="font-mono truncate">{current.category}</span>
                </div>
                <span className="font-mono text-[#666666] shrink-0">
                  {current.supportsEmbed && viewMode === "live"
                    ? "Interactive Live Preview (1280×800 Desktop)"
                    : !current.supportsEmbed && viewMode === "live"
                    ? "Live Embedding Restricted by Origin (X-Frame-Options: DENY)"
                    : "Verified Production Snapshot (1280×800 Desktop)"}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-browser helper note */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-[#737373] px-1 font-mono">
              <span>{current.displayUrl}</span>
              <span>
                {current.supportsEmbed
                  ? "1280px Desktop Viewport"
                  : viewMode === "live"
                  ? "Origin Framing Restricted • Direct Link Ready"
                  : "Framing Protected by Origin (X-Frame-Options: DENY)"}
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
