// Sample panels for ay (19 Nov), built from the second reference study. Each runs on ay's real voiceover
// (voiceover-assembled, word times from voiceover-timing.json), so every change lands on its word.
// 1 SCards: Jxmy trading cards (video-research/jxmy-cards/MOTION.md): hard cut to navy, each card flips back to front in
//   8 frames as its word is said, then holds.
// 2 SElo: j3m Elo towers (chart-refs-2/05 0126, 0300): one line colour on black, height = rating, points flow loser to winner.
// 3 SPlusMinus: Thinking Basketball lineup grid (chart-refs-2/01 0650): rows of 5 v 5, solve for one player.
// 4 SPyramid: Jxmy pyramid layout (reference-board frame 32) with our round photos and rank badges, built bottom up,
//   Knight revealed last, then a 2.5 s ease in-out zoom (refs/ANIMATION.md).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { P } from "../lib/data";
import { CREAM } from "../stills/kit";
import { L, W, WA } from "../data/vo";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const VO = staticFile("vo/vo-assembled.mp3");
/** frame of a voiceover time (s) inside a clip that starts at `t0` */
const at = (t0: number) => (t: number) => Math.round((t - t0) * FPS);

const Voice: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <Audio src={VO} startFrom={Math.round(from * FPS)} endAt={Math.round(to * FPS)} />
);

