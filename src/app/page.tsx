"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { Button } from "@/components/ui/Button";
import { Sparkles, TrendingUp, Trophy, Flame, BookOpen, Heart, Brain } from "lucide-react";

const features = [
  { icon: BookOpen,  emoji: "📚", title: "107 bài học",         desc: "Từ tiền cơ bản, gia đình, freelancer đến tâm lý tài chính" },
  { icon: Brain,     emoji: "🧠", title: "Gamification",         desc: "Streak, XP, hearts giống Duolingo" },
  { icon: Trophy,    emoji: "🏆", title: "10 League xếp hạng",  desc: "Đồng → Kim cương, cạnh tranh tuần" },
  { icon: Flame,     emoji: "🔥", title: "Streak hàng ngày",     desc: "Duy trì thói quen học mỗi ngày" },
  { icon: Heart,     emoji: "💎", title: "100% Tiếng Việt",     desc: "Nội dung, ví dụ, sản phẩm tài chính VN" },
  { icon: TrendingUp,emoji: "📈", title: "A-Z curriculum",       desc: "Beginner → Intermediate → Advanced" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-duolingo-green/10 via-duolingo-gold/10 to-duolingo-blue/10 px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-duolingo-green-dark shadow-duo-card"
          >
            <Sparkles size={16} /> MỚI · Phiên bản Beta
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl font-extrabold leading-tight tracking-tight text-duolingo-gray-5 sm:text-6xl"
          >
            Học tài chính cá nhân
            <br />
            <span className="text-duolingo-green">mỗi ngày, vui như chơi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-lg text-duolingo-gray-3"
          >
            Gamification giống Duolingo — streak, XP, hearts, leaderboard — nhưng nội dung 100% tài chính cá nhân cho người Việt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/auth/sign-up">
              <Button size="xl" variant="primary" className="px-12">BẮT ĐẦU MIỄN PHÍ</Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="xl" variant="secondary" className="px-12">Tôi đã có tài khoản</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <CuDauTu size={240} mood="celebrating" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-display text-3xl font-bold text-duolingo-gray-5 sm:text-4xl">
            Tại sao chọn <span className="text-duolingo-green">Cú Đầu Tư</span>?
          </h2>
          <p className="mb-12 text-center text-duolingo-gray-3">
            Học tài chính không nhàm chán, không khô khan, không áp lực
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="duo-card"
              >
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="mt-3 text-lg font-extrabold text-duolingo-gray-5">{f.title}</h3>
                <p className="mt-1 text-sm text-duolingo-gray-3">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-duolingo-gray-5 sm:text-4xl">
            Lộ trình <span className="text-duolingo-gold">A → Z</span>
          </h2>
          <p className="mt-2 text-duolingo-gray-3">18 units · 107 bài học · từ cơ bản đến tâm lý tài chính + bẫy tài chính VN + gia đình & freelancer</p>

          <div className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-3 lg:grid-cols-6">
            {[
              { e: "💵", t: "Tiền cơ bản" },
              { e: "📊", t: "Ngân sách" },
              { e: "🐷", t: "Tiết kiệm" },
              { e: "💳", t: "Nợ & Tín dụng" },
              { e: "📈", t: "Đầu tư cơ bản" },
              { e: "🏛️", t: "Đầu tư nâng cao" },
              { e: "📋", t: "Thuế & BH" },
              { e: "🌴", t: "FIRE" },
              { e: "💰", t: "Tăng thu nhập" },
              { e: "🏘️", t: "BĐS Việt Nam" },
              { e: "₿",  t: "Crypto & Tài sản số" },
              { e: "🧠", t: "Tâm lý tài chính" },
              { e: "🛡️", t: "Bảo hiểm toàn diện" },
              { e: "🚨", t: "Bẫy tài chính VN" },
              { e: "🇻🇳", t: "Đầu tư thực chiến VN" },
              { e: "👨‍👩‍👧‍👦", t: "Tài chính gia đình" },
              { e: "🛒", t: "Chi tiêu thực chiến" },
              { e: "💼", t: "Freelancer & HKD" },
            ].map((u) => (
              <div key={u.t} className="duo-card text-center">
                <div className="text-3xl">{u.e}</div>
                <div className="mt-1 text-sm font-bold text-duolingo-gray-5">{u.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-duo-lg bg-duolingo-green p-8 text-center text-white shadow-duo-green">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Sẵn sàng trở thành bậc thầy tài chính?</h2>
          <p className="mt-2 text-white/90">5 phút mỗi ngày · 100% miễn phí · Cú Đầu Tư chờ bạn</p>
          <Link href="/auth/sign-up" className="mt-6 inline-block">
            <Button size="xl" variant="gold">BẮT ĐẦU NGAY →</Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-duolingo-gray-1 bg-white px-4 py-6 text-center text-sm text-duolingo-gray-3">
        © 2026 Cú Đầu Tư · Được tạo với 💚 tại Việt Nam
      </footer>
    </main>
  );
}
