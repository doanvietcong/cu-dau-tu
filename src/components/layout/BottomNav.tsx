"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Trophy, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/learn",        label: "Học",       icon: Home },
  { href: "/leaderboard",  label: "BXH",       icon: Trophy },
  { href: "/shop",         label: "Shop",      icon: ShoppingBag },
  { href: "/stats",        label: "Tiến độ",   icon: BarChart3 },
  { href: "/profile",      label: "Tôi",       icon: User },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-duolingo-gray-1 bg-white safe-bottom">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {items.map((it) => {
          const active = path === it.href || path?.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors",
                active ? "text-duolingo-green" : "text-duolingo-gray-3"
              )}
            >
              <Icon size={26} strokeWidth={active ? 2.5 : 2} />
              <span className={cn("text-[10px] font-bold", active && "font-extrabold")}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
