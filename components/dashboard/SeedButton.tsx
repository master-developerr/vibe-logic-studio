"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, Database } from "lucide-react";

export function SeedButton({ clerkId }: { clerkId: string }) {
  const [isPending, setIsPending] = useState(false);
  const seedCourseAndEnroll = useMutation(api.seed.seedCourseAndEnroll);
  const router = useRouter();

  const handleSeed = async () => {
    setIsPending(true);
    try {
      await seedCourseAndEnroll({ clerkId });
      router.refresh(); // Refresh the page to load new dashboard data
    } catch (error) {
      console.error("Failed to seed database:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleSeed}
      disabled={isPending}
      className="mt-6 flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Database className="w-5 h-5" />
      )}
      Seed Mock Data (Dev Only)
    </button>
  );
}
