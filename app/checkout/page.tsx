import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "@/components/courses/CheckoutClient";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, CreditCard } from "lucide-react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ courseSlug?: string; batchId?: string; courseId?: string }>;
}) {
  const { userId, getToken } = await auth();
  const params = await searchParams;
  const targetCourseQuery = params.courseSlug || params.courseId || "build-software-with-ai";

  const token = (await getToken({ template: "convex" })) ?? undefined;

  // 1. Fetch course details (includes batches)
  const course = await fetchQuery(api.courses.getBySlug, { slug: targetCourseQuery });
  if (!course) {
    redirect("/");
  }

  // 2. Locate or auto-select target batch
  let targetBatch: any = null;
  if (params.batchId) {
    targetBatch = course.batches.find((b: any) => b._id === params.batchId || (b as any).id === params.batchId);
  }

  if (!targetBatch && course.batches.length > 0) {
    // Select earliest valid upcoming batch with capacity
    const upcomingWithCapacity = course.batches.find((b: any) => 
      (b.capacity ?? 50) > (b.enrolledCount ?? 0) && (b.status === "upcoming" || b.status === "live")
    );
    targetBatch = upcomingWithCapacity || course.batches[0];
  }

  if (!targetBatch) {
    redirect(course.slug === "build-software-with-ai" || course.slug === "ai-build-sprint" ? "/build-software-with-ai" : "/");
  }

  const batchId = targetBatch._id || targetBatch.id;


  if (!userId) {
    // If not authenticated, redirect to sign-up and redirect back to this checkout URL
    const redirectUrl = encodeURIComponent(`/checkout?courseSlug=${course.slug}&batchId=${batchId}`);
    redirect(`/sign-up?fallback_redirect_url=${redirectUrl}`);
  }

  // 3. Fetch user details from database or fallback to Clerk
  const user = await fetchQuery(api.users.getUserByClerkId, { clerkId: userId }, { token });
  
  let resolvedUser = user;
  if (!resolvedUser) {
    // The Clerk webhook hasn't synced the user to Convex yet.
    // Fetch directly from Clerk to prevent redirect loops.
    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in");
    }
    
    resolvedUser = {
      _id: "pending" as any,
      clerkId: userId,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Student",
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      role: "STUDENT",
      isActive: true,
      onboardingCompleted: false,
    } as any;
  }

  // 4. Verify user is not already enrolled or already paid
  const checkoutStatus = await fetchQuery(
    api.payments.getCheckoutStatus,
    { courseId: course.id as Id<"courses">, batchId: batchId as Id<"batches"> },
    { token }
  );

  if (checkoutStatus?.hasSuccessfulPayment || checkoutStatus?.hasActiveEnrollment) {
    // Already enrolled or paid, redirect directly to dashboard
    redirect(`/dashboard/courses/${checkoutStatus.batchId}/overview`);
  }

  // Compute fees
  const subtotal = course.price;
  const tax = Math.round(subtotal * 0.18); // 18% GST standard EdTech tax in India
  const total = subtotal; // Price is inclusive of tax in our model
  const netAmount = subtotal - tax;
  const batch = targetBatch;
  const courseSlug = course.slug;


  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <Link
            href={courseSlug === "build-software-with-ai" || courseSlug === "ai-build-sprint" ? "/build-software-with-ai" : "/"}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Course Details
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secured Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Summary & Student info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3 text-left">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Review Program Details</h1>
              <p className="text-sm text-text-secondary">
                Verify your cohort schedule and profile information before proceeding to payment.
              </p>
            </div>

            {/* Course & Batch Card */}
            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{course.category}</span>
                <h2 className="text-xl font-bold text-text-primary">{course.title}</h2>
              </div>
              
              <div className="h-px bg-border/60" />
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Cohort Batch</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">{batch.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Start Date</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {new Date(batch.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Prefill Info */}
            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm text-left">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Student Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Full Name</label>
                  <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl">
                    {resolvedUser!.name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Email Address</label>
                  <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl truncate">
                    {resolvedUser!.email}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-text-muted">
                * Note: Your course access and updates will be sent to the verified email above.
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Checkout trigger client */}
          <div className="lg:col-span-5">
            <CheckoutClient
              courseSlug={courseSlug}
              batchId={batchId}
              coursePrice={subtotal}
              taxAmount={tax}
              netAmount={netAmount}
              studentName={resolvedUser!.name}
              studentEmail={resolvedUser!.email}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
