// Does the model work? From Jxmy's percent stack (video-research/jxmy-graphs/videos/XMaPrXzclaQ/graphs/
// g08_callout-cards_millionaire-lifeline-percent-stack, his GOAT-list video): a small header top left, then one row per
// method that lands on its word: a circled icon pops, a short line draws out from it, the percent types in beside it.
// His right-hand panel shows the question; ours shows the same percent as 100 All-Pro picks, the right ones lit.
// Made in our look. Data: model v13 back-test (random 12%, pick the winning teams 58%, the model 63%).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";

const ICONS: Record<string, React.ReactNode> = {
  dice: <g><rect x={14} y={14} width={44} height={44} rx={8} fill="none" stroke={INK} strokeWidth={4} />
    {[[26, 26], [46, 26], [36, 36], [26, 46], [46, 46]].map(([x, y]) => <circle key={x + "-" + y} cx={x} cy={y} r={4} fill={INK} />)}</g>,
  trophy: <path d="M22 16h28v10c0 9-6 15-14 15s-14-6-14-15zM16 19h6v6c-4 0-6-2-6-6zM56 19h-6v6c4 0 6-2 6-6zM32 41h8v7h6v6H26v-6h6z" fill={INK} />,
  model: <g fill="none" stroke={INK} strokeWidth={4}><rect x={20} y={20} width={32} height={32} rx={4} />
    {[28, 36, 44].map((v) => <g key={v}><path d={`M${v} 12v8M${v} 52v8M12 ${v}h8M52 ${v}h8`} /></g>)}<rect x={29} y={29} width={14} height={14} fill={INK} stroke="none" /></g>,
};

export type PRow = { icon: keyof typeof ICONS; label: string; pct: number; at: number; accent?: boolean };

/** cues (optional, frames in the scene): the empty grid is up from the start; at `votes` all 100 light (the real
 *  All-Pro picks), they go dark again at `hide` (hidden from the model) and the header comes in at `ask` */
export const PercentStack: React.FC<{ header: string; rows: PRow[]; cues?: { votes: number; hide: number; ask: number } }> = ({ header, rows, cues }) => {
  const f = useCurrentFrame();
  // the grid shows the newest row that has landed
  let cur = -1; rows.forEach((r, i) => { if (f >= r.at) cur = i; });
  const fill = cur < 0 ? 0 : Math.round(interpolate(f, [rows[cur].at + 6, rows[cur].at + 26], [cur > 0 ? rows[cur - 1].pct : 0, rows[cur].pct], clamp));
  const gx = 1120, gy = 250, cell = 54, gap = 8;
  const gridO = interpolate(f, [0, 8], [0, 1], clamp);
  const votes = cues ? interpolate(f, [cues.votes, cues.votes + 18, cues.hide, cues.hide + 12], [0, 1, 1, 0], clamp) : 0;
  const askO = cues ? interpolate(f, [cues.ask, cues.ask + 8], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 110, top: 120, fontFamily: BEBAS, fontSize: 46, letterSpacing: 2, color: MUTE, opacity: askO }}>{header}</div>
      {/* before the rows: the question, big, on the left */}
      {cues && <div style={{ position: "absolute", left: 110, top: 360, fontFamily: BEBAS, fontSize: 150, lineHeight: 0.9, letterSpacing: 2, color: INK,
        opacity: gridO * (1 - askO) }}>IS THE<br />MODEL RIGHT?</div>}
      {rows.map((r, i) => {
        const o = interpolate(f, [r.at, r.at + 6], [0, 1], { ...clamp, easing: easeOut });
        const line = interpolate(f, [r.at + 4, r.at + 12], [0, 1], clamp);
        const chars = Math.floor(interpolate(f, [r.at + 10, r.at + 18], [0, String(r.pct).length + 1], clamp));
        const y = 250 + i * 210;
        const col = r.accent ? TEAL : INK;
        return (
          <div key={r.label} style={{ position: "absolute", left: 110, top: y, opacity: o }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, border: `4px solid ${r.accent ? TEAL : "rgba(242,242,238,0.6)"}`, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${0.7 + 0.3 * o})` }}>
              <svg width={72} height={72} viewBox="0 0 72 72">{ICONS[r.icon]}</svg>
            </div>
            <div style={{ position: "absolute", left: 140, top: 58, width: 70 * line, height: 4, background: col }} />
            <div style={{ position: "absolute", left: 230, top: -6, fontFamily: BEBAS, fontSize: 124, color: col, whiteSpace: "nowrap" }}>{(r.pct + "%").slice(0, chars)}</div>
            <div style={{ position: "absolute", left: 560, top: 40, fontFamily: BEBAS, fontSize: 40, letterSpacing: 1.5, color: MUTE, whiteSpace: "nowrap", opacity: line }}>{r.label}</div>
          </div>
        );
      })}
      {/* 100 picks, the right ones lit */}
      <div style={{ position: "absolute", left: gx, top: gy - 80, fontFamily: BEBAS, fontSize: 38, letterSpacing: 1.5, color: MUTE, opacity: gridO }}>100 ALL-PRO PICKS</div>
      {Array.from({ length: 100 }, (_, k) => {
        const on = k < fill;
        return <div key={k} style={{ position: "absolute", left: gx + (k % 10) * (cell + gap), top: gy + Math.floor(k / 10) * (cell + gap), width: cell, height: cell, borderRadius: 6,
          background: on ? (cur >= 0 && rows[cur].accent ? TEAL : INK) : `rgba(242,242,238,${0.08 + 0.84 * votes * Math.min(1, Math.max(0, votes * 1.6 - (k % 10 + Math.floor(k / 10)) / 30))})`,
          opacity: gridO }} />;
      })}
    </AbsoluteFill>
  );
};
