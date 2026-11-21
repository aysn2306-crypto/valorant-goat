// One trophy split five ways (ay 19 Nov: share = how each player played across the whole tournament, every game counts).
// ay 20 Nov: the pie was "terrible" and its whole-number shares added to 101. Rebuilt as one bar that IS the trophy
// (100%), cut into five pieces as the line is said, over the BLG lift. Shares to one decimal so they add to 100.0.
// ay 20 Nov 19:16: IG at Worlds 2018 instead of BLG (script 27/27b). Data: model v15.2 title credit, data/csv/
// title_credits.csv (Rookie 1.039, TheShy 1.028, Baolan 0.999, JackeyLove 0.970, Ning 0.958 -> 20.8/20.6/20.0/19.4/19.2%).
// Photos: their IG 2018 Leaguepedia portraits (public/players/ig2018). Rookie lit on "Rookie"; on 27b Ning lit, FINALS MVP tag.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const SEG = ["#5E6670", "#747C86"];

// role order, top to support, so nobody reads the order as a ranking
const SHARES: [string, number][] = [["theshy", 1.0275622], ["ning", 0.9579728], ["rookie", 1.0385199], ["jackeylove", 0.9704338], ["baolan", 0.9988858]];

/** `cues` are frames inside the scene: bar in, cut into five, shares written, caption */
export const TrophySplit: React.FC<{ cues: { photos: number; pie: number; shares: number; caption: number; top?: number; mvp?: number; names?: Record<string, number> } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const total = SHARES.reduce((a, s) => a + s[1], 0);
  // one decimal, largest remainder, so the five always add to exactly 100.0
  const raw = SHARES.map(([, v]) => (v / total) * 1000);
  const fl = raw.map(Math.floor);
  let left = 1000 - fl.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - fl[i], i] as [number, number]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
  const pct = fl.map((v) => v / 10);
  const X0 = 210, W = 1500, Y = 520, H = 150;
  const barIn = interpolate(f, [cues.photos, cues.photos + 16], [0, 1], { ...clamp, easing: easeOut });
  const cut = interpolate(f, [cues.pie, cues.pie + 18], [0, 1], { ...clamp, easing: inOut });
  const pop = (a: number) => interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
  let acc = 0;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: BEBAS, fontSize: 96, letterSpacing: 3, color: INK, opacity: barIn }}>
        ONE TROPHY, FIVE PLAYERS</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: MUTE, opacity: pop(cues.caption) }}>
        IG AT WORLDS 2018 · SHARE FROM EACH PLAYER'S STATS · EVERY GAME OF THE TOURNAMENT COUNTS</div>
      {/* the whole trophy first, then the cuts open up */}
      {SHARES.map(([id], i) => {
        const w = (pct[i] / 100) * W, x = X0 + (acc / 100) * W; acc += pct[i];
        const gap = 10 * cut;
        const mvpOn = f >= (cues.mvp ?? 1e9);
        // ay 21 Nov 17:07: as each player is named (Rookie to Ning) the highlight moves to him, one at a time
        const named = cues.names ? Object.entries(cues.names).filter(([, t]) => f >= t).sort((a, b) => b[1] - a[1])[0]?.[0] : undefined;
        const lit = mvpOn ? id === "ning" : cues.names ? id === named : id === "rookie" && f >= (cues.top ?? 1e9);
        const o = pop(cues.shares); // ay 20 Nov 20:01: all five count up together, 0 to their share
        return (
          <React.Fragment key={id}>
            <div style={{ position: "absolute", left: x + gap / 2, top: Y, width: Math.max(0, w - gap), height: H, background: lit ? TEAL : (cut < 0.05 ? SEG[0] : SEG[i % 2]),
              clipPath: `inset(0 ${Math.max(0, Math.min(100, ((x + w - (X0 + W * barIn)) / Math.max(1, w - gap)) * 100))}% 0 0)` }} />
            <div style={{ position: "absolute", left: x, width: w, top: Y + 38, textAlign: "center", fontFamily: BEBAS, fontSize: 70, color: lit ? "#10241F" : INK, opacity: o }}>
              {(pct[i] * interpolate(f, [cues.shares, cues.shares + 30], [0, 1], { ...clamp, easing: easeOut })).toFixed(1)}%</div>
            <div style={{ position: "absolute", left: x, width: w, top: Y + H + 26, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `4px solid ${lit ? TEAL : INK}` }}>
                <Img src={staticFile(`players/ig2018/${id}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", background: "#E9E6DE" }} />
              </div>
              <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: lit ? TEAL : INK, marginTop: 8 }}>{P(id).name.toUpperCase()}</div>
              {id === "ning" && <div style={{ marginTop: 4, padding: "2px 12px", fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: "#0F1012", background: "#E8B04B", opacity: interpolate(f, [cues.mvp ?? 1e9, (cues.mvp ?? 1e9) + 8], [0, 1], clamp) }}>FINALS MVP</div>}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
