import ScrollReveal from "./ScrollReveal";

/**
 * WorkIndex — "THE KIND OF WORK WE LIKE."
 * Replaces ProductShowcase.
 * Editorial numbered horizontal list — not cards.
 * Hover: number → orange, row shifts, arrow appears, desc darkens.
 */

const works = [
  {
    num: "01",
    title: "Product Systems",
    desc: "Dashboards, workflows, internal tools.",
  },
  {
    num: "02",
    title: "AI Applications",
    desc: "Interfaces around models that people can actually use.",
  },
  {
    num: "03",
    title: "Web Experiences",
    desc: "Fast, expressive, carefully considered.",
  },
  {
    num: "04",
    title: "Automation",
    desc: "Software that removes repetitive work.",
  },
];

export default function WorkIndex() {
  return (
    <section className="py-28 bg-white border-b border-[#E6E2DC]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-16 max-w-[640px]">
            <h2
              className="font-bold tracking-[-0.03em] leading-[0.9] text-[#0D0D0D]"
              style={{ fontSize: "clamp(48px, 6.5vw, 84px)" }}
            >
              THE KIND<br />
              OF <span className="text-[#FF5A1F]">WORK</span><br />
              WE LIKE.
            </h2>
            <p className="mt-6 text-[16px] text-[#525252] leading-[1.65]">
              Useful things. Strange ideas. Interfaces that feel obvious only after
              someone has spent the time getting them right.
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial list — not cards */}
        <div className="border-t border-[#0D0D0D]">
          {works.map(({ num, title, desc }, i) => (
            <ScrollReveal key={num} delay={i * 50}>
              <div className="border-b border-[#E6E2DC] group flex items-center justify-between py-7 md:py-9 cursor-default relative transition-colors hover:bg-[#FAFAF8]">
                {/* Orange left accent — appears on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF5A1F] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" aria-hidden="true" />

                <div className="flex items-start md:items-center gap-6 md:gap-10 pl-4 group-hover:translate-x-2 transition-transform duration-200">
                  {/* Number */}
                  <span
                    className="font-mono text-[28px] md:text-[36px] font-bold leading-none flex-shrink-0 text-[#E6E2DC] group-hover:text-[#FF5A1F] transition-colors duration-200"
                  >
                    {num}
                  </span>

                  {/* Title + desc */}
                  <div>
                    <h3 className="text-[18px] md:text-[22px] font-bold tracking-[-0.01em] text-[#0D0D0D] mb-1">
                      {title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#8A8A8A] group-hover:text-[#525252] transition-colors duration-200">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Arrow — appears on hover */}
                <div className="flex-shrink-0 pr-4 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5A1F]" aria-hidden="true">
                    <path d="M4 12h15m-6-6 6 6-6 6" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
