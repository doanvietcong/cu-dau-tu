"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/userStore";
import { UNITS, LESSONS } from "@/data/curriculum";
import { ProgressBar } from "@/components/ui/Progress";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { DailyTip } from "@/components/dashboard/DailyTip";
import { Lock, Star, Zap, CheckCircle2, Flame, Trophy, Calculator, AlertCircle } from "lucide-react";

export default function LearnPage() {
  const user = useUserStore((s) => s.user);
  const completedIds = user?.completedLessonIds ?? [];
  const todayXp = user?.todayXp ?? 0;
  const dailyGoal = user?.dailyGoalXp ?? 20;

  // Determine unlock: a unit is unlocked if first lesson is unlocked
  // A lesson is unlocked if all previous lessons in its unit (or earlier units) are completed.
  const isLessonUnlocked = (unitIdx: number, lessonIdx: number): boolean => {
    // If first lesson of first unit, always unlocked
    if (unitIdx === 0 && lessonIdx === 0) return true;
    // Check earlier units fully completed
    for (let u = 0; u < unitIdx; u++) {
      const unit = UNITS[u];
      const allDone = unit.lessonIds.every((id) => completedIds.includes(id));
      if (!allDone) return false;
    }
    // Within same unit: previous lesson must be completed
    if (lessonIdx > 0) {
      const prevLessonId = UNITS[unitIdx].lessonIds[lessonIdx - 1];
      return completedIds.includes(prevLessonId);
    }
    return true;
  };

  // Per-unit progress
  const unitProgress = (unitId: string) => {
    const unit = UNITS.find((u) => u.id === unitId)!;
    const done = unit.lessonIds.filter((id) => completedIds.includes(id)).length;
    return { done, total: unit.lessonIds.length, pct: (done / unit.lessonIds.length) * 100 };
  };

  // Find next lesson to suggest
  const nextLesson = useMemo(() => {
    for (let u = 0; u < UNITS.length; u++) {
      for (let l = 0; l < UNITS[u].lessonIds.length; l++) {
        const id = UNITS[u].lessonIds[l];
        if (!completedIds.includes(id) && isLessonUnlocked(u, l)) {
          const lesson = LESSONS.find((x) => x.id === id)!;
          return { ...lesson, unit: UNITS[u] };
        }
      }
    }
    return null;
  }, [completedIds]);

  return (
    <div className="space-y-4">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-duo-lg border-2 border-duolingo-green-dark bg-duolingo-green p-4 text-white shadow-duo-green"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">MỤC TIÊU HÔM NAY</div>
            <div className="mt-1 font-display text-2xl font-extrabold">
              {todayXp} / {dailyGoal} XP
            </div>
            <div className="mt-2">
              <div className="h-2 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (todayXp / dailyGoal) * 100)}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>
          <CuDauTu size={80} mood={todayXp >= dailyGoal ? "celebrating" : "happy"} />
        </div>
      </motion.div>

      {/* Daily tip + Tools link */}
      <DailyTip />
      <div className="grid grid-cols-2 gap-2">
        <Link href="/tools" className="rounded-duo border-2 border-duolingo-blue-dark bg-white p-3 shadow-duo-card hover:bg-duolingo-blue/5">
          <div className="flex items-center gap-2">
            <Calculator className="text-duolingo-blue" size={20} />
            <div>
              <div className="text-sm font-extrabold text-duolingo-gray-5">Công cụ</div>
              <div className="text-[10px] text-duolingo-gray-3">Lãi kép, vay, FIRE, thuế</div>
            </div>
          </div>
        </Link>
        <Link href="/tutor" className="rounded-duo border-2 border-duolingo-gold-dark bg-white p-3 shadow-duo-card hover:bg-duolingo-gold/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <div>
              <div className="text-sm font-extrabold text-duolingo-gray-5">Hỏi Cú</div>
              <div className="text-[10px] text-duolingo-gray-3">Chat tài chính AI</div>
            </div>
          </div>
        </Link>
      </div>
      {user && user.weakQuestionIds.length > 0 && (
        <Link href="/review" className="block rounded-duo border-2 border-duolingo-red-dark bg-duolingo-red/5 p-3 shadow-duo-card">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-duolingo-red" size={20} />
            <div className="flex-1">
              <div className="text-sm font-extrabold text-duolingo-gray-5">Ôn tập câu sai</div>
              <div className="text-[10px] text-duolingo-gray-3">{user.weakQuestionIds.length} câu đang chờ ôn lại</div>
            </div>
            <div className="text-xs font-extrabold text-duolingo-red-dark">→</div>
          </div>
        </Link>
      )}

      {/* Next lesson CTA */}
      {nextLesson && (
        <Link href={`/lesson/${nextLesson.id}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-duo-lg border-2 border-duolingo-orange-dark bg-duolingo-orange p-4 text-white shadow-duo-gold-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{nextLesson.iconEmoji}</div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider opacity-90">BÀI HỌC TIẾP THEO</div>
                <div className="font-display text-lg font-extrabold leading-tight">{nextLesson.title}</div>
                <div className="text-xs opacity-90">{nextLesson.unit.title} · +{nextLesson.xpReward} XP</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Units */}
      <div className="space-y-6 pt-2">
        {UNITS.map((unit, unitIdx) => {
          const prog = unitProgress(unit.id);
          return (
            <div key={unit.id} className="space-y-2">
              <div className="flex items-center gap-3 px-1">
                <span className="text-2xl">{unit.iconEmoji}</span>
                <div className="flex-1">
                  <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5">
                    Unit {unit.order}: {unit.title}
                  </h2>
                  <p className="text-xs text-duolingo-gray-3">{unit.description}</p>
                </div>
                <div className="text-right text-xs font-bold text-duolingo-gray-3">
                  {prog.done}/{prog.total}
                </div>
              </div>

              <ProgressBar value={prog.pct} color={prog.pct === 100 ? "gold" : "green"} size="sm" />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {unit.lessonIds.map((lessonId, lIdx) => {
                  const lesson = LESSONS.find((l) => l.id === lessonId)!;
                  const unlocked = isLessonUnlocked(unitIdx, lIdx);
                  const completed = completedIds.includes(lessonId);
                  return (
                    <Link
                      key={lessonId}
                      href={unlocked ? `/lesson/${lessonId}` : "#"}
                      className={!unlocked ? "pointer-events-none" : ""}
                    >
                      <motion.div
                        whileHover={unlocked ? { scale: 1.02 } : {}}
                        whileTap={unlocked ? { scale: 0.98 } : {}}
                        className={`flex items-center gap-3 rounded-duo border-2 p-3 transition-colors ${
                          !unlocked
                            ? "border-duolingo-gray-1 bg-duolingo-gray-1/30 opacity-60"
                            : completed
                            ? "border-duolingo-gold-dark bg-duolingo-gold/10"
                            : "border-duolingo-gray-1 bg-white shadow-duo-card hover:border-duolingo-green"
                        }`}
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-duolingo-gray-1 bg-duolingo-snow text-2xl">
                          {!unlocked ? (
                            <Lock size={20} className="text-duolingo-gray-2" />
                          ) : completed ? (
                            <CheckCircle2 size={24} className="text-duolingo-gold-dark" />
                          ) : (
                            lesson.iconEmoji
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-duolingo-gray-5">
                            {lesson.title}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-duolingo-gray-3">
                            <span className="flex items-center gap-0.5">
                              <Zap size={10} className="text-coin" /> {lesson.xpReward}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              💎 {lesson.coinReward}
                            </span>
                            <span>·</span>
                            <span>{lesson.estimatedMinutes}p</span>
                          </div>
                        </div>
                        {completed && (
                          <div className="flex flex-col items-center text-duolingo-gold-dark">
                            <Trophy size={18} />
                            <span className="text-[10px] font-extrabold">XONG</span>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-2 pt-4">
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 text-center">
          <Flame className="mx-auto text-streak" size={20} />
          <div className="mt-1 font-display text-xl font-extrabold text-duolingo-gray-5">{user?.streak ?? 0}</div>
          <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Streak</div>
        </div>
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 text-center">
          <Star className="mx-auto text-coin" size={20} fill="currentColor" />
          <div className="mt-1 font-display text-xl font-extrabold text-duolingo-gray-5">{user?.totalXp ?? 0}</div>
          <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Tổng XP</div>
        </div>
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 text-center">
          <Trophy className="mx-auto text-duolingo-purple" size={20} />
          <div className="mt-1 font-display text-xl font-extrabold text-duolingo-gray-5">{user?.level ?? 1}</div>
          <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Cấp độ</div>
        </div>
      </div>
    </div>
  );
}
