// Ranked list (#1 at top), rows revealed #5 -> #1. Each row: photo, name, role/region/years, one real stat, category score bar.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { P } from "../lib/data";
import { Frame, Photo, pop, prog, roleIcon } from "../lib/ui";

export type Row = { id: string; stat: string; statLabel?: string; value: number; note?: string };
export const Top5: React.FC<{ title: string; sub?: string; rows: Row[]; tRow?: number[]; chapter?: string; max?: number; valueLabel?: string; gold?: boolean; rankOffset?: number }> = ({
  title, sub, rows, tRow, chapter, max = 100, valueLabel = "category score", gold = true, rankOffset = 0,
}) => {
  const f = useCurrentFrame();
  const n = rows.length;
  const times = tRow ?? rows.map((_, i) => 20 + (n - 1 - i) * 28);
  const RH = 132, Y0 = 230;
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      <div style={{ position: "absolute", right: 140, top: 180, fontFamily: F.body, fontSize: 20, color: C.muted }}>{valueLabel}</div>
      {rows.map((r, i) => {
        const at = times[i];
        if (f < at) return null;
        const s = pop(f, at);
        const b = prog(f, at + 4, at + 26);
        const p = P(r.id);
        const top = i === 0 && gold;
        return (
          <div key={r.id} style={{ position: "absolute", left: 140, right: 140, top: Y0 + i * RH, height: RH - 16, display: "flex", alignItems: "center",
            gap: 28, opacity: s, transform: `translateX(${(1 - s) * -40}px)`, background: top ? "rgba(245,184,61,0.07)" : C.panel, borderRadius: 14,
            paddingLeft: 24, paddingRight: 28 }}>
            <div style={{ width: 70, fontFamily: F.title, fontSize: 60, color: top ? C.gold : C.muted, textAlign: "center" }}>{i + 1 + rankOffset}</div>
            <Photo id={r.id} size={96} ring={top ? C.gold : "rgba(237,239,242,0.25)"} />
            <div style={{ width: 430 }}>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 40, color: top ? C.gold : C.text }}>{p.name}</div>
              <div style={{ fontFamily: F.body, fontSize: 22, color: C.muted }}>{roleIcon(p.role)} · {p.regions} · {p.years}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: C.text }}>{r.stat}</div>
              <div style={{ fontFamily: F.body, fontSize: 21, color: C.muted }}>{r.statLabel ?? ""}{r.note ? `  ·  ${r.note}` : ""}</div>
            </div>
            <div style={{ width: 360, height: 18, background: "#252D3A", borderRadius: 9, overflow: "hidden" }}>
              <div style={{ width: `${(r.value / max) * 100 * b}%`, height: "100%", background: top ? C.gold : C.cyan, borderRadius: 9 }} />
            </div>
            <div style={{ width: 90, textAlign: "right", fontFamily: F.body, fontWeight: 700, fontSize: 34, color: C.text, fontVariantNumeric: "tabular-nums" }}>
              {(r.value * b).toFixed(0)}
            </div>
          </div>
        );
      })}
    </Frame>
  );
};
