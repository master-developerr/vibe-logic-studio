"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";

interface CourseSelectorProps {
  enrollments: any[];
  activeCourseId?: string;
}

export function CourseSelector({ enrollments, activeCourseId }: CourseSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!enrollments || enrollments.length <= 1) {
    return null; // Don't show switcher if 0 or 1 course
  }

  const handleSelect = (courseId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("courseId", courseId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border mb-6">
      <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2 shrink-0">
        Course:
      </span>
      {enrollments.map((enrollment) => {
        const course = enrollment.course;
        if (!course) return null;
        const isSelected = activeCourseId === course.id;
        return (
          <button
            key={course.id}
            type="button"
            onClick={() => handleSelect(course.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
              isSelected
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/40"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course.title}</span>
          </button>
        );
      })}
    </div>
  );
}
