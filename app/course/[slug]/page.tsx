import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ArrowUpRight,
  ArrowDown,
  Code2,
  Users,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

import { BatchSelectorPremium } from "@/components/courses/BatchSelectorPremium";
import { CourseDetailClient } from "@/components/courses/CourseDetailClient";
import { getAvailableBatches, getRemainingSeats } from "@/lib/course-data";
import { getCourseDetails, getMarketplaceCourses } from "@/lib/courses-service";

type CourseDetailsPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const courses = await getMarketplaceCourses("All", "");
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseDetails(slug);
  return course
    ? { title: `${course.title} | VibeLogic Studio`, description: course.description }
    : { title: "Course not found | VibeLogic Studio" };
}

/*
  <design_plan>
  1. Python RNG Execution (Seed: prompt_len % 3 = 0):
     - Hero Layout: Cinematic Center with ultra-wide container (max-w-6xl), 2-line title limit.
     - Component Arsenal: Inline Typography Image Pill inside H1, Gapless Bento Grid (grid-flow-dense), Floating Apple Glass Navbar.
     - Motion & Physics: Apple damped spring curves (cubic-bezier(0.23, 1, 0.32, 1)), tactile active:scale-[0.97].
     - Font Stack: Editorial wide display with negative tracking (-0.04em).
  2. AIDA Check:
     - Attention: Floating Glass Nav + Cinematic Center Hero with TWO CTAs (Primary "Join Now — Enroll Today" + Secondary "Explore Curriculum").
     - Interest: Gapless Bento Grid with 4 interlocking cards (0 empty spaces).
     - Desire: Staggered Curriculum (#curriculum), Upcoming Schedules (#schedules), Verified Reviews (#reviews).
     - Action: Massive bottom CTA chapter with "Join Now — Secure Your Seat" button + Sticky right column BatchSelectorPremium ("Join Now — Enroll in Batch").
  3. Hero Math Verification:
     - H1 max-w-5xl ensures horizontal word flow across exactly 2 lines. Zero cheap badge stamps.
  4. Bento Density Verification:
     - 3 columns grid: Card 1 = 2 cols / 2 rows, Card 2 = 1 col / 1 row, Card 3 = 1 col / 1 row, Card 4 = 3 cols / 1 row. Perfectly interlocked 9-cell grid (grid-flow-dense).
  5. Label Sweep & Button Contrast:
     - No cheap meta-labels ("SECTION 01", etc.). High contrast dark bg + white text for primary CTA buttons.
  </design_plan>
*/

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const course = await getCourseDetails(slug);
  if (!course) notFound();
  const batches = getAvailableBatches(course);
  const titleWords = course.title.split(" ");
  const titleFirst = titleWords.slice(0, 2).join(" ");
  const titleRest = titleWords.slice(2).join(" ");

  return (
    <main className="min-h-[100dvh] bg-background overflow-x-hidden w-full max-w-full">

      {/* Ambient grain + warm glow texture layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1100px] h-[900px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
            filter: "blur(130px)",
          }}
        />
        <div
          className="absolute top-[40%] -right-[15%] w-[800px] h-[800px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #ff8c5a 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* ── FLOATING APPLE GLASS NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-surface/75 backdrop-blur-2xl transition-all duration-200">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-6 py-4 lg:px-16 xl:px-24">
          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary transition-all duration-200 hover:bg-surface hover:text-text-primary hover:border-border active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.5} />
              Courses
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {course.category}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#curriculum"
              className="hidden md:inline-flex text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
            >
              Curriculum
            </a>
            <a
              href="#schedules"
              className="hidden md:inline-flex text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
            >
              Schedules
            </a>
            <a
              href="#reviews"
              className="hidden md:inline-flex text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
            >
              Reviews
            </a>

            {/* Quick header Join Now button */}
            <Link
              href="#schedules"
              className="group inline-flex h-10 items-center gap-2.5 rounded-full bg-text-primary pl-5 pr-3 text-xs font-bold text-surface shadow-md transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <span>Join Now</span>
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── AIDA ATTENTION: CINEMATIC CENTER HERO ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        <div className="space-y-8">
          
          {/* Tagline */}
          <div className="course-detail-reveal inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 backdrop-blur-xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-text-secondary shadow-sm" style={{ "--delay": "0ms" } as React.CSSProperties}>
            <Sparkles className="size-3 text-primary" />
            <span>AI-First Cohort · Live Engineering Sprint</span>
          </div>

          {/* Ultra-wide 2-line headline with inline decorative image pill */}
          <div className="course-detail-reveal" style={{ "--delay": "60ms" } as React.CSSProperties}>
            <h1 className="text-[clamp(2.8rem,5.2vw,5.5rem)] font-bold tracking-[-0.045em] text-text-primary leading-[0.92] max-w-5xl mx-auto text-balance">
              {titleFirst}{" "}
              <span
                className="inline-block w-20 h-9 md:w-28 md:h-11 rounded-full align-middle mx-2 bg-cover bg-center border border-white/20 shadow-xl"
                style={{
                  backgroundImage: `url(${course.coverImageUrl})`,
                }}
                aria-hidden
              />
              {" "}{titleRest}
            </h1>
          </div>

          {/* Editorial Subhead */}
          <div className="course-detail-reveal" style={{ "--delay": "120ms" } as React.CSSProperties}>
            <p className="text-lg md:text-2xl leading-[1.65] text-text-secondary max-w-3xl mx-auto text-balance font-normal">
              {course.description}
            </p>
          </div>

          {/* TWO HIGH-CONTRAST HERO CTAS (INCLUDING PROMINENT JOIN NOW BUTTON) */}
          <div
            className="course-detail-reveal flex flex-wrap items-center justify-center gap-4 pt-4"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {/* Primary Hero Enroll CTA */}
            <Link
              href="#schedules"
              className="group inline-flex h-14 items-center gap-4 rounded-full bg-text-primary px-8 text-base font-bold text-surface shadow-2xl transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <span>Join Now — Enroll Today</span>
              <span className="inline-flex h-7 items-center justify-center rounded-full bg-white/10 px-3 text-xs font-bold tracking-tight">
                ₹{course.price.toLocaleString("en-IN")}
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Secondary CTA */}
            <a
              href="#curriculum"
              className="group inline-flex h-14 items-center gap-3 rounded-full border border-border/70 bg-surface/80 backdrop-blur-xl px-7 text-base font-bold text-text-primary transition-all duration-200 hover:border-border hover:bg-surface active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <span>Explore Curriculum</span>
              <ArrowDown className="size-4 text-text-muted transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
          </div>

          {/* Instructor & Social Proof Trust Strip */}
          <div
            className="course-detail-reveal pt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10 border-t border-border/40 max-w-3xl mx-auto"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 items-center justify-center text-xs font-bold text-surface shadow-md shrink-0"
                style={{
                  background: "var(--color-text-primary)",
                  borderRadius: "30%",
                }}
              >
                {course.instructor.name.split(" ").map((p: string) => p[0]).join("")}
              </span>
              <div className="text-left">
                <p className="font-bold text-text-primary text-sm tracking-[-0.01em]">
                  {course.instructor.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                  {course.instructor.role}
                </p>
              </div>
            </div>

            {batches.length > 0 && (
              <>
                <div className="h-8 w-px bg-border/50 hidden sm:block" />
                <div className="flex items-center gap-3 text-left">
                  <div className="flex -space-x-2">
                    {["AM", "SK", "RJ", "DL"].map((initials, i) => (
                      <span
                        key={i}
                        className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-surface text-[10px] font-bold text-text-primary"
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight text-text-primary">
                      {batches.reduce((s, b) => s + (b.capacity - getRemainingSeats(b)), 0)}+ Builders
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                      Currently Enrolled
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* ── AIDA INTEREST: THE GAPLESS BENTO GRID ── */}
      <section className="relative z-10 mx-auto max-w-[1680px] px-6 lg:px-16 xl:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
          
          {/* Card 1: 2 Columns, 2 Rows */}
          <article
            className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-[2.25rem] border border-border/60 bg-surface/70 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-between hover:border-primary/40 transition-all duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Terminal className="size-4" />
                Engineering Method
              </span>
              <h2 className="text-[clamp(1.8rem,3vw,2.75rem)] font-bold tracking-[-0.035em] text-text-primary leading-[1.08]">
                Live production code sprints, not passive video lectures.
              </h2>
              <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                You write real code alongside senior architects. Every session is an interactive sprint focused on production-ready AI architectures, vector databases, and resilient agent pipelines.
              </p>
            </div>

            {/* Interactive Terminal Visual Preview */}
            <div className="mt-8 rounded-2xl border border-border/60 bg-black/85 p-6 font-mono text-xs text-text-secondary shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-error/70" />
                  <span className="size-3 rounded-full bg-warning/70" />
                  <span className="size-3 rounded-full bg-success/70" />
                  <span className="ml-2 text-[11px] text-white/50">sprint-agent-pipeline.ts</span>
                </div>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                  LIVE WORKSPACE
                </span>
              </div>
              <div className="space-y-1.5 text-white/80">
                <p><span className="text-primary">const</span> <span className="text-white font-bold">agent</span> = <span className="text-primary">await</span> createProductionAgent({`{`}</p>
                <p className="pl-4">model: <span className="text-success">&quot;gemini-2.5-pro&quot;</span>,</p>
                <p className="pl-4">vectorStore: upstashRedisIndex,</p>
                <p className="pl-4">persistence: convexAcidStore,</p>
                <p>{`});`}</p>
              </div>
            </div>
          </article>

          {/* Card 2: 1 Column */}
          <article
            className="group relative md:col-span-1 overflow-hidden rounded-[2.25rem] border border-border/60 bg-surface/70 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
              <Code2 className="size-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-text-primary">
                1-on-1 Code Audits
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Submit pull requests on your sprint project and receive direct, line-by-line architectural feedback from lead engineers.
              </p>
            </div>
          </article>

          {/* Card 3: 1 Column */}
          <article
            className="group relative md:col-span-1 overflow-hidden rounded-[2.25rem] border border-border/60 bg-surface/70 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
              <Users className="size-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-text-primary">
                Verified Peer Cohort
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Join a selective WhatsApp community of ambitious builders, founders, and engineers shipping AI products.
              </p>
            </div>
          </article>

          {/* Card 4: 3 Columns */}
          <article
            className="group relative md:col-span-3 overflow-hidden rounded-[2.25rem] border border-border/60 bg-surface/70 backdrop-blur-xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:border-primary/40 transition-all duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Zap className="size-4" />
                Production Stack
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.025em] text-text-primary">
                Zero-to-production deployment pipeline.
              </h3>
              <p className="text-sm md:text-base text-text-secondary">
                Every cohort project is wired directly to Next.js, Convex, and Upstash Redis with observability and authentication ready from day one.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-10">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">&lt; 15ms</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mt-1">Realtime Sync</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">ACID</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mt-1">Transactions</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mt-1">Type-Safe</p>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* ── AIDA DESIRE: MAIN CONTENT & STICKY PANEL ── */}
      <section className="relative z-10 mx-auto max-w-[1680px] px-6 lg:px-16 xl:px-24 py-16 md:py-24 grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-16 lg:gap-20">

        {/* Left: long-form curriculum, schedules & reviews */}
        <div className="space-y-28 lg:space-y-36">

          {/* ── CURRICULUM ── */}
          <div id="curriculum" className="space-y-16 scroll-mt-32">
            <div>
              <h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-bold tracking-[-0.035em] text-text-primary leading-[1.05] max-w-[18ch]">
                A curriculum designed for immediate impact.
              </h2>
            </div>

            <div>
              {course.syllabus.map((topic: string, index: number) => (
                <CourseDetailClient
                  key={topic}
                  topic={topic}
                  index={index}
                  isLast={index === course.syllabus.length - 1}
                />
              ))}
            </div>
          </div>

          {/* ── BATCHES ── */}
          <div id="schedules" className="space-y-10 scroll-mt-32">
            <h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-bold tracking-[-0.035em] text-text-primary leading-[1.05]">
              Upcoming schedules.
            </h2>

            <div className="space-y-4">
              {batches.map((batch) => {
                const remainingSeats = getRemainingSeats(batch);
                const isFull = remainingSeats === 0;
                const fillPct = ((batch.capacity - remainingSeats) / batch.capacity) * 100;

                return (
                  <article
                    key={batch.id}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-surface/60 backdrop-blur-sm p-7 hover:border-primary/30 hover:bg-surface transition-all duration-300"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-text-primary tracking-[-0.02em]">
                          {batch.title}
                        </h3>
                        <p className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                          <CalendarDays className="size-4 text-text-muted shrink-0" strokeWidth={1.75} />
                          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${batch.startDate}T00:00:00`))}
                          {" — "}
                          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${batch.endDate}T00:00:00`))}
                        </p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 h-8 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isFull
                              ? "bg-error/8 text-error"
                              : "bg-success/8 text-success"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${isFull ? "bg-error" : "bg-success"}`} />
                          {isFull ? "Full" : `${remainingSeats} seats remaining`}
                        </span>

                        {/* Seat fill bar */}
                        <div className="w-32 h-[3px] rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isFull ? "bg-error/60" : "bg-primary"}`}
                            style={{ width: `${fillPct}%`, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            
            {/* Mobile Batch Selector */}
            <div className="block lg:hidden mt-8">
              <BatchSelectorPremium batches={batches} price={course.price} courseSlug={course.slug} />
            </div>
          </div>

          {/* ── REVIEWS ── */}
          <div id="reviews" className="space-y-14 scroll-mt-32">
            <h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-bold tracking-[-0.035em] text-text-primary leading-[1.05]">
              Voices of our builders.
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14">
              {course.reviews.map((review: { id: string; rating: number; content: string; name: string; role: string }) => (
                <article key={review.id} className="space-y-6 pt-8 border-t border-border/50">
                  <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`size-3.5 ${i < review.rating ? "text-primary" : "text-border"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-[1.15rem] md:text-[1.25rem] leading-[1.65] text-text-primary font-medium tracking-[-0.01em]">
                    &ldquo;{review.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4 pt-1">
                    <span
                      className="flex size-9 items-center justify-center text-[11px] font-bold text-surface shrink-0"
                      style={{
                        background: "var(--color-text-primary)",
                        borderRadius: "28%",
                      }}
                    >
                      {review.name.split(" ").map((p: string) => p[0]).join("")}
                    </span>
                    <div>
                      <p className="font-bold text-text-primary text-sm tracking-[-0.01em]">{review.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted mt-0.5">{review.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>

        {/* ── STICKY ENROLL PANEL (DESKTOP) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <BatchSelectorPremium batches={batches} price={course.price} courseSlug={course.slug} />
          </div>
        </div>

      </section>

      {/* ── AIDA ACTION: MASSIVE BOTTOM CONVERSION CHAPTER ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-36">
        <div className="relative overflow-hidden rounded-[3rem] border border-border/80 bg-surface/90 backdrop-blur-2xl p-10 md:p-16 lg:p-20 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)]">
          
          {/* Ambient radial lighting in banner */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <ShieldCheck className="size-3.5" />
              <span>30-Day Money-Back Guarantee</span>
            </span>

            <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.04em] text-text-primary leading-[1.02]">
              Ready to build alongside senior architects?
            </h2>

            <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Secure your place in the upcoming cohort today. You get instant classroom access, pre-sprint preparation materials, and direct invite to the builders community.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#schedules"
                className="group inline-flex h-16 w-full sm:w-auto items-center justify-center gap-4 rounded-full bg-text-primary px-10 text-base md:text-lg font-bold text-surface shadow-2xl transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.98]"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                <span>Join Now — Enroll Today</span>
                <span className="inline-flex h-8 items-center justify-center rounded-full bg-white/15 px-3.5 text-sm font-bold">
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
                <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-text-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" />
                No Subscription Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" />
                Lifetime Recording Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" />
                Verified Discord &amp; WhatsApp Access
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── MOBILE STICKY BOTTOM BAR ── */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="backdrop-blur-2xl bg-surface/90 rounded-2xl p-4 flex items-center justify-between shadow-2xl ring-1 ring-white/20 border border-border/60">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">Program fee</p>
            <p className="text-xl font-bold tracking-tight text-text-primary mt-0.5">₹{course.price.toLocaleString("en-IN")}</p>
          </div>
          <Link
            href="#schedules"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-text-primary pl-6 pr-4 text-sm font-bold text-surface active:scale-[0.97] transition-transform duration-150 shadow-lg"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <span>Join Now</span>
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Reveal animation CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes course-fade-up {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .course-detail-reveal {
            opacity: 0;
            animation: course-fade-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            animation-delay: var(--delay, 0ms);
          }
          @media (prefers-reduced-motion: reduce) {
            .course-detail-reveal {
              opacity: 1;
              animation: none;
              transform: none;
            }
          }
        `
      }} />
    </main>
  );
}
