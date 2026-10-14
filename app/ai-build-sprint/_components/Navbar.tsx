"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FF5722] focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold text-[13px] focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full bg-[#F1EDE4]/95 backdrop-blur-md border-b border-[#D7D0C4] transition-colors">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        
        {/* Brand Wordmark & Studio Mark */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-md"
          aria-label="Vibe Logic Studio Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#F1EDE4] group-hover:bg-[#FF5722] transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h7v7H4z" />
              <path d="M13 13h7v7h-7z" />
              <path d="M4 17l4-4" />
              <path d="M17 4l-4 4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] tracking-[-0.02em] text-[#171717] leading-none">
              Vibe Logic Studio
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-[#5C5851] mt-0.5">
              Think · Build · Ship
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Course Navigation">
          <Link
            href="#curriculum"
            className="text-[13px] font-medium text-[#5C5851] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-sm py-1"
          >
            Curriculum
          </Link>
          <Link
            href="#showcase"
            className="text-[13px] font-medium text-[#5C5851] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-sm py-1"
          >
            Projects
          </Link>
          <Link
            href="#ecosystem"
            className="text-[13px] font-medium text-[#5C5851] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-sm py-1"
          >
            Tools
          </Link>
          <Link
            href="#faq"
            className="text-[13px] font-medium text-[#5C5851] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-sm py-1"
          >
            FAQ
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/sign-in?fallback_redirect_url=/dashboard"
            className="text-[13px] font-medium text-[#5C5851] hover:text-[#171717] px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded"
          >
            Sign In
          </Link>
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            className="inline-flex items-center gap-2 bg-[#171717] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#FF5722] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
          >
            <span>Join the Bootcamp — ₹999</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            className="inline-flex sm:hidden items-center text-[12px] font-semibold bg-[#171717] text-white px-3 py-1.5 rounded-md hover:bg-[#FF5722] transition-colors"
          >
            ₹999
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#171717] hover:text-[#FF5722] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D7D0C4] bg-[#F1EDE4] px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="#curriculum"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[15px] font-medium text-[#171717] py-1 border-b border-[#D7D0C4]/60"
          >
            Curriculum
          </Link>
          <Link
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[15px] font-medium text-[#171717] py-1 border-b border-[#D7D0C4]/60"
          >
            Projects
          </Link>
          <Link
            href="#ecosystem"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[15px] font-medium text-[#171717] py-1 border-b border-[#D7D0C4]/60"
          >
            Developer Tools
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[15px] font-medium text-[#171717] py-1 border-b border-[#D7D0C4]/60"
          >
            FAQ
          </Link>
          <Link
            href="/sign-in?fallback_redirect_url=/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[14px] font-medium text-[#5C5851] py-1"
          >
            Student Sign In
          </Link>
          <Link
            href="/checkout?courseSlug=ai-build-sprint"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center bg-[#FF5722] text-white font-semibold py-3 rounded-lg shadow-sm hover:bg-[#e64b17] transition-colors"
          >
            Join the Bootcamp — ₹999
          </Link>
        </div>
      )}
    </header>
  </>
);
}
