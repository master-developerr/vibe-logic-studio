import React from "react";

export function TechIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case "react":
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case "next.js":
    case "nextjs":
      return (
        <svg viewBox="0 0 180 180" className={className} fill="none">
          <mask id="nextjs-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="#000" />
          </mask>
          <g mask="url(#nextjs-mask)">
            <circle cx="90" cy="90" r="90" fill="#000" />
            <path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="#FFF" />
            <rect x="115" y="54" width="12" height="72" fill="#FFF" />
          </g>
        </svg>
      );
    case "typescript":
      return (
        <svg viewBox="0 0 128 128" className={className}>
          <rect width="128" height="128" rx="16" fill="#3178C6" />
          <path d="M72.5 86.8c1.8 3.5 4.6 6.3 8.3 8.3 3.7 2 8 3 12.8 3 4.2 0 7.8-.7 10.9-2.2 3.1-1.5 5.5-3.6 7.2-6.3 1.7-2.7 2.6-5.8 2.6-9.3 0-3.3-.8-6.1-2.3-8.5-1.5-2.4-3.6-4.4-6.3-5.9-2.7-1.5-6.2-3-10.4-4.3-4.3-1.4-7.5-2.6-9.6-3.7-2.1-1.1-3.7-2.4-4.8-4-1.1-1.6-1.6-3.5-1.6-5.7 0-2.4.7-4.5 2.1-6.3 1.4-1.8 3.4-3.2 5.9-4.2 2.5-1 5.3-1.5 8.5-1.5 3.3 0 6.3.6 9 1.8 2.7 1.2 4.9 2.9 6.6 5.1 1.7 2.2 2.7 4.7 3.1 7.5l-12.8 3.7c-.3-1.9-1.1-3.4-2.4-4.5-1.3-1.1-3.1-1.7-5.4-1.7-2 0-3.7.5-5 1.5-1.3 1-2 2.4-2 4.2 0 1.5.5 2.8 1.5 3.8 1 1 2.5 1.9 4.4 2.6 1.9.8 4.6 1.7 8.1 2.9 4.8 1.6 8.5 3.1 11.2 4.6 2.7 1.5 4.7 3.5 6.1 5.9 1.4 2.4 2.1 5.3 2.1 8.8 0 3.7-1 7.1-3 10.1-2 3-4.8 5.4-8.4 7.1-3.6 1.7-8 2.6-13.1 2.6-6.1 0-11.4-1.3-15.8-3.9-4.4-2.6-7.5-6.3-9.3-11.1l13-4.9zm-55-46.3h45.2v12.2H47.1v56.5H33.3V52.7H17.5V40.5z" fill="#FFF" />
        </svg>
      );
    case "javascript":
      return (
        <svg viewBox="0 0 128 128" className={className}>
          <rect width="128" height="128" rx="16" fill="#F7DF1E" />
          <path d="M72.2 86.8c1.8 3.5 4.6 6.3 8.3 8.3 3.7 2 8 3 12.8 3 4.2 0 7.8-.7 10.9-2.2 3.1-1.5 5.5-3.6 7.2-6.3 1.7-2.7 2.6-5.8 2.6-9.3 0-3.3-.8-6.1-2.3-8.5-1.5-2.4-3.6-4.4-6.3-5.9-2.7-1.5-6.2-3-10.4-4.3-4.3-1.4-7.5-2.6-9.6-3.7-2.1-1.1-3.7-2.4-4.8-4-1.1-1.6-1.6-3.5-1.6-5.7 0-2.4.7-4.5 2.1-6.3 1.4-1.8 3.4-3.2 5.9-4.2 2.5-1 5.3-1.5 8.5-1.5 3.3 0 6.3.6 9 1.8 2.7 1.2 4.9 2.9 6.6 5.1 1.7 2.2 2.7 4.7 3.1 7.5l-12.8 3.7c-.3-1.9-1.1-3.4-2.4-4.5-1.3-1.1-3.1-1.7-5.4-1.7-2 0-3.7.5-5 1.5-1.3 1-2 2.4-2 4.2 0 1.5.5 2.8 1.5 3.8 1 1 2.5 1.9 4.4 2.6 1.9.8 4.6 1.7 8.1 2.9 4.8 1.6 8.5 3.1 11.2 4.6 2.7 1.5 4.7 3.5 6.1 5.9 1.4 2.4 2.1 5.3 2.1 8.8 0 3.7-1 7.1-3 10.1-2 3-4.8 5.4-8.4 7.1-3.6 1.7-8 2.6-13.1 2.6-6.1 0-11.4-1.3-15.8-3.9-4.4-2.6-7.5-6.3-9.3-11.1l13-4.9zm-45.5-1.2c1.4 2.4 3.3 4.2 5.6 5.5 2.3 1.3 4.9 2 7.8 2 2.9 0 5.4-.7 7.4-2.1 2-1.4 3.4-3.3 4.3-5.7.9-2.4 1.3-5.3 1.3-8.8V40.5h14v39.8c0 5.5-1 10.2-2.9 14.1-1.9 3.9-4.8 6.9-8.6 9-3.8 2.1-8.5 3.1-14.1 3.1-5.3 0-10.1-1.2-14.4-3.6-4.3-2.4-7.5-5.9-9.6-10.5l13.2-6.8z" fill="#000" />
        </svg>
      );
    case "python":
      return (
        <svg viewBox="0 0 128 128" className={className}>
          <path d="M63.6 5.8c-14.8 0-25.5 2.9-25.5 14.4v10.5h25.8v3.5H23.5C11.7 34.2 2 43.8 2 63.8c0 19.3 8.2 27.6 22.3 27.6h7.3V80c0-11.3 9.7-21.2 21.2-21.2h25.8V45.2c0-12.7-10.4-22.3-22.6-22.3h-4.3V17c0-6.4 5.4-11.2 11.9-11.2zm-12.5 9c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7z" fill="#3776AB" />
          <path d="M64.4 122.2c14.8 0 25.5-2.9 25.5-14.4V97.3H64.1v-3.5h40.4c11.8 0 21.5-9.6 21.5-29.6 0-19.3-8.2-27.6-22.3-27.6h-7.3V48c0 11.3-9.7 21.2-21.2 21.2H49.4v13.6c0 12.7 10.4 22.3 22.6 22.3h4.3v5.9c0 6.4-5.4 11.2-11.9 11.2zm12.5-9c-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7z" fill="#FFD438" />
        </svg>
      );
    case "html5":
      return (
        <svg viewBox="0 0 512 512" className={className}>
          <path fill="#E34F26" d="M71 460L30 0h452l-41 460-185 52z" />
          <path fill="#EF652A" d="M256 472l149-41 35-391H256z" />
          <path fill="#EBEBEB" d="M256 208h-74l-5-57h79V95H119l15 170h122zM256 355l-1 1-62-17-4-45H133l7 93 116 32z" />
          <path fill="#FFF" d="M256 208v57h70l-7 74-63 17v57l116-32 16-173zM256 95v56h132l5-56z" />
        </svg>
      );
    case "css3":
      return (
        <svg viewBox="0 0 512 512" className={className}>
          <path fill="#1572B6" d="M71 460L30 0h452l-41 460-185 52z" />
          <path fill="#33A9DC" d="M256 472l149-41 35-391H256z" />
          <path fill="#EBEBEB" d="M256 208h-74l-5-57h79V95H119l15 170h122zM256 355l-1 1-62-17-4-45H133l7 93 116 32z" />
          <path fill="#FFF" d="M256 208v57h70l-7 74-63 17v57l116-32 16-173zM256 95v56h132l5-56z" />
        </svg>
      );
    case "vite":
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <path d="M29.5 5.5l-13 24.5-13-24.5 13 4.5 13-4.5z" fill="#BD34FE" />
          <path d="M29.5 5.5l-13 4.5v24.5l13-24.5z" fill="#41D1FF" />
          <path d="M16.5 1l-10 13.5h7l-3 9 12-14.5h-7l4-8h-3z" fill="#FFD438" />
        </svg>
      );
    case "mongodb":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 1.5c-1.5 3-4 6.5-4 10.5 0 4.5 3.5 8 4 10.5.5-2.5 4-6 4-10.5 0-4-2.5-7.5-4-10.5z" fill="#47A248" />
          <path d="M12 1.5v21c.5-2.5 4-6 4-10.5 0-4-2.5-7.5-4-10.5z" fill="#499D4A" />
        </svg>
      );
    case "firebase":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M4.5 18.5l2-14.5 4 7.5-6 7z" fill="#FFA000" />
          <path d="M14 6.5l2.5-5 4 17-6.5-12z" fill="#F57C00" />
          <path d="M19.5 18.5l-7.5 4.5-7.5-4.5 6-7 9 7z" fill="#FFCA28" />
        </svg>
      );
    case "supabase":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M21.362 9.354H12V.3a.3.3 0 0 0-.515-.21L.618 12.046a.3.3 0 0 0 .213.514H12v9.054a.3.3 0 0 0 .515.21l10.867-11.956a.3.3 0 0 0-.213-.514h-1.807z" fill="#3ECF8E" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "vercel":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 1L24 22H0L12 1Z" />
        </svg>
      );
    case "cloudflare":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M18.5 10c-.3-2.8-2.6-5-5.5-5-2.2 0-4.1 1.2-5 3C5.7 8.3 4 10 4 12c0 2.2 1.8 4 4 4h10.5c2 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.5-3.5z" fill="#F38020" />
        </svg>
      );
    case "netlify":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 13.8l-6 3.7-6-3.7V8.2l6-3.7 6 3.7v7.6z" fill="#00C7B7" />
        </svg>
      );
    case "google ai studio":
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 2c.5 5 4.5 9 9.5 9.5-5 .5-9 4.5-9.5 9.5-.5-5-4.5-9-9.5-9.5 5-.5 9-4.5 9.5-9.5z" fill="#1A73E8" />
          <path d="M12 5c.3 3.5 3.2 6.4 6.7 6.7-3.5.3-6.4 3.2-6.7 6.7-.3-3.5-3.2-6.4-6.7-6.7 3.5-.3 6.4-3.2 6.7-6.7z" fill="#8AB4F8" />
        </svg>
      );
    case "cursor":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect width="24" height="24" rx="6" fill="#171717" />
          <path d="M7 6l10 5.5-5 1.5-1.5 5L7 6z" fill="#00F0FF" />
        </svg>
      );
    case "lovable":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF5A5F" />
        </svg>
      );
    case "bolt.new":
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#171717" />
          <path d="M13 5l-5 8h4l-2 6 7-9h-4l2-5z" fill="#FFD438" />
        </svg>
      );
    case "replit":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M4 4h7v5H4zm0 5.5h16v5H4zm0 6h7v5H4z" fill="#F26207" />
        </svg>
      );
    case "v0":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect width="24" height="24" rx="5" fill="#000" />
          <path d="M6 8l4 8 4-8m2 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "convex":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 3.2L18.4 8 12 11.6 5.6 8 12 5.2z" fill="#FF5722" />
        </svg>
      );
    case "visual studio code":
    case "vscode":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M17.5 2L6.5 12l11 10 4.5-2V4l-4.5-2zm-11 10L2 8.5v7l4.5-3.5zm7.5 4.5L9 12l5-4.5v9z" fill="#007ACC" />
        </svg>
      );
    case "figma":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M8 2h4v5H8a2.5 2.5 0 0 1 0-5z" fill="#F24E1E" />
          <path d="M12 2h4a2.5 2.5 0 0 1 0 5h-4V2z" fill="#FF7262" />
          <path d="M8 7h4v5H8a2.5 2.5 0 0 1 0-5z" fill="#A259FF" />
          <path d="M12 7h4a2.5 2.5 0 0 1 0 5h-4V7z" fill="#1ABCFE" />
          <circle cx="10.5" cy="14.5" r="2.5" fill="#0ACF83" />
        </svg>
      );
    case "postman":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#FF6C37" />
          <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-1 3h2v4h-2V9zm0 5h2v2h-2v-2z" fill="#FFF" />
        </svg>
      );
    case "chrome":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#EA4335" />
          <circle cx="12" cy="12" r="5" fill="#FFF" />
          <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
        </svg>
      );
    case "mozilla firefox":
    case "firefox":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10" fill="#FF7139" />
          <path d="M12 4a8 8 0 1 0 8 8c0-3-2-5-4-5 1 2 0 4-2 4 1-3-1-5-2-7z" fill="#FFF" opacity=".8" />
        </svg>
      );
    case "microsoft edge":
    case "edge":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7 9.5-1-1.5-1.5-3.3-1.5-5 0-4.7 3.8-8.5 8.5-8.5h1.5C16.5 4.3 14.4 2 12 2z" fill="#0078D7" />
          <path d="M22 12c0 5.5-4.5 10-10 10 2.5 0 4.8-.9 6.6-2.4C17 18 16 16.5 16 15c0-2.8 2.2-5 5-5h1z" fill="#00BCF2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8m-4-4h8" />
        </svg>
      );
  }
}
