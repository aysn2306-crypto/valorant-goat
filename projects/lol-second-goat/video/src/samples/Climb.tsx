// Jxmy camera climb (video-research/graphs-0.5s-jxmy-machineloling/VCIKek1f-Hs g3 "climb 20-95" and g6 "warriors wins
// climb 399"): the chart opens tight on the pack, big axis numbers; the camera rises through empty space with the axis
// numbers scrolling past until it lands on the one dot way above everyone, "Name (value)" under it; then it pulls back
// to the whole chart and a dashed bracket says how big the gap is. Plain white dots on a grey concrete ground.
// Data: model v15.3 team impact (plus-minus wins added PER 100 GAMES, 300+ games, stills.json "impact"; ay 20 Nov 23:09).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { L, W, WA } from "../data/vo";
import S from "../data/stills.json";

const FPS = 30;
const TEAL = "#3FD0B5";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";

/** Our ground (ay 19 Nov: Jxmy styles made in our look): Jxmy-style textured ground in our dark slate, fine grain, soft blotches, darker edges */
export const Concrete: React.FC = () => (
  <AbsoluteFill style={{ background: "#0F1012" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <filter id="blot"><feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={3} seed={4} />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 -0.08" /></filter>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={9} />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
      <rect width={1920} height={1080} filter="url(#blot)" />
      <rect width={1920} height={1080} filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);

type Imp = [string, string, number, number];
export const CLIMB_T0 = L("37").start - 0.2, CLIMB_T1 = L("37b").end + 0.6;
export const CLIMB_FRAMES = Math.round((CLIMB_T1 - CLIMB_T0) * FPS);

export const SClimb: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const f = useCurrentFrame();
  const A = (t: number) => Math.round((t - CLIMB_T0) * FPS);
  const rows = S.impact as Imp[];
  const get = (id: string) => rows.find((r) => r[0] === id)!;
  const fk = get("faker"), ru = get("ruler");

  // camera: centre (data units) and zoom; 1 = tight on the pack. Script 20 Nov (Jxmy's benchmark then outlier): on "plus
  // 100" the camera rises a little to the +100 line ("only 23 players"), Ruler is named on "Ruler", the climb to Faker
  // starts on the second "Faker" ("way up here"), and the pull back with the gap comes after "330"
  const bench0 = A(WA("37", ["plus", "12"])), bench1 = bench0 + 30, benchLab = A(WA("37", ["15", "fifteen", "only"]));
  const climb0 = A((() => { try { return W("37", "faker", 1); } catch { return WA("37", ["way", "then"]); } })()), climb1 = climb0 + 48;
  const out0 = Math.max(climb1 + 20, A(WA("37", ["21", "twenty"])) + 24), out1 = out0 + 30;
  const kB = interpolate(f, [bench0, bench1], [0, 1], { ...clamp, easing: inOut });
  const kUp = interpolate(f, [climb0, climb1], [0, 1], { ...clamp, easing: inOut });
  // ay 21 Nov 17:07: "Ruler is second at 18" climbs to Ruler and lights him, then "Faker's up here" climbs on to Faker
  const rul = A(WA("37", ["ruler"]));
  const kR = interpolate(f, [rul - 6, rul + 24], [0, 1], { ...clamp, easing: inOut });
  const kOut = interpolate(f, [out0, out1], [0, 1], { ...clamp, easing: inOut });
  const cy = 3 + kB * (7 - 3) + kR * (13 - 7) + kUp * (17 - 13) + kOut * (8 - 17);
  const s = 1 - kOut * 0.53, sx = 1 - kOut * 0.28;
  const cx = 850 + kOut * 60;
  const KY = 60, KX = 0.88;
  const X = (g: number) => 960 + (g - cx) * KX * sx;
  const Y = (v: number) => 560 - (v - cy) * KY * s;
  const t = 0.55 + 0.45 * s; // text keeps most of its size when the camera pulls back

  const pop = (a: number) => interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
  // ay 20 Nov 15:28: dots come in from the bottom left to the top right (rank by games + wins added), over a second
  const G0 = Math.floor(Math.min(...rows.map((r) => r[2])) / 50) * 50; // the axis starts at the fewest games in the pool
  const order = new Map(rows.map((r) => [r[0], (r[2] - G0) / 1500 + (r[3] + 6) / 27] as [string, number]).sort((a, b) => a[1] - b[1]).map(([id], k) => [id, k]));
  const dotsIn = (i: number) => { const k = (order.get(rows[i][0]) ?? 0) / rows.length; return interpolate(f, [2 + k * 30, 8 + k * 30], [0, 1], clamp); };
  const ticks = Array.from({ length: 11 }, (_, i) => -6 + i * 3);
  const named: { id: string; at: number; big?: boolean }[] = [{ id: "ruler", at: A(WA("37", ["ruler"])) }, { id: "faker", at: climb1 - 6, big: true }];
  const gap = (fk[3] - ru[3]).toFixed(1);

  return (
    <AbsoluteFill>
      <Concrete />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* y axis and its big numbers */}
        <line x1={X(G0) - 10} x2={X(G0) - 10} y1={Y(-6) + 6} y2={Y(26)} stroke={INK} strokeWidth={5 * t} />
        <line x1={X(G0) - 12} x2={X(1700)} y1={Y(-6) + 6} y2={Y(-6) + 6} stroke={INK} strokeWidth={5 * t} />
        {ticks.map((v) => (
          <text key={v} opacity={v % 6 === 0 ? 1 : 1 - kOut} x={X(G0) - 30 * t} y={Y(v) + 22 * t} textAnchor="end" fontFamily={BEBAS} fontSize={66 * t} fill={INK}>{v > 0 ? "+" + v : v}</text>))}
        {[G0, 400, 800, 1200, 1600].map((g) => (
          <text key={g} x={X(g)} y={Y(-6) + 64 * t} textAnchor="middle" fontFamily={BEBAS} fontSize={44 * t} fill={INK}>{g.toLocaleString("en-GB")}</text>))}
        <text x={X((G0 + 1700) / 2)} y={Y(-6) + 116 * t} textAnchor="middle" fontFamily={BEBAS} fontSize={40 * t} fill={INK} letterSpacing={2}>GAMES PLAYED (300+)</text>
        <text transform={`translate(${X(G0) - 150 * t} ${Y(cy)}) rotate(-90)`} textAnchor="middle" fontFamily={BEBAS} fontSize={40 * t} fill={INK} letterSpacing={2}>WINS ADDED PER 100 GAMES</text>
        <line x1={X(G0) - 10} x2={X(1700)} y1={Y(0)} y2={Y(0)} stroke={INK} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="10 10" />
        {/* the benchmark: +12 per 100 games, only 15 players (stills.json impact) */}
        <g opacity={kB}>
          <line x1={X(G0) - 10} x2={X(1700)} y1={Y(12)} y2={Y(12)} stroke={INK} strokeOpacity={0.7} strokeWidth={3 * t} strokeDasharray="14 10" />
          <text x={X(1700)} y={Y(12) - 16 * t} textAnchor="end" fontFamily={BEBAS} fontSize={44 * t} fill={INK} opacity={interpolate(f, [benchLab, benchLab + 8], [0, 1], clamp)}>
            ONLY {rows.filter((r) => r[3] > 12).length} PLAYERS ABOVE +12</text>
        </g>
        {/* every player */}
        {rows.map((r, i) => {
          const o = dotsIn(i) * (r[0] === "faker" ? 1 : named.some((n) => n.id === r[0]) ? 0.95 : 0.6);
          const nm = named.find((n) => n.id === r[0]), lit = nm ? pop(nm.at) : 0;
          return <g key={r[0]}>
            <circle cx={X(r[2])} cy={Y(r[3])} r={(r[0] === "faker" ? 12 : 7) * t * (1 + 0.5 * lit)} fill={lit > 0.5 ? TEAL : INK} opacity={o} />
            {lit > 0 && <circle cx={X(r[2])} cy={Y(r[3])} r={(r[0] === "faker" ? 26 : 20) * t} fill="none" stroke={TEAL} strokeWidth={4 * t} opacity={lit} />}
          </g>;
        })}
        {/* the gap, once the camera has pulled back */}
        <g opacity={pop(out1 - 2)}>
          <line x1={X(1730)} x2={X(1730)} y1={Y(fk[3])} y2={Y(ru[3])} stroke={INK} strokeWidth={4} strokeDasharray="14 10" />
          <line x1={X(1210)} x2={X(1730)} y1={Y(ru[3])} y2={Y(ru[3])} stroke={INK} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
          <line x1={X(1600)} x2={X(1730)} y1={Y(fk[3])} y2={Y(fk[3])} stroke={INK} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
          <text x={X(1730) + 22} y={Y((fk[3] + ru[3]) / 2) - 8} fontFamily={BEBAS} fontSize={50} fill={INK}>+{gap} per 100 games</text>
          <text x={X(1730) + 22} y={Y((fk[3] + ru[3]) / 2) + 44} fontFamily={BEBAS} fontSize={50} fill={INK}>over number two</text>
        </g>
      </svg>
      {/* names under their dots, Jxmy style: "Name (value)" */}
      {named.map((n) => {
        const r = get(n.id);
        const size = (n.big ? 54 : 40) * t;
        return (
          <div key={n.id} style={{ position: "absolute", left: X(r[2]) - 300, width: 600, top: Y(r[3]) + 16 * t, textAlign: "center",
            fontFamily: BEBAS, fontSize: size, color: INK, letterSpacing: 1, opacity: pop(n.at), whiteSpace: "nowrap" }}>
            {r[1]} (+{r[3].toFixed(1)})
          </div>
        );
      })}
      {/* Faker's face beside his dot when the camera lands */}
      {(() => {
        const sz = 150 * (0.4 + 0.6 * s), o = pop(climb1 - 2), ph = P("faker").photo;
        return ph ? (
          <div style={{ position: "absolute", left: X(fk[2]) - sz / 2, top: Y(fk[3]) - sz - 22 * t, width: sz, height: sz, borderRadius: "50%",
            overflow: "hidden", border: `${4 * t}px solid ${INK}`, opacity: o, transform: `scale(${0.85 + 0.15 * o})` }}>
            <Img src={staticFile(ph)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
          </div>) : null;
      })()}
      {voice && <Audio src={staticFile("vo/vo-assembled.mp3")} startFrom={Math.round(CLIMB_T0 * FPS)} endAt={Math.round(CLIMB_T1 * FPS)} />}
    </AbsoluteFill>
  );
};
