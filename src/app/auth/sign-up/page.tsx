"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { Button } from "@/components/ui/Button";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { motion } from "framer-motion";
import { toast } from "sonner";

const avatarChoices = ["🦉", "🦊", "🐯", "🐼", "🦁", "🐰", "🐢", "🦄", "🐳", "🦅"];

export default function SignUpPage() {
  const router = useRouter();
  const createUser = useUserStore((s) => s.createUser);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🦉");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error("Nhập tên hiển thị nhé!");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!email || !email.includes("@")) {
        toast.error("Email chưa hợp lệ!");
        return;
      }
      if (password.length < 4) {
        toast.error("Mật khẩu tối thiểu 4 ký tự!");
        return;
      }
      setStep(3);
    } else {
      setLoading(true);
      setTimeout(() => {
        createUser({ displayName: name, email, avatarEmoji: avatar });
        toast.success("Chào mừng bạn! 🦉");
        router.push("/onboarding");
      }, 500);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-duolingo-green/10 to-duolingo-gold/10 px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-duolingo-gray-3 hover:text-duolingo-green">
          ← Về trang chủ
        </Link>

        <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-6 shadow-duo-card">
          <div className="mb-4 flex justify-center">
            <CuDauTu size={100} mood="happy" />
          </div>

          <h1 className="text-center font-display text-2xl font-extrabold text-duolingo-gray-5">
            Tạo tài khoản
          </h1>
          <p className="mt-1 text-center text-sm text-duolingo-gray-3">
            Bước {step}/3 · {step === 1 ? "Tên của bạn" : step === 2 ? "Email & mật khẩu" : "Chọn avatar"}
          </p>

          {/* Step indicators */}
          <div className="my-4 flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-duolingo-green" : "bg-duolingo-gray-1"}`}
              />
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-duolingo-gray-4">Tên hiển thị</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Minh Đầu Tư"
                  className="w-full rounded-xl border-2 border-duolingo-gray-1 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-duolingo-green"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
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
                  placeholder="Tối thiểu 4 ký tự"
                  className="w-full rounded-xl border-2 border-duolingo-gray-1 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-duolingo-green"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <p className="text-center text-sm text-duolingo-gray-3">Chọn avatar của bạn</p>
              <div className="grid grid-cols-5 gap-2">
                {avatarChoices.map((e) => (
                  <button
                    key={e}
                    onClick={() => setAvatar(e)}
                    className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-3xl transition-all ${
                      avatar === e
                        ? "border-duolingo-green bg-duolingo-green/10 scale-110"
                        : "border-duolingo-gray-1 bg-white hover:border-duolingo-green/50"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <Button onClick={handleNext} loading={loading} fullWidth size="lg" className="mt-6">
            {step === 3 ? "Hoàn tất 🎉" : "Tiếp tục →"}
          </Button>

          {step > 1 && (
            <button onClick={() => setStep((step - 1) as 1 | 2)} className="mt-3 w-full text-sm font-bold text-duolingo-gray-3 hover:text-duolingo-gray-4">
              ← Quay lại
            </button>
          )}

          <div className="mt-6 text-center text-sm text-duolingo-gray-3">
            Đã có tài khoản?{" "}
            <Link href="/auth/sign-in" className="font-bold text-duolingo-blue hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
