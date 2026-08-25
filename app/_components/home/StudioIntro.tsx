import ScrollReveal from "./ScrollReveal";

/**
 * StudioIntro — "THE STUDIO HAS A DIFFERENT RHYTHM."
 * Eyebrow: HOW WE WORK
 * Three principles: THINK IN SYSTEMS / MAKE THE THING / SHIP, THEN IMPROVE
 */
export default function StudioIntro() {
  const principles = [
    {
      num: "01",
      title: "Think in systems.",
      desc: "Understand why the pieces fit together.",
    },
    {
      num: "02",
      title: "Make the thing.",
      desc: "Move from explanation to implementation.",
    },
    {
      num: "03",
      title: "Ship, then improve.",
      desc: "Real work gets better through iteration.",
    },
  ];

  return (
    <section className="py-28 border-b border-[#E6E2DC]" id="about">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

          {/* LEFT */}
          <ScrollReveal>
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF5A1F] mb-6">
                How We Work
              </p>
              <h2
                className="font-bold tracking-[-0.03em] leading-[0.92] text-[#0D0D0D]"
                style={{ fontSize: "clamp(44px, 5.5vw, 72px)" }}
              >
                THE STUDIO<br />
                HAS A<br />
                DIFFERENT<br />
                RHYTHM.
              </h2>
              <p className="mt-6 text-[16px] text-[#525252] leading-[1.65] max-w-[400px]">
                We don&apos;t separate thinking from making.
                You learn the tools, understand the system,
                and then put both to work.
              </p>
            </div>
          </ScrollReveal>

          {/* RIGHT */}
          <div className="flex flex-col gap-0">
            {principles.map(({ num, title, desc }, i) => (
              <ScrollReveal key={num} delay={i * 80}>
                <div className="border-t border-[#E6E2DC] py-8 group">
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-[12px] text-[#FF5A1F] flex-shrink-0 mt-[3px]">{num}</span>
                    <div>
                      <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0D0D0D] mb-2 group-hover:text-[#FF5A1F] transition-colors duration-200">
                        {title}
                      </h3>
                      <p className="text-[14px] text-[#525252] leading-[1.6]">{desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
            <div className="border-t border-[#E6E2DC]" />
          </div>

        </div>
      </div>
    </section>
  );
}
