"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redis, isDynamicServerError } from "./redis";
import type { Id } from "@/convex/_generated/dataModel";

const CACHE_TTL = 10; // 10 seconds for real-time live class synchronization

function safeIsoDate(val: any, fallback = new Date().toISOString()): string {
  if (val === null || val === undefined) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString();
  } catch {
    return fallback;
  }
}

function safeDatePart(val: any, fallback = new Date().toISOString().split("T")[0]): string {
  const iso = safeIsoDate(val, fallback);
  return iso.split("T")[0];
}

export async function getStudentDashboard(clerkId: string, token?: string): Promise<any> {
  const cacheKey = `student:dashboard:${clerkId}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache error:", error);
    }
  }

  const dashboardData = await fetchQuery(api.students.getUserDashboard, { clerkId }, { token });
  
  if (!dashboardData) return null;

  // Format dates safely in the response
  const formattedData = {
    ...dashboardData,
    enrollments: (dashboardData.enrollments || []).map((e: any) => ({
      ...e,
      batch: e.batch ? {
        ...e.batch,
        startDate: safeDatePart(e.batch.startDate),
        endDate: safeDatePart(e.batch.endDate),
      } : null,
    })),
    announcements: (dashboardData.announcements || []).map((a: any) => ({
      ...a,
      createdAt: safeIsoDate(a.createdAt),
    })),
    upcomingClasses: (dashboardData.upcomingClasses || []).map((c: any) => ({
      ...c,
      startTime: safeIsoDate(c.startTime),
      endTime: safeIsoDate(c.endTime),
    })),
    availableCourses: dashboardData.availableCourses || [],
  };

  if (redis) {
    try {
      await redis.set(cacheKey, formattedData, { ex: CACHE_TTL });
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache set error:", error);
    }
  }

  return formattedData;
}

export async function getCourseLMS(clerkId: string, courseId: string, token?: string): Promise<any> {
  const cacheKey = `student:lms:${clerkId}:${courseId}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache error:", error);
    }
  }

  const lmsData = await fetchQuery(api.students.getCourseLMS, { 
    clerkId, 
    courseId: courseId as Id<"courses"> 
  }, { token });
  
  if (!lmsData) return null;

  const formattedData = {
    ...lmsData,
    liveClasses: (lmsData.liveClasses || []).map((c: any) => ({
      ...c,
      startTime: safeIsoDate(c.startTime),
      endTime: safeIsoDate(c.endTime),
    }))
  };

  if (redis) {
    try {
      await redis.set(cacheKey, formattedData, { ex: CACHE_TTL });
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache set error:", error);
    }
  }

  return formattedData;
}

export async function getBatchLMS(clerkId: string, batchId: string, token?: string): Promise<any> {
  const cacheKey = `student:batchLms:${clerkId}:${batchId}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache error:", error);
    }
  }

  const lmsData = await fetchQuery(api.student.getBatchLMS, { 
    batchId: batchId as Id<"batches">
  }, { token });
  
  if (!lmsData) return null;

  const formattedData = {
    ...lmsData,
    liveClasses: (lmsData.liveClasses || []).map((c: any) => ({
      ...c,
      startTime: safeIsoDate(c.startTime),
      endTime: safeIsoDate(c.endTime),
    })),
    announcements: (lmsData.announcements || []).map((a: any) => ({
      ...a,
      createdAt: safeIsoDate(a.createdAt),
    }))
  };

  if (redis) {
    try {
      await redis.set(cacheKey, formattedData, { ex: CACHE_TTL });
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache set error:", error);
    }
  }

  return formattedData;
}

export async function getCourseDashboardContext(clerkId: string, batchId: string, token?: string): Promise<any> {
  const contextData = await fetchQuery(api.student.getCourseDashboardContext, { 
    batchId: batchId as Id<"batches">
  }, { token });
  
  if (!contextData) return null;

  return {
    ...contextData,
    liveClasses: (contextData.liveClasses || []).map((c: any) => ({
      ...c,
      startTime: safeIsoDate(c.startTime),
      endTime: safeIsoDate(c.endTime),
    })),
    announcements: (contextData.announcements || []).map((a: any) => ({
      ...a,
      createdAt: safeIsoDate(a.createdAt),
    })),
    assignments: (contextData.assignments || []).map((a: any) => ({
      ...a,
      dueDate: safeIsoDate(a.dueDate),
      createdAt: safeIsoDate(a.createdAt),
    })),
    activities: (contextData.activities || []).map((a: any) => ({
      ...a,
      timestamp: safeIsoDate(a.timestamp),
    })),
  };
}

export async function updateStudentProfile(clerkId: string, name: string, avatarUrl?: string) {
  await fetchMutation(api.students.updateProfile, { clerkId, name, avatarUrl });
  
  // Invalidate dashboard cache for this user
  if (redis) {
    try {
      const cacheKey = `student:dashboard:${clerkId}`;
      await redis.del(cacheKey);
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("Redis cache deletion error:", error);
    }
  }
}
