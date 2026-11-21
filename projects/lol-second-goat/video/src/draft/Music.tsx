// ay's own backing tracks (Suno, 21 Nov 03:10): Buant Groove under the intro and build-up, Late Night Groove from the
// categories (line 43) to the end, crossfaded at that chapter break. Loops are pre-built with ffmpeg (tails trimmed,
// 4 s crossfades) into public/_local/music, which stays out of the public repo.
// Low under the voice and ducked while ay talks; Jxmy-style drop-outs to silence before the big reveals.
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { L, VO_LINES, W } from "../data/vo";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const db = (x: number) => Math.pow(10, x / 20);

// level in the gaps between lines, and under the voice (tracks are about -14 and -16 LUFS; voice is mastered to -14)
const A = { file: "_local/music/Buant_Groove_loop.wav", gap: db(-16), voice: db(-22) };
const B = { file: "_local/music/Late_Night_Groove_loop.wav", gap: db(-14.5), voice: db(-20.5) };
const XFADE = 3; // seconds, centred on the chapter break

// [silent from (voice time), music back from (voice time)]: fade out over 0.6 s so it is silent on the line, back over 2 s
// ay 21 Nov 14:36: on the long climb up the trophy cabinet to Faker (lines 53 to 55) the beat cuts out as the camera
// climbs, "final boss" music hits the moment it reaches Faker, and the normal beat comes back when that panel ends
// (line 56). Only this graph. The boss track is ay's pick: set BOSS to its file in public/_local/music when it lands.
// Until then the climb is silent and the beat comes back on Faker. Climb timing mirrors ClimbRemap in Draft.tsx.
type Boss = { file: string; gain: number; voice: number };
const BOSS = null as Boss | null;
const climb = () => { const c0 = W("53", "name") + 8 / 30; return { c0, hit: c0 + 79 / 30, end: L("56").start }; };
const dropOuts = (): [number, number][] => [
  ((c) => [c.c0 + 0.6, BOSS ? c.end : c.hit] as [number, number])(climb()), // fade starts as the climb starts
  [W("61", "but"), L("64").start],     // Monte Carlo result: second in all 1,000 too
  [L("71").start, L("74").start + 0.4], // the GOAT reveal: Chovy, then Knight
  [L("80").start, L("81").start],      // Knight mid-gapped Chovy
  [L("85").start, L("86").start],      // young Faker alone is the greatest
  [L("93").start, L("94").start],      // what Knight and Chovy would need
];

const smooth = (x: number) => x * x * (3 - 2 * x);

/** per-frame gain envelope on the video timeline */
const buildEnvelope = (lead: number, total: number) => {
  const n = total;
  // speech mask, then a one-pole smoother: fast attack under the voice, slow release in the gaps
  const talk = new Float32Array(n);
  for (const l of VO_LINES) for (let f = fr(lead + l.start - 0.15); f < fr(lead + l.end + 0.25); f++) if (f >= 0 && f < n) talk[f] = 1;
  const duck = new Float32Array(n);
  let y = 0;
  for (let f = 0; f < n; f++) { const k = talk[f] > y ? 0.35 : 0.06; y += (talk[f] - y) * k; duck[f] = y; }
  const drops = dropOuts().map(([a, b]) => [lead + a, lead + b]);
  const dropGain = (t: number) => drops.reduce((g, [a, b]) => {
    if (t >= a - 0.6 && t < a) return Math.min(g, 1 - smooth((t - (a - 0.6)) / 0.6));
    if (t >= a && t < b) return 0;
    if (t >= b && t < b + 2) return Math.min(g, smooth((t - b) / 2));
    return g;
  }, 1);
  return { duck, dropGain };
};

export const Music: React.FC<{ lead: number; total: number }> = ({ lead, total }) => {
  const env = React.useMemo(() => buildEnvelope(lead, total), [lead, total]);
  const brk = lead + L("43").start - 0.8; // crossfade sits in the pause before line 43
  const t0 = lead; // music comes in as the caster fades and ay starts
  const end = total / FPS;
  const vol = (trk: typeof A, f: number, which: "a" | "b") => {
    const t = f / FPS;
    const d = env.duck[Math.min(f, env.duck.length - 1)] ?? 0;
    let g = trk.gap + (trk.voice - trk.gap) * d;
    g *= env.dropGain(t);
    g *= smooth(Math.min(1, Math.max(0, (t - t0) / 1.5))); // fade in
    g *= smooth(Math.min(1, Math.max(0, (end - t) / 3))); // fade out at the very end
    const x = smooth(Math.min(1, Math.max(0, (t - (brk - XFADE / 2)) / XFADE)));
    return g * (which === "a" ? 1 - x : x);
  };
  const cl = climb();
  const boss = (f: number) => {
    if (!BOSS) return 0;
    const t = f / FPS, hit = lead + cl.hit, out = lead + cl.end;
    const d = env.duck[Math.min(f, env.duck.length - 1)] ?? 0;
    const g = BOSS.gain + (BOSS.voice - BOSS.gain) * d;
    return t < hit ? 0 : g * smooth(Math.min(1, Math.max(0, (out - t) / 1.5)));
  };
  const aFrom = fr(t0), bFrom = fr(brk - XFADE / 2);
  return <>
    <Sequence from={aFrom} durationInFrames={fr(brk + XFADE / 2) - aFrom + 1} name="music A">
      <Audio src={staticFile(A.file)} volume={(f) => vol(A, f + aFrom, "a")} />
    </Sequence>
    <Sequence from={bFrom} durationInFrames={total - bFrom} name="music B">
      <Audio src={staticFile(B.file)} volume={(f) => vol(B, f + bFrom, "b")} />
    </Sequence>
    {BOSS && <Sequence from={fr(lead + cl.hit)} durationInFrames={fr(cl.end - cl.hit) + 1} name="boss music">
      <Audio src={staticFile(BOSS.file)} volume={(f) => boss(f + fr(lead + cl.hit))} />
    </Sequence>}
  </>;
};
