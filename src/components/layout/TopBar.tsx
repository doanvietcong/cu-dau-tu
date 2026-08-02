"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { HeartCounter, StreakCounter } from "@/components/ui/StatBadge";
import { motion } from "framer-motion";

export function TopBar() {
  const user = useUserStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="sticky top-0 z-30 border-b-2 border-duolingo-gray-1 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2">
        {/* Left: streak */}
        <Link href="/profile" className="flex items-center gap-1">
          <StreakCounter streak={user.streak} />
        </Link>

        {/* Center: gems (coins) */}
        <Link href="/shop" className="flex items-center gap-1.5">
          <span className="text-xl">💎</span>
          <motion.span
            key={user.coins}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="font-extrabold text-duolingo-blue text-lg"
          >
            {user.coins}
          </motion.span>
        </Link>

        {/* Right: hearts */}
        <Link href="/shop" className="flex items-center">
          <HeartCounter hearts={user.hearts} maxHearts={user.maxHearts} />
        </Link>
      </div>
    </div>
  );
}
