// Kiểm tra DailyTip: trùng chủ đề, độ dài, số liệu mâu thuẫn với curriculum
const fs = require('fs');

const t = fs.readFileSync('src/components/dashboard/DailyTip.tsx', 'utf-8');
const start = t.indexOf('const TIPS = [');
const arr = t.slice(start, t.indexOf('];', start));
const tips = arr
  .split('\n')
  .filter((l) => l.trim().startsWith('"'))
  .map((l) => {
    const m = l.trim().match(/^"(.*)",?$/s);
    return m ? m[1] : null;
  })
  .filter(Boolean);

console.log(`Tổng tips: ${tips.length}`);

// 1) độ dài
const long = tips.filter((x) => x.length > 200);
console.log(`\nTip dài >200 ký tự: ${long.length}`);
long.forEach((x) => console.log(`  [${x.length}] ${x.slice(0, 70)}`));

// 2) trùng chủ đề
const topics = {
  'quỹ khẩn cấp': /khẩn cấp/i,
  'lãi kép / tích lũy': /lãi kép|tích lũy|tiết kiệm 20|chuyển .*tiết kiệm/i,
  'chi phí ăn uống / cà phê': /cà phê|trà sữa|ly |GrabFood/i,
  'đi lại': /Grab |đi lại|di chuyển/i,
  'mua sắm / cooling-off': /500k|cooling-off|mua sắm|sale/i,
};
console.log('\nPhân bố chủ đề:');
Object.entries(topics).forEach(([name, re]) => {
  const hit = tips.map((t2, i) => [i + 1, t2]).filter(([, x]) => re.test(x));
  console.log(`  ${name}: ${hit.length} tip -> dòng ${hit.map((h) => h[0]).join(', ')}`);
  if (hit.length >= 3) {
    hit.forEach(([, x]) => console.log(`      - ${x.slice(10, 90)}`));
  }
});

// 3) số liệu mâu thuẫn với curriculum
const c = fs.readFileSync('src/data/curriculum.ts', 'utf-8');
const checks = [
  ['thuế 7 bậc (đã bỏ)', /7 bậc/i],
  ['giảm trừ 4,4 triệu (đã bỏ)', /4,4 triệu/],
  ['giảm trừ 11 triệu (đã bỏ)', /11 triệu/],
  ['20 năm để hưởng lương hưu (đã bỏ)', /20 năm/],
];
console.log('\nSố liệu cũ còn sót trong DailyTip:');
let bad = 0;
checks.forEach(([name, re]) => {
  const hit = tips.map((t2, i) => [i + 1, t2]).filter(([, x]) => re.test(x));
  if (hit.length) {
    bad += hit.length;
    console.log(`  ✗ ${name}:`);
    hit.forEach(([, x]) => console.log(`      ${x.slice(0, 100)}`));
  }
});

// 4) số liệu quan trọng có trong curriculum không
const mustMatch = ['15,5 triệu', '6,2 triệu', '5 bậc', '15 năm', '22%'];
console.log('\nSố liệu chuẩn 2026 có trong DailyTip:');
mustMatch.forEach((s) => {
  const inTips = tips.some((x) => x.includes(s));
  const inCurr = c.includes(s);
  console.log(`  ${s}: tips=${inTips ? 'có' : 'không'} | curriculum=${inCurr ? 'có' : 'không'}`);
});

console.log(`\nTổng số dòng cần xem lại: ${bad + long.length}`);
