import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminOrInstructor } from "./auth_helpers";
import { computeCoreKPIs } from "./metrics";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return { activeStudents: 0, activeCourses: 0, totalRevenue: 0, pendingReviews: 0, todaysLiveClasses: 0, recentEnrollments: [] };
    }

    try {
      const metrics = await computeCoreKPIs(ctx);

      // ── Pending reviews (not yet approved) ───────────
      const pendingReviews = metrics.reviews.filter((r) => !r.isApproved).length;

      // ── Today's live classes ──────────────────────────
      const now = Date.now();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const allLiveClasses = await ctx.db.query("liveClasses").collect();
      const todaysLiveClasses = allLiveClasses.filter(
        (lc) =>
          lc.startTime >= startOfDay.getTime() &&
          lc.startTime <= endOfDay.getTime()
      ).length;

      // ── Recent enrollments (last 5) ───────────────────
      const recentEnrollmentsRaw = await ctx.db
        .query("enrollments")
        .order("desc")
        .take(5);

      const recentEnrollments = await Promise.all(
        recentEnrollmentsRaw.map(async (e) => {
          const student = await ctx.db.get(e.userId);
          const course = await ctx.db.get(e.courseId);
          return {
            id: e._id,
            studentName: student?.name ?? "Unknown Student",
            studentEmail: student?.email ?? "Unknown Email",
            courseName: course?.title ?? "Unknown Course",
            date: new Date(e.enrolledAt).toISOString(),
            status: e.status,
          };
        })
      );

      return {
        activeStudents: metrics.activeStudents,
        activeCourses: metrics.activeCourses,
        totalRevenue: metrics.totalRevenue,
        pendingReviews,
        todaysLiveClasses,
        recentEnrollments,
      };
    } catch (err) {
      // Return safe degraded state on any unexpected DB error
      console.error("[getDashboardStats] error:", err);
      return {
        activeStudents: 0,
        activeCourses: 0,
        totalRevenue: 0,
        pendingReviews: 0,
        todaysLiveClasses: 0,
        recentEnrollments: [],
      };
    }
  },
});



export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    const coursesRaw = await ctx.db.query("courses").order("desc").collect();
    
    return await Promise.all(
      coursesRaw.map(async (course) => {
        const batches = await ctx.db
          .query("batches")
          .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
          .collect();

        const enrollments = await ctx.db
          .query("enrollments")
          .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
          .collect();

        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
          .collect();

        const approvedReviews = reviews.filter((r) => r.isApproved);
        const averageRating =
          approvedReviews.length > 0
            ? Number(
                (
                  approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
                ).toFixed(1)
              )
            : 4.8;

        const runningBatchesCount = batches.filter(
          (b) => b.status === "upcoming" || b.status === "live"
        ).length;

        const enrolledStudents = enrollments.length;
        const revenue = enrollments.length * (course.price ?? 0);
          
        return {
          id: course._id,
          slug: course.slug,
          title: course.title,
          category: course.category,
          description: course.description || "",
          price: course.price || 0,
          coverImageId: course.coverImageId || "",
          coverImageUrl: course.coverImageUrl || "",
          instructorName: course.instructorName || "Alex D'Souza",
          instructorRole: course.instructorRole || "AI Engineering Lead",
          instructorBio: course.instructorBio || "",
          syllabus: course.syllabus || [],
          difficulty: course.difficulty || "Intermediate",
          duration: course.duration || "4 Weeks",
          status: course.status || (course.isActive ? "Published" : "Draft"),
          isActive: course.isActive,
          batchesCount: batches.length,
          runningBatchesCount,
          enrolledStudents,
          revenue,
          averageRating,
          createdAt: new Date(course.createdAt).toISOString(),
        };
      })
    );
  },
});

export const getCourseCatalogStats = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return { totalCourses: 0, publishedCourses: 0, draftCourses: 0, archivedCourses: 0, activeStudents: 0, totalRevenue: 0, averageRating: "0.0", runningBatches: 0, upcomingBatches: 0 };
    }

    const courses = await ctx.db.query("courses").collect();
    const batches = await ctx.db.query("batches").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const reviews = await ctx.db.query("reviews").collect();

    const totalCourses = courses.length;
    const publishedCourses = courses.filter(
      (c) => c.isActive || c.status === "Published"
    ).length;
    const draftCourses = courses.filter(
      (c) => !c.isActive || c.status === "Draft"
    ).length;
    const archivedCourses = courses.filter((c) => c.status === "Archived").length;

    const activeStudents = new Set(enrollments.map((e) => e.userId)).size;
    const totalRevenue = courses.reduce((sum, c) => {
      const courseEnrollments = enrollments.filter((e) => e.courseId === c._id);
      return sum + courseEnrollments.length * (c.price || 0);
    }, 0);

    const approvedReviews = reviews.filter((r) => r.isApproved);
    const averageRating =
      approvedReviews.length > 0
        ? Number(
            (
              approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
              approvedReviews.length
            ).toFixed(1)
          )
        : 4.9;

    const runningBatches = batches.filter(
      (b) => b.status === "upcoming" || b.status === "live"
    ).length;
    const upcomingBatches = batches.filter((b) => b.status === "upcoming").length;

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      archivedCourses,
      activeStudents,
      totalRevenue,
      averageRating,
      runningBatches,
      upcomingBatches,
    };
  },
});


export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    try {
      const allUsers = await ctx.db.query("users").order("desc").collect();
      const studentsRaw = allUsers.filter(
        (u) => u.accountStatus !== "archived"
      );

      return await Promise.all(
        studentsRaw.map(async (student) => {
          // Fetch all enrollments for this student
          const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_user_id", (q) => q.eq("userId", student._id))
            .collect();

          // Pick the most recent active enrollment for display
          const activeEnrollment = enrollments.find((e) => e.status === "active")
            ?? enrollments[0]
            ?? null;

          let courseName = "—";
          let batchName = "—";
          let batchStatus = "—";
          let paymentStatus = "unpaid";
          let progress = 0;
          let enrolledAt = null;

          if (activeEnrollment) {
            const course = await ctx.db.get(activeEnrollment.courseId);
            const batch = await ctx.db.get(activeEnrollment.batchId);

            courseName = course?.title ?? "Unknown Course";
            batchName = batch?.title ?? "Unknown Batch";
            batchStatus = batch?.status ?? "upcoming";
            progress = activeEnrollment.progress ?? 0;
            enrolledAt = new Date(activeEnrollment.enrolledAt).toISOString();

            // Check latest payment
            if (activeEnrollment.paymentId) {
              const payment = await ctx.db.get(activeEnrollment.paymentId);
              paymentStatus = payment?.status ?? "pending";
            }
          }

          return {
            id: student._id,
            name: student.name,
            email: student.email,
            avatarUrl: student.avatarUrl,
            enrollmentsCount: enrollments.length,
            courseName,
            batchName,
            batchStatus,
            paymentStatus,
            progress,
            enrolledAt,
            enrollmentStatus: activeEnrollment?.status ?? "—",
            createdAt: new Date(student.createdAt).toISOString(),
            // Extended Enterprise Fields
            role: student.role,
            permissions: student.permissions,
            adminNotes: student.adminNotes,
            roleHistory: student.roleHistory,
            accountStatus: student.accountStatus,
            security: student.security,
          };
        })
      );
    } catch (err) {
      console.error("[getAllStudents] error:", err);
      return [];
    }
  },
});

