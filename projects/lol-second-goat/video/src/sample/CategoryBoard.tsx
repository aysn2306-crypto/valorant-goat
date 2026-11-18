import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { FIELD, KEY_STAT, MEDIAN, TOP5 } from "../data/trophies";
import { clamp, Portrait, SourceTag } from "./parts";

// P22 Category top 5. The whole field stacks into a portrait histogram over a
// red-to-green ground, the top 5 lift out, blur, fly to their rank slots,
// then the countdown reveals #5 to #1, one row per line of narration.
// All times are frames local to this scene (30 fps).
export const T = {
  highlight: 150, blurTop: 205, fieldOut: 222, fly: 222, rows: [290, 350, 410, 470, 560] as number[], // #5..#1
};

const X0 = 210, X1 = 1710, BASE = 900, CHIP = 26, STEP = 28, BIN = 2;
const xOf = (score: number) => X0 + ((X1 - X0) * score) / 100;

// histogram layout: bin by score, stack upward
const layout = (() => {
  const bins = new Map<number, number>();
  const sorted = [...FIELD].sort((a, b) => a.score - b.score);
  const pos: Record<string, { x: number; y: number; bin: number; stack: number }> = {};
  for (const p of sorted) {
    const b = Math.floor(p.score / BIN);
    const k = bins.get(b) ?? 0;
    bins.set(b, k + 1);
    pos[p.id] = { x: xOf(b * BIN + BIN / 2) - CHIP / 2, y: BASE - (k + 1) * STEP, bin: b, stack: k };
  }
  return pos;
})();

const SLOT_Y = (rank: number) => 220 + (rank - 1) * 150;
const SLOT_X = 270, ROW_CHIP = 112;

