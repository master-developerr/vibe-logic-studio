import Navbar from "./_components/home/Navbar";
import Hero from "./_components/home/Hero";
import MetricsStrip from "./_components/home/MetricsStrip";
import StudioIntro from "./_components/home/StudioIntro";
import Manifesto from "./_components/home/Manifesto";
import SystemDiagram from "./_components/home/SystemDiagram";
import FeaturedCourse from "./_components/home/FeaturedCourse";
import Lab from "./_components/home/Lab";
import BuildPipeline from "./_components/home/BuildPipeline";
import WorkIndex from "./_components/home/WorkIndex";
import CourseIndex from "./_components/home/CourseIndex";
import BrandStatement from "./_components/home/BrandStatement";
import FAQ from "./_components/home/FAQ";
import FinalCTA from "./_components/home/FinalCTA";
import Footer from "./_components/home/Footer";

/**
 * VibeLogic Studio — Public Homepage
 * Route: /
 *
 * Static marketing page (○ in build output).
 * Does NOT fetch from Convex or require authentication.
 * All CTAs link to the existing course at /build-software-with-ai.
 * No duplicate routes, no duplicate course entities.
 *
 * Section map:
 * 01 Navigation
 * 02 Hero — WE MAKE SOFTWARE MAKERS.
 * 03 Metrics — 07 BUILDS / 24+ LESSONS / 04 SYSTEMS / ₹999 FROM
 * 04 StudioIntro — THE STUDIO HAS A DIFFERENT RHYTHM.
 * 05 Manifesto — STOP CONSUMING. START MAKING.
 * 06 SystemDiagram — FROM ROUGH IDEA TO RUNNING SYSTEM.
 * 07 FeaturedCourse — START WITH ONE REAL BUILD.
 * 08 Lab — THE LAB. WHERE IDEAS BECOME SYSTEMS.
 * 09 BuildPipeline — THE WORK IS NEVER ONE PASS.
 * 10 WorkIndex — THE KIND OF WORK WE LIKE.
 * 11 CourseIndex — WHAT'S IN THE STUDIO.
 * 12 BrandStatement — WE DON'T HAND YOU ANSWERS. WE GIVE YOU THE WORK.
 * 13 FAQ — BEFORE YOU START.
 * 14 FinalCTA — MAKE SOMETHING WORTH KEEPING.
 * 15 Footer
 */
export const metadata = {
  title: "VibeLogic Studio — We make software makers.",
  description:
    "A practical space for learning how modern software actually gets designed, built, shipped, and improved.",
  keywords: [
    "software studio",
    "build software with AI",
    "software development",
    "VibeLogic Studio",
    "practical software learning",
    "Next.js",
    "AI development",
  ],
  openGraph: {
    title: "VibeLogic Studio — We make software makers.",
    description:
      "Projects over lectures. Systems over shortcuts.",
    type: "website",
  },
};

export default function VibeLogicStudioHome() {
  return (
    <div
      className="bg-[#FAF7F3] text-[#0D0D0D] min-h-screen selection:bg-[#FF5A1F] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
    >
      {/* 01 — Navigation */}
      <Navbar />

      {/* 02 — Hero: WE MAKE SOFTWARE MAKERS. */}
      <Hero />

      {/* 03 — Metrics strip */}
      <MetricsStrip />

      {/* 04 — THE STUDIO HAS A DIFFERENT RHYTHM. */}
      <StudioIntro />

      {/* 05 — STOP CONSUMING. START MAKING. */}
      <Manifesto />

      {/* 06 — FROM ROUGH IDEA TO RUNNING SYSTEM. */}
      <SystemDiagram />

      {/* 07 — START WITH ONE REAL BUILD. */}
      <FeaturedCourse />

      {/* 08 — THE LAB. WHERE IDEAS BECOME SYSTEMS. */}
      <Lab />

      {/* 09 — THE WORK IS NEVER ONE PASS. */}
      <BuildPipeline />

      {/* 10 — THE KIND OF WORK WE LIKE. */}
      <WorkIndex />

      {/* 11 — WHAT'S IN THE STUDIO. */}
      <CourseIndex />

      {/* 12 — WE DON'T HAND YOU ANSWERS. WE GIVE YOU THE WORK. */}
      <BrandStatement />

      {/* 13 — BEFORE YOU START. */}
      <FAQ />

      {/* 14 — MAKE SOMETHING WORTH KEEPING. */}
      <FinalCTA />

      {/* 15 — Footer */}
      <Footer />
    </div>
  );
}
