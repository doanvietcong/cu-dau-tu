"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface StatBadgeProps {
  icon: React.ReactNode;
  value: number | string;
  label?: string;
  color?: "green" | "gold" | "red" | "blue" | "orange" | "purple";
  className?: string;
  pulse?: boolean;
}

const colorMap = {
  green: "text-wisdom",
  gold: "text-coin",
  red: "text-heart",
  blue: "text-duolingo-blue",
  orange: "text-streak",
  purple: "text-duolingo-purple",
};

export function StatBadge({ icon, value, label, color = "green", className, pulse = false }: StatBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <motion.span
        className={cn("flex items-center text-lg", colorMap[color])}
        animate={pulse ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        {icon}
      </motion.span>
      <span className="font-bold text-duolingo-gray-5">{value}</span>
      {label && <span className="text-xs text-duolingo-gray-3">{label}</span>}
    </div>
  );
}

interface HeartCounterProps {
  hearts: number;
  maxHearts?: number;
  size?: "sm" | "md" | "lg";
}

export function HeartCounter({ hearts, maxHearts = 5, size = "md" }: HeartCounterProps) {
  const dim = size === "lg" ? 28 : size === "md" ? 24 : 18;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-heart text-lg" style={{ fontSize: dim }}>❤️</span>
      <span className="font-extrabold text-duolingo-gray-5 text-lg">{hearts}</span>
    </div>
  );
}

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakCounter({ streak, size = "md" }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        className="text-lg"
        style={{ fontSize: size === "lg" ? 28 : size === "md" ? 24 : 18 }}
        animate={streak > 0 ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
      >
        🔥
      </motion.span>
      <span className="font-extrabold text-streak text-lg">{streak}</span>
    </div>
  );
}
