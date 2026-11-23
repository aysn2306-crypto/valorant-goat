// ay's own backing tracks (Suno, 21 Nov 03:10): Buant Groove under the intro and build-up, Late Night Groove from the
// categories (line 43) to the end, crossfaded at that chapter break. Loops are pre-built with ffmpeg (tails trimmed,
// 4 s crossfades) into public/_local/music, which stays out of the public repo.
// Low under the voice and ducked while ay talks; Jxmy-style drop-outs to silence before the big reveals.
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { HAS, L, VO_LINES, W, WA } from "../data/vo";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const db = (x: number) => Math.pow(10, x / 20);

// level in the gaps between lines, and under the voice (tracks are about -14 and -16 LUFS; voice is mastered to -14)
const A = { file: "_local/music/Buant_Groove_loop.wav", gap: db(-16), voice: db(-22) };
const B = { file: "_local/music/Late_Night_Groove_loop.wav", gap: db(-14.5), voice: db(-20.5) };
const XFADE = 3; // seconds, centred on the chapter break

// Drop-outs follow the Jxmy music-pause study (video-research/jxmy-sound/JXMY-SOUND-STUDY.md, section 5): cut on the
// word before the payoff, about 1 to 3 s of silence, back hard on the next sentence, a little louder after the big
// reveals. About 15 s of silence in the whole video instead of 60.
// ay 21 Nov 14:36: on the long climb up the trophy cabinet to Faker (lines 53 to 55) the "final boss" music hits on
// Faker and the normal beat comes back when that panel ends (line 56). Only this graph. Jxmy way (coordinator 15:39):
// the beat keeps playing on the way up, cut on the landing, about 1 s of silence, then the boss track slams in.
// The boss track is ay's pick: set BOSS to its file in public/_local/music when it lands. Until then the beat comes
// back after about 2 s of silence, fading up while the camera zooms out. Climb timing mirrors ClimbRemap in Draft.tsx.
type Boss = { file: string; gain: number; voice: number };
// ay 21 Nov 17:13: Elden Ring boss music from 4:14 of ay's pick (music/boss/boss-elden-414-12s.wav, about -8 LUFS)
const BOSS = { file: "_local/music/boss.wav", gain: db(-16), voice: db(-22) } as Boss | null;
const climb = () => { const c0 = W("53", "name") + 8 / 30; const hit = c0 + 79 / 30; return { c0, hit, boss: hit, end: L("56").start }; };
type Drop = { a: number; b: number; out: number; back: number; boost?: number };
const dropOuts = (): Drop[] => {
  const c = climb();
  return [
    // ay 21 Nov 17:07: the music stops on "But hold on" and stays out up the climb; on the landing (just after ay says
    // "Faker") the boss track hits; when the panel ends the boss fades out over 1 s while Late Night Groove fades back in.
    // With no boss track yet, the beat comes back on the landing, fading up while the camera zooms out.
    BOSS ? { a: W("53", "but") - 0.05, b: c.end, out: 0.1, back: 1 } : { a: W("53", "but") - 0.05, b: c.hit, out: 0.1, back: 4, boost: 4 },
    { a: WA("61", ["second", "2nd"]) - 0.1, b: L("63").start, out: 0.1, back: 0.05 },               // "second in all 1,000 too"
    { a: W("71", "second") - 0.1, b: W("71", "knight") + 0.5, out: 0.05, back: 0.05, boost: 5 }, // the GOAT reveal
    { a: W("81", "this") - 0.1, b: W("81", "cinema") + 0.6, out: 0.05, back: 0.05 },        // "this model is lowkey cinema" (moved after line 81)
    { a: W("85", "young") - 0.15, b: W("85", "ahead"), out: 0.05, back: 0.05 },            // young Faker alone is the greatest
    { a: W("93", "that") - 0.1, b: L("94").start, out: 0.1, back: 0.05 },
    // ay 22 Nov 20:53: the laugh moved from the quote to the last panel (when it shows the Worlds Guma needs); the music
    // stops for it there and comes back on the end card
    // ay 23 Nov 21:27: the music cuts on the vine boom and stays out while the minion points at Guma; it fades back in
    // softly as the outro starts (or stays out to the end when there is no outro)
    { a: WA("94", ["still", "long"]) + 26 / 30 - 0.05, b: HAS("101") ? L("101").start - 0.4 : 1e6, out: 0.05, back: 1.5 },
  ];
};

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
  const drops = dropOuts().map((d) => ({ ...d, a: lead + d.a, b: lead + d.b }));
  const dropGain = (t: number) => drops.reduce((g, d) => {
    if (t >= d.a - d.out && t < d.a) return Math.min(g, 1 - smooth((t - (d.a - d.out)) / d.out));
    if (t >= d.a && t < d.b) return 0;
    if (t >= d.b && t < d.b + d.back) return Math.min(g, smooth((t - d.b) / d.back));
    return g;
  }, 1);
  // back a little louder after a big reveal (+N dB, easing off over 4 s)
  const boost = (t: number) => drops.reduce((g, d) => d.boost && t >= d.b && t < d.b + 4
    ? g * Math.pow(10, (d.boost * (1 - smooth((t - d.b) / 4))) / 20) : g, 1);
  return { duck, dropGain, boost };
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
    g *= env.dropGain(t) * env.boost(t);
    g *= smooth(Math.min(1, Math.max(0, (t - t0) / 1.5))); // fade in
    g *= smooth(Math.min(1, Math.max(0, (end - t) / 3))); // fade out at the very end
    const x = smooth(Math.min(1, Math.max(0, (t - (brk - XFADE / 2)) / XFADE)));
    return g * (which === "a" ? 1 - x : x);
  };
  const cl = climb();
  const boss = (f: number) => {
    if (!BOSS) return 0;
    const t = f / FPS, hit = lead + cl.boss, out = lead + cl.end;
    const d = env.duck[Math.min(f, env.duck.length - 1)] ?? 0;
    const g = BOSS.gain + (BOSS.voice - BOSS.gain) * d;
    return t < hit ? 0 : g * smooth(Math.min(1, Math.max(0, (out + 1 - t) / 1))); // crossfades with Late Night Groove coming back
  };
  const aFrom = fr(t0), bFrom = fr(brk - XFADE / 2);
  return <>
    <Sequence from={aFrom} durationInFrames={fr(brk + XFADE / 2) - aFrom + 1} name="music A">
      <Audio src={staticFile(A.file)} volume={(f) => vol(A, f + aFrom, "a")} />
    </Sequence>
    <Sequence from={bFrom} durationInFrames={total - bFrom} name="music B">
      <Audio src={staticFile(B.file)} volume={(f) => vol(B, f + bFrom, "b")} />
    </Sequence>
    {BOSS && <Sequence from={fr(lead + cl.boss)} durationInFrames={fr(cl.end + 1 - cl.boss) + 1} name="boss music">
      <Audio src={staticFile(BOSS.file)} volume={(f) => boss(f + fr(lead + cl.boss))} />
    </Sequence>}
  </>;
};