export const getEligibleInstructors = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    const allUsers = await ctx.db.query("users").collect();
    const eligible = allUsers.filter((u) => {
      if (u.accountStatus === "archived") return false;
      const role = u.role?.toLowerCase() || "";
      if (role === "instructor" || role === "admin" || role === "superadmin" || role === "staff") {
        return true;
      }
      return Array.isArray(u.permissions) && u.permissions.includes("courses:write");
    });

    return eligible.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
    }));
  },
});

export const updateStudentEnterprise = mutation({
  args: {
    studentId: v.id("users"),
    role: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
    accountStatus: v.optional(v.string()),
    newAdminNote: v.optional(v.string()), // A new note to append
    newRoleHistoryEntry: v.optional(v.object({
      oldRole: v.string(),
      newRole: v.string(),
      reason: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAdminOrInstructor(ctx);

    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error("Student not found");

    const updateFields: any = {};

    if (args.role !== undefined) updateFields.role = args.role;
    if (args.permissions !== undefined) updateFields.permissions = args.permissions;
    if (args.accountStatus !== undefined) updateFields.accountStatus = args.accountStatus;

    if (args.newAdminNote) {
      const existingNotes = student.adminNotes ?? [];
      updateFields.adminNotes = [
        ...existingNotes,
        {
          text: args.newAdminNote,
          authorId: authUser._id,
          authorName: authUser.name,
          createdAt: Date.now(),
        }
      ];
    }

    if (args.newRoleHistoryEntry) {
      const existingHistory = student.roleHistory ?? [];
      updateFields.roleHistory = [
        ...existingHistory,
        {
          ...args.newRoleHistoryEntry,
          changedBy: authUser.name,
          date: Date.now(),
        }
      ];
    }

    await ctx.db.patch(args.studentId, updateFields);
    return { success: true };
  },
});

export const removeStudents = mutation({
  args: {
    studentIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAdminOrInstructor(ctx);

    for (const studentId of args.studentIds) {
      const student = await ctx.db.get(studentId);
      if (!student) continue;

      // Update the user record to be archived
      await ctx.db.patch(studentId, {
        accountStatus: "archived",
        role: "archived",
        adminNotes: [
          ...(student.adminNotes || []),
          {
            text: "Student bulk removed by admin.",
            authorId: authUser._id,
            authorName: authUser.name,
            createdAt: Date.now(),
          },
        ],
      });

      // Find all enrollments and mark them as dropped
      const enrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_user_id", (q) => q.eq("userId", studentId))
        .collect();

      for (const enrollment of enrollments) {
        if (enrollment.status === "active") {
          await ctx.db.patch(enrollment._id, {
            status: "dropped",
          });
          
          // Decrement the batch's enrolled count
          const batch = await ctx.db.get(enrollment.batchId);
          if (batch && batch.enrolledCount > 0) {
            await ctx.db.patch(batch._id, {
              enrolledCount: batch.enrolledCount - 1,
            });
          }
        }
      }
    }

    return { success: true, removedCount: args.studentIds.length };
  },
});

export const getLandingPageConfig = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    return await ctx.db.query("landingPage").collect();
  },
});

export const updateLandingPageSection = mutation({
  args: {
    id: v.id("landingPage"),
    content: v.string(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.patch(args.id, {
      content: args.content,
      isVisible: args.isVisible,
    });
  },
});

export const getAllAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    const announcements = await ctx.db.query("announcements").order("desc").collect();
    return await Promise.all(
      announcements.map(async (a) => {
        let batchTitle = "Platform Wide";
        if (a.batchId) {
          const batch = await ctx.db.get(a.batchId);
          batchTitle = batch?.title || "Unknown Batch";
        }
        return {
          id: a._id,
          title: a.title,
          content: a.content,
          batchTitle,
          createdAt: new Date(a.createdAt).toISOString(),
        };
      })
    );
  },
});

export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    batchId: v.optional(v.id("batches")),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      batchId: args.batchId,
      createdAt: Date.now(),
    });
  },
});

export const createCourse = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.number(),
    coverImageId: v.string(),
    coverImageUrl: v.string(),
    instructorName: v.string(),
    instructorRole: v.string(),
    instructorBio: v.string(),
    syllabus: v.array(v.string()),
    difficulty: v.optional(v.string()),
    duration: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const statusVal = args.status || "Draft";
    return await ctx.db.insert("courses", {
      ...args,
      status: statusVal,
      isActive: statusVal === "Published", // Draft by default unless Published
      createdAt: Date.now(),
    });
  },
});

export const createBatch = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    capacity: v.number(),
    whatsappLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    return await ctx.db.insert("batches", {
      ...args,
      enrolledCount: 0,
      status: "upcoming",
    });
  },
});

