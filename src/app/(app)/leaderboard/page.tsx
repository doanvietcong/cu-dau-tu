"use client";

import { useUserStore } from "@/lib/store/userStore";
import { mockLeaderboard } from "@/data/leaderboard-mock";
import { leagueConfig, leagueOrder, type UserProfile } from "@/types";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { motion } from "framer-motion";
import { Crown, ChevronUp, ChevronDown, Minus, Info } from "lucide-react";
import { useState } from "react";

export default function LeaderboardPage() {
  const user = useUserStore((s) => s.user);
  const [infoOpen, setInfoOpen] = useState(false);

  if (!user) return null;

  // Find user's current rank in their league
  const userEntry = {
    rank: 7, // mock current rank
    userId: user.id,
    displayName: user.displayName,
    avatarEmoji: user.avatarEmoji,
    weeklyXp: user.weeklyXp,
    league: user.league,
  };
  const league = leagueConfig[user.league];
  const leagueColor = league.color;

  return (
    <div className="space-y-3">
      {/* League header */}
      <div
        className="rounded-duo-lg border-2 p-4 text-center text-white shadow-duo-card"
        style={{ backgroundColor: leagueColor, borderColor: leagueColor }}
      >
        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Bạn đang ở league</div>
        <div className="mt-1 flex items-center justify-center gap-2 font-display text-3xl font-extrabold">
          <Crown size={28} /> {league.name}
        </div>
        <div className="mt-1 text-sm opacity-90">{user.weeklyXp} XP tuần này</div>
      </div>

      {/* Info button */}
      <button
        onClick={() => setInfoOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-duolingo-gray-3 hover:text-duolingo-gray-5"
      >
        <Info size={14} /> Cách hoạt động
      </button>

      {infoOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-duo border-2 border-duolingo-gray-1 bg-white p-3 text-sm text-duolingo-gray-4"
        >
          <p className="font-bold">League là cuộc đua hàng tuần!</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-duolingo-gray-3">
            <li>Top 7 được <b className="text-duolingo-green">thăng hạng</b> lên league cao hơn</li>
            <li>Top 8-15 giữ nguyên league</li>
            <li>Top 16-20 bị <b className="text-duolingo-red">xuống hạng</b></li>
            <li>League cao nhất là Kim cương 💎</li>
            <li>Reset mỗi Chủ Nhật</li>
          </ul>
        </motion.div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        {[1, 0, 2].map((idx) => {
          const entry = mockLeaderboard[idx];
          if (!entry) return null;
          const heights = ["h-20", "h-28", "h-16"];
          const colors = ["bg-duolingo-gray-3", "bg-duolingo-gold", "bg-duolingo-orange"];
          const medals = ["🥈", "🥇", "🥉"];
          return (
            <div key={entry.userId} className="flex flex-col items-center justify-end">
              <div className="mb-1 text-3xl">{entry.avatarEmoji}</div>
              <div className="text-xs font-extrabold text-duolingo-gray-5 truncate w-full text-center">{entry.displayName}</div>
              <div className="text-xs font-bold text-duolingo-gray-3">{entry.weeklyXp} XP</div>
              <div className={`mt-1 w-full rounded-t-xl ${colors[idx]} ${heights[idx]} flex items-start justify-center pt-2`}>
                <span className="text-2xl">{medals[idx]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-1.5">
        {mockLeaderboard.map((entry) => {
          const prev = mockLeaderboard[entry.rank - 2];
          const trend: "up" | "down" | "same" = !prev ? "same" : entry.weeklyXp > prev.weeklyXp ? "up" : entry.weeklyXp < prev.weeklyXp ? "down" : "same";
          const isUser = entry.userId === "u10"; // mock highlight
          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 rounded-xl border-2 p-2 ${
                isUser ? "border-duolingo-green bg-duolingo-green/5" : "border-duolingo-gray-1 bg-white"
              }`}
            >
              <div className="flex w-8 items-center justify-center font-display text-base font-extrabold text-duolingo-gray-4">
                {entry.rank}
              </div>
              <div className="text-2xl">{entry.avatarEmoji}</div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-extrabold text-duolingo-gray-5">{entry.displayName}</div>
                <div className="text-xs font-bold text-duolingo-gray-3">{entry.weeklyXp} XP</div>
              </div>
              <div className="flex items-center text-xs">
                {trend === "up" && <ChevronUp size={16} className="text-duolingo-green-dark" />}
                {trend === "down" && <ChevronDown size={16} className="text-duolingo-red-dark" />}
                {trend === "same" && <Minus size={16} className="text-duolingo-gray-2" />}
              </div>
            </div>
          );
        })}

        {/* User's row (separator) */}
        <div className="my-2 flex items-center gap-2 text-xs text-duolingo-gray-3">
          <div className="h-px flex-1 bg-duolingo-gray-1" />
          <span>...</span>
          <div className="h-px flex-1 bg-duolingo-gray-1" />
        </div>

        <div className="flex items-center gap-3 rounded-xl border-2 border-duolingo-green-dark bg-duolingo-green/10 p-2">
          <div className="flex w-8 items-center justify-center font-display text-base font-extrabold text-duolingo-green-dark">
            {userEntry.rank}
          </div>
          <div className="text-2xl">{userEntry.avatarEmoji}</div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-extrabold text-duolingo-green-dark">{userEntry.displayName} (Bạn)</div>
            <div className="text-xs font-bold text-duolingo-gray-3">{userEntry.weeklyXp} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