export const Vignette: React.FC<{ bg: string }> = ({ bg }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 55%), ${bg}` }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
  </AbsoluteFill>
);

export const Cutout: React.FC<{ id: string; w: number; h: number }> = ({ id, w, h }) => {
  const p = P(id);
  return p.photo ? <Img src={staticFile(p.photo)} style={{ position: "absolute", left: 0, bottom: 0, width: w, height: h, objectFit: "cover", objectPosition: "50% 0%" }} /> : null;
};

// ---------------------------------------------------------------- 1. six part cards
const ICON: Record<string, React.ReactNode> = {
  trophy: <path d="M7 3h18v6c0 6-4 10-9 10s-9-4-9-10zM3 5h4v4c-2 0-4-1-4-4zM29 5h-4v4c2 0 4-1 4-4zM13 19h6v5h4v4H9v-4h4z" />,
  skill: <g><circle cx="16" cy="16" r="10" fill="none" strokeWidth="3" /><circle cx="16" cy="16" r="3" /><path d="M16 1v8M16 23v8M1 16h8M23 16h8" strokeWidth="3" /></g>,
  clutch: <path d="M18 1L5 18h9l-3 13 14-18h-9z" />,
  team: <g>{[6, 16, 26].map((x) => <circle key={x} cx={x} cy="11" r="4" />)}{[11, 21].map((x) => <circle key={x} cx={x} cy="22" r="4" />)}</g>,
  years: <path d="M7 2h18v3c0 5-6 8-6 11s6 6 6 11v3H7v-3c0-5 6-8 6-11S7 10 7 5z" />,
  medal: <g><path d="M9 1h5l3 9h-5zM23 1h-5l-3 9h5z" /><circle cx="16" cy="21" r="9" /></g>,
};
// ay 20 Nov: no names on these cards, an action photo per part (stand-ins from lol-second-goat/action-photos until ay picks)
// ay 20 Nov 15:28: the right player on each photo, named on the photo. Each card shows a player the model puts at or near
// the top of that part (v15.1 league.json cats): Faker trophies #1, Chovy skill, Knight big stage #1, Ruler team impact #2,
// Deft longevity #2 (Faker is #1, already on trophies), Knight recognition top 3 (the MVP award).
const PARTS: { name: string; icon: string; id: string; shot: string; pos?: string; who: string }[] = [
  { name: "TROPHIES", icon: "trophy", id: "faker", shot: "faker-holds-trophy-w24.jpg", pos: "55% 20%", who: "FAKER · WORLDS 2024" },
  { name: "SKILL", icon: "skill", id: "chovy", shot: "chovy-hand-on-mouse-w26-sf.jpg", pos: "50% 30%", who: "CHOVY · WORLDS 2026" },
  { name: "BIG GAMES\n& CLUTCH", icon: "clutch", id: "knight", shot: "bin-knight-celebrate-w26-final.jpg", pos: "68% 25%", who: "KNIGHT · WORLDS 2026" },
  { name: "TEAM\nIMPACT", icon: "team", id: "ruler", shot: "ruler-fists-up-w26-sf.jpg", pos: "50% 25%", who: "RULER · WORLDS 2026" },
  { name: "LONGEVITY", icon: "years", id: "deft", shot: "deft-talks-midgame-worlds2015-qf.jpg", pos: "50% 30%", who: "DEFT · WORLDS 2015" },
  { name: "RECOGNITION", icon: "medal", id: "knight", shot: "knight-mvp-trophy-w26-final.jpg", pos: "50% 25%", who: "KNIGHT · FINALS MVP" },
];
export const RED = "#C9412F", BLUE = "#3B78C4", YEL = "#F1C232";

const PartCard: React.FC<{ part: (typeof PARTS)[number]; w: number; h: number }> = ({ part, w, h }) => {
  const pad = 14, frameW = w - pad * 2, plateH = 104, photoH = h - pad * 2 - plateH - 10;
  return (
    <div style={{ width: w, height: h, background: RED, borderRadius: 6, position: "relative", overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
      {/* retro side stripes */}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.62, height: 18, background: CREAM }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.62 + 18, height: 18, background: BLUE }} />
      <div style={{ position: "absolute", left: pad, top: pad, width: frameW, height: h - pad * 2, borderRadius: 22, border: `7px solid ${YEL}`, background: RED, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: photoH, overflow: "hidden" }}>
          <Img src={staticFile(`_local/${part.shot}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: part.pos ?? "50% 30%" }} />
          {/* LOCKED (ay 20 Nov 15:48, again 19:18): NO names or event captions on these cards. `who` is a code note only. */}
        </div>
        <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: plateH, borderRadius: 14, background: BLUE, border: `4px solid ${YEL}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ fontFamily: F.title, fontSize: part.name.includes("\n") ? 30 : 36, lineHeight: 1.0, color: CREAM, letterSpacing: 1, textAlign: "center", whiteSpace: "pre-line" }}>{part.name}</div>
        </div>
      </div>
      {/* part icon, top right, where a maker's mark would sit */}
      <div style={{ position: "absolute", right: 26, top: 26, width: 54, height: 54, borderRadius: 27, background: YEL, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={32} height={32} viewBox="0 0 32 32" fill="#2A1A10" stroke="#2A1A10">{ICON[part.icon]}</svg>
      </div>
    </div>
  );
};
const CardBack: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ width: w, height: h, borderRadius: 6, background: `repeating-linear-gradient(45deg, ${BLUE} 0 14px, #2F64A8 14px 28px)`, border: `10px solid ${RED}` }} />
);
/** 8-frame flip, back to front, starting 15% too big and settling (cards/f_0746_000 -> f_0746_250 -> f_0747_250). */
export const Flip: React.FC<{ startAt: number; children: React.ReactNode; w: number; h: number }> = ({ startAt, children, w, h }) => {
  const f = useCurrentFrame() - startAt;
  if (f < 0) return null;
  const rot = interpolate(f, [0, 8], [180, 0], { ...clamp, easing: easeOut });
  const s = interpolate(f, [0, 8, 16], [1.16, 1.03, 1], clamp);
  const o = interpolate(f, [0, 6], [0.45, 1], clamp);
  return (
    <div style={{ perspective: 1400, width: w, height: h }}>
      <div style={{ transform: `rotateY(${rot}deg) scale(${s})`, opacity: o, width: w, height: h }}>
        {rot > 90 ? <div style={{ transform: "scaleX(-1)" }}><CardBack w={w} h={h} /></div> : children}
      </div>
    </div>
  );
};
export const TitleBar: React.FC<{ text: string; inAt: number; top?: number }> = ({ text, inAt, top = 60 }) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [inAt, inAt + 7], [-40, 0], { ...clamp, easing: easeOut });
  return f < inAt ? null : (
    <div style={{ position: "absolute", left: 0, right: 0, top: top + y, display: "flex", justifyContent: "center", opacity: interpolate(f, [inAt, inAt + 5], [0, 1], clamp) }}>
      <div style={{ background: "#D9D3C2", padding: "10px 46px", fontFamily: F.title, fontSize: 58, letterSpacing: 2.5, color: "#1C1D22" }}>{text}</div>
    </div>
  );
};

/** cream trait panel that hangs under each card, as on Jxmy's cards (cards/f_0755_000): swings down on a top hinge */
const TRAITS: Record<string, string[]> = {
  TROPHIES: ["Worlds", "MSI", "League titles"],
  SKILL: ["Lane stats", "Same role", "Same league"],
  "BIG GAMES\n& CLUTCH": ["Finals", "Playoffs", "Clutch series"],
  "TEAM\nIMPACT": ["Plus-minus", "With or without", "Best 5 seasons"],
  LONGEVITY: ["Years at the top", "Top seasons", "Consistency"],
  RECOGNITION: ["All-Pro teams", "MVP awards", "Pre-2020 picks"],
};
const TraitPanel: React.FC<{ part: (typeof PARTS)[number]; w: number; startAt: number }> = ({ part, w, startAt }) => {
  const f = useCurrentFrame() - startAt;
  if (f < 0) return null;
  const rx = interpolate(f, [0, 9], [-95, 0], { ...clamp, easing: easeOut });
  return (
    <div style={{ perspective: 1000, width: w }}>
      <div style={{ transformOrigin: "50% 0%", transform: `rotateX(${rx}deg)`, background: "#ECE6D2", boxShadow: "0 14px 30px rgba(0,0,0,0.45)" }}>
        <div style={{ height: 16, background: RED }} />
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {TRAITS[part.name].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={22} height={22} viewBox="0 0 32 32" fill="#2A1A10" stroke="#2A1A10" style={{ flexShrink: 0 }}>{ICON[part.icon]}</svg>
              <div style={{ fontFamily: F.title, fontSize: 25, letterSpacing: 0.5, lineHeight: 1.05, color: "#1C1D22" }}>{t.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 10, background: BLUE }} />
        <div style={{ height: 10, background: RED }} />
      </div>
    </div>
  );
};