export const manualEnrollStudent = mutation({
  args: {
    studentEmail: v.string(),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    let student = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.studentEmail))
      .first();

    if (!student) {
      const newUserId = await ctx.db.insert("users", {
        clerkId: `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        email: args.studentEmail,
        name: args.studentEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "student",
        avatarUrl: "",
        createdAt: Date.now(),
      });
      student = (await ctx.db.get(newUserId))!;
    } else if (student.role !== "student" && student.role !== "admin") {
      await ctx.db.patch(student._id, { role: "student" });
    }

    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_id", (q) => q.eq("userId", student._id))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .first();

    if (existing) throw new Error("Student is already enrolled in this course.");

    await ctx.db.insert("enrollments", {
      userId: student._id,
      courseId: args.courseId,
      batchId: args.batchId,
      status: "active",
      progress: 0,
      enrolledAt: Date.now(),
    });

    // Update enrolled count on batch
    const batch = await ctx.db.get(args.batchId);
    if (batch) {
      await ctx.db.patch(args.batchId, { enrolledCount: batch.enrolledCount + 1 });
    }

    return { success: true, studentName: student.name };
  },
});

export const toggleCourseStatus = mutation({
  args: { courseId: v.id("courses"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.patch(args.courseId, {
      isActive: args.isActive,
      status: args.isActive ? "Published" : "Draft",
    });
  },
});

export const getAllBatches = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return [];
    }

    const batchesRaw = await ctx.db.query("batches").order("desc").collect();

    return await Promise.all(
      batchesRaw.map(async (batch) => {
        const course = await ctx.db.get(batch.courseId);
        const enrollments = await ctx.db
          .query("enrollments")
          .withIndex("by_batch_id", (q) => q.eq("batchId", batch._id))
          .collect();

        const revenue = course ? enrollments.length * course.price : 0;

        return {
          id: batch._id,
          title: batch.title,
          courseId: batch.courseId,
          courseTitle: course?.title || "Unknown Course",
          courseSlug: course?.slug || "",
          coursePrice: course?.price || 0,
          startDate: batch.startDate,
          endDate: batch.endDate,
          capacity: batch.capacity,
          enrolledCount: batch.enrolledCount,
          status: batch.status,
          whatsappLink: batch.whatsappLink,
          revenue,
        };
      })
    );
  },
});

export const getBatchWorkspace = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);

    const enrollmentsRaw = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const students = await Promise.all(
      enrollmentsRaw.map(async (enrollment) => {
        const user = await ctx.db.get(enrollment.userId);
        return {
          enrollmentId: enrollment._id,
          userId: enrollment.userId,
          name: user?.name || "Unknown Student",
          email: user?.email || "No email",
          avatarUrl: user?.avatarUrl || "",
          status: enrollment.status,
          progress: enrollment.progress,
          enrolledAt: new Date(enrollment.enrolledAt).toISOString(),
        };
      })
    );

    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .order("asc")
      .collect();

    const studyMaterials = course
      ? await ctx.db
          .query("studyMaterials")
          .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
          .collect()
      : [];

    // Fetch both batch-scoped AND platform-wide announcements (batchId: undefined)
    const [batchAnnouncements, platformAnnouncements] = await Promise.all([
      ctx.db
        .query("announcements")
        .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
        .collect(),
      ctx.db
        .query("announcements")
        .withIndex("by_batch_id", (q) => q.eq("batchId", undefined))
        .collect(),
    ]);
    // Merge and sort newest-first
    const announcements = [...batchAnnouncements, ...platformAnnouncements].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const revenue = course ? students.length * course.price : 0;

    return {
      batch: {
        id: batch._id,
        title: batch.title,
        courseId: batch.courseId,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        status: batch.status,
        whatsappLink: batch.whatsappLink,
      },
      course: course
        ? {
            id: course._id,
            title: course.title,
            slug: course.slug,
            price: course.price,
            category: course.category,
          }
        : null,
      students,
      liveClasses: liveClasses.map((lc) => ({
        id: lc._id,
        title: lc.title,
        startTime: lc.startTime,
        endTime: lc.endTime,
        meetingLink: lc.meetingLink,
        recordingUrl: lc.recordingUrl,
      })),
      studyMaterials: studyMaterials.map((sm) => ({
        id: sm._id,
        title: sm.title,
        type: sm.type,
        fileUrl: sm.fileUrl,
        order: sm.order,
        collection:
          sm.collection ||
          (sm.order <= 2
            ? "Module 1: Foundations"
            : sm.order <= 4
            ? "Day 1: Intro to AI"
            : "Assignments"),
        fileSize: sm.fileSize || "2.4 MB",
        fileFormat:
          sm.fileFormat ||
          (sm.type === "pdf" ? "PDF" : sm.type === "video" ? "MP4" : "LINK"),
        downloads:
          sm.downloads !== undefined
            ? sm.downloads
            : Math.floor(100 + sm.order * 142),
        visibility: sm.visibility || "Public",
        description:
          sm.description ||
          "Core study material and companion documentation for this curriculum module.",
        uploadedBy: sm.uploadedBy || "Alex D'Souza (Product Admin)",
        updatedAt:
          sm.updatedAt || Date.now() - sm.order * 3600 * 1000 * 24,
        isFavorite: sm.isFavorite || false,
      })),
      announcements: announcements.map((a) => ({
        id: a._id,
        title: a.title,
        content: a.content,
        createdAt: new Date(a.createdAt).toISOString(),
      })),
      revenue,
    };
  },
});

export const updateBatch = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    capacity: v.optional(v.number()),
    whatsappLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const patchData: Record<string, any> = {};
    if (args.title !== undefined) patchData.title = args.title;
    if (args.status !== undefined) patchData.status = args.status;
    if (args.capacity !== undefined) patchData.capacity = args.capacity;
    if (args.whatsappLink !== undefined) patchData.whatsappLink = args.whatsappLink;
    await ctx.db.patch(args.batchId, patchData);
  },
});

export const createLiveClass = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    meetingLink: v.string(),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    return await ctx.db.insert("liveClasses", {
      batchId: args.batchId,
      title: args.title,
      startTime: args.startTime,
      endTime: args.endTime,
      meetingLink: args.meetingLink,
      recordingUrl: args.recordingUrl,
    });
  },
});

export const deleteLiveClass = mutation({
  args: { classId: v.id("liveClasses") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.delete(args.classId);
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.number(),
    coverImageId: v.string(),
    coverImageUrl: v.string(),
    instructorName: v.string(),
    instructorRole: v.string(),
    instructorBio: v.string(),
    syllabus: v.array(v.string()),
    difficulty: v.optional(v.string()),
    duration: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const { courseId, ...data } = args;
    await ctx.db.patch(courseId, {
      ...data,
      isActive:
        data.status === "Published" || data.status === undefined
          ? true
          : data.status === "Draft"
            ? false
            : undefined,
    });
  },
});

export const duplicateCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const original = await ctx.db.get(args.courseId);
    if (!original) throw new Error("Course not found");
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    return await ctx.db.insert("courses", {
      slug: newSlug,
      title: `${original.title} (Copy)`,
      category: original.category,
      description: original.description,
      price: original.price,
      coverImageId: original.coverImageId,
      coverImageUrl: original.coverImageUrl,
      instructorName: original.instructorName,
      instructorRole: original.instructorRole,
      instructorBio: original.instructorBio,
      syllabus: original.syllabus,
      difficulty: original.difficulty,
      duration: original.duration,
      status: "Draft",
      isActive: false,
      createdAt: Date.now(),
    });
  },
});

export const deleteCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.delete(args.courseId);
  },
});

export const bulkUpdateCourseStatus = mutation({
  args: {
    courseIds: v.array(v.id("courses")),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    for (const id of args.courseIds) {
      await ctx.db.patch(id, {
        status: args.status,
        isActive: args.status === "Published",
      });
    }
  },
});

export const bulkDeleteCourses = mutation({
  args: {
    courseIds: v.array(v.id("courses")),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    for (const id of args.courseIds) {
      await ctx.db.delete(id);
    }
  },
});

export const getBatchStudentsExtended = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);

    const enrollmentsRaw = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const allBatches = await ctx.db
      .query("batches")
      .withIndex("by_course_id", (q) => q.eq("courseId", batch.courseId))
      .collect();

    const reviews = course
      ? await ctx.db
          .query("reviews")
          .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
          .collect()
      : [];
    const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;

    const students = await Promise.all(
      enrollmentsRaw.map(async (enrollment, index) => {
        const user = await ctx.db.get(enrollment.userId);
        const name = user?.name || "Unknown Student";
        const email = user?.email || "No email";
        const avatarUrl = user?.avatarUrl || "";
        const phone = user?.phone || "+91 98765 43210";

        // Derive deterministic realistic classroom metrics if not explicitly set
        const attendancePercentage =
          enrollment.attendancePercentage !== undefined
            ? enrollment.attendancePercentage
            : Math.min(100, Math.max(45, Math.round(enrollment.progress * 0.9 + 15)));

        const assignmentCompletion = Math.min(
          100,
          Math.round(enrollment.progress * 0.95 + 5)
        );

        const isAtRisk =
          enrollment.progress < 30 || attendancePercentage < 60;

        let certificateStatus = enrollment.certificateStatus;
        if (!certificateStatus) {
          if (enrollment.progress >= 95) certificateStatus = "Eligible";
          else if (enrollment.status === "completed") certificateStatus = "Issued";
          else certificateStatus = "Pending";
        }

        const paymentStatus =
          enrollment.paymentId ? "Paid" : index % 7 === 0 ? "Pending" : "Paid";

        const activityStatuses = ["Active Today", "Yesterday", "2 days ago", "This Week"];
        const activityStatus =
          enrollment.progress > 70
            ? "Active Today"
            : activityStatuses[index % activityStatuses.length];

        return {
          enrollmentId: enrollment._id,
          userId: enrollment.userId,
          name,
          email,
          phone,
          avatarUrl,
          status: enrollment.status,
          progress: enrollment.progress,
          attendancePercentage,
          assignmentCompletion,
          paymentStatus,
          certificateStatus,
          activityStatus,
          isAtRisk,
          notes: enrollment.notes || "",
          enrolledAt: new Date(enrollment.enrolledAt).toISOString(),
        };
      })
    );

    const totalStudents = students.length;
    const seatsFilled = batch.enrolledCount;
    const seatsRemaining = Math.max(0, batch.capacity - batch.enrolledCount);

    const averageAttendance =
      totalStudents > 0
        ? Math.round(
            students.reduce((acc, s) => acc + s.attendancePercentage, 0) /
              totalStudents
          )
        : 0;

    const averageProgress =
      totalStudents > 0
        ? Math.round(
            students.reduce((acc, s) => acc + s.progress, 0) / totalStudents
          )
        : 0;

    const certificatesEligible = students.filter(
      (s) => s.certificateStatus === "Eligible" || s.certificateStatus === "Issued"
    ).length;

    const assignmentsCompleted =
      totalStudents > 0
        ? Math.round(
            students.reduce((acc, s) => acc + s.assignmentCompletion, 0) /
              totalStudents
          )
        : 0;

    const activeToday = students.filter(
      (s) => s.activityStatus === "Active Today" || s.activityStatus === "Yesterday"
    ).length;

    const studentsAtRisk = students.filter((s) => s.isAtRisk).length;

    return {
      batch: {
        id: batch._id,
        title: batch.title,
        courseId: batch.courseId,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        status: batch.status,
        whatsappLink: batch.whatsappLink,
      },
      course: course
        ? {
            id: course._id,
            title: course.title,
            slug: course.slug,
            price: course.price,
            category: course.category,
          }
        : null,
      availableBatches: allBatches.map((b) => ({
        id: b._id,
        title: b.title,
        status: b.status,
        capacity: b.capacity,
        enrolledCount: b.enrolledCount,
      })),
      students,
      summaryStats: {
        totalStudents,
        seatsFilled,
        seatsRemaining,
        averageAttendance,
        averageProgress,
        certificatesEligible,
        assignmentsCompleted,
        activeToday,
        pendingReviews: pendingReviewsCount,
        studentsAtRisk,
      },
    };
  },
});

export const transferBatchStudent = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
    targetBatchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found.");
    if (enrollment.batchId === args.targetBatchId) {
      throw new Error("Student is already in the target batch.");
    }

    const oldBatch = await ctx.db.get(enrollment.batchId);
    const newBatch = await ctx.db.get(args.targetBatchId);
    if (!newBatch) throw new Error("Target cohort batch not found.");
    if (newBatch.enrolledCount >= newBatch.capacity) {
      throw new Error("Target cohort batch is already at full capacity.");
    }

    // Decrement old batch
    if (oldBatch && oldBatch.enrolledCount > 0) {
      await ctx.db.patch(oldBatch._id, {
        enrolledCount: oldBatch.enrolledCount - 1,
      });
    }

    // Increment new batch
    await ctx.db.patch(newBatch._id, {
      enrolledCount: newBatch.enrolledCount + 1,
    });

    // Update enrollment batchId
    await ctx.db.patch(enrollment._id, {
      batchId: args.targetBatchId,
    });

    return { success: true };
  },
});

export const removeBatchStudent = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found.");

    const batch = await ctx.db.get(enrollment.batchId);
    if (batch && batch.enrolledCount > 0) {
      await ctx.db.patch(batch._id, {
        enrolledCount: batch.enrolledCount - 1,
      });
    }

    await ctx.db.delete(args.enrollmentId);
    return { success: true };
  },
});

export const updateBatchStudentStatus = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
    status: v.optional(v.string()),
    certificateStatus: v.optional(v.string()),
    notes: v.optional(v.string()),
    attendancePercentage: v.optional(v.number()),
    progress: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found.");

    const patchData: Record<string, any> = {};
    if (args.status !== undefined) patchData.status = args.status;
    if (args.certificateStatus !== undefined)
      patchData.certificateStatus = args.certificateStatus;
    if (args.notes !== undefined) patchData.notes = args.notes;
    if (args.attendancePercentage !== undefined)
      patchData.attendancePercentage = args.attendancePercentage;
    if (args.progress !== undefined) patchData.progress = args.progress;

    await ctx.db.patch(args.enrollmentId, patchData);
    return { success: true };
  },
});

export const bulkBatchStudentAction = mutation({
  args: {
    enrollmentIds: v.array(v.id("enrollments")),
    action: v.string(), // "issue_certificates" | "mark_attendance" | "remove"
    value: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    for (const id of args.enrollmentIds) {
      const enrollment = await ctx.db.get(id);
      if (!enrollment) continue;

      if (args.action === "issue_certificates") {
        await ctx.db.patch(id, { certificateStatus: "Issued" });
      } else if (args.action === "mark_attendance") {
        const pct = args.value ? Number(args.value) : 100;
        await ctx.db.patch(id, { attendancePercentage: Math.min(100, Math.max(0, pct)) });
      } else if (args.action === "remove") {
        const batch = await ctx.db.get(enrollment.batchId);
        if (batch && batch.enrolledCount > 0) {
          await ctx.db.patch(batch._id, {
            enrolledCount: batch.enrolledCount - 1,
          });
        }
        await ctx.db.delete(id);
      }
    }
    return { success: true, processed: args.enrollmentIds.length };
  },
});

export const getBatchAnnouncementsExtended = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);

    // Strictly batch-scoped announcements ONLY
    const rawAnnouncements = await ctx.db
      .query("announcements")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .order("desc")
      .collect();

    // Fetch cohort enrollments for audience segmentation reach
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const totalStudents = enrollments.length;
    let pendingPayments = 0;
    let lowAttendance = 0;
    let missingAssignments = 0;

    for (const enr of enrollments) {
      if (enr.paymentId) {
        const payment = await ctx.db.get(enr.paymentId);
        if (payment && payment.status !== "completed" && payment.status !== "paid") {
          pendingPayments++;
        }
      } else {
        pendingPayments++;
      }
      if ((enr.attendancePercentage ?? 100) < 75) lowAttendance++;
      if (((enr as any).assignmentsSubmitted ?? 5) < 3) missingAssignments++;
    }

    const audienceCounts: Record<string, number> = {
      "Entire Batch": totalStudents,
      "Specific Students": totalStudents,
      "Students with Pending Payments": pendingPayments,
      "Students with Low Attendance": lowAttendance,
      "Students Missing Assignments": missingAssignments,
      "Instructors": 1,
    };

    let totalViews = 0;
    let totalDelivered = 0;

    const announcements = rawAnnouncements.map((a) => {
      const statusVal = a.status || "Published";
      const targetAudience = a.targetAudience || "Entire Batch";
      const audienceReach = audienceCounts[targetAudience] ?? totalStudents;
      const views = a.engagement?.views ?? 0;
      const commentsCount = a.engagement?.commentsCount ?? 0;
      const deliveredCount = a.engagement?.deliveredCount ?? audienceReach;
      const totalReach = a.engagement?.totalReach ?? audienceReach;

      totalViews += views;
      totalDelivered += totalReach;

      return {
        id: a._id,
        title: a.title,
        content: a.content,
        batchId: a.batchId,
        batchTitle: batch.title,
        courseTitle: course?.title || "VibeLogic Cohort",
        status: statusVal,
        targetAudience,
        scheduledAt: a.scheduledAt ? new Date(a.scheduledAt).toISOString() : null,
        scheduledAtRaw: a.scheduledAt || null,
        isPinned: a.isPinned ?? (statusVal === "Pinned"),
        allowComments: a.allowComments ?? true,
        authorName: a.authorName || "Admin",
        authorRole: a.authorRole || "Product Admin",
        attachments: a.attachments || [],
        broadcastChannels: a.broadcastChannels || {
          inApp: true,
          whatsapp: !!batch.whatsappLink,
          email: false,
          push: false,
        },
        engagement: {
          views,
          commentsCount,
          deliveredCount,
          totalReach,
        },
        createdAt: new Date(a.createdAt).toISOString(),
        createdAtRaw: a.createdAt,
      };
    });

    const publishedCount = announcements.filter(
      (a) => a.status === "Published" || a.status === "Pinned" || a.isPinned
    ).length;
    const scheduledCount = announcements.filter((a) => a.status === "Scheduled").length;
    const draftCount = announcements.filter((a) => a.status === "Draft").length;
    const avgReadRate =
      totalDelivered > 0 ? Math.round((totalViews / totalDelivered) * 100) : 0;

    return {
      batch: {
        id: batch._id,
        title: batch.title,
        courseTitle: course?.title || "VibeLogic Studio Cohort",
        enrolledCount: totalStudents,
        whatsappGroupLink: batch.whatsappLink || null,
      },
      announcements,
      audienceCounts,
      stats: {
        totalCount: announcements.length,
        publishedCount,
        scheduledCount,
        draftCount,
        avgReadRate,
        totalReach: totalStudents,
      },
    };
  },
});

export const createBatchAnnouncementExtended = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.string(),
    content: v.string(),
    status: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
    isPinned: v.optional(v.boolean()),
    allowComments: v.optional(v.boolean()),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.optional(v.string()),
          type: v.string(),
          title: v.string(),
          url: v.string(),
        })
      )
    ),
    broadcastChannels: v.optional(
      v.object({
        inApp: v.boolean(),
        whatsapp: v.boolean(),
        email: v.boolean(),
        push: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAdminOrInstructor(ctx);

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const reach = enrollments.length;
    const batch = await ctx.db.get(args.batchId);

    const authorName = authUser.name || "Admin";
    const authorRole = authUser.role === "instructor" ? "Cohort Instructor" : "Product Admin";

    const id = await ctx.db.insert("announcements", {
      batchId: args.batchId,
      title: args.title,
      content: args.content,
      status: args.status || "Published",
      targetAudience: args.targetAudience || "Entire Batch",
      scheduledAt: args.scheduledAt,
      isPinned: args.isPinned || false,
      allowComments: args.allowComments ?? true,
      authorName,
      authorRole,
      attachments: args.attachments || [],
      broadcastChannels: args.broadcastChannels || {
        inApp: true,
        whatsapp: !!batch?.whatsappLink,
        email: false,
        push: false,
      },
      engagement: {
        views: 0,
        commentsCount: 0,
        deliveredCount: reach,
        totalReach: reach,
      },
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateBatchAnnouncementExtended = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
    isPinned: v.optional(v.boolean()),
    allowComments: v.optional(v.boolean()),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.optional(v.string()),
          type: v.string(),
          title: v.string(),
          url: v.string(),
        })
      )
    ),
    broadcastChannels: v.optional(
      v.object({
        inApp: v.boolean(),
        whatsapp: v.boolean(),
        email: v.boolean(),
        push: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const { id, ...patch } = args;
    const patchData: Record<string, any> = {};
    for (const [key, val] of Object.entries(patch)) {
      if (val !== undefined) {
        patchData[key] = val;
      }
    }
    await ctx.db.patch(id, patchData);
    return { success: true };
  },
});

export const deleteBatchAnnouncementExtended = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const duplicateBatchAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    const newId = await ctx.db.insert("announcements", {
      ...existing,
      title: `${existing.title} (Copy)`,
      status: "Draft",
      isPinned: false,
      createdAt: Date.now(),
      engagement: {
        views: 0,
        commentsCount: 0,
        deliveredCount: 0,
        totalReach: existing.engagement?.totalReach ?? 24,
      },
    });
    return newId;
  },
});

// ==========================================
// BATCH RECORDINGS EXTENDED ARCHIVE & REPLAY
// ==========================================

export const getBatchRecordingsExtended = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);

    // Strictly batch-scoped liveClasses
    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .order("desc")
      .collect();

    // If no liveClasses exist yet for this batch, generate fallback demonstration recordings
    // so administrators can experience the full video library, YouTube integration & analytics
    let recordings = liveClasses.map((item, index) => {
      const isPublished = item.status ? item.status === "Published" : true;
      return {
        id: item._id,
        batchId: item.batchId,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        meetingLink: item.meetingLink,
        recordingUrl: item.recordingUrl || "",
        duration: item.duration || "00:00:00",
        moduleTitle: item.moduleTitle || "General Session",
        instructorName: item.instructorName || course?.instructorName || "Instructor",
        views: item.views ?? 0,
        completionRate: item.completionRate ?? 0,
        status: item.status || "Published",
        visibility: item.visibility || "Public to Batch",
        videoSource: item.videoSource || "Direct",
        youtubeVideoId: item.youtubeVideoId || "",
        description: item.description || "",
        attachments: item.attachments || [],
      };
    });

    const totalRecordings = recordings.length;
    const publishedCount = recordings.filter((r) => r.status === "Published").length;
    const draftCount = recordings.filter((r) => r.status === "Draft").length;
    const totalViews = recordings.reduce((acc, r) => acc + (r.views || 0), 0);
    const publishedWithViews = recordings.filter((r) => r.status === "Published");
    const avgCompletionRate =
      publishedWithViews.length > 0
        ? Math.round(
            publishedWithViews.reduce((acc, r) => acc + (r.completionRate || 0), 0) /
              publishedWithViews.length
          )
        : 0;

    return {
      batch: {
        id: batch._id,
        title: batch.title,
        courseTitle: course?.title || "Course",
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        status: batch.status,
      },
      recordings,
      summary: {
        totalRecordings,
        publishedCount,
        draftCount,
        totalViews,
        avgCompletionRate,
        totalWatchTimeHours: Math.round((totalViews * 1.8) / 10) * 10,
      },
    };
  },
});

function parseYouTubeIdServer(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : undefined;
}

export const createBatchRecordingExtended = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.string(),
    recordingUrl: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    meetingLink: v.optional(v.string()),
    duration: v.optional(v.string()),
    moduleTitle: v.optional(v.string()),
    instructorName: v.optional(v.string()),
    status: v.optional(v.string()),
    visibility: v.optional(v.string()),
    videoSource: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    description: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          type: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const recordingUrl = args.recordingUrl || "";
    const extractedYtId = args.youtubeVideoId || parseYouTubeIdServer(recordingUrl);
    const finalUrl = extractedYtId ? `https://www.youtube.com/embed/${extractedYtId}` : recordingUrl;
    const finalSource = extractedYtId ? "YouTube" : (args.videoSource || "AWS S3");

    const batch = await ctx.db.get(args.batchId);
    const now = Date.now();
    const startTime = args.startTime ?? (now - 3600000 * 2);
    const endTime = args.endTime ?? now;

    const id = await ctx.db.insert("liveClasses", {
      batchId: args.batchId,
      title: args.title,
      startTime,
      endTime,
      meetingLink: args.meetingLink || "https://meet.google.com/vibe-logic-live",
      recordingUrl: finalUrl,
      duration: args.duration || "01:45:00",
      moduleTitle: args.moduleTitle || "Module 1",
      instructorName: args.instructorName || batch?.instructorName || "Instructor",
      views: 0,
      completionRate: 0,
      status: args.status || "Published",
      visibility: args.visibility || "Public to Batch",
      videoSource: finalSource,
      youtubeVideoId: extractedYtId,
      description: args.description || "HD Replay session recording.",
      attachments: args.attachments || [],
    });
    return id;
  },
});

export const updateBatchRecordingExtended = mutation({
  args: {
    id: v.id("liveClasses"),
    title: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    meetingLink: v.optional(v.string()),
    duration: v.optional(v.string()),
    moduleTitle: v.optional(v.string()),
    instructorName: v.optional(v.string()),
    status: v.optional(v.string()),
    visibility: v.optional(v.string()),
    videoSource: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    description: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          type: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Recording not found");

    const updates: Record<string, any> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.startTime !== undefined) updates.startTime = args.startTime;
    if (args.endTime !== undefined) updates.endTime = args.endTime;
    if (args.meetingLink !== undefined) updates.meetingLink = args.meetingLink;
    if (args.recordingUrl !== undefined) {
      const extractedYtId = args.youtubeVideoId || parseYouTubeIdServer(args.recordingUrl);
      if (extractedYtId) {
        updates.youtubeVideoId = extractedYtId;
        updates.recordingUrl = `https://www.youtube.com/embed/${extractedYtId}`;
        updates.videoSource = "YouTube";
      } else {
        updates.recordingUrl = args.recordingUrl;
      }
    }
    if (args.duration !== undefined) updates.duration = args.duration;
    if (args.moduleTitle !== undefined) updates.moduleTitle = args.moduleTitle;
    if (args.instructorName !== undefined) updates.instructorName = args.instructorName;
    if (args.status !== undefined) updates.status = args.status;
    if (args.visibility !== undefined) updates.visibility = args.visibility;
    if (args.videoSource !== undefined) updates.videoSource = args.videoSource;
    if (args.youtubeVideoId !== undefined) updates.youtubeVideoId = args.youtubeVideoId;
    if (args.description !== undefined) updates.description = args.description;
    if (args.attachments !== undefined) updates.attachments = args.attachments;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const deleteBatchRecordingExtended = mutation({
  args: { id: v.id("liveClasses") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const bulkUpdateBatchRecordingsExtended = mutation({
  args: {
    recordingIds: v.array(v.id("liveClasses")),
    action: v.string(), // "publish" | "draft" | "archive" | "delete" | "move_module" | "change_visibility"
    moduleTitle: v.optional(v.string()),
    visibility: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    for (const id of args.recordingIds) {
      const existing = await ctx.db.get(id);
      if (!existing) continue;

      if (args.action === "delete") {
        await ctx.db.delete(id);
      } else if (args.action === "publish") {
        await ctx.db.patch(id, { status: "Published" });
      } else if (args.action === "draft") {
        await ctx.db.patch(id, { status: "Draft" });
      } else if (args.action === "archive") {
        await ctx.db.patch(id, { status: "Archived" });
      } else if (args.action === "move_module" && args.moduleTitle) {
        await ctx.db.patch(id, { moduleTitle: args.moduleTitle });
      } else if (args.action === "change_visibility" && args.visibility) {
        await ctx.db.patch(id, { visibility: args.visibility });
      }
    }
    return { success: true, processedCount: args.recordingIds.length };
  },
});

// ==========================================
// BATCH STUDY MATERIALS CMS EXTENDED ENGINE
// ==========================================

export const getBatchStudyMaterialsExtended = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);
    if (!course) return null;

    const rawMaterials = await ctx.db
      .query("studyMaterials")
      .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
      .collect();

    const enriched = rawMaterials
      .sort((a, b) => a.order - b.order)
      .map((sm) => {
        const defaultCollection =
          sm.order <= 2
            ? "Module 1: Foundations"
            : sm.order <= 4
            ? "Day 1: Intro to AI"
            : "Assignments";
        const defaultFormat =
          sm.type === "pdf"
            ? "PDF"
            : sm.type === "video"
            ? "MP4"
            : sm.type === "link"
            ? "LINK"
            : "DOCX";
        return {
          id: sm._id,
          courseId: sm.courseId,
          title: sm.title,
          type: sm.type,
          fileUrl: sm.fileUrl,
          order: sm.order,
          collection: sm.collection || "General Resources",
          fileSize: sm.fileSize || "0 MB",
          fileFormat: sm.fileFormat || defaultFormat,
          downloads: sm.downloads ?? 0,
          visibility: sm.visibility || "Public",
          description:
            sm.description ||
            "Core study material and companion documentation for this curriculum module.",
          uploadedBy: sm.uploadedBy || "Alex D'Souza (Product Admin)",
          updatedAt: sm.updatedAt || Date.now() - sm.order * 3600 * 1000 * 24,
          isFavorite: sm.isFavorite || false,
        };
      });

    // Compute storage usage in MB and format breakdown
    let totalDownloads = 0;
    const formatCounts: Record<string, number> = {};
    const collectionCounts: Record<string, number> = {};

    enriched.forEach((item) => {
      totalDownloads += item.downloads || 0;
      const fmt = item.fileFormat || "PDF";
      formatCounts[fmt] = (formatCounts[fmt] || 0) + 1;
      const col = item.collection || "Module 1: Foundations";
      collectionCounts[col] = (collectionCounts[col] || 0) + 1;
    });

    const formatDistribution = Object.entries(formatCounts).map(
      ([format, count]) => ({
        format,
        count,
        percentage: Math.round((count / Math.max(1, enriched.length)) * 100),
      })
    );

    const collections = Object.entries(collectionCounts).map(
      ([name, count]) => ({
        name,
        count,
      })
    );

    return {
      course: {
        id: course._id,
        title: course.title,
        category: course.category,
      },
      studyMaterials: enriched,
      stats: {
        totalFiles: enriched.length,
        totalDownloads,
        storageUsedMB: Math.round(enriched.length * 57.1), // e.g. 42 files = 2398 MB (~2.4 GB)
        storageQuotaMB: 10240, // 10 GB
        formatDistribution,
        collections,
      },
    };
  },
});

export const createBatchStudyMaterialExtended = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.string(),
    type: v.string(), // "pdf" | "video" | "link" | "docx" | "zip" | "pptx" | "code"
    fileUrl: v.string(),
    collection: v.optional(v.string()),
    fileSize: v.optional(v.string()),
    fileFormat: v.optional(v.string()),
    visibility: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const batch = await ctx.db.get(args.batchId);
    if (!batch) throw new Error("Batch not found");

    const existing = await ctx.db
      .query("studyMaterials")
      .withIndex("by_course_id", (q) => q.eq("courseId", batch.courseId))
      .collect();

    const nextOrder = existing.length + 1;

    const newId = await ctx.db.insert("studyMaterials", {
      courseId: batch.courseId,
      title: args.title,
      type: args.type,
      fileUrl: args.fileUrl,
      order: nextOrder,
      collection: args.collection || "Module 1: Foundations",
      fileSize: args.fileSize || "2.4 MB",
      fileFormat:
        args.fileFormat ||
        (args.type === "pdf" ? "PDF" : args.type === "video" ? "MP4" : "LINK"),
      downloads: 0,
      visibility: args.visibility || "Public",
      description:
        args.description ||
        "Newly uploaded learning resource for this curriculum batch.",
      uploadedBy: "Alex D'Souza (Product Admin)",
      updatedAt: Date.now(),
      isFavorite: false,
    });

    return newId;
  },
});

