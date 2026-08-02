import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "Khởi đầu vàng",
    description: "Hoàn thành bài học đầu tiên",
    iconEmoji: "🌟",
    xpReward: 10,
    condition: (u) => u.completedLessonIds.length >= 1,
  },
  {
    id: "streak-3",
    title: "Ba ngày liên tục",
    description: "Duy trì streak 3 ngày",
    iconEmoji: "🔥",
    xpReward: 20,
    condition: (u) => u.streak >= 3,
  },
  {
    id: "streak-7",
    title: "Một tuần kỷ luật",
    description: "Duy trì streak 7 ngày",
    iconEmoji: "🔥",
    xpReward: 50,
    condition: (u) => u.streak >= 7,
  },
  {
    id: "streak-30",
    title: "Bậc thầy tài chính",
    description: "Duy trì streak 30 ngày",
    iconEmoji: "👑",
    xpReward: 200,
    condition: (u) => u.streak >= 30,
  },
  {
    id: "xp-100",
    title: "100 XP",
    description: "Tích lũy 100 XP",
    iconEmoji: "💯",
    xpReward: 0,
    condition: (u) => u.totalXp >= 100,
  },
  {
    id: "xp-500",
    title: "500 XP",
    description: "Tích lũy 500 XP",
    iconEmoji: "⭐",
    xpReward: 0,
    condition: (u) => u.totalXp >= 500,
  },
  {
    id: "xp-1000",
    title: "Nhà đầu tư tri thức",
    description: "Tích lũy 1000 XP",
    iconEmoji: "🏆",
    xpReward: 0,
    condition: (u) => u.totalXp >= 1000,
  },
  {
    id: "perfect-lesson",
    title: "Hoàn hảo",
    description: "Hoàn thành bài học không sai câu nào",
    iconEmoji: "💎",
    xpReward: 15,
    condition: (u) => u.completedLessonIds.length >= 1, // checked per-lesson
  },
  {
    id: "unit-1",
    title: "Nền tảng vững",
    description: "Hoàn thành Unit 1: Tiền cơ bản",
    iconEmoji: "🏛️",
    xpReward: 30,
    condition: () => false, // checked at runtime against completedLessonIds
  },
  {
    id: "coins-100",
    title: "Heo đất",
    description: "Tích lũy 100 coins",
    iconEmoji: "🐷",
    xpReward: 0,
    condition: (u) => u.coins >= 100,
  },
];

export function checkNewAchievements(user: import("@/types").UserProfile, unitCompleteIds: string[] = []): string[] {
  const newly: string[] = [];
  for (const a of achievements) {
    if (user.achievementIds.includes(a.id)) continue;
    if (a.id === "unit-1") {
      if (unitCompleteIds.includes("unit-1")) newly.push(a.id);
      continue;
    }
    if (a.condition(user)) newly.push(a.id);
  }
  return newly;
}
