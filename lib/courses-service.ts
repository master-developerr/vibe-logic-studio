import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redis } from "./redis";
import type { Course } from "./course-data";

const CACHE_TTL = 60; // 60 seconds

export async function getMarketplaceCourses(category: string, query: string): Promise<Course[]> {
  const cacheKey = `courses:market:${category}:${query}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached as Course[];
      }
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  // Fallback to Convex
  const courses = await fetchQuery(api.courses.listActive, { category, query });
  
  // Format the ids to match what UI expects from mock data
  const formattedCourses = courses.map(course => ({
    ...course,
    category: course.category as Course["category"],
    batches: course.batches.map(b => ({ 
      ...b, 
      id: b._id as string,
      startDate: new Date(b.startDate).toISOString().split('T')[0],
      endDate: new Date(b.endDate).toISOString().split('T')[0],
      status: b.status as "upcoming" | "live" | "completed",
    })),
    reviews: [] // Reviews are not fetched for marketplace listing
  })) as Course[];

  if (redis) {
    try {
      await redis.set(cacheKey, formattedCourses, { ex: CACHE_TTL });
    } catch (error) {
      console.error("Redis cache set error:", error);
    }
  }

  return formattedCourses;
}

export async function getCourseDetails(slug: string): Promise<Course | null> {
  const cacheKey = `courses:detail:${slug}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached as Course;
      }
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  const course = await fetchQuery(api.courses.getBySlug, { slug });
  if (!course) return null;

  const formattedCourse = {
    ...course,
    category: course.category as Course["category"],
    batches: course.batches.map(b => ({ 
      ...b, 
      id: b._id as string,
      startDate: new Date(b.startDate).toISOString().split('T')[0],
      endDate: new Date(b.endDate).toISOString().split('T')[0],
      status: b.status as "upcoming" | "live" | "completed",
    })),
    reviews: course.reviews.map(r => ({ ...r, id: r.id as string })),
  } as Course;

  if (redis) {
    try {
      await redis.set(cacheKey, formattedCourse, { ex: CACHE_TTL });
    } catch (error) {
      console.error("Redis cache set error:", error);
    }
  }

  return formattedCourse;
}
