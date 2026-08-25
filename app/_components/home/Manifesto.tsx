import ScrollReveal from "./ScrollReveal";

/**
 * Manifesto — Black background.
 * STOP CONSUMING. START MAKING.
 * Orange: START MAKING.
 */
export default function Manifesto() {
  const principles = [
    {
      title: "Less tutorial hopping.",
      desc: "Follow a path instead of collecting disconnected videos.",
    },
    {
      title: "More real work.",
      desc: "Projects force you to understand what actually matters.",
    },
    {
      title: "Better instincts.",
      desc: "Learn how experienced builders make decisions.",
    },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white py-36 border-b border-[#0D0D0D]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">

          {/* LEFT */}
          <ScrollReveal>
            <h2
              className="font-bold tracking-[-0.03em] leading-[0.9] text-white"
              style={{ fontSize: "clamp(60px, 8vw, 100px)" }}
            >
              STOP<br />
              CONSUMING.<br />
              <br />
              <span className="text-[#FF5A1F]">START<br />MAKING.</span>
            </h2>
          </ScrollReveal>

          {/* RIGHT */}
          <ScrollReveal delay={120}>
            <div className="flex flex-col gap-0">
              {principles.map(({ title, desc }, i) => (
                <div
                  key={title}
                  className="group border-t border-white/10 py-7 flex items-start gap-5 hover:border-white/20 transition-colors"
                >
                  <span className="text-[#FF5A1F] font-mono text-[11px] flex-shrink-0 mt-[2px]">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-[16px] md:text-[18px] font-semibold text-white/90 leading-[1.3] tracking-[-0.01em] mb-2 group-hover:text-white transition-colors uppercase">
                      {title}
                    </p>
                    <p className="text-[13px] text-white/40 leading-[1.6]">{desc}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10" />
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