export const CategoryBoard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(f, [0, 10], [0, 1], clamp);
  const hi = interpolate(f, [T.highlight, T.highlight + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fieldOut = interpolate(f, [T.fieldOut, T.fieldOut + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const boardIn = interpolate(f, [T.fly + 8, T.fly + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const top5Ids = new Set(TOP5.map((p) => p.id));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: enter }}>
      {/* ---------- field view ---------- */}
      <AbsoluteFill style={{ opacity: 1 - fieldOut, filter: fieldOut > 0 ? `blur(${fieldOut * 12}px)` : undefined }}>
        {/* red -> neutral -> green ground: you know which side is good before reading the axis */}
        <div style={{ position: "absolute", left: X0, width: X1 - X0, top: 300, height: BASE - 300,
          background: `linear-gradient(90deg, rgba(255,90,95,0.16), rgba(107,118,133,0.06) 50%, rgba(52,211,153,0.16))`,
          opacity: interpolate(f, [4, 20], [0, 1], clamp) }} />
        <div style={{ position: "absolute", left: X0, width: (X1 - X0) * interpolate(f, [4, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) }),
          top: BASE + 4, height: 3, background: C.muted }} />
        {[0, 25, 50, 75, 100].map((v) => (
          <div key={v} style={{ position: "absolute", left: xOf(v) - 40, width: 80, top: BASE + 18, textAlign: "center",
            fontFamily: F.body, fontSize: 26, color: C.muted, fontVariantNumeric: "tabular-nums", opacity: interpolate(f, [10, 20], [0, 1], clamp) }}>{v}</div>
        ))}
        <div style={{ position: "absolute", left: X0, top: BASE + 56, fontFamily: F.body, fontSize: 22, color: C.muted,
          opacity: interpolate(f, [10, 20], [0, 1], clamp) }}>TROPHY SCORE (FAKER = 100)</div>
        {/* median line, drawn after the crowd lands */}
        <div style={{ position: "absolute", left: xOf(MEDIAN), top: 330, width: 0, height: (BASE - 330) * interpolate(f, [100, 116], [0, 1], clamp),
          borderLeft: `3px dashed ${C.muted}`, transformOrigin: "bottom", marginTop: (BASE - 330) * (1 - interpolate(f, [100, 116], [0, 1], clamp)) }} />
        <div style={{ position: "absolute", left: xOf(MEDIAN) + 12, top: 326, fontFamily: F.body, fontSize: 24, color: C.muted,
          opacity: interpolate(f, [110, 118], [0, 1], clamp) }}>median {MEDIAN}</div>
        {/* chips */}
        {FIELD.filter((p) => !top5Ids.has(p.id)).map((p) => {
          const L = layout[p.id];
          const s = 4 + Math.round(L.bin * 1.5) + L.stack * 2;
          const sp = spring({ frame: f - s, fps, config: { damping: 14, mass: 0.6 } });
          return (
            <div key={p.id} style={{ position: "absolute", left: L.x, top: L.y - (1 - sp) * 90, opacity: interpolate(f, [s, s + 4], [0, 1], clamp) * (1 - 0.75 * hi) }}>
              <Portrait name={p.name} color={p.teamColor} size={CHIP} label={false} />
            </div>
          );
        })}
        {/* headline once the five are lit */}
        <div style={{ position: "absolute", left: 210, top: 120, fontFamily: F.title, fontSize: 72, color: C.text,
          opacity: interpolate(f, [8, 14], [0, 1], clamp) }}>
          {f < T.highlight + 6 ? "EVERY TROPHY CASE IN LEAGUE HISTORY" : "FIVE STAND OUT. ONE STANDS ALONE."}
        </div>
        {/* legend box, plain words, live values */}
        <div style={{ position: "absolute", right: 210, top: 120, background: C.panel, borderRadius: 10, padding: "16px 22px",
          fontFamily: F.body, fontSize: 24, color: C.muted, lineHeight: 1.5, opacity: interpolate(f, [30, 40], [0, 1], clamp) }}>
          <div>players <span style={{ color: C.text, fontWeight: 700 }}>{Math.round(interpolate(f, [14, 110], [0, FIELD.length], clamp))}</span></div>
          <div>trophy points <span style={{ color: C.text, fontWeight: 700 }}>10+</span></div>
        </div>
      </AbsoluteFill>

      {/* ---------- the five chips: histogram -> blur -> rank slots ---------- */}
      {TOP5.map((p, i) => {
        const rank = i + 1;
        const L = layout[p.id];
        const s = 4 + Math.round(L.bin * 1.5) + L.stack * 2;
        const drop = spring({ frame: f - s, fps, config: { damping: 14, mass: 0.6 } });
        const fly = spring({ frame: f - T.fly - (5 - rank) * 2, fps, config: { damping: 20, mass: 0.8 } });
        const revealAt = T.rows[5 - rank];
        const rev = spring({ frame: f - revealAt, fps, config: { damping: 12, mass: 0.5 } });
        const blur = interpolate(f, [T.blurTop, T.blurTop + 8], [0, 14], clamp) * (1 - interpolate(f, [revealAt, revealAt + 5], [0, 1], clamp));
        const size = CHIP + (ROW_CHIP - CHIP) * fly;
        const x = L.x + (SLOT_X - L.x) * fly;
        const y = L.y - (1 - drop) * 90 + (SLOT_Y(rank) - L.y) * fly;
        const punch = 1 + 0.12 * Math.sin(Math.min(1, rev) * Math.PI) * (f >= revealAt ? 1 : 0);
        const ring = hi * (1 - fly) + (rank === 1 ? interpolate(f, [revealAt, revealAt + 10], [0, 0.9], clamp) : 0);
        return (
          <div key={p.id} style={{ position: "absolute", left: x, top: y, opacity: interpolate(f, [s, s + 4], [0, 1], clamp),
            transform: `scale(${punch})`, zIndex: 5 }}>
            <Portrait name={p.name} color={blur > 0.5 ? C.muted : p.teamColor} size={size} blur={blur} dim={blur > 0 ? 0.35 * (blur / 14) : 0} ring={ring} label={blur < 6} />
          </div>
        );
      })}

      {/* ---------- countdown rows ---------- */}
      <div style={{ position: "absolute", left: 150, top: 92, fontFamily: F.title, fontSize: 72, color: C.text, opacity: boardIn,
        transform: `translateY(${(1 - boardIn) * 20}px)` }}>
        TROPHIES <span style={{ color: C.gold }}>· TOP 5</span>
      </div>
      {TOP5.map((p, i) => {
        const rank = i + 1;
        const at = T.rows[5 - rank];
        const r = interpolate(f, [at, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
        const bar = interpolate(f, [at + 4, at + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const y = SLOT_Y(rank);
        const isOne = rank === 1;
        return (
          <React.Fragment key={p.id}>
            <div style={{ position: "absolute", left: 150, top: y + 10, width: 100, fontFamily: F.title, fontSize: 84, lineHeight: 1,
              color: isOne && f >= at ? C.gold : C.muted, opacity: boardIn * (f >= at ? 1 : 0.35) }}>{rank}</div>
            <div style={{ position: "absolute", left: SLOT_X + ROW_CHIP + 36, top: y + 4, opacity: r,
              transform: `translateX(${(1 - r) * -40}px)`, clipPath: `inset(0 ${(1 - r) * 100}% 0 0)` }}>
              <div style={{ fontFamily: F.title, fontSize: 64, lineHeight: 1, color: C.text }}>{p.name}</div>
              <div style={{ fontFamily: F.body, fontSize: 26, color: C.muted, marginTop: 8 }}>{p.team} · {KEY_STAT[p.id]}</div>
            </div>
            <div style={{ position: "absolute", left: 870, top: y + 30, width: 760, height: 52, background: C.panel, borderRadius: 8,
              opacity: boardIn * 0.9 }}>
              <div style={{ width: `${p.score * bar}%`, height: "100%", borderRadius: 8,
                background: isOne ? C.gold : "#3A4556" }} />
            </div>
            <div style={{ position: "absolute", left: 1650, top: y + 28, fontFamily: F.body, fontWeight: 800, fontSize: 48,
              color: isOne && f >= at ? C.gold : C.text, fontVariantNumeric: "tabular-nums", opacity: r }}>
              {(p.score * bar).toFixed(1)}
            </div>
          </React.Fragment>
        );
      })}

      <SourceTag opacity={interpolate(f, [20, 30], [0, 1], clamp)} />
    </AbsoluteFill>
  );
};
