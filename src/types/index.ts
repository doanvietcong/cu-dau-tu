// Core types for the Finance Duolingo app

export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "match-pairs";

export interface QuestionChoice {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  hint?: string;
  explanation: string; // shown after answer — the "aha" moment
  // multiple-choice
  choices?: QuestionChoice[];
  correctChoiceId?: string;
  // true-false
  correctBoolean?: boolean;
  // fill-blank
  blankAnswer?: string; // case-insensitive comparison, trimmed
  // match-pairs
  pairs?: { left: string; right: string }[];
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  description: string;
  iconEmoji: string;
  xpReward: number; // base XP
  coinReward: number; // base coins
  estimatedMinutes: number;
  questions: Question[];
  // Quick practice mode: only review weak questions
  isReviewable?: boolean;
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  description: string;
  color: string; // tailwind bg class, e.g. "bg-duolingo-green"
  iconEmoji: string;
  lessonIds: string[];
  // Optional: skill (special one-off lesson like "Treasure chest")
  isLegend?: boolean; // unit is "legend" / bonus / harder
}

export type UnitColor =
  | "green"
  | "gold"
  | "red"
  | "blue"
  | "purple"
  | "orange"
  | "emerald"
  | "stone"
  | "amber"
  | "rose";

export const unitColorMap: Record<UnitColor, { bg: string; border: string; text: string; light: string }> = {
  green:   { bg: "bg-duolingo-green",   border: "border-duolingo-green-dark",   text: "text-duolingo-green-dark",   light: "bg-duolingo-green/15"   },
  gold:    { bg: "bg-duolingo-gold",    border: "border-duolingo-gold-dark",    text: "text-duolingo-gold-dark",    light: "bg-duolingo-gold/15"    },
  red:     { bg: "bg-duolingo-red",     border: "border-duolingo-red-dark",     text: "text-duolingo-red-dark",     light: "bg-duolingo-red/15"     },
  blue:    { bg: "bg-duolingo-blue",    border: "border-duolingo-blue-dark",    text: "text-duolingo-blue-dark",    light: "bg-duolingo-blue/15"    },
  purple:  { bg: "bg-duolingo-purple",  border: "border-duolingo-purple",       text: "text-duolingo-purple",       light: "bg-duolingo-purple/15"  },
  orange:  { bg: "bg-duolingo-orange",  border: "border-duolingo-orange-dark",  text: "text-duolingo-orange-dark",  light: "bg-duolingo-orange/15"  },
  emerald: { bg: "bg-emerald-500",      border: "border-emerald-600",           text: "text-emerald-600",           light: "bg-emerald-100"         },
  stone:   { bg: "bg-stone-500",        border: "border-stone-600",             text: "text-stone-600",             light: "bg-stone-100"           },
  amber:   { bg: "bg-amber-500",        border: "border-amber-600",             text: "text-amber-600",             light: "bg-amber-100"           },
  rose:    { bg: "bg-rose-500",         border: "border-rose-600",              text: "text-rose-600",              light: "bg-rose-100"            },
};

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarEmoji: string;
  createdAt: string;
  // Stats
  totalXp: number;
  level: number;
  coins: number; // gems equivalent
  streak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  hearts: number;
  maxHearts: number;
  // Daily goal
  dailyGoalXp: number; // 10 / 20 / 30 / 50
  todayXp: number;
  todayDate: string;
  // League
  league: "bronze" | "silver" | "gold" | "sapphire" | "ruby" | "emerald" | "amethyst" | "pearl" | "obsidian" | "diamond";
  weeklyXp: number;
  weeklyRank?: number;
  // Onboarding
  hasOnboarded: boolean;
  financialGoal?: FinancialGoal;
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  // Achievements
  achievementIds: string[];
  // Lesson progress
  completedLessonIds: string[];
  // Mistakes = lessons where we got questions wrong (for review)
  weakQuestionIds: string[];
}

export type FinancialGoal =
  | "save-house"
  | "pay-debt"
  | "emergency-fund"
  | "invest"
  | "retire"
  | "budget-control";

export const financialGoalLabels: Record<FinancialGoal, { title: string; emoji: string; description: string }> = {
  "save-house":        { title: "Mua nhà",             emoji: "🏠", description: "Tiết kiệm và đầu tư để mua nhà trong tương lai" },
  "pay-debt":          { title: "Trả nợ",              emoji: "💳", description: "Thoát khỏi nợ nần và xây dựng tài chính lành mạnh" },
  "emergency-fund":    { title: "Quỹ khẩn cấp",        emoji: "🛟", description: "Xây dựng quỹ dự phòng 3-6 tháng chi phí" },
  "invest":            { title: "Đầu tư",              emoji: "📈", description: "Bắt đầu đầu tư thông minh, hiểu biết" },
  "retire":            { title: "Nghỉ hưu sớm",        emoji: "🌴", description: "Lên kế hoạch FIRE, tự do tài chính" },
  "budget-control":    { title: "Kiểm soát chi tiêu",  emoji: "💰", description: "Quản lý ngân sách hàng tháng hiệu quả" },
};

export const leagueConfig: Record<UserProfile["league"], { name: string; color: string; bgClass: string; minXp: number }> = {
  bronze:    { name: "Đồng",     color: "#CD7F32", bgClass: "bg-amber-700",   minXp: 0 },
  silver:    { name: "Bạc",      color: "#C0C0C0", bgClass: "bg-gray-400",    minXp: 100 },
  gold:      { name: "Vàng",     color: "#FFD700", bgClass: "bg-yellow-400",  minXp: 250 },
  sapphire:  { name: "Xanh dương", color: "#0F52BA", bgClass: "bg-blue-700",   minXp: 500 },
  ruby:      { name: "Hồng ngọc", color: "#9B111E", bgClass: "bg-red-700",     minXp: 1000 },
  emerald:   { name: "Lục bảo",  color: "#50C878", bgClass: "bg-emerald-500", minXp: 2000 },
  amethyst:  { name: "Thạch anh tím", color: "#9966CC", bgClass: "bg-purple-500", minXp: 4000 },
  pearl:     { name: "Ngọc trai", color: "#F0EAD6", bgClass: "bg-stone-200",   minXp: 7000 },
  obsidian:  { name: "Hắc diện thạch", color: "#0B0B0B", bgClass: "bg-zinc-900",   minXp: 10000 },
  diamond:   { name: "Kim cương", color: "#B9F2FF", bgClass: "bg-cyan-300",   minXp: 15000 },
};

export const leagueOrder: UserProfile["league"][] = [
  "bronze", "silver", "gold", "sapphire", "ruby", "emerald", "amethyst", "pearl", "obsidian", "diamond",
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  xpReward: number;
  condition: (user: UserProfile) => boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarEmoji: string;
  weeklyXp: number;
  league: UserProfile["league"];
}

export interface LessonAttempt {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  xpEarned: number;
  coinsEarned: number;
  correctCount: number;
  totalCount: number;
  mistakes: { questionId: string; userAnswer: string }[];
}
