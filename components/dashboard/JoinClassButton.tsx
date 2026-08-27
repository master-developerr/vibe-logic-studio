"use client";

import React, { useState } from "react";
import { ArrowRight, Video } from "lucide-react";
import { markAttendanceClient } from "@/lib/attendance-service";

interface JoinClassButtonProps {
  sessionId: string;
  meetingLink: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "icon" | "full";
}

export function JoinClassButton({
  sessionId,
  meetingLink,
  className,
  children,
  variant = "primary",
}: JoinClassButtonProps) {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isJoining || !meetingLink) return;

    setIsJoining(true);
    try {
      await markAttendanceClient(sessionId, "live_join");
    } catch (err) {
      console.error("Failed to mark live class attendance:", err);
    } finally {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
      setIsJoining(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleJoin}
        disabled={isJoining}
        className={className || "shrink-0 text-[#FF5722] hover:bg-orange-50 p-2 rounded-full transition-colors disabled:opacity-50"}
        title="Join Live Class"
      >
        <Video className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleJoin}
      disabled={isJoining}
      className={
        className ||
        "inline-flex items-center justify-center px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm gap-2 disabled:opacity-50"
      }
    >
      {isJoining ? (
        "Joining..."
      ) : children ? (
        children
      ) : (
        <>
          Join Live Class <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
