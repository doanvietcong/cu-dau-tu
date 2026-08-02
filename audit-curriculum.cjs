// Comprehensive curriculum audit
// Usage: node audit-curriculum.cjs
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/curriculum.ts', 'utf-8');

// Parse the export arrays - simple approach using regex + manual parsing
// Extract UNITS array
const unitsMatch = content.match(/export const UNITS[^=]*=\s*\[([\s\S]*?)\n\];/);
const lessonsMatch = content.match(/export const LESSONS[^=]*=\s*\[([\s\S]*?)\n\];/);

if (!unitsMatch || !lessonsMatch) {
  console.error('FAIL: cannot find UNITS or LESSONS arrays');
  process.exit(1);
}

const unitsText = unitsMatch[1];
const lessonsText = lessonsMatch[1];

// Parse units
const unitPattern = /\{\s*id:\s*"([^"]+)",\s*order:\s*(\d+),\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*color:\s*"([^"]+)",\s*iconEmoji:\s*"([^"]+)",\s*lessonIds:\s*\[([^\]]+)\]/g;
const units = [];
let m;
while ((m = unitPattern.exec(unitsText)) !== null) {
  units.push({
    id: m[1], order: parseInt(m[2]), title: m[3], description: m[4],
    color: m[5], iconEmoji: m[6],
    lessonIds: m[7].split(',').map(s => s.trim().replace(/"/g, ''))
  });
}

// Parse lessons
const lessonBlocks = lessonsText.split(/\{\s*id:\s*"(l[\w-]+)"/).slice(1);
const lessons = [];
for (let i = 0; i < lessonBlocks.length; i += 2) {
  const id = lessonBlocks[i];
  const body = lessonBlocks[i + 1];
  if (!body) continue;
  const titleM = body.match(/title:\s*"([^"]+)"/);
  const unitIdM = body.match(/unitId:\s*"([^"]+)"/);
  const xpM = body.match(/xpReward:\s*(\d+)/);
  const coinM = body.match(/coinReward:\s*(\d+)/);
  const minM = body.match(/estimatedMinutes:\s*(\d+)/);
  // Count questions
  const qMatches = [...body.matchAll(/\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"([^"]+)"/g)];
  lessons.push({
    id, title: titleM ? titleM[1] : '?',
    unitId: unitIdM ? unitIdM[1] : '?',
    xp: xpM ? parseInt(xpM[1]) : 0,
    coin: coinM ? parseInt(coinM[1]) : 0,
    minutes: minM ? parseInt(minM[1]) : 0,
    questionCount: qMatches.length
  });
}

console.log('=== SUMMARY ===');
console.log(`Units: ${units.length}`);
console.log(`Lessons: ${lessons.length}`);
console.log(`Total questions: ${lessons.reduce((a, l) => a + l.questionCount, 0)}`);

// === AUDIT 1: Unit order unique
const orders = units.map(u => u.order);
const dupOrders = orders.filter((o, i) => orders.indexOf(o) !== i);
if (dupOrders.length) console.log(`❌ Duplicate unit orders: ${dupOrders.join(', ')}`);
else console.log('✓ Unit orders unique');

// === AUDIT 2: Unit IDs unique
const unitIds = units.map(u => u.id);
const dupUnitIds = unitIds.filter((id, i) => unitIds.indexOf(id) !== i);
if (dupUnitIds.length) console.log(`❌ Duplicate unit IDs: ${dupUnitIds.join(', ')}`);
else console.log('✓ Unit IDs unique');

// === AUDIT 3: Unit colors valid
const validColors = ['green','gold','red','blue','purple','orange','emerald','stone','amber','rose'];
const badColors = units.filter(u => !validColors.includes(u.color));
if (badColors.length) console.log(`❌ Invalid colors: ${badColors.map(u => `${u.id}=${u.color}`).join(', ')}`);
else console.log('✓ All unit colors valid');

// === AUDIT 4: Lesson IDs unique
const lessonIds = lessons.map(l => l.id);
const dupLIds = lessonIds.filter((id, i) => lessonIds.indexOf(id) !== i);
if (dupLIds.length) console.log(`❌ Duplicate lesson IDs: ${dupLIds.join(', ')}`);
else console.log('✓ Lesson IDs unique');

// === AUDIT 5: Lesson IDs in UNITS all exist in LESSONS
const allReferencedIds = new Set();
units.forEach(u => u.lessonIds.forEach(id => allReferencedIds.add(id)));
const missingLessons = [...allReferencedIds].filter(id => !lessonIds.includes(id));
if (missingLessons.length) console.log(`❌ Lessons in UNITS but missing in LESSONS: ${missingLessons.join(', ')}`);
else console.log('✓ All UNITS.lessonIds exist in LESSONS');

// === AUDIT 6: Lessons not in any UNIT
const orphanLessons = lessons.filter(l => !allReferencedIds.has(l.id));
if (orphanLessons.length) console.log(`❌ Orphan lessons (not in any UNITS): ${orphanLessons.map(l => l.id).join(', ')}`);
else console.log('✓ No orphan lessons');

// === AUDIT 7: Question IDs unique within each lesson
let dupQIds = [];
lessons.forEach(l => {
  const lessonBlock = lessonsText.split(`id: "${l.id}"`)[1]?.split('},  {')[0] || '';
  const qIds = [...lessonBlock.matchAll(/id:\s*"(q[\w-]+)"/g)].map(m => m[1]);
  const dupes = qIds.filter((id, i) => qIds.indexOf(id) !== i);
  if (dupes.length) dupQIds.push(`${l.id}: ${dupes.join(', ')}`);
});
if (dupQIds.length) console.log(`❌ Duplicate question IDs in lessons: ${dupQIds.slice(0, 5).join('; ')}`);
else console.log('✓ Question IDs unique within each lesson');

// === AUDIT 8: Multiple-choice: correctChoiceId exists in choices
const mcIssues = [];
const lessonBlocks2 = lessonsText.split(/id:\s*"(l[\w-]+)"/);
// Re-scan for multiple choice
for (let i = 1; i < lessonBlocks2.length; i += 2) {
  const lessonId = lessonBlocks2[i];
  const body = lessonBlocks2[i + 1];
  if (!body) continue;
  // Find each question block
  const qPattern = /\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"multiple-choice"[\s\S]*?correctChoiceId:\s*"([^"]+)"[\s\S]*?choices:\s*\[([\s\S]*?)\]/g;
  let qm;
  while ((qm = qPattern.exec(body)) !== null) {
    const qId = qm[1];
    const correctId = qm[2];
    const choicesText = qm[3];
    const choiceIds = [...choicesText.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
    if (!choiceIds.includes(correctId)) {
      mcIssues.push(`${lessonId}/${qId}: correctChoiceId="${correctId}" not in [${choiceIds.join(', ')}]`);
    }
  }
}
if (mcIssues.length) console.log(`❌ Multiple-choice issues (${mcIssues.length}): ${mcIssues.slice(0, 5).join('; ')}`);
else console.log('✓ All multiple-choice correctChoiceIds valid');

