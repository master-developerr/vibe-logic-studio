import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentDashboard } from "@/lib/student-service";
import { MyCoursesClient } from "@/components/dashboard/MyCoursesClient";

export default async function MyCoursesPage() {
  const { userId, getToken } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  const dashboardData = await getStudentDashboard(userId, token);
  
  const enrollments = dashboardData?.enrollments || [];
  const availableCourses = dashboardData?.availableCourses || [];

  return (
    <MyCoursesClient 
      enrollments={enrollments} 
      availableCourses={availableCourses} 
    />
  );
}
