import type { LeaderboardEntry } from "@/types";

// Mock leaderboard for demonstration. In production, this would come from
// a backend query filtered by league and ordered by weeklyXp.
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1,  userId: "u01", displayName: "Minh CEO",         avatarEmoji: "🦊", weeklyXp: 480, league: "diamond" },
  { rank: 2,  userId: "u02", displayName: "Hương Đầu Tư",     avatarEmoji: "🐯", weeklyXp: 462, league: "diamond" },
  { rank: 3,  userId: "u03", displayName: "Long Crypto",       avatarEmoji: "🦁", weeklyXp: 445, league: "diamond" },
  { rank: 4,  userId: "u04", displayName: "Phương ETF",        avatarEmoji: "🐼", weeklyXp: 421, league: "diamond" },
  { rank: 5,  userId: "u05", displayName: "Hùng Coin",         avatarEmoji: "🦅", weeklyXp: 408, league: "diamond" },
  { rank: 6,  userId: "u06", displayName: "Trang Tiết Kiệm",  avatarEmoji: "🐰", weeklyXp: 390, league: "diamond" },
  { rank: 7,  userId: "u07", displayName: "Sơn BĐS",          avatarEmoji: "🐺", weeklyXp: 365, league: "diamond" },
  { rank: 8,  userId: "u08", displayName: "Linh Vàng",         avatarEmoji: "🦄", weeklyXp: 340, league: "diamond" },
  { rank: 9,  userId: "u09", displayName: "Khánh Coin",        avatarEmoji: "🐢", weeklyXp: 320, league: "diamond" },
  { rank: 10, userId: "u10", displayName: "Vy Crypto",         avatarEmoji: "🦉", weeklyXp: 305, league: "diamond" },
  { rank: 11, userId: "u11", displayName: "Bình Ngân Hàng",    avatarEmoji: "🐳", weeklyXp: 290, league: "diamond" },
  { rank: 12, userId: "u12", displayName: "Mai Thoát Nợ",      avatarEmoji: "🦋", weeklyXp: 275, league: "diamond" },
  { rank: 13, userId: "u13", displayName: "Quân Index",        avatarEmoji: "🦊", weeklyXp: 260, league: "diamond" },
  { rank: 14, userId: "u14", displayName: "Anh FIRE",          avatarEmoji: "🔥", weeklyXp: 248, league: "diamond" },
  { rank: 15, userId: "u15", displayName: "Chị Ngân Sách",     avatarEmoji: "📊", weeklyXp: 235, league: "diamond" },
  { rank: 16, userId: "u16", displayName: "Thắng Coin",        avatarEmoji: "🪙", weeklyXp: 220, league: "diamond" },
  { rank: 17, userId: "u17", displayName: "Duy Đầu Cơ",        avatarEmoji: "📈", weeklyXp: 205, league: "diamond" },
  { rank: 18, userId: "u18", displayName: "Hà Phân Bổ",        avatarEmoji: "⚖️", weeklyXp: 198, league: "diamond" },
  { rank: 19, userId: "u19", displayName: "Phúc Quỹ Mở",       avatarEmoji: "🏦", weeklyXp: 185, league: "diamond" },
  { rank: 20, userId: "u20", displayName: "Tú Trái Phiếu",     avatarEmoji: "📜", weeklyXp: 172, league: "diamond" },
];
