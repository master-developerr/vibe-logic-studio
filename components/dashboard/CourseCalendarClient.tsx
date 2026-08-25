"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type EventType = 'live' | 'assignment' | 'quiz' | 'recording' | 'announcement';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  date: Date;
  endDate?: Date;
  moduleTitle?: string;
  link: string;
}

const EVENT_CONFIG = {
  live: { color: 'bg-[#FF5722]', text: 'text-[#FF5722]', lightBg: 'bg-[#FF5722]/10', label: 'Live Class' },
  assignment: { color: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50', label: 'Assignment' },
  quiz: { color: 'bg-purple-500', text: 'text-purple-600', lightBg: 'bg-purple-50', label: 'Quiz' },
  recording: { color: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50', label: 'Recording' },
  announcement: { color: 'bg-gray-400', text: 'text-gray-600', lightBg: 'bg-gray-100', label: 'Announcement' }
};

export function CourseCalendarClient({
  batchId,
  liveClasses: initialLiveClasses,
  assignments: initialAssignments,
  announcements: initialAnnouncements,
  clerkId
}: {
  batchId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveClasses: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignments: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  announcements: any[];
  clerkId?: string;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [activeFilter, setActiveFilter] = useState<'all' | EventType>('all');

  // To avoid fetching all events, we calculate the bounds of the current view.
  const bounds = useMemo(() => {
    // We fetch a wide enough window around currentDate (± 1 month).
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).getTime();
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).getTime();
    return { startDate: start, endDate: end };
  }, [currentDate]);

  const queryData = useQuery(api.student.getCalendarEvents, {
    batchId: batchId as Id<"batches">,
    startDate: bounds.startDate,
    endDate: bounds.endDate,
  });

  const liveClasses = queryData?.liveClasses || initialLiveClasses;
  const assignments = queryData?.assignments || initialAssignments;
  const announcements = queryData?.announcements || initialAnnouncements;

  const allEvents: CalendarEvent[] = useMemo(() => {
    const evts: CalendarEvent[] = [];
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    
    liveClasses.forEach(c => {
      const isPast = c.endTime < now;
      if (c.recordingUrl && isPast) {
        evts.push({
          id: `rec-${c._id}`,
          type: 'recording',
          title: c.title,
          date: new Date(c.endTime),
          moduleTitle: c.moduleTitle,
          link: `/dashboard/courses/${batchId}/recordings`
        });
      } else {
        evts.push({
          id: c._id,
          type: 'live',
          title: c.title,
          date: new Date(c.startTime),
          endDate: new Date(c.endTime),
          moduleTitle: c.moduleTitle,
          link: `/dashboard/courses/${batchId}/live`
        });
      }
    });

    if (queryData && queryData.recordings) {
      queryData.recordings.forEach(c => {
        if (!evts.find(e => e.id === `rec-${c._id}`)) {
          evts.push({
            id: `rec-${c._id}`,
            type: 'recording',
            title: c.title,
            date: new Date(c.endTime),
            moduleTitle: c.moduleTitle,
            link: `/dashboard/courses/${batchId}/recordings`
          });
        }
      });
    }

    assignments.forEach(a => {
      const isQuiz = a.title.toLowerCase().includes('quiz');
      evts.push({
        id: a._id,
        type: isQuiz ? 'quiz' : 'assignment',
        title: a.title,
        date: new Date(a.dueDate),
        moduleTitle: a.moduleTitle,
        link: `/dashboard/courses/${batchId}/assignments`
      });
    });

    announcements.forEach(a => {
      evts.push({
        id: a._id,
        type: 'announcement',
        title: a.title,
        date: new Date(a.scheduledAt || a.createdAt),
        moduleTitle: 'Course-wide Update',
        link: `/dashboard/courses/${batchId}/announcements`
      });
    });

    return evts.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [liveClasses, assignments, announcements, batchId, queryData]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return allEvents;
    return allEvents.filter(e => e.type === activeFilter);
  }, [allEvents, activeFilter]);

  // Upcoming Events Logic
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    // Start of today (to include events happening later today)
    now.setHours(0, 0, 0, 0);
    
    return filteredEvents
      .filter(e => e.date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents]);

  // Group Upcoming by Date
  const groupedUpcoming = useMemo(() => {
    const groups: { dateStr: string; timestamp: number; events: CalendarEvent[] }[] = [];
    
    upcomingEvents.forEach(evt => {
      const dateStr = evt.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
      const existing = groups.find(g => g.dateStr === dateStr);
      if (existing) {
        existing.events.push(evt);
      } else {
        // Use 12:00 AM of that day for proper sorting if needed
        const d = new Date(evt.date);
        d.setHours(0, 0, 0, 0);
        groups.push({ dateStr, timestamp: d.getTime(), events: [evt] });
      }
    });
    return groups;
  }, [upcomingEvents]);

  // Month Math
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prev = () => {
    if (view === 'Month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    if (view === 'Week') setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    if (view === 'Day') setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
  };
  
  const next = () => {
    if (view === 'Month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    if (view === 'Week') setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    if (view === 'Day') setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
  };
  
  const goToday = () => setCurrentDate(new Date());

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(e => 
      e.date.getDate() === date.getDate() && 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Week View Math
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust when day is sunday
    
    return Array.from({length: 7}).map((_, i) => {
      const wd = new Date(d.setDate(diff + i));
      return wd;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col items-start text-left mb-2">
        <h2 className="text-4xl md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">Calendar</h2>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          View all your upcoming live classes, assignments, and course events in one place.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${activeFilter === 'all' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface text-text-primary hover:bg-background border border-border'}`}
        >
          All Events
        </button>
        {Object.entries(EVENT_CONFIG).map(([key, config]) => (
          <button 
            key={key}
            onClick={() => setActiveFilter(key as EventType)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 border ${activeFilter === key ? 'bg-surface border-border shadow-sm text-text-primary' : 'bg-transparent border-transparent hover:bg-surface text-text-secondary'}`}
          >
            <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
            <span>{config.label}s</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Main Calendar Area */}
        <div className="flex-1 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden w-full">
          {/* Calendar Header */}
          <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-extrabold text-text-primary w-36">{monthName} {year}</h2>
              <div className="flex items-center text-text-secondary">
                <button onClick={prev} className="p-1 hover:bg-background rounded-md transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={goToday} className="px-3 py-1 text-[13px] font-bold hover:text-text-primary transition-colors">Today</button>
                <button onClick={next} className="p-1 hover:bg-background rounded-md transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="flex items-center p-1 bg-background rounded-xl border border-border">
              {(['Month', 'Week', 'Day'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${view === v ? 'bg-surface text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Month View */}
          {view === 'Month' && (
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-7 gap-px mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-text-muted tracking-widest pb-3">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border-t border-l border-border rounded-xl overflow-hidden">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`blank-${i}`} className="min-h-[110px] bg-background/50 border-r border-b border-border"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dayEvents = getEventsForDate(date);
                  const today = isToday(date);
                  
                  return (
                    <div key={day} className="min-h-[110px] border-r border-b border-border p-2 group hover:bg-background transition-colors">
                      <div className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1.5
                        ${today ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-text-secondary'}
                      `}>
                        {day}
                      </div>
                      
                      <div className="space-y-1 flex flex-col items-start w-full">
                        {dayEvents.map(evt => {
                          const config = EVENT_CONFIG[evt.type];
                          return (
                            <Link href={evt.link} key={evt.id} className={`block w-full text-left truncate text-[10px] font-bold px-1.5 py-1 rounded ${config.lightBg} ${config.text} hover:opacity-80 transition-opacity`} title={evt.title}>
                              {evt.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-text-muted text-sm font-medium">No events scheduled for this month.</div>
              )}
            </div>
          )}

          {/* Week View */}
          {view === 'Week' && (
            <div className="p-4 md:p-5 overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {getWeekDays().map(date => {
                    const today = isToday(date);
                    return (
                      <div key={date.toISOString()} className="text-center">
                        <div className="text-[10px] font-bold text-text-muted tracking-widest mb-1">{date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                        <div className={`text-lg font-bold w-10 h-10 mx-auto flex items-center justify-center rounded-full
                          ${today ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-text-primary bg-background'}
                        `}>
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-7 gap-4 min-h-[400px]">
                  {getWeekDays().map(date => {
                    const dayEvents = getEventsForDate(date);
                    return (
                      <div key={date.toISOString()} className="bg-background/50 rounded-xl p-2 flex flex-col gap-2 border border-border/50">
                        {dayEvents.map(evt => {
                          const config = EVENT_CONFIG[evt.type];
                          return (
                            <Link href={evt.link} key={evt.id} className={`block p-2 rounded-lg bg-surface border border-border shadow-sm hover:border-primary/30 transition-colors`}>
                              <div className={`w-1.5 h-1.5 rounded-full mb-1.5 ${config.color}`}></div>
                              <div className="text-[11px] font-bold text-text-primary leading-tight mb-1">{evt.title}</div>
                              <div className="text-[10px] font-medium text-text-secondary">{evt.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Day View */}
          {view === 'Day' && (
            <div className="p-5 min-h-[400px]">
               <div className="mb-6 flex items-end gap-3 border-b border-border pb-4">
                  <div className={`text-4xl font-extrabold ${isToday(currentDate) ? 'text-primary' : 'text-text-primary'}`}>{currentDate.getDate()}</div>
                  <div className="text-text-secondary font-bold tracking-wide uppercase mb-1">{currentDate.toLocaleString('en-US', { weekday: 'long' })}</div>
               </div>
               
               <div className="space-y-4 max-w-2xl">
                 {getEventsForDate(currentDate).map(evt => {
                    const config = EVENT_CONFIG[evt.type];
                    return (
                      <Link href={evt.link} key={evt.id} className="flex gap-4 group">
                        <div className="w-20 text-right pt-1 shrink-0 text-sm font-bold text-text-muted group-hover:text-text-primary transition-colors">
                          {evt.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                        <div className="flex-1 bg-surface border border-border p-4 rounded-xl shadow-sm group-hover:border-primary/40 transition-all flex flex-col relative overflow-hidden">
                          <div className={`absolute top-0 left-0 bottom-0 w-1 ${config.color}`}></div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${config.text}`}>{config.label}</div>
                          <div className="text-sm font-extrabold text-text-primary mb-1">{evt.title}</div>
                          {evt.moduleTitle && <div className="text-xs font-medium text-text-secondary">{evt.moduleTitle}</div>}
                        </div>
                      </Link>
                    )
                 })}
                 
                 {getEventsForDate(currentDate).length === 0 && (
                   <div className="text-center py-12 text-text-muted font-medium bg-background rounded-xl">No events scheduled.</div>
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          
          {/* Upcoming Card */}
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
                Upcoming
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-black">{upcomingEvents.length}</span>
              </h3>
              <Filter className="w-4 h-4 text-text-muted" />
            </div>

            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {groupedUpcoming.length === 0 ? (
                <div className="text-center py-6 text-text-muted text-sm font-medium">No upcoming events.</div>
              ) : (
                groupedUpcoming.map((group, i) => (
                  <div key={i} className="relative">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase mb-3 sticky top-0 bg-surface/90 backdrop-blur-sm py-1 z-10">
                      {group.dateStr}
                    </div>
                    <div className="space-y-4">
                      {group.events.map(evt => {
                        const config = EVENT_CONFIG[evt.type];
                        return (
                          <Link href={evt.link} key={evt.id} className="block group">
                            <div className="flex gap-3">
                              <div className={`w-[3px] rounded-full shrink-0 ${config.color}`}></div>
                              <div>
                                <div className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${config.text}`}>
                                  {config.label}
                                </div>
                                <div className="text-[13px] font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                                  {evt.title}
                                </div>
                                <div className="text-[11px] font-medium text-text-secondary mt-1 flex justify-between items-center w-full">
                                  <span>{evt.moduleTitle || 'Course Event'}</span>
                                </div>
                                <div className="text-[10px] font-bold text-text-primary mt-1.5 opacity-80">
                                  {evt.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {groupedUpcoming.length > 0 && (
              <button className="w-full mt-5 py-2 border border-border rounded-lg text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-background transition-colors">
                View All Events
              </button>
            )}
          </div>

          {/* Event Legend Card */}
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4">Event Legend</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {Object.entries(EVENT_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                  <span className="text-[11px] font-bold text-text-secondary">{config.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
