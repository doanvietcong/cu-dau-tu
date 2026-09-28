// Sinh public/sitemap.xml từ curriculum.ts
// Bao gồm: trang công khai + TOÀN BỘ 107 trang bài học (giá trị SEO chính của app).
// Loại các trang cần đăng nhập (profile, shop, stats, leaderboard) vì chúng không có giá trị SEO.
// Lưu ý: next.config.mjs bật trailingSlash: true → mọi URL kết thúc bằng "/".
// Usage: node gen-sitemap.cjs
const fs = require('fs');
const path = require('path');

const BASE = 'https://cu-dau-tu.pages.dev';

// Đọc danh sách lesson id từ curriculum.ts
const curriculum = fs.readFileSync(path.join('src', 'data', 'curriculum.ts'), 'utf-8');
const lessonsStart = curriculum.indexOf('export const LESSONS');
const lessonBlock = curriculum.slice(lessonsStart);
const lessonIds = [...lessonBlock.matchAll(/^\s{4}id:\s*"(l\d+-\d+)"/gm)].map((m) => m[1]);
const units = [...curriculum.matchAll(/^\s{4}id:\s*"(unit-\d+)"/gm)].map((m) => m[1]);

if (!lessonIds.length) {
  console.error('ERROR: không tìm thấy lesson id nào trong curriculum.ts');
  process.exit(1);
}

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/learn/', changefreq: 'daily', priority: '0.9' },
  { path: '/tools/', changefreq: 'monthly', priority: '0.8' },
  { path: '/review/', changefreq: 'monthly', priority: '0.6' },
  { path: '/tutor/', changefreq: 'monthly', priority: '0.6' },
  { path: '/auth/sign-up/', changefreq: 'monthly', priority: '0.8' },
  { path: '/auth/sign-in/', changefreq: 'monthly', priority: '0.5' },
  { path: '/onboarding/', changefreq: 'monthly', priority: '0.4' },
];

const entries = [
  ...staticRoutes.map((r) => ({ loc: BASE + r.path, changefreq: r.changefreq, priority: r.priority })),
  // bài học: ưu tiên cao vì là nội dung chính, cập nhật khi sửa nội dung
  ...lessonIds.map((id) => ({
    loc: `${BASE}/lesson/${id}/`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join('public', 'sitemap.xml'), xml, 'utf-8');
console.log(`✓ Đã ghi public/sitemap.xml`);
console.log(`  ${staticRoutes.length} trang tĩnh + ${lessonIds.length} trang bài học = ${entries.length} URL`);
console.log(`  ${units.length} units trong curriculum`);
