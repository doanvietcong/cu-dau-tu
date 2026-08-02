# 🚀 Hướng dẫn Deploy lên Cloudflare Pages

## ⚠️ QUAN TRỌNG: Bảo mật

Anh đã share GitHub PAT qua chat. Token này có thể đã bị log. **BẮT BUỘC**:

1. Vào https://github.com/settings/tokens
2. Tìm token vừa tạo → click **Delete** (hoặc **Revoke**)
3. Tạo token mới nếu cần dùng tiếp
4. Lần sau KHÔNG share token qua chat — chỉ paste vào terminal trực tiếp

---

## Repo GitHub

Đã push lên: **https://github.com/doanvietcong/cu-dau-tu**

---

## Setup Cloudflare Pages (3 phút)

### Bước 1: Vào Cloudflare Dashboard
👉 https://dash.cloudflare.com → chọn account của anh → click **Workers & Pages** (menu trái) → tab **Pages** → **Create application** → **Connect to Git**

### Bước 2: Chọn GitHub repo
- Click **Connect GitHub** (lần đầu sẽ cần authorize Cloudflare truy cập GitHub)
- Chọn repo **cu-dau-tu**
- Click **Begin setup**

### Bước 3: Cấu hình build
| Field | Value |
|-------|-------|
| **Project name** | `cu-dau-tu` (sẽ thành `cu-dau-tu.pages.dev`) |
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | (để trống) |
| **Environment variables** | (không cần) |

### Bước 4: Save and Deploy
- Click **Save and Deploy**
- Cloudflare sẽ build (~1-2 phút) và serve tại `https://cu-dau-tu.pages.dev`

### Bước 5: Custom domain (optional)
- Vào project → tab **Custom domains** → **Set up a custom domain**
- Trỏ DNS về Cloudflare (nếu domain đã ở Cloudflare thì 1-click)

---

## Cập nhật sau này

Mỗi lần push code mới lên GitHub:
```bash
git add .
git commit -m "..."
git push
```
Cloudflare sẽ **TỰ ĐỘNG** build + deploy. Xem progress tại https://dash.cloudflare.com → Pages → cu-dau-tu → **Deployments**.

---

## Lệnh deploy thủ công (không qua Git)

Nếu không muốn dùng Git integration, có thể deploy thủ công:

```bash
# Cài wrangler (CLI Cloudflare)
npm install -g wrangler

# Login
wrangler login

# Build + deploy
npm run build
wrangler pages deploy out --project-name=cu-dau-tu
```

---

## Monitoring

- **Analytics**: tab **Analytics** trong Cloudflare Pages
- **Logs**: tab **Logs** (real-time)
- **Build logs**: tab **Deployments** → click vào deployment → xem log build

---

## Performance tips (đã setup sẵn)

- `_headers` đã set cache 1 năm cho `/_next/static/*`
- HTML được set `no-cache` để luôn fresh
- `_redirects` đã handle SPA fallback
- Static export = serve từ CDN edge = load cực nhanh toàn cầu
