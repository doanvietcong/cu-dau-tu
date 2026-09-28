// Deep content audit — checks for tone/number-format/content issues
// Usage: node audit-content.cjs
const fs = require('fs');

const content = fs.readFileSync('src/data/curriculum.ts', 'utf-8');
const tips = fs.readFileSync('src/components/dashboard/DailyTip.tsx', 'utf-8');
const achv = fs.readFileSync('src/data/achievements.ts', 'utf-8');

const issues = [];
const add = (cat, msg) => issues.push({ cat, msg });

// === 1. Pronoun / address consistency ===
// Vietnamese apps should use "bạn" consistently. "Anh/chị/em" is informal-bro style.
const addrCounts = {
  'bạn': (content.match(/\bbạn\b/gi) || []).length,
  'anh/chị': (content.match(/\b(anh|chị)\b/gi) || []).length,
  'em ': (content.match(/\bem\b/gi) || []).length,
  'mình': (content.match(/\bmình\b/gi) || []).length,
  'chúng ta': (content.match(/\bchúng ta\b/gi) || []).length,
};
console.log('=== ADDRESS STYLE COUNTS (curriculum) ===');
Object.entries(addrCounts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// Find lines with "anh" or "chị" that are NOT lesson titles
content.split('\n').forEach((line, i) => {
  const t = line.trim();
  if (/^title:/.test(t)) return;
  if (/\b(anh|chị)\b/gi.test(t) && /prompt:|explanation:/.test(t)) {
    add('REGISTER', `L${i + 1}: dùng "anh/chị" trong prompt/explanation → "${t.slice(0, 110)}"`);
  }
});

// === 2. Number format consistency ===
// Vietnamese style: 1.000.000 or 1 triệu. English style "1,000" is wrong.
const commaNumbers = [...content.matchAll(/(?:^|[^.\d])(\d{1,3}),(\d{3})(?![\d])/g)];
commaNumbers.forEach((m) => {
  const line = content.slice(0, m.index).split('\n').length;
  // allow known finance ratios like "1,825%/năm" and "2,300%/năm"
  if (/%\/năm|%\/tháng|1,825|2,300|78,000|1,557|4,200|8-10|20-30/.test(m[0])) return;
  add('NUMBER', `L${line}: dùng dấu phẩy kiểu Mĩ "${m[0].trim()}" → nên dùng "triệu/tỷ"`);
});

// === 3. Outdated / stale references ===
const stalePatterns = [
  { re: /lãi suất[^.]*?\b(4|5|6|7|8|9|10)-?(\d+)?\s*-\s*\d+(\.\d+)?%/gi, note: 'kiểm tra lãi suất có còn đúng không' },
];
// === 4. Legal/regulatory references — flag for manual review ===
const legalRefs = [...content.matchAll(/(NĐ|Thông tư|Luật|Nghị định|Nghị quyết|Thông tư)[\s]*([\d\/\-A-Z]+)/g)];
const uniqueLaws = new Map();
legalRefs.forEach((m) => {
  const key = m[1] + ' ' + m[2];
  uniqueLaws.set(key, (uniqueLaws.get(key) || 0) + 1);
});
console.log('\n=== LEGAL REFERENCES (cần verify còn hiệu lực) ===');
[...uniqueLaws.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k} ×${v}`));

// === 5. Currency: check for USD usage without context ===
content.split('\n').forEach((line, i) => {
  if (!/prompt:|explanation:/.test(line)) return;
  if (/\$[\d,]+/.test(line) && !/Forex|forex|EUR|USD|VNĐ|đổi sang|tỷ giá/.test(line)) {
    add('CURRENCY', `L${i + 1}: dùng "$" trong khi app khác dùng VND → "${line.trim().slice(0, 100)}"`);
  }
});

// === 6. Fill-blank answers that are ambiguous (multiple valid answers) ===
const fbPattern = /\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"fill-blank"[\s\S]*?blankAnswer:\s*"([^"]+)"[\s\S]*?prompt:\s*"([^"]+)"/g;
let fbm;
const fbCount = { numeric: 0, text: 0 };
while ((fbm = fbPattern.exec(content)) !== null) {
  const [, qId, ans, prompt] = fbm;
  if (/^\d/.test(ans)) fbCount.numeric++;
  else fbCount.text++;
  // flag prompts that ask for a range → multiple answers valid
  if (/khoảng bao nhiêu|bao nhiêu|range|từ .* đến/i.test(prompt) && /^\d/.test(ans)) {
    add('FILL-BLANK', `${qId}: hỏi "bao nhiêu" (nhiều đáp án đúng) nhưng blankAnswer="${ans}" cứng`);
  }
}
console.log(`\n=== FILL-BLANK: ${fbCount.numeric} numeric, ${fbCount.text} text ===`);

// === 7. Explanation quality: too short or missing key numbers ===
const expShort = [...content.matchAll(/explanation:\s*"([^"]{0,60})"/g)];
if (expShort.length) add('EXPLANATION', `${expShort.length} explanation quá ngắn (<60 ký tự)`);

// === 8. Emoji/tone: check for English-only jargon without VN explanation
const jargon = [...content.matchAll(/\b(margin call|force-sell|short squeeze|pump (?:and|&) dump|SFP|RSI|MACD|breakout|fakeout|spread|leverage|portfolio|benchmark|volatility|slippage)\b/gi)];
const jargonSet = new Map();
jargon.forEach((m) => {
  const k = m[1].toLowerCase();
  jargonSet.set(k, (jargonSet.get(k) || 0) + 1);
});
console.log('\n=== ENGLISH JARGON USAGE (cần giải thích tiếng Việt) ===');
[...jargonSet.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// === 9. DailyTip check ===
const tipArr = tips.slice(tips.indexOf('const TIPS = ['), tips.indexOf('];', tips.indexOf('const TIPS = [')));
const tipLines = tipArr.split('\n').filter((l) => l.trim().startsWith('"'));
console.log(`\n=== DAILYTIP: ${tipLines.length} tips ===`);
// duplicate tips
const seen = new Map();
tipLines.forEach((l) => {
  const t = l.replace(/[^"]*"/, '').replace(/"\s*,?\s*$/, '');
  if (seen.has(t)) add('DAILYTIP-DUP', `tip trùng lặp: "${t.slice(0, 70)}"`);
  seen.set(t, 1);
});
// register in tips
tipLines.forEach((l) => {
  if (/\b(anh|chị)\b/gi.test(l) && !/^"/.test(l)) add('DAILYTIP-REGISTER', `tip dùng anh/chị: "${l.slice(0, 80)}"`);
});

// === 10. Achievements: unit references that no longer exist ===
const achUnitRefs = [...achv.matchAll(/unit-(\d+)/g)].map((m) => parseInt(m[1]));
const maxUnit = Math.max(...achUnitRefs);
console.log(`\n=== ACHIEVEMENTS: max unit ref = unit-${maxUnit} ===`);
const achLessons = [...achv.matchAll(/l(\d+)-/g)].map((m) => parseInt(m[1]));
console.log(`  lesson refs max = l${Math.max(...achLessons)}-*`);

// === 11. Check "triệu" vs "tỷ" vs "trăm" — VN uses tỷ not tỉ
const tyIssues = [];
content.split('\n').forEach((line, i) => {
  if (/\btỉ\b/i.test(line) && !/tỉ lệ|đơn vị tỉ/.test(line)) {
    tyIssues.push(`L${i + 1}: dùng "tỉ" → chuẩn VN là "tỷ"`);
  }
});
tyIssues.forEach((t) => add('VN-NORM', t));

// === 12. Số lớn viết kiểu "1.5 tỷ" (sai, phải "1,5 tỷ") ===
const decComma = [...content.matchAll(/\b\d+\.\d+\s*(tỷ|triệu|nghìn|tr)/gi)];
const uniqDec = new Set();
decComma.forEach((m) => {
  if (uniqDec.has(m[0])) return;
  uniqDec.add(m[0]);
  if (/^0\./.test(m[0]) || /^[1-9]0?\./.test(m[0])) {
    const num = parseFloat(m[0]);
    if (num < 10) {
      add('VN-NORM', `dùng dấu "." thập phân kiểu Mĩ: "${m[0].trim()}" → nên dùng dấu phẩy "1,5 tỷ"`);
    }
  }
});

console.log('\n\n=== ISSUES FOUND ===');
const byCat = {};
issues.forEach((i) => {
  byCat[i.cat] = byCat[i.cat] || [];
  byCat[i.cat].push(i.msg);
});
Object.entries(byCat).forEach(([cat, msgs]) => {
  console.log(`\n[${cat}] ${msgs.length} issues`);
  msgs.slice(0, 25).forEach((m) => console.log(`  - ${m}`));
  if (msgs.length > 25) console.log(`  ... +${msgs.length - 25} more`);
});
if (!issues.length) console.log('✓ No issues');
console.log(`\nTOTAL: ${issues.length} issues`);
