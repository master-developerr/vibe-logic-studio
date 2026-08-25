import ScrollReveal from "./ScrollReveal";

/**
 * ProductShowcase — "WHAT YOU MAKE." section.
 * Two product UI previews: SaaS (light) and AI Product (dark).
 * Actual UI wireframes — not stock imagery.
 */
export default function ProductShowcase() {
  return (
    <section className="py-28 bg-white border-b border-[#E6E2DC]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8A8A] mb-3">Real Outputs</p>
            <h2
              className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D]"
              style={{ fontSize: "clamp(40px, 5vw, 60px)" }}
            >
              WHAT YOU MAKE.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SaaS Dashboard — Light UI */}
          <ScrollReveal delay={0}>
            <div className="group border border-[#E6E2DC] rounded-[10px] overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E2DC] bg-[#FAF7F3]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">SaaS App</span>
                <span className="font-mono text-[9px] text-[#8A8A8A]">Dashboard.tsx</span>
              </div>
              {/* UI wireframe */}
              <div className="bg-[#F8F6F2] p-4 h-[240px] flex">
                {/* Sidebar */}
                <div className="w-[60px] bg-[#0D0D0D] rounded-[6px] flex flex-col items-center py-4 gap-3 mr-4 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A1F]" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-5 h-5 rounded-[4px] ${i === 0 ? "bg-[#FF5A1F]/30" : "bg-[#333333]"}`} />
                  ))}
                </div>
                {/* Main content */}
                <div className="flex-1 flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 bg-[#E6E2DC] rounded" />
                    <div className="h-6 w-16 bg-[#FF5A1F] rounded-[4px]" />
                  </div>
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white border border-[#E6E2DC] rounded-[6px] p-2">
                        <div className="h-2 w-8 bg-[#E6E2DC] rounded mb-2" />
                        <div className={`h-4 w-12 rounded font-bold text-[10px] flex items-center ${i === 0 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>
                          {i === 0 ? "₹1.2k" : i === 1 ? "142" : "98%"}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Table */}
                  <div className="flex-1 bg-white border border-[#E6E2DC] rounded-[6px] overflow-hidden">
                    <div className="h-6 bg-[#F5F3EF] border-b border-[#E6E2DC] flex items-center px-3 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-2 bg-[#E6E2DC] rounded" style={{ width: `${[40, 28, 20, 24][i]}px` }} />
                      ))}
                    </div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-7 border-b border-[#F0EDE8] flex items-center px-3 gap-4">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className={`h-2 rounded ${j === 3 ? "bg-[#22C55E]/40" : "bg-[#E6E2DC]"}`} style={{ width: `${[40, 28, 20, 24][j]}px` }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* AI Product — Dark UI */}
          <ScrollReveal delay={80}>
            <div className="group border border-[#1E1E1E] rounded-[10px] overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1E] bg-[#0C0C0C]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">AI Product</span>
                <span className="font-mono text-[9px] text-[#525252]">ai-chat.tsx</span>
              </div>
              {/* Dark AI UI wireframe */}
              <div className="bg-[#111111] p-4 h-[240px] flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#FF5A1F]" />
                    <div className="h-2 w-16 bg-[#333333] rounded" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <div className="h-2 w-8 bg-[#333333] rounded" />
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                  <div className="flex justify-end">
                    <div className="bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 rounded-[8px] rounded-tr-[2px] px-3 py-2 max-w-[70%]">
                      <div className="h-2 w-28 bg-[#FF5A1F]/40 rounded mb-1.5" />
                      <div className="h-2 w-20 bg-[#FF5A1F]/30 rounded" />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] rounded-tl-[2px] px-3 py-2 max-w-[80%]">
                      <div className="h-2 w-32 bg-[#333333] rounded mb-1.5" />
                      <div className="h-2 w-24 bg-[#2A2A2A] rounded mb-1.5" />
                      <div className="h-2 w-20 bg-[#2A2A2A] rounded" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 rounded-[8px] rounded-tr-[2px] px-3 py-2 max-w-[50%]">
                      <div className="h-2 w-16 bg-[#FF5A1F]/40 rounded" />
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="flex items-center gap-2 border border-[#2A2A2A] rounded-[8px] px-3 py-2 bg-[#0D0D0D]">
                  <div className="flex-1 h-2 bg-[#1E1E1E] rounded" />
                  <div className="w-6 h-6 rounded-full bg-[#FF5A1F] flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-white rotate-45 -translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
