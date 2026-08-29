import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireStudentEnrolledInBatch } from "./student_auth";

export const getBatchContext = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;

    const batch = await ctx.db.get(args.batchId);
    if (!batch) {
      throw new Error("Batch not found");
    }

    const course = await ctx.db.get(batch.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    return {
      batch,
      course
    };
  },
});

export const getBatchLMS = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;
    
    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;
    
    const course = await ctx.db.get(batch.courseId);
    if (!course) return null;

    const studyMaterials = await ctx.db.query("studyMaterials")
      .withIndex("by_course_id", q => q.eq("courseId", batch.courseId))
      .collect();

    const liveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    const announcements = await ctx.db.query("announcements")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    return {
      course: {
        id: course._id,
        title: course.title,
        slug: course.slug,
      },
      batch: {
        id: batch._id,
        title: batch.title,
        whatsappLink: batch.whatsappLink,
      },
      studyMaterials: studyMaterials.sort((a, b) => a.order - b.order),
      liveClasses: liveClasses.sort((a, b) => a.startTime - b.startTime),
      announcements: announcements.sort((a, b) => b.createdAt - a.createdAt),
    };
  },
});

export const getCourseDashboardContext = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    const authUser = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!authUser) return null;
    
    const batch = await ctx.db.get(args.batchId);
    if (!batch) throw new Error("Batch not found");
    
    const course = await ctx.db.get(batch.courseId);
    if (!course) throw new Error("Course not found");

    // Get Enrollment
    let enrollment = null;
    if (authUser.role !== "admin" && authUser.role !== "superadmin") {
      enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user_id", (q) => q.eq("userId", authUser._id))
        .filter((q) => q.eq(q.field("batchId"), args.batchId))
        .first();
    }

    // Get Data
    const studyMaterials = await ctx.db.query("studyMaterials")
      .withIndex("by_course_id", q => q.eq("courseId", batch.courseId))
      .collect();

    const liveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    const announcements = await ctx.db.query("announcements")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    const assignments = await ctx.db.query("assignments")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    const submissions = await ctx.db.query("submissions")
      .withIndex("by_user_id", q => q.eq("userId", authUser._id))
      .filter((q) => q.eq(q.field("batchId"), args.batchId))
      .collect();

    const activities = await ctx.db.query("activities")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .filter((q) => q.eq(q.field("userId"), authUser._id))
      .collect();
      
    // Instructor Details: Prioritize batch-assigned instructor, fallback to course default
    let instructor = null;
    if (batch.instructorName) {
      instructor = {
        name: batch.instructorName,
        role: "Instructor"
      };
    } else if (course.instructorName) {
      instructor = {
        name: course.instructorName,
        role: course.instructorRole || "Instructor"
      };
    }

    return {
      course: {
        id: course._id,
        title: course.title,
        slug: course.slug,
      },
      batch: {
        id: batch._id,
        title: batch.title,
        startDate: batch.startDate,
        endDate: batch.endDate,
      },
      instructor,
      enrollment,
      studyMaterials: studyMaterials.sort((a, b) => a.order - b.order),
      liveClasses: liveClasses.sort((a, b) => a.startTime - b.startTime),
      announcements: announcements.sort((a, b) => b.createdAt - a.createdAt),
      assignments: assignments.sort((a, b) => a.dueDate - b.dueDate),
      submissions: submissions.sort((a, b) => b.submittedAt - a.submittedAt),
      activities: activities.sort((a, b) => b.timestamp - a.timestamp),
    };
  },
});

