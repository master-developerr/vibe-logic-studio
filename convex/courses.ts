import { v } from "convex/values";

import { query } from "./_generated/server";

const courseFields = {
  id: (course: { _id: string; slug: string; title: string; category: string; description: string; price: number; coverImageUrl: string; instructorName: string; instructorRole: string; instructorBio: string; syllabus: string[] }) => ({
    id: course._id,
    slug: course.slug,
    title: course.title,
    category: course.category,
    description: course.description,
    price: course.price,
    coverImageUrl: course.coverImageUrl,
    instructor: {
      name: course.instructorName,
      role: course.instructorRole,
      bio: course.instructorBio,
    },
    syllabus: course.syllabus,
  }),
};

export const listActive = query({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const courses = await ctx.db.query("courses").withIndex("by_is_active", (query) => query.eq("isActive", true)).collect();
    const normalizedQuery = args.query?.trim().toLocaleLowerCase() ?? "";
    const matchingCourses = courses.filter((course) => (args.category === undefined || args.category === "All" || course.category === args.category) && (normalizedQuery.length === 0 || course.title.toLocaleLowerCase().includes(normalizedQuery)));

    return await Promise.all(matchingCourses.map(async (course) => {
      const batches = await ctx.db.query("batches").withIndex("by_course_id", (query) => query.eq("courseId", course._id)).collect();
      return { ...courseFields.id(course), batches };
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    let course = await ctx.db.query("courses").withIndex("by_slug", (query) => query.eq("slug", args.slug)).unique();
    
    // Try finding by ID if slug might be an ID string
    if (!course) {
      try {
        const potentialCourse = await ctx.db.get(args.slug as any);
        if (potentialCourse && "title" in potentialCourse) {
          course = potentialCourse as any;
        }
      } catch {
        // Not a valid ID format
      }
    }

    if (course === null || !course.isActive) return null;

    const [batches, reviews] = await Promise.all([
      ctx.db.query("batches").withIndex("by_course_id", (query) => query.eq("courseId", course._id)).collect(),
      ctx.db.query("reviews").withIndex("by_course_id", (query) => query.eq("courseId", course._id)).collect(),
    ]);

    const approvedReviews = reviews.filter((review) => review.isApproved);
    
    const formattedReviews = await Promise.all(approvedReviews.map(async (review) => {
      const user = await ctx.db.get(review.userId);
      return {
        id: review._id,
        rating: review.rating,
        content: review.content,
        name: user?.name ?? "Anonymous",
        role: user?.role ?? "Student",
      };
    }));

    return {
      ...courseFields.id(course),
      batches,
      reviews: formattedReviews,
    };
  },
});

export const getById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (course === null || !course.isActive) return null;

    const [batches, reviews] = await Promise.all([
      ctx.db.query("batches").withIndex("by_course_id", (query) => query.eq("courseId", course._id)).collect(),
      ctx.db.query("reviews").withIndex("by_course_id", (query) => query.eq("courseId", course._id)).collect(),
    ]);

    const approvedReviews = reviews.filter((review) => review.isApproved);
    
    const formattedReviews = await Promise.all(approvedReviews.map(async (review) => {
      const user = await ctx.db.get(review.userId);
      return {
        id: review._id,
        rating: review.rating,
        content: review.content,
        name: user?.name ?? "Anonymous",
        role: user?.role ?? "Student",
      };
    }));

    return {
      ...courseFields.id(course),
      batches,
      reviews: formattedReviews,
    };
  },
});

