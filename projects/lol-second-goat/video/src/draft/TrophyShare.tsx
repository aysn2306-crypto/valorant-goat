// Lines 15b and 15d (v15.3, ay 20 Nov 23:09): how much of the score trophies get is a judgement call. One score bar; the
// gold trophy share swings while ay says there's no right answer, then settles on 30% when he says "30%".
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", GOLD = "#E8B04B";

export const TrophyShare: React.FC<{ swingAt: number; settleAt: number }> = ({ swingAt, settleAt }) => {
  const f = useCurrentFrame();
  const x0 = 210, W = 1500, y = 470, h = 130;
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  // swing between about 15% and 55% while it's "subjective", then ease to 30% on "30%"
  const swing = f < swingAt ? 0 : interpolate(f, [swingAt, swingAt + 12], [0, 1], clamp);
  const wobble = 35 + 20 * Math.sin(((f - swingAt) / 30) * Math.PI * 0.9) * swing;
  const k = interpolate(f, [settleAt, settleAt + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const share = f < settleAt ? (f < swingAt ? 35 : wobble) : wobble * (1 - k) + 30 * k;
  const settled = k > 0.95;
  return (
    <AbsoluteFill style={{ opacity: inO }}>
      <Concrete />
      <div style={{ position: "absolute", left: x0, top: y - 90, fontFamily: BEBAS, fontSize: 52, letterSpacing: 3, color: INK }}>THE SCORE</div>
      <div style={{ position: "absolute", left: x0, top: y, width: W, height: h, background: "rgba(242,242,238,0.10)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${share}%`, background: GOLD }} />
        <div style={{ position: "absolute", left: `${share}%`, top: -14, bottom: -14, width: 4, marginLeft: -2, background: INK }} />
      </div>
      <div style={{ position: "absolute", left: x0, top: y + h + 24, fontFamily: BEBAS, fontSize: 64, color: GOLD, letterSpacing: 2 }}>
        TROPHIES {Math.round(share)}%</div>
      <div style={{ position: "absolute", left: x0 + W - 700, width: 700, textAlign: "right", top: y + h + 24, fontFamily: BEBAS, fontSize: 64, color: settled ? INK : MUTE, letterSpacing: 2 }}>
        EVERYTHING ELSE {100 - Math.round(share)}%</div>
    </AbsoluteFill>
  );
};
