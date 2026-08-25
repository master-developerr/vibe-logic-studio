import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/**
 * CourseIndex — "WHAT'S IN THE STUDIO."
 * Eyebrow: THE CURRENT LINEUP
 * Studio index — not a marketplace. Editorial row treatment.
 */

const courses = [
  {
    num: "01",
    title: "Build Software with AI",
    desc: "Seven production-minded projects across modern web development, AI workflows, and practical product thinking.",
    status: "Enrolling Now",
    price: "₹999",
    href: "/build-software-with-ai#course-offer",
    active: true,
  },
  {
    num: "02",
    title: "Modern React Development",
    desc: "Component systems, state, architecture, and polished interfaces.",
    status: "Coming Soon",
    price: "",
    href: null,
    active: false,
  },
  {
    num: "03",
    title: "Build SaaS Products",
    desc: "From product idea to recurring revenue system.",
    status: "Coming Soon",
    price: "",
    href: null,
    active: false,
  },
  {
    num: "04",
    title: "AI Automation",
    desc: "Connect models, workflows, and useful work.",
    status: "Coming Soon",
    price: "",
    href: null,
    active: false,
  },
] as const;

export default function CourseIndex() {
  return (
    <section className="py-24 border-b border-[#E6E2DC]" id="courses">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8A8A] mb-3">The Current Lineup</p>
            <h2
              className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D]"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              WHAT&apos;S<br />
              IN THE STUDIO.
            </h2>
            <p className="mt-4 text-[15px] text-[#525252] leading-[1.65] max-w-[420px]">
              Start with one build. Follow the thread wherever it leads.
            </p>
          </div>
        </ScrollReveal>

        {/* List */}
        <div className="border-t border-[#0D0D0D]">
          {courses.map(({ num, title, desc, status, price, href, active }, i) => {
            const inner = (
              <div className={`flex flex-col md:flex-row md:items-center justify-between py-7 md:py-8 border-b border-[#E6E2DC] relative group ${active ? "course-row cursor-pointer" : "opacity-40"}`}>
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF5A1F] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" aria-hidden="true" />
                )}

                {/* Left */}
                <div className={`flex items-start md:items-center gap-6 ${active ? "pl-4" : ""} md:flex-1 ${active ? "group-hover:translate-x-2" : ""} transition-transform duration-200`}>
                  <span className={`font-mono text-[22px] md:text-[28px] font-bold flex-shrink-0 leading-none mt-0.5 md:mt-0 ${active ? "text-[#0D0D0D] group-hover:text-[#FF5A1F]" : "text-[#0D0D0D]"} transition-colors duration-200`}>
                    {num}
                  </span>
                  <div>
                    <h3 className="text-[17px] md:text-[20px] font-bold tracking-[-0.01em] text-[#0D0D0D] mb-1">
                      {title}
                    </h3>
                    <p className="text-[12px] md:text-[13px] text-[#8A8A8A] max-w-[400px] leading-[1.5]">{desc}</p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6 pl-12 mt-3 md:mt-0 md:pl-0">
                  {price && (
                    <span className="font-mono text-[14px] text-[#0D0D0D] font-semibold">{price}</span>
                  )}
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${active ? "text-[#22C55E]" : "text-[#8A8A8A]"}`}>
                    {status}
                  </span>
                  {active && (
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-[#0D0D0D] group-hover:text-[#FF5A1F] group-hover:translate-x-1 transition-all duration-200"
                      aria-hidden="true"
                    >
                      <path d="M4 12h15m-6-6 6 6-6 6" />
                    </svg>
                  )}
                </div>
              </div>
            );

            return (
              <ScrollReveal key={num} delay={i * 60}>
                {active && href ? (
                  <Link href={href} aria-label={`${title} — Enter the studio`}>
                    {inner}
                  </Link>
                ) : (
                  <div aria-label={`${title} — Coming Soon`}>
                    {inner}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
