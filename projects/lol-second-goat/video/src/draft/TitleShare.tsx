// ay 20 Nov 12:27: viewers must not see ON ranked lowest on BLG (fans saw him as the series MVP; engages and picks don't
// show in box scores). So this explains the idea without naming or ranking anyone: one bar is the trophy, it splits
// into five equal pieces ("an even split"), then the pieces resize to an EXAMPLE split (made-up sizes, no players,
// no numbers on the pieces) to show that each player's slice depends on how he played. The model is unchanged.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const SEG = ["#5E6670", "#747C86"];
const EXAMPLE = [23, 18, 21, 16, 22]; // illustrative only, not BLG

/** cues (frames in the scene): bar in, cut into five, resize to the example split */
export const TitleShare: React.FC<{ cues: { bar: number; cut: number; vary: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const X0 = 210, W = 1500, Y = 470, H = 150;
  const barIn = interpolate(f, [cues.bar, cues.bar + 16], [0, 1], { ...clamp, easing: easeOut });
  const cut = interpolate(f, [cues.cut, cues.cut + 18], [0, 1], { ...clamp, easing: inOut });
  const vary = interpolate(f, [cues.vary, cues.vary + 30], [0, 1], { ...clamp, easing: inOut });
  const pct = EXAMPLE.map((e) => 20 + (e - 20) * vary);
  const lab = (a: number) => interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
  let acc = 0;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: BEBAS, fontSize: 96, letterSpacing: 3, color: INK, opacity: barIn }}>
        ONE TROPHY, FIVE PLAYERS</div>
      <div style={{ position: "absolute", left: X0, width: W, top: Y - 60, fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: MUTE, opacity: barIn }}>
        {cut < 0.5 ? "THE WHOLE TITLE" : vary < 0.5 ? "AN EVEN SPLIT" : "EXAMPLE: EACH SLICE SIZED BY HOW HE PLAYED"}</div>
      {pct.map((p, i) => {
        const w = (p / 100) * W, x = X0 + (acc / 100) * W; acc += p;
        const gap = 12 * cut;
        return (
          <div key={i} style={{ position: "absolute", left: x + gap / 2, top: Y, width: Math.max(0, w - gap), height: H,
            background: cut < 0.05 ? TEAL : SEG[i % 2],
            clipPath: `inset(0 ${Math.max(0, Math.min(100, ((x + w - (X0 + W * barIn)) / Math.max(1, w - gap)) * 100))}% 0 0)` }} />
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: Y + H + 60, textAlign: "center", fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK, opacity: lab(cues.vary + 20) }}>
        EVERY GAME OF THE TOURNAMENT COUNTS</div>
    </AbsoluteFill>
  );
};
