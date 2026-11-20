// One trophy split five ways (ay 19 Nov: share = how each player played across the whole tournament, every game counts).
// ay 20 Nov: the pie was "terrible" and its whole-number shares added to 101. Rebuilt as one bar that IS the trophy
// (100%), cut into five pieces as the line is said, over the BLG lift. Shares to one decimal so they add to 100.0.
// Data: model v14 title credit for BLG at Worlds 2026 (stills.json blgCredit / data/csv/title_credits.csv).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Clip } from "./Clip";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const SEG = ["#5E6670", "#747C86"];

// role order, top to support, so nobody reads the order as a ranking
const SHARES: [string, number][] = [["bin", 0.988], ["xun", 1.027], ["knight", 1.061], ["viper", 0.983], ["on", 0.941]];

/** `cues` are frames inside the scene: bar in, cut into five, shares written, caption */
export const TrophySplit: React.FC<{ cues: { photos: number; pie: number; shares: number; caption: number } }> = ({ cues }) => {
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
      <Clip id="lift" from={20} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: BEBAS, fontSize: 96, letterSpacing: 3, color: INK, opacity: barIn }}>
        ONE TROPHY, FIVE PLAYERS</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: MUTE, opacity: pop(cues.caption) }}>
        BLG AT WORLDS 2026 · SHARE OF THE TITLE · EVERY GAME OF THE TOURNAMENT COUNTS</div>
      {/* the whole trophy first, then the cuts open up */}
      {SHARES.map(([id], i) => {
        const w = (pct[i] / 100) * W, x = X0 + (acc / 100) * W; acc += pct[i];
        const gap = 10 * cut;
        const lit = id === "knight";
        const o = pop(cues.shares + i * 4);
        return (
          <React.Fragment key={id}>
            <div style={{ position: "absolute", left: x + gap / 2, top: Y, width: Math.max(0, w - gap), height: H, background: cut > 0.5 && lit ? TEAL : (cut < 0.05 ? SEG[0] : SEG[i % 2]),
              clipPath: `inset(0 ${Math.max(0, Math.min(100, ((x + w - (X0 + W * barIn)) / Math.max(1, w - gap)) * 100))}% 0 0)` }} />
            <div style={{ position: "absolute", left: x, width: w, top: Y + 38, textAlign: "center", fontFamily: BEBAS, fontSize: 70, color: lit && cut > 0.5 ? "#10241F" : INK, opacity: o }}>
              {pct[i].toFixed(1)}%</div>
            <div style={{ position: "absolute", left: x, width: w, top: Y + H + 26, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `4px solid ${lit ? TEAL : INK}` }}>
                {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: lit ? TEAL : INK, marginTop: 8 }}>{P(id).name.toUpperCase()}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