export const markLessonCompleted = mutation({
  args: { batchId: v.id("batches"), lessonId: v.id("studyMaterials") },
  handler: async (ctx, args) => {
    const authUser = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!authUser) return;
    
    if (authUser.role === "admin" || authUser.role === "superadmin") return;
    
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_id", (q) => q.eq("userId", authUser._id))
      .filter((q) => q.eq(q.field("batchId"), args.batchId))
      .first();
      
    if (!enrollment) return;

    const completed = enrollment.completedLessons || [];
    if (!completed.includes(args.lessonId)) {
      completed.push(args.lessonId);
      
      // Calculate new progress
      const batch = await ctx.db.get(args.batchId);
      if (batch) {
        const allMaterials = await ctx.db.query("studyMaterials")
          .withIndex("by_course_id", q => q.eq("courseId", batch.courseId))
          .collect();
        const progress = Math.round((completed.length / Math.max(1, allMaterials.length)) * 100);
        
        await ctx.db.patch(enrollment._id, { 
          completedLessons: completed,
          progress
        });
        
        // Log activity
        const lesson = await ctx.db.get(args.lessonId);
        await ctx.db.insert("activities", {
          userId: authUser._id,
          courseId: batch.courseId,
          batchId: args.batchId,
          type: "Lesson Completed",
          title: `Completed: ${lesson?.title || "Lesson"}`,
          timestamp: Date.now(),
          resourceId: args.lessonId,
        });
      }
    }
  }
});

export const getCalendarEvents = query({
  args: { 
    batchId: v.id("batches"), 
    startDate: v.number(), 
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;

    // Fetch live classes
    const liveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .filter(q => q.and(
        q.gte(q.field("startTime"), args.startDate),
        q.lte(q.field("startTime"), args.endDate)
      ))
      .collect();

    // Past live classes for recordings (we might need ones before startDate if we want to show past recordings, but for calendar view we only care about recordings published/happening in this window, actually if it's a calendar event we show it on its original date).
    const pastLiveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .filter(q => q.and(
        q.gte(q.field("endTime"), args.startDate),
        q.lte(q.field("endTime"), args.endDate),
        q.neq(q.field("recordingUrl"), undefined)
      ))
      .collect();

    // Fetch assignments (including quizzes)
    const assignments = await ctx.db.query("assignments")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .filter(q => q.and(
        q.gte(q.field("dueDate"), args.startDate),
        q.lte(q.field("dueDate"), args.endDate)
      ))
      .collect();

    // Fetch announcements
    const announcements = await ctx.db.query("announcements")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .filter(q => q.and(
        q.gte(q.field("createdAt"), args.startDate),
        q.lte(q.field("createdAt"), args.endDate)
      ))
      .collect();

    return {
      liveClasses,
      recordings: pastLiveClasses,
      assignments,
      announcements
    };
  }
});

export const getLiveClassesViewData = query({
  args: { 
    batchId: v.id("batches")
  },
  handler: async (ctx, args) => {
    const authUser = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!authUser) return null;
    
    // Fetch all live classes for this batch
    const liveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", args.batchId))
      .collect();

    // Fetch the student's attended activities for this batch
    const activities = await ctx.db.query("activities")
      .withIndex("by_user_id", q => q.eq("userId", authUser._id))
      .filter(q => q.and(
        q.eq(q.field("batchId"), args.batchId),
        q.eq(q.field("type"), "Live Class Attended")
      ))
      .collect();

    // The resourceId is the class ID. We might need to filter out undefines just in case.
    const attendedClassIds = activities
      .map(a => a.resourceId)
      .filter((id): id is string => id !== undefined);

    return { 
      liveClasses, 
      attendedClassIds 
    };
  }
});

export const getCertificatesData = query({
  args: {},
  handler: async (ctx, args) => {
    // We cannot use requireStudentEnrolledInBatch because this is global.
    // Instead we do a general auth check.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const clerkId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) return null;
    if (user.role !== "student") {
      // Return empty if not student
      return { certificates: [], earnedCount: 0, pendingCount: 0, coursesCompletedCount: 0 };
    }

    // Get all enrollments for this user
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    let earnedCount = 0;
    let pendingCount = 0;
    let coursesCompletedCount = 0;

    const certificates = [];

    for (const enrollment of enrollments) {
      if (enrollment.progress >= 100) {
        coursesCompletedCount++;
      }

      const status = enrollment.certificateStatus;
      if (status === "Issued" || status === "Pending" || status === "Eligible" || status === "Downloaded") {
        if (status === "Issued" || status === "Downloaded") {
          earnedCount++;
        } else if (status === "Pending" || status === "Eligible") {
          pendingCount++;
        }

        const course = await ctx.db.get(enrollment.courseId);
        const batch = await ctx.db.get(enrollment.batchId);

        if (course && batch) {
          certificates.push({
            id: enrollment._id,
            courseTitle: course.title,
            batchTitle: batch.title,
            status: status === "Eligible" ? "Pending" : status,
            issuedDate: enrollment.enrolledAt, // In reality, we'd have an issuedAt on the enrollment or cert object. We'll use enrolledAt as a fallback for now.
            certificateId: `CRT-${enrollment._id.slice(-8).toUpperCase()}`,
            progress: enrollment.progress,
          });
        }
      }
    }

    return {
      certificates,
      earnedCount,
      pendingCount,
      coursesCompletedCount,
    };
  }
});

