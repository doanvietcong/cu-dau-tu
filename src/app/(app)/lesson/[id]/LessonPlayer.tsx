"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { LESSONS, UNITS } from "@/data/curriculum";
import { QuestionCard } from "@/components/lesson/QuestionCard";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/effects/Confetti";
import { useSound } from "@/hooks/useSound";
import { toast } from "sonner";
import { Coins, Heart, ChevronRight, Home, Repeat } from "lucide-react";

type Phase = "playing" | "summary" | "exit-confirm";

export default function LessonPlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const lesson = useMemo(() => LESSONS.find((l) => l.id === lessonId), [lessonId]);

  const user = useUserStore((s) => s.user);
  const applyLessonAttempt = useUserStore((s) => s.applyLessonAttempt);
  const _tickDaily = useUserStore((s) => s._tickDaily);
  const sfx = useSound();

  const [phase, setPhase] = useState<Phase>("playing");
  const [qIdx, setQIdx] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts ?? 5);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<{ questionId: string; userAnswer: string }[]>([]);
  const [result, setResult] = useState<{ xpEarned: number; coinsEarned: number; newAchievements: string[] } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    _tickDaily();
  }, [_tickDaily]);

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-duolingo-gray-3">Không tìm thấy bài học.</p>
          <Link href="/learn" className="mt-2 inline-block text-duolingo-blue underline">← Quay lại</Link>
        </div>
      </div>
    );
  }

  // Hydration-safe: wait for user to be loaded
  if (typeof window !== "undefined" && !user) {
    // Will redirect via (app) layout
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl">🦉</div>
          <p className="mt-2 text-duolingo-gray-3">Đang tải...</p>
        </div>
      </div>
    );
  }

  const totalQ = lesson.questions.length;
  const currentQ = lesson.questions[qIdx];
  const isLast = qIdx === totalQ - 1;

  const handleAnswer = (correct: boolean, userAnswer: string) => {
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
      setMistakes((m) => [...m, { questionId: currentQ.id, userAnswer }]);
    }
  };

  const handleContinue = () => {
    if (isLast) {
      const attempt = {
        lessonId: lesson.id,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        xpEarned: lesson.xpReward,
        coinsEarned: lesson.coinReward,
        correctCount,
        totalCount: totalQ,
        mistakes,
      };
      const res = applyLessonAttempt(attempt);
      setResult(res);
      if (res.newAchievements.length > 0) {
        toast.success(`🏆 Mở khoá ${res.newAchievements.length} thành tựu mới!`);
      }
      const isPerfect = mistakes.length === 0;
      if (isPerfect || correctCount >= totalQ * 0.8) {
        setShowConfetti(true);
        sfx.playLevelUp();
      } else {
        sfx.playCoin();
      }
      setPhase("summary");
    } else {
      setQIdx((i) => i + 1);
    }
  };

  const perfect = mistakes.length === 0;
  const xpBonus = perfect ? Math.ceil(lesson.xpReward * 0.5) : 0;
  const totalXp = (result?.xpEarned ?? 0);
  const totalCoins = (result?.coinsEarned ?? 0);

  // Find next lesson
  const nextLesson = useMemo(() => {
    const currentUnitIdx = UNITS.findIndex((u) => u.id === lesson.unitId);
    const currentLessonIdx = currentUnitIdx >= 0 ? UNITS[currentUnitIdx].lessonIds.indexOf(lesson.id) : -1;
    if (currentUnitIdx >= 0 && currentLessonIdx >= 0 && currentLessonIdx < UNITS[currentUnitIdx].lessonIds.length - 1) {
      const nextId = UNITS[currentUnitIdx].lessonIds[currentLessonIdx + 1];
      return LESSONS.find((l) => l.id === nextId);
    }
    if (currentUnitIdx >= 0 && currentUnitIdx < UNITS.length - 1) {
      const nextUnit = UNITS[currentUnitIdx + 1];
      const nextId = nextUnit.lessonIds[0];
      return LESSONS.find((l) => l.id === nextId);
    }
    return null;
  }, [lesson]);

  if (phase === "exit-confirm") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-6 text-center shadow-duo-card">
          <div className="text-5xl">🦉</div>
          <h2 className="mt-2 font-display text-xl font-extrabold text-duolingo-gray-5">Bạn muốn thoát?</h2>
          <p className="mt-2 text-sm text-duolingo-gray-3">Tiến độ bài học này sẽ KHÔNG được lưu.</p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => setPhase("playing")} className="flex-1">Tiếp tục học</Button>
            <Button variant="danger" onClick={() => router.push("/learn")} className="flex-1">Thoát</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "summary") {
    return (
      <>
        <Confetti show={showConfetti} onDone={() => setShowConfetti(false)} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[60vh] flex-col items-center justify-center px-2 text-center"
        >
          <CuDauTu size={140} mood={perfect ? "celebrating" : "happy"} />

          <h1 className="mt-4 font-display text-3xl font-extrabold text-duolingo-gray-5">
            {perfect ? "Hoàn hảo!" : correctCount >= totalQ * 0.7 ? "Tốt lắm!" : "Hoàn thành!"}
          </h1>
          <p className="mt-1 text-duolingo-gray-3">
            {perfect ? "Không sai câu nào, xứng đáng bonus 50% XP!" : `Bạn trả lời đúng ${correctCount}/${totalQ} câu`}
          </p>

          {/* XP bar */}
          <div className="mt-6 w-full max-w-sm rounded-duo-lg border-2 border-duolingo-yellow bg-white p-4 shadow-duo-card">
            <div className="text-xs font-bold uppercase text-duolingo-gray-3">Tổng XP</div>
            <div className="mt-1 flex items-baseline gap-2">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl font-extrabold text-duolingo-green-dark"
              >
                +{totalXp}
              </motion.div>
              {xpBonus > 0 && (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm font-bold text-duolingo-gold-dark"
                >
                  (+{xpBonus} bonus)
                </motion.div>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-duolingo-gray-1">
              <motion.div
                className="h-full bg-duolingo-green"
                initial={{ width: 0 }}
                animate={{ width: `${(correctCount / totalQ) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Coins + hearts */}
          <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-2">
            <div className="rounded-duo border-2 border-duolingo-blue-dark bg-white p-3">
              <div className="text-xs font-bold uppercase text-duolingo-gray-3">Coins</div>
              <div className="mt-1 flex items-center gap-1 text-duolingo-blue">
                <Coins size={18} />
                <span className="font-display text-xl font-extrabold">+{totalCoins}</span>
              </div>
            </div>
            <div className="rounded-duo border-2 border-heart bg-white p-3">
              <div className="text-xs font-bold uppercase text-duolingo-gray-3">Hearts</div>
              <div className="mt-1 flex items-center gap-1 text-heart">
                <Heart size={18} fill="currentColor" />
                <span className="font-display text-xl font-extrabold">{user?.hearts ?? 0}/{user?.maxHearts ?? 5}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
            {nextLesson ? (
              <Button onClick={() => router.push(`/lesson/${nextLesson.id}`)} size="lg" fullWidth>
                BÀI TIẾP THEO <ChevronRight />
              </Button>
            ) : (
              <Button onClick={() => router.push("/learn")} size="lg" fullWidth>
                HOÀN THÀNH UNIT 🎉
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => router.push("/learn")} className="flex-1">
                <Home size={18} /> Lộ trình
              </Button>
              <Button variant="secondary" onClick={() => {
                setPhase("playing");
                setQIdx(0);
                setHearts(user?.hearts ?? 5);
                setCorrectCount(0);
                setMistakes([]);
                setResult(null);
              }} className="flex-1">
                <Repeat size={18} /> Học lại
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // Playing phase
  return (
    <div className="px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <QuestionCard
            question={currentQ}
            questionNumber={qIdx + 1}
            totalQuestions={totalQ}
            hearts={hearts}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            onExit={() => setPhase("exit-confirm")}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
