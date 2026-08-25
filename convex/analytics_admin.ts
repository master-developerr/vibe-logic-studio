import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth_helpers";
import { computeCoreKPIs } from "./metrics";

/**
 * Returns a massive set of aggregated analytics and mocked telemetry.
 * In a real production system, this would be backed by materialized views or a dedicated analytics DB.
 */
export const getDashboardMetrics = query({
  args: {
    timeRange: v.string(), // "7d" | "30d" | "90d" | "12m" | "all"
    courseId: v.optional(v.string()), // "all" or specific ID
    batchId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const metrics = await computeCoreKPIs(ctx);
    const {
      totalRevenue,
      activeStudents,
      activeCourses,
      totalBatches,
      courseCompletionRate,
      avgAttendance,
      avgRating,
      enrollments,
      courses
    } = metrics;

    // Fake trend percentages for the UI
    const kpis = {
      totalRevenue,
      revenueGrowth: 14.2,
      activeStudents,
      studentsGrowth: 8.5,
      activeCourses,
      totalBatches,
      courseCompletionRate,
      completionGrowth: 2.1,
      certificatesIssued: enrollments.filter(e => e.certificateStatus === "Issued").length,
      averageSessionDuration: "24m 12s", // Mocked telemetry
      engagementScore: 84, // Mocked 0-100 score
      engagementGrowth: -1.2,
      attendanceRate: avgAttendance,
      attendanceGrowth: 4.3,
      studentSatisfaction: avgRating,
    };

    // 3. Trends (Mocked 6-month data for visual charts)
    const monthLabels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const revenueTrend = [12500, 18200, 16400, 22100, 28500, 34200];
    const enrollmentTrend = [45, 62, 58, 85, 110, 142];

    const chartData = {
      labels: monthLabels,
      revenue: revenueTrend,
      enrollments: enrollmentTrend,
    };

    // 4. Distribution Analytics (Mocked)
    const deviceDistribution = [
      { name: "Desktop", percentage: 65 },
      { name: "Mobile", percentage: 28 },
      { name: "Tablet", percentage: 7 },
    ];
    
    const geoDistribution = [
      { name: "North America", percentage: 42 },
      { name: "Europe", percentage: 28 },
      { name: "Asia", percentage: 18 },
      { name: "Other", percentage: 12 },
    ];

    // 5. Smart Insights (Rule-based anomalies)
    const insights = [];
    if (avgRating > 4.5) {
      insights.push({
        type: "positive",
        title: "High Satisfaction",
        description: "Student satisfaction is exceptionally high this period.",
      });
    }
    if (kpis.engagementGrowth < 0) {
      insights.push({
        type: "warning",
        title: "Engagement Drop",
        description: "Platform engagement score dropped 1.2% compared to last period.",
      });
    }
    
    const topCourse = courses.sort((a, b) => b.price - a.price)[0]; // simplistic heuristic
    if (topCourse) {
      insights.push({
        type: "info",
        title: "Trending Content",
        description: `"${topCourse.title}" is your fastest growing course this month.`,
      });
    }

    // 6. Leaderboards
    const topCourses = courses.slice(0, 5).map(c => ({
      id: c._id,
      title: c.title,
      revenue: Math.floor(Math.random() * 50000),
      enrollments: Math.floor(Math.random() * 500),
    })).sort((a, b) => b.revenue - a.revenue);

    const topInstructors = Array.from(new Set(courses.map(c => c.instructorName))).slice(0, 5).map(name => ({
      name,
      rating: 4.8 - Math.random() * 0.5,
      students: Math.floor(Math.random() * 2000),
    })).sort((a, b) => b.rating - a.rating);

    return {
      kpis,
      chartData,
      deviceDistribution,
      geoDistribution,
      insights,
      leaderboards: {
        topCourses,
        topInstructors,
      }
    };
  }
});

/**
 * Returns a chronological stream of the latest platform events for the Live Feed.
 */
export const getLiveActivity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const payments = await ctx.db.query("payments").order("desc").take(15);
    const enrollments = await ctx.db.query("enrollments").order("desc").take(15);
    const reviews = await ctx.db.query("reviews").order("desc").take(15);
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();

    const userMap = new Map(users.map(u => [u._id, u.name]));
    const courseMap = new Map(courses.map(c => [c._id, c.title]));

    const feed: any[] = [];

    payments.forEach(p => {
      if (p.status === "successful") {
        feed.push({
          id: `pay_${p._id}`,
          type: "payment",
          timestamp: p.createdAt,
          user: userMap.get(p.userId) || "Unknown User",
          amount: p.netAmount ?? p.amount,
          courseTitle: p.courseId ? courseMap.get(p.courseId) : "A course",
        });
      }
    });

    enrollments.forEach(e => {
      feed.push({
        id: `enr_${e._id}`,
        type: e.progress >= 100 ? "completion" : "enrollment",
        timestamp: e.enrolledAt,
        user: userMap.get(e.userId) || "Unknown User",
        courseTitle: courseMap.get(e.courseId) || "A course",
      });
    });

    reviews.forEach(r => {
      const createdAt = r.createdAt ?? Date.now() - Math.floor(Math.random() * 100000);
      feed.push({
        id: `rev_${r._id}`,
        type: "review",
        timestamp: createdAt,
        user: userMap.get(r.userId) || "Unknown User",
        rating: r.rating,
        courseTitle: courseMap.get(r.courseId) || "A course",
      });
    });

    // Sort descending by timestamp and take top 20
    return feed.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
  }
});
