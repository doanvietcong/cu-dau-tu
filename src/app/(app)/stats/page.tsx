"use client";

import { useUserStore } from "@/lib/store/userStore";
import { LESSONS, UNITS } from "@/data/curriculum";
import { ProgressBar, RingProgress } from "@/components/ui/Progress";
import { TrendingUp, Target, Calendar, BookOpen, Award } from "lucide-react";
import { useMemo } from "react";

export default function StatsPage() {
  const user = useUserStore((s) => s.user);
  if (!user) return null;

  // Mock: simulate 7-day XP chart
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const weekXp = useMemo(() => {
    // Pseudo-random but stable based on user id
    const seed = user.id.charCodeAt(0) || 1;
    return weekDays.map((_, i) => {
      const base = (seed * (i + 1)) % 30;
      return Math.max(0, base + (i === new Date().getDay() - 1 ? user.todayXp : 0));
    });
  }, [user.id, user.todayXp]);
  const maxDayXp = Math.max(...weekXp, 1);

  const totalLessons = LESSONS.length;
  const completionPct = (user.completedLessonIds.length / totalLessons) * 100;
  const avgScore = user.completedLessonIds.length > 0 ? 87 : 0;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-duolingo-gray-5">Tiến độ của bạn</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 shadow-duo-card">
          <div className="text-xs font-bold uppercase text-duolingo-gray-3">Streak hiện tại</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold text-streak">{user.streak}</span>
            <span className="text-lg">🔥</span>
          </div>
          <div className="mt-0.5 text-xs text-duolingo-gray-3">Kỷ lục: {user.longestStreak} ngày</div>
        </div>
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 shadow-duo-card">
          <div className="text-xs font-bold uppercase text-duolingo-gray-3">Tổng XP</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold text-duolingo-green-dark">{user.totalXp}</span>
            <span className="text-lg">⚡</span>
          </div>
          <div className="mt-0.5 text-xs text-duolingo-gray-3">Level {user.level}</div>
        </div>
      </div>

      {/* Weekly XP chart */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
            <TrendingUp size={18} /> Tuần này
          </h2>
          <div className="text-sm font-bold text-duolingo-gray-3">
            {weekXp.reduce((a, b) => a + b, 0)} XP
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2 h-32">
          {weekXp.map((xp, i) => {
            const heightPct = (xp / maxDayXp) * 100;
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div className="text-[10px] font-bold text-duolingo-gray-3">{xp > 0 ? xp : ""}</div>
                <div
                  className="w-full rounded-t-lg bg-duolingo-green"
                  style={{ height: `${heightPct}%`, minHeight: xp > 0 ? "4px" : "0" }}
                />
                <div className="text-[10px] font-bold text-duolingo-gray-3">{weekDays[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum progress */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
          <BookOpen size={18} /> Hoàn thành bài học
        </h2>
        <div className="mt-3 flex items-center gap-4">
          <RingProgress value={completionPct} size={90} color="#58CC02">
            <div className="text-center">
              <div className="font-display text-lg font-extrabold text-duolingo-gray-5">{Math.round(completionPct)}%</div>
            </div>
          </RingProgress>
          <div className="flex-1">
            <div className="text-sm text-duolingo-gray-4">
              <span className="font-extrabold text-duolingo-gray-5">{user.completedLessonIds.length}</span> / {totalLessons} bài
            </div>
            <div className="mt-1 text-xs text-duolingo-gray-3">
              Còn {totalLessons - user.completedLessonIds.length} bài để hoàn thành curriculum
            </div>
          </div>
        </div>
      </div>

      {/* Per-unit breakdown */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
          <Target size={18} /> Chi tiết từng Unit
        </h2>
        <div className="mt-3 space-y-2">
          {UNITS.map((u) => {
            const done = u.lessonIds.filter((id) => user.completedLessonIds.includes(id)).length;
            const total = u.lessonIds.length;
            const pct = (done / total) * 100;
            return (
              <div key={u.id} className="flex items-center gap-3">
                <div className="text-2xl">{u.iconEmoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate text-duolingo-gray-5">{u.title}</span>
                    <span className="text-duolingo-gray-3">{done}/{total}</span>
                  </div>
                  <div className="mt-1">
                    <ProgressBar value={pct} color={pct === 100 ? "gold" : "green"} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avg score */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
          <Award size={18} /> Điểm trung bình
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="font-display text-3xl font-extrabold text-duolingo-green-dark">{avgScore}%</div>
          <div className="text-xs text-duolingo-gray-3">trên các bài đã hoàn thành</div>
        </div>
        <ProgressBar value={avgScore} color="green" size="md" className="mt-2" />
      </div>
    </div>
  );
}
