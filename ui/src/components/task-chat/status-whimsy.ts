/**
 * Whimsical gerunds for the live status pill when the label carries no real
 * signal ("Running"/"Working"). Two curated pools: Paperclip's analog-office
 * vocabulary (led by the "Clipping" brand nod) and Claude-Code-style whimsy.
 * Every word is chosen to still read sensibly after-the-fact — a settled turn
 * that once said "Collating…" shouldn't feel like a lie.
 *
 * The pick is deterministic from a seed (the run-scoped status item id) so a
 * re-render never reshuffles the word, and it rotates to the next word every
 * ~10s of elapsed run time.
 */
import { tx } from "@/i18n/xo";

/** Paperclip / analog-office pool — "Clipping" is the guaranteed brand nod.
 * Board-curated round 2 (PAP-349): dropped Cataloguing / Carbon-copying /
 * Archiving, added the workshop-and-whiteboard verbs. */
export const ANALOG_OFFICE_WORDS: readonly string[] = [
  "Clipping",
  "Organizing",
  "Sorting",
  "Synthesizing",
  "Analyzing",
  "Filing",
  "Collating",
  "Stapling",
  "Indexing",
  "Annotating",
  "Drafting",
  "Proofreading",
  "Alphabetizing",
  "Photocopying",
  "Laminating",
  "Hole-punching",
  "Bookmarking",
  "Highlighting",
  "Typing",
  "Trimming",
  "Aligning",
  "Combining",
  "Whiteboarding",
  "Diagramming",
  "Sketching",
  "Labeling",
  "Sticky-noting",
];

/** Claude-Code-style whimsy pool — board-curated round 2 kept only these four. */
export const CLAUDE_CODE_WORDS: readonly string[] = [
  "Brewing",
  "Tinkering",
  "Distilling",
  "Deliberating",
];

/** Interleaved so consecutive rotations alternate flavors rather than running
 * through one pool before the other. */
export const WHIMSY_WORDS: readonly string[] = (() => {
  const out: string[] = [];
  const max = Math.max(ANALOG_OFFICE_WORDS.length, CLAUDE_CODE_WORDS.length);
  for (let i = 0; i < max; i++) {
    if (i < ANALOG_OFFICE_WORDS.length) out.push(ANALOG_OFFICE_WORDS[i]);
    if (i < CLAUDE_CODE_WORDS.length) out.push(CLAUDE_CODE_WORDS[i]);
  }
  return out;
})();

/** How long each word holds before rotating to the next. */
export const WHIMSY_ROTATE_MS = 10_000;

/**
 * Labels that carry no tool identity, where a whimsical word fills the gap.
 * Informative labels (taxonomy verbs, "Thinking", "Responding", "Queued")
 * always keep their copy — whimsy never replaces signal.
 */
export function isGenericStatusLabel(label: string | undefined | null): boolean {
  const raw = (label ?? "").trim().toLowerCase();
  return raw === "running" || raw === "working";
}

/** FNV-1a 32-bit — stable, dependency-free string hash for the seed. */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// XO: үгсийн сан (модулийн массив) англиар үлдэнэ; харуулах үед орчуулна. en дээр tx англи түлхүүрээ буцаана.
function xoWhimsyLabel(english: string): string {
  switch (english) {
    case "Clipping": return tx("Clipping");
    case "Organizing": return tx("Organizing");
    case "Sorting": return tx("Sorting");
    case "Synthesizing": return tx("Synthesizing");
    case "Analyzing": return tx("Analyzing");
    case "Filing": return tx("Filing");
    case "Collating": return tx("Collating");
    case "Stapling": return tx("Stapling");
    case "Indexing": return tx("Indexing");
    case "Annotating": return tx("Annotating");
    case "Drafting": return tx("Drafting");
    case "Proofreading": return tx("Proofreading");
    case "Alphabetizing": return tx("Alphabetizing");
    case "Photocopying": return tx("Photocopying");
    case "Laminating": return tx("Laminating");
    case "Hole-punching": return tx("Hole-punching");
    case "Bookmarking": return tx("Bookmarking");
    case "Highlighting": return tx("Highlighting");
    case "Typing": return tx("Typing");
    case "Trimming": return tx("Trimming");
    case "Aligning": return tx("Aligning");
    case "Combining": return tx("Combining");
    case "Whiteboarding": return tx("Whiteboarding");
    case "Diagramming": return tx("Diagramming");
    case "Sketching": return tx("Sketching");
    case "Labeling": return tx("Labeling");
    case "Sticky-noting": return tx("Sticky-noting");
    case "Brewing": return tx("Brewing");
    case "Tinkering": return tx("Tinkering");
    case "Distilling": return tx("Distilling");
    case "Deliberating": return tx("Deliberating");
    default: return english;
  }
}

/**
 * Deterministic whimsical word: the seed fixes the starting offset into the
 * pool and each elapsed `WHIMSY_ROTATE_MS` advances one word. Same seed and
 * elapsed always yield the same word.
 */
export function whimsyWord(seed: string, elapsedMs = 0): string {
  const tick = Math.floor(Math.max(0, elapsedMs) / WHIMSY_ROTATE_MS);
  return xoWhimsyLabel(WHIMSY_WORDS[(fnv1a(seed) + tick) % WHIMSY_WORDS.length]);
}
