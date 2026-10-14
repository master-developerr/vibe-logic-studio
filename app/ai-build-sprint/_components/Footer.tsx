import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F1EDE4] text-[#171717] pt-16 pb-12 border-t border-[#D7D0C4]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#D7D0C4]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-3 mb-4 group"
              aria-label="Vibe Logic Studio Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#F1EDE4] group-hover:bg-[#FF5722] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h7v7H4z" />
                  <path d="M13 13h7v7h-7z" />
                  <path d="M4 17l4-4" />
                  <path d="M17 4l-4 4" />
                </svg>
              </div>
              <span className="font-bold text-[17px] tracking-tight text-[#171717]">
                Vibe Logic Studio
              </span>
            </Link>

            <p className="text-[14px] font-mono text-[#FF5722] font-semibold mb-3">
              Think it. Build it. Ship it.
            </p>

            <p className="text-[14px] text-[#5C5851] max-w-[340px] leading-relaxed">
              A modern creative coding studio empowering beginners to turn ideas into published web applications with AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#737373] mb-4 font-semibold">
              Bootcamp
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#curriculum" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  7-Day Curriculum
                </Link>
              </li>
              <li>
                <Link href="#showcase" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  Project Outputs
                </Link>
              </li>
              <li>
                <Link href="#ecosystem" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link href="/checkout?courseSlug=ai-build-sprint" className="text-[#FF5722] font-semibold hover:underline">
                  Enrolment (₹999)
                </Link>
              </li>
            </ul>
          </div>

          {/* Student & Learning */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#737373] mb-4 font-semibold">
              Students
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="/sign-in?fallback_redirect_url=/dashboard" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  Learning Portal
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#outcomes" className="text-[#5C5851] hover:text-[#171717] transition-colors">
                  Teaching Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#737373] mb-4 font-semibold">
              Support & Inquiries
            </h4>
            <p className="text-[13px] text-[#5C5851] mb-2 leading-relaxed">
              Have questions about batch dates, curriculum, or payments?
            </p>
            <a
              href="mailto:hello@vibelogic.studio"
              className="text-[14px] font-semibold text-[#171717] hover:text-[#FF5722] transition-colors inline-block"
            >
              hello@vibelogic.studio
            </a>
            <div className="mt-4 pt-3 border-t border-[#D7D0C4]/60 text-[12px] text-[#737373]">
              Hours: Mon–Sat, 10:00 AM – 7:00 PM IST
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#737373]">
          <div>
            © {new Date().getFullYear()} Vibe Logic Studio. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="#faq" className="hover:text-[#171717] transition-colors">
              Refund Policy
            </Link>
            <Link href="#faq" className="hover:text-[#171717] transition-colors">
              Terms of Service
            </Link>
            <Link href="#faq" className="hover:text-[#171717] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
