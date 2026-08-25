import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { CourseAnnouncementsClient } from "@/components/dashboard/CourseAnnouncementsClient";

export default async function StudentAnnouncementsPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  // Next.js 15: await params
  const { batchId } = await params;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CourseAnnouncementsClient batchId={batchId as Id<"batches">} clerkId={clerkId} />
    </div>
  );
}
