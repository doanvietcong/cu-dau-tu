"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Heart, Snowflake, Sparkles, Zap, Crown, Watch } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export default function ShopPage() {
  const user = useUserStore((s) => s.user);
  const spendCoins = useUserStore((s) => s.spendCoins);
  const refillHearts = useUserStore((s) => s.refillHearts);

  if (!user) return null;

  const buyHeartsFull = () => {
    if (spendCoins(350)) {
      refillHearts(5);
      toast.success(`❤️ Hồi 5 tim thành công!`);
    } else {
      toast.error("Không đủ coins!");
    }
  };

  const buyHeartOne = () => {
    if (spendCoins(80)) {
      refillHearts(1);
      toast.success(`❤️ +1 tim!`);
    } else {
      toast.error("Không đủ coins!");
    }
  };

  const buyStreakFreeze = () => {
    if (spendCoins(200)) {
      toast.success(`🧊 Streak Freeze đã được kích hoạt!`);
    } else {
      toast.error("Không đủ coins!");
    }
  };

  const buyDoubleOrNothing = () => {
    if (spendCoins(100)) {
      toast.success(`⚡ Đã mua Double or Nothing! Áp dụng cho bài tiếp theo.`);
    } else {
      toast.error("Không đủ coins!");
    }
  };

  const items: ShopItem[] = [
    {
      id: "hearts-full",
      name: "Hồi đầy Hearts",
      description: `Refill ${user.maxHearts} tim ngay lập tức`,
      cost: 350,
      icon: <Heart size={28} fill="currentColor" />,
      color: "duolingo-red",
      action: buyHeartsFull,
    },
    {
      id: "heart-1",
      name: "+1 Heart",
      description: "Thêm 1 tim ngay",
      cost: 80,
      icon: <Heart size={28} fill="currentColor" />,
      color: "duolingo-red",
      action: buyHeartOne,
    },
    {
      id: "streak-freeze",
      name: "Streak Freeze",
      description: "Đóng băng streak 1 ngày nếu bạn quên học",
      cost: 200,
      icon: <Snowflake size={28} />,
      color: "duolingo-blue",
      action: buyStreakFreeze,
    },
    {
      id: "double-or-nothing",
      name: "Double or Nothing",
      description: "Nhân đôi XP bài học tiếp theo (hoặc mất hết)",
      cost: 100,
      icon: <Zap size={28} fill="currentColor" />,
      color: "duolingo-gold",
      action: buyDoubleOrNothing,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-duo-lg border-2 border-duolingo-blue-dark bg-duolingo-blue p-4 text-white shadow-duo-blue-sm">
        <div className="text-xs font-bold uppercase opacity-90">SỐ DƯ</div>
        <div className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold">
          💎 {user.coins}
        </div>
        <p className="mt-1 text-xs opacity-90">Hoàn thành bài học để nhận thêm coins!</p>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className={`rounded-duo-lg border-2 border-${item.color}-dark bg-white p-4 shadow-duo-card`}>
            <div className={`text-${item.color}`}>{item.icon}</div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-duolingo-gray-5">{item.name}</h3>
            <p className="mt-0.5 text-xs text-duolingo-gray-3">{item.description}</p>
            <Button onClick={item.action} size="md" fullWidth className="mt-3">
              💎 {item.cost}
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-duo border-2 border-dashed border-duolingo-gray-1 bg-white p-4 text-center">
        <p className="text-xs text-duolingo-gray-3">
          💡 Mẹo: Hoàn thành bài học liên tục để tích luỹ coins và duy trì streak
        </p>
      </div>
    </div>
  );
}
