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
      
    // Instructor Details
    let instructor = null;
    if (course.instructorName) {
      instructor = {
        name: course.instructorName,
        role: course.instructorRole || "Instructor"
      };
    } else if (batch.instructorName) {
      instructor = {
        name: batch.instructorName,
        role: "Instructor"
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

export const getRecordingsData = query({
  args: {
    batchId: v.id("batches")
  },
  handler: async (ctx, args) => {
    const user = await requireStudentEnrolledInBatch(ctx, args.batchId);
    if (!user) return null;
    const userId = user._id;

    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    // Filter to only recordings (must have recordingUrl and be published or have no status)
    const recordings = liveClasses.filter(
      (c) => c.recordingUrl && (!c.status || c.status === "Published")
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
      return {
        ...rec,
        watchProgress: progress || null,
      };
    });

    return recordingsWithProgress;
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
