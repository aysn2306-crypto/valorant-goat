// ay's assembled voiceover: line and word times from voiceover-timing.json, so every graphic lands on its word
// whichever take ends up in the assembly.
import TM from "./vo-timing.json";
type Line = { line: string; start: number; end: number; words: { w: string; start: number }[] };
export const VO_LINES = (TM as unknown as { lines: Line[] }).lines;
export const VO_DURATION = (TM as unknown as { duration: number }).duration;
export const L = (id: string) => { const l = VO_LINES.find((x) => x.line === id); if (!l) throw new Error("no line " + id); return l; };
/** voiceover time of the n-th word in a line that starts with `w` (punctuation ignored) */
export const W = (id: string, w: string, n = 0) => {
  const hits = L(id).words.filter((x) => x.w.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(w.toLowerCase()));
  if (!hits[n]) throw new Error(`no word ${w} in line ${id}`);
  return hits[n].start;
};
