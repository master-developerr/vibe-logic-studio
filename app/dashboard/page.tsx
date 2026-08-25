import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentDashboard } from "@/lib/student-service";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function StudentDashboardPage() {
  const { userId, getToken } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  const dashboardData = await getStudentDashboard(userId, token);
  
  if (!dashboardData) {
    return <DashboardClient user={{}} enrollments={[]} announcements={[]} upcomingClasses={[]} />;
  }

  return (
    <DashboardClient 
      user={dashboardData.user} 
      enrollments={dashboardData.enrollments} 
      announcements={dashboardData.announcements} 
      upcomingClasses={dashboardData.upcomingClasses}
    />
  );
}
