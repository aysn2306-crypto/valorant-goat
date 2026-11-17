import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, F } from "../theme";

export type Row = { name: string; team?: string; value: number; color?: string };

// Animated leaderboard. `before` order animates into `after` order at `reshuffleAt` frames,
// rows slide to their new rank and values count to their new number.
export const Leaderboard: React.FC<{
  title: string;
  subtitle?: string;
  before: Row[];
  after?: Row[];
  reshuffleAt?: number;
  unit?: string;
  goldTop?: number;
}> = ({ title, subtitle, before, after, reshuffleAt = 90, unit = "", goldTop = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowH = 92;
  const top = 250;
  const maxV = Math.max(...before.map((r) => r.value), ...(after ?? []).map((r) => r.value));
  const sh = after ? spring({ frame: frame - reshuffleAt, fps, config: { damping: 18, mass: 0.9 } }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", left: 140, top: 90, fontFamily: F.title, fontSize: 84, color: C.text,
        letterSpacing: 1, transform: `translateY(${interpolate(spring({ frame, fps }), [0, 1], [30, 0])}px)`,
        opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ position: "absolute", left: 144, top: 190, fontFamily: F.body, fontWeight: 500, fontSize: 30,
          color: C.muted, opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {subtitle}
        </div>
      )}
      {before.map((r, i) => {
        const j = after ? after.findIndex((a) => a.name === r.name) : i;
        const newRow = after?.[j];
        const rank = i + (j - i) * sh;
        const val = r.value + ((newRow?.value ?? r.value) - r.value) * sh;
        const enter = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 200 } });
        const barW = interpolate(enter, [0, 1], [0, (val / maxV) * 1050]);
        const moved = after ? i - j : 0;
        const accent = moved > 0 && sh > 0.05 ? C.mint : moved < 0 && sh > 0.05 ? C.red : r.color ?? C.cyan;
        const finalRank = Math.round(rank);
        const isGold = finalRank < goldTop;
        return (
          <div key={r.name} style={{ position: "absolute", left: 140, top: top + rank * rowH, height: rowH - 14,
            width: 1640, display: "flex", alignItems: "center", opacity: enter,
            transform: `translateX(${interpolate(enter, [0, 1], [-60, 0])}px)` }}>
            <div style={{ width: 80, fontFamily: F.title, fontSize: 52, color: isGold ? C.gold : C.muted }}>{finalRank + 1}</div>
            <div style={{ width: 300, fontFamily: F.title, fontSize: 46, color: C.text }}>
              {r.name}
              {r.team && <span style={{ fontFamily: F.body, fontSize: 22, color: C.muted, marginLeft: 12 }}>{r.team}</span>}
            </div>
            <div style={{ height: 54, width: barW, background: C.panel, borderRadius: 6, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: isGold ? C.gold : accent }} />
            </div>
            <div style={{ marginLeft: 22, fontFamily: F.body, fontWeight: 700, fontSize: 40, color: C.text,
              fontVariantNumeric: "tabular-nums" }}>
              {val.toFixed(1)}{unit}
            </div>
            {after && moved !== 0 && (
              <div style={{ marginLeft: 18, fontFamily: F.body, fontWeight: 800, fontSize: 30,
                color: moved > 0 ? C.mint : C.red, opacity: interpolate(sh, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>
                {moved > 0 ? `▲${moved}` : `▼${-moved}`}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
