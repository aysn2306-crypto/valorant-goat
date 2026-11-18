import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F } from "../theme";
import { Photo } from "../lib/ui";

// Shared look for the graph stills (Jxmy / MachineLoLing): near-black ground with a blue glow left and a red glow right,
// soft vignette, white axes with big condensed numbers, axis names with big arrows, ringed UPPERCASE names.

export const CREAM = "#ECE6D2";
export type Box = { x0: number; y0: number; x1: number; y1: number }; // y0 = top, y1 = bottom (screen px)
export const scale = (b: Box, xr: [number, number], yr: [number, number]) => ({
  X: (v: number) => b.x0 + ((v - xr[0]) / (xr[1] - xr[0])) * (b.x1 - b.x0),
  Y: (v: number) => b.y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (b.y1 - b.y0),
});

// red (bad) -> orange -> yellow -> green (good), t in 0..1
const STOPS: [number, number[]][] = [[0, [232, 57, 43]], [0.35, [242, 120, 40]], [0.68, [232, 205, 58]], [1, [92, 190, 80]]];
export const heat = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  let i = 0; while (i < STOPS.length - 2 && t > STOPS[i + 1][0]) i++;
  const [a, ca] = STOPS[i]; const [b, cb] = STOPS[i + 1];
  const k = (t - a) / (b - a);
  return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k)).join(",")})`;
};
export const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };

export const Stage: React.FC<{ title?: string; children: React.ReactNode; glow?: "split" | "blue" | "red" | "gold" }> = ({ title, children, glow = "split" }) => {
  const g = {
    split: "radial-gradient(ellipse at 28% 45%, rgba(40,58,92,0.55) 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at 74% 55%, rgba(92,34,40,0.55) 0%, rgba(0,0,0,0) 55%)",
    blue: "radial-gradient(ellipse at 50% 50%, rgba(40,62,100,0.6) 0%, rgba(0,0,0,0) 65%)",
    red: "radial-gradient(ellipse at 50% 50%, rgba(100,36,40,0.55) 0%, rgba(0,0,0,0) 65%)",
    gold: "radial-gradient(ellipse at 50% 30%, rgba(110,82,30,0.45) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse at 50% 80%, rgba(40,58,92,0.4) 0%, rgba(0,0,0,0) 60%)",
  }[glow];
  return (
    <AbsoluteFill style={{ background: `${g}, #0B0B0F`, overflow: "hidden" }}>
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      {title && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: F.title, fontSize: 80, letterSpacing: 2,
          color: CREAM, textShadow: "0 0 18px rgba(236,230,210,0.35)" }}>{title}</div>
      )}
    </AbsoluteFill>
  );
};

const ArrowR: React.FC<{ s?: number; flip?: boolean }> = ({ s = 1, flip }) => (
  <svg width={70 * s} height={40 * s} viewBox="0 0 70 40" style={{ transform: flip ? "scaleX(-1)" : undefined }}><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg>
);
const ArrowU: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={30 * s} height={46 * s} viewBox="0 0 46 70"><path d="M23 0 L46 30 L31 30 L31 70 L15 70 L15 30 L0 30 Z" fill={C.text} /></svg>
);

