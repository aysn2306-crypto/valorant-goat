// One trophy split five ways (ay 19 Nov: share = how each player played across the whole tournament, every game counts).
// Built from Jxmy's pie between photos (video-research/graphs-0.5s-jxmy-machineloling/IVdJ6Z9jluc g1 02m28s-02m52s):
// a pie in the middle, the players' photos around it, a short arrow from each slice to its player, the share written
// on the slice. Shares are model v13 title credit for BLG at Worlds 2026 (stills.json blgCredit), as % of the title.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const SLICE = ["#5E6670", "#747C86"]; // two neutral steps so neighbouring slices separate

const SHARES: [string, number][] = [["knight", 1.061], ["xun", 1.027], ["bin", 0.988], ["viper", 0.983], ["on", 0.941]];

/** `cues` are frames inside the scene: photos in, pie fills, shares written, caption */
export const TrophySplit: React.FC<{ cues: { photos: number; pie: number; shares: number; caption: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const total = SHARES.reduce((a, s) => a + s[1], 0);
  const cx = 960, cy = 565, R = 205;
  const spot = (deg: number) => { const sn = Math.sin((deg * Math.PI) / 180); return [cx + 600 * Math.cos((deg * Math.PI) / 180), cy + (sn < 0 ? 250 : 335) * sn]; };
  const fill = interpolate(f, [cues.pie, cues.pie + 36], [0, 1], { ...clamp, easing: inOut });
  const pop = (a: number) => interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
  let acc = 0;
  const slices = SHARES.map(([id, v], i) => {
    const a0 = (acc / total) * 360 - 90; acc += v;
    const a1 = (acc / total) * 360 - 90;
    return { id, pct: (v / total) * 100, a0, a1, mid: (a0 + a1) / 2, i };
  });
  const pt = (deg: number, r: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const sweep = fill * 360 - 90;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center", fontFamily: BEBAS, fontSize: 84, letterSpacing: 2, color: INK, opacity: pop(cues.photos) }}>
        ONE TROPHY, FIVE PLAYERS</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {slices.map((s) => {
          const e = Math.min(s.a1, sweep);
          if (e <= s.a0) return null;
          const [x0, y0] = pt(s.a0, R), [x1, y1] = pt(e, R);
          const large = e - s.a0 > 180 ? 1 : 0;
          return <path key={s.id} d={`M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`} fill={s.i === 0 ? TEAL : SLICE[s.i % 2]} stroke="#3A3C3A" strokeWidth={4} />;
        })}
        {/* arrows from each slice to its player */}
        {slices.map((s) => {
          const [ax, ay] = pt(s.mid, R + 16), [px, py] = spot(s.mid);
          const d = Math.hypot(px - ax, py - ay), k = Math.max(0, (d - 150) / d);
          const bx = ax + (px - ax) * k, by = ay + (py - ay) * k;
          const o = pop(cues.shares + s.i * 5);
          return <g key={"a" + s.id} opacity={o}><line x1={ax} y1={ay} x2={bx} y2={by} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <circle cx={bx} cy={by} r={6} fill={INK} /></g>;
        })}
      </svg>
      {/* the share written on each slice */}
      {slices.map((s) => {
        const [x, y] = pt(s.mid, R * 0.62);
        return <div key={"p" + s.id} style={{ position: "absolute", left: x - 80, top: y - 30, width: 160, textAlign: "center", fontFamily: BEBAS, fontSize: 54,
          color: s.i === 0 ? "#10241F" : INK, opacity: pop(cues.shares + s.i * 5) }}>{Math.round(s.pct)}%</div>;
      })}
      {/* players around the pie, at their slice */}
      {slices.map((s) => {
        const [xx, y] = spot(s.mid); // an ellipse round the pie, so the wide frame is used
        const w = 170, h = 190, ph = P(s.id).photo;
        const o = pop(cues.photos + s.i * 4);
        return (
          <div key={"ph" + s.id} style={{ position: "absolute", left: xx - w / 2, top: y - h / 2 - 20, width: w, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
            <div style={{ width: w, height: h, borderRadius: 14, overflow: "hidden", border: `4px solid ${s.i === 0 ? TEAL : INK}`, background: "#2A2C2B" }}>
              {ph && <Img src={staticFile(ph)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />}
            </div>
            <div style={{ textAlign: "center", fontFamily: BEBAS, fontSize: 40, color: INK, marginTop: 6, letterSpacing: 1 }}>{P(s.id).name}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 146, textAlign: "center", fontFamily: BEBAS, fontSize: 40, letterSpacing: 1.5, color: "#C9CCC6", opacity: pop(cues.caption) }}>
        BLG AT WORLDS 2026: EVERY GAME OF THE TOURNAMENT COUNTS</div>
    </AbsoluteFill>
  );
};
