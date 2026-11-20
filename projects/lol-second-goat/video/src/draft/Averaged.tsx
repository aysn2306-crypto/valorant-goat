// ay 20 Nov (draft-7 note at 1:20): "we need the graph or a demonstration that shows his trophies were getting cut out".
// Version 1 of the model averaged every season of a career, so Faker's Worlds titles were spread over 14 seasons.
// A season-by-season column chart, 2013 to 2026: a full column in each Worlds year, nothing in the others. On
// "averaging" a dashed line drops to the average (6 titles over 14 seasons), and on "less" every column is cut down
// to it: the cut-off tops turn red and fall away. Data: Faker's Worlds years (Liquipedia, league.json titles.worlds = 6).
// AbsoluteCinema: the real meme image ay supplied (20 Nov 15:06, black bars cut off) as a sticker on the "cinema" aside.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
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

// Script 16:05 (line 13): version 1 had Faker 14th because trophies were only 28% of the score, and every season was
// averaged. Beat 1: Faker's version-1 score as one bar, trophies a thin gold slice (28%) with his six Worlds cups
// squeezed inside it. Beat 2 (on "averaging"): the bar moves up and his season ratings come in under it
// (data/csv/rapm_seasons.csv, column r), a dashed line drops to the career average, and on "dragging" the seasons
// under that line turn coral: the years pulling the average down.
const SEASONS: [number, number][] = [[2013, 0.956], [2014, 0.865], [2015, 0.768], [2016, 0.885], [2017, 0.847], [2018, 0.527], [2019, 0.877],
  [2020, 0.653], [2021, 0.751], [2022, 0.851], [2023, 1.167], [2024, 0.82], [2025, 0.86], [2026, 0.757]];
const GOLD = "#E8B04B";
export const TrophyWeight: React.FC<{ barAt: number; cupsAt: number; avgAt: number; dragAt: number }> = ({ barAt, cupsAt, avgAt, dragAt }) => {
  const f = useCurrentFrame();
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const fill = interpolate(f, [barAt, barAt + 22], [0, 1], { ...clamp, easing: easeOut });
  const up = interpolate(f, [avgAt, avgAt + 18], [0, 1], { ...clamp, easing: inOut });
  const BX0 = 160, BX1 = 1760, BW = BX1 - BX0, TW = BW * 0.28;
  const by = interpolate(up, [0, 1], [450, 170]), bh = interpolate(up, [0, 1], [150, 90]);
  // season chart
  const X0 = 220, X1 = 1700, Y1 = 900, H = 420, step = (X1 - X0) / SEASONS.length, bw = step * 0.6, MAX = 1.2;
  const avg = SEASONS.reduce((a, [, r]) => a + r, 0) / SEASONS.length;
  const chartO = interpolate(f, [avgAt + 6, avgAt + 16], [0, 1], clamp);
  const drop = interpolate(f, [avgAt + 22, avgAt + 44], [0, 1], { ...clamp, easing: inOut });
  const peakY = Y1 - H * (1.167 / MAX), avgY = Y1 - H * (avg / MAX);
  const lineY = peakY + (avgY - peakY) * drop;
  const drag = interpolate(f, [dragAt, dragAt + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: BX0, top: 60, opacity: tO, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>FAKER'S SCORE, MODEL VERSION 1</div>
      {/* the score bar: trophies a thin gold slice, everything else grey */}
      <div style={{ position: "absolute", left: BX0, top: by, width: BW, height: bh, opacity: tO, border: `3px solid ${INK}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: TW * fill, background: GOLD }} />
        <div style={{ position: "absolute", left: TW, top: 0, bottom: 0, width: (BW - TW - 3) * fill, background: "#3A3D42" }} />
        {SIXCUPS(f, cupsAt, TW, bh)}
      </div>
      <div style={{ position: "absolute", left: BX0, top: by + bh + 14, opacity: fill, fontFamily: BEBAS, fontSize: interpolate(up, [0, 1], [56, 40]), color: GOLD, letterSpacing: 2 }}>TROPHIES 28%</div>
      <div style={{ position: "absolute", right: 1920 - BX1, top: by + bh + 14, opacity: fill, fontFamily: BEBAS, fontSize: interpolate(up, [0, 1], [56, 40]), color: MUTE, letterSpacing: 2 }}>EVERYTHING ELSE 72%</div>
      {chartO > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: chartO }}>
        <text x={X0 - 20} y={Y1 - H - 30} fontFamily={BEBAS} fontSize={34} fill={MUTE} letterSpacing={2}>HIS RATING, EVERY SEASON</text>
        <line x1={X0 - 20} x2={X1} y1={Y1} y2={Y1} stroke={INK} strokeOpacity={0.6} strokeWidth={3} />
        {SEASONS.map(([y, r], i) => {
          const x = X0 + i * step + (step - bw) / 2, h = H * (r / MAX);
          const grow = interpolate(f, [avgAt + 6 + i * 1.5, avgAt + 18 + i * 1.5], [0, 1], { ...clamp, easing: easeOut });
          const low = r < avg;
          return <g key={y}>
            <rect x={x} y={Y1 - h * grow} width={bw} height={h * grow} fill={low && drag > 0.5 ? BAD : y === 2023 ? TEAL : "#6B7178"} />
            <text x={x + bw / 2} y={Y1 + 42} textAnchor="middle" fontFamily={BEBAS} fontSize={30} fill={MUTE}>{"'" + String(y).slice(2)}</text>
          </g>;
        })}
        {drop > 0 && <line x1={X0 - 20} x2={X1} y1={lineY} y2={lineY} stroke={INK} strokeWidth={3} strokeDasharray="14 10" />}
        {drop > 0 && <text x={X1 + 18} y={lineY + 12} fontFamily={BEBAS} fontSize={34} fill={INK}>AVERAGE</text>}
        <text x={X0 + 10 * step + step / 2} y={peakY - 16} textAnchor="middle" fontFamily={BEBAS} fontSize={30} fill={TEAL}>BEST</text>
      </svg>}
    </AbsoluteFill>
  );
};
function SIXCUPS(f: number, at: number, w: number, h: number) {
  const n = 6, cw = w / n, s = Math.min(cw * 0.7, h * 0.6);
  return Array.from({ length: n }, (_, i) => {
    const k = interpolate(f, [at + i * 3, at + i * 3 + 8], [0, 1], { ...clamp, easing: easeOut });
    return <svg key={i} width={s} height={s} viewBox="0 0 24 24" style={{ position: "absolute", left: i * cw + (cw - s) / 2, top: (h - s) / 2 - 3, opacity: k, transform: `scale(${0.5 + 0.5 * k})` }}>
      <path d="M6 3h12v3h3v2a5 5 0 0 1-5 5h-.4A6 6 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A6 6 0 0 1 8.4 13H8a5 5 0 0 1-5-5V6h3V3zm0 5H5a3 3 0 0 0 1 2.2V8zm12 0v2.2A3 3 0 0 0 19 8h-1z" fill="#0F1012" />
    </svg>;
  });
}

export const AbsoluteCinema: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 6, out - 6, out], [0, 1, 1, 0], clamp);
  const s = interpolate(f, [at, at + 8], [1.4, 1], { ...clamp, easing: easeOut });
  if (f < at || f > out) return null;
  return (
    <div style={{ position: "absolute", right: 110, top: 110, opacity: k, transform: `rotate(-4deg) scale(${s})`, border: `6px solid ${INK}`, lineHeight: 0 }}>
      <Img src={staticFile("_local/refs/absolute-cinema.png")} style={{ width: 620, height: "auto", display: "block" }} />
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
