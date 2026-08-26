"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layout,
  BookOpen,
  Video,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface StudentBatchWorkspaceHeaderProps {
  batchId: Id<"batches">;
  courseTitle: string;
  batchTitle: string;
  instructorName?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export function StudentBatchWorkspaceHeader({ 
  batchId, 
  courseTitle, 
  batchTitle,
  instructorName,
  progress,
  completedLessons,
  totalLessons
}: StudentBatchWorkspaceHeaderProps) {
  const pathname = usePathname();
  const cleanCourseTitle = courseTitle.replace(/^\[|\]$/g, "").trim();

  const tabs = [
    { name: "Overview", href: `/dashboard/courses/${batchId}/overview`, icon: Layout },
    { name: "Study Materials", href: `/dashboard/courses/${batchId}/materials`, icon: BookOpen },
    { name: "Live Classes", href: `/dashboard/courses/${batchId}/live`, icon: Video },
    { name: "Recordings", href: `/dashboard/courses/${batchId}/recordings`, icon: FileText },
    { name: "Assignments", href: `/dashboard/courses/${batchId}/assignments`, icon: ClipboardList },
    { name: "Calendar", href: `/dashboard/courses/${batchId}/calendar`, icon: Calendar },
    { name: "Announcements", href: `/dashboard/courses/${batchId}/announcements`, icon: Bell },
    { name: "Notes", href: `/dashboard/courses/${batchId}/notes`, icon: MessageSquare },
  ];

  const isAnnouncementsPage = pathname.includes("/announcements");

  return (
    <div className="bg-surface pt-4 md:pt-6 mb-6 w-full min-w-0">
      <div className="w-full min-w-0">
        
        {/* Header Content Wrapper */}
        <div className={`grid grid-cols-1 ${!isAnnouncementsPage ? 'lg:grid-cols-[1fr_auto]' : ''} gap-8 items-start lg:items-center pb-6`}>
          
          {/* LEFT: Identity */}
          <div className="flex flex-col min-w-0">
            {/* Breadcrumb */}
            <nav className={`flex items-center text-sm font-semibold text-text-secondary ${!isAnnouncementsPage ? 'mb-4 md:mb-6' : 'mb-2'} tracking-wide`}>
              <Link href="/dashboard/courses" className="hover:text-text-primary transition-colors">My Courses</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-text-muted opacity-60" />
              {isAnnouncementsPage ? (
                <>
                  <Link href={`/dashboard/courses/${batchId}/overview`} className="hover:text-text-primary transition-colors">{cleanCourseTitle}</Link>
                  <ChevronRight className="w-4 h-4 mx-2 text-text-muted opacity-60" />
                  <span className="text-text-primary font-bold">Announcements</span>
                </>
              ) : (
                <span className="text-text-primary font-bold">{cleanCourseTitle}</span>
              )}
            </nav>

            {!isAnnouncementsPage && (
              <>
                {/* Title */}
                <h1 className="text-3xl md:text-[38px] font-extrabold text-text-primary leading-tight mb-4 tracking-tight break-words">
                  {cleanCourseTitle}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-6 text-[15px] text-text-secondary">
                  <span className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-text-muted opacity-70" />
                    Batch: <span className="text-text-primary font-bold">{batchTitle}</span>
                  </span>
                  {instructorName && (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] shrink-0 font-bold uppercase">
                        {instructorName.charAt(0)}
                      </div>
                      Instructor: <span className="text-text-primary font-bold">{instructorName}</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Progress */}
          {!isAnnouncementsPage && (
            <div className="bg-surface border border-border rounded-2xl p-5 w-full lg:w-[300px] h-auto md:h-[110px] flex items-center gap-5 shadow-sm shrink-0">
              <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-background"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeDasharray={`${progress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-text-primary">{progress}%</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Overall Progress</div>
                <div className="text-sm font-extrabold text-text-primary">{completedLessons} / {totalLessons} Lessons</div>
              </div>
            </div>
          )}
          
        </div>

        {/* Tabs */}
        <div className="sticky top-[72px] z-20 flex min-w-0 items-center gap-8 overflow-x-auto overscroll-x-contain border-b border-border bg-surface h-[60px] touch-pan-x no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  flex shrink-0 items-center gap-2.5 whitespace-nowrap transition-all text-[15px] font-semibold h-full border-b-2
                  ${isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-text-secondary hover:text-text-primary"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-60 text-text-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
