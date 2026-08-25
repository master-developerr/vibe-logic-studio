import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeLogic Studio | Build software with AI",
  description: "An AI-first learning platform where beginners build real-world web applications in seven focused days.",
  keywords: ["AI development", "web development bootcamp", "React", "Next.js", "VibeLogic Studio"],
};

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-full flex flex-col font-sans">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
