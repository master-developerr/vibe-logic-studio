import Link from "next/link";
import { Zap } from "lucide-react";

export function StudentDashboardFooter() {
  return (
    <footer className="w-full border-t border-gray-100 bg-[#FBFBFB] py-8 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#FF5722] flex items-center justify-center text-white shrink-0">
            <Zap className="w-3 h-3" fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-sm font-bold text-gray-900">
            VibeLogic <span className="font-normal text-gray-500">Studio</span>
          </span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6">
          <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Support</Link>
          <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
        </div>

        {/* Right */}
        <div>
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} VibeLogic Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
