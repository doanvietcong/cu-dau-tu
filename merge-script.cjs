// merge-lessons.cjs - Insert new lessons BEFORE the closing ];
const fs = require('fs');
const path = require('path');

const curFile = path.join(__dirname, 'src', 'data', 'curriculum.ts');
const bakFile = path.join(__dirname, 'src', 'data', 'lessons-new.ts.backup');

let cur = fs.readFileSync(curFile, 'utf8');
let newLessons = fs.readFileSync(bakFile, 'utf8');

// Strip leading blank lines from new lessons
newLessons = newLessons.replace(/^\r?\n+/, '');

// Find the FINAL `];` in the file. The structure is:
//   export const UNITS = [...];
//   export const LESSONS = [
//     ...
//   ];   <-- this is the last `];`
// So we look for the last occurrence of `];` at the end of the file (with possible whitespace).
const finalMatch = cur.match(/\n\]\s*$/);
if (!finalMatch) {
  console.error('Could not find trailing ];');
  process.exit(1);
}

const insertPoint = cur.length - finalMatch[0].length;
const before = cur.substring(0, insertPoint);
const after = cur.substring(insertPoint);

const newContent = before.trimEnd() + '\n\n' + newLessons.trimEnd() + '\n];\n';

fs.writeFileSync(curFile, newContent, 'utf8');

// Try to delete backup
try { fs.unlinkSync(bakFile); } catch (e) { /* ignore */ }

const matches = newContent.match(/id: "l\d+-\d+"/g) || [];
const unique = [...new Set(matches)];
console.log('Done. File size:', newContent.length);
console.log('Total unique lessons:', unique.length);
console.log('Last 3:', unique.slice(-3).join(', '));
console.log('Exports:');
const exportList = newContent.match(/^export const \w+/gm) || [];
exportList.forEach(e => console.log('  ', e));
