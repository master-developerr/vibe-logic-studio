"use client";

import { TechIcon } from "./TechIcons";

const technologies = [
  { name: "React", label: "React" },
  { name: "Next.js", label: "Next.js" },
  { name: "TypeScript", label: "TypeScript" },
  { name: "JavaScript", label: "JavaScript" },
  { name: "HTML5", label: "HTML5" },
  { name: "CSS3", label: "Tailwind CSS" },
  { name: "Python", label: "Python" },
  { name: "Cursor", label: "Cursor AI" },
  { name: "Gemini", label: "Google Gemini" },
  { name: "GitHub", label: "GitHub" },
  { name: "Vercel", label: "Vercel" },
  { name: "Convex", label: "Convex" },
  { name: "Supabase", label: "Supabase" },
  { name: "Firebase", label: "Firebase" },
  { name: "Figma", label: "Figma" },
  { name: "Visual Studio Code", label: "VS Code" },
  { name: "Vite", label: "Vite" },
  { name: "Cloudflare", label: "Cloudflare" },
  { name: "Postman", label: "Postman" },
];

export default function ToolEcosystem() {
  return (
    <section
      className="py-14 sm:py-16 bg-[#F1EDE4] border-b border-[#D7D0C4] overflow-hidden"
      id="ecosystem"
      aria-label="Developer Tool Ecosystem"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/70 text-xs font-mono uppercase tracking-widest text-[#5C5851] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            INDUSTRY-STANDARD TOOLS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Built with the real tools of the trade.
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-2 max-w-[540px]">
            Hands-on development using authentic production engineering frameworks and modern AI tooling.
          </p>
        </div>

        {/* Dynamic Continuous Horizontal Logo Marquee */}
        <div className="relative w-full overflow-hidden bg-white/70 border border-[#D7D0C4] rounded-2xl py-4 sm:py-5 px-4 shadow-xs">
          {/* Edge fade gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F1EDE4] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F1EDE4] to-transparent z-10" />

          <div className="flex w-max gap-6 sm:gap-8 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {[...technologies, ...technologies].map((tool, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-[#D7D0C4]/70 text-xs sm:text-sm font-semibold text-[#171717] whitespace-nowrap shadow-xs hover:border-[#FF5722]/50 hover:bg-white transition-all cursor-default"
                aria-hidden={idx >= technologies.length ? "true" : undefined}
              >
                <TechIcon name={tool.name} className="w-5 h-5 flex-shrink-0" />
                <span>{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
