/* Unit checks for the Molecular Spelling Bee word acceptance.
   Run offline with:  node games/bee-words.test.js
   Loads the bundled dictionary (bee-words.js) and applies the same validity rule
   the game uses, for the shipped PROTEIN puzzle (center R, letters P O T E I N R). */
require('./bee-words.js');            // sets globalThis.BEE_WORDS (no network)
const DICT = globalThis.BEE_WORDS;

const CENTER = 'R';
const SET = new Set(['R', 'P', 'O', 'T', 'E', 'I', 'N']);

// Same rule as validWordsForPuzzle()/submit() in molecular-bee.html.
function isValid(word) {
  const W = word.toUpperCase();
  if (W.length < 4) return false;
  if (W.indexOf(CENTER) === -1) return false;
  for (const ch of W) if (!SET.has(ch)) return false;
  return DICT.has(W.toLowerCase());
}

const cases = [
  ['enter', true],   // the reported bug: everyday word, fits the hive
  ['poor', true],    // the reported bug: everyday word, fits the hive
  ['protein', true], // the pangram / bio word
  ['tripe', true],   // ordinary word that already worked
  ['cats', false],   // uses letters not in the hive (C, A, S)
  ['pot', false],    // too short (< 4)
  ['rrrr', false],   // fits the hive + center but is not an English word
  ['tine', false],   // valid word but missing the center letter R
];

let failed = 0;
for (const [word, expected] of cases) {
  const got = isValid(word);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  isValid(${JSON.stringify(word)}) = ${got}  (expected ${expected})`);
}

console.log(`\ndictionary size: ${DICT.size} words`);
if (failed) { console.error(`\n${failed} check(s) FAILED`); process.exit(1); }
console.log('\nAll checks passed.');
