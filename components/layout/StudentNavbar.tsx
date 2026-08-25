"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function StudentNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  const firstName = user?.name?.split(" ")[0] || "Student";
  const studentId = user?._id?.slice(-4).toUpperCase() || "N/A";
  const avatarUrl = user?.avatarUrl;

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Courses", href: "/dashboard/courses" },
    { name: "Certificates", href: "/dashboard/certificates" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 flex items-center px-6 lg:px-12 h-[72px] shrink-0 sticky top-0 z-50">
      {/* LEFT: Branding */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-6 lg:mr-10">
        <div className="w-8 h-8 rounded-lg bg-[#FF5722] flex items-center justify-center text-white shrink-0">
          <Zap className="w-4 h-4" fill="currentColor" strokeWidth={0} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 shrink-0 whitespace-nowrap">
          VibeLogic <span className="font-normal text-gray-500">Studio</span>
        </span>
      </Link>

      {/* CENTER: NAVIGATION */}
      <nav className="flex items-center gap-6 lg:gap-8 h-full shrink-0">
        {links.map((link) => {
          let isActive = false;
          if (link.name === "Dashboard") {
            isActive = pathname === "/dashboard";
          } else if (link.name === "My Courses") {
            isActive = pathname.startsWith("/dashboard/courses");
          } else {
            isActive = pathname.startsWith(link.href);
          }
          return (
            <Link 
              key={link.name}
              href={link.href} 
              className={`h-[72px] flex items-center text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive 
                  ? "text-[#FF5722] border-[#FF5722]" 
                  : "text-gray-500 hover:text-gray-900 border-transparent font-medium"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT: Profile */}
      <div className="flex items-center gap-6 shrink-0 ml-auto">
        <button className="text-gray-500 hover:text-gray-900 transition-colors shrink-0">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 hidden sm:block shrink-0" />

        <div className="flex items-center gap-3 relative group cursor-pointer shrink-0">
          <div className="text-right hidden sm:block shrink-0">
            <p className="text-sm font-bold text-gray-900 leading-tight whitespace-nowrap">{user?.name || "Student"}</p>
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Student ID: {studentId}</p>
          </div>
          
          {/* We wrap UserButton in an absolute div with 0 opacity so it takes the click but shows our custom UI */}
          <div className="flex items-center gap-1 relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center overflow-hidden shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-orange-600 font-bold text-sm">
                  {firstName.charAt(0)}{user?.name?.split(" ")[1]?.charAt(0) || ""}
                </span>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            
            <div className="absolute inset-0 opacity-0 w-full h-full">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
