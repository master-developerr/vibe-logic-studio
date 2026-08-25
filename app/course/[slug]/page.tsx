import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "ai-build-sprint" || slug === "build-software-with-ai") {
    redirect("/build-software-with-ai");
  }
  redirect("/");
}

