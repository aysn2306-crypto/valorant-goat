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
//   in one after another until they pile up across the frame. ay 20 Nov: real answers only, quoted word for word from
//   real articles (lol-second-goat/research/fan-answers.csv), each with its site and year. Then the one being talked
//   about comes forward and the rest dim.
const TAKES: { text: string; src: string; x: number; y: number; id?: string }[] = [
  { text: "“The second-best player of all time has got to be the LPL's Rookie.”", src: "RIFTFEED · 2023", x: 70, y: 120 },
  { text: "“2. Ryu \"Keria\" Min-seok (T1)”", src: "SPILLED.GG · 2026", x: 1200, y: 300, id: "keria" },
  { text: "“The true LPL goat and nearest to SGOAT is Xiaohu.”", src: "TEAM LIQUID · 2025", x: 70, y: 300 },
  { text: "“The GOAT label gets thrown around when people talk about him” (Chovy)", src: "SPILLED.GG · 2026", x: 70, y: 480, id: "chovy" },
  { text: "“the only one who could come close to matching Faker's status” (Uzi)", src: "HOTSPAWN · 2026", x: 70, y: 660 },
  // ay 20 Nov 14:36: Bengi taken off
];

const Bubble: React.FC<{ text: string; src: string; o: number; dim: number; lift: number }> = ({ text, src, o, dim, lift }) => (
  <div style={{ padding: "18px 30px", background: INK, borderRadius: 26, opacity: o * (1 - 0.6 * dim),
    transform: `scale(${(0.85 + 0.15 * o) * (1 + 0.1 * lift)})`, transformOrigin: "0% 50%", boxShadow: lift ? `0 0 0 ${4 * lift}px ${TEAL}` : undefined }}>
    <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "#6B7380", marginBottom: 6 }}>{src}</div>
    <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 36, color: "#1B1E25", whiteSpace: "nowrap" }}>{text}</div>
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
            <Bubble text={t.text} src={t.src} o={o} dim={cur && !me ? k : 0} lift={me ? k : 0} />
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
/** ay 20 Nov 14:36: one card that builds, no panel switch: the line, then the big number, then the years under it */
export const ModelCard: React.FC<{ text: string; value: string; unit: string; years: string; numAt: number; yearsAt: number }> = (p) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [p.numAt, p.numAt + 8], [0, 1], { ...clamp, easing: easeOut });
  const y = interpolate(f, [p.yearsAt, p.yearsAt + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 4, color: INK, transform: `translateY(${-40 * n}px)` }}>{p.text}</div>
      <div style={{ height: 300 * n, overflow: "hidden", opacity: n, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: BEBAS, fontSize: 260, lineHeight: 0.9, color: TEAL }}>{p.value}</div>
        <div style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 8, color: "#9BA3AE", marginTop: 6 }}>{p.unit}</div>
      </div>
      <div style={{ fontFamily: BEBAS, fontSize: 72, letterSpacing: 6, color: INK, opacity: y, transform: `translateY(${(1 - y) * 16}px)`, marginTop: 24 }}>{p.years}</div>
    </AbsoluteFill>
  );
};
export const CardThenNumber: React.FC<{ text: string; value: string; unit: string; at: number }> = ({ text, value, unit, at }) =>
  useCurrentFrame() < at ? <TextCard text={text} /> : <BigNumber value={value} unit={unit} />;

