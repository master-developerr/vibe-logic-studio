import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

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
        className={`${poppins.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
