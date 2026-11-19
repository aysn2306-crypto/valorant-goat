// Jxmy's non-graph graphics over footage, made in our look (Bebas, INK, one TEAL accent).
// NameTag: from Jxmy's lower-third name tags (video-research/jxmy-graphics/videos/E-F0qcmdWRA/graphs/
//   x12_name-tag_player-name-age-height-lower-thirds): a small "Name | detail" line over one giant value, set beside
//   the player's head, cut in with the shot and held.
// TextRing: from Jxmy's ring of words round a player (E-F0qcmdWRA x19 circular-text-ring): phrases written along a
//   circle round the head, added one at a time, the ring turning slowly.
// `bg` is the footage under it; the samples use a still with a slow push as a stand-in.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";

/** a still standing in for footage: cover, slow push in, a little darker so type reads */
export const StandIn: React.FC<{ src: string; focus?: [number, number]; push?: number }> = ({ src, focus = [50, 40], push = 0.06 }) => {
  const f = useCurrentFrame();
  const s = 1 + push * Math.min(1, f / 240);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${focus[0]}% ${focus[1]}%` }} />
      <AbsoluteFill style={{ background: "rgba(10,12,16,0.22)" }} />
    </AbsoluteFill>
  );
};

/** at: frame the tag cuts in. x/y: top left of the tag. */
export const NameTag: React.FC<{ name: string; detail: string; value: string; at: number; x: number; y: number }> = ({ name, detail, value, at, x, y }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [at, at + 5], [0, 1], { ...clamp, easing: easeOut });
  const b = interpolate(f, [at + 3, at + 9], [0, 1], { ...clamp, easing: easeOut });
  const shade = "0 2px 0 rgba(0,0,0,0.35)";
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ fontFamily: BEBAS, fontSize: 52, letterSpacing: 2, color: INK, whiteSpace: "nowrap", textShadow: shade,
        clipPath: `inset(0 ${100 - 100 * a}% 0 0)` }}>{name}<span style={{ opacity: 0.6, margin: "0 14px" }}>|</span>{detail}</div>
      <div style={{ fontFamily: BEBAS, fontSize: 170, lineHeight: 0.86, color: TEAL, whiteSpace: "nowrap", textShadow: shade,
        clipPath: `inset(0 ${100 - 100 * b}% 0 0)` }}>{value}</div>
    </div>
  );
};

/** phrases are written round a circle at (cx, cy); each appears at its frame, the first one in the accent */
export const TextRing: React.FC<{ cx: number; cy: number; r: number; phrases: { text: string; at: number }[] }> = ({ cx, cy, r, phrases }) => {
  const f = useCurrentFrame();
  const turn = f * 0.12; // degrees a frame
  const n = phrases.length;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <path id="ring" d={`M ${cx - r} ${cy} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0`} />
      </defs>
      <g transform={`rotate(${turn} ${cx} ${cy})`}>
        {phrases.map((p, i) => {
          const o = interpolate(f, [p.at, p.at + 8], [0, 1], { ...clamp, easing: easeOut });
          const chars = Math.round(p.text.length * o);
          return (
            <text key={p.text} fontFamily={BEBAS} fontSize={52} letterSpacing={3} fill={i === 0 ? TEAL : INK}
              style={{ paintOrder: "stroke", stroke: "rgba(8,10,14,0.75)", strokeWidth: 6 }}>
              <textPath href="#ring" startOffset={`${(i / n) * 100}%`}>{p.text.slice(0, chars)}</textPath>
            </text>
          );
        })}
      </g>
    </svg>
  );
};

export const NAMETAG_FRAMES = 120, RING_FRAMES = 165;

export const SNameTag: React.FC = () => (
  <AbsoluteFill>
    <StandIn src="_local/knight-mvp-trophy-w26-final.jpg" focus={[56, 30]} />
    <NameTag name="KNIGHT" detail="BLG MID" value="FINALS MVP" at={12} x={150} y={110} />
  </AbsoluteFill>
);

export const STextRing: React.FC = () => (
  <AbsoluteFill>
    <StandIn src="_local/faker-lifts-trophy-w24-a.jpg" focus={[60, 35]} push={0.04} />
    <TextRing cx={1190} cy={455} r={250} phrases={[
      { text: "SIX WORLD TITLES", at: 10 }, { text: "TWO MSI TITLES", at: 40 }, { text: "ONE TEAM SINCE 2013", at: 70 }]} />
  </AbsoluteFill>
);