// Note: from Jxmy's small handwritten note over footage (E-F0qcmdWRA/graphs/x01_text-over-footage_handwritten-doesnt-work):
//   a short note near the subject with a hand-drawn arrow to it, then a smaller aside under it a beat later.
export const Note: React.FC<{ text: string; aside?: string; at: number; asideAt?: number; x: number; y: number; to: [number, number] }> = ({ text, aside, at, asideAt, x, y, to }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  const draw = interpolate(f, [at + 3, at + 13], [0, 1], { ...clamp, easing: easeOut });
  const ao = asideAt === undefined ? 0 : interpolate(f, [asideAt, asideAt + 4], [0, 1], clamp);
  const sx = x + text.length * 33 + 24, sy = y + 44; // arrow starts just after the note
  const mx = (sx + to[0]) / 2, my = Math.min(sy, to[1]) - 70;
  const len = Math.hypot(to[0] - sx, to[1] - sy) * 1.3;
  const ang = Math.atan2(to[1] - my, to[0] - mx);
  const head = (d: number) => `${to[0] - 26 * Math.cos(ang + d)},${to[1] - 26 * Math.sin(ang + d)}`;
  const shade = "0 3px 0 rgba(0,0,0,0.45)";
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, fontFamily: BEBAS, fontSize: 76, letterSpacing: 2, color: INK, opacity: o, textShadow: shade, whiteSpace: "nowrap" }}>{text}</div>
      {aside && <div style={{ position: "absolute", left: x + 6, top: y + 86, fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: TEAL, opacity: ao, textShadow: shade }}>{aside}</div>}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${sx} ${sy} Q ${mx} ${my} ${to[0]} ${to[1]}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.45))" }} />
        <path d={`M ${head(-0.5)} L ${to[0]} ${to[1]} L ${head(0.5)}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={draw > 0.95 ? 1 : 0} />
      </svg>
    </>
  );
};

// TextReveal: from Jxmy's highlighted page then big scrolling text (video-research/jxmy-graphics/videos/Rlyp8PLqFS0/
//   graphs/x04_text-reveal_highlighted-quote-then-big-text-scroll): a pale page, soft dark edges, the key words get a
//   marker highlight; then a hard cut to the same page with one big line sliding right to left.
export const TextReveal: React.FC<{ before: string; mark: string; after: string; markAt: number; scroll: string; scrollAt: number; scrollEnd: number }> = (p) => {
  const f = useCurrentFrame();
  const m = interpolate(f, [p.markAt, p.markAt + 10], [0, 100], { ...clamp, easing: easeOut });
  const big = f >= p.scrollAt;
  const x = interpolate(f, [p.scrollAt, p.scrollEnd], [1500, -2600], clamp);
  return (
    <AbsoluteFill style={{ background: "#E9E6DE" }}>
      {!big ? (
        <div style={{ position: "absolute", left: 140, right: 140, top: 430, fontFamily: "Inter", fontWeight: 500, fontSize: 52, lineHeight: 1.5, color: "#2A2C30" }}>
          {p.before}{" "}
          <span style={{ backgroundImage: `linear-gradient(90deg, ${TEAL} ${m}%, transparent ${m}%)`, padding: "0 6px" }}>{p.mark}</span>
          {" "}{p.after}
        </div>
      ) : (
        <div style={{ position: "absolute", left: x, top: 440, fontFamily: "Inter", fontWeight: 600, fontSize: 170, color: "#2A2C30", whiteSpace: "nowrap" }}>{p.scroll}</div>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)" }} />
    </AbsoluteFill>
  );
};

// ChapterTitle: from Jxmy's chapter titles over footage (eatF7QHwga4/graphs/x04_title-over-footage_impact-chapter-title):
//   the shot darkens a little, one word types on letter by letter in the middle, holds, cut.
export const ChapterTitle: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [at, at + text.length * 2], [0, text.length], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(10,12,16,0.35)" }}>
      <div style={{ fontFamily: BEBAS, fontSize: 200, letterSpacing: 24, color: INK, textShadow: "0 4px 0 rgba(0,0,0,0.4)", minHeight: 200 }}>{text.slice(0, n)}</div>
    </AbsoluteFill>
  );
};

// TypedNumber: from Jxmy's number typed over footage (E-F0qcmdWRA/graphs/x10_big-number-over-footage_0.002-percent-over-player):
//   a number types on character by character in the accent over the shot and holds.
export const TypedNumber: React.FC<{ text: string; at: number; sub?: string; subAt?: number }> = ({ text, at, sub, subAt }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [at, at + text.length * 2.5], [0, text.length], clamp));
  const so = subAt === undefined ? 0 : interpolate(f, [subAt, subAt + 5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 50%, rgba(10,12,16,${0.55 * Math.min(1, n)}) 0%, rgba(10,12,16,0) 60%)` }}>
      <div style={{ fontFamily: BEBAS, fontSize: 260, lineHeight: 1, color: TEAL, textShadow: "0 5px 0 rgba(0,0,0,0.45)", minHeight: 260 }}>{text.slice(0, n)}</div>
      {sub && <div style={{ fontFamily: BEBAS, fontSize: 56, letterSpacing: 4, color: INK, opacity: so, textShadow: "0 3px 0 rgba(0,0,0,0.45)" }}>{sub}</div>}
    </AbsoluteFill>
  );
};

/** Jxmy's number over footage, as a running count: 1 flip = 1 in 2 ... n flips = 1 in 2^n, stepping from `at` to `end` */
export const FlipCounter: React.FC<{ at: number; end: number; max?: number }> = ({ at, end, max = 9 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.max(1, Math.min(max, 1 + Math.floor(interpolate(f, [at, end], [0, max], clamp))));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 50%, rgba(10,12,16,0.55) 0%, rgba(10,12,16,0) 60%)" }}>
      <div style={{ fontFamily: BEBAS, fontSize: 260, lineHeight: 1, color: TEAL, textShadow: "0 5px 0 rgba(0,0,0,0.45)" }}>1 IN {(2 ** n).toLocaleString("en-GB")}</div>
      <div style={{ fontFamily: BEBAS, fontSize: 56, letterSpacing: 4, color: INK, textShadow: "0 3px 0 rgba(0,0,0,0.45)" }}>{n} COIN {n === 1 ? "FLIP" : "FLIPS"} IN A ROW</div>
    </AbsoluteFill>
  );
};

