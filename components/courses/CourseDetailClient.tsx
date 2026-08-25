"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface CourseDetailClientProps {
  topic: string;
  index: number;
  isLast: boolean;
}

export function CourseDetailClient({ topic, index, isLast }: CourseDetailClientProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.23, 1, 0.32, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`flex gap-8 md:gap-12 py-8 ${!isLast ? "border-b border-border/40" : ""}`}
    >
      {/* Number — animated to primary on hover */}
      <motion.span
        animate={{ color: isHovered ? "var(--color-primary)" : "var(--color-border)" }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="text-[2rem] md:text-[2.75rem] font-bold tabular-nums w-14 md:w-20 shrink-0 leading-none pt-1 select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* Topic text */}
      <div className="flex-1 flex items-start justify-between gap-4 min-w-0">
        <motion.h3
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="text-xl md:text-[1.625rem] font-bold text-text-primary leading-tight tracking-[-0.02em]"
        >
          {topic}
        </motion.h3>

        {/* Arrow indicator */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="shrink-0 mt-1 text-primary"
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </motion.article>
  );
}
