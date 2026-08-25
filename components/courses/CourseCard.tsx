import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";

import { getAvailableBatches, getRemainingSeats, type Course } from "@/lib/course-data";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const nextBatch = getAvailableBatches(course)[0];
  const remainingSeats = nextBatch ? getRemainingSeats(nextBatch) : 0;

  return (
    <article className="group relative block p-2 rounded-[2rem] ring-1 ring-border bg-surface/40 hover:bg-surface/60 transition-colors duration-500 ease-[var(--ease-out)]">
      <Link 
        href={`/course/${course.slug}`} 
        className="block relative rounded-[calc(2rem-0.5rem)] overflow-hidden bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-transform duration-500 ease-[var(--ease-out)] active:scale-[0.97]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-background">
          <Image 
            alt={`${course.title} cover`} 
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" 
            fill 
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" 
            src={course.coverImageUrl} 
          />
          {/* Subtle gradient overlay to give depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              {course.category}
            </span>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary">{course.title}</h2>
              <p className="text-sm leading-6 text-text-secondary">{course.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-5 text-sm text-text-secondary">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Next Batch</span>
              <p className="flex items-center gap-1.5 font-medium text-text-primary">
                <CalendarDays aria-hidden="true" className="size-3.5 text-primary" strokeWidth={2} />
                {nextBatch ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${nextBatch.startDate}T00:00:00`)) : "Soon"}
              </p>
            </div>
            {nextBatch && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Availability</span>
                <p className="flex items-center gap-1.5 font-medium text-text-primary">
                  <Users aria-hidden="true" className="size-3.5 text-primary" strokeWidth={2} />
                  {remainingSeats} seats
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Program Fee</p>
              <p className="text-xl font-bold tracking-tight text-text-primary">₹{course.price.toLocaleString("en-IN")}</p>
            </div>
            {/* Nested CTA & "Island" Button Architecture */}
            <div className="flex items-center pl-5 pr-1.5 py-1.5 h-12 rounded-full bg-ink text-surface font-semibold text-sm transition-transform duration-300 ease-[var(--ease-out)] group-active:scale-[0.98]">
              <span className="mr-4">Enroll</span>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