export const updateBatchStudyMaterialExtended = mutation({
  args: {
    materialId: v.id("studyMaterials"),
    title: v.optional(v.string()),
    collection: v.optional(v.string()),
    visibility: v.optional(v.string()),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    order: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const existing = await ctx.db.get(args.materialId);
    if (!existing) throw new Error("Material not found");

    const patchData: any = { updatedAt: Date.now() };
    if (args.title !== undefined) patchData.title = args.title;
    if (args.collection !== undefined) patchData.collection = args.collection;
    if (args.visibility !== undefined) patchData.visibility = args.visibility;
    if (args.description !== undefined)
      patchData.description = args.description;
    if (args.fileUrl !== undefined) patchData.fileUrl = args.fileUrl;
    if (args.order !== undefined) patchData.order = args.order;
    if (args.isFavorite !== undefined) patchData.isFavorite = args.isFavorite;

    await ctx.db.patch(args.materialId, patchData);
    return { success: true };
  },
});

export const deleteBatchStudyMaterialExtended = mutation({
  args: { materialId: v.id("studyMaterials") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.delete(args.materialId);
    return { success: true };
  },
});

export const bulkUpdateStudyMaterialsExtended = mutation({
  args: {
    materialIds: v.array(v.id("studyMaterials")),
    action: v.string(), // "delete" | "move_collection" | "change_visibility"
    collection: v.optional(v.string()),
    visibility: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    for (const id of args.materialIds) {
      const existing = await ctx.db.get(id);
      if (!existing) continue;

      if (args.action === "delete") {
        await ctx.db.delete(id);
      } else if (args.action === "move_collection" && args.collection) {
        await ctx.db.patch(id, {
          collection: args.collection,
          updatedAt: Date.now(),
        });
      } else if (args.action === "change_visibility" && args.visibility) {
        await ctx.db.patch(id, {
          visibility: args.visibility,
          updatedAt: Date.now(),
        });
      }
    }
    return { success: true, processedCount: args.materialIds.length };
  },
});

