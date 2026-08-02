"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: "green" | "gold" | "red" | "blue" | "orange";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const colorClasses = {
  green: "bg-duolingo-green",
  gold: "bg-duolingo-gold",
  red: "bg-duolingo-red",
  blue: "bg-duolingo-blue",
  orange: "bg-duolingo-orange",
};

const heightClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({ value, max = 100, color = "green", size = "md", className, showLabel = false }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-duolingo-gray-1", heightClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs font-bold text-duolingo-gray-3">
          <span>{Math.round(pct)}%</span>
        </div>
      )}
    </div>
  );
}

interface RingProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RingProgress({ value, size = 80, strokeWidth = 8, color = "#58CC02", bgColor = "#E5E5E5", children, className }: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={bgColor} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{children}</div>}
    </div>
  );
}
