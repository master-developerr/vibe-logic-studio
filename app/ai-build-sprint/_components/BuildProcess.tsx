"use client";

import { useState } from "react";

const processSteps = [
  {
    step: "01",
    phase: "Idea",
    title: "Client Project Brief",
    summary: "Frame the project requirements, audience, and functional specifications clearly.",
    deliverable: "Project Brief & Architecture Spec",
    mockup: (
      <div className="bg-white rounded-xl p-4 border border-[#D7D0C4] shadow-xs text-[11px] font-mono text-[#171717] space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D8] text-[10px] text-[#737373]">
          <span>SPEC // BRIEF_01.TXT</span>
          <span className="text-[#FF5722] font-bold">SCOPED</span>
        </div>
        <p className="font-bold text-[12px] font-sans text-[#171717]">
          &quot;Solstice Studio — Artisanal pottery showcase with mobile ordering & enquiry form.&quot;
        </p>
        <div className="text-[10px] text-[#5C5851] space-y-1">
          <div>• Target: Mobile & desktop buyers</div>
          <div>• Pages: Hero, Gallery, Order Form, FAQ</div>
          <div>• Integrations: WhatsApp enquiry redirect</div>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    phase: "Interface",
    title: "Visual Wireframe & Layout",
    summary: "Establish typographic scale, grid columns, and mobile-first container boundaries.",
    deliverable: "High-Fidelity Wireframe",
    mockup: (
      <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#D7D0C4] shadow-xs text-[11px] space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E3D8]">
          <span className="font-mono text-[10px] text-[#737373]">LayoutWireframe.fig</span>
          <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" />
        </div>
        <div className="h-4 bg-[#E5E0D8] rounded w-2/3" />
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className="h-10 bg-white rounded border border-[#E5E0D8]" />
          <div className="h-10 bg-white rounded border border-[#E5E0D8]" />
          <div className="h-10 bg-white rounded border border-[#E5E0D8]" />
        </div>
      </div>
    ),
  },
  {
    step: "03",
    phase: "Build",
    title: "AI-Assisted Code Synthesis",
    summary: "Generate clean React components, manage dynamic state, and apply Tailwind CSS utilities.",
    deliverable: "Modular React Components",
    mockup: (
      <div className="bg-[#171717] rounded-xl p-4 border border-[#333333] shadow-xs text-[10px] font-mono text-[#E5E5E5] space-y-1.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#2E2E2E] text-[9px] text-[#A3A3A3]">
          <span className="text-[#FF5722]">app/components/OrderForm.tsx</span>
          <span>100% TS Strict</span>
        </div>
        <div className="text-[#A3A3A3]">&lt;<span className="text-[#3ECF8E]">form</span> onSubmit=&#123;handleSubmit&#125;&gt;</div>
        <div className="pl-3 text-[#A3A3A3]">&lt;<span className="text-[#38BDF8]">input</span> className=&quot;rounded-lg px-4&quot; /&gt;</div>
        <div className="pl-3 text-[#A3A3A3]">&lt;<span className="text-[#FBBF24]">Button</span> variant=&quot;primary&quot;&gt;Submit&lt;/<span className="text-[#FBBF24]">Button</span>&gt;</div>
        <div className="text-[#A3A3A3]">&lt;/<span className="text-[#3ECF8E]">form</span>&gt;</div>
      </div>
    ),
  },
  {
    step: "04",
    phase: "Test",
    title: "Responsive & Performance Audit",
    summary: "Audit mobile viewport widths, fix layout shifts, and ensure screen-reader accessibility.",
    deliverable: "Cross-Device Verification",
    mockup: (
      <div className="bg-white rounded-xl p-4 border border-[#D7D0C4] shadow-xs text-[11px] font-mono space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-[#E8E3D8] text-[10px]">
          <span className="text-[#22C55E] font-bold">✓ VIEWPORT TEST MATRIX</span>
          <span className="text-[#737373]">PASS</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#171717]">
          <span>Mobile (390px iOS)</span>
          <span className="text-[#22C55E]">Zero overflow</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#171717]">
          <span>Tablet (768px iPad)</span>
          <span className="text-[#22C55E]">Grid aligned</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#171717]">
          <span>Desktop (1440px)</span>
          <span className="text-[#22C55E]">Contained 1280px</span>
        </div>
      </div>
    ),
  },
  {
    step: "05",
    phase: "Publish",
    title: "Live Edge Deployment",
    summary: "Push to GitHub, trigger Vercel edge deployment, and broadcast your production URL.",
    deliverable: "Live Production URL",
    mockup: (
      <div className="bg-[#171717] rounded-xl p-4 border border-[#333333] shadow-xs text-[11px] font-mono text-white space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-[#2E2E2E] text-[10px]">
          <span className="text-[#22C55E] font-bold">● Vercel Edge Global</span>
          <span className="text-[#A3A3A3]">200 OK</span>
        </div>
        <div className="text-[10px] text-[#A3A3A3] truncate">
          https://solstice-studio.vercel.app
        </div>
        <div className="bg-[#22C55E]/15 text-[#22C55E] text-[9px] px-2 py-0.5 rounded w-max font-bold">
          SSL CERTIFICATE ACTIVE · LIVE
        </div>
      </div>
    ),
  },
];

export default function BuildProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-[#FAF8F5] border-b border-[#D7D0C4]" id="process" aria-label="Project Building Process">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="max-w-[700px] mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7D0C4] bg-white/90 text-[11px] font-mono uppercase tracking-widest text-[#FF5722] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            <span>[02] // Synthesis Architecture</span>
          </div>
          <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-0.03em] [text-wrap:balance] text-[#171717] leading-[1.05]">
            How an idea becomes a live website.
          </h2>
          <p className="text-[16px] text-[#5C5851] mt-3 leading-relaxed max-w-[65ch]">
            Follow the five-step connected sequence that turns an abstract concept into a published, high-performance web application.
          </p>
        </div>

        {/* 5-Step Process Track (Desktop Horizontal / Mobile Stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {processSteps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#171717] text-white border-[#171717] shadow-lg ring-1 ring-white/10 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#FF5722]"
                    : "bg-white text-[#171717] border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] hover:border-[#171717]/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#FF5722]">
                      {step.step}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? "text-[#A3A3A3]" : "text-[#737373]"}`}>
                      {step.phase}
                    </span>
                  </div>
                  <h3 className={`font-bold text-[14px] leading-tight ${isSelected ? "text-white" : "text-[#171717]"}`}>
                    {step.title}
                  </h3>
                </div>

                <div className={`mt-4 pt-2 border-t text-[10px] font-mono truncate ${isSelected ? "border-[#333333] text-[#A3A3A3]" : "border-[#E8E3D8] text-[#737373]"}`}>
                  {step.deliverable}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Spotlight Panel */}
        <div className="bg-white border border-[#D7D0C4] ring-1 ring-inset ring-black/[0.04] rounded-2xl p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(23,23,23,0.06),0_1px_4px_-1px_rgba(23,23,23,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF5722] font-semibold">
                Step {processSteps[activeStep].step} of 05 — {processSteps[activeStep].phase} Phase
              </span>
              <h3 className="text-[26px] sm:text-[34px] font-bold text-[#171717] tracking-tight mt-1 mb-3">
                {processSteps[activeStep].title}
              </h3>
              <p className="text-[15px] text-[#5C5851] leading-relaxed mb-6 max-w-[65ch]">
                {processSteps[activeStep].summary}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D7D0C4] text-[12px] font-mono text-[#171717] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span>Deliverable: <strong>{processSteps[activeStep].deliverable}</strong></span>
              </div>
            </div>

            <div className="lg:col-span-6">
              {processSteps[activeStep].mockup}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
