import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { P } from "../lib/data";
import { Frame, Photo, pop, prog } from "../lib/ui";

/** Line chart over years. series: [{name, color, pts:[[x,y]], hi?}] drawn left to right from `at`. */
export const LineChart: React.FC<{ title: string; sub?: string; series: { name: string; color: string; pts: [number, number][]; at?: number; dash?: boolean }[];
  x0: number; x1: number; y0: number; y1: number; yTicks: number[]; yFmt?: (v: number) => string; xTicks: number[]; axis?: string; yAxis?: string; chapter?: string;
  marks?: { x: number; label: string; at: number }[]; dur?: number }> = ({ title, sub, series, x0, x1, y0, y1, yTicks, yFmt = (v) => `${v}`, xTicks, axis, yAxis, chapter, marks = [], dur = 60 }) => {
  const f = useCurrentFrame();
  const L = 200, R = 1640, T = 230, B = 900;
  const X = (x: number) => L + ((x - x0) / (x1 - x0)) * (R - L);
  const Y = (y: number) => B - ((y - y0) / (y1 - y0)) * (B - T);
  const g = prog(f, 0, 12);
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {yTicks.map((v) => (
          <g key={v} opacity={g}>
            <line x1={L} x2={R} y1={Y(v)} y2={Y(v)} stroke="#222A35" strokeWidth={1.5} />
            <text x={L - 18} y={Y(v) + 7} fill={C.muted} fontSize={20} fontFamily={F.body} textAnchor="end">{yFmt(v)}</text>
          </g>
        ))}
        {xTicks.map((v) => (
          <text key={v} x={X(v)} y={B + 36} fill={C.muted} fontSize={20} fontFamily={F.body} textAnchor="middle" opacity={g}>{v}</text>
        ))}
        {series.map((s, i) => {
          const a = s.at ?? 10;
          const p = prog(f, a, a + dur);
          const n = s.pts.length;
          const upto = 1 + p * (n - 1);
          const shown = s.pts.slice(0, Math.floor(upto));
          const frac = upto - Math.floor(upto);
          if (Math.floor(upto) < n && shown.length) {
            const [xa, ya] = s.pts[Math.floor(upto) - 1], [xb, yb] = s.pts[Math.floor(upto)];
            shown.push([xa + (xb - xa) * frac, ya + (yb - ya) * frac]);
          }
          if (f < a || shown.length === 0) return null;
          const d = shown.map(([x, y], k) => `${k ? "L" : "M"}${X(x)},${Y(y)}`).join(" ");
          const last = shown[shown.length - 1];
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={4} strokeDasharray={s.dash ? "10 8" : undefined} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={X(last[0])} cy={Y(last[1])} r={7} fill={s.color} stroke={C.bg} strokeWidth={2} />
              <text x={X(last[0]) + 14} y={Y(last[1]) + 8} fill={C.text} fontSize={24} fontWeight={600} fontFamily={F.body}>{s.name}</text>
            </g>
          );
        })}
        {marks.map((m, i) => {
          const o = prog(f, m.at, m.at + 10);
          return (
            <g key={i} opacity={o}>
              <line x1={X(m.x)} x2={X(m.x)} y1={T} y2={B} stroke={C.gold} strokeWidth={2} strokeDasharray="6 6" />
              <text x={X(m.x) + 10} y={T + 24} fill={C.gold} fontSize={22} fontFamily={F.body}>{m.label}</text>
            </g>
          );
        })}
        {axis && <text x={(L + R) / 2} y={B + 78} fill={C.muted} fontSize={22} fontFamily={F.body} textAnchor="middle" opacity={g}>{axis}</text>}
        {yAxis && <text x={L} y={T - 24} fill={C.muted} fontSize={22} fontFamily={F.body} opacity={g}>{yAxis}</text>}
      </svg>
    </Frame>
  );
};

