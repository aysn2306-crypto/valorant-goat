// ay 20 Nov: the two twists on the original five-tier pyramid (Stills Pyramid), not the three-tier one, with the
// "LEAGUE G.O.A.T. PYRAMID" writing top left. Each state fills the tiers from that state's top 10 (1, 2, 4, 3 and
// tier 5 left empty); ranks on the badges are that state's ranks. States change with a quick cross-fade.
// Orders: Graphics.tsx ORDER_2026 / ORDER_2025 / ORDER_GENG (model v14.1).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PyramidOld } from "../stills/Stills";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const tiersOf = (order: string[]) => [order.slice(0, 1), order.slice(1, 3), order.slice(3, 7), order.slice(7, 10), []];
const ranksOf = (order: string[]) => Object.fromEntries(order.map((id, i) => [id, i + 1]));

export const PyramidStates: React.FC<{ states: { at: number; order: string[]; label: string }[]; glowIds?: string[] }> = ({ states, glowIds = [] }) => {
  const f = useCurrentFrame();
  let si = 0;
  states.forEach((s, i) => { if (f >= s.at) si = i; });
  return (
    <AbsoluteFill>
      {states.map((s, i) => {
        if (i !== si && i !== si - 1) return null;
        const o = i === si ? (i === 0 ? 1 : interpolate(f, [s.at, s.at + 10], [0, 1], clamp)) : 1;
        return (
          <AbsoluteFill key={i} style={{ opacity: o }}>
            {/* ay 20 Nov 15:28: only the top matters in the swaps, so the camera holds on tiers 1 to 3 (tiers 4 and 5 off screen) */}
            <PyramidOld tiers={tiersOf(s.order)} ranks={ranksOf(s.order)} label={s.label} glowIds={si > 0 ? glowIds : []} cam={{ x: 960, y: 360, s: 1.85 }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
