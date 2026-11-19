// LPL vs LCK kills per game, as Jxmy's line chart (video-research/jxmy-graphs/videos/WyYOm44eQyI/graphs/
// g06_line-chart_pace-by-year, strips p01-p06): a small boxed title top left, sparse axes, one thin neutral line for the
// whole span, then the line being talked about drawn over it in the accent, a short label under the part that matters.
// Made in our look. Data: stills.json kills (Oracle's Elixir, kills per game by league and year, 2016-2026).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import S from "../data/stills.json";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.45, 0, 0.55, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";

/** cues (frames in the scene): first line draws, accent line draws, the gap label */
export const KillsLine: React.FC<{ cues: { lck: number; lpl: number; gap: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const K = S.kills as Record<string, Record<string, number>>;
  const all = S.killsAll as Record<string, number>;
  const x0 = 260, x1 = 1680, y0 = 880, y1 = 260, v0 = 16, v1 = 32;
  const X = (yr: number) => x0 + ((yr - 2016) / 10) * (x1 - x0);
  const Y = (v: number) => y0 - ((v - v0) / (v1 - v0)) * (y0 - y1);
  const pts = (rg: string) => Object.entries(K[rg]).map(([y, v]) => [X(Number(y)), Y(v)] as [number, number]);
  const len = (p: [number, number][]) => p.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
  const line = (rg: string, k: number, col: string, w: number) => {
    const p = pts(rg), L = len(p);
    return <path d={"M " + p.map((q) => q.join(",")).join(" L ")} fill="none" stroke={col} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round"
      strokeDasharray={L} strokeDashoffset={L * (1 - k)} />;
  };
  const kA = interpolate(f, [cues.lck, cues.lck + 40], [0, 1], { ...clamp, easing: inOut });
  const kB = interpolate(f, [cues.lpl, cues.lpl + 40], [0, 1], { ...clamp, easing: inOut });
  const g = interpolate(f, [cues.gap, cues.gap + 10], [0, 1], clamp);
  const axesO = interpolate(f, [0, 8], [0, 1], clamp);
  const endL = (rg: string) => { const p = pts(rg); return p[p.length - 1]; };
  return (
    <AbsoluteFill>
      <Concrete />
      {/* boxed title, Jxmy's white tag top left */}
      <div style={{ position: "absolute", left: 110, top: 80, opacity: axesO }}>
        <div style={{ display: "inline-block", background: INK, color: "#1B1E25", fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, padding: "4px 18px" }}>THE LPL FIGHTS MORE</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE, marginTop: 8 }}>KILLS PER GAME, BOTH TEAMS, BY YEAR</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: axesO }}>
        <line x1={x0 - 30} x2={x0 - 30} y1={y1 - 20} y2={y0 + 10} stroke={INK} strokeOpacity={0.6} strokeWidth={3} />
        <line x1={x0 - 30} x2={x1 + 30} y1={y0 + 10} y2={y0 + 10} stroke={INK} strokeOpacity={0.6} strokeWidth={3} />
        {[16, 20, 24, 28, 32].map((v) => <g key={v}>
          <line x1={x0 - 30} x2={x1 + 30} y1={Y(v)} y2={Y(v)} stroke={INK} strokeOpacity={0.08} strokeWidth={2} />
          <text x={x0 - 48} y={Y(v) + 12} textAnchor="end" fontFamily={BEBAS} fontSize={36} fill={MUTE}>{v}</text></g>)}
        {[2016, 2018, 2020, 2022, 2024, 2026].map((y) => <text key={y} x={X(y)} y={y0 + 58} textAnchor="middle" fontFamily={BEBAS} fontSize={36} fill={MUTE}>{y}</text>)}
      </svg>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* average gap band, once both lines are down */}
        <rect x={x0} width={x1 - x0} y={Y(all.LPL)} height={Y(all.LCK) - Y(all.LPL)} fill={TEAL} opacity={0.12 * g} />
        <line x1={x0} x2={x1} y1={Y(all.LPL)} y2={Y(all.LPL)} stroke={TEAL} strokeOpacity={0.7 * g} strokeWidth={2} strokeDasharray="10 10" />
        <line x1={x0} x2={x1} y1={Y(all.LCK)} y2={Y(all.LCK)} stroke={INK} strokeOpacity={0.5 * g} strokeWidth={2} strokeDasharray="10 10" />
        {line("LCK", kA, "rgba(242,242,238,0.75)", 4)}
        {line("LPL", kB, TEAL, 7)}
      </svg>
      {/* line names at their ends */}
      {(["LCK", "LPL"] as const).map((rg) => { const [x, y] = endL(rg); const k = rg === "LCK" ? kA : kB;
        return <div key={rg} style={{ position: "absolute", left: x + 26, top: y - (rg === "LPL" ? 62 : 6), fontFamily: BEBAS, fontSize: 48, letterSpacing: 2,
          color: rg === "LPL" ? TEAL : INK, opacity: k > 0.97 ? 1 : 0 }}>{rg}</div>; })}
      {/* the gap, Jxmy's small label under the part that matters */}
      <div style={{ position: "absolute", left: X(2021.6) - 200, width: 400, top: Y(20.6), textAlign: "center", opacity: g,
        fontFamily: BEBAS, fontSize: 50, letterSpacing: 2, color: TEAL }}>+{(all.LPL - all.LCK).toFixed(0)} KILLS A GAME</div>
      <div style={{ position: "absolute", left: X(2021.6) - 300, width: 600, top: Y(20.6) + 58, textAlign: "center", opacity: g,
        fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>AVERAGE {all.LPL} VS {all.LCK}, 2016 TO 2026</div>
    </AbsoluteFill>
  );
};
