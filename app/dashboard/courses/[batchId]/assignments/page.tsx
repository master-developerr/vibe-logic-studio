import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import CourseAssignmentsClient from "@/components/dashboard/CourseAssignmentsClient";

export default async function BatchAssignmentsPage({ params }: { params: Promise<{ batchId: string }> }) {
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

  const { assignments, submissions } = dashboardContext;

  return (
    <CourseAssignmentsClient
      batchId={batchId}
      assignments={assignments || []}
      submissions={submissions || []}
    />
  );
}
