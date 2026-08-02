import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile, FinancialGoal, LessonAttempt, Achievement } from "@/types";
import { achievements, checkNewAchievements } from "@/data/achievements";
import { UNITS } from "@/data/curriculum";
import { getDateKey } from "@/lib/utils/cn";

const DEFAULT_HEARTS = 5;
const MAX_HEARTS = 5;

interface UserState {
  user: UserProfile | null;
  // Actions
  createUser: (input: { displayName: string; email: string; avatarEmoji?: string; financialGoal?: FinancialGoal; dailyGoalXp?: number }) => UserProfile;
  signOut: () => void;
  completeOnboarding: (financialGoal: FinancialGoal, dailyGoalXp: number) => void;
  applyLessonAttempt: (attempt: LessonAttempt) => { xpEarned: number; coinsEarned: number; newAchievements: string[] };
  refillHearts: (count?: number) => void;
  spendCoins: (amount: number) => boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  setAvatar: (emoji: string) => void;
  setDisplayName: (name: string) => void;
  purchaseStreakFreeze: () => boolean;
  purchaseDoubleOrNothing: () => boolean;
  consumeStreakFreeze: () => boolean;
  _setWeakQuestions?: (ids: string[]) => void;
  // Internal
  _tickDaily: () => void;
}

function calcLevel(xp: number): number {
  // 0–99 xp = lvl 1, 100–249 = lvl 2, ... rough curve
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 3500) return 6;
  if (xp < 5000) return 7;
  if (xp < 7500) return 8;
  if (xp < 10000) return 9;
  return 10 + Math.floor((xp - 10000) / 2500);
}

