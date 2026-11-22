// Two-player stat board, from Jxmy's head-to-head (video-research/jxmy-graphs/videos/GPH4nK5sQ-8/graphs/
// g01_head-to-head_box-score-stats-two-player-board): a tall player panel at each edge, a centre column of stat rows
// (left value, stat name, right value) with a check beside the better value; the board snaps in and holds.
// Made in our look: dark slate ground, Bebas, the winner's checks in the accent. Data: model v13 (league.json stats,
// MODEL-CURRENT.md skill part).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";

export type H2HRow = { label: string; l: string; r: string; better: "l" | "r" | null; big?: boolean };

const Check: React.FC<{ on: boolean; o: number }> = ({ on, o }) => (
  <svg width={34} height={34} viewBox="0 0 34 34" style={{ opacity: on ? o : 0, flex: "none" }}>
    <circle cx={17} cy={17} r={16} fill={TEAL} />
    <path d="M9 17.5l5.5 5.5L25.5 11" fill="none" stroke="#10241F" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Panel: React.FC<{ id: string; side: "l" | "r"; o: number }> = ({ id, side, o }) => {
  const ph = P(id).photo;
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 470, [side === "l" ? "left" : "right"]: 0, background: "#262A33",
      transform: `translateX(${(1 - o) * (side === "l" ? -470 : 470)}px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: BEBAS, fontSize: 92, color: INK, letterSpacing: 2 }}>{P(id).name}</div>
      {ph && <Img src={staticFile(ph)} style={{ position: "absolute", bottom: 0, left: -40, width: 550, height: 550, objectFit: "cover", objectPosition: "50% 0%" }} />}
    </div>
  );
};

/** cues: frames in the scene. board snaps in at `in`; rows land one after another from `rows`; the last (big) row at `last` */
export const HeadToHead: React.FC<{ left: string; right: string; title: string; rows: H2HRow[]; cues: { in: number; rows: number; last: number } }> = ({ left, right, title, rows, cues }) => {
  const f = useCurrentFrame();
  const snap = interpolate(f, [cues.in, cues.in + 8], [0, 1], { ...clamp, easing: easeOut });
  const pop = (a: number) => interpolate(f, [a, a + 6], [0, 1], clamp);
  const x0 = 480, x1 = 1440; // council 22 Nov: wider middle so the stat names can be bigger on a phone
  return (
    <AbsoluteFill>
      <Concrete />
      <Panel id={left} side="l" o={snap} />
      <Panel id={right} side="r" o={snap} />
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 70, textAlign: "center", fontFamily: BEBAS, fontSize: 64, letterSpacing: 2, color: INK, opacity: snap }}>{title}</div>
      {rows.map((r, i) => {
        const a = r.big ? cues.last : cues.rows + i * 5;
        const o = pop(a);
        const y = r.big ? 830 : 220 + i * 92;
        const fs = r.big ? 96 : 60;
        return (
          <div key={r.label} style={{ position: "absolute", left: x0, width: x1 - x0, top: y, height: r.big ? 130 : 80, display: "flex", alignItems: "center",
            opacity: o, transform: `translateY(${(1 - o) * 10}px)`, borderTop: r.big ? `2px solid rgba(242,242,238,0.25)` : undefined, paddingTop: r.big ? 16 : 0 }}>
            <div style={{ width: 230, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
              <Check on={r.better === "l"} o={o} />
              <span style={{ fontFamily: BEBAS, fontSize: fs, color: r.better === "l" ? TEAL : INK }}>{r.l}</span>
            </div>
            <div style={{ flex: 1, textAlign: "center", fontFamily: BEBAS, fontSize: r.big ? 54 : 46, lineHeight: 1, letterSpacing: 1.5, color: "#C3C9D1" }}>{r.label}</div>
            <div style={{ width: 230, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: BEBAS, fontSize: fs, color: r.better === "r" ? TEAL : INK }}>{r.r}</span>
              <Check on={r.better === "r"} o={o} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
