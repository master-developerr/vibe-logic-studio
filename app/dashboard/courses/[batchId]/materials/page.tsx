import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import { CourseMaterialsClient } from "@/components/dashboard/CourseMaterialsClient";

export default async function BatchMaterialsPage({ params }: { params: Promise<{ batchId: string }> }) {
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

  const { studyMaterials, enrollment, course } = dashboardContext;
  const completedLessons = enrollment?.completedLessons || [];

  return (
    <div className="font-sans">
      <CourseMaterialsClient 
        studyMaterials={studyMaterials}
        completedLessons={completedLessons}
        batchId={batchId}
        courseTitle={course?.title}
      />
    </div>
  );
}
