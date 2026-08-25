import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

import { CourseCard } from "@/components/courses/CourseCard";
import { MarketplaceFilters } from "@/components/courses/MarketplaceFilters";
import { getMarketplaceCourses } from "@/lib/courses-service";

export const metadata: Metadata = { 
  title: "Course Marketplace | VibeLogic Studio", 
  description: "Find a practical VibeLogic Studio program to build your next skill." 
};

type MarketplacePageProps = { searchParams: Promise<{ category?: string; page?: string; q?: string }> };

const pageSize = 6; // Increased to 6 to better show the Bento grid

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category ?? "All";
  const requestedPage = Number(params.page ?? "1");
  
  const filteredCourses = await getMarketplaceCourses(category, query);
  
  const pageCount = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const currentPage = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const courses = filteredCourses.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const createPageHref = (page: number): string => `/marketplace?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category !== "All" ? { category } : {}), page: String(page) }).toString()}`;

  const getBentoSpan = (index: number) => {
    const bentoPattern = [
      "md:col-span-12 lg:col-span-8",  // Large feature
      "md:col-span-12 lg:col-span-4",  // Small side
      "md:col-span-12 lg:col-span-4",  // Small side
      "md:col-span-12 lg:col-span-8",  // Large feature
      "md:col-span-12 lg:col-span-6",  // Half
      "md:col-span-12 lg:col-span-6",  // Half
    ];
    return bentoPattern[index % bentoPattern.length];
  };

  return (
    <main className="min-h-[100dvh] bg-background">
      {/* Cinematic Center Hero */}
      <section className="relative overflow-hidden bg-surface py-32 md:py-48 flex flex-col items-center justify-center text-center px-4">
        {/* Soft floating background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-8 flex flex-col items-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-colors hover:text-primary hover:border-primary/50"
          >
            <ChevronLeft className="size-3" strokeWidth={2.5} />
            Return Home
          </Link>
          
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter text-text-primary leading-[1.05] max-w-4xl">
            Find a course that moves your work forward.
          </h1>
          
          <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
            Focused, live programs for people who learn best by making useful things. Master the tools of tomorrow, today.
          </p>
        </div>
      </section>

      {/* Grid & Filters Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="-mt-32 relative z-20 mb-20">
          <MarketplaceFilters category={category} query={query} />
        </div>
        
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-border/50 pb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              {filteredCourses.length} {filteredCourses.length === 1 ? "Program" : "Programs"} found
            </p>
          </div>
        </div>
        
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 grid-flow-dense gap-6">
              {courses.map((course, index) => (
                <div key={course.id} className={`${getBentoSpan(index)} reveal`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
            
            <nav aria-label="Marketplace pages" className="mt-20 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link aria-label="Previous page" className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all duration-300 hover:border-primary hover:text-primary active:scale-95" href={createPageHref(currentPage - 1)}>
                  <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={2} />
                </Link>
              )}
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <Link 
                  aria-current={page === currentPage ? "page" : undefined} 
                  className={`flex size-12 items-center justify-center rounded-full border text-sm font-bold transition-all duration-300 active:scale-95 ${page === currentPage ? "border-ink bg-ink text-surface" : "border-border bg-surface text-text-secondary hover:border-primary hover:text-primary"}`} 
                  href={createPageHref(page)} 
                  key={page}
                >
                  {page}
                </Link>
              ))}
              {currentPage < pageCount && (
                <Link aria-label="Next page" className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all duration-300 hover:border-primary hover:text-primary active:scale-95" href={createPageHref(currentPage + 1)}>
                  <ChevronRight aria-hidden="true" className="size-5" strokeWidth={2} />
                </Link>
              )}
            </nav>
          </>
        ) : (
          <div className="mt-12 grid min-h-[400px] place-items-center rounded-[2rem] border border-border/50 bg-surface/30 p-8 text-center shadow-sm">
            <div className="max-w-md space-y-6">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap aria-hidden="true" className="size-8" strokeWidth={1.5} />
              </span>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-text-primary">Nothing found</h2>
                <p className="text-base leading-relaxed text-text-secondary">Try another course title or clear the category filter to see every available program.</p>
              </div>
              <Link className="inline-flex rounded-full bg-ink px-8 py-4 text-sm font-bold tracking-wide text-surface transition-transform duration-300 ease-[var(--ease-out)] hover:bg-ink/90 active:scale-[0.97]" href="/marketplace">
                Clear all filters
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
