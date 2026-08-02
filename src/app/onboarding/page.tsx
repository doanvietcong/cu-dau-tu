"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/userStore";
import { Button } from "@/components/ui/Button";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { financialGoalLabels, type FinancialGoal } from "@/types";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<FinancialGoal | null>(user?.financialGoal ?? null);
  const [dailyXp, setDailyXp] = useState<number>(user?.dailyGoalXp ?? 20);

  // Redirect to sign-up if no user after hydration completes.
  // Called unconditionally on every render.
  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => {
        if (!useUserStore.getState().user) router.replace("/auth/sign-up");
      }, 150);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-duolingo-snow">
        <div className="text-center">
          <div className="text-4xl">🦉</div>
          <p className="mt-2 text-duolingo-gray-3">Đang tải...</p>
        </div>
      </main>
    );
  }

  const goals: FinancialGoal[] = ["save-house", "pay-debt", "emergency-fund", "invest", "retire", "budget-control"];

  const handleFinish = () => {
    if (!goal) {
      toast.error("Chọn mục tiêu tài chính nhé!");
      return;
    }
    completeOnboarding(goal, dailyXp);
    toast.success("Sẵn sàng học rồi! 🦉");
    router.push("/learn");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-duolingo-green/10 to-duolingo-gold/10 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-6 flex justify-center">
                <CuDauTu size={150} mood="happy" />
              </div>
              <h1 className="text-center font-display text-3xl font-extrabold text-duolingo-gray-5 sm:text-4xl">
                Chào {user.displayName}! 👋
              </h1>
              <p className="mt-3 text-center text-lg text-duolingo-gray-3">
                Mình là <span className="font-bold text-duolingo-green">Cú Đầu Tư</span> 🦉<br />
                Sẽ đồng hành giúp bạn làm chủ tiền bạc trong vài tuần.
              </p>
              <p className="mt-2 text-center text-sm text-duolingo-gray-3">
                5 phút mỗi ngày · 100% miễn phí · Nội dung Việt Nam
              </p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={() => setStep(2)} className="px-12">BẮT ĐẦU →</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 className="text-center font-display text-2xl font-extrabold text-duolingo-gray-5 sm:text-3xl">
                Mục tiêu tài chính của bạn là gì?
              </h1>
              <p className="mt-2 text-center text-sm text-duolingo-gray-3">
                Mình sẽ cá nhân hoá lộ trình học cho bạn
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {goals.map((g) => {
                  const info = financialGoalLabels[g];
                  const selected = goal === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`rounded-duo border-2 p-4 text-left transition-all ${
                        selected
                          ? "border-duolingo-green bg-duolingo-green/10 shadow-duo-green-sm"
                          : "border-duolingo-gray-1 bg-white hover:border-duolingo-green/50 shadow-duo-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{info.emoji}</div>
                        {selected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-duolingo-green text-white">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <h3 className="mt-2 font-extrabold text-duolingo-gray-5">{info.title}</h3>
                      <p className="mt-0.5 text-xs text-duolingo-gray-3">{info.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Quay lại</Button>
                <Button onClick={() => setStep(3)} disabled={!goal} className="flex-1">Tiếp tục →</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 className="text-center font-display text-2xl font-extrabold text-duolingo-gray-5 sm:text-3xl">
                Mỗi ngày bạn muốn học bao nhiêu?
              </h1>
              <p className="mt-2 text-center text-sm text-duolingo-gray-3">
                Đừng đặt quá cao — đều đặn quan trọng hơn nhiều
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { xp: 10, label: "Casual",  desc: "5 phút/ngày · 1 bài ngắn" },
                  { xp: 20, label: "Bình thường", desc: "10 phút/ngày · 2 bài" },
                  { xp: 30, label: "Nghiêm túc",   desc: "15 phút/ngày · 3 bài" },
                  { xp: 50, label: "Cường độ cao", desc: "20 phút/ngày · 4+ bài" },
                ].map((opt) => {
                  const selected = dailyXp === opt.xp;
                  return (
                    <button
                      key={opt.xp}
                      onClick={() => setDailyXp(opt.xp)}
                      className={`flex w-full items-center justify-between rounded-duo border-2 p-4 transition-all ${
                        selected
                          ? "border-duolingo-green bg-duolingo-green/10"
                          : "border-duolingo-gray-1 bg-white hover:border-duolingo-green/50"
                      }`}
                    >
                      <div>
                        <div className="text-lg font-extrabold text-duolingo-gray-5">{opt.xp} XP/ngày</div>
                        <div className="text-xs text-duolingo-gray-3">{opt.label} · {opt.desc}</div>
                      </div>
                      {selected && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-duolingo-green text-white">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">← Quay lại</Button>
                <Button onClick={handleFinish} className="flex-1">BẮT ĐẦU HỌC 🎉</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
