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

// BigWord: from Jxmy's giant word over footage (video-research/jxmy-graphics/videos/GPH4nK5sQ-8/graphs/
//   x05_word-cutout_win-word-filled-with-footage): one huge word, light and see-through, cut in over the shot and held.
export const BigWord: React.FC<{ text: string; at: number; y?: number; size?: number }> = ({ text, at, y = 600, size = 440 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  const s = interpolate(f, [at, at + 10, at + 120], [1.08, 1.0, 0.97], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - size / 2, textAlign: "center", fontFamily: BEBAS, fontSize: size, lineHeight: 1,
      letterSpacing: 6, color: INK, opacity: 0.84 * o, transform: `scale(${s})`, whiteSpace: "nowrap" }}>{text}</div>
  );
};

// CommentPile: from Jxmy's comment bubbles (video-research/jxmy-graphics/videos/WyYOm44eQyI/graphs/
//   x02_comment-bubbles_article-highlight-then-comments-pile): white bubbles with a small avatar and a name line, popping
//   in one after another until they pile up across the frame. Ours are written by us to stand for the debate, so the
//   avatars and names are blank (no real users). Then the bubble being talked about comes forward and the rest dim.
const TAKES: { text: string; x: number; y: number; id?: string }[] = [
  { text: "keria. best support ever, not close", x: 90, y: 90, id: "keria" },
  { text: "chovy's mechanics are on another level", x: 930, y: 150, id: "chovy" },
  { text: "uzi. no worlds but nobody played adc like him", x: 60, y: 290 },
  { text: "ruler is #2 and nobody talks about it", x: 1010, y: 350 },
  { text: "rookie in 2014 was unreal", x: 150, y: 490 },
  { text: "knight after THIS worlds??", x: 1000, y: 550 },
  { text: "bengi has 3 rings, just saying", x: 1060, y: 750 },
  { text: "deft. the longevity alone", x: 80, y: 690 },
  { text: "caps carried the whole west", x: 200, y: 880 },
  { text: "theshy peak > everyone's peak", x: 960, y: 930 },
];

const Bubble: React.FC<{ text: string; o: number; dim: number; lift: number }> = ({ text, o, dim, lift }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 28px 16px 16px", background: INK, borderRadius: 40, opacity: o * (1 - 0.6 * dim),
    transform: `scale(${(0.85 + 0.15 * o) * (1 + 0.1 * lift)})`, transformOrigin: "0% 50%", boxShadow: lift ? `0 0 0 ${4 * lift}px ${TEAL}` : undefined }}>
    <div style={{ width: 62, height: 62, borderRadius: 31, background: "#9BA3AE", flex: "none" }} />
    <div>
      <div style={{ width: 90, height: 10, borderRadius: 5, background: "#C4C9CF", marginBottom: 8 }} />
      <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 38, color: "#1B1E25", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </div>
);

/** cues (frames in the scene): pile from..to, then the bubble with that id comes forward at each focus cue; all relight at `all` */
export const CommentPile: React.FC<{ cues: { from: number; to: number; focus: { id: string; at: number }[]; all: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const step = (cues.to - cues.from) / (TAKES.length - 1);
  const cur = [...cues.focus].reverse().find((c) => f >= c.at && f < cues.all);
  const k = cur ? interpolate(f, [cur.at, cur.at + 8], [0, 1], { ...clamp, easing: easeOut }) : 0;
  return (
    <AbsoluteFill>
      {TAKES.map((t, i) => {
        const o = interpolate(f, [cues.from + i * step, cues.from + i * step + 5], [0, 1], { ...clamp, easing: easeOut });
        const me = cur && cur.id === t.id;
        return (
          <div key={t.text} style={{ position: "absolute", left: t.x, top: t.y, zIndex: me ? 2 : 1 }}>
            <Bubble text={t.text} o={o} dim={cur && !me ? k : 0} lift={me ? k : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// TextCard + BigNumber: from Jxmy's small words on black (video-research/jxmy-graphics/videos/XyihDTdpF8w/graphs/
//   x02_text-card_small-word-on-black) and his big number card (WyYOm44eQyI/graphs/x04_big-number_100-points-serif):
//   a hard cut to a plain ground, one short line in the middle; for the number, the number big with a tiny unit
//   under it. Nothing moves; the cut is the effect.
export const TextCard: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 4, color: INK }}>{text}</div>
  </AbsoluteFill>
);
export const BigNumber: React.FC<{ value: string; unit: string }> = ({ value, unit }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: BEBAS, fontSize: 300, lineHeight: 0.9, color: INK }}>{value}</div>
    <div style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 8, color: "#9BA3AE", marginTop: 6 }}>{unit}</div>
  </AbsoluteFill>
);

// VerdictWord: from Jxmy's verdict words (E-F0qcmdWRA/graphs/x17_verdict-word_myth-to-true-swap): one word in the
//   middle of the shot, cut in on its word, then swapped for the verdict on a hard cut.
export const VerdictWord: React.FC<{ words: { text: string; at: number; accent?: boolean }[]; size?: number }> = ({ words, size = 300 }) => {
  const f = useCurrentFrame();
  const cur = [...words].reverse().find((w) => f >= w.at);
  if (!cur) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: BEBAS, fontSize: size, lineHeight: 1, letterSpacing: 6, color: cur.accent ? TEAL : INK,
        textShadow: "0 4px 0 rgba(0,0,0,0.35)" }}>{cur.text}</div>
    </AbsoluteFill>
  );
};

/** a text card that cuts to a big number at `at` */
export const CardThenNumber: React.FC<{ text: string; value: string; unit: string; at: number }> = ({ text, value, unit, at }) =>
  useCurrentFrame() < at ? <TextCard text={text} /> : <BigNumber value={value} unit={unit} />;
