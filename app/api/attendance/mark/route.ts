import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = (await getToken({ template: "convex" })) ?? undefined;
    const body = await req.json();

    const { sessionId, attendanceSource } = body;
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const result = await fetchMutation(
      api.student.markSessionAttendance,
      {
        sessionId: sessionId as Id<"liveClasses">,
        attendanceSource: attendanceSource || "live_join",
      },
      { token }
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Failed to mark session attendance:", err);
    return NextResponse.json(
      { error: err.message || "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