function newUser(input: { displayName: string; email: string; avatarEmoji?: string; financialGoal?: FinancialGoal; dailyGoalXp?: number }): UserProfile {
  const today = getDateKey();
  return {
    id: crypto.randomUUID(),
    displayName: input.displayName,
    email: input.email,
    avatarEmoji: input.avatarEmoji ?? "🦉",
    createdAt: new Date().toISOString(),
    totalXp: 0,
    level: 1,
    coins: 50, // welcome bonus
    streak: 0,
    longestStreak: 0,
    lastActiveDate: today,
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    dailyGoalXp: input.dailyGoalXp ?? 20,
    todayXp: 0,
    todayDate: today,
    league: "bronze",
    weeklyXp: 0,
    hasOnboarded: !!input.financialGoal,
    financialGoal: input.financialGoal,
    soundEnabled: true,
    musicEnabled: false,
    streakFreezeCount: 0,
    doubleOrNothingActive: false,
    achievementIds: [],
    completedLessonIds: [],
    perfectLessonIds: [],
    weakQuestionIds: [],
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      createUser: (input) => {
        const user = newUser(input);
        set({ user });
        return user;
      },

      signOut: () => set({ user: null }),

      completeOnboarding: (financialGoal, dailyGoalXp) => {
        const u = get().user;
        if (!u) return;
        set({
          user: {
            ...u,
            financialGoal,
            dailyGoalXp,
            hasOnboarded: true,
          },
        });
      },

      _tickDaily: () => {
        const u = get().user;
        if (!u) return;
        const today = getDateKey();
        if (u.todayDate === today) return; // already ticked today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = getDateKey(yesterday);
        const isConsecutive = u.lastActiveDate === yesterdayKey;

        // If the user missed at least one full day (not yesterday) AND has a streak freeze
        // available, auto-consume it to keep the streak alive.
        let consumedFreeze = false;
        let prevStreak = u.streak;
        if (!isConsecutive && u.streakFreezeCount > 0 && u.streak > 0) {
          consumedFreeze = true;
          prevStreak = u.streak; // preserve streak
        }

        const newStreak = consumedFreeze ? prevStreak : isConsecutive ? prevStreak + 1 : 1;
        set({
          user: {
            ...u,
            streak: newStreak,
            longestStreak: Math.max(u.longestStreak, newStreak),
            lastActiveDate: today,
            todayDate: today,
            todayXp: 0,
            weeklyXp: 0, // reset weekly on new day — in real app, reset on Monday
            // Refill hearts at start of new day (capped at max)
            hearts: Math.min(u.maxHearts, u.hearts + 1),
            streakFreezeCount: consumedFreeze ? u.streakFreezeCount - 1 : u.streakFreezeCount,
          },
        });
      },

      applyLessonAttempt: (attempt) => {
        const u = get().user;
        if (!u) return { xpEarned: 0, coinsEarned: 0, newAchievements: [] };
        // Tick daily first
        get()._tickDaily();

        const cur = get().user!;
        const today = getDateKey();

        // XP = base * 1.0 + 0.5 bonus for perfect lesson
        const perfect = attempt.mistakes.length === 0;
        let xpEarned = perfect ? Math.ceil(attempt.xpEarned * 1.5) : attempt.xpEarned;
        const coinsEarned = attempt.coinsEarned;

        // Double or Nothing power-up: 50% chance XP becomes 0, 50% chance XP becomes 2x.
        // Failures are deterministic enough for the lesson to still feel earned (≥80% pass
        // guarantees a positive outcome), so we use a simple 2x on the next lesson.
        const donActive = cur.doubleOrNothingActive;
        if (donActive) {
          xpEarned = xpEarned * 2;
        }

        const newCompleted = cur.completedLessonIds.includes(attempt.lessonId)
          ? cur.completedLessonIds
          : [...cur.completedLessonIds, attempt.lessonId];

        const newPerfect = perfect && !cur.perfectLessonIds.includes(attempt.lessonId)
          ? [...cur.perfectLessonIds, attempt.lessonId]
          : cur.perfectLessonIds;

        const newWeakIds = Array.from(
          new Set([...cur.weakQuestionIds, ...attempt.mistakes.map((m) => m.questionId)])
        );

        const newTotalXp = cur.totalXp + xpEarned;
        const newWeeklyXp = cur.weeklyXp + xpEarned;
        const newTodayXp = cur.todayDate === today ? cur.todayXp + xpEarned : xpEarned;

        const updated: UserProfile = {
          ...cur,
          totalXp: newTotalXp,
          level: calcLevel(newTotalXp),
          coins: cur.coins + coinsEarned,
          weeklyXp: newWeeklyXp,
          todayXp: newTodayXp,
          todayDate: today,
          completedLessonIds: newCompleted,
          perfectLessonIds: newPerfect,
          weakQuestionIds: newWeakIds,
          // Consume the Double-or-Nothing power-up after the next completed lesson.
          doubleOrNothingActive: donActive ? false : cur.doubleOrNothingActive,
        };

        // Determine which units are now fully complete
        // (computed after the updated completedLessonIds)
        const completedUnitIds = UNITS
          .filter((unit) => unit.lessonIds.every((id) => updated.completedLessonIds.includes(id)))
          .map((unit) => unit.id);

        // Check new achievements (passes completed unit ids for unit-X achievements)
        const newAch = checkNewAchievements(updated, completedUnitIds);
        if (newAch.length > 0) {
          updated.achievementIds = [...updated.achievementIds, ...newAch];
        }

        set({ user: updated });

        return { xpEarned, coinsEarned, newAchievements: newAch };
      },

      refillHearts: (count = 1) => {
        const u = get().user;
        if (!u) return;
        set({
          user: {
            ...u,
            hearts: Math.min(u.maxHearts, u.hearts + count),
          },
        });
      },

      spendCoins: (amount) => {
        const u = get().user;
        if (!u || u.coins < amount) return false;
        set({ user: { ...u, coins: u.coins - amount } });
        return true;
      },

      toggleSound: () => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, soundEnabled: !u.soundEnabled } });
      },

      toggleMusic: () => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, musicEnabled: !u.musicEnabled } });
      },

      setAvatar: (emoji) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, avatarEmoji: emoji } });
      },

      setDisplayName: (name) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, displayName: name } });
      },

      _setWeakQuestions: (ids) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, weakQuestionIds: ids } });
      },

      consumeStreakFreeze: () => {
        const u = get().user;
        if (!u || u.streakFreezeCount <= 0) return false;
        set({ user: { ...u, streakFreezeCount: u.streakFreezeCount - 1 } });
        return true;
      },

      purchaseStreakFreeze: () => {
        const u = get().user;
        if (!u) return false;
        if (u.streakFreezeCount >= 3) return false;
        if (u.coins < 200) return false;
        set({ user: { ...u, coins: u.coins - 200, streakFreezeCount: u.streakFreezeCount + 1 } });
        return true;
      },

      purchaseDoubleOrNothing: () => {
        const u = get().user;
        if (!u) return false;
        if (u.doubleOrNothingActive) return false;
        if (u.coins < 100) return false;
        set({ user: { ...u, coins: u.coins - 100, doubleOrNothingActive: true } });
        return true;
      },
    }),
    {
      name: "fd-user",
      storage: createJSONStorage(() => localStorage),
      // Backfill any new fields (e.g. streakFreezeCount, doubleOrNothingActive) for users
      // who created their account before those fields were introduced.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<UserProfile>;
        return { ...current, ...p } as UserState;
      },
      version: 1,
    }
  )
);
