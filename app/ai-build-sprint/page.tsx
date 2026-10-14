import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import ToolEcosystem from "./_components/ToolEcosystem";
import ProjectShowcase from "./_components/ProjectShowcase";
import CurriculumSection from "./_components/CurriculumSection";
import StudentOutcomes from "./_components/StudentOutcomes";
import PricingOffer from "./_components/PricingOffer";
import FAQ from "./_components/FAQ";
import FinalCTA from "./_components/FinalCTA";
import Footer from "./_components/Footer";

/**
 * Vibe Logic Studio — Course Landing Page: AI Build Sprint
 * Route: /ai-build-sprint
 *
 * Production Release:
 * - Real User Projects: Diligence Live, TicketLelo, Sherhan, KBG
 * - Interactive AI Building Workspace window & prompt spec editor
 * - Animated Editorial Typography with upward/downward letterform extensions
 * - High-performance horizontal tool marquee
 * - 7-day progressive curriculum timeline with phase tags & deliverables
 * - Unified ₹999 checkout: /checkout?courseSlug=ai-build-sprint
 */
export const metadata = {
  title: "Build Software with AI — Vibe Logic Studio",
  description:
    "Seven-day beginner AI-assisted coding bootcamp. Learn to turn ideas into published websites using modern AI tools and practical building.",
  keywords: [
    "AI Build Sprint",
    "Build software with AI",
    "AI coding bootcamp",
    "Next.js",
    "React",
    "Tailwind CSS",
    "web development for beginners",
  ],
  openGraph: {
    title: "Build Software with AI — Vibe Logic Studio",
    description: "Seven-day beginner AI-assisted coding bootcamp. Think it. Build it. Ship it.",
    type: "website",
  },
};

export default function AIBuildSprintCoursePage() {
  return (
    <div
      className="bg-[#F1EDE4] text-[#171717] min-h-screen selection:bg-[#FF5722] selection:text-white overflow-x-hidden antialiased"
      style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
    >
      {/* 01 — Navigation Bar */}
      <Navbar />

      <main id="main-content">
        {/* 02 — Hero Section: Outcome-first product preview */}
        <Hero />

        {/* 03 — Developer Tool Ecosystem: Real colorful logos & marquee */}
        <ToolEcosystem />

        {/* 04 — Project Showcase: Real Websites (TicketLelo, Diligence Live, KBG, Sherhan) */}
        <ProjectShowcase />

        {/* 05 — 7-Day Curriculum: Interactive timeline & daily milestones */}
        <CurriculumSection />

        {/* 08 — Student Outcomes & Social Proof: Live review demonstration & genuine reviews */}
        <StudentOutcomes />

        {/* 09 — Pricing & High-Conversion Offer: ₹999 launch offer */}
        <PricingOffer />

        {/* 10 — Frequently Asked Questions: Accessible accordion */}
        <FAQ />

        {/* 11 — Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 12 — Editorial Footer */}
      <Footer />
    </div>
  );
}