function parseYouTubeIdServer(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : trimmed;

  try {
    const urlString = target.match(/^https?:\/\//i) ? target : `https://${target}`;
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();

    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const seg = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      if (seg && /^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }

    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v|e|watch)\/([a-zA-Z0-9_-]{11})/i);
      if (match && match[1]) return match[1];

      const parts = parsed.pathname.split("/").filter(Boolean);
      for (const p of parts) {
        if (/^[a-zA-Z0-9_-]{11}$/.test(p) && !["watch", "embed", "shorts", "live", "v", "e"].includes(p.toLowerCase())) {
          return p;
        }
      }
    }
  } catch {}

  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:(?:v|e(?:mbed)?|shorts|live)\/|(?:watch\/?\?(?:.*&)?v=)|(?:watch\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = target.match(regex);
  return match && match[1] ? match[1] : undefined;
}

export const getRecordingsData = query({
  args: {
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;
    const userId = user._id;

    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    // Include sessions that have recordingUrl or youtubeVideoId and are not draft/cancelled
    const recordings = liveClasses.filter(
      (c) => (c.recordingUrl || c.youtubeVideoId) && c.status !== "Draft" && c.status !== "Cancelled"
    );

    // Fetch progress for these recordings
    const progressRecords = await Promise.all(
      recordings.map((r) =>
        ctx.db
          .query("recordingProgress")
          .withIndex("by_user_recording", (q) =>
            q.eq("userId", userId).eq("recordingId", r._id)
          )
          .first()
      )
    );

    const recordingsWithProgress = recordings.map((rec, index) => {
      const progress = progressRecords[index];
      const derivedYtId = rec.youtubeVideoId || parseYouTubeIdServer(rec.recordingUrl);
      const cleanEmbedUrl = derivedYtId ? `https://www.youtube-nocookie.com/embed/${derivedYtId}` : rec.recordingUrl;

      return {
        ...rec,
        youtubeVideoId: derivedYtId,
        recordingUrl: cleanEmbedUrl,
        watchProgress: progress || null,
      };
    });

    return recordingsWithProgress;
  },
});

export const getRecordingById = query({
  args: {
    batchId: v.id("batches"),
    recordingId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;
    const userId = user._id;

    const allInBatch = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const recording = allInBatch.find((r) => r._id === args.recordingId);
    if (!recording) return null;

    const progress = await ctx.db
      .query("recordingProgress")
      .withIndex("by_user_recording", (q) =>
        q.eq("userId", userId).eq("recordingId", recording._id)
      )
      .first();

    const derivedYtId = recording.youtubeVideoId || parseYouTubeIdServer(recording.recordingUrl);
    const cleanEmbedUrl = derivedYtId ? `https://www.youtube-nocookie.com/embed/${derivedYtId}` : recording.recordingUrl;

    return {
      ...recording,
      youtubeVideoId: derivedYtId,
      recordingUrl: cleanEmbedUrl,
      watchProgress: progress || null,
    };
  },
});

