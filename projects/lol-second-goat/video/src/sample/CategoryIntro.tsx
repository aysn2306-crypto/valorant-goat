import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { clamp } from "./parts";

// P21 Category intro card: name, one-line meaning in cyan, then the ingredients one by one.
export const CategoryIntro: React.FC<{ index: number; total: number; name: string; meaning: string; ingredients: string[];
  exitAt: number }> = ({ index, total, name, meaning, ingredients, exitAt }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [exitAt, exitAt + 8], [0, 1], clamp);
  const letters = name.split("");
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ position: "absolute", left: 160, top: 250, fontFamily: F.body, fontWeight: 700, fontSize: 30,
        letterSpacing: 6, color: C.muted, opacity: interpolate(f, [2, 8], [0, 1], clamp) }}>
        CATEGORY {index} OF {total}
      </div>
      <div style={{ position: "absolute", left: 150, top: 290, display: "flex" }}>
        {letters.map((l, i) => {
          const s = 6 + i * 3; // one letter every 0.1 s
          const p = interpolate(f, [s, s + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
          return (
            <span key={i} style={{ fontFamily: F.title, fontSize: 280, lineHeight: 1, color: C.text,
              opacity: 0.3 + 0.7 * p, filter: `blur(${(1 - p) * 8}px)`, visibility: f < s ? "hidden" : "visible" }}>{l}</span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 160, top: 600, width: interpolate(f, [24, 40], [0, 220], { ...clamp, easing: Easing.out(Easing.exp) }),
        height: 6, background: C.cyan }} />
      <div style={{ position: "absolute", left: 160, top: 640, fontFamily: F.body, fontWeight: 600, fontSize: 52, color: C.cyan,
        opacity: interpolate(f, [62, 66], [0, 1], clamp), filter: `blur(${interpolate(f, [62, 67], [8, 0], clamp)}px)` }}>
        {meaning}
      </div>
      <div style={{ position: "absolute", left: 160, top: 750, display: "flex", gap: 20 }}>
        {ingredients.map((g, i) => {
          const s = 98 + i * 10;
          const p = interpolate(f, [s, s + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
          return (
            <div key={g} style={{ fontFamily: F.body, fontWeight: 500, fontSize: 30, color: C.text, background: C.panel,
              border: `1px solid ${C.panelHi}`, borderRadius: 10, padding: "12px 22px", opacity: p,
              transform: `translateY(${(1 - p) * 18}px)` }}>
              {g}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
