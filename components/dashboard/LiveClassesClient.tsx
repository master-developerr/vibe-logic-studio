"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { JoinClassButton } from "./JoinClassButton";
import { WatchRecordingButton } from "./WatchRecordingButton";
import {
  Clock, 
  Calendar, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Hourglass,
  CalendarDays
} from "lucide-react";
import Link from "next/link";
import { format, isSameDay, differenceInMinutes } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LiveClassType = any;

export function LiveClassesClient({ batchId, clerkId }: { batchId: string, clerkId?: string }) {
  const data = useQuery(api.student.getLiveClassesViewData, { 
    batchId: batchId as Id<"batches">,
  });
  
  const [now, setNow] = useState<number>(new Date().getTime());
  
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isLoading = data === undefined;
  const liveClasses = data?.liveClasses || [];
  const attendedClassIds = data?.attendedClassIds || [];

  let upcoming = liveClasses.filter((c: LiveClassType) => c.startTime > now);
  upcoming.sort((a: LiveClassType, b: LiveClassType) => a.startTime - b.startTime);

  const liveNow = liveClasses.filter((c: LiveClassType) => c.startTime <= now && c.endTime >= now);
  
  const heroClass = liveNow.length > 0 ? liveNow[0] : (upcoming.length > 0 ? upcoming[0] : null);
  
  if (heroClass && heroClass.startTime > now) {
    upcoming = upcoming.filter((c: LiveClassType) => c._id !== heroClass._id);
  }

  const pastClasses = liveClasses.filter((c: LiveClassType) => c.endTime < now && c._id !== heroClass?._id);
  
  pastClasses.sort((a: LiveClassType, b: LiveClassType) => {
    if (sortOrder === "desc") return b.startTime - a.startTime;
    return a.startTime - b.startTime;
  });

  const totalPastClasses = pastClasses.length;
  const totalPages = Math.max(1, Math.ceil(totalPastClasses / itemsPerPage));
  const paginatedPastClasses = pastClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTime = (ts: number) => format(new Date(ts), "h:mm a");

  const getDurationString = (start: number, end: number) => {
    const mins = differenceInMinutes(new Date(end), new Date(start));
    return `${mins} mins`;
  };

  const getInstructorInitials = (name?: string) => {
    if (!name) return "I";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const generateIcsLink = (cls: LiveClassType) => {
    const startStr = new Date(cls.startTime).toISOString().replace(/-|:|\.\d+/g, '');
    const endStr = new Date(cls.endTime).toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${cls.title}\nDTSTART:${startStr}\nDTEND:${endStr}\nLOCATION:${cls.meetingLink}\nEND:VEVENT\nEND:VCALENDAR`;
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  return (
    <div className="w-full space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-4xl md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">Live Classes</h2>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">Join upcoming sessions and access previous class recordings.</p>
        
        {/* Contextual Summary Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-semibold text-text-secondary shadow-sm">
            {isLoading ? <span className="w-4 h-4 bg-gray-200 rounded animate-pulse" /> : <span className="text-text-primary">{upcoming.length}</span>} Upcoming
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-semibold text-text-secondary shadow-sm">
            {isLoading ? <span className="w-4 h-4 bg-gray-200 rounded animate-pulse" /> : <span className="text-red-600">{liveNow.length}</span>} Live Now
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-semibold text-text-secondary shadow-sm">
            {isLoading ? <span className="w-4 h-4 bg-gray-200 rounded animate-pulse" /> : <span className="text-text-primary">{totalPastClasses}</span>} Past Classes
          </div>
        </div>
      </div>

      {/* HERO CLASS */}
      {isLoading ? (
        <div className="w-full bg-surface border border-border shadow-sm rounded-xl p-6 lg:p-8 h-48 animate-pulse flex">
          <div className="flex-1 bg-gray-100 rounded-lg"></div>
        </div>
      ) : heroClass ? (
        <div className="w-full bg-surface border-y border-r border-l-4 border-l-primary border-y-border border-r-border shadow-sm rounded-xl p-6 lg:p-8 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-3">
              {isSameDay(new Date(heroClass.startTime), new Date(now)) && (
                <span className="bg-amber-100 text-amber-700 text-[11px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider">TODAY</span>
              )}
              {heroClass.startTime <= now && heroClass.endTime >= now ? (
                <span className="bg-red-100 text-red-600 text-[11px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  LIVE NOW
                </span>
              ) : (
                <span className="bg-primary/10 text-primary text-[11px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  UP NEXT
                </span>
              )}
            </div>
            
            <h3 className="text-2xl font-extrabold text-text-primary mb-3">
              {heroClass.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-text-secondary">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                {formatTime(heroClass.startTime)} — {formatTime(heroClass.endTime)}
              </div>
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-text-muted" />
                {getDurationString(heroClass.startTime, heroClass.endTime)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-primary text-[10px] font-bold uppercase">
                  {getInstructorInitials(heroClass.instructorName)}
                </div>
                <span className="text-text-primary">{heroClass.instructorName || "Instructor"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col items-stretch justify-center gap-3 shrink-0">
            {heroClass.startTime <= now && heroClass.endTime >= now ? (
              <JoinClassButton
                sessionId={heroClass._id}
                meetingLink={heroClass.meetingLink}
              />
            ) : (
              <button 
                disabled
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed transition-colors"
              >
                Join when live
              </button>
            )}
            
            <a 
              href={generateIcsLink(heroClass)}
              download={`${heroClass.title}.ics`}
              className="inline-flex items-center justify-center px-6 py-3 bg-surface border border-border text-sm font-bold text-text-secondary rounded-xl hover:text-text-primary hover:bg-gray-50 transition-colors shadow-sm gap-2"
            >
              <CalendarDays className="w-4 h-4" /> Add to Calendar
            </a>
          </div>
        </div>
      ) : (
        <div className="w-full bg-surface border border-border shadow-sm rounded-xl p-6 lg:p-8">
          <p className="text-sm font-bold text-text-primary mb-1">No live classes scheduled.</p>
          <p className="text-sm font-medium text-text-secondary">Check your calendar for upcoming sessions.</p>
        </div>
      )}

      {/* UPCOMING CLASSES */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">Upcoming Classes</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 h-48 animate-pulse bg-gray-50/50"></div>
            ))}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((cls: LiveClassType) => (
              <div key={cls._id} className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-sm">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col items-center justify-center border border-border rounded-lg w-12 h-12 bg-gray-50">
                      <span className="text-[9px] font-bold text-text-muted uppercase">{format(new Date(cls.startTime), "MMM")}</span>
                      <span className="text-lg font-extrabold text-text-primary leading-none">{format(new Date(cls.startTime), "dd")}</span>
                    </div>
                    <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider">
                      UPCOMING
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-text-primary leading-tight line-clamp-2 mb-3">
                      {cls.title}
                    </h4>
                    <div className="flex flex-col space-y-2 text-xs font-semibold text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="truncate">{format(new Date(cls.startTime), "EEEE, h:mm a")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-text-primary text-[9px] font-bold uppercase shrink-0">
                          {getInstructorInitials(cls.instructorName)}
                        </div>
                        <span className="truncate">{cls.instructorName || "Instructor"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hourglass className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span>{getDurationString(cls.startTime, cls.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-6">
                  <button 
                    disabled
                    className="flex-1 py-2.5 bg-gray-50 text-text-muted font-bold rounded-lg text-xs cursor-not-allowed"
                  >
                    Join when live
                  </button>
                  <a 
                    href={generateIcsLink(cls)}
                    download={`${cls.title}.ics`}
                    className="w-10 h-10 flex items-center justify-center bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full bg-surface border border-border shadow-sm rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300 shrink-0" />
              <div>
                <p className="text-sm font-bold text-text-primary">No upcoming classes</p>
                <p className="text-sm font-medium text-text-secondary">New sessions will appear here when scheduled.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PAST CLASSES */}
      <div className="space-y-4 pb-20 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">Past Classes</h3>
            <p className="text-sm font-medium text-text-secondary">
              {isLoading ? <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse"></span> : `${totalPastClasses} completed sessions`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary font-semibold">
            <span>Sort by</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="bg-surface border border-border rounded-md text-text-primary font-bold focus:outline-none cursor-pointer py-1.5 pl-3 pr-8 shadow-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="w-full mt-4 space-y-4 animate-pulse">
            <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
            <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
            <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
          </div>
        ) : pastClasses.length === 0 ? (
          <div className="py-8">
            <p className="text-sm font-bold text-text-primary">No completed classes yet.</p>
          </div>
        ) : (
          <div className="w-full">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block w-full overflow-hidden bg-surface border border-border rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted bg-gray-50/50 border-b border-border">
                    <th className="py-3 pl-6 pr-4 w-1/3">CLASS</th>
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">INSTRUCTOR</th>
                    <th className="py-3 px-4">ATTENDANCE</th>
                    <th className="py-3 pl-4 pr-6 text-right">RECORDING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedPastClasses.map((cls: LiveClassType) => {
                    const isAttended = attendedClassIds.includes(cls._id);
                    
                    return (
                      <tr key={cls._id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="py-4 pl-6 pr-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-bold text-text-primary text-sm leading-snug">{cls.title}</span>
                            <span className="text-[11px] text-text-muted font-semibold mt-1">{getDurationString(cls.startTime, cls.endTime)}</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4 align-middle text-xs font-semibold text-text-secondary whitespace-nowrap">
                          {format(new Date(cls.startTime), "MMM dd, yyyy")}
                        </td>
                        
                        <td className="py-4 px-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-primary text-[9px] font-bold uppercase shrink-0">
                              {getInstructorInitials(cls.instructorName)}
                            </div>
                            <span className="text-xs font-semibold text-text-secondary">{cls.instructorName || "Instructor"}</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4 align-middle">
                          {isAttended ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Attended
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-text-muted">
                              Not marked
                            </span>
                          )}
                        </td>
                        
                        <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                          {cls.recordingUrl ? (
                            <WatchRecordingButton
                              sessionId={cls._id}
                              batchId={batchId}
                            />
                          ) : (
                            <span className="text-xs font-semibold text-text-muted select-none">
                              Recording unavailable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {paginatedPastClasses.map((cls: LiveClassType) => {
                const isAttended = attendedClassIds.includes(cls._id);
                
                return (
                  <div key={cls._id} className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm leading-snug">{cls.title}</h4>
                      <p className="text-[11px] text-text-muted font-semibold mt-1">{getDurationString(cls.startTime, cls.endTime)}</p>
                    </div>
                    
                    <div className="text-xs font-semibold text-text-secondary">
                      {format(new Date(cls.startTime), "MMM dd, yyyy")}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-primary text-[9px] font-bold uppercase shrink-0">
                          {getInstructorInitials(cls.instructorName)}
                        </div>
                        <span className="text-xs font-semibold text-text-secondary">{cls.instructorName || "Instructor"}</span>
                      </div>
                      
                      {isAttended ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold tracking-wider uppercase">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Attended
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-text-muted">
                          Not marked
                        </span>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-border mt-1">
                      {cls.recordingUrl ? (
                        <WatchRecordingButton
                          sessionId={cls._id}
                          batchId={batchId}
                        />
                      ) : (
                        <span className="text-xs font-semibold text-text-muted select-none">
                          Recording unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-6 mt-2">
                <span className="text-sm font-medium text-text-muted">
                  Showing {paginatedPastClasses.length} of {totalPastClasses} classes
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                          ? "bg-text-primary text-white border-transparent" 
                          : "border border-transparent text-text-secondary hover:bg-gray-50 hover:border-border"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
