import Link from "next/link";

const inclusions = [
  "7 days of structured, step-by-step learning",
  "7 core curriculum modules from setup to publishing",
  "7 total hours of live instruction and unblocking sessions",
  "High-definition lesson recordings with lifetime access",
  "Cohort WhatsApp community with questions answered in batches",
  "Build and deploy a complete, responsive business website",
  "Mobile-first responsive design and enquiry form handling",
  "GitHub version control basics and one-click Vercel deployment",
  "Introductory SEO meta tags, social share cards, and analytics",
  "Vibe Logic Studio Certificate of Completion upon finishing",
];

export default function PricingOffer() {
  return (
    <section className="py-24 bg-[#F1EDE4] border-b border-[#D7D0C4]" id="pricing" aria-label="Pricing and Enrolment Offer">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/80 text-[11px] font-mono uppercase tracking-widest text-[#FF5722] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span>[05] // Investment Architecture</span>
          </div>
          <h2 className="text-[36px] sm:text-[50px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05]">
            One simple price. Full access.
          </h2>
          <p className="text-[17px] text-[#5C5851] mt-3 leading-relaxed max-w-[65ch] mx-auto">
            Everything you need to turn an idea into a published website using modern AI tools. No hidden fees or recurring subscriptions.
          </p>
        </div>

        {/* High-Contrast Offer Card */}
        <div className="max-w-[960px] mx-auto bg-[#171717] text-white rounded-2xl border border-[#2E2E2E] ring-1 ring-white/10 shadow-[0_24px_64px_rgba(23,23,23,0.35)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: What's Included */}
            <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-[#2E2E2E]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#A3A3A3]">
                  Enrolling for Upcoming Cohort
                </span>
              </div>

              <h3 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-tight mb-2">
                Build Software with AI
              </h3>
              <p className="text-[14px] text-[#A3A3A3] mb-8 leading-relaxed max-w-[65ch]">
                Seven-day beginner coding bootcamp designed for complete novices, students, founders, and career switchers.
              </p>

              <div className="space-y-3.5">
                {inclusions.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-[14px] text-[#E5E5E5]">
                    <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Price & Enrolment CTA */}
            <div className="lg:col-span-5 p-8 sm:p-12 bg-[#1C1C1C] flex flex-col justify-between">
              
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#A3A3A3]">
                  Total Enrolment Fee
                </span>
                
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[52px] sm:text-[60px] font-bold text-white tracking-tight leading-none tabular-nums font-mono">
                    ₹999
                  </span>
                  <span className="text-[14px] text-[#A3A3A3] font-mono">
                    one-time
                  </span>
                </div>

                <div className="mt-2 text-[12px] text-[#22C55E] flex items-center gap-1.5 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Includes all 7 days & lifetime recordings</span>
                </div>

                {/* Dominant Enrolment CTA */}
                <div className="mt-8">
                  <Link
                    href="/checkout?courseSlug=ai-build-sprint"
                    className="w-full inline-flex items-center justify-between gap-3 bg-[#FF5722] hover:bg-[#e64b17] active:scale-[0.98] text-white font-bold text-[16px] pl-6 pr-3 py-4 rounded-xl shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
                  >
                    <span>Join the Bootcamp — ₹999</span>
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </span>
                  </Link>

                  <p className="text-center font-mono text-[11px] text-[#737373] mt-3">
                    Instant access link · Secured by Razorpay
                  </p>
                </div>
              </div>

              {/* Tool Cost Transparency & Refund Clarification */}
              <div className="mt-8 pt-6 border-t border-[#2E2E2E] text-[12px] text-[#A3A3A3] space-y-2">
                <p>
                  <strong className="text-white">Tooling Cost:</strong> We teach using free-tier tools and hosting (GitHub, Vercel, free model tiers). Optional custom domains or third-party paid subscriptions are not required.
                </p>
                <p>
                  <strong className="text-white">Refund Policy:</strong> Requests are processed in accordance with our standard refund policy prior to batch orientation. Contact support anytime.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
