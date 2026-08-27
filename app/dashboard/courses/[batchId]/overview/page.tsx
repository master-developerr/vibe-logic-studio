import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import Link from "next/link";
import { 
  PlayCircle, Video, Bell, Calendar as CalendarIcon, 
  ClipboardList, BookOpen, Clock, ChevronRight, CheckCircle2, 
  Activity, FolderOpen, AlertCircle, ArrowRight, FileText
} from "lucide-react";
import { JoinClassButton } from "@/components/dashboard/JoinClassButton";

export default async function BatchOverviewPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const { userId, getToken } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  
  const dashboardContext = await getCourseDashboardContext(userId, batchId, token);
  
  if (!dashboardContext) {
    redirect("/dashboard/courses");
  }

  const { 
    course, batch, instructor, enrollment, studyMaterials, 
    liveClasses, announcements, assignments, activities 
  } = dashboardContext;

  const progress = enrollment?.progress || 0;
  
  // Progress calculations
  const totalLessons = studyMaterials?.length || 0;
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const modulesSet = new Set(studyMaterials.filter((m: any) => m.collection).map((m: any) => m.collection));
  const totalModules = modulesSet.size || 1;
  
  // Calculate next incomplete lesson
  let nextLesson = studyMaterials[0];
  if (enrollment?.completedLessons) {
    nextLesson = studyMaterials.find((m: any) => !enrollment.completedLessons.includes(m._id)) || studyMaterials[studyMaterials.length - 1];
  }

  const courseCompleted = totalLessons > 0 && completedLessons >= totalLessons;

  // Derive Upcoming Classes
  const now = new Date().getTime();
  const upcomingClasses = liveClasses.filter((c: any) => new Date(c.startTime).getTime() > now).slice(0, 3);
  const liveNow = liveClasses.filter((c: any) => new Date(c.startTime).getTime() <= now && new Date(c.endTime).getTime() >= now);

  // Derive Deadlines
  const upcomingDeadlines = assignments.filter((a: any) => new Date(a.dueDate).getTime() > now).slice(0, 3);

  const quickLinks = [
    { name: "Content", icon: BookOpen, href: `/dashboard/courses/${batchId}/materials` },
    { name: "Calendar", icon: CalendarIcon, href: `/dashboard/courses/${batchId}/calendar` },
    { name: "Live", icon: Video, href: `/dashboard/courses/${batchId}/live` },
    { name: "Recordings", icon: PlayCircle, href: `/dashboard/courses/${batchId}/recordings` },
    { name: "Tasks", icon: ClipboardList, href: `/dashboard/courses/${batchId}/assignments` },
    { name: "Assets", icon: FolderOpen, href: `/dashboard/courses/${batchId}/materials?filter=assets` },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 font-sans pb-16">
      
      {/* LEFT / MAIN COLUMN (68%) */}
      <div className="min-w-0 lg:col-span-8 space-y-6">
        
        {/* CONTINUE LEARNING CARD */}
        {totalLessons === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-7 shadow-sm flex flex-col h-[240px]">
            <h2 className="text-[20px] md:text-[22px] font-bold text-text-primary">Continue Learning</h2>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-6 h-6 text-text-muted mb-3 opacity-60" />
              <div className="text-text-primary text-base font-bold mb-1">Course content is being prepared</div>
              <div className="text-text-secondary text-sm">Your instructor hasn't published lessons for this course yet.</div>
            </div>
          </div>
        ) : courseCompleted ? (
          <div className="bg-surface border border-border rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-14 h-14 text-success mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Course Completed!</h3>
            <p className="text-text-secondary text-sm">You have finished all available lessons in this course.</p>
          </div>
        ) : nextLesson ? (
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-8">
              Continue Learning
            </div>
            
            <div className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wide">
              {nextLesson.collection || "Module 1"}
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-5 tracking-tight">
              {nextLesson.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-semibold text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {nextLesson.type === 'video' ? <Video className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">Type</div>
                  <div className="text-text-primary leading-tight">{nextLesson.type === 'video' ? 'Video Lesson' : 'Document'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">Duration</div>
                  <div className="text-text-primary leading-tight">42 Minutes</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-t border-border pt-6">
              <div className="w-full lg:w-1/2">
                <div className="flex justify-between items-center text-[10px] font-black text-text-secondary mb-3 uppercase tracking-widest">
                  <span>Lesson Progress</span>
                  <span className="text-primary">40%</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[40%] rounded-full" />
                </div>
              </div>
              <Link 
                href={`/dashboard/courses/${batchId}/materials?lessonId=${nextLesson._id}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shrink-0 shadow-md shadow-primary/20"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* COURSE STATISTICS */}
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-lg font-bold text-text-primary">Course Statistics</h3>
            <Link href={`/dashboard/courses/${batchId}/materials`} className="text-sm font-bold text-primary hover:underline">
              View Curriculum
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            <div className="flex flex-col items-start lg:items-center lg:text-center">
              <div className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">{progress}%</div>
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Overall Completion</div>
            </div>
            
            <div className="flex flex-col items-start lg:items-center lg:text-center">
              <div className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
                {completedLessons}<span className="text-text-muted text-2xl md:text-3xl font-bold">/{totalModules}</span>
              </div>
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Modules Done</div>
            </div>
            
            <div className="flex flex-col items-start lg:items-center lg:text-center">
              <div className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
                {completedLessons}<span className="text-text-muted text-2xl md:text-3xl font-bold">/{totalLessons}</span>
              </div>
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Lessons Watched</div>
            </div>
            
            <div className="flex flex-col items-start lg:items-center lg:text-center">
              <div className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
                {assignments.filter((a: any) => a.status === 'Submitted').length}<span className="text-text-muted text-2xl md:text-3xl font-bold">/{assignments.length}</span>
              </div>
              <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Projects Submitted</div>
            </div>
          </div>
        </div>

        {/* UPCOMING DEADLINES & RECENT ACTIVITY GRID (if space allows, or stack) */}
        
        <div className="space-y-6">
          {/* UPCOMING DEADLINES */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Upcoming Deadlines</h3>
              <CalendarIcon className="w-5 h-5 text-text-muted opacity-50" />
            </div>
            
            {upcomingDeadlines.length === 0 ? (
              <div className="py-6 text-center text-text-secondary text-sm font-medium">
                No upcoming deadlines.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((assignment: any) => {
                  const daysUntil = Math.ceil((new Date(assignment.dueDate).getTime() - now) / (1000 * 60 * 60 * 24));
                  let statusLabel = `Due in ${daysUntil} days`;
                  let statusColor = "text-text-secondary bg-background border border-border";
                  
                  if (daysUntil === 0) {
                    statusLabel = "Due Today";
                    statusColor = "text-primary bg-primary/10 border border-primary/20";
                  } else if (daysUntil === 1) {
                    statusLabel = "Due Tomorrow";
                    statusColor = "text-warning bg-warning/10 border border-warning/20";
                  } else if (daysUntil <= 4) {
                    statusLabel = `Due in ${daysUntil} days`;
                    statusColor = "text-warning bg-warning/10 border border-warning/20";
                  }

                  return (
                    <Link 
                      href={`/dashboard/courses/${batchId}/assignments`} 
                      key={assignment._id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition-all group gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">{assignment.title}</h4>
                        <div className="text-xs font-semibold text-text-secondary">
                          {assignment.moduleTitle || "Course Assignment"}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5">
                        <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-text-muted">
                          Status: Pending
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* RECENT ACTIVITY */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
              <button className="text-xs font-bold text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors">Clear Log</button>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center text-text-secondary text-sm font-medium py-4">
                No recent activity yet.
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:translate-x-px before:h-full before:w-[2px] before:bg-border">
                {activities.slice(0, 5).map((activity: any, i: number) => {
                  
                  // Simple icon/color mapping based on activity type for visual variety
                  let Icon = PlayCircle;
                  let colorClass = "text-primary bg-primary/10 border-primary/20";
                  
                  if (activity.type.includes("Completed")) {
                    Icon = CheckCircle2;
                    colorClass = "text-success bg-success/10 border-success/20";
                  } else if (activity.type.includes("Submitted")) {
                    Icon = ClipboardList;
                    colorClass = "text-blue-500 bg-blue-500/10 border-blue-500/20";
                  } else if (activity.type.includes("Downloaded")) {
                    Icon = FolderOpen;
                    colorClass = "text-purple-500 bg-purple-500/10 border-purple-500/20";
                  } else if (activity.type.includes("Watched")) {
                    Icon = Video;
                    colorClass = "text-primary bg-primary/10 border-primary/20";
                  }
                  
                  return (
                    <div key={activity._id} className="relative flex items-start gap-5">
                      <div className={`flex items-center justify-center w-5 h-5 mt-1 rounded-full border-2 ${colorClass} bg-surface z-10 shrink-0`}>
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary text-sm mb-1 leading-snug">
                          {activity.type.includes("Completed") && <span className="text-text-primary">Lesson Completed: </span>}
                          {activity.type.includes("Watched") && <span className="text-text-primary">Recording Watched: </span>}
                          {activity.type.includes("Submitted") && <span className="text-text-primary">Assignment Submitted: </span>}
                          {activity.type.includes("Downloaded") && <span className="text-text-primary">Material Downloaded: </span>}
                          <span className="text-text-secondary font-medium">{activity.title}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-text-muted">
                          {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT / SIDEBAR COLUMN (32%) */}
      <div className="min-w-0 lg:col-span-4 space-y-6">
        
        {/* UPCOMING CLASSES */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary">Upcoming Classes</h3>
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          
          <div className="space-y-4">
            {liveNow.map((cls: any) => (
              <div key={cls._id} className="bg-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl animate-pulse">
                  Live Now
                </div>
                
                <div className="flex flex-col">
                  <div className="flex flex-col items-center bg-background border border-border rounded-lg w-12 h-12 justify-center mb-4 shrink-0 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-text-muted tracking-widest leading-none mb-1">
                      {new Date(cls.startTime).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black text-text-primary leading-none">
                      {new Date(cls.startTime).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-text-primary mb-1.5 leading-snug text-sm">{cls.title}</h4>
                    <div className="text-[11px] text-text-secondary font-semibold mb-1">
                      {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="mx-1.5">•</span>
                      {instructor?.name}
                    </div>
                  </div>
                </div>
                
                <JoinClassButton
                  sessionId={cls._id}
                  meetingLink={cls.meetingLink}
                  className="flex items-center justify-center w-full py-3 mt-4 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  Join Class →
                </JoinClassButton>
              </div>
            ))}
            
            {upcomingClasses.length === 0 && liveNow.length === 0 ? (
              <div className="text-center text-text-secondary text-sm font-medium py-4">
                No upcoming classes.
              </div>
            ) : (
              upcomingClasses.map((cls: any) => (
                <div key={cls._id} className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                  <div className="flex flex-col items-center bg-background border border-border rounded-lg w-12 h-12 justify-center shrink-0">
                    <span className="text-[9px] font-black uppercase text-text-muted tracking-widest leading-none mb-1">
                      {new Date(cls.startTime).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base font-black text-text-primary leading-none">
                      {new Date(cls.startTime).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm mb-1 leading-snug">{cls.title}</h4>
                    <div className="text-[11px] text-text-secondary font-semibold">
                      {new Date(cls.startTime).toLocaleDateString('en-US', { weekday: 'short' })} • {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <div className="mt-0.5">Instructor: {instructor?.name}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUICK ACCESS */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-5">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="flex flex-col items-center justify-center p-4 bg-background rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition-all group gap-2"
              >
                <link.icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" strokeWidth={2} />
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text-primary">Announcements</h3>
            <Bell className="w-4 h-4 text-text-muted opacity-50" />
          </div>
          
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center text-text-secondary text-sm font-medium py-4">
                No announcements yet.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement: any) => (
                  <div key={announcement._id} className="group">
                    <h4 className="font-bold text-text-primary text-sm mb-1.5 group-hover:text-primary transition-colors leading-snug">{announcement.title}</h4>
                    <p className="text-xs text-text-secondary mb-2 line-clamp-2 leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center text-[10px] font-semibold text-text-muted">
                      <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="mx-1.5">•</span>
                      <span>{announcement.authorName || "Instructor"}</span>
                    </div>
                  </div>
                ))}
                {announcements.length > 3 && (
                  <Link 
                    href={`/dashboard/courses/${batchId}/announcements`}
                    className="block w-full py-3 mt-2 text-center text-xs font-bold text-text-primary border border-border rounded-xl hover:bg-background transition-colors"
                  >
                    View All Announcements
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
