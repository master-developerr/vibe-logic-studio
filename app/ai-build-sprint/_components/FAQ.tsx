"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Is the bootcamp suitable for complete beginners?",
    answer:
      "Yes. The entire curriculum is structured for learners with zero background in computer science or software engineering. We explain all concepts in straightforward terms and build progressively.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No previous coding experience is needed. You will learn to use modern AI development tools as your collaborative partner to generate, inspect, and refine code.",
  },
  {
    question: "Which tools will I use?",
    answer:
      "You will work with Visual Studio Code, modern AI coding tools (such as Gemini, Cursor, v0, and Google AI Studio), Git, GitHub, and Vercel for deployment, using React, Next.js, and Tailwind CSS for the web stack.",
  },
  {
    question: "What will I build?",
    answer:
      "You will build and refine a complete, multi-section business website with responsive mobile layouts, clean typography, interactive components, and working enquiry form handling.",
  },
  {
    question: "Will I publish a live website?",
    answer:
      "Yes. By the end of Module 07, your project will be pushed to GitHub and deployed live to a public URL on Vercel that you can share with clients, peers, or recruiters.",
  },
  {
    question: "How do recorded lessons and live sessions work?",
    answer:
      "The programme features 7 structured modules across 7 days, with 7 total hours of live instruction and unblocking sessions. Live sessions are held in the evening (IST), and every session is recorded in HD.",
  },
  {
    question: "How long can I access recordings?",
    answer:
      "You receive lifetime access to all recordings, code repositories, and starter templates through your Vibe Logic Studio student dashboard.",
  },
  {
    question: "What support is available?",
    answer:
      "You receive access to a dedicated cohort WhatsApp group where questions are answered in batches by instructors and mentors throughout the seven-day sprint.",
  },
  {
    question: "Are paid tools or a custom domain required?",
    answer:
      "No. All projects and exercises are built using generous free-tier tools, libraries, and hosting platforms (GitHub, Vercel, free model tiers). Optional custom domains (.com, .io) or paid subscriptions are completely optional.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "Refund requests are accommodated in accordance with our standard policy prior to the start of cohort orientation. If you need assistance with an enrolment, reach out to hello@vibelogic.studio.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#F1EDE4] border-b border-[#D7D0C4]" id="faq" aria-label="Frequently Asked Questions">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Heading & Help Note */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/80 text-[11px] font-mono uppercase tracking-widest text-[#5C5851] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
              <span>[06] // Clear Clarifications</span>
            </div>
            <h2 className="text-[34px] sm:text-[46px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05] mb-4">
              Frequently asked questions.
            </h2>
            <p className="text-[16px] text-[#5C5851] leading-relaxed mb-8 max-w-[65ch]">
              Everything you need to know about the format, prerequisites, tools, and schedule before enrolling.
            </p>

            <div className="bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] p-6 rounded-2xl w-full shadow-[0_2px_8px_-2px_rgba(23,23,23,0.06)]">
              <h4 className="font-bold text-[15px] text-[#171717] mb-1 tracking-tight">
                Have an unanswered question?
              </h4>
              <p className="text-[13px] text-[#5C5851] mb-4 leading-relaxed">
                Write to our team directly. We respond within a few hours.
              </p>
              <a
                href="mailto:hello@vibelogic.studio"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#FF5722] hover:underline active:scale-[0.98] transition-transform"
              >
                <span>hello@vibelogic.studio</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Accessible 10-Item Accordion */}
          <div className="lg:col-span-7 border-t border-[#D7D0C4]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-[#D7D0C4]">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full py-5 flex items-center justify-between text-left gap-4 hover:text-[#FF5722] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded cursor-pointer active:scale-[0.99]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span className="font-bold text-[16px] sm:text-[17px] text-[#171717] tracking-tight">
                      {faq.question}
                    </span>
                    <div className="w-7 h-7 rounded-full border border-[#D7D0C4] flex items-center justify-center text-[#171717] bg-white flex-shrink-0 shadow-2xs">
                      <span className={`text-[18px] font-light leading-none transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-45 text-[#FF5722]" : ""}`}>
                        +
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="pb-6 text-[14px] sm:text-[15px] text-[#5C5851] leading-relaxed pr-6 max-w-[65ch] animate-in fade-in duration-200"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
