import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import { Id } from "@/convex/_generated/dataModel";
import { StudentBatchWorkspaceHeader } from "@/components/layout/StudentBatchWorkspaceHeader";

export default async function BatchWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const { userId, getToken } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  
  if (!batchId || batchId === "undefined" || batchId === "null") {
    redirect("/dashboard/courses");
  }

  let dashboardContext = null;
  try {
    dashboardContext = await getCourseDashboardContext(userId, batchId, token);
  } catch (err) {
    console.error("Unauthorized or batch not found", err);
  }

  if (!dashboardContext) {
    redirect("/dashboard/courses");
  }

  const { course, batch, instructor, enrollment, studyMaterials } = dashboardContext;
  const progress = enrollment?.progress || 0;
  const totalLessons = studyMaterials?.length || 0;
  const completedLessons = enrollment?.completedLessons?.length || 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <StudentBatchWorkspaceHeader 
        batchId={batchId as Id<"batches">}
        courseTitle={course.title}
        batchTitle={batch.title}
        instructorName={instructor?.name}
        progress={progress}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />
      <div className="pb-16">
        {children}
      </div>
    </div>
  );
}
