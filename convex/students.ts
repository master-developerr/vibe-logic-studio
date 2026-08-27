import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getUserDashboard = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const targetClerkId = identity ? identity.subject : args.clerkId;

    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", targetClerkId)).unique();
    if (!user) return null;

    const enrollments = await ctx.db.query("enrollments").withIndex("by_user_id", q => q.eq("userId", user._id)).collect();
    const activeEnrollments = enrollments.filter(e => e.status === "active");

    const coursesData = await Promise.all(
      activeEnrollments.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        const batch = await ctx.db.get(enrollment.batchId);
        
        return {
          enrollmentId: enrollment._id,
          progress: enrollment.progress,
          course: course ? {
            id: course._id,
            slug: course.slug,
            title: course.title,
            category: course.category,
            coverImageUrl: course.coverImageUrl,
            instructorName: batch?.instructorName || course.instructorName,
          } : null,
          batch: batch ? {
            id: batch._id,
            title: batch.title,
            instructorName: batch.instructorName,
            startDate: batch.startDate,
            endDate: batch.endDate,
          } : null,
        };
      })
    );

    // Fetch announcements for the active batches (or platform wide)
    const batchIds = activeEnrollments.map(e => e.batchId);
    
    // We can just fetch all announcements and filter for this user's batches or platform wide (batchId is null/undefined)
    const allAnnouncements = await ctx.db.query("announcements").order("desc").take(50);
    const relevantAnnouncements = allAnnouncements.filter(a => 
      a.batchId === undefined || batchIds.some(id => id === a.batchId)
    ).slice(0, 5); // Take top 5

    // Fetch upcoming classes across all enrolled batches
    let upcomingClasses = [] as any[];
    for (const batchId of batchIds) {
      const classes = await ctx.db.query("liveClasses").withIndex("by_batch_id", q => q.eq("batchId", batchId)).collect();
      upcomingClasses = [...upcomingClasses, ...classes];
    }
    
    // Filter for upcoming and sort
    const now = Date.now();
    upcomingClasses = upcomingClasses
      .filter(c => c.startTime > now)
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 3); // next 3

    // Fetch available courses (active courses the user is not enrolled in)
    const allCourses = await ctx.db.query("courses").withIndex("by_is_active", q => q.eq("isActive", true)).collect();
    const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
    const availableCourses = allCourses
      .filter(c => !enrolledCourseIds.has(c._id))
      .map(c => ({
        id: c._id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        description: c.description,
        price: c.price,
        coverImageUrl: c.coverImageUrl,
        instructorName: c.instructorName,
      }));

    return {
      user: {
        id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
      },
      enrollments: coursesData.filter(d => d.course !== null),
      availableCourses,
      announcements: relevantAnnouncements,
      upcomingClasses,
    };
  },
});

export const getCourseLMS = query({
  args: { clerkId: v.string(), courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const targetClerkId = identity ? identity.subject : args.clerkId;

    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", targetClerkId)).unique();
    if (!user) return null;

    const enrollment = await ctx.db.query("enrollments")
      .withIndex("by_user_id", q => q.eq("userId", user._id))
      .filter(q => q.eq(q.field("courseId"), args.courseId))
      .first();

    if (!enrollment || enrollment.status !== "active") {
      return null; // Not enrolled or not active
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) return null;

    const batch = await ctx.db.get(enrollment.batchId);
    
    const studyMaterials = await ctx.db.query("studyMaterials")
      .withIndex("by_course_id", q => q.eq("courseId", args.courseId))
      .collect();

    const liveClasses = await ctx.db.query("liveClasses")
      .withIndex("by_batch_id", q => q.eq("batchId", enrollment.batchId))
      .collect();

    return {
      course: {
        id: course._id,
        title: course.title,
        slug: course.slug,
      },
      batch: batch ? {
        id: batch._id,
        title: batch.title,
        whatsappLink: batch.whatsappLink,
      } : null,
      studyMaterials: studyMaterials.sort((a, b) => a.order - b.order),
      liveClasses: liveClasses.sort((a, b) => a.startTime - b.startTime),
    };
  },
});

export const updateProfile = mutation({
  args: { clerkId: v.string(), name: v.string(), avatarUrl: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const targetClerkId = identity ? identity.subject : args.clerkId;

    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", targetClerkId)).unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      name: args.name,
      ...(args.avatarUrl ? { avatarUrl: args.avatarUrl } : {}),
    });
    
    return { success: true };
  }
});
