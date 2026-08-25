"use client";

/**
 * Lab — "THE LAB. WHERE IDEAS BECOME SYSTEMS."
 * Dark studio environment. Realistic code editor.
 * Section id="lab" for the hero CTA anchor.
 */
export default function Lab() {
  return (
    <section className="py-28 bg-[#0D0D0D] border-b border-[#0D0D0D]" id="lab">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        {/* Section header */}
        <div className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#525252] mb-3">
            Studio Environment
          </p>
          <h2
            className="font-bold tracking-[-0.025em] leading-[0.95] text-white"
            style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
          >
            THE LAB.
          </h2>
          <h3
            className="font-bold tracking-[-0.025em] leading-[0.95] text-white mt-1"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
          >
            WHERE IDEAS<br />
            <span className="text-[#FF5A1F]">BECOME SYSTEMS.</span>
          </h3>
          <p className="text-[#525252] text-[15px] mt-4 max-w-[400px] leading-[1.6]">
            An evolving collection of experiments, builds, interfaces, and engineering problems.
          </p>
        </div>

        {/* Editor window */}
        <div className="border border-[#2A2A2A] rounded-[12px] overflow-hidden bg-[#111111] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row font-mono text-[11px] md:text-[12px] min-h-[500px]">

            {/* Sidebar */}
            <div className="w-full md:w-60 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-[#1E1E1E] bg-[#0C0C0C] flex flex-col">
              <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF5A1F]" aria-hidden="true" />
                <span className="text-[#525252] text-[10px] uppercase tracking-widest">VIBELOGIC / LAB</span>
              </div>
              <div className="px-4 py-3 border-b border-[#1E1E1E]">
                <span className="text-[#8A8A8A] text-[9px] uppercase tracking-[0.15em]">Projects</span>
              </div>
              <div className="flex flex-col">
                {[
                  { num: "01", name: "Portfolio", icon: "□", active: false },
                  { num: "02", name: "SaaS Dashboard", icon: "◈", active: true },
                  { num: "03", name: "AI Workspace", icon: "◆", active: false },
                  { num: "04", name: "Auth System", icon: "○", active: false },
                ].map(({ num, name, icon, active }) => (
                  <div
                    key={num}
                    className={`flex items-center gap-3 px-4 py-3 cursor-default transition-colors ${
                      active
                        ? "bg-[#FF5A1F]/8 border-l-2 border-[#FF5A1F] text-[#FF5A1F]"
                        : "border-l-2 border-transparent text-[#525252] hover:text-[#8A8A8A] hover:bg-[#141414]"
                    }`}
                  >
                    <span className="text-[10px] flex-shrink-0" aria-hidden="true">{icon}</span>
                    <span className="text-[10px]">{num} {name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto px-4 py-3 border-t border-[#1E1E1E] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                <span className="text-[#525252] text-[9px] uppercase tracking-widest">Build Passing</span>
              </div>
            </div>

            {/* Main editor area */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* Tab bar */}
              <div className="flex items-center border-b border-[#1E1E1E] bg-[#0C0C0C]">
                {[
                  { name: "page.tsx", active: true },
                  { name: "schema.ts", active: false },
                  { name: "convex/auth.ts", active: false },
                ].map(({ name, active }) => (
                  <div
                    key={name}
                    className={`px-4 py-3 border-r border-[#1E1E1E] text-[11px] flex-shrink-0 cursor-default ${
                      active
                        ? "bg-[#111111] text-white border-t-2 border-t-[#FF5A1F]"
                        : "text-[#525252] hover:text-[#8A8A8A]"
                    }`}
                  >
                    {name}
                  </div>
                ))}
                <div className="ml-auto px-4 py-3 flex items-center gap-2 text-[#22C55E] text-[10px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                  Build Passing
                </div>
              </div>

              {/* Code area */}
              <div className="flex-1 p-0 overflow-hidden bg-[#111111]">
                <div className="flex h-full">
                  {/* Line numbers */}
                  <div className="flex flex-col items-end pr-4 pl-4 pt-5 text-[#3A3A3A] text-[11px] leading-[1.8] select-none flex-shrink-0 bg-[#0E0E0E] border-r border-[#1A1A1A]" aria-hidden="true">
                    {Array.from({ length: 16 }, (_, i) => (
                      <span key={i + 1}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Code content */}
                  <div className="p-5 text-[11px] leading-[1.8] overflow-x-auto flex-1">
                    <div><span className="text-[#6B9CEA]">import</span> <span className="text-[#A8D4A8]">{"{"}</span> <span className="text-[#DCDCDC]">useQuery</span> <span className="text-[#A8D4A8]">{"}"}</span> <span className="text-[#6B9CEA]">from</span> <span className="text-[#CE9178]">&quot;convex/react&quot;</span><span className="text-[#A8D4A8]">;</span></div>
                    <div><span className="text-[#6B9CEA]">import</span> <span className="text-[#A8D4A8]">{"{"}</span> <span className="text-[#DCDCDC]">api</span> <span className="text-[#A8D4A8]">{"}"}</span> <span className="text-[#6B9CEA]">from</span> <span className="text-[#CE9178]">&quot;@/convex/_generated/api&quot;</span><span className="text-[#A8D4A8]">;</span></div>
                    <div>&nbsp;</div>
                    <div><span className="text-[#6B9CEA]">export default function</span> <span className="text-[#DCDAB6]">Workspace</span><span className="text-[#A8D4A8]">() {"{"}</span></div>
                    <div>&nbsp;&nbsp;<span className="text-[#6B9CEA]">const</span> <span className="text-[#9CDCFE]">session</span> <span className="text-[#A8D4A8]">=</span> <span className="text-[#DCDAB6]">useQuery</span><span className="text-[#A8D4A8]">(</span><span className="text-[#9CDCFE]">api</span><span className="text-[#A8D4A8]">.</span><span className="text-[#DCDAB6]">sessions</span><span className="text-[#A8D4A8]">.</span><span className="text-[#DCDAB6]">active</span><span className="text-[#A8D4A8]">);</span></div>
                    <div>&nbsp;&nbsp;<span className="text-[#6B9CEA]">const</span> <span className="text-[#9CDCFE]">user</span> <span className="text-[#A8D4A8]">=</span> <span className="text-[#DCDAB6]">useUser</span><span className="text-[#A8D4A8]">();</span></div>
                    <div>&nbsp;</div>
                    <div>&nbsp;&nbsp;<span className="text-[#6B9CEA]">if</span> <span className="text-[#A8D4A8]">(!</span><span className="text-[#9CDCFE]">user</span><span className="text-[#A8D4A8]">.</span><span className="text-[#9CDCFE]">isSignedIn</span><span className="text-[#A8D4A8]">)</span> <span className="text-[#6B9CEA]">return</span> <span className="text-[#DCDAB6]">redirect</span><span className="text-[#A8D4A8]">(</span><span className="text-[#CE9178]">&quot;/sign-in&quot;</span><span className="text-[#A8D4A8]">);</span></div>
                    <div>&nbsp;</div>
                    <div>&nbsp;&nbsp;<span className="text-[#6B9CEA]">return</span> <span className="text-[#A8D4A8]">(</span></div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4EC9B0]">&lt;StudioLayout&gt;</span></div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4EC9B0]">&lt;ProjectList</span> <span className="text-[#9CDCFE]">session</span><span className="text-[#A8D4A8]">={"{"}session{"}"}</span> <span className="text-[#A8D4A8]">/&gt;</span></div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4EC9B0]">&lt;BuildConsole</span> <span className="text-[#9CDCFE]">userId</span><span className="text-[#A8D4A8]">={"{"}user.id{"}"}</span> <span className="text-[#A8D4A8]">/&gt;</span></div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4EC9B0]">&lt;/StudioLayout&gt;</span></div>
                    <div>&nbsp;&nbsp;<span className="text-[#A8D4A8]">);</span><span className="cursor-blink text-[#FF5A1F] ml-0.5" aria-hidden="true" /></div>
                    <div><span className="text-[#A8D4A8]">{"}"}</span></div>
                  </div>
                </div>
              </div>

              {/* Terminal */}
              <div className="border-t border-[#1E1E1E] bg-[#0A0A0A] p-4 h-[130px] overflow-hidden">
                <div className="text-[11px] text-[#525252] space-y-1">
                  <div className="terminal-line text-[#8A8A8A]"><span className="text-[#FF5A1F]">❯</span> npm run build</div>
                  <div className="terminal-line text-[#525252]">&gt; vibelogic-studio@1.0.0 build</div>
                  <div className="terminal-line text-[#525252]">&gt; next build</div>
                  <div className="terminal-line"><span className="text-white">▲ Next.js 15.x</span></div>
                  <div className="terminal-line"><span className="text-[#22C55E]">✓ Compiled successfully in 4.2s</span></div>
                  <div className="terminal-line text-[#525252]">&nbsp;&nbsp;34 pages — <span className="text-[#22C55E]">done</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
