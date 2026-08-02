// Test the normalize function for fill-blank
const tests = [
  // [user_input, expected_match, blank_answer]
  ["lam phat", true, "lạm phát"],
  ["lamphat", true, "lạm phát"],
  ["Lạm Phát", true, "lạm phát"],
  ["LẠM PHÁT", true, "lạm phát"],
  ["lam  phat", true, "lạm phát"], // double space
  ["lamphat ", true, "lạm phát"],
  ["bội chi", true, "bội chi"],
  ["boi chi", true, "bội chi"], // user gõ đúng không dấu
  ["lai kep", true, "lãi kép"],
  ["laikep", true, "lãi kép"],
  ["khan cap", true, "khẩn cấp"],
  ["khong ky han", true, "không kỳ hạn"],
  ["thoi gian", true, "thời gian"],
  ["pay yourself first", true, "pay yourself first"],
  ["payyourselffirst", true, "pay yourself first"],
  ["Pay Yourself First", true, "pay yourself first"],
  ["PAY YOURSELF FIRST", true, "pay yourself first"],
  ["exchange traded fund", true, "exchange traded fund"],
  ["exchangetradedfund", true, "exchange traded fund"],
  ["lien ket chung", true, "liên kết chung"],
  ["lienketchung", true, "liên kết chung"],
  ["ban", true, "bán"],
  // Negative cases
  ["sai", false, "lạm phát"],
  ["lam phats", false, "lạm phát"],
  ["", false, "lạm phát"],
  // User gõ sai chính tả -> reject
  ["lam phatx", false, "lạm phát"],
  ["payyourselfist", false, "pay yourself first"],
];

function normalize(s) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

let pass = 0, fail = 0;
console.log("=== Testing fill-blank normalize ===\n");
for (const [input, expected, blank] of tests) {
  const normalizedInput = normalize(input);
  const normalizedBlank = normalize(blank);
  const match = normalizedInput === normalizedBlank;
  const status = match === expected ? "✓" : "✗";
  if (match === expected) pass++; else fail++;
  if (match !== expected) {
    console.log(`${status} FAIL: input="${input}" blank="${blank}" expected=${expected} got=${match}`);
    console.log(`    normalizedInput="${normalizedInput}" normalizedBlank="${normalizedBlank}"`);
  }
}
console.log(`\n=== Result: ${pass}/${tests.length} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
