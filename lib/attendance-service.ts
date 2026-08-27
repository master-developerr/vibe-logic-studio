import { Id } from "@/convex/_generated/dataModel";

export async function markAttendanceClient(
  sessionId: Id<"liveClasses"> | string,
  source: "live_join" | "recording_watch"
): Promise<{ success: boolean; alreadyExisted?: boolean }> {
  try {
    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, attendanceSource: source }),
    });

    if (!res.ok) {
      console.warn("Attendance endpoint returned non-OK status:", res.status);
      return { success: false };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to record attendance:", error);
    return { success: false };
  }
}