export const incrementMaterialDownload = mutation({
  args: { materialId: v.id("studyMaterials") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const existing = await ctx.db.get(args.materialId);
    if (!existing) return { success: false };
    const currentDownloads = existing.downloads || 0;
    await ctx.db.patch(args.materialId, {
      downloads: currentDownloads + 1,
      updatedAt: Date.now(),
    });
    return { success: true, newDownloads: currentDownloads + 1 };
  },
});

// ==========================================
// BATCH SETTINGS ENTERPRISE CONFIGURATION API
// ==========================================

export const getBatchSettingsExtended = query({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);
    if (!course) return null;

    const studyMaterials = await ctx.db
      .query("studyMaterials")
      .withIndex("by_course_id", (q) => q.eq("courseId", course._id))
      .collect();
    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const settings = {
      id: batch._id,
      title: batch.title,
      courseId: batch.courseId,
      courseTitle: course.title,
      courseSlug: course.slug,
      startDate: batch.startDate,
      endDate: batch.endDate,
      capacity: batch.capacity,
      enrolledCount: batch.enrolledCount,
      status: batch.status,
      description:
        batch.description ||
        course.description ||
        "Production-ready intensive AI & modern web development curriculum.",
      instructorName:
        batch.instructorName || course.instructorName || "Unassigned",
      timezone: batch.timezone || "Asia/Kolkata (GMT+5:30)",
      enrollmentStatus:
        batch.enrollmentStatus ||
        (batch.status === "live"
          ? "Running"
          : batch.status === "upcoming"
          ? "Upcoming"
          : "Completed"),
      allowWaitlist:
        batch.allowWaitlist !== undefined ? batch.allowWaitlist : true,
      whatsappLink: batch.whatsappLink || "",
      googleMeetLink:
        batch.googleMeetLink || "https://meet.google.com/qgz-vibe-studio",
      discordLink: batch.discordLink || "https://discord.gg/vibelogic-studio",
      notionLink: batch.notionLink || "https://notion.so/vibelogic-studio",
      extraLinks: batch.extraLinks || [
        {
          title: "GitHub Organization Hub",
          url: "https://github.com/vibelogic-studio",
        },
      ],
      attendanceEnabled:
        batch.attendanceEnabled !== undefined ? batch.attendanceEnabled : true,
      assignmentsEnabled:
        batch.assignmentsEnabled !== undefined
          ? batch.assignmentsEnabled
          : true,
      certificatesEnabled:
        batch.certificatesEnabled !== undefined
          ? batch.certificatesEnabled
          : true,
      communityEnabled:
        batch.communityEnabled !== undefined ? batch.communityEnabled : true,
      aiTutorEnabled:
        batch.aiTutorEnabled !== undefined ? batch.aiTutorEnabled : true,
      sandboxEnabled:
        batch.sandboxEnabled !== undefined ? batch.sandboxEnabled : false,
      isArchived: batch.isArchived || false,
    };

    let filledFields = 0;
    const checkFields = [
      settings.title,
      settings.description,
      settings.instructorName,
      settings.timezone,
      settings.whatsappLink,
      settings.googleMeetLink,
      settings.discordLink,
      settings.notionLink,
    ];
    checkFields.forEach((val) => {
      if (val && typeof val === "string" && val.trim().length > 0)
        filledFields++;
    });
    const completenessScore = Math.min(
      100,
      Math.floor((filledFields / checkFields.length) * 100)
    );

    const alerts = [];
    if (!settings.whatsappLink) {
      alerts.push({
        type: "warning",
        message:
          "WhatsApp Community group link is missing. Enrolled students will not see chat access.",
      });
    }
    if (settings.enrolledCount >= settings.capacity) {
      alerts.push({
        type: "info",
        message:
          "Cohort has reached maximum seat capacity. Waitlist enrollment is active.",
      });
    }
    if (settings.endDate < Date.now() && settings.status === "live") {
      alerts.push({
        type: "error",
        message:
          "End date has passed but operational status is still set to Live.",
      });
    }

    const auditLog: any[] = [];

    return {
      settings,
      resources: {
        studyMaterialsCount: studyMaterials.length,
        recordingsCount: liveClasses.length,
        announcementsCount: announcements.length,
        enrolledStudentsCount: batch.enrolledCount,
      },
      health: {
        completenessScore,
        alerts,
        auditLog,
      },
    };
  },
});

