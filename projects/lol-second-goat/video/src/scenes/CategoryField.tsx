// Beeswarm of the whole pool on one category (MachineLoLing-style: red-to-green field, faces as data points),
// then the top 5 lift out of the field one by one (#5 first).
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { D, P } from "../lib/data";
import { clamp, Frame, Photo, pop, prog } from "../lib/ui";

type Props = {
  cat: string; title: string; sub?: string; axis: string; chapter?: string;
  ids?: string[];            // the five to lift out, best first (default: boards[cat].slice(0,5))
  tTop?: number[];           // frame each of #5..#1 lifts out
  tick?: (v: number) => string; label?: (id: string) => string;
  log?: boolean; filter?: (id: string) => boolean;
};

const X0 = 130, X1 = 1290, BASE = 900, DOT = 13;

export const CategoryField: React.FC<Props> = ({ cat, title, sub, axis, chapter, ids, tTop = [60, 80, 100, 120, 140], tick, label, log, filter }) => {
  const f = useCurrentFrame();
  const top = ids ?? D.boards[cat].slice(0, 5);
  const pool = D.players.filter((p) => p.raw[cat] !== null && p.raw[cat] !== undefined && (!filter || filter(p.id)));
  const tf = (v: number) => (log ? Math.log10(1 + Math.max(0, v)) : v);
  const vals = pool.map((p) => tf(p.raw[cat]));
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.04;
  const xOf = (v: number) => X0 + ((tf(v) - (lo - pad)) / (hi + pad - (lo - pad))) * (X1 - X0);
  const layout = useMemo(() => {
    const cols: Record<number, number> = {};
    const order = [...pool].sort((a, b) => a.raw[cat] - b.raw[cat]);
    return order.map((p) => {
      const x = xOf(p.raw[cat]);
      const c = Math.round(x / (DOT + 1));
      const k = cols[c] ?? 0; cols[c] = k + 1;
      return { id: p.id, x: c * (DOT + 1), y: BASE - DOT / 2 - k * (DOT + 1), k };
    });
  }, [cat]);
  const maxK = Math.max(...layout.map((l) => l.k));
  const squash = maxK * (DOT + 1) > 520 ? 520 / (maxK * (DOT + 1)) : 1;
  const ticks = 5;
  const gIn = prog(f, 0, 14);
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      {/* field gradient: left = below average, right = above */}
      <div style={{ position: "absolute", left: X0, right: 1920 - X1, top: 250, height: BASE - 250, opacity: 0.55 * gIn,
        background: "linear-gradient(90deg, rgba(255,90,95,0.20) 0%, rgba(14,17,22,0) 45%, rgba(14,17,22,0) 55%, rgba(52,211,153,0.20) 100%)" }} />
      <div style={{ position: "absolute", left: X0, width: X1 - X0, top: BASE, height: 2, background: "#2A3240", opacity: gIn }} />
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = lo + (i / ticks) * (hi - lo);
        const raw = log ? Math.pow(10, v) - 1 : v;
        return (
          <div key={i} style={{ position: "absolute", left: xOf(raw) - 60, width: 120, top: BASE + 14, textAlign: "center",
            fontFamily: F.body, fontSize: 20, color: C.muted, opacity: gIn }}>{tick ? tick(raw) : raw.toFixed(1)}</div>
        );
      })}
      <div style={{ position: "absolute", left: X0, width: X1 - X0, top: BASE + 48, textAlign: "center", fontFamily: F.body,
        fontSize: 22, color: C.muted, opacity: gIn }}>{axis}</div>
      {layout.map((l, i) => {
        const at = 8 + (i / layout.length) * 36;
        const o = prog(f, at, at + 8);
        const isTop = top.includes(l.id);
        const lifted = isTop && f >= tTop[4 - top.indexOf(l.id)];
        const y = BASE - (BASE - l.y) * squash;
        return (
          <div key={l.id} style={{ position: "absolute", left: l.x - DOT / 2, top: y - DOT / 2 - (1 - o) * 40, width: DOT, height: DOT,
            borderRadius: DOT / 2, background: lifted ? C.cyan : "#6B7685", opacity: o * (lifted ? 1 : 0.55) }} />
        );
      })}
      {top.map((id, rank) => {
        const at = tTop[4 - rank];
        if (f < at) return null;
        const l = layout.find((q) => q.id === id);
        if (!l) return null;
        const y = BASE - (BASE - l.y) * squash;
        const s2 = pop(f, at);
        return (
          <div key={"tag" + id} style={{ position: "absolute", left: l.x - 20, top: y - 52, width: 40, textAlign: "center", transform: `scale(${s2})`,
            fontFamily: F.body, fontWeight: 800, fontSize: 22, color: rank === 0 ? C.gold : C.cyan }}>{rank + 1}</div>
        );
      })}
      {top.map((id, rank) => {
        const at = tTop[4 - rank];
        if (f < at) return null;
        const s2 = pop(f, at);
        const RH = 128, Y0 = 250;
        const gold = rank === 0;
        return (
          <div key={"row" + id} style={{ position: "absolute", left: 1370, width: 450, top: Y0 + rank * RH, height: RH - 14, display: "flex", alignItems: "center", gap: 18,
            background: gold ? "rgba(245,184,61,0.08)" : C.panel, borderRadius: 14, paddingLeft: 16, opacity: s2, transform: `translateX(${(1 - s2) * 40}px)` }}>
            <div style={{ width: 34, fontFamily: F.title, fontSize: 44, color: gold ? C.gold : C.muted, textAlign: "center" }}>{rank + 1}</div>
            <Photo id={id} size={88} ring={gold ? C.gold : "rgba(237,239,242,0.25)"} />
            <div style={{ width: 270 }}>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: gold ? C.gold : C.text, lineHeight: 1.1 }}>{P(id).name}</div>
              {label && <div style={{ fontFamily: F.body, fontSize: 20, color: C.muted, lineHeight: 1.25, marginTop: 4 }}>{label(id)}</div>}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X0, top: 200, fontFamily: F.body, fontSize: 20, color: C.muted, opacity: gIn }}>
        <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 6, background: "#6B7685", marginRight: 8 }} />
        each dot = one player ({pool.length}, {D.meta.minGames}+ games)
      </div>
    </Frame>
  );
};
