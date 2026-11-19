// Jxmy camera climb (video-research/graphs-0.5s-jxmy-machineloling/VCIKek1f-Hs g3 "climb 20-95" and g6 "warriors wins
// climb 399"): the chart opens tight on the pack, big axis numbers; the camera rises through empty space with the axis
// numbers scrolling past until it lands on the one dot way above everyone, "Name (value)" under it; then it pulls back
// to the whole chart and a dashed bracket says how big the gap is. Plain white dots on a grey concrete ground.
// Data: model v13 team impact (plus-minus wins added over a career, stills.json "impact").
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { L, W } from "../data/vo";
import S from "../data/stills.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";

/** Grey concrete ground like Jxmy's: flat mid grey, fine grain, soft blotches, darker edges */
export const Concrete: React.FC = () => (
  <AbsoluteFill style={{ background: "#3A3C3A" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <filter id="blot"><feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={3} seed={4} />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 -0.08" /></filter>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={9} />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" /></filter>
      <rect width={1920} height={1080} filter="url(#blot)" />
      <rect width={1920} height={1080} filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)" }} />
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

  // camera: centre (data units) and zoom; 1 = tight on the pack
  const climb0 = A(W("37", "faker")), climb1 = climb0 + 48;
  const out0 = A(W("37", "then")) - 4, out1 = out0 + 30;
  const kUp = interpolate(f, [climb0, climb1], [0, 1], { ...clamp, easing: inOut });
  const kOut = interpolate(f, [out0, out1], [0, 1], { ...clamp, easing: inOut });
  const cy = 40 + kUp * (300 - 40) + kOut * (140 - 300);
  const s = 1 - kOut * 0.53, sx = 1 - kOut * 0.28;
  const cx = 850 + kOut * 60;
  const KY = 4.6, KX = 0.88;
  const X = (g: number) => 960 + (g - cx) * KX * sx;
  const Y = (v: number) => 560 - (v - cy) * KY * s;
  const t = 0.55 + 0.45 * s; // text keeps most of its size when the camera pulls back

  const pop = (a: number) => interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
  const dotsIn = (i: number) => interpolate(f, [2 + (i % 40) * 0.4, 10 + (i % 40) * 0.4], [0, 1], clamp);
  const ticks = Array.from({ length: 20 }, (_, i) => -40 + i * 20);
  const named: { id: string; at: number; big?: boolean }[] = [
    { id: "xiaohu", at: climb0 + 14 }, { id: "jackeylove", at: climb0 + 10 }, { id: "ruler", at: A(W("37", "ruler")) },
    { id: "faker", at: climb1 - 6, big: true }];
  const gap = Math.round(fk[3] - ru[3]);

  return (
    <AbsoluteFill>
      <Concrete />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* y axis and its big numbers */}
        <line x1={X(0) - 10} x2={X(0) - 10} y1={Y(-40) + 6} y2={Y(350)} stroke={INK} strokeWidth={5 * t} />
        <line x1={X(0) - 12} x2={X(1700)} y1={Y(-40) + 6} y2={Y(-40) + 6} stroke={INK} strokeWidth={5 * t} />
        {ticks.map((v) => (
          <text key={v} opacity={v % 40 === 0 ? 1 : 1 - kOut} x={X(0) - 30 * t} y={Y(v) + 22 * t} textAnchor="end" fontFamily={BEBAS} fontSize={66 * t} fill={INK}>{v > 0 ? "+" + v : v}</text>))}
        {[0, 400, 800, 1200, 1600].map((g) => (
          <text key={g} x={X(g)} y={Y(-40) + 64 * t} textAnchor="middle" fontFamily={BEBAS} fontSize={44 * t} fill={INK}>{g.toLocaleString("en-GB")}</text>))}
        <text x={X(850)} y={Y(-40) + 116 * t} textAnchor="middle" fontFamily={BEBAS} fontSize={40 * t} fill={INK} letterSpacing={2}>GAMES PLAYED</text>
        <text transform={`translate(${X(0) - 150 * t} ${Y(cy)}) rotate(-90)`} textAnchor="middle" fontFamily={BEBAS} fontSize={40 * t} fill={INK} letterSpacing={2}>WINS ADDED</text>
        <line x1={X(0) - 10} x2={X(1700)} y1={Y(0)} y2={Y(0)} stroke={INK} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="10 10" />
        {/* every player */}
        {rows.map((r, i) => {
          const o = dotsIn(i) * (r[0] === "faker" ? 1 : named.some((n) => n.id === r[0]) ? 0.95 : 0.6);
          return <circle key={r[0]} cx={X(r[2])} cy={Y(r[3])} r={(r[0] === "faker" ? 12 : 7) * t} fill={INK} opacity={o} />;
        })}
        {/* the gap, once the camera has pulled back */}
        <g opacity={pop(out1 - 2)}>
          <line x1={X(1730)} x2={X(1730)} y1={Y(fk[3])} y2={Y(ru[3])} stroke={INK} strokeWidth={4} strokeDasharray="14 10" />
          <line x1={X(1210)} x2={X(1730)} y1={Y(ru[3])} y2={Y(ru[3])} stroke={INK} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
          <line x1={X(1600)} x2={X(1730)} y1={Y(fk[3])} y2={Y(fk[3])} stroke={INK} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
          <text x={X(1730) + 22} y={Y((fk[3] + ru[3]) / 2) - 8} fontFamily={BEBAS} fontSize={50} fill={INK}>{gap} more wins added</text>
          <text x={X(1730) + 22} y={Y((fk[3] + ru[3]) / 2) + 44} fontFamily={BEBAS} fontSize={50} fill={INK}>than number two</text>
        </g>
      </svg>
      {/* names under their dots, Jxmy style: "Name (value)" */}
      {named.map((n) => {
        const r = get(n.id);
        const size = (n.big ? 54 : 40) * t;
        return (
          <div key={n.id} style={{ position: "absolute", left: X(r[2]) - 300, width: 600, top: Y(r[3]) + 16 * t, textAlign: "center",
            fontFamily: BEBAS, fontSize: size, color: INK, letterSpacing: 1, opacity: pop(n.at), whiteSpace: "nowrap" }}>
            {r[1]} (+{Math.round(r[3])})
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