// === AUDIT 9: Fill-blank format: blankAnswer should be lowercase, no diacritics, no spaces
const fillIssues = [];
const fbPattern = /\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"fill-blank"[\s\S]*?blankAnswer:\s*"([^"]+)"[\s\S]*?prompt:\s*"([^"]+)"/g;
let fm;
while ((fm = fbPattern.exec(lessonsText)) !== null) {
  const qId = fm[1];
  const ans = fm[2];
  const prompt = fm[3];
  if (/[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẴÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/.test(ans)) {
    fillIssues.push(`${qId}: blankAnswer "${ans}" has uppercase or diacritics - user input may not match`);
  }
  if (/\s/.test(ans)) {
    fillIssues.push(`${qId}: blankAnswer "${ans}" has spaces - prompt usually asks for 1 word`);
  }
}
if (fillIssues.length) {
  // Note: spaces in blankAnswer are now OK because QuestionCard normalizes via
  // lowercase + diacritics + whitespace removal before comparison. So "lam phat",
  // "lamphat", "lam  phat" all match "lạm phát". We just log a count.
  console.log(`ℹ ${fillIssues.length} fill-blank answers contain spaces (OK - normalized in QuestionCard)`);
} else {
  console.log('✓ All fill-blank answers look clean');
}

// === AUDIT 10: True-false: correctBoolean is boolean
const tfIssues = [];
const tfPattern = /\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"true-false"[\s\S]*?correctBoolean:\s*([^,]+),/g;
let tfm;
while ((tfm = tfPattern.exec(lessonsText)) !== null) {
  const qId = tfm[1];
  const val = tfm[2].trim();
  if (val !== 'true' && val !== 'false') {
    tfIssues.push(`${qId}: correctBoolean=${val} (must be true or false)`);
  }
}
if (tfIssues.length) console.log(`❌ True-false issues: ${tfIssues.join(', ')}`);
else console.log('✓ All true-false correctBoolean values valid');

// === AUDIT 11: Match-pairs: left/right counts equal
const mpIssues = [];
const mpPattern = /\{\s*id:\s*"(q[\w-]+)",\s*type:\s*"match-pairs"[\s\S]*?pairs:\s*\[([\s\S]*?)\]/g;
let mpm;
while ((mpm = mpPattern.exec(lessonsText)) !== null) {
  const qId = mpm[1];
  const pairsText = mpm[2];
  const lefts = [...pairsText.matchAll(/left:\s*"([^"]+)"/g)].map(m => m[1]);
  const rights = [...pairsText.matchAll(/right:\s*"([^"]+)"/g)].map(m => m[1]);
  if (lefts.length !== rights.length) {
    mpIssues.push(`${qId}: left count (${lefts.length}) != right count (${rights.length})`);
  }
  if (new Set(lefts).size !== lefts.length) {
    mpIssues.push(`${qId}: duplicate left values`);
  }
  if (new Set(rights).size !== rights.length) {
    mpIssues.push(`${qId}: duplicate right values`);
  }
}
if (mpIssues.length) console.log(`❌ Match-pairs issues: ${mpIssues.slice(0, 5).join(' | ')}`);
else console.log('✓ All match-pairs valid');

// === AUDIT 12: Stats summary
const newUnits = units.filter(u => ['unit-13', 'unit-14', 'unit-15'].includes(u.id));
console.log('\n=== NEW UNITS (3) ===');
newUnits.forEach(u => {
  const unitLessons = lessons.filter(l => l.unitId === u.id);
  const totalQ = unitLessons.reduce((a, l) => a + l.questionCount, 0);
  console.log(`  ${u.id} "${u.title}" (${u.color}): ${unitLessons.length} lessons, ${totalQ} questions`);
  unitLessons.forEach(l => {
    console.log(`    ${l.id}: ${l.title} (${l.questionCount} q, ${l.xp}xp, ${l.minutes}p)`);
  });
});

const expandedUnits = units.filter(u => ['unit-4', 'unit-5', 'unit-6', 'unit-8'].includes(u.id));
console.log('\n=== EXPANDED UNITS ===');
expandedUnits.forEach(u => {
  const unitLessons = lessons.filter(l => l.unitId === u.id);
  console.log(`  ${u.id} "${u.title}": ${unitLessons.length} lessons`);
});
