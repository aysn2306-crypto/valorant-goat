// ay 20 Nov (draft-7 note at 1:20): "we need the graph or a demonstration that shows his trophies were getting cut out".
// Version 1 of the model averaged every season of a career, so Faker's Worlds titles were spread over 14 seasons.
// A season-by-season column chart, 2013 to 2026: a full column in each Worlds year, nothing in the others. On
// "averaging" a dashed line drops to the average (6 titles over 14 seasons), and on "less" every column is cut down
// to it: the cut-off tops turn red and fall away. Data: Faker's Worlds years (Liquipedia, league.json titles.worlds = 6).
// AbsoluteCinema: a small "ABSOLUTE CINEMA" sticker for ay's "low-key cinema" aside (stands in for the meme image).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const BAD = "#E06A5A";
const WORLDS = [2013, 2015, 2016, 2023, 2024, 2025];

export const AveragedCups: React.FC<{ dropAt: number; cutAt: number }> = ({ dropAt, cutAt }) => {
  const f = useCurrentFrame();
  const years = Array.from({ length: 14 }, (_, i) => 2013 + i);
  const X0 = 250, X1 = 1700, Y0 = 250, Y1 = 830, H = Y1 - Y0;
  const step = (X1 - X0) / years.length, bw = step * 0.62;
  const avg = WORLDS.length / years.length; // 0.43
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const drop = interpolate(f, [dropAt, dropAt + 20], [0, 1], { ...clamp, easing: inOut });
  const lineY = Y0 + (Y1 - Y0) * (1 - (1 - (1 - avg) * drop)); // from the top of the columns down to the average
  const cut = interpolate(f, [cutAt, cutAt + 24], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: X0, top: 70, opacity: tO, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>FAKER'S WORLDS TITLES, MODEL VERSION 1</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0 - 20} x2={X1} y1={Y1} y2={Y1} stroke={INK} strokeOpacity={0.6} strokeWidth={3} opacity={tO} />
        {years.map((y, i) => {
          const x = X0 + i * step + (step - bw) / 2;
          const won = WORLDS.includes(y);
          const grow = interpolate(f, [4 + i, 16 + i], [0, 1], { ...clamp, easing: easeOut });
          return (
            <g key={y} opacity={tO}>
              {won && <>
                {/* the part that stays */}
                <rect x={x} y={Y1 - Math.min(H * grow, H * avg)} width={bw} height={Math.min(H * grow, H * avg)} fill={TEAL} />
                {/* the part above the average, cut off and falling away */}
                {grow > 0.43 && <rect x={x} y={Y1 - H * grow + cut * 140} width={bw} height={Math.max(0, H * grow - H * avg)}
                  fill={cut > 0.02 ? "none" : TEAL} stroke={cut > 0.02 ? BAD : "none"} strokeWidth={4} strokeDasharray={cut > 0.02 ? "10 8" : undefined} opacity={1 - cut * 0.85} />}
              </>}
              <text x={x + bw / 2} y={Y1 + 44} textAnchor="middle" fontFamily={BEBAS} fontSize={30} fill={won ? INK : MUTE}>{"'" + String(y).slice(2)}</text>
              {won && <text x={x + bw / 2} y={Y1 - H * grow - 16 + cut * 140} textAnchor="middle" fontFamily={BEBAS} fontSize={28} fill={cut > 0.5 ? BAD : INK} opacity={1 - cut * 0.6}>WORLDS</text>}
            </g>
          );
        })}
        {drop > 0 && <line x1={X0 - 20} x2={X1} y1={lineY} y2={lineY} stroke={INK} strokeWidth={3} strokeDasharray="14 10" />}
      </svg>
      {drop > 0 && <div style={{ position: "absolute", left: X1 + 20, top: lineY - 44, width: 200, fontFamily: BEBAS, fontSize: 34, lineHeight: 1, color: INK }}>EVERY SEASON<br />AVERAGED</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 3, color: BAD,
        opacity: cut, transform: `translateY(${(1 - cut) * 16}px)` }}>EACH TITLE WORTH LESS</div>
    </AbsoluteFill>
  );
};

export const AbsoluteCinema: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 6, out - 6, out], [0, 1, 1, 0], clamp);
  const s = interpolate(f, [at, at + 8], [1.4, 1], { ...clamp, easing: easeOut });
  if (f < at || f > out) return null;
  return (
    <div style={{ position: "absolute", right: 120, top: 120, opacity: k, transform: `rotate(-6deg) scale(${s})`, background: "#0B0B0F", border: `5px solid ${INK}`,
      padding: "14px 30px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 64, letterSpacing: 4, color: INK, textAlign: "center", lineHeight: 1 }}>
      ABSOLUTE<br />CINEMA
    </div>
  );
};

/** ay 20 Nov: a tiny Twitch-chat style line over the DK stomp ("DK LOL"), small, bottom left, then gone */
export const ChatLine: React.FC<{ user: string; text: string; at: number }> = ({ user, text, at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 3, at + 50, at + 56], [0, 1, 1, 0], clamp);
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, bottom: 120, opacity: k, fontFamily: "Inter", fontSize: 26, color: "#EFEFF1", background: "rgba(14,14,16,0.72)", padding: "6px 12px", borderRadius: 4 }}>
      <span style={{ fontWeight: 700, color: "#9147FF" }}>{user}</span>: {text}
    </div>
  );
};
