// Uzi and Bengi: where fans put them against where the model puts them (ay 20 Nov: the old card graphic repeated the
// six-part cards, so this is a new shape). A slope chart on a rank axis (#1 at the top): two points in the "top 10 on
// most lists" band on the left, the model's rank on the right (league-v14.json: Uzi #21, Bengi #44), the line dropping
// as each is said, then the notes the model can't count. Shape after Jxmy's ranked-list climbs (jxmy-graphs
// 4lbvnNVGd-I g03) read sideways: rank down the side, a camera-free two-column compare.
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
const MUTE = "#9BA3AE";
const BAD = "#E06A5A";

type Row = { id: string; fan: number; model: number; at: number; notes: { text: string; at: number; bad?: boolean }[] };

export const FansVsModel: React.FC<{ rows: Row[]; stamp?: { text: string; at: number } }> = ({ rows, stamp }) => {
  const f = useCurrentFrame();
  const XL = 620, XR = 1240, Y0 = 210, Y1 = 900, RMAX = 50;
  const Y = (r: number) => Y0 + ((r - 1) / (RMAX - 1)) * (Y1 - Y0);
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK, opacity: tO }}>FANS VS THE MODEL</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* rank axis on the left, #1 at the top */}
        <line x1={XL - 170} x2={XL - 170} y1={Y0} y2={Y1} stroke={INK} strokeOpacity={0.5} strokeWidth={3} opacity={tO} />
        {[1, 10, 20, 30, 40, 50].map((r) => <g key={r} opacity={tO}>
          <line x1={XL - 170} x2={XR + 60} y1={Y(r)} y2={Y(r)} stroke={INK} strokeOpacity={0.07} strokeWidth={2} />
          <text x={XL - 190} y={Y(r) + 11} textAnchor="end" fontFamily={BEBAS} fontSize={32} fill={MUTE}>#{r}</text></g>)}
        {/* the fans' band */}
        <rect x={XL - 60} y={Y(1) - 10} width={120} height={Y(10) - Y(1) + 20} fill={INK} opacity={0.08 * tO} />
        <text x={XL} y={Y0 - 34} textAnchor="middle" fontFamily={BEBAS} fontSize={34} letterSpacing={2} fill={MUTE} opacity={tO}>MOST FAN LISTS</text>
        <text x={XR} y={Y0 - 34} textAnchor="middle" fontFamily={BEBAS} fontSize={34} letterSpacing={2} fill={MUTE} opacity={tO}>THE MODEL</text>
        {rows.map((r) => {
          const k = interpolate(f, [r.at, r.at + 22], [0, 1], { ...clamp, easing: inOut });
          const x = XL + (XR - XL) * k, y = Y(r.fan) + (Y(r.model) - Y(r.fan)) * k;
          return <g key={r.id} opacity={interpolate(f, [r.at - 8, r.at], [0, 1], clamp)}>
            <line x1={XL} y1={Y(r.fan)} x2={x} y2={y} stroke={BAD} strokeWidth={5} />
            <circle cx={XL} cy={Y(r.fan)} r={10} fill={INK} />
            <circle cx={x} cy={y} r={12} fill={k > 0.98 ? BAD : INK} />
          </g>;
        })}
      </svg>
      {rows.map((r) => {
        const o = interpolate(f, [r.at - 8, r.at], [0, 1], clamp);
        const k = interpolate(f, [r.at + 16, r.at + 24], [0, 1], { ...clamp, easing: easeOut });
        return (
          <React.Fragment key={r.id}>
            <div style={{ position: "absolute", left: XL - 150, top: Y(r.fan) - 34, display: "flex", alignItems: "center", gap: 12, opacity: o, flexDirection: "row-reverse" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `3px solid ${INK}` }}>
                {P(r.id).photo && <Img src={staticFile(P(r.id).photo!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
            </div>
            <div style={{ position: "absolute", left: XL - 340, width: 160, textAlign: "right", top: Y(r.fan) - 26, fontFamily: BEBAS, fontSize: 46, color: INK, opacity: o }}>{P(r.id).name.toUpperCase()}</div>
            <div style={{ position: "absolute", left: XR + 30, top: Y(r.model) - 40, fontFamily: BEBAS, fontSize: 76, color: BAD, opacity: k }}>#{r.model}</div>
            {/* what the model can't count, written beside the model's rank */}
            <div style={{ position: "absolute", left: XR + 170, top: Y(r.model) - 46, display: "flex", flexDirection: "column", gap: 4 }}>
              {r.notes.map((n) => {
                const no = interpolate(f, [n.at, n.at + 8], [0, 1], { ...clamp, easing: easeOut });
                return <div key={n.text} style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: n.bad ? BAD : TEAL, opacity: no, transform: `translateX(${(1 - no) * 20}px)` }}>{n.text}</div>;
              })}
            </div>
          </React.Fragment>
        );
      })}
      {stamp && f >= stamp.at && (
        <div style={{ position: "absolute", left: XL - 420, top: Y(rows[0].fan) - 110, transform: `rotate(-8deg) scale(${interpolate(f, [stamp.at, stamp.at + 6], [1.4, 1], clamp)})`,
          border: `6px solid ${BAD}`, padding: "4px 18px", fontFamily: BEBAS, fontSize: 70, color: BAD, letterSpacing: 3 }}>{stamp.text}</div>
      )}
    </AbsoluteFill>
  );
};
