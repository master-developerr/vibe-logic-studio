import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentDashboard } from "@/lib/student-service";

export default async function LiveClassesRedirectPage() {
  const { userId, getToken } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  const dashboardData = await getStudentDashboard(userId, token);

  const firstBatchId = dashboardData?.enrollments?.[0]?.batch?.id || dashboardData?.enrollments?.[0]?.batch?._id;
  if (firstBatchId) {
    redirect(`/dashboard/courses/${firstBatchId}/live`);
  }

  redirect("/dashboard/courses");
}