/** Horizontal bars with labels; each bar grows at its own time. */
export const HBars: React.FC<{ title: string; sub?: string; bars: { label: string; v: number; at: number; hi?: boolean; photo?: string; note?: string }[]; max: number;
  fmt?: (v: number) => string; chapter?: string; ref?: { v: number; label: string }; top?: number }> = ({ title, sub, bars, max, fmt = (v) => v.toFixed(0), chapter, ref, top: top0 }) => {
  const f = useCurrentFrame();
  const L = 640, R = 1640;
  const bh = Math.min(120, 600 / bars.length);
  const top = top0 ?? Math.max(250, 560 - (bars.length * bh) / 2);
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      {ref && (
        <div style={{ position: "absolute", left: L + (ref.v / max) * (R - L), top: top - 30, height: bars.length * bh + 30, borderLeft: `2px dashed ${C.muted}` }}>
          <div style={{ fontFamily: F.body, fontSize: 20, color: C.muted, marginLeft: 8, marginTop: -6 }}>{ref.label}</div>
        </div>
      )}
      {bars.map((b, i) => {
        const p = prog(f, b.at, b.at + 22);
        const o = prog(f, b.at - 4, b.at + 4);
        return (
          <div key={i} style={{ position: "absolute", left: 140, top: top + i * bh, height: bh - 18, width: 1640, display: "flex", alignItems: "center", opacity: o }}>
            <div style={{ width: L - 160, display: "flex", alignItems: "center", gap: 16, justifyContent: "flex-end", paddingRight: 24 }}>
              {b.photo && <Photo id={b.photo} size={bh - 22} />}
              <div style={{ fontFamily: F.body, fontSize: bars.length > 6 ? 28 : 36, fontWeight: b.hi ? 700 : 500, color: b.hi ? C.text : C.muted, textAlign: "right" }}>{b.label}
                {b.note && <div style={{ fontSize: 19, fontWeight: 400, color: C.muted }}>{b.note}</div>}</div>
            </div>
            <div style={{ width: (b.v / max) * (R - L) * p, height: bh - 34, background: b.hi ? C.cyan : "#3A4352", borderRadius: "0 6px 6px 0" }} />
            <div style={{ marginLeft: 16, fontFamily: F.body, fontSize: 30, fontWeight: 700, color: b.hi ? C.text : C.muted, fontVariantNumeric: "tabular-nums" }}>{fmt(b.v * p)}</div>
          </div>
        );
      })}
    </Frame>
  );
};

/** Scatter with photo markers for named ids and dots for the rest. */
export const Scatter: React.FC<{ title: string; sub?: string; pts: { id: string; x: number; y: number }[]; named: string[]; xLabel: string; yLabel: string;
  tNamed?: number[]; chapter?: string; quad?: [string, string, string, string]; xr: [number, number]; yr: [number, number] }> = ({ title, sub, pts, named, xLabel, yLabel, tNamed = [], chapter, quad, xr, yr }) => {
  const f = useCurrentFrame();
  const L = 260, R = 1700, T = 220, B = 900;
  const X = (x: number) => L + ((x - xr[0]) / (xr[1] - xr[0])) * (R - L);
  const Y = (y: number) => B - ((y - yr[0]) / (yr[1] - yr[0])) * (B - T);
  const g = prog(f, 0, 12);
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      <div style={{ position: "absolute", left: L, top: T, width: R - L, height: B - T, opacity: 0.5 * g,
        background: "linear-gradient(45deg, rgba(255,90,95,0.10), rgba(14,17,22,0) 50%, rgba(52,211,153,0.16))" }} />
      <div style={{ position: "absolute", left: L, top: B, width: R - L, height: 2, background: "#2A3240" }} />
      <div style={{ position: "absolute", left: L, top: T, width: 2, height: B - T, background: "#2A3240" }} />
      <div style={{ position: "absolute", left: L, width: R - L, top: B + 24, textAlign: "center", fontFamily: F.body, fontSize: 24, color: C.muted }}>{xLabel} →</div>
      <div style={{ position: "absolute", left: L - 70, top: (T + B) / 2, transform: "translate(-50%,-50%) rotate(-90deg)", fontFamily: F.body, fontSize: 24, color: C.muted, whiteSpace: "nowrap" }}>{yLabel} →</div>
      {quad && quad.map((q, i) => (
        <div key={i} style={{ position: "absolute", left: i % 2 ? R - 420 : L + 20, top: i < 2 ? T - 34 : B - 40, width: 400, textAlign: i % 2 ? "right" : "left",
          fontFamily: F.body, fontSize: 21, color: C.muted, opacity: g }}>{q}</div>
      ))}
      {pts.filter((p) => !named.includes(p.id)).map((p, i) => {
        const o = prog(f, 6 + (i % 40), 14 + (i % 40));
        return <div key={p.id} style={{ position: "absolute", left: X(p.x) - 6, top: Y(p.y) - 6, width: 12, height: 12, borderRadius: 6, background: "#6B7685", opacity: 0.5 * o }} />;
      })}
      {named.map((id, i) => {
        const p = pts.find((q) => q.id === id);
        if (!p) return null;
        const at = tNamed[i] ?? 50 + i * 8;
        if (f < at) return null;
        const s = pop(f, at);
        return (
          <div key={id} style={{ position: "absolute", left: X(p.x) - 36, top: Y(p.y) - 36, transform: `scale(${s})` }}>
            <Photo id={id} size={72} ring={i === 0 ? C.gold : C.cyan} />
            <div style={{ position: "absolute", top: 76, left: -40, width: 152, textAlign: "center", fontFamily: F.body, fontWeight: 600, fontSize: 21, color: C.text }}>{P(id).name}</div>
          </div>
        );
      })}
    </Frame>
  );
};
