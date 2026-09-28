// Chuẩn hóa số thập phân trong CHUỖI TEXT TIẾNG VIỆT: 2.5 → 2,5
// Chỉ sửa bên trong string literal, KHÔNG đụng code (Tailwind class, motion value, số học).
// Quy tắc: \d.\d  →  \d,d  khi phần sau dấu chấm KHÔNG phải đúng 3 chữ số
// ("1.000.000" là phân tách nghìn — chuẩn VN, giữ nguyên).
//
// Usage: node fix-vn-numbers.cjs [--dry]
const fs = require('fs');

const FILES = [
  'src/data/curriculum.ts',
  'src/components/dashboard/DailyTip.tsx',
  'src/data/achievements.ts',
  'src/data/leaderboard-mock.ts',
  'src/app/page.tsx',
  'src/app/(app)/tools/page.tsx',
  'src/app/(app)/tutor/page.tsx',
  'src/app/onboarding/page.tsx',
  'src/app/(app)/profile/page.tsx',
  'src/app/(app)/learn/page.tsx',
  'src/app/(app)/review/page.tsx',
  'src/app/(app)/shop/page.tsx',
  'src/app/(app)/stats/page.tsx',
  'src/app/(app)/leaderboard/page.tsx',
  'src/app/layout.tsx',
  'public/manifest.json',
];

// các field chứa nội dung hiển thị cho người dùng
const CONTENT_FIELD = /(prompt|explanation|title|description|blankAnswer|text|name|description|title)\s*:\s*"/;

const DRY = process.argv.includes('--dry');
let totalChanges = 0;

const GUARD = [/\d{4}\//, /\/\d{4}/, /v\d/i];

function isProtected(text, index) {
  const ctx = text.slice(Math.max(0, index - 20), index + 24);
  return GUARD.some((g) => g.test(ctx));
}

for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  let fileChanges = 0;
  const samples = [];

  const out = lines.map((line) => {
    // Chỉ xử lý dòng là field nội dung, hoặc dòng là 1 chuỗi tip độc lập
    const isContentField = CONTENT_FIELD.test(line);
    const isStandaloneString =
      /^\s*"/.test(line) && !/className|style=|:\s*[A-Za-z]/i.test(line);
    if (!isContentField && !isStandaloneString) return line;

    let result = '';
    let i = 0;
    while (i < line.length) {
      // nếu đang trong string literal "..." thì sửa bên trong
      if (line[i] === '"') {
        const end = line.indexOf('"', i + 1);
        if (end === -1) { result += line.slice(i); break; }
        let str = line.slice(i + 1, end);
        const before = str;
        str = str.replace(/(\d)\.(\d{1,2})(?!\d)/g, (m, a, b, off) => {
          if (isProtected(before, off)) return m;
          fileChanges++;
          if (samples.length < 8) samples.push(`${m} → ${a},${b}`);
          return `${a},${b}`;
        });
        result += '"' + str + '"';
        i = end + 1;
      } else {
        result += line[i];
        i++;
      }
    }
    return result;
  });

  if (fileChanges > 0) {
    totalChanges += fileChanges;
    console.log(`\n${file}: ${fileChanges} thay đổi`);
    samples.forEach((s) => console.log(`   ${s}`));
    if (!DRY) fs.writeFileSync(file, out.join('\n'), 'utf-8');
  }
}

console.log(`\n=== TỔNG: ${totalChanges} ${DRY ? '(DRY RUN)' : '(đã ghi)'} ===`);
