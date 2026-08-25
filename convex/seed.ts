import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedCourseAndEnroll = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // 1. Create or get user
    let user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId)).unique();
    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: "student@example.com",
        name: "Test Student",
        role: "student",
        avatarUrl: "",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    // 2. Create or get course
    let course = await ctx.db.query("courses").withIndex("by_slug", q => q.eq("slug", "ai-build-sprint")).unique();
    if (!course) {
      const courseId = await ctx.db.insert("courses", {
        slug: "ai-build-sprint",
        title: "Build software with AI.",
        category: "AI Build Sprint",
        description: "Learn modern web development by shipping real projects with AI. No prior coding experience required.",
        price: 999,
        coverImageId: "mock",
        coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        instructorName: "VibeLogic Studio",
        instructorRole: "Studio",
        instructorBio: "Learn the way software gets made.",
        syllabus: ["AI development workflow", "Prompt & context engineering", "React & component thinking", "Next.js & modern routing", "Tailwind CSS", "Authentication with Clerk", "Convex & real-time CRUD", "Gemini API", "GitHub, debugging & deployment"],
        isActive: true,
        createdAt: Date.now(),
      });
      course = await ctx.db.get(courseId);
    }

    // 3. Create or get batch
    let batch = await ctx.db.query("batches").withIndex("by_course_id", q => q.eq("courseId", course!._id)).first();
    if (!batch) {
      const batchId = await ctx.db.insert("batches", {
        courseId: course!._id,
        title: "Cohort 01",
        startDate: Date.now() + 86400000, // Starts tomorrow
        endDate: Date.now() + (86400000 * 7), // 7 days
        capacity: 50,
        enrolledCount: 1,
        status: "upcoming",
        whatsappLink: "https://chat.whatsapp.com/mock",
      });
      batch = await ctx.db.get(batchId);
    }

    // 4. Enroll user
    const existingEnrollment = await ctx.db.query("enrollments")
      .withIndex("by_user_id", q => q.eq("userId", user!._id))
      .filter(q => q.eq(q.field("courseId"), course!._id))
      .first();

    if (!existingEnrollment) {
      await ctx.db.insert("enrollments", {
        userId: user!._id,
        courseId: course!._id,
        batchId: batch!._id,
        status: "active",
        progress: 0,
        enrolledAt: Date.now(),
      });
    }

    // 5. Create some upcoming classes
    const existingClasses = await ctx.db.query("liveClasses").withIndex("by_batch_id", q => q.eq("batchId", batch!._id)).collect();
    if (existingClasses.length === 0) {
      await ctx.db.insert("liveClasses", {
        batchId: batch!._id,
        title: "Day 1: Portfolio Website",
        startTime: Date.now() + 86400000,
        endTime: Date.now() + 86400000 + 7200000, // 2 hours
        meetingLink: "https://meet.google.com/mock",
      });
    }

    // 6. Create announcements
    const existingAnnouncements = await ctx.db.query("announcements").withIndex("by_batch_id", q => q.eq("batchId", batch!._id)).collect();
    if (existingAnnouncements.length === 0) {
      await ctx.db.insert("announcements", {
        batchId: batch!._id,
        title: "Welcome to Cohort 01!",
        content: "Make sure to join the WhatsApp group before our first live session tomorrow. All communications will happen there.",
        createdAt: Date.now(),
      });
    }

    return "Seeded successfully!";
  }
});
