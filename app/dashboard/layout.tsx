import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { StudentDashboardFooter } from "@/components/layout/StudentDashboardFooter";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;
  let user = null;
  try {
    user = await fetchQuery(api.users.getUserByClerkId, { clerkId: userId }, { token });
    
    // Supplement the user with Clerk's imageUrl
    const clerkUser = await currentUser();
    if (clerkUser?.imageUrl) {
      user = { ...user, avatarUrl: clerkUser.imageUrl };
    }
  } catch (err) {
    console.error("Error fetching user for header:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] text-gray-900">
      <StudentNavbar user={user} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {children}
      </main>
      <StudentDashboardFooter />
    </div>
  );
}
