import "server-only";

import { redis } from "@/lib/redis";

const marketplaceKey = (category: string, query: string): string => `marketplace:v1:${category.toLocaleLowerCase()}:${query.toLocaleLowerCase()}`;
const courseKey = (slug: string): string => `course:v1:${slug}`;
const publicCourseCacheTtlSeconds = 60;

export async function getCachedMarketplace<T>(category: string, query: string): Promise<T | null> {
  if (redis === null) return null;

  try {
    return await redis.get<T>(marketplaceKey(category, query));
  } catch (error: unknown) {
    console.error("[course-cache/getCachedMarketplace]", error);
    return null;
  }
}

export async function cacheMarketplace<T>(category: string, query: string, value: T): Promise<void> {
  if (redis === null) return;

  try {
    await redis.set(marketplaceKey(category, query), value, { ex: publicCourseCacheTtlSeconds });
  } catch (error: unknown) {
    console.error("[course-cache/cacheMarketplace]", error);
  }
}

export async function getCachedCourse<T>(slug: string): Promise<T | null> {
  if (redis === null) return null;

  try {
    return await redis.get<T>(courseKey(slug));
  } catch (error: unknown) {
    console.error("[course-cache/getCachedCourse]", error);
    return null;
  }
}

export async function cacheCourse<T>(slug: string, value: T): Promise<void> {
  if (redis === null) return;

  try {
    await redis.set(courseKey(slug), value, { ex: publicCourseCacheTtlSeconds });
  } catch (error: unknown) {
    console.error("[course-cache/cacheCourse]", error);
  }
}

export async function invalidateCourseCache(slug: string): Promise<void> {
  if (redis === null) return;

  try {
    await redis.del(courseKey(slug));
    await redis.del("marketplace:v1:*");
  } catch (error: unknown) {
    console.error("[course-cache/invalidateCourseCache]", error);
  }
}

export async function invalidatePurchaseRelatedCaches(params: {
  courseSlug?: string;
  courseId?: string;
  batchId?: string;
  clerkId?: string;
}): Promise<void> {
  if (redis === null) return;

  try {
    const pipeline = redis.pipeline();

    if (params.courseSlug) {
      pipeline.del(`course:v1:${params.courseSlug}`);
      pipeline.del(`courses:detail:${params.courseSlug}`);
    }

    pipeline.del("marketplace:v1:*");
    pipeline.del("courses:market:*");

    if (params.clerkId) {
      pipeline.del(`student:dashboard:${params.clerkId}`);
      if (params.courseId) {
        pipeline.del(`student:lms:${params.clerkId}:${params.courseId}`);
      }
      if (params.batchId) {
        pipeline.del(`student:batchLms:${params.clerkId}:${params.batchId}`);
        pipeline.del(`student:dashboardContext:${params.clerkId}:${params.batchId}`);
      }
    }

    await pipeline.exec();
  } catch (error: unknown) {
    // Observable failure without failing the payment lifecycle
    console.error("[course-cache/invalidatePurchaseRelatedCaches] Cache eviction warning:", error);
  }
}
