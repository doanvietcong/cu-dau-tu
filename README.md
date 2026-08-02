# 🦉 Cú Đầu Tư — Finance Duolingo

> Học tài chính cá nhân theo phong cách Duolingo. Gamification, streak, hearts, leaderboard — nhưng 100% nội dung cho người Việt.

![Status](https://img.shields.io/badge/status-MVP-yellow)
![Stack](https://img.shields.io/badge/stack-Next.js%2014%20%2B%20TypeScript%20%2B%20Tailwind-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính năng

- 🎮 **Gamification** đầy đủ: XP, streak, hearts, coins, leagues
- 📚 **32 bài học** qua **8 units** từ cơ bản đến nâng cao
- 🦉 **Mascot Cú Đầu Tư** — twist rõ từ Duolingo owl nhưng theo chủ đề tài chính
- 🏆 **10 League** xếp hạng: Đồng → Kim cương
- 🎯 **4 loại câu hỏi**: multiple-choice, true/false, fill-blank, match-pairs
- 💎 **Shop** mua hearts refill, streak freeze
- 📊 **Stats & Achievements** chi tiết
- 🔊 **Sound effects** (Web Audio API, không cần file ngoài)
- 🎉 **Confetti** khi hoàn thành bài
- 📱 **PWA-ready** — cài lên điện thoại như app native

## 🚀 Quick Start

```bash
# Cài deps
npm install

# Dev mode
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom design system (Duolingo-inspired)
- **State**: Zustand (with localStorage persist)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Sound**: Web Audio API (synthesized)
- **Backend**: localStorage (sẽ migrate sang Supabase)

## 📂 Cấu trúc

```
src/
├── app/
│   ├── (app)/              # Protected routes (cần đăng nhập)
│   │   ├── learn/          # Lộ trình học
│   │   ├── lesson/[id]/    # Player bài học
│   │   ├── leaderboard/    # BXH tuần
│   │   ├── profile/        # Hồ sơ
│   │   ├── shop/           # Cửa hàng
│   │   └── stats/          # Thống kê
│   ├── auth/               # Đăng nhập / đăng ký
│   ├── onboarding/         # Chọn mục tiêu tài chính
│   ├── page.tsx            # Landing
│   └── layout.tsx
├── components/
│   ├── ui/                 # Button, Progress, StatBadge
│   ├── mascot/             # Cú Đầu Tư SVG
│   ├── lesson/             # QuestionCard
│   ├── layout/             # TopBar, BottomNav, Toaster
│   └── effects/            # Confetti
├── lib/
│   ├── store/              # Zustand stores
│   ├── services/           # Storage layer
│   └── utils/              # cn, formatters
├── data/
│   ├── curriculum.ts       # 32 bài học, 124 câu hỏi
│   ├── achievements.ts     # 10 thành tựu
│   └── leaderboard-mock.ts # Mock BXH
├── types/
│   └── index.ts            # Type definitions
└── hooks/
    └── useSound.ts         # Web Audio sound effects
```

## 📚 Curriculum (32 bài học, 124 câu hỏi)

| Unit | Tên | Số bài |
|------|-----|--------|
| 1 | Tiền cơ bản | 4 |
| 2 | Ngân sách thông minh | 5 |
| 3 | Tiết kiệm & Quỹ khẩn cấp | 4 |
| 4 | Nợ & Tín dụng | 4 |
| 5 | Đầu tư cho người mới | 5 |
| 6 | Đầu tư nâng cao | 4 |
| 7 | Thuế & Bảo hiểm | 3 |
| 8 | Nghỉ hưu & FIRE | 3 |

Tất cả nội dung được viết cho người Việt Nam: VND, ngân hàng VN, thuế TNCN, sản phẩm tài chính VN (HOSE, quỹ mở, BHXH, BHNT...), ví dụ đời thường (Grab, Shopee, cafe 30k, thuê phòng HN/SG).

## 🎮 Game Mechanics

- **Streak**: Đếm ngày học liên tục, mất nếu bỏ 1 ngày
- **Hearts**: 5 tim, mất 1 khi sai. Hồi 1 tim/ngày hoặc mua bằng coins
- **XP**: Cộng dồn theo bài học, +50% bonus nếu hoàn hảo
- **Coins**: Tiền tệ trong shop
- **Leagues**: Top 7 thăng hạng, top 8-15 giữ, top 16-20 xuống
- **Levels**: 1-10+ dựa trên tổng XP
- **Achievements**: 10 thành tựu (streak, XP, hoàn thành unit, perfect lesson...)

## 🎨 Design System

- **Colors**: Duolingo-inspired (green, gold, red, blue, purple, orange)
- **Border bottom shadow**: 4px hard shadow tạo cảm giác nút bấm
- **Rounded**: `rounded-2xl` (16px), `rounded-duo` (16px custom)
- **Font**: Nunito (hỗ trợ tiếng Việt)
- **Mascot**: SVG inline, animation với Framer Motion

## 🔧 Roadmap

### Đã xong (MVP)
- [x] Auth flow (mock localStorage)
- [x] Onboarding (chọn mục tiêu + daily goal)
- [x] Learning path với unlock logic
- [x] Lesson player với 4 loại câu hỏi
- [x] Game mechanics (XP, coins, streak, hearts)
- [x] Leaderboard với 10 leagues
- [x] Profile + achievements
- [x] Shop
- [x] Stats với weekly chart
- [x] Sound effects
- [x] Confetti khi hoàn thành
- [x] Landing page marketing

### Tiếp theo (Production)
- [ ] Supabase backend (auth + sync progress across devices)
- [ ] Realtime leaderboard với Supabase Realtime
- [ ] PWA (manifest.json + service worker)
- [ ] Push notifications (nhắc học mỗi ngày)
- [ ] Review mistakes flow
- [ ] Admin CMS soạn bài
- [ ] i18n (English version)
- [ ] Social features (add friends, compete)
- [ ] Premium content / paywall
- [ ] Mobile app (React Native / Capacitor)

## 🗄️ Migration sang Supabase

Để bật backend thật:
1. Tạo project trên [supabase.com](https://supabase.com)
2. Chạy schema trong `supabase/schema.sql` (sẽ tạo ở bước sau)
3. Set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Refactor `src/lib/services/storage.ts` → `src/lib/services/supabase.ts`
5. Update `src/lib/store/userStore.ts` để dùng async actions

App hiện tại dùng abstraction layer, nên việc swap backend sẽ không ảnh hưởng UI.

## 📝 Notes

- **Mascot**: "Cú Đầu Tư" — cú vàng với cà vạt đỏ và túi tiền $. Twist rõ từ Duolingo Duo Owl.
- **Localization**: 100% tiếng Việt, ví dụ Việt Nam. Số tiền dùng VND, sản phẩm tài chính VN, thuế TNCN.
- **Font**: Nunito (hỗ trợ đầy đủ tiếng Việt với dấu).

## 📄 License

MIT