// ArticlePage: from Jxmy's article/research pages (video-research/jxmy-graphics/videos/E-F0qcmdWRA/graphs/
//   x03_article-page_research-abstract-highlight): a plain document page, the camera pushes in on the paragraph that
//   matters, the key line gets a marker highlight. Ours is our own page (our words, no site branding).
export const ArticlePage: React.FC<{ title: string; kicker: string; before: string; mark: string; after: string; markAt: number }> = (p) => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 70], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const s = 1 + 0.55 * push;
  const m = interpolate(f, [p.markAt, p.markAt + 12], [0, 100], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: "#E9E6DE", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 360, top: 330, width: 1200, transform: `scale(${s})`, transformOrigin: "50% 70%", color: "#2A2C30", fontFamily: "Inter" }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 2, color: "#7A7D84", textTransform: "uppercase" }}>{p.kicker}</div>
        <div style={{ fontSize: 64, fontWeight: 700, margin: "10px 0 26px" }}>{p.title}</div>
        <div style={{ height: 2, background: "#C9C5BB", marginBottom: 30 }} />
        <div style={{ fontSize: 34, lineHeight: 1.6, fontWeight: 400 }}>
          {p.before}{" "}
          <span style={{ backgroundImage: `linear-gradient(90deg, ${TEAL} ${m}%, transparent ${m}%)`, padding: "0 4px" }}>{p.mark}</span>
          {" "}{p.after}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)" }} />
    </AbsoluteFill>
  );
};

// EchoLenses: from Jxmy's echo title then lenses (XMaPrXzclaQ/graphs/x10_echo-title_statistics-accomplishments-echo-text-and-lenses):
//   a word with faint outlined copies stacked above and below it over the shot, then a row of round lenses, each
//   holding its own shot and name.
export const EchoLenses: React.FC<{ word: string; bg: string; lenses: { src: string; label: string }[]; lensAt: number }> = ({ word, bg, lenses, lensAt }) => {
  const f = useCurrentFrame();
  const spread = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  if (f < lensAt) {
    return (
      <AbsoluteFill>
        <StandIn src={bg} focus={[50, 35]} />
        <AbsoluteFill style={{ background: "rgba(10,12,16,0.45)" }} />
        {[-3, -2, -1, 1, 2, 3].map((k) => (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 470 + k * 74 * spread, textAlign: "center", fontFamily: BEBAS, fontSize: 120, letterSpacing: 8,
            color: "transparent", WebkitTextStroke: `2px rgba(242,242,238,${0.7 - Math.abs(k) * 0.16})` }}>{word}</div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: BEBAS, fontSize: 120, letterSpacing: 8, color: INK }}>{word}</div>
      </AbsoluteFill>
    );
  }
  const d = 270, gap = 26, x0 = (1920 - (lenses.length * d + (lenses.length - 1) * gap)) / 2;
  return (
    <AbsoluteFill style={{ background: "#121418" }}>
      {lenses.map((l, i) => {
        const o = interpolate(f, [lensAt + i * 3, lensAt + i * 3 + 8], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div key={l.label} style={{ position: "absolute", left: x0 + i * (d + gap), top: 540 - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden",
            border: `6px solid #2C3038`, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)", opacity: o, transform: `scale(${0.8 + 0.2 * o})` }}>
            <Img src={staticFile(l.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
            <AbsoluteFill style={{ background: "rgba(10,12,16,0.35)", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: INK, textAlign: "center", lineHeight: 1 }}>{l.label}</div>
            </AbsoluteFill>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** ay 20 Nov 14:38: the real quote card ay supplied (Polymarket card via lolesports). The top strip with the Polymarket
 *  and Worlds logos is cropped off (no Riot logos). File in public/_local/refs (not in git). */
// ay 21 Nov 17:07: a laughing emoji pops up beside the "Guma era" photo. ay supplies the image (17:15): set GUMA_EMOJI
// to its file in public/_local when it lands; until then nothing shows.
const GUMA_EMOJI: string | null = null;
export const GumaQuoteCard: React.FC<{ emojiAt?: number }> = ({ emojiAt }) => {
  const f = useCurrentFrame();
  const eK = emojiAt === undefined ? 0 : interpolate(f, [emojiAt, emojiAt + 8], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const o = interpolate(f, [0, 6], [0, 1], clamp);
  const s = interpolate(f, [0, 120], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile("_local/refs/guma-quote.jpg")} style={{ height: 1000, opacity: o, transform: `scale(${s})`, boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }} />
      {GUMA_EMOJI && eK > 0 && <Img src={staticFile(GUMA_EMOJI)} style={{ position: "absolute", right: 150, top: 150, width: 180, height: 180, objectFit: "contain",
        transform: `scale(${eK}) rotate(${Math.sin(f / 4) * 8}deg)` }} />}
    </AbsoluteFill>
  );
};

// Gumayusi's quote over his footage (Jxmy quote on dark, jxmy-graphics GPH4nK5sQ-8 x10); the photo card is gone (ay 20 Nov)
export const QuoteOnClip: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 220px" }}>
      <div style={{ opacity: o, textAlign: "center" }}>
        <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 60, lineHeight: 1.3, color: INK }}>"If my goal was to become the best player in the world, I couldn't stay with T1 forever."</div>
        <div style={{ fontFamily: BEBAS, fontSize: 36, letterSpacing: 3, color: "#9BA3AE", marginTop: 24 }}>GUMAYUSI · DAILY ESPORTS (TRANSLATED)</div>
      </div>
    </AbsoluteFill>
  );
};
