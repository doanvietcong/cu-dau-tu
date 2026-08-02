"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { Button } from "@/components/ui/Button";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const existingUser = useUserStore((s) => s.user);
  const createUser = useUserStore((s) => s.createUser);

  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Wait for Zustand persist middleware to rehydrate from localStorage before checking.
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSignIn = () => {
    if (!email || !email.includes("@")) {
      toast.error("Email chưa hợp lệ!");
      return;
    }
    if (password.length < 1) {
      toast.error("Nhập mật khẩu!");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      // If the same email is already saved locally → keep that user (restore progress).
      // Otherwise create a fresh account using the email local-part as display name.
      if (existingUser && existingUser.email === email) {
        toast.success("Chào mừng quay lại! 🦉");
        router.push(existingUser.hasOnboarded ? "/learn" : "/onboarding");
        return;
      }

      const name = email.split("@")[0] || "Nhà đầu tư";
      createUser({
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        email,
      });
      toast.success("Tạo tài khoản mới — chào mừng! 🦉");
      router.push("/onboarding");
    }, 500);
  };

  // After hydration, prefill email with the saved one for convenience.
  useEffect(() => {
    if (hydrated && existingUser?.email && !email) {
      setEmail(existingUser.email);
    }
  }, [hydrated, existingUser, email]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-duolingo-green/10 to-duolingo-blue/10 px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-duolingo-gray-3 hover:text-duolingo-green">
          ← Về trang chủ
        </Link>

        <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-6 shadow-duo-card">
          <div className="mb-4 flex justify-center">
            <CuDauTu size={100} mood="happy" />
          </div>

          <h1 className="text-center font-display text-2xl font-extrabold text-duolingo-gray-5">
            Đăng nhập
          </h1>
          <p className="mt-1 text-center text-sm text-duolingo-gray-3">
            Tiếp tục hành trình tài chính của bạn
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-duolingo-gray-4">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-duolingo-gray-1 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-duolingo-green"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-duolingo-gray-4">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border-2 border-duolingo-gray-1 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-duolingo-green"
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
            </div>
          </div>

          <Button onClick={handleSignIn} loading={loading} fullWidth size="lg" className="mt-6">
            Đăng nhập
          </Button>

          <div className="mt-6 text-center text-sm text-duolingo-gray-3">
            Chưa có tài khoản?{" "}
            <Link href="/auth/sign-up" className="font-bold text-duolingo-blue hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
