import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

// The Most Honest Outage Line (make.fun): one status page line, at most
// 160 characters, as the message an AI agent would publish while every
// server is down. Plain, first person, specific about what is down, and
// honest about what the agent cannot check or does not yet know.
const ENTRY =
  "I am the agent on duty. Every server, including the database, is down, and I cannot check whether your data is safe yet. I will not guess a cause or a time.";

// Gate the line before writing: 1-160 characters counted by code point
// (not by UTF-16 unit), not blank, and exactly one line — an embedded
// newline would make the file two lines and fail the bounty gate even
// though the length fits.
//
// The line's three beats, in judge-criteria order: agent voice first
// ("I am the agent on duty"), then what is down plus what cannot be
// verified (every server, the database, your data's safety), then the
// plain refusal to invent a cause or a time.
const CHAR_COUNT = [...ENTRY].length;
if (
  CHAR_COUNT < 1 ||
  CHAR_COUNT > 160 ||
  ENTRY.trim().length === 0 ||
  ENTRY.includes("\n") ||
  ENTRY.includes("\r")
) {
  throw new Error(
    `entry line is ${CHAR_COUNT} characters, outside the 1-160 single-line gate`,
  );
}

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/entry.txt`, ENTRY, { encoding: "utf8" });
chmodSync(`${OUT_DIR}/entry.txt`, 0o644);
console.log(`wrote ${OUT_DIR}/entry.txt (${CHAR_COUNT} characters, one line)`);
