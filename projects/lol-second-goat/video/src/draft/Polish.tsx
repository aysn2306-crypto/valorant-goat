// Polish pass (v19, 24 Nov 2026): the new graphics for ay's notes on the final. Same look as the rest of the video
// (Concrete ground, Bebas Neue, INK and TEAL, gold only for trophies). Built from these reference frames:
// - Roadmap: 3Blue1Brown's chapter preview (chart-refs-2/02-3blue1brown-binomial-probabilities, 01:00-01:35, items lit
//   one at a time, the rest at 25%) and Thinking Basketball's section cards (chart-refs-2/01, 05:12, 08:16).
// - RecipeBar: our own TrophyShare bar (locked swing on "subjective", settles on 30%), then the rest of the bar splits
//   into the five other parts on their spoken numbers, like MachineLoLing's stacked 100% bars (chart-refs-2026-11-18/01,
//   12:58-13:31, segment labels).
// - WeightFaders: MachineLoLing's formula board with the term being talked about boxed (chart-refs-2, "Look rules"):
//   the six weights as faders that wobble while ay says they're his choices.
// - SourceNote: ZeKay and Jxmy name the source on screen as it is said (rival-ai-video/RIVAL-STUDY.md "Sources").
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", GOLD = "#E8B04B", TEAL = "#3FD0B5";

/** "So here's how this is gonna go": three steps, each lights on its word, the others drop to 35%. v19b: the
 *  winners come with each part, so step 1 is the six parts; `cur` forces the lit step (held under "here's the recipe") */
