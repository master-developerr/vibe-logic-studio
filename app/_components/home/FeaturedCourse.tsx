import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/**
 * FeaturedCourse — "START WITH ONE REAL BUILD."
 * Eyebrow: CURRENTLY IN THE STUDIO
 * Links to /build-software-with-ai — unchanged course landing page.
 */
export default function FeaturedCourse() {
  return (
    <section className="py-28 bg-white border-b border-[#E6E2DC]" id="courses">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        {/* Label */}
        <ScrollReveal>
          <div className="mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8A8A]">
              Currently in the Studio
            </p>
            <h2
              className="font-bold tracking-[-0.02em] leading-[1] text-[#0D0D0D] mt-3"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              START WITH<br />ONE REAL BUILD.
            </h2>
          </div>
        </ScrollReveal>

        {/* Course artifact */}
        <ScrollReveal delay={80}>
          <Link
            href="/build-software-with-ai#course-offer"
            className="group block border border-[#0D0D0D] bg-[#FAF7F3] hover:shadow-[8px_8px_0_#FF5A1F] transition-shadow duration-300"
            aria-label="Build Software with AI — Enter the course"
          >
            {/* Top bar */}
            <div className="flex items-center border-b border-[#0D0D0D]">
              <div className="px-5 py-3 border-r border-[#0D0D0D] font-mono text-[10px] uppercase tracking-widest text-[#525252] bg-white">
                Flagship
              </div>
              <div className="px-5 py-3 border-r border-[#0D0D0D] font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A]">
                v1.0.0
              </div>
              <div className="px-5 py-3 font-mono text-[10px] flex items-center gap-2 ml-auto text-[#22C55E]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                Enrolling Now
              </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">

              <div className="flex-1">
                <h3
                  className="font-bold tracking-[-0.03em] leading-[0.88] text-[#0D0D0D] mb-8"
                  style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
                >
                  BUILD<br />
                  SOFTWARE<br />
                  <span className="text-[#FF5A1F]">WITH AI.</span>
                </h3>

                <p className="text-[15px] text-[#525252] leading-[1.65] max-w-[440px] mb-8">
                  Seven practical builds covering the tools, systems, and decisions behind modern web software.
                </p>

                {/* Metadata */}
                <div className="font-mono text-[11px] flex flex-col gap-2 max-w-[200px]">
                  {[
                    { key: "PROJECTS", val: "07" },
                    { key: "LESSONS", val: "24+" },
                    { key: "PACE", val: "Self-paced" },
                    { key: "TUITION", val: "₹999" },
                  ].map(({ key, val }) => (
                    <div key={key} className="flex items-center justify-between border-b border-[#E6E2DC] pb-1.5 last:border-0">
                      <span className="text-[#8A8A8A]">{key}</span>
                      <strong className="text-[#0D0D0D]">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                <div 
                  className="inline-flex items-center gap-3 bg-[#0D0D0D] !text-white text-[12px] font-bold px-6 py-4 uppercase tracking-wider group-hover:bg-[#FF5A1F] group-hover:!text-white transition-colors duration-200"
                  style={{ color: "#FFFFFF" }}
                >
                  <span className="text-white" style={{ color: "#FFFFFF" }}>Enter the Course</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-0.5 transition-transform" style={{ stroke: "#FFFFFF" }} aria-hidden="true">
                    <path d="M4 12h15m-6-6 6 6-6 6" />
                  </svg>
                </div>
              </div>

            </div>
          </Link>
        </ScrollReveal>

      </div>
    </section>
  );
}
