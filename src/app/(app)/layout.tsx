"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const _tickDaily = useUserStore((s) => s._tickDaily);

  // Auth gate — must be called unconditionally on every render.
  useEffect(() => {
    if (user === null) {
      // Wait for hydration to complete
      const t = setTimeout(() => {
        const u = useUserStore.getState().user;
        if (!u) router.replace("/");
        else _tickDaily();
      }, 100);
      return () => clearTimeout(t);
    } else {
      _tickDaily();
    }
  }, [user, router, _tickDaily]);

  // Onboarding gate — only schedule the redirect after the user is loaded.
  useEffect(() => {
    if (user && !user.hasOnboarded) {
      router.replace("/onboarding");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-4xl">🦉</div>
          <p className="mt-2 text-duolingo-gray-3">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user.hasOnboarded) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-duolingo-snow">
      <TopBar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
