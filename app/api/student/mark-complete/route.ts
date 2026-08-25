import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redis } from "@/lib/redis";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId, getToken } = await auth();
    if (!clerkId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { batchId, lessonId } = await req.json();
    if (!batchId || !lessonId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const token = (await getToken({ template: "convex" })) ?? undefined;

    // 1. Call Convex Mutation
    await fetchMutation(
      api.student.markLessonCompleted,
      {
        batchId: batchId as Id<"batches">,
        lessonId: lessonId as Id<"studyMaterials">,
      },
      { token }
    );

    // 2. Invalidate Cache
    if (redis) {
      try {
        const pipeline = redis.pipeline();
        pipeline.del(`student:dashboard:${clerkId}`);
        pipeline.del(`student:dashboardContext:${clerkId}:${batchId}`);
        pipeline.del(`student:batchLms:${clerkId}:${batchId}`);
        await pipeline.exec();
      } catch (redisErr) {
        console.error("Failed to invalidate Redis cache keys on completion:", redisErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mark lesson completed API error:", error);
    return NextResponse.json({ error: error.message || "Failed to mark lesson completed" }, { status: 500 });
  }
}
