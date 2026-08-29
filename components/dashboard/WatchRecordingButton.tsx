"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { markAttendanceClient } from "@/lib/attendance-service";

interface WatchRecordingButtonProps {
  sessionId: string;
  batchId: string;
  className?: string;
  children?: React.ReactNode;
  onWatch?: () => void;
}

export function WatchRecordingButton({
  sessionId,
  batchId,
  className,
  children,
  onWatch,
}: WatchRecordingButtonProps) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  const handleWatch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOpening) return;

    if (onWatch) {
      onWatch();
      return;
    }

    setIsOpening(true);
    try {
      await markAttendanceClient(sessionId, "recording_watch");
    } catch (err) {
      console.error("Failed to mark recording attendance:", err);
    } finally {
      router.push(`/dashboard/courses/${batchId}/recordings/${sessionId}`);
    }
  };

  return (
    <button
      onClick={handleWatch}
      disabled={isOpening}
      className={
        className ||
        "inline-flex items-center gap-1.5 text-primary hover:text-primary-hover text-xs font-bold transition-colors disabled:opacity-50"
      }
    >
      {isOpening ? (
        "Opening..."
      ) : children ? (
        children
      ) : (
        <>
          Watch Recording <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  );
}
