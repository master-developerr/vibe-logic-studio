"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  Calendar, 
  Video, 
  ClipboardList, 
  Megaphone, 
  Activity, 
  BookOpen,
  Link as LinkIcon
} from "lucide-react";

export function DashboardClient({ 
  user, 
  enrollments, 
  announcements, 
  upcomingClasses,
}: { 
  user: any, 
  enrollments: any[], 
  announcements: any[], 
  upcomingClasses: any[],
}) {
  const firstName = user?.name?.split(" ")[0] || "Student";

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  const continueLearningEnrollment = enrollments.find(e => e.progress < 100) || enrollments[0];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-16 font-sans"
    >
      {/* ========================================================
          WELCOME SECTION
          ======================================================== */}
      <motion.section variants={itemVariants} className="mb-12">
        <h1 className="text-[32px] leading-tight font-bold text-gray-900 mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-500 text-sm">
          You are actively enrolled in <span className="font-bold text-gray-900">{enrollments.length}</span> course{enrollments.length !== 1 ? 's' : ''}. Keep it up!
        </p>
      </motion.section>

      {/* ========================================================
          MAIN GRID
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
        
        {/* ======================= LEFT COLUMN ======================= */}
        <div className="lg:col-span-8 space-y-14">
          
          {/* 1. CONTINUE LEARNING */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
            
            {continueLearningEnrollment ? (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Thumbnail */}
                <div className="w-full md:w-[320px] h-[180px] bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden group border border-gray-200">
                  {continueLearningEnrollment.course.coverImageUrl ? (
                     <>
                       <img src={continueLearningEnrollment.course.coverImageUrl} alt={continueLearningEnrollment.course.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Play className="w-5 h-5 text-[#FF5722] ml-1" fill="currentColor" />
                          </div>
                       </div>
                     </>
                  ) : (
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Play className="w-5 h-5 text-[#FF5722] ml-1" fill="currentColor" />
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-center py-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-[#FF5722] bg-[#FFF0EB] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      IN PROGRESS
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      Next up: Resume where you left off
                    </span>
                  </div>
                  
                  <h3 className="text-[22px] font-bold text-gray-900 mb-1 leading-tight">
                    {continueLearningEnrollment.course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-1">
                    Batch: {continueLearningEnrollment.batch.title}
                  </p>
                  
                  <div className="flex items-center gap-8 mt-auto">
                    {(() => {
                      const targetBatchId = continueLearningEnrollment.batch?.id || continueLearningEnrollment.batch?._id || continueLearningEnrollment.batchId;
                      return targetBatchId ? (
                        <Link 
                          href={`/dashboard/courses/${targetBatchId}/overview`}
                          className="bg-[#FF5722] text-white hover:bg-[#E64A19] px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                          Resume Lesson <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : null;
                    })()}
                    
                    <div className="flex items-center gap-4 w-48">
                      <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">PROGRESS</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF5722] rounded-full" 
                          style={{ width: `${continueLearningEnrollment.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500">{continueLearningEnrollment.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-sm text-gray-500 font-medium">No active courses to resume.</p>
              </div>
            )}
          </motion.section>

          {/* 2. ACTIVE COURSES */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
              <Link href="/dashboard/courses" className="text-[#FF5722] text-sm font-semibold flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-sm text-gray-500 font-medium">You are not enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enrollment: any) => {
                  const targetBatchId = enrollment.batch?.id || enrollment.batch?._id || enrollment.batchId;
                  const linkHref = targetBatchId ? `/dashboard/courses/${targetBatchId}/overview` : "/dashboard/courses";

                  return (
                  <Link 
                    key={enrollment.enrollmentId || enrollment._id}
                    href={linkHref}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {enrollment.course?.coverImageUrl ? (
                          <img src={enrollment.course.coverImageUrl} alt="Course icon" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        ACTIVE
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                      {enrollment.course?.title || "Enrolled Course"}
                    </h3>
                    <p className="text-xs text-gray-500 mb-8">
                      Instructor: {enrollment.batch?.instructorName || enrollment.course?.instructorName || "TBA"} • {enrollment.batch?.title || "Active Batch"}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">Progress</span>
                        <span className="text-xs font-bold text-gray-900">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }} 
                        />
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </motion.section>


          {/* 3. RECENT ACTIVITY */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
              <Activity className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No recent activity.</p>
            </div>
          </motion.section>

        </div>

        {/* ======================= RIGHT COLUMN ======================= */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* 4. UPCOMING CLASSES */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF5722]" strokeWidth={2} />
              Upcoming Classes
            </h2>
            
            {upcomingClasses.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-sm text-gray-500 font-medium">No upcoming classes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((cls: any, index: number) => {
                  const date = new Date(cls.startTime);
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div key={cls._id} className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 ${index === 0 ? 'border-l-[6px] border-l-[#FF5722]' : 'border-l-[6px] border-l-gray-200'}`}>
                      <div className="flex flex-col items-center justify-center min-w-[48px]">
                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isToday ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                          {isToday ? 'TODAY' : date.toLocaleString('default', { weekday: 'short' })}
                        </span>
                        <span className="text-2xl font-bold text-gray-900 leading-none">
                          {date.getDate()}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 mb-0.5 truncate">
                          {cls.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {cls.meetingLink ? (
                        <a href={cls.meetingLink} target="_blank" rel="noreferrer" className="shrink-0 text-[#FF5722] hover:bg-orange-50 p-2 rounded-full transition-colors">
                          <Video className="w-5 h-5" />
                        </a>
                      ) : (
                        <div className="shrink-0 text-gray-300 p-2">
                          <LinkIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* 5. PENDING ASSIGNMENTS */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#FF5722]" strokeWidth={2} />
              Pending Assignments
            </h2>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-gray-500 font-medium">No pending assignments.</p>
            </div>
          </motion.section>

          {/* 6. ANNOUNCEMENTS */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FF5722]" strokeWidth={2} />
              Announcements
            </h2>
            
            {announcements.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-sm text-gray-500 font-medium">No announcements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div key={announcement._id} className="bg-[#111111] rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <Megaphone className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 pointer-events-none" />
                    
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-widest block mb-2">
                        {announcement.batchId ? 'BATCH UPDATE' : 'SCHOOL-WIDE'}
                      </span>
                      <h4 className="text-white text-base font-bold mb-2 leading-snug">
                        {announcement.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                        {announcement.content}
                      </p>
                      
                      <button className="text-white text-xs font-bold underline underline-offset-4 hover:text-[#FF5722] transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

        </div>
      </div>
    </motion.div>
  );
}
