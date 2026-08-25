import Link from "next/link";

/**
 * Footer — Minimal dark footer.
 * Tagline: "Software, systems, and practical ways to learn by making."
 */
export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/8 text-[13px]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">

          {/* Left — brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-6 h-6 bg-[#FF5A1F] rounded-[4px] flex items-center justify-center flex-shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-white tracking-[-0.01em]">VibeLogic Studio</span>
            </div>
            <p className="text-[12px] text-white/30 max-w-[260px] leading-[1.55]">
              Software, systems, and practical ways to learn by making.
            </p>
          </div>

          {/* Right — nav */}
          <nav aria-label="Footer navigation">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0">
              {/* Col 1 */}
              <div className="flex flex-col gap-2.5 md:mr-12">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-1">Navigate</span>
                {[
                  { label: "Home", href: "/" },
                  { label: "Courses", href: "#courses" },
                  { label: "About", href: "#about" },
                ].map(({ label, href }) => (
                  <Link key={label} href={href} className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-150">
                    {label}
                  </Link>
                ))}
              </div>
              {/* Col 2 */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-1">Support</span>
                {[
                  { label: "Support", href: "mailto:hello@vibelogic.studio" },
                  { label: "Privacy", href: "#" },
                  { label: "Terms", href: "#" },
                ].map(({ label, href }) => (
                  href.startsWith("mailto") ? (
                    <a key={label} href={href} className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-150">
                      {label}
                    </a>
                  ) : (
                    <Link key={label} href={href} className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-150">
                      {label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p className="text-[11px] text-white/20 font-mono">
            © 2026 VibeLogic Studio. All rights reserved.
          </p>
          <p className="text-[11px] text-white/15 font-mono">
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