export const recordRecordingOpened = mutation({
  args: {
    batchId: v.id("batches"),
    recordingId: v.id("liveClasses"),
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return { success: false, reason: "Unauthorized" };
    const userId = user._id;

    const session = await ctx.db.get(args.recordingId);
    if (!session || session.batchId !== args.batchId) {
      return { success: false, reason: "Recording session not found" };
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) {
      return { success: false, reason: "Batch not found" };
    }

    const now = Date.now();

    // 1. Log activity in student timeline if not logged in the last 15 minutes
    const recentActivity = await ctx.db
      .query("activities")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("resourceId"), args.recordingId),
          q.gte(q.field("timestamp"), now - 15 * 60 * 1000)
        )
      )
      .first();

    if (!recentActivity) {
      await ctx.db.insert("activities", {
        userId,
        courseId: batch.courseId,
        batchId: args.batchId,
        type: "Recording Watched",
        title: `Watched: ${session.title}`,
        timestamp: now,
        resourceId: args.recordingId,
      });
    }

    // 2. Mark attendance for recording watch if not marked yet
    const existingAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_user_live_class", (q) =>
        q.eq("userId", userId).eq("liveClassId", session._id)
      )
      .first();

    if (!existingAttendance) {
      await ctx.db.insert("attendance", {
        userId,
        batchId: args.batchId,
        liveClassId: session._id,
        status: "Present",
        attendanceSource: "recording_watch",
        markedAt: now,
        notes: "Automated attendance via recording watch",
      });
    }

    // 3. Initialize / update progress
    const existingProgress = await ctx.db
      .query("recordingProgress")
      .withIndex("by_user_recording", (q) =>
        q.eq("userId", userId).eq("recordingId", session._id)
      )
      .first();

    if (!existingProgress) {
      await ctx.db.insert("recordingProgress", {
        userId,
        batchId: args.batchId,
        recordingId: session._id,
        timestamp: 60,
        percentage: 100,
        status: "Completed",
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const updateRecordingProgress = mutation({
  args: {
    batchId: v.id("batches"),
    recordingId: v.id("liveClasses"),
    timestamp: v.number(),
    percentage: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return;
    const userId = user._id;

    const existing = await ctx.db
      .query("recordingProgress")
      .withIndex("by_user_recording", (q) =>
        q.eq("userId", userId).eq("recordingId", args.recordingId)
      )
      .first();

    let status = "Partially Watched";
    if (args.percentage >= 95) {
      status = "Completed";
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        timestamp: args.timestamp,
        percentage: args.percentage,
        status: status,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("recordingProgress", {
        userId,
        batchId: args.batchId,
        recordingId: args.recordingId,
        timestamp: args.timestamp,
        percentage: args.percentage,
        status: status,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getAnnouncementsData = query({
  args: {
    batchId: v.id("batches")
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;
    const userId = user._id;

    // Fetch batch announcements and platform-wide announcements (if we support null batchId in index)
    // Actually, our index is "by_batch_id", ["batchId"]. 
    // We can fetch batch specific ones easily.
    const batchAnnouncements = await ctx.db
      .query("announcements")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    // Fetch platform wide? The schema allows batchId to be optional. Let's just use filter to get all.
    // In production, we might want a separate index or query. We'll stick to batchAnnouncements for now 
    // and manually fetch global ones if necessary. Let's fetch all and filter to batchId or null.
    // For now, let's just use batch announcements since we indexed by it. 
    
    // Let's get platform wide announcements (batchId is null/undefined)
    // Unfortunately `by_batch_id` index with `null` might not work if it's strictly indexed by ID or it's optional.
    // We will do a full table scan for platform wide if needed, but let's assume all are batch specific for LMS.
    // Actually, schema: batchId: v.optional(v.id("batches")).
    // Convex allows querying optional fields but `null` vs missing can be tricky. Let's just collect the ones for this batch.
    const announcements = batchAnnouncements.filter((a) => !a.status || a.status === "Published");

    // Fetch read states
    const readRecords = await Promise.all(
      announcements.map((a) =>
        ctx.db
          .query("announcementReads")
          .withIndex("by_user_announcement", (q) =>
            q.eq("userId", userId).eq("announcementId", a._id)
          )
          .first()
      )
    );

    return announcements.map((ann, idx) => ({
      ...ann,
      isRead: !!readRecords[idx],
    })).sort((a, b) => b.createdAt - a.createdAt); // newest first
  },
});

export const markAnnouncementRead = mutation({
  args: {
    batchId: v.id("batches"),
    announcementId: v.id("announcements"),
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return;
    const userId = user._id;

    const existing = await ctx.db
      .query("announcementReads")
      .withIndex("by_user_announcement", (q) =>
        q.eq("userId", userId).eq("announcementId", args.announcementId)
      )
      .first();

    if (!existing) {
      await ctx.db.insert("announcementReads", {
        userId,
        announcementId: args.announcementId,
        batchId: args.batchId,
        readAt: Date.now(),
      });
    }
  },
});

export const markSessionAttendance = mutation({
  args: {
    sessionId: v.id("liveClasses"),
    attendanceSource: v.string(), // "live_join" | "recording_watch"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated caller");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) {
      throw new Error("User record not found");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status === "Cancelled") {
      return {
        success: false,
        attendanceId: undefined,
        alreadyExisted: false,
        status: undefined,
        reason: "Session is cancelled",
      };
    }

    // Verify enrollment for students
    const isStaffOrAdmin =
      user.role === "admin" ||
      user.role === "superadmin" ||
      user.role === "instructor" ||
      user.role === "staff";

    if (!isStaffOrAdmin) {
      const userEnrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect();

      const enrollment = userEnrollments.find(
        (e) => e.batchId === session.batchId && e.status === "active"
      );

      if (!enrollment) {
        throw new Error("Student is not enrolled in this batch");
      }
    }

    // Idempotent check: query index by_user_live_class
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_user_live_class", (q) =>
        q.eq("userId", user._id).eq("liveClassId", args.sessionId)
      )
      .first();

    const source = args.attendanceSource === "recording_watch" ? "recording_watch" : "live_join";

    if (existing) {
      return {
        success: true,
        attendanceId: existing._id,
        alreadyExisted: true,
        status: existing.status,
        reason: undefined,
      };
    }

    // Insert new attendance record
    const attendanceId = await ctx.db.insert("attendance", {
      userId: user._id,
      batchId: session.batchId,
      liveClassId: args.sessionId,
      status: "Present",
      attendanceSource: source,
      markedAt: Date.now(),
    });

    // Log student activity
    const batch = await ctx.db.get(session.batchId);
    if (batch) {
      await ctx.db.insert("activities", {
        userId: user._id,
        courseId: batch.courseId,
        batchId: session.batchId,
        type: source === "recording_watch" ? "Recording Watched" : "Live Class Attended",
        title: source === "recording_watch"
          ? `Watched recording: ${session.title}`
          : `Attended live class: ${session.title}`,
        timestamp: Date.now(),
        resourceId: session._id,
      });
    }

    // Recalculate student attendance percentage for batch
    const allBatchClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", session.batchId))
      .collect();

    const publishedClasses = allBatchClasses.filter((c) => c.status !== "Draft");

    const userAttendances = await ctx.db
      .query("attendance")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    const validStatuses = ["Present", "Late", "Excused"];
    const presentCount = userAttendances.filter(
      (a) => a.batchId === session.batchId && validStatuses.includes(a.status)
    ).length;

    const totalCount = Math.max(1, publishedClasses.length);
    const newPct = Math.min(100, Math.round((presentCount / totalCount) * 100));

    const userEnrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    const activeEnrollment = userEnrollments.find(
      (e) => e.batchId === session.batchId
    );

    if (activeEnrollment) {
      await ctx.db.patch(activeEnrollment._id, { attendancePercentage: newPct });
    }

    return {
      success: true,
      attendanceId: attendanceId as string,
      alreadyExisted: false,
      status: "Present",
      reason: undefined,
    };
  },
});

export const getStudentAttendanceForSession = query({
  args: { sessionId: v.id("liveClasses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    return await ctx.db
      .query("attendance")
      .withIndex("by_user_live_class", (q) =>
        q.eq("userId", user._id).eq("liveClassId", args.sessionId)
      )
      .first();
  },
});
