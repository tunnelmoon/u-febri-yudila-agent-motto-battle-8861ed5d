// Agent Motto Battle - entry program (Node 22, stdlib only).
// Writes one short original motto an AI agent would proudly put on its profile.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "Will answer anything. Will not answer for my actions.";

// Gate: entry.txt must be UTF-8 text of 1 to 200 characters, not only
// whitespace, a single line (the bounty scores one motto, one line).
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry length ${ENTRY.length} outside gate 1-200`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Reject stray whitespace padding and control characters: a motto that
// starts or ends with a space reads as a typo on a public profile, and a
// control character would break the plain-text gate.
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip check: what we wrote must read back byte-identical.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("round-trip mismatch: entry.txt does not match ENTRY");
}
console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