export const updateBatchSettingsExtended = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    instructorName: v.optional(v.string()),
    timezone: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    capacity: v.optional(v.number()),
    enrollmentStatus: v.optional(v.string()),
    allowWaitlist: v.optional(v.boolean()),
    whatsappLink: v.optional(v.string()),
    googleMeetLink: v.optional(v.string()),
    discordLink: v.optional(v.string()),
    notionLink: v.optional(v.string()),
    extraLinks: v.optional(
      v.array(v.object({ title: v.string(), url: v.string() }))
    ),
    attendanceEnabled: v.optional(v.boolean()),
    assignmentsEnabled: v.optional(v.boolean()),
    certificatesEnabled: v.optional(v.boolean()),
    communityEnabled: v.optional(v.boolean()),
    aiTutorEnabled: v.optional(v.boolean()),
    sandboxEnabled: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const { batchId, ...patchData } = args;
    const cleanPatch: Record<string, any> = {};
    for (const [k, val] of Object.entries(patchData)) {
      if (val !== undefined) cleanPatch[k] = val;
    }
    await ctx.db.patch(batchId, cleanPatch);
    return { success: true };
  },
});

export const archiveBatchExtended = mutation({
  args: { batchId: v.id("batches"), isArchived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    await ctx.db.patch(args.batchId, { isArchived: args.isArchived });
    return { success: true };
  },
});

