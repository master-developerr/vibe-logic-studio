import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center bg-[#FAF7F3]/92 backdrop-blur-sm border-b border-[#E6E2DC]">
      <div className="max-w-[1280px] w-full mx-auto px-8 lg:px-12 flex items-center justify-between">

        {/* Left: Logo + Nav links */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="VibeLogic Studio — Home"
          >
            {/* Logo mark */}
            <div className="w-7 h-7 bg-[#0D0D0D] rounded-[5px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF5A1F] transition-colors duration-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF7F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
              </svg>
            </div>
            {/* Wordmark */}
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#0D0D0D] leading-none whitespace-nowrap">
              VibeLogic Studio
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="flex items-center gap-2 text-[13px] font-medium text-[#0D0D0D] transition-colors"
              aria-current="page"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-[#FF5A1F] flex-shrink-0" aria-hidden="true" />
              Home
            </Link>
            <Link
              href="#courses"
              className="text-[13px] font-medium text-[#525252] hover:text-[#0D0D0D] transition-colors duration-150"
            >
              Courses
            </Link>
            <Link
              href="#about"
              className="text-[13px] font-medium text-[#525252] hover:text-[#0D0D0D] transition-colors duration-150"
            >
              About
            </Link>
          </div>
        </div>

        {/* Right: Auth CTAs */}
        <div className="flex items-center gap-5">
          <Link
            href="/sign-in?fallback_redirect_url=/dashboard"
            className="hidden md:block text-[13px] font-medium text-[#525252] hover:text-[#0D0D0D] transition-colors duration-150"
          >
            Sign In
          </Link>
          <Link
            href="/build-software-with-ai#course-offer"
            className="flex items-center gap-2 bg-[#FF5A1F] text-white text-[13px] font-semibold px-4 py-2 rounded-[6px] hover:bg-[#e64e18] active:scale-[0.97] transition-all duration-150 whitespace-nowrap"
          >
            Get Started
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
