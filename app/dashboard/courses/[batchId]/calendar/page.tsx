import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import { CourseCalendarClient } from "@/components/dashboard/CourseCalendarClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function BatchCalendarPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const { userId, getToken } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  
  const dashboardContext = await getCourseDashboardContext(userId, batchId, token);
  
  if (!dashboardContext) {
    redirect("/dashboard/courses");
  }

  const { course, liveClasses, assignments, announcements } = dashboardContext;

  return (
    <div className="font-sans pb-24">

      <CourseCalendarClient 
        batchId={batchId}
        liveClasses={liveClasses}
        assignments={assignments}
        announcements={announcements}
        clerkId={userId}
      />
    </div>
  );
}
