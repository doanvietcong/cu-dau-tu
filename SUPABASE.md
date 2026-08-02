# 🔌 Setup Supabase (Backend thật)

Khi bật Supabase, app sẽ có:
- ✅ Auth thật (email/password, OAuth)
- ✅ Sync progress đa thiết bị
- ✅ Leaderboard real-time với nhiều user
- ✅ Backup dữ liệu

## Bước 1: Tạo project

1. Vào https://supabase.com → **Start your project** (free)
2. Tạo org + project mới
3. Chọn region gần Việt Nam (Singapore `ap-southeast-1`)
4. Đợi ~2 phút để provision

## Bước 2: Chạy schema

1. Vào project → **SQL Editor** (menu trái)
2. Click **New query**
3. Copy toàn bộ nội dung file `supabase/schema.sql` → paste → **Run**
4. Verify: **Table Editor** sẽ thấy 3 bảng: `profiles`, `weekly_leaderboard`, `lesson_attempts`

## Bước 3: Lấy API keys

Vào **Project Settings** (biểu tượng gear) → **API**:
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Bước 4: Set env vars trên Cloudflare

1. Vào https://dash.cloudflare.com → Pages → `cu-dau-tu`
2. Tab **Settings** → **Environment variables**
3. Add 2 biến:
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL từ bước 3)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (key từ bước 3)
4. **Environment**: chọn cả Production lẫn Preview
5. Click **Save** → trigger redeploy

## Bước 5: Enable trong code

Trong `src/lib/store/userStore.ts`, thêm calls đến `getSupabase()`:

```ts
import { getSupabase } from "@/lib/services/supabase";

// Trong applyLessonAttempt:
const sb = getSupabase();
if (sb && user) {
  await sb.from("profiles").update({
    total_xp: newTotalXp,
    coins: cur.coins + coinsEarned,
    // ...
  }).eq("id", user.id);
}
```

## Bước 6: Test

- Tạo account mới → check Supabase Table Editor → bảng `profiles` có row mới
- Hoàn thành lesson → check `total_xp` update
- Vào 2 browser khác nhau, đăng nhập cùng account → thấy data sync

## Cấu trúc database

### `profiles` — mỗi user 1 row
- Stats: total_xp, level, coins, streak, hearts
- Progress: completed_lesson_ids, weak_question_ids
- Settings: sound_enabled, music_enabled

### `weekly_leaderboard` — BXH tuần
- Mỗi user 1 row / tuần
- `week_start` = thứ 2 của tuần đó
- `weekly_xp` reset mỗi tuần

### `lesson_attempts` — lịch sử làm bài
- Append-only, không bao giờ xoá
- Dùng cho analytics, "review mistakes"

## RLS (Row Level Security)

Đã setup:
- User chỉ đọc/sửa profile của chính mình
- Leaderboard public để mọi người cùng xem
- Attempts chỉ user đọc được của mình

## Free tier

- 500MB database
- 50,000 monthly active users
- 2GB bandwidth
- Unlimited API requests

Đủ cho khoảng 5,000-10,000 users thật.
