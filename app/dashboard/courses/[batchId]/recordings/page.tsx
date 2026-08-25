import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { CourseRecordingsClient } from "@/components/dashboard/CourseRecordingsClient";

export default async function RecordingsPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <CourseRecordingsClient 
      batchId={batchId as Id<"batches">} 
      clerkId={userId} 
    />
  );
}
