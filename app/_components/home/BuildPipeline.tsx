import ScrollReveal from "./ScrollReveal";

/**
 * BuildPipeline — "THE WORK IS NEVER ONE PASS."
 * Stages: OBSERVE → BUILD → BREAK → REFINE
 */

const stages = [
  {
    num: "01",
    title: "OBSERVE",
    desc: "Understand the problem before touching the interface.",
  },
  {
    num: "02",
    title: "BUILD",
    desc: "Make the smallest version that proves the idea.",
  },
  {
    num: "03",
    title: "BREAK",
    desc: "Find what doesn\u2019t hold.",
  },
  {
    num: "04",
    title: "REFINE",
    desc: "Turn rough work into something worth shipping.",
  },
];

export default function BuildPipeline() {
  return (
    <section className="py-24 border-b border-[#E6E2DC] bg-[#FAF7F3]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        <ScrollReveal>
          <div className="mb-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8A8A] mb-3">Studio Method</p>
            <h2
              className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D]"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              THE WORK<br />
              IS NEVER<br />
              ONE PASS.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          {/* Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-0 relative">
            <div className="absolute top-[22px] left-[12.5%] right-[12.5%] h-[1px] bg-[#E6E2DC]" aria-hidden="true" />
            {stages.map(({ num, title, desc }, i) => (
              <div key={num} className="flex flex-col items-center text-center group px-6 pipeline-node cursor-default">
                <div className={`w-[11px] h-[11px] rounded-full border-[2px] mb-6 relative z-10 transition-all duration-200 ${
                  i === stages.length - 1
                    ? "border-[#FF5A1F] bg-[#FF5A1F]"
                    : "border-[#0D0D0D] bg-[#FAF7F3] group-hover:border-[#FF5A1F] group-hover:bg-[#FF5A1F]"
                }`} aria-hidden="true" />
                <span className={`font-mono text-[11px] mb-2 ${i === stages.length - 1 ? "text-[#FF5A1F]" : "text-[#8A8A8A] group-hover:text-[#FF5A1F]"} transition-colors`}>
                  {num}
                </span>
                <h3 className={`font-bold text-[14px] tracking-[0.1em] mb-2 ${i === stages.length - 1 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>
                  {title}
                </h3>
                <p className="text-[12px] text-[#8A8A8A] leading-[1.5]">{desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-0 border-t border-[#E6E2DC]">
            {stages.map(({ num, title, desc }, i) => (
              <div key={num} className="flex items-start gap-5 py-6 border-b border-[#E6E2DC]">
                <span className={`font-mono text-[20px] font-bold flex-shrink-0 leading-none ${i === stages.length - 1 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>{num}</span>
                <div>
                  <h3 className={`font-bold text-[16px] tracking-[0.05em] mb-1 ${i === stages.length - 1 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>{title}</h3>
                  <p className="text-[13px] text-[#8A8A8A]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
