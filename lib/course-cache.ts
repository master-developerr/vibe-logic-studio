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
