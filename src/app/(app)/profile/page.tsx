"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { achievements } from "@/data/achievements";
import { UNITS, LESSONS } from "@/data/curriculum";
import { financialGoalLabels, leagueConfig } from "@/types";
import { ProgressBar, RingProgress } from "@/components/ui/Progress";
import { StreakCounter, HeartCounter } from "@/components/ui/StatBadge";
import { Button } from "@/components/ui/Button";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { Settings, LogOut, Award, Lock, Target, Flame, Zap, Heart, Volume2, VolumeX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const signOut = useUserStore((s) => s.signOut);
  const toggleSound = useUserStore((s) => s.toggleSound);
  const toggleMusic = useUserStore((s) => s.toggleMusic);
  const setAvatar = useUserStore((s) => s.setAvatar);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!user) return null;

  const goal = user.financialGoal ? financialGoalLabels[user.financialGoal] : null;
  const league = leagueConfig[user.league];
  const earnedAchievements = achievements.filter((a) => user.achievementIds.includes(a.id));
  const lockedAchievements = achievements.filter((a) => !user.achievementIds.includes(a.id)).slice(0, 4);
  const totalLessons = LESSONS.length;
  const completionPct = (user.completedLessonIds.length / totalLessons) * 100;

  // XP progress within current level
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];
  const currentThreshold = xpThresholds[user.level - 1] ?? 10000;
  const nextThreshold = xpThresholds[user.level] ?? user.totalXp + 2500;
  const levelXp = user.totalXp - currentThreshold;
  const levelXpRange = nextThreshold - currentThreshold;
  const levelPct = Math.min(100, (levelXp / levelXpRange) * 100);

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <div className="flex items-start gap-3">
          <div className="text-5xl">{user.avatarEmoji}</div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate font-display text-2xl font-extrabold text-duolingo-gray-5">
              {user.displayName}
            </h1>
            <p className="truncate text-xs text-duolingo-gray-3">{user.email}</p>
            {goal && (
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-duolingo-gold/20 px-2.5 py-0.5 text-xs font-bold text-duolingo-gold-dark">
                <span>{goal.emoji}</span> {goal.title}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="text-duolingo-gray-3 hover:text-duolingo-gray-5"
            aria-label="Mở cài đặt"
          >
            <Settings size={22} />
          </button>
        </div>

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-streak/10 p-2">
            <Flame className="mx-auto text-streak" size={20} />
            <div className="mt-0.5 font-display text-xl font-extrabold text-duolingo-gray-5">{user.streak}</div>
            <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Streak</div>
          </div>
          <div className="rounded-xl bg-coin/10 p-2">
            <Zap className="mx-auto text-coin" size={20} fill="currentColor" />
            <div className="mt-0.5 font-display text-xl font-extrabold text-duolingo-gray-5">{user.totalXp}</div>
            <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Tổng XP</div>
          </div>
          <div className="rounded-xl bg-heart/10 p-2">
            <Heart className="mx-auto text-heart" size={20} fill="currentColor" />
            <div className="mt-0.5 font-display text-xl font-extrabold text-duolingo-gray-5">{user.hearts}</div>
            <div className="text-[10px] font-bold uppercase text-duolingo-gray-3">Hearts</div>
          </div>
        </div>
      </div>

      {/* Level + League */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 shadow-duo-card">
          <div className="text-xs font-bold uppercase text-duolingo-gray-3">Cấp độ</div>
          <div className="mt-1 flex items-center gap-3">
            <div className="font-display text-3xl font-extrabold text-duolingo-green-dark">{user.level}</div>
            <div className="flex-1">
              <ProgressBar value={levelPct} size="sm" color="green" />
              <div className="mt-0.5 text-[10px] font-bold text-duolingo-gray-3">
                {levelXp}/{levelXpRange} XP
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 shadow-duo-card">
          <div className="text-xs font-bold uppercase text-duolingo-gray-3">League</div>
          <div className="mt-1 flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-base font-extrabold text-white"
              style={{ backgroundColor: league.color }}
            >
              {league.name[0]}
            </div>
            <div>
              <div className="font-display text-lg font-extrabold text-duolingo-gray-5">{league.name}</div>
              <div className="text-[10px] font-bold text-duolingo-gray-3">{user.weeklyXp} XP tuần này</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
          <Target size={18} /> Mục tiêu hôm nay
        </h2>
        <div className="mt-2 flex items-center gap-3">
          <RingProgress value={(user.todayXp / user.dailyGoalXp) * 100} size={70} color="#58CC02">
            <span className="text-xs font-bold">{Math.round((user.todayXp / user.dailyGoalXp) * 100)}%</span>
          </RingProgress>
          <div className="flex-1">
            <div className="text-sm text-duolingo-gray-4">
              <span className="font-extrabold text-duolingo-gray-5">{user.todayXp}</span> / {user.dailyGoalXp} XP
            </div>
            <p className="mt-0.5 text-xs text-duolingo-gray-3">
              {user.todayXp >= user.dailyGoalXp ? "🎉 Đã đạt mục tiêu hôm nay!" : `Còn ${user.dailyGoalXp - user.todayXp} XP nữa thôi!`}
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum progress */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5">Tiến độ học</h2>
        <p className="mt-1 text-xs text-duolingo-gray-3">
          Đã hoàn thành {user.completedLessonIds.length}/{totalLessons} bài học
        </p>
        <div className="mt-3">
          <ProgressBar value={completionPct} color="green" />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-6">
          {UNITS.map((u) => {
            const done = u.lessonIds.filter((id) => user.completedLessonIds.includes(id)).length;
            const total = u.lessonIds.length;
            const allDone = done === total;
            return (
              <div
                key={u.id}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border-2 p-1 ${
                  allDone ? "border-duolingo-gold-dark bg-duolingo-gold/10" : "border-duolingo-gray-1 bg-duolingo-snow"
                }`}
                title={`${u.title}: ${done}/${total}`}
              >
                <div className="text-xl">{u.iconEmoji}</div>
                <div className="text-[10px] font-bold text-duolingo-gray-3">{done}/{total}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-duo-lg border-2 border-duolingo-gray-1 bg-white p-4 shadow-duo-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-duolingo-gray-5">
          <Award size={18} /> Thành tựu
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {earnedAchievements.map((a) => (
            <div key={a.id} className="flex flex-col items-center rounded-xl bg-duolingo-gold/15 p-2 text-center" title={a.description}>
              <div className="text-3xl">{a.iconEmoji}</div>
              <div className="mt-1 text-[10px] font-bold leading-tight text-duolingo-gray-5">{a.title}</div>
            </div>
          ))}
          {lockedAchievements.map((a) => (
            <div key={a.id} className="flex flex-col items-center rounded-xl bg-duolingo-gray-1/40 p-2 text-center opacity-50" title={a.description}>
              <div className="relative text-3xl grayscale">
                {a.iconEmoji}
                <Lock size={12} className="absolute -bottom-1 -right-1 text-duolingo-gray-3" />
              </div>
              <div className="mt-1 text-[10px] font-bold leading-tight text-duolingo-gray-3">{a.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <Button
        variant="secondary"
        fullWidth
        onClick={() => {
          if (confirm("Đăng xuất? Tiến độ của bạn sẽ bị xoá trên thiết bị này.")) {
            signOut();
            router.push("/");
          }
        }}
      >
        <LogOut size={16} /> Đăng xuất
      </Button>

      {/* Settings modal */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-duo-lg bg-white p-5 shadow-duo-card sm:rounded-duo-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-duolingo-gray-5">Cài đặt</h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-duolingo-gray-3 hover:text-duolingo-gray-5"
                aria-label="Đóng"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Avatar picker */}
              <div>
                <div className="mb-1 text-xs font-bold uppercase text-duolingo-gray-3">Avatar</div>
                <div className="flex flex-wrap gap-2">
                  {["🦉", "🦊", "🐯", "🐼", "🦁", "🐰", "🐢", "🦄", "🐳", "🦅"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setAvatar(e)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-2xl transition-all ${
                        user.avatarEmoji === e
                          ? "border-duolingo-green bg-duolingo-green/10"
                          : "border-duolingo-gray-1 bg-white hover:border-duolingo-green/50"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound */}
              <button
                type="button"
                onClick={() => {
                  toggleSound();
                  toast.success(user.soundEnabled ? "Đã tắt âm thanh" : "Đã bật âm thanh");
                }}
                className="flex w-full items-center justify-between rounded-xl border-2 border-duolingo-gray-1 bg-white p-3 hover:border-duolingo-green/50"
              >
                <div className="flex items-center gap-2">
                  {user.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  <span className="font-bold text-duolingo-gray-5">Âm thanh</span>
                </div>
                <span className="text-xs font-bold text-duolingo-gray-3">
                  {user.soundEnabled ? "BẬT" : "TẮT"}
                </span>
              </button>

              {/* Music */}
              <button
                type="button"
                onClick={() => {
                  toggleMusic();
                  toast.success(user.musicEnabled ? "Đã tắt nhạc nền" : "Đã bật nhạc nền");
                }}
                className="flex w-full items-center justify-between rounded-xl border-2 border-duolingo-gray-1 bg-white p-3 hover:border-duolingo-green/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎵</span>
                  <span className="font-bold text-duolingo-gray-5">Nhạc nền</span>
                </div>
                <span className="text-xs font-bold text-duolingo-gray-3">
                  {user.musicEnabled ? "BẬT" : "TẮT"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