export const Roadmap: React.FC<{ at: [number, number, number]; cur?: number }> = ({ at, cur: force }) => {
  const f = useCurrentFrame();
  const items = ["THE SIX PARTS", "HOW SURE WE CAN BE", "THE G.O.A.T. PYRAMID"];
  const cur = force ?? at.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 360, top: 250, display: "flex", flexDirection: "column", gap: 54 }}>
        {items.map((t, i) => {
          const k = interpolate(f, [at[i], at[i] + 8], [0, 1], { ...clamp, easing: easeOut });
          const lit = i === cur ? 1 : 0.35;
          return (
            <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 40, opacity: k * lit, transform: `translateX(${(1 - k) * -30}px)` }}>
              <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 1, color: i === cur ? TEAL : INK, width: 110, textAlign: "right" }}>{i + 1}</div>
              <div style={{ fontFamily: BEBAS, fontSize: 104, lineHeight: 1, letterSpacing: 4, color: INK }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** a short source line at the foot of a card ("where the data comes from"), in on its word */
export const SourceNote: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const k = interpolate(useCurrentFrame(), [at, at + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: BEBAS, fontSize: 46, letterSpacing: 4,
      color: MUTE, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>{text}</div>
  );
};

/** the six weights. Phase 1 = the locked TrophyShare swing (subjective) and settle on 30%; phase 2 = the rest splits
 *  into the five other parts, each on its spoken number. Numbers from MODEL-CURRENT v15.3. */
const PARTS: { name: string; w: number; color: string }[] = [
  { name: "SKILL", w: 21, color: "#5B8DEF" }, { name: "BIG GAMES + CLUTCH", w: 16.3, color: TEAL },
  { name: "TEAM IMPACT", w: 14, color: "#B58CEB" }, { name: "LONGEVITY", w: 10.5, color: "#8E97A3" }, { name: "RECOGNITION", w: 8.2, color: "#D9A0A0" }];
export const RecipeBar: React.FC<{ swingAt: number; settleAt: number; splitAt: number[] }> = ({ swingAt, settleAt, splitAt }) => {
  const f = useCurrentFrame();
  const x0 = 160, W = 1600, y = 430, h = 130;
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  const swing = f < swingAt ? 0 : interpolate(f, [swingAt, swingAt + 12], [0, 1], clamp);
  const wobble = 35 + 20 * Math.sin(((f - swingAt) / 30) * Math.PI * 0.9) * swing;
  const k = interpolate(f, [settleAt, settleAt + 18], [0, 1], { ...clamp, easing: easeOut });
  const share = f < settleAt ? (f < swingAt ? 35 : wobble) : wobble * (1 - k) + 30 * k;
  const split = PARTS.map((_, i) => interpolate(f, [splitAt[i], splitAt[i] + 10], [0, 1], { ...clamp, easing: easeOut }));
  const anySplit = split[0] > 0;
  let x = share;
  return (
    <AbsoluteFill style={{ opacity: inO }}>
      <Concrete />
      <div style={{ position: "absolute", left: x0, top: y - 90, fontFamily: BEBAS, fontSize: 52, letterSpacing: 3, color: INK }}>THE SCORE</div>
      <div style={{ position: "absolute", left: x0, top: y, width: W, height: h, background: "rgba(242,242,238,0.10)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${share}%`, background: GOLD }} />
        {PARTS.map((p, i) => { const l = x; x += p.w; return (
          <div key={p.name} style={{ position: "absolute", left: `${l}%`, top: 0, bottom: 0, width: `${p.w * split[i]}%`, background: p.color, borderLeft: "3px solid #0F1012" }} />); })}
        <div style={{ position: "absolute", left: `${share}%`, top: -14, bottom: -14, width: 4, marginLeft: -2, background: INK }} />
      </div>
      <div style={{ position: "absolute", left: x0, top: y + h + 24, fontFamily: BEBAS, fontSize: 64, color: GOLD, letterSpacing: 2 }}>
        TROPHIES {Math.round(share)}%</div>
      {!anySplit && <div style={{ position: "absolute", left: x0 + W - 700, width: 700, textAlign: "right", top: y + h + 24, fontFamily: BEBAS, fontSize: 64,
        color: k > 0.95 ? INK : MUTE, letterSpacing: 2 }}>EVERYTHING ELSE {100 - Math.round(share)}%</div>}
      {/* the five other parts: label above or below in turn so the narrow ones never collide */}
      {(() => { let xx = 30; return PARTS.map((p, i) => { const mid = xx + p.w / 2; xx += p.w; const up = i % 2 === 0;
        return <div key={p.name} style={{ position: "absolute", left: x0 + (mid / 100) * W - 200, width: 400, textAlign: "center",
          top: up ? y - 64 - (i === 0 ? 0 : 0) : y + h + 110, opacity: split[i], fontFamily: BEBAS, letterSpacing: 2, color: INK }}>
          <span style={{ fontSize: 40 }}>{p.name} </span><span style={{ fontSize: 48, color: p.color }}>{Math.round(p.w)}%</span></div>; }); })()}
    </AbsoluteFill>
  );
};

/** "the weights are my choices": six faders at the model's weights; they start drifting on `wobbleAt`, the trophy
 *  fader is boxed on `boxAt` ("remember that 30%") */
export const WeightFaders: React.FC<{ wobbleAt: number; boxAt: number }> = ({ wobbleAt, boxAt }) => {
  const f = useCurrentFrame();
  const all = [{ name: "TROPHIES", w: 30, color: GOLD }, ...PARTS];
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  const wob = interpolate(f, [wobbleAt, wobbleAt + 20], [0, 1], clamp);
  const box = interpolate(f, [boxAt, boxAt + 8], [0, 1], { ...clamp, easing: easeOut });
  const top = 250, bot = 820, max = 40, X = (i: number) => 330 + i * 252;
  const Y = (v: number) => bot - (v / max) * (bot - top);
  return (
    <AbsoluteFill style={{ opacity: inO }}>
      <Concrete />
      <div style={{ position: "absolute", left: 150, top: 110, fontFamily: BEBAS, fontSize: 64, letterSpacing: 4, color: INK }}>MY WEIGHTS</div>
      {all.map((p, i) => {
        const drift = wob * 6 * Math.sin((f / 30) * (1.3 + random("w" + i) * 1.4) + random("p" + i) * 6);
        const v = Math.max(3, p.w + drift);
        return (
          <React.Fragment key={p.name}>
            <div style={{ position: "absolute", left: X(i) - 4, top, width: 8, height: bot - top, background: "rgba(242,242,238,0.16)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: X(i) - 4, top: Y(v), width: 8, height: bot - Y(v), background: p.color, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: X(i) - 46, top: Y(v) - 18, width: 92, height: 36, background: INK, borderRadius: 6 }} />
            <div style={{ position: "absolute", left: X(i) - 120, width: 240, top: Y(v) - 82, textAlign: "center", fontFamily: BEBAS, fontSize: 54, color: p.color }}>{Math.round(v)}%</div>
            <div style={{ position: "absolute", left: X(i) - 125, width: 250, top: bot + 30, textAlign: "center", fontFamily: BEBAS, fontSize: 36, letterSpacing: 2, color: INK, lineHeight: 1.05 }}>{p.name}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: X(0) - 110, top: top - 120, width: 220, height: bot - top + 230, border: `5px solid ${TEAL}`, borderRadius: 10,
        opacity: box, transform: `scale(${0.94 + 0.06 * box})` }} />
    </AbsoluteFill>
  );
};
