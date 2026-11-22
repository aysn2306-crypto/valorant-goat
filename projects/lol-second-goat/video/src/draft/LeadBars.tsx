// Council 22 Nov (ay: "make any changes you think are suitable"): after the reveal, WHY Knight is #2. Knight's lead over
// Chovy split into the six parts, in points of the overall score (model v15.3, research/data/draft_scores_v15.3.csv:
// part score difference x part weight). Big games +4.8, trophies +0.2, longevity 0.0, skill -0.5, team impact -0.5,
// recognition -1.0 = +3.0. Diverging bars: Knight's side right in teal, Chovy's side left in grey; bars land one by one.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE", MUTE = "#9BA3AE", TEAL = "#3FD0B5", GREY = "#8E97A3";

const ROWS: [string, number, string?][] = [
  ["BIG GAMES", 4.8], ["TROPHIES", 0.2, "BASICALLY A TIE"], ["LONGEVITY", 0.0, "TIE"],
  ["SKILL", -0.5], ["TEAM IMPACT", -0.5], ["RECOGNITION", -1.0]];

const Face: React.FC<{ id: string; ring: string }> = ({ id, ring }) => (
  <div style={{ width: 84, height: 84, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `4px solid ${ring}`, flex: "none" }}>
    {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
  </div>
);

export const LeadBars: React.FC<{ startAt?: number }> = ({ startAt = 0 }) => {
  const f = useCurrentFrame();
  const zx = 900, ppu = 150, Y0 = 300, RH = 100, BH = 64;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const totalK = interpolate(f, [startAt + 8 + ROWS.length * 8 + 10, startAt + 8 + ROWS.length * 8 + 20], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 110, top: 50, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK, lineHeight: 1 }}>WHERE KNIGHT'S LEAD COMES FROM</div>
        <div style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: MUTE, marginTop: 8 }}>POINTS OF OVERALL SCORE, KNIGHT VS CHOVY</div>
      </div>
      {/* side headers */}
      <div style={{ position: "absolute", right: 1920 - zx + 20, top: Y0 - 112, display: "flex", alignItems: "center", gap: 16, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 42, letterSpacing: 2, color: GREY }}>◀ CHOVY AHEAD</div><Face id="chovy" ring={GREY} />
      </div>
      <div style={{ position: "absolute", left: zx + 20, top: Y0 - 112, display: "flex", alignItems: "center", gap: 16, opacity: tO }}>
        <Face id="knight" ring={TEAL} /><div style={{ fontFamily: BEBAS, fontSize: 42, letterSpacing: 2, color: TEAL }}>KNIGHT AHEAD ▶</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={zx} x2={zx} y1={Y0 - 14} y2={Y0 + ROWS.length * RH - 20} stroke={INK} strokeOpacity={0.7} strokeWidth={3} opacity={tO} />
      </svg>
      {ROWS.map(([label, v, note], i) => {
        const a = startAt + 8 + i * 8;
        const k = interpolate(f, [a, a + 14], [0, 1], { ...clamp, easing: easeOut });
        const lo = interpolate(f, [a - 4, a + 2], [0, 1], clamp);
        const y = Y0 + i * RH, w = Math.abs(v) * ppu * k, right = v >= 0;
        const col = v > 0.05 ? TEAL : v < -0.05 ? GREY : MUTE;
        const txt = (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1) + (note ? "  " + note : "");
        return (
          <React.Fragment key={label}>
            <div style={{ position: "absolute", left: 110, top: y, height: BH, display: "flex", alignItems: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 2,
              color: i === 0 ? TEAL : INK, opacity: lo }}>{label}</div>
            <div style={{ position: "absolute", left: right ? zx : zx - w, top: y, width: Math.max(w, 4), height: BH, background: col, opacity: lo }} />
            <div style={{ position: "absolute", top: y, height: BH, display: "flex", alignItems: "center", fontFamily: BEBAS, fontSize: i === 0 ? 64 : 52, letterSpacing: 1,
              color: col, opacity: k, whiteSpace: "nowrap", ...(right ? { left: zx + w + 18 } : { right: 1920 - (zx - w) + 18 }) }}>{txt}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 110, right: 110, top: Y0 + ROWS.length * RH + 10, borderTop: "2px solid rgba(242,242,238,0.25)", paddingTop: 22,
        display: "flex", alignItems: "baseline", gap: 24, opacity: totalK, transform: `translateY(${(1 - totalK) * 10}px)` }}>
        <div style={{ fontFamily: BEBAS, fontSize: 60, letterSpacing: 2, color: INK }}>KNIGHT'S LEAD</div>
        <div style={{ fontFamily: BEBAS, fontSize: 84, color: TEAL, lineHeight: 1 }}>+3.0 POINTS</div>
      </div>
    </AbsoluteFill>
  );
};
