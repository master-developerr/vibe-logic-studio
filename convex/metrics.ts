import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

export async function computeCoreKPIs(ctx: GenericQueryCtx<DataModel>) {
  const payments = await ctx.db.query("payments").collect();
  const enrollments = await ctx.db.query("enrollments").collect();
  const courses = await ctx.db.query("courses").collect();
  const batches = await ctx.db.query("batches").collect();
  const reviews = await ctx.db.query("reviews").collect();
  const users = await ctx.db.query("users").collect();

  // 1. Revenue
  const totalRevenue = payments
    .filter((p) => p.status === "successful")
    .reduce((sum, p) => sum + (p.netAmount ?? p.amount), 0);

  // 2. Students
  const activeStudents = new Set(
    enrollments.filter((e) => e.status === "active").map((e) => e.userId)
  ).size;

  // 3. Courses & Batches
  const activeCourses = courses.filter((c) => c.isActive).length;
  const totalBatches = batches.length;

  // 4. Progress & Attendance
  let totalProgress = 0;
  let completedCount = 0;
  enrollments.forEach((e) => {
    totalProgress += e.progress;
    if (e.progress >= 100 || e.status === "completed") completedCount++;
  });

  const courseCompletionRate =
    enrollments.length > 0 ? (completedCount / enrollments.length) * 100 : 0;
  const avgAttendance =
    enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + (e.attendancePercentage ?? 0), 0) /
        enrollments.length
      : 0;

  // 5. Ratings
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    totalRevenue,
    activeStudents,
    activeCourses,
    totalBatches,
    courseCompletionRate,
    avgAttendance,
    avgRating,
    payments,
    enrollments,
    courses,
    batches,
    reviews,
    users,
  };
}
