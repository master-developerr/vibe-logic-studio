import Link from "next/link";

const verifiedTestimonials = [
  {
    name: "Mira Nair",
    role: "BBA Student · First-time builder",
    initials: "MN",
    content:
      "I expected a course full of theoretical lectures. Instead, I opened an editor on day one and had a live, responsive portfolio piece I was proud to share by the weekend.",
  },
  {
    name: "Nikhil Thomas",
    role: "Career Switcher · Business analyst",
    initials: "NT",
    content:
      "The structure made modern development feel practical instead of overwhelming. I finally understand how modern apps are put together without getting stuck in syntax weeds.",
  },
  {
    name: "Aditya Rao",
    role: "Freelance Designer · Studio founder",
    initials: "AR",
    content:
      "The AI workflow made the hard parts approachable. The mentor guidance helped me turn a good-looking design into an interface that actually works and responds cleanly.",
  },
];

export default function StudentOutcomes() {
  return (
    <section className="py-24 bg-[#F1EDE4] border-b border-[#D7D0C4]" id="outcomes" aria-label="Teaching Approach & Outcomes">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-[760px] mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/80 text-[11px] font-mono uppercase tracking-widest text-[#FF5722] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span>[04] // Evidence & Standards</span>
          </div>
          <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05]">
            Built on genuine clarity, not hype.
          </h2>
          <p className="text-[16px] text-[#5C5851] mt-3 leading-relaxed max-w-[65ch]">
            We don’t make exaggerated promises about six-figure salaries or instant mastery. We focus on teaching beginners how to think like builders, leverage AI responsibly, and ship real websites.
          </p>
        </div>

        {/* Asymmetric Composition: Left Instructor Walkthrough Demonstration + Right Verified Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left: Instructor Live Review Demonstration Artifact */}
          <div className="lg:col-span-5 bg-[#171717] text-white rounded-2xl p-6 sm:p-8 border border-[#2E2E2E] ring-1 ring-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.35)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#A3A3A3]">
                    Live Unblocking Method
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#737373]">Cohort 01 Session</span>
              </div>

              <h3 className="font-bold text-[20px] text-white tracking-tight mb-2">
                Real code reviews. Real unblocking.
              </h3>
              <p className="text-[13px] text-[#A3A3A3] leading-relaxed mb-6 max-w-[65ch]">
                During daily live sessions, students share their screens or repository links. Mentors debug CSS layout issues, API edge cases, and Vercel build errors in real time.
              </p>

              {/* Terminal Code Snippet Demonstration */}
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#262626] ring-1 ring-inset ring-white/5 font-mono text-[11px] space-y-1.5 text-[#E5E5E5]">
                <div className="text-[#737373]">{"// Live Instructor Terminal Demonstration"}</div>
                <div className="text-[#22C55E]">✓ Vercel build output: Success (2.1s)</div>
                <div className="text-[#38BDF8]">ℹ Route: /solstice-ceramics (SSR Static)</div>
                <div className="text-[#FBBF24]">⚠ Mentor note: Adjusted touch target to 44px</div>
                <div className="text-[#22C55E]">✦ Ready for student portfolio showcase</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2E2E2E] flex items-center justify-between text-[11px] font-mono text-[#A3A3A3]">
              <span>7 Total Live Hours</span>
              <span className="text-[#FF5722] font-semibold">Every session recorded in HD</span>
            </div>
          </div>

          {/* Right: Verified Student Feedback Stack */}
          <div className="lg:col-span-7 space-y-4">
            {verifiedTestimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_-2px_rgba(23,23,23,0.05)] hover:border-[#171717]/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div className="flex items-center gap-1 text-[#FF5722] mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <p className="text-[15px] text-[#171717] leading-relaxed italic mb-4">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-[#F1EDE4]">
                  <div className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-[#171717] leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#5C5851]">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Quality Guarantee Strip */}
        <div className="bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_2px_10px_-2px_rgba(23,23,23,0.06)]">
          <div>
            <h4 className="font-bold text-[17px] text-[#171717] tracking-tight">
              Missed a live class? Catch up anytime.
            </h4>
            <p className="text-[13px] text-[#5C5851] mt-1 max-w-[65ch]">
              Every live session is automatically uploaded with chapter timestamps and starter code links to your learning portal.
            </p>
          </div>
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            className="inline-flex items-center gap-3 bg-[#FF5722] hover:bg-[#e64b17] active:scale-[0.98] text-white font-bold text-[14px] pl-6 pr-2.5 py-3 rounded-xl shadow-md transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
          >
            <span>Enroll for ₹999</span>
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