export const CARDS_T0 = W("42", "6") - 3.6, CARDS_T1 = L("42").end + 1.2;
export const CARDS_FRAMES = Math.round((CARDS_T1 - CARDS_T0) * FPS);
const CARD_WORDS = ["trophies", "skill", "big", "team", "longevity", "recognition"].map((w) => W("42", w)); // trophies, skill, big (games), team, longevity, recognition
export const SCards: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const A = at(CARDS_T0);
  const w = 272, h = 430, gap = 30, x0 = (1920 - (6 * w + 5 * gap)) / 2;
  return (
    <AbsoluteFill>
      <Vignette bg="#121316" />
      <TitleBar text="ONE SCORE, SIX PARTS" inAt={A(W("42", "6"))} top={95} />
      {PARTS.map((p, i) => (
        <React.Fragment key={p.name}>
          <div style={{ position: "absolute", left: x0 + i * (w + gap), top: 250 }}>
            <Flip startAt={A(CARD_WORDS[i]) - 2} w={w} h={h}><PartCard part={p} w={w} h={h} /></Flip>
          </div>
          <div style={{ position: "absolute", left: x0 + i * (w + gap) + 22, top: 650 }}>
            <TraitPanel part={p} w={w - 10} startAt={A(CARD_WORDS[i]) + 8} />
          </div>
        </React.Fragment>
      ))}
      {voice && <Voice from={CARDS_T0} to={CARDS_T1} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2. Elo towers
const LINE = "#8FF0EC";
export const ELO_T0 = L("20").start - 0.4, ELO_T1 = L("20").end + 0.5;
const E = { chess: W("19", "chess"), same: W("20", "win"), win: W("20", "win"), points: W("20", "points"), beat: W("20", "beat"), way: W("20", "way"), take2: W("20", "take", 1), lot: W("20", "lot"), n26: W("20", "26"), games: W("20", "games") };
export const ELO_FRAMES = Math.round((ELO_T1 - ELO_T0) * FPS);
export const SElo: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const f = useCurrentFrame();
  const A = at(ELO_T0);
  const ground = 860, k = 0.34, tw = 230, xl = 610, xr = 1310 - tw;
  const grow = interpolate(f, [A(E.chess), A(E.chess) + 18], [0, 1], { ...clamp, easing: easeOut });
  // ratings over time: equal start, +16 to the left after the first win, then reset to 1300 v 1700 and the underdog takes 29
  const g1 = interpolate(f, [A(E.points), A(E.points) + 18], [0, 16], { ...clamp, easing: inOut });
  const m = interpolate(f, [A(E.way), A(E.way) + 15], [0, 1], { ...clamp, easing: inOut });
  const g2 = interpolate(f, [A(E.take2), A(E.take2) + 18], [0, 29], { ...clamp, easing: inOut });
  const L = (1500 + g1) * (1 - m) + (1300 + g2) * m;
  const R = (1500 - g1) * (1 - m) + (1700 - g2) * m;
  const lineDraw = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  const flow = (a: number, amount: number) => {
    const t = interpolate(f, [a, a + 18], [0, 1], { ...clamp, easing: inOut });
    if (t <= 0 || t >= 1) return null;
    const x = xr + tw / 2 + (xl + tw / 2 - (xr + tw / 2)) * t, y = ground - 1650 * k - Math.sin(t * Math.PI) * 120;
    return <rect x={x - 40} y={y - amount * k * 1.8} width={80} height={amount * k * 1.8} fill="none" stroke={LINE} strokeWidth={3} />;
  };
  const Tower = ({ x, v, name }: { x: number; v: number; name: string }) => (
    <g>
      <rect x={x} y={ground - v * k * grow} width={tw} height={v * k * grow} fill="rgba(143,240,236,0.06)" stroke={LINE} strokeWidth={3} />
      {grow > 0.6 && <text x={x + tw / 2} y={ground - v * k * grow - 22} textAnchor="middle" fill={LINE} fontFamily="Inter" fontWeight={300} fontSize={64}>{Math.round(v)}</text>}
      <text x={x + tw / 2} y={ground + 62} textAnchor="middle" fill={LINE} fontFamily="Inter" fontWeight={400} fontSize={40} letterSpacing={3}>{name}</text>
    </g>
  );
  const games = Math.round(interpolate(f, [A(E.n26), A(E.games)], [0, 26000], clamp));
  const gain = (a: number, txt: string, x: number, y: number) => {
    const o = interpolate(f, [a, a + 6], [0, 1], clamp);
    return o > 0 ? <text x={x} y={y} fill={LINE} opacity={o} fontFamily="Inter" fontWeight={600} fontSize={56}>{txt}</text> : null;
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={960 - 860 * lineDraw} x2={960 + 860 * lineDraw} y1={ground} y2={ground} stroke={LINE} strokeWidth={3} />
        <Tower x={xl} v={L} name={m > 0.5 ? "UNDERDOG" : "TEAM A"} />
        <Tower x={xr} v={R} name={m > 0.5 ? "FAVOURITE" : "TEAM B"} />
        {f >= A(E.same) && f < A(E.win) && (
          <g opacity={interpolate(f, [A(E.same), A(E.same) + 6], [0, 1], clamp)}>
            <path d={`M${xl},${ground - 1500 * k - 110} h${xr + tw - xl}`} stroke={LINE} strokeWidth={2} strokeDasharray="10 10" />
            <text x={960} y={ground - 1500 * k - 128} textAnchor="middle" fill={LINE} fontFamily="Inter" fontWeight={400} fontSize={36} letterSpacing={3}>EVERYONE STARTS AT 1500</text>
          </g>
        )}
        {f >= A(E.win) && f < A(E.way) && <text x={xl + tw / 2} y={ground - 1520 * k - 110} textAnchor="middle" fill={LINE} fontFamily="Inter" fontWeight={700} fontSize={44} letterSpacing={4}>WIN</text>}
        {flow(A(E.points), 16)}
        {f < A(E.way) && gain(A(E.beat), "+16", xl - 150, ground - 1516 * k + 20)}
        {f >= A(E.take2 - 0.3) && <text x={xl + tw / 2} y={ground - 1329 * k - 110} textAnchor="middle" fill={LINE} fontFamily="Inter" fontWeight={700} fontSize={44} letterSpacing={4}>UPSET</text>}
        {flow(A(E.take2), 29)}
        {gain(A(E.lot), "+29", xl - 150, ground - 1329 * k + 20)}
        {f >= A(E.n26) && (
          <text x={1880} y={1040} textAnchor="end" fill={LINE} fontFamily="Inter" fontWeight={300} fontSize={40} letterSpacing={2}>GAMES RATED  {games.toLocaleString("en-US")}</text>
        )}
      </svg>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: F.body, fontWeight: 300, fontSize: 44, letterSpacing: 4, color: LINE }}>ELO RATING</div>
      {voice && <Voice from={ELO_T0} to={ELO_T1} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3. plus-minus lineup grid
export const PM_T0 = L("34").start - 0.25, PM_T1 = L("35").end + 1.0;
const PMW = { plus: W("34", "plus") - 0.15, who: W("34", "teams"), change: W("34", "change"), solve: W("35", "who"), five: W("35", "5"), n26: W("35", "26"), games: W("35", "games") };
export const PM_FRAMES = Math.round((PM_T1 - PM_T0) * FPS);
// Illustrative games: Chovy's team (left) v opponents (right); 0 = Chovy, other numbers = other players. Not real lineups.
const GAMES: { l: number[]; r: number[]; w: boolean }[] = [
  { l: [1, 2, 0, 3, 4], r: [11, 12, 13, 14, 15], w: true },
  { l: [1, 2, 0, 3, 4], r: [16, 17, 18, 19, 20], w: true },
  { l: [1, 2, 5, 3, 4], r: [11, 12, 13, 14, 15], w: false },
  { l: [6, 2, 0, 3, 7], r: [21, 22, 23, 24, 25], w: true },
  { l: [6, 8, 5, 3, 7], r: [16, 17, 18, 19, 20], w: false },
  { l: [1, 2, 0, 9, 4], r: [26, 27, 28, 29, 30], w: true },
  { l: [6, 8, 5, 9, 7], r: [21, 22, 23, 24, 25], w: true },
];
const Dot: React.FC<{ n: number; size: number; lit?: boolean; dim?: boolean }> = ({ n, size, lit, dim }) => (
  <div style={{ width: size, height: size, borderRadius: size, position: "relative", overflow: "hidden", flexShrink: 0, opacity: dim ? 0.25 : 1,
    background: n === 0 ? "#22303F" : "#2A303A", boxShadow: `inset 0 0 0 3px ${n === 0 ? (lit ? C.cyan : "rgba(34,211,238,0.6)") : "rgba(237,239,242,0.35)"}`,
    filter: lit ? `drop-shadow(0 0 12px ${C.cyan})` : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {n === 0 ? <Img src={staticFile(P("chovy").photo!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      : <span style={{ fontFamily: F.title, fontSize: size * 0.42, color: "#9AA3B2" }}>{n}</span>}
  </div>
);
export const SPlusMinus: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const f = useCurrentFrame();
  const A = at(PM_T0);
  // part 1: one lineup, Chovy goes out, a replacement comes in, then two more change
  const p1 = f < A(PMW.plus);
  const swapOut = interpolate(f, [A(PMW.who), A(PMW.who) + 10], [0, 1], { ...clamp, easing: inOut });
  const more = f >= A(PMW.change);
  // part 2: the grid
  const solve = f >= A(PMW.solve);
  const rows = GAMES.map((g, i) => ({ ...g, t: A(PMW.five) + i * 5 }));
  const games = Math.round(interpolate(f, [A(PMW.n26), A(PMW.games)], [7, 26000], clamp));
  const size = 66;
  return (
    <AbsoluteFill>
      <Vignette bg="#101318" />
      {p1 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F.title, fontSize: 64, color: CREAM, letterSpacing: 2 }}>
            {swapOut < 0.5 ? "WITH CHOVY" : "WITHOUT CHOVY"}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", gap: 46 }}>
            {[1, 2, 0, 3, 4].map((n, j) => {
              const isC = n === 0;
              const swapN = more && (j === 0 || j === 4) ? (j === 0 ? 6 : 7) : n;
              return (
                <div key={j} style={{ position: "relative", width: 150, height: 150 }}>
                  {isC ? (
                    <>
                      <div style={{ position: "absolute", transform: `translateY(${swapOut * 260}px)`, opacity: 1 - swapOut }}><Dot n={0} size={150} lit /></div>
                      <div style={{ position: "absolute", transform: `translateY(${(1 - swapOut) * -260}px)`, opacity: swapOut }}><Dot n={5} size={150} /></div>
                    </>
                  ) : <Dot n={swapN} size={150} />}
                  {more && swapN !== n && <div style={{ position: "absolute", top: -46, left: 0, right: 0, textAlign: "center", fontFamily: F.title, fontSize: 32, color: C.gold }}>NEW</div>}
                </div>
              );
            })}
          </div>
          {more && <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: F.body, fontWeight: 600, fontSize: 40, color: C.text }}>
            Three players changed. Who gets the credit?</div>}
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 120, top: 70, fontFamily: F.title, fontSize: 76, color: CREAM, letterSpacing: 2 }}>ADJUSTED PLUS-MINUS</div>
          <div style={{ position: "absolute", left: 120, top: 170, fontFamily: F.body, fontSize: 30, color: C.muted }}>Every game: five players against five. Only the result counts.</div>
          {rows.map((g, i) => {
            const o = interpolate(f, [g.t, g.t + 4], [0, 1], clamp);
            const y = 250 + i * 98;
            return (
              <div key={i} style={{ position: "absolute", left: 120, top: y, display: "flex", alignItems: "center", gap: 14, opacity: o }}>
                {g.l.map((n, j) => <Dot key={j} n={n} size={size} lit={solve && n === 0} dim={solve && n !== 0} />)}
                <div style={{ width: 90, textAlign: "center", fontFamily: F.title, fontSize: 34, color: C.muted, opacity: solve ? 0.25 : 1 }}>VS</div>
                {g.r.map((n, j) => <Dot key={j} n={n} size={size} dim={solve} />)}
                <div style={{ marginLeft: 26, width: 74, height: 56, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: F.title, fontSize: 40, color: "#0B0B0F", background: g.w ? C.mint : C.red }}>{g.w ? "W" : "L"}</div>
              </div>
            );
          })}
          {f >= A(PMW.n26) && (
            <div style={{ position: "absolute", left: 120, top: 950, fontFamily: F.title, fontSize: 44, letterSpacing: 1.5, color: C.text }}>
              GAMES IN THE EQUATION  <span style={{ color: C.cyan }}>{games.toLocaleString("en-US")}</span></div>
          )}
          {solve && (
            <div style={{ position: "absolute", right: 120, top: 380, width: 420, padding: "34px 30px", border: `3px solid ${C.cyan}`, borderRadius: 14,
              opacity: interpolate(f, [A(PMW.solve), A(PMW.solve) + 6], [0, 1], clamp), textAlign: "center" }}>
              <div style={{ fontFamily: F.body, fontSize: 30, color: C.muted }}>solve for one player</div>
              <div style={{ fontFamily: F.title, fontSize: 84, color: C.cyan, marginTop: 6 }}>CHOVY = ?</div>
              <div style={{ fontFamily: F.body, fontSize: 28, color: C.text, marginTop: 8 }}>wins added beyond the lineup</div>
            </div>
          )}
          <div style={{ position: "absolute", right: 40, bottom: 26, fontFamily: F.body, fontSize: 22, color: "#4A5361" }}>Illustration: numbered circles are other players</div>
        </>
      )}
      {voice && <Voice from={PM_T0} to={PM_T1} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4. pyramid with Knight's reveal
/** photos with a background instead of a cut-out; faded into the tier with a soft mask */
const BOXED = new Set(["jankos", "cabochard", "cyanide", "lilballz", "shushei"]);
// model v15.1 faces (MODEL-CURRENT); tier 2 is Chovy then Knight, as line 71 names them
const TIERS_V13 = [["faker"], ["chovy", "knight"], ["ruler", "keria", "bin", "viper"], ["caps", "gumayusi", "deft", "uzi", "theshy", "scout"],
  ["doinb", "bengi", "perkz", "bjergsen", "jankos"]];
export const PYR_A = [L("64").start - 0.3, L("66").end + 0.6] as const, PYR_B = [L("69").start - 0.2, L("74").end + 0.2] as const;
const PA = Math.round((PYR_A[1] - PYR_A[0]) * FPS);
export const PYR_FRAMES = PA + Math.round((PYR_B[1] - PYR_B[0]) * FPS);

type Cam = { x: number; y: number; s: number; label?: string; labelO?: number };
const PyramidScene: React.FC<{ fill: (tier: number, j: number) => number; pulse: Record<string, number>; zoomAt?: number; tierIn: number; cam?: Cam }> = ({ fill, pulse, zoomAt, tierIn, cam }) => {
  const f = useCurrentFrame();
  const top = 120, base = 1000, half = 860, cx = 1060;
  const cuts = [top, 300, 460, 620, 800, base];
  const hw = (y: number) => ((y - top) / (base - top)) * half;
  // Jxmy stands the players in each tier as cut-outs on the tier floor (reference-board/frames/32), so we do too
  const figH = [150, 150, 150, 168, 186], gaps = [0, 300, 230, 205, 250];
  const pos = (i: number, j: number) => ({ x: cx + (j - (TIERS_V13[i].length - 1) / 2) * gaps[i], y: cuts[i + 1] - 2 - figH[i] / 2 });
  const kn = pos(1, 1);
  const z = zoomAt === undefined ? 0 : interpolate(f, [zoomAt, zoomAt + 75], [0, 1], { ...clamp, easing: inOut });
  return (
    <AbsoluteFill style={{ background: "#0D0F14", overflow: "hidden" }}>
      <AbsoluteFill style={cam ? { transform: `translate(960px, 540px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`, transformOrigin: "0 0" }
        : { transform: `scale(${1 + 0.75 * z})`, transformOrigin: `${kn.x}px ${kn.y}px` }}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 40%, rgba(70,80,100,0.35) 0%, rgba(0,0,0,0) 60%)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B4352" /><stop offset="1" stopColor="#262C37" /></linearGradient>
          </defs>
          {cam && <rect x={-2000} y={base} width={6000} height={1400} fill="#151920" />}
          {TIERS_V13.map((_, i) => {
            const y0 = cuts[i] + (i ? 6 : 0), y1 = cuts[i + 1];
            return <polygon key={i} points={`${cx - hw(y0)},${y0} ${cx + hw(y0)},${y0} ${cx + hw(y1)},${y1} ${cx - hw(y1)},${y1}`} fill="url(#band)" stroke="rgba(237,239,242,0.18)" strokeWidth={2} />;
          })}
        </svg>
        {TIERS_V13.map((_, i) => {
          const o = interpolate(f, [tierIn + (4 - i) * 3, tierIn + (4 - i) * 3 + 5], [0, 1], clamp) * (cam ? interpolate(cam.s, [1, 1.3], [1, 0], clamp) : 1);
          const ym = i === 0 ? cuts[1] - 40 : (cuts[i] + cuts[i + 1]) / 2 - 16;
          return <div key={"t" + i} style={{ position: "absolute", left: cx - hw(ym) - 230, width: 200, top: ym, textAlign: "right", fontFamily: F.title,
            fontSize: 24, letterSpacing: 2, color: i === 0 ? C.gold : "#C9CFD8", opacity: o }}>TIER {i + 1}</div>;
        })}
        {TIERS_V13.map((ids, i) => ids.map((id, j) => {
          const fh = figH[i], fw = Math.round(fh * 0.86); const { x } = pos(i, j); const floor = cuts[i + 1] - 2;
          const t = fill(i, j);
          const ring = i === 0 ? C.gold : i === 1 ? C.cyan : "#E9ECF1";
          const s = t === Infinity ? 0 : interpolate(f, [t, t + 5, t + 9], [0.3, 1.1, 1], clamp);
          const shown = f >= t;
          const pu = pulse[id] !== undefined ? interpolate(f, [pulse[id], pulse[id] + 5, pulse[id] + 20], [0, 1, 0], clamp) : 0;
          const glow = i < 2 ? ring : "#E9ECF1";
          return (
            <React.Fragment key={id}>
              {!shown && <div style={{ position: "absolute", left: x - fw / 2 + 10, top: floor - fh + 10, width: fw - 20, height: fh - 10, borderRadius: `${fw}px ${fw}px 6px 6px`,
                border: `3px dashed ${i === 1 ? "rgba(34,211,238,0.6)" : i === 0 ? "rgba(245,184,61,0.55)" : "rgba(237,239,242,0.25)"}`,
                boxShadow: pu ? `0 0 ${30 * pu}px rgba(34,211,238,${0.8 * pu})` : undefined }} />}
              {shown && (
                <div style={{ position: "absolute", left: x - fw / 2, top: floor - fh, width: fw, height: fh, transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: `drop-shadow(0 0 ${2 + 22 * pu}px ${pu ? glow : "rgba(0,0,0,0.6)"})` }}>
                    {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%",
                      ...(BOXED.has(id) ? { WebkitMaskImage: "radial-gradient(ellipse 48% 62% at 50% 42%, #000 70%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 62% at 50% 42%, #000 70%, transparent 100%)" } : {}) }} />}
                  </div>
                  <div style={{ position: "absolute", right: -8, top: 4, padding: "0 8px", height: 30, borderRadius: 12, background: ring,
                    fontFamily: F.title, fontSize: 24, color: "#0B0B0F", display: "flex", alignItems: "center" }}>#{P(id).rank}</div>
                  <div style={{ position: "absolute", left: fw / 2 - 110, width: 220, bottom: 4, textAlign: "center", fontFamily: F.body, fontWeight: 800,
                    fontSize: i < 2 ? 26 : 20, letterSpacing: 1, color: i === 1 ? C.cyan : C.text, textShadow: "0 0 6px #0B0B0F, 0 0 12px #0B0B0F", whiteSpace: "nowrap" }}>{P(id).name.toUpperCase()}</div>
                </div>
              )}
            </React.Fragment>
          );
        }))}
        {/* our lettering, top left, in the place of Jxmy's title */}
        <div style={{ position: "absolute", left: 70, top: 70, lineHeight: 0.95 }}>
          <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 6, color: C.gold }}>LEAGUE</div>
          <div style={{ fontFamily: F.title, fontSize: 104, letterSpacing: 3, color: C.gold, textShadow: "0 0 24px rgba(245,184,61,0.35)" }}>G.O.A.T.</div>
          <div style={{ fontFamily: F.title, fontSize: 52, letterSpacing: 8, color: C.gold }}>PYRAMID</div>
        </div>
      </AbsoluteFill>
      {cam?.label && <div style={{ position: "absolute", left: 70, top: 56, fontFamily: F.title, fontSize: 96, letterSpacing: 4, color: cam.label === "TIER 1" ? C.gold : "#E9ECF1",
        opacity: cam.labelO ?? 1, textShadow: "0 0 18px #0B0B0F" }}>{cam.label}</div>}
    </AbsoluteFill>
  );
};
export const SPyramid: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const a = at(PYR_A[0]);
  const b = (t: number) => PA + Math.round((t - PYR_B[0]) * FPS);
  const fill = (i: number, j: number) => {
    if (i === 4) return a(W("65", "bottom")) + j * 7;           // "At the bottom"
    if (i === 3) return a(W("66", "tier")) + j * 6;           // "tier 4"
    if (i === 2) return b(W("69", "tier") + 0.4) + j * 6;          // "tier 3"
    if (i === 1) return j === 0 ? b(WA("71", ["chovy"])) : b(W("71", "knight")); // Chovy, then Knight on his name
    return Infinity;                                 // Faker's slot stays for later in the video
  };
  const pulse = { perkz: a(W("65", "perkz")), bjergsen: a(W("65", "bjergsen")), jankos: a(W("65", "bjergsen")) /* ay 20:21: highlighted, not spoken */, caps: a(W("66", "caps")), knight: b(WA("71", ["second", "2nd"])) };
  return (
    <AbsoluteFill>
      <PyramidScene fill={fill} pulse={pulse} zoomAt={b(W("71", "knight") + 0.6)} tierIn={a(W("64", "tiers"))} />
      {voice && <Sequence durationInFrames={PA}><Voice from={PYR_A[0]} to={PYR_A[1]} /></Sequence>}
      {voice && <Sequence from={PA}><Voice from={PYR_B[0]} to={PYR_B[1]} /></Sequence>}
      <Sequence from={PA - 6} durationInFrames={12} layout="none">
        <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: F.body, fontSize: 22, color: "#4A5361" }}>(sample skips the Uzi and Bengi part)</div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4b. one pyramid, camera tier by tier (ay, 19 Nov 15:48)
