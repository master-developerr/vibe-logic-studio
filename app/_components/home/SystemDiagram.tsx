import ScrollReveal from "./ScrollReveal";

/**
 * SystemDiagram — "FROM ROUGH IDEA TO RUNNING SYSTEM."
 * Horizontal pipeline: THINK → SHAPE → BUILD → TEST → SHIP
 * Grid background visible in this section.
 */

const steps = [
  { num: "01", title: "THINK", desc: "Define the problem." },
  { num: "02", title: "SHAPE", desc: "Turn the idea into a usable system." },
  { num: "03", title: "BUILD", desc: "Write the actual thing." },
  { num: "04", title: "TEST", desc: "Break it. Fix it." },
  { num: "05", title: "SHIP", desc: "Put it in the world." },
];

export default function SystemDiagram() {
  return (
    <section className="py-24 border-b border-[#E6E2DC] overflow-hidden relative">
      {/* Section grid — used sparingly per design spec */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(90deg, #0D0D0D05 1px, transparent 1px)",
          backgroundSize: "80px 100%",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 relative z-10">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF5A1F] mb-3">The Process</p>
            <h2
              className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D]"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              FROM<br />
              ROUGH IDEA<br />
              TO RUNNING<br />
              SYSTEM.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Desktop horizontal */}
          <div className="hidden md:block relative">
            <div className="absolute top-[28px] left-[52px] right-[52px] h-[1px] bg-[#E6E2DC]" aria-hidden="true" />
            <div className="grid grid-cols-5 gap-0 relative z-10">
              {steps.map(({ num, title, desc }, i) => (
                <div key={num} className="flex flex-col items-center text-center group px-4">
                  <div className={`w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 mb-5 transition-all duration-200 ${
                    i === steps.length - 1
                      ? "border-[#FF5A1F] bg-[#FF5A1F] group-hover:shadow-[0_0_0_4px_rgba(255,90,31,0.2)]"
                      : "border-[#0D0D0D] bg-[#FAF7F3] group-hover:border-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:shadow-[0_0_0_4px_rgba(255,90,31,0.15)]"
                  }`} aria-hidden="true" />
                  <span className={`font-mono text-[10px] mb-2 ${i === steps.length - 1 ? "text-[#FF5A1F]" : "text-[#8A8A8A] group-hover:text-[#FF5A1F]"} transition-colors`}>
                    {num}
                  </span>
                  <h3 className={`font-bold text-[13px] tracking-[0.08em] mb-2 ${i === steps.length - 1 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>
                    {title}
                  </h3>
                  <p className="text-[11px] text-[#8A8A8A] leading-[1.5]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical */}
          <div className="md:hidden flex flex-col">
            <div className="relative pl-10">
              <div className="absolute left-[6px] top-4 bottom-4 w-[1px] bg-[#E6E2DC]" aria-hidden="true" />
              {steps.map(({ num, title, desc }, i) => (
                <div key={num} className="relative flex items-start gap-5 pb-8 last:pb-0">
                  <div className={`absolute -left-10 top-1 w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 ${
                    i === steps.length - 1
                      ? "border-[#FF5A1F] bg-[#FF5A1F]"
                      : "border-[#0D0D0D] bg-[#FAF7F3]"
                  }`} aria-hidden="true" />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[10px] text-[#8A8A8A]">{num}</span>
                      <h3 className={`font-bold text-[15px] tracking-[0.05em] ${i === steps.length - 1 ? "text-[#FF5A1F]" : "text-[#0D0D0D]"}`}>
                        {title}
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#8A8A8A] leading-[1.5]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
