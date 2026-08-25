import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { RecordingPlayerClient } from "@/components/dashboard/RecordingPlayerClient";

export default async function RecordingPlayerPage({
  params,
}: {
  params: Promise<{ batchId: string; recordingId: string }>;
}) {
  const { batchId, recordingId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <RecordingPlayerClient 
      batchId={batchId as Id<"batches">}
      recordingId={recordingId}
      clerkId={userId} 
    />
  );
}
