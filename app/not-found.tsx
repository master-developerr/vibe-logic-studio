import Link from "next/link";
import { ArrowLeft, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-left">
      <div className="max-w-md w-full bg-white border border-[#EBE7DF] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5A1F]">
            404 · Page Not Found
          </span>
          <h1 className="text-2xl font-bold text-[#0D0D0D] tracking-tight">
            This workspace or program does not exist.
          </h1>
          <p className="text-sm text-[#737373] leading-relaxed">
            The link you followed may be expired, misrouted, or requires active enrollment.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0D0D0D] text-white text-xs font-bold hover:bg-[#262626] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#EBE7DF] text-[#0D0D0D] text-xs font-bold hover:bg-[#FDFBF7] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Student Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
