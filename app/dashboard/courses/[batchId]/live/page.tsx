import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseDashboardContext } from "@/lib/student-service";
import { LiveClassesClient } from "@/components/dashboard/LiveClassesClient";

export default async function BatchLiveClassesPage({ params }: { params: Promise<{ batchId: string }> }) {
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

  return (
    <div className="font-sans">
      <LiveClassesClient batchId={batchId} clerkId={userId} />
    </div>
  );
}
