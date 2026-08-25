"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-left">
      <div className="max-w-md w-full bg-white border border-[#EBE7DF] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Application State
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] tracking-tight">
            Something went wrong.
          </h1>
          <p className="text-sm text-[#737373] leading-relaxed">
            An unexpected issue occurred while rendering this view. Your session and data are secure.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0D0D0D] text-white text-xs font-bold hover:bg-[#262626] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#EBE7DF] text-[#0D0D0D] text-xs font-bold hover:bg-[#FDFBF7] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