/** Real x and y axes: white lines, condensed numbers, axis names with big direction arrows (which way is better). */
export const Axes: React.FC<{
  b: Box; xr: [number, number]; yr: [number, number]; xt: number[]; yt: number[];
  xl: string; yl: string; xf?: (v: number) => string; yf?: (v: number) => string; xFont?: number; yFont?: number;
}> = ({ b, xr, yr, xt, yt, xl, yl, xf = (v) => v.toLocaleString("en-US"), yf = (v) => v.toLocaleString("en-US"), xFont = 40, yFont = 46 }) => {
  const { X, Y } = scale(b, xr, yr);
  return (
    <>
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {yt.map((v) => (
        <div key={"y" + v} style={{ position: "absolute", left: b.x0 - 170, width: 150, top: Y(v) - yFont * 0.62, textAlign: "right", fontFamily: F.title,
          fontSize: yFont, color: C.text, fontVariantNumeric: "tabular-nums" }}>{yf(v)}</div>
      ))}
      {xt.map((v) => (
        <div key={"x" + v} style={{ position: "absolute", left: X(v) - 80, width: 160, top: b.y1 + 12, textAlign: "center", fontFamily: F.title,
          fontSize: xFont, color: C.text }}>{xf(v)}</div>
      ))}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 22 + xFont * 1.25, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>{xl}</div>
        <ArrowR />
      </div>
      <div style={{ position: "absolute", left: b.x0 + 22, top: b.y0 - 22, display: "flex", alignItems: "center", gap: 14 }}>
        <ArrowU />
        <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>{yl}</div>
      </div>
    </>
  );
};

export const Dot: React.FC<{ x: number; y: number; r?: number; color: string; o?: number }> = ({ x, y, r = 9, color, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: color, boxShadow: `0 0 ${r}px ${color}`, opacity: o }} />
);

const STAR = "M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z";
export const Star: React.FC<{ x: number; y: number; r?: number; color: string; o?: number }> = ({ x, y, r = 13, color, o = 1 }) => (
  <svg style={{ position: "absolute", left: x - r, top: y - r, opacity: o, filter: `drop-shadow(0 0 ${r * 0.5}px ${color})` }} width={r * 2} height={r * 2} viewBox="0 0 100 95">
    <path d={STAR} fill={color} />
  </svg>
);

/** White ring round a point plus bold uppercase name and value, placed on one side so nothing overlaps. */
export const Callout: React.FC<{ x: number; y: number; name: string; value?: string; side?: "left" | "right" | "above" | "below"; color?: string; ring?: number; size?: number; pad?: number }> = ({
  x, y, name, value, side = "right", color = C.text, ring = 26, size = 1, pad,
}) => {
  const g = pad ?? ring;
  const txt = (
    <>
      <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 24 * size, letterSpacing: 0.5, color, whiteSpace: "nowrap" }}>{name.toUpperCase()}</div>
      {value && <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 34 * size, color: C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>}
    </>
  );
  const pos: React.CSSProperties =
    side === "right" ? { left: x + g + 10, top: y - 32 * size }
    : side === "left" ? { left: x - g - 310, width: 300, textAlign: "right", top: y - 32 * size }
    : side === "above" ? { left: x - 150, width: 300, textAlign: "center", top: y - g - 8 - (value ? 66 : 32) * size }
    : { left: x - 150, width: 300, textAlign: "center", top: y + g + 6 };
  return (
    <>
      {ring > 0 && <div style={{ position: "absolute", left: x - ring, top: y - ring, width: ring * 2, height: ring * 2, borderRadius: ring, border: `3px solid ${color === C.text ? "rgba(255,255,255,0.9)" : color}` }} />}
      <div style={{ position: "absolute", ...pos }}>{txt}</div>
    </>
  );
};

/** Round face cutout with a glow; only for the outlier of a chart. */
export const Face: React.FC<{ id: string; x: number; y: number; size?: number; ring?: string; glow?: string }> = ({ id, x, y, size = 120, ring = C.gold, glow = C.gold }) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, filter: `drop-shadow(0 0 22px ${glow})` }}>
    <Photo id={id} size={size} round ring={ring} />
  </div>
);

/** Big label with no ring, for numbers that sit on the chart. */
export const Big: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number; color?: string; align?: "left" | "right" | "center"; w?: number }> = ({
  x, y, children, size = 44, color = C.text, align = "left", w = 600,
}) => (
  <div style={{ position: "absolute", top: y, left: align === "left" ? x : align === "right" ? x - w : x - w / 2, width: w, textAlign: align,
    fontFamily: F.title, fontSize: size, letterSpacing: 1, color, lineHeight: 1.1 }}>{children}</div>
);
