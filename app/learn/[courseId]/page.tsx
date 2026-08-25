import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default async function LegacyLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;

  try {
    const lmsData = await fetchQuery(
      api.students.getCourseLMS,
      { clerkId: userId, courseId: courseId as Id<"courses"> },
      { token }
    );

    if (lmsData && lmsData.batch && lmsData.batch.id) {
      redirect(`/dashboard/courses/${lmsData.batch.id}/overview`);
    }
  } catch (err) {
    console.error("Failed to fetch course LMS data for redirect:", err);
  }

  redirect("/dashboard/courses");
}
