"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface MascotProps {
  size?: number;
  mood?: "happy" | "sad" | "thinking" | "celebrating" | "warning";
  className?: string;
  animated?: boolean;
}

/**
 * Cú Đầu Tư — mascot chính của app.
 * Cú vàng với cà vạt đỏ, cầm túi tiền (đô la).
 * Twist rõ từ Duolingo owl nhưng với chủ đề tài chính.
 */
export function CuDauTu({ size = 120, mood = "happy", className, animated = true }: MascotProps) {
  const motionProps = animated
    ? {
        animate:
          mood === "happy"
            ? { y: [0, -4, 0] }
            : mood === "celebrating"
            ? { y: [0, -12, 0], rotate: [0, -5, 5, 0] }
            : mood === "warning"
            ? { x: [0, -3, 3, -3, 0] }
            : { y: 0 },
        transition: { duration: 0.6, repeat: mood === "celebrating" ? 2 : Infinity, repeatDelay: 3 },
      }
    : {};

  return (
    <motion.div className={cn("inline-block", className)} style={{ width: size, height: size }} {...motionProps}>
      <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-md">
        {/* Body — owl body */}
        <ellipse cx="100" cy="125" rx="55" ry="55" fill="#FFC107" />
        <ellipse cx="100" cy="135" rx="38" ry="38" fill="#FFE082" />

        {/* Wings */}
        <ellipse cx="50" cy="125" rx="18" ry="35" fill="#FFA000" transform="rotate(-15 50 125)" />
        <ellipse cx="150" cy="125" rx="18" ry="35" fill="#FFA000" transform="rotate(15 150 125)" />

        {/* Head */}
        <ellipse cx="100" cy="80" rx="60" ry="55" fill="#FFC107" />

        {/* Ear tufts */}
        <path d="M 55 45 L 45 20 L 70 35 Z" fill="#FFA000" />
        <path d="M 145 45 L 155 20 L 130 35 Z" fill="#FFA000" />

        {/* Eye discs (white) */}
        <circle cx="75" cy="80" r="20" fill="#FFFFFF" />
        <circle cx="125" cy="80" r="20" fill="#FFFFFF" />

        {/* Eyes */}
        {mood === "sad" ? (
          <>
            <path d="M 65 80 Q 75 85 85 80" stroke="#1F1F1F" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 115 80 Q 125 85 135 80" stroke="#1F1F1F" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === "thinking" ? (
          <>
            <circle cx="78" cy="82" r="6" fill="#1F1F1F" />
            <circle cx="128" cy="82" r="6" fill="#1F1F1F" />
          </>
        ) : (
          <>
            <circle cx="78" cy="80" r="7" fill="#1F1F1F" />
            <circle cx="128" cy="80" r="7" fill="#1F1F1F" />
            <circle cx="80" cy="78" r="2" fill="#FFFFFF" />
            <circle cx="130" cy="78" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Beak */}
        <path d="M 90 95 L 100 110 L 110 95 Z" fill="#FF6F00" />

        {/* Tie (cà vạt) */}
        <path d="M 100 115 L 95 130 L 100 135 L 105 130 Z" fill="#E53935" />
        <path d="M 95 130 L 90 175 L 100 165 L 110 175 L 105 130 Z" fill="#E53935" />
        <path d="M 95 130 L 100 140 L 105 130 Z" fill="#B71C1C" />

        {/* Money bag (túi tiền) */}
        <g transform="translate(140, 130)">
          <ellipse cx="0" cy="20" rx="22" ry="20" fill="#8D6E63" />
          <path d="M -15 5 Q 0 -5 15 5 L 12 0 L 8 -2 L 4 -4 L 0 -5 L -4 -4 L -8 -2 L -12 0 Z" fill="#6D4C41" />
          <text x="0" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#FFD700">
            $
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