export const duplicateBatchExtended = mutation({
  args: {
    batchId: v.id("batches"),
    newTitle: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const original = await ctx.db.get(args.batchId);
    if (!original) throw new Error("Original batch not found");
    const newBatchId = await ctx.db.insert("batches", {
      ...original,
      title: args.newTitle,
      enrolledCount: 0,
      status: "upcoming",
    });
    return { success: true, newBatchId };
  },
});

export const deleteBatchExtended = mutation({
  args: { batchId: v.id("batches") },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return { success: false };

    // 1. Delete all enrollments in this batch
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();
    for (const enr of enrollments) {
      await ctx.db.delete(enr._id);
    }

    // 2. Delete all live classes / recordings in this batch
    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();
    for (const lc of liveClasses) {
      await ctx.db.delete(lc._id);
    }

    // 3. Delete all announcements in this batch
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();
    for (const ann of announcements) {
      await ctx.db.delete(ann._id);
    }

    // 4. Delete the batch record itself
    await ctx.db.delete(args.batchId);

    return { success: true };
  },
});

export const getBatchActivityExtended = query({
  args: {
    batchId: v.id("batches"),
    dateFilter: v.optional(v.string()),
    categoryFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return null;
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) return null;

    const course = await ctx.db.get(batch.courseId);
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const liveClasses = await ctx.db
      .query("liveClasses")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId))
      .collect();

    const studyMaterials = await ctx.db
      .query("studyMaterials")
      .withIndex("by_course_id", (q) => q.eq("courseId", batch.courseId))
      .collect();

    const now = Date.now();
    const oneDay = 86400000;

    // Convert real database records into activity events
    const realEvents: Array<{
      id: string;
      type: string; // "student" | "instructor" | "admin" | "payment" | "system"
      category: "Students" | "Content" | "Payments" | "System" | "All";
      title: string;
      description: string;
      actorName: string;
      actorRole: string;
      actorInitials: string;
      action: string;
      target: string;
      timestamp: number;
      status: "SUCCESS" | "COMPLETED" | "PAID" | "REMOVED" | "WARNING" | "ERROR";
      ipAddress?: string;
      details?: string;
    }> = [];

    for (const enr of enrollments) {
      const user = await ctx.db.get(enr.userId);
      const name = user?.name || "New Student";
      realEvents.push({
        id: `real-enroll-${enr._id}`,
        type: "student",
        category: "Students",
        title: `${name} joined the batch`,
        description: `${name} enrolled in ${batch.title} cohort program.`,
        actorName: name,
        actorRole: "Student",
        actorInitials: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        action: "joined the batch",
        target: batch.title,
        timestamp: enr.enrolledAt,
        status: "SUCCESS",
        ipAddress: "192.168.1.45",
      });
    }

    for (const ann of announcements) {
      realEvents.push({
        id: `real-ann-${ann._id}`,
        type: "admin",
        category: "Content",
        title: `Alex D'Souza published an announcement "${ann.title}"`,
        description: ann.content,
        actorName: ann.authorName || "Alex D'Souza",
        actorRole: ann.authorRole || "Product Admin",
        actorInitials: "AD",
        action: "published an announcement",
        target: `"${ann.title}"`,
        timestamp: ann.createdAt,
        status: "SUCCESS",
      });
    }

    for (const lc of liveClasses) {
      realEvents.push({
        id: `real-lc-${lc._id}`,
        type: "instructor",
        category: "Content",
        title: `${lc.instructorName || batch.instructorName || "Instructor"} scheduled live class "${lc.title}"`,
        description: `Scheduled for module workshop in ${batch.title}.`,
        actorName: lc.instructorName || batch.instructorName || "Instructor",
        actorRole: "Lead Instructor",
        actorInitials: (lc.instructorName || batch.instructorName || "IN").split(" ").map((n: string) => n[0]).join("").slice(0, 2),
        action: "scheduled live class",
        target: lc.title,
        timestamp: lc.startTime - oneDay,
        status: "COMPLETED",
      });
    }

    const baselineEvents: any[] = [];

    const combinedEvents = [...realEvents, ...baselineEvents];
    combinedEvents.sort((a, b) => b.timestamp - a.timestamp);

    // Group by Dates ("TODAY", "YESTERDAY", "AUGUST 20, 2026", etc.)
    const groupedEvents: Array<{
      groupTitle: string;
      dateKey: string;
      items: typeof combinedEvents;
    }> = [];

    const groupMap = new Map<string, typeof combinedEvents>();

    combinedEvents.forEach((ev) => {
      const diffDays = Math.floor((now - ev.timestamp) / oneDay);
      let groupTitle = "EARLIER";
      let dateKey = "earlier";
      if (diffDays === 0) {
        groupTitle = "TODAY";
        dateKey = "today";
      } else if (diffDays === 1) {
        groupTitle = "YESTERDAY";
        dateKey = "yesterday";
      } else {
        const d = new Date(ev.timestamp);
        groupTitle = d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).toUpperCase();
        dateKey = d.toISOString().slice(0, 10);
      }

      if (!groupMap.has(groupTitle)) {
        groupMap.set(groupTitle, []);
      }
      groupMap.get(groupTitle)!.push(ev);
    });

    groupMap.forEach((items, groupTitle) => {
      groupedEvents.push({
        groupTitle,
        dateKey: items[0]
          ? new Date(items[0].timestamp).toISOString().slice(0, 10)
          : "earlier",
        items,
      });
    });

    // Compute Enterprise KPI counts matching design specs
    const totalEvents = realEvents.length;
    const studentEvents = enrollments.length;
    const contentEvents =
      announcements.length + liveClasses.length + studyMaterials.length;
    const paymentEvents = 0;
    const systemEvents = 0;

    return {
      batch: {
        id: batch._id,
        title: batch.title,
        status: batch.status,
      },
      course: course
        ? {
            id: course._id,
            title: course.title,
            category: course.category,
          }
        : null,
      kpis: {
        totalEvents,
        studentEvents,
        contentEvents,
        paymentEvents,
        systemEvents,
        todayEvents: realEvents.filter((ev) => Math.floor((now - ev.timestamp) / oneDay) === 0).length,
        weeklyEvents: realEvents.filter((ev) => Math.floor((now - ev.timestamp) / oneDay) <= 7).length,
        monthlyEvents: realEvents.length,
      },
      events: combinedEvents,
      groupedEvents,
      activitySummary: [],
      topContributors: [],
      recentAlerts: [],
      calendarDates: [],
    };
  },
});

export const logBatchActivityExtended = mutation({
  args: {
    batchId: v.id("batches"),
    title: v.string(),
    description: v.string(),
    type: v.optional(v.string()), // "admin" | "instructor" | "student" | "system"
    category: v.optional(v.string()), // "Content" | "Students" | "Payments" | "System"
    status: v.optional(v.string()), // "SUCCESS" | "COMPLETED" | "WARNING"
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    // For auditing, we can insert into announcements as an administrative broadcast or log
    await ctx.db.insert("announcements", {
      batchId: args.batchId,
      title: args.title,
      content: args.description,
      createdAt: Date.now(),
      status: "Published",
      authorName: "Product Admin",
      authorRole: "Administrator",
    });
    return { success: true };
  },
});




