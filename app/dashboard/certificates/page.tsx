import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CertificatesClient } from "@/components/dashboard/CertificatesClient";

export default async function CertificatesPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;

  let certificatesData = null;
  try {
    certificatesData = await fetchQuery(
      api.student.getCertificatesData,
      {},
      { token }
    );
  } catch (error) {
    console.error("Error fetching certificates data:", error);
  }

  return (
    <div className="w-full h-full pb-20">
      <CertificatesClient initialData={certificatesData} clerkId={userId} />
    </div>
  );
}
