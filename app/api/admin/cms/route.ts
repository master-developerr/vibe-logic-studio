import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ratelimit } from "@/lib/ratelimit";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: Request) {
  // 1. Auth check
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = (await getToken({ template: "convex" })) ?? undefined;

  // 2. Rate limit — 20 CMS mutations per 60 seconds per user
  if (ratelimit) {
    const { success, limit, remaining, reset } = await ratelimit.limit(`cms:${userId}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  // 3. Role check
  const user = await fetchQuery(api.users.getUserByClerkId, { clerkId: userId }, { token });
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 4. Execute mutation
  const body = await req.json();
  const { id, content, isVisible } = body;

  if (!id || content === undefined || isVisible === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await fetchMutation(api.admin.updateLandingPageSection, {
    id: id as Id<"landingPage">,
    content,
    isVisible,
  }, { token });

  return NextResponse.json({ success: true });
}
