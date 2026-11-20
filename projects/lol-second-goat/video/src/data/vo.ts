// ay's assembled voiceover: line and word times from voiceover-timing.json, so every graphic lands on its word
// whichever take ends up in the assembly.
import TM from "./vo-timing.json";
type Line = { line: string; start: number; end: number; words: { w: string; start: number }[] };
const RAW = (TM as unknown as { lines: Line[] }).lines;
const RAW_DURATION = (TM as unknown as { duration: number }).duration;
// ay 20 Nov 14:36: lines cut from the scratch voice (36 "it doesn't know about kills or trophies", 50 the Peanut line).
// A cut removes the line and the pause after it; every time below is on the cut timeline, so cues need no changes.
export const CUT_LINES = ["36", "50"];
const CUTS = RAW.map((l, i) => CUT_LINES.includes(l.line) ? [l.start, i + 1 < RAW.length ? RAW[i + 1].start : RAW_DURATION] as [number, number] : null)
  .filter((c): c is [number, number] => !!c);
/** raw voiceover time -> time on the cut timeline */
export const vt = (t: number) => CUTS.reduce((acc, [a, b]) => acc - (t >= b ? b - a : t > a ? t - a : 0), t);
/** the kept stretches of the raw voiceover file, [raw start, raw end] */
export const VO_KEEP: [number, number][] = (() => {
  const out: [number, number][] = []; let s = 0;
  for (const [a, b] of CUTS) { if (a > s) out.push([s, a]); s = b; }
  out.push([s, RAW_DURATION]); return out;
})();
export const VO_LINES: Line[] = RAW.filter((l) => !CUT_LINES.includes(l.line))
  .map((l) => ({ ...l, start: vt(l.start), end: vt(l.end), words: l.words.map((w) => ({ ...w, start: vt(w.start) })) }));
export const VO_DURATION = vt(RAW_DURATION);
export const L = (id: string) => { const l = VO_LINES.find((x) => x.line === id); if (!l) throw new Error("no line " + id); return l; };
/** voiceover time of the n-th word in a line that starts with `w` (punctuation ignored) */
export const W = (id: string, w: string, n = 0) => {
  const hits = L(id).words.filter((x) => x.w.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(w.toLowerCase()));
  if (!hits[n]) throw new Error(`no word ${w} in line ${id}`);
  return hits[n].start;
};
/** first of several words that is in the line (for lines being re-recorded with new wording); falls back to the line start */
export const WA = (id: string, ws: string[], n = 0) => {
  for (const w of ws) { try { return W(id, w, n); } catch { /* try the next word */ } }
  return L(id).start;
};
/** exact word match (W matches word starts, so "on" would also hit "ones"); falls back to the line start */
export const WE = (id: string, w: string, n = 0) => {
  const hits = L(id).words.filter((x) => x.w.toLowerCase().replace(/[^a-z0-9]/g, "") === w.toLowerCase());
  return hits[n] ? hits[n].start : L(id).start;
};
