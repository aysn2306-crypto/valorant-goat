// ay's outro (23 Nov, voice only, lines 101 to 105). After video-research/outros/OUTRO-STUDY.md: a short sign-off over a
// plain card (MachineLoLing's outro card), few words, each landing on its spoken word; the bed keeps playing (no drop);
// the end card with the Riot line comes in on "have a blessed day" and holds about 13 s for the YouTube end screen.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE", TEAL = "#3FD0B5", MUTE = "#9BA3AE";

export type OutroPage = { at: number; big: string; small?: string; smallAt?: number; face?: string };

export const OutroCard: React.FC<{ pages: OutroPage[] }> = ({ pages }) => {
  const f = useCurrentFrame();
  const cur = [...pages].reverse().find((p) => f >= p.at);
  if (!cur) return <AbsoluteFill><Concrete /></AbsoluteFill>;
  const k = interpolate(f, [cur.at, cur.at + 10], [0, 1], { ...clamp, easing: easeOut });
  const ks = cur.small ? interpolate(f, [cur.smallAt ?? cur.at, (cur.smallAt ?? cur.at) + 8], [0, 1], { ...clamp, easing: easeOut }) : 0;
  return (
    <AbsoluteFill>
      <Concrete />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
        {cur.face && <div style={{ width: 240, height: 240, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `6px solid ${TEAL}`,
          opacity: k, transform: `scale(${0.85 + 0.15 * k})` }}>
          {P(cur.face).photo && <Img src={staticFile(P(cur.face).photo!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>}
        <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.95, letterSpacing: 4, color: INK, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>{cur.big}</div>
        {cur.small && <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: TEAL, opacity: ks, transform: `translateY(${(1 - ks) * 10}px)` }}>{cur.small}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