// "zoom in on the tier and make that cover the whole screen, then slide up to the next tier, and zoom out at the end".
// Runs on the voiceover clock from line 64 to the end of line 74; the draft shows it at 64 and again at 69 (the Uzi and
// Bengi cards play over line 68 in between), so the camera picks up exactly where the story is.
export const PYRC_T0 = PYR_A[0], PYRC_T1 = L("74").end + 0.3;
export const PYRC_FRAMES = Math.round((PYRC_T1 - PYRC_T0) * FPS);
export const SPyramidCam: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const f = useCurrentFrame();
  const a = at(PYRC_T0);
  const cuts = [120, 300, 460, 620, 800, 1000], figH = [150, 150, 150, 168, 186];
  // the tier's floor sits at screen y 900, so the tier and its players fill the frame
  const tierView = (i: number, s: number, x = 1060) => ({ x, y: cuts[i + 1] - 360 / s, s });
  const FULL = { x: 1000, y: 540, s: 1 };
  // [frame, view, label]
  const keys: [number, { x: number; y: number; s: number }, string][] = [
    [0, FULL, ""],
    [a(W("65", "bottom")) - 6, FULL, ""],
    [a(W("65", "bottom")) + 20, tierView(4, 2.4, 810), "TIER 5"],
    [a(W("65", "bjergsen")) - 12, tierView(4, 2.4, 810), "TIER 5"],
    [a(W("65", "bjergsen")) + 8, tierView(4, 2.4, 1310), "TIER 5"],
    [a(W("66", "tier")) - 6, tierView(4, 2.4, 1310), "TIER 5"],
    [a(W("66", "tier")) + 20, tierView(3, 2.4, 760), "TIER 4"],
    [a(W("66", "highest")), tierView(3, 2.4, 760), "TIER 4"],
    [a(W("66", "highest")) + 30, tierView(3, 2.4, 1360), "TIER 4"],
    [a(W("67", "uzi")) - 10, tierView(3, 2.4, 1360), "TIER 4"],
    [a(W("67", "uzi")) + 14, { x: 1060, y: 700, s: 1.45 }, ""],
    [a(W("69", "tier")) - 10, { x: 1060, y: 700, s: 1.45 }, ""],
    [a(W("69", "tier")) + 14, tierView(2, 2.2), "TIER 3"],
    [a(W("70", "tier")) - 6, tierView(2, 2.2), "TIER 3"],
    [a(W("70", "tier")) + 20, tierView(1, 2.6), "TIER 2"],
    [a(L("74").end) - 75, tierView(1, 2.6), "TIER 2"],
    [a(L("74").end), FULL, ""],
  ];
  let k = 0; while (k < keys.length - 2 && f >= keys[k + 1][0]) k++;
  const [f0, v0, l0] = keys[k], [f1, v1, l1] = keys[k + 1];
  const e = f1 > f0 ? interpolate(f, [f0, f1], [0, 1], { ...clamp, easing: inOut }) : 1;
  const lerp = (p: number, q: number) => p + (q - p) * e;
  const label = e < 0.5 ? l0 : l1;
  const labelO = l0 === l1 ? 1 : Math.abs(e - 0.5) * 2;
  const cam = { x: lerp(v0.x, v1.x), y: lerp(v0.y, v1.y), s: lerp(v0.s, v1.s), label, labelO };
  const fill = (i: number, j: number) => {
    if (i === 4) return a(W("65", "bottom")) + 20 + j * 7;
    if (i === 3) return a(W("66", "tier")) + 20 + j * 6;
    if (i === 2) return a(W("69", "tier")) + 14 + j * 6;
    if (i === 1) return j === 0 ? a(WA("71", ["chovy"])) : a(W("71", "knight"));
    return Infinity;
  };
  const pulse = { perkz: a(W("65", "perkz")), bjergsen: a(W("65", "bjergsen")), jankos: a(W("65", "bjergsen")) /* ay 20:21: highlighted, not spoken */, caps: a(W("66", "caps")),
    uzi: a(W("67", "uzi")) + 14, bengi: a(W("67", "bengi")), knight: a(WA("71", ["second", "2nd"])) };
  return (
    <AbsoluteFill>
      <PyramidScene fill={fill} pulse={pulse} tierIn={a(W("64", "tiers"))} cam={cam} />
      {voice && <Voice from={PYRC_T0} to={PYRC_T1} />}
    </AbsoluteFill>
  );
};
