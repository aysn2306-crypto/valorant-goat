// Polish pass (v19, 24 Nov 2026): the new graphics for ay's notes on the final. Same look as the rest of the video
// (Concrete ground, Bebas Neue, INK and TEAL, gold only for trophies). Built from these reference frames:
// - Roadmap: 3Blue1Brown's chapter preview (chart-refs-2/02-3blue1brown-binomial-probabilities, 01:00-01:35, items lit
//   one at a time, the rest at 25%) and Thinking Basketball's section cards (chart-refs-2/01, 05:12, 08:16).
// - RecipeBar: our own TrophyShare bar (locked swing on "subjective", settles on 30%), then the rest of the bar splits
//   into the five other parts on their spoken numbers, like MachineLoLing's stacked 100% bars (chart-refs-2026-11-18/01,
//   12:58-13:31, segment labels).
// - WeightFaders: MachineLoLing's formula board with the term being talked about boxed (chart-refs-2, "Look rules"):
//   the six weights as faders that wobble while ay says they're his choices.
// - SourceNote: ZeKay and Jxmy name the source on screen as it is said (rival-ai-video/RIVAL-STUDY.md "Sources").
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Clip, ClipId } from "./Clip";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", GOLD = "#E8B04B", TEAL = "#3FD0B5";

/** "So here's how this is gonna go": three steps, each lights on its word, the others drop to 35%. v19b: the
 *  winners come with each part, so step 1 is the six parts; `cur` forces the lit step (held under "here's the recipe") */
export const Roadmap: React.FC<{ at: [number, number, number]; cur?: number }> = ({ at, cur: force }) => {
  const f = useCurrentFrame();
  // ay 24 Nov 14:54: plain words a new viewer understands (were "the six parts", "how sure we can be", "the GOAT pyramid")
  const items = ["HOW THE MODEL SCORES PLAYERS", "TESTING THE MODEL", "THE FINAL RANKING"];
  const cur = force ?? at.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 260, top: 250, display: "flex", flexDirection: "column", gap: 54 }}>
        {items.map((t, i) => {
          const k = interpolate(f, [at[i], at[i] + 8], [0, 1], { ...clamp, easing: easeOut });
          const lit = i === cur ? 1 : 0.35;
          return (
            <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 40, opacity: k * lit, transform: `translateX(${(1 - k) * -30}px)` }}>
              <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 1, color: i === cur ? TEAL : INK, width: 110, textAlign: "right" }}>{i + 1}</div>
              <div style={{ fontFamily: BEBAS, fontSize: 96, lineHeight: 1, letterSpacing: 3, color: INK, whiteSpace: "nowrap" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** a short source line at the foot of a card ("where the data comes from"), in on its word */
export const SourceNote: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const k = interpolate(useCurrentFrame(), [at, at + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: BEBAS, fontSize: 46, letterSpacing: 4,
      color: MUTE, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>{text}</div>
  );
};

/** the six weights. Phase 1 = the locked TrophyShare swing (subjective) and settle on 30%; phase 2 = the rest splits
 *  into the five other parts, each on its spoken number. Numbers from MODEL-CURRENT v15.3. */
const PARTS: { name: string; w: number; color: string }[] = [
  { name: "SKILL", w: 21, color: "#5B8DEF" }, { name: "BIG GAMES + CLUTCH", w: 16.3, color: TEAL },
  { name: "TEAM IMPACT", w: 14, color: "#B58CEB" }, { name: "LONGEVITY", w: 10.5, color: "#8E97A3" }, { name: "RECOGNITION", w: 8.2, color: "#D9A0A0" }];
export const RecipeBar: React.FC<{ swingAt: number; settleAt: number; splitAt: number[] }> = ({ swingAt, settleAt, splitAt }) => {
  const f = useCurrentFrame();
  const x0 = 160, W = 1600, y = 430, h = 130;
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  const swing = f < swingAt ? 0 : interpolate(f, [swingAt, swingAt + 12], [0, 1], clamp);
  const wobble = 35 + 20 * Math.sin(((f - swingAt) / 30) * Math.PI * 0.9) * swing;
  const k = interpolate(f, [settleAt, settleAt + 18], [0, 1], { ...clamp, easing: easeOut });
  const share = f < settleAt ? (f < swingAt ? 35 : wobble) : wobble * (1 - k) + 30 * k;
  const split = PARTS.map((_, i) => interpolate(f, [splitAt[i], splitAt[i] + 10], [0, 1], { ...clamp, easing: easeOut }));
  const anySplit = split[0] > 0;
  let x = share;
  return (
    <AbsoluteFill style={{ opacity: inO }}>
      <Concrete />
      <div style={{ position: "absolute", left: x0, top: y - 90, fontFamily: BEBAS, fontSize: 52, letterSpacing: 3, color: INK }}>THE SCORE</div>
      <div style={{ position: "absolute", left: x0, top: y, width: W, height: h, background: "rgba(242,242,238,0.10)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${share}%`, background: GOLD }} />
        {PARTS.map((p, i) => { const l = x; x += p.w; return (
          <div key={p.name} style={{ position: "absolute", left: `${l}%`, top: 0, bottom: 0, width: `${p.w * split[i]}%`, background: p.color, borderLeft: "3px solid #0F1012" }} />); })}
        <div style={{ position: "absolute", left: `${share}%`, top: -14, bottom: -14, width: 4, marginLeft: -2, background: INK }} />
      </div>
      <div style={{ position: "absolute", left: x0, top: y + h + 24, fontFamily: BEBAS, fontSize: 64, color: GOLD, letterSpacing: 2 }}>
        TROPHIES {Math.round(share)}%</div>
      {!anySplit && <div style={{ position: "absolute", left: x0 + W - 700, width: 700, textAlign: "right", top: y + h + 24, fontFamily: BEBAS, fontSize: 64,
        color: k > 0.95 ? INK : MUTE, letterSpacing: 2 }}>EVERYTHING ELSE {100 - Math.round(share)}%</div>}
      {/* the five other parts: label above or below in turn so the narrow ones never collide */}
      {(() => { let xx = 30; return PARTS.map((p, i) => { const mid = xx + p.w / 2; xx += p.w; const up = i % 2 === 0;
        return <div key={p.name} style={{ position: "absolute", left: x0 + (mid / 100) * W - 200, width: 400, textAlign: "center",
          top: up ? y - 64 - (i === 0 ? 0 : 0) : y + h + 110, opacity: split[i], fontFamily: BEBAS, letterSpacing: 2, color: INK }}>
          <span style={{ fontSize: 40 }}>{p.name} </span><span style={{ fontSize: 48, color: p.color }}>{Math.round(p.w)}%</span></div>; }); })()}
    </AbsoluteFill>
  );
};

/** "the weights are my choices": six faders at the model's weights; they start drifting on `wobbleAt`, the trophy
 *  fader is boxed on `boxAt` ("remember that 30%") */
export const WeightFaders: React.FC<{ wobbleAt: number; boxAt: number }> = ({ wobbleAt, boxAt }) => {
  const f = useCurrentFrame();
  const all = [{ name: "TROPHIES", w: 30, color: GOLD }, ...PARTS];
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  const wob = interpolate(f, [wobbleAt, wobbleAt + 20], [0, 1], clamp);
  const box = interpolate(f, [boxAt, boxAt + 8], [0, 1], { ...clamp, easing: easeOut });
  const top = 250, bot = 820, max = 40, X = (i: number) => 330 + i * 252;
  const Y = (v: number) => bot - (v / max) * (bot - top);
  return (
    <AbsoluteFill style={{ opacity: inO }}>
      <Concrete />
      <div style={{ position: "absolute", left: 150, top: 110, fontFamily: BEBAS, fontSize: 64, letterSpacing: 4, color: INK }}>MY WEIGHTS</div>
      {all.map((p, i) => {
        const drift = wob * 6 * Math.sin((f / 30) * (1.3 + random("w" + i) * 1.4) + random("p" + i) * 6);
        const v = Math.max(3, p.w + drift);
        return (
          <React.Fragment key={p.name}>
            <div style={{ position: "absolute", left: X(i) - 4, top, width: 8, height: bot - top, background: "rgba(242,242,238,0.16)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: X(i) - 4, top: Y(v), width: 8, height: bot - Y(v), background: p.color, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: X(i) - 46, top: Y(v) - 18, width: 92, height: 36, background: INK, borderRadius: 6 }} />
            <div style={{ position: "absolute", left: X(i) - 120, width: 240, top: Y(v) - 82, textAlign: "center", fontFamily: BEBAS, fontSize: 54, color: p.color }}>{Math.round(v)}%</div>
            <div style={{ position: "absolute", left: X(i) - 125, width: 250, top: bot + 30, textAlign: "center", fontFamily: BEBAS, fontSize: 36, letterSpacing: 2, color: INK, lineHeight: 1.05 }}>{p.name}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: X(0) - 110, top: top - 120, width: 220, height: bot - top + 230, border: `5px solid ${TEAL}`, borderRadius: 10,
        opacity: box, transform: `scale(${0.94 + 0.06 * box})` }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ v19c (ay 24 Nov 14:54)
const RED = "#E5484D", GROUND = "#0F1012", PANEL = "#1B1E25";
const pop = (f: number, a: number, d = 8) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: easeOut });

/** "#1 in <part>": the same teal tag on every part's winners board (ay: say the graph shows the #1 of the whole part) */
export const PartTop: React.FC<{ text: string; at: number; top?: number; right?: number; left?: number }> = ({ text, at, top = 56, right = 70, left }) => {
  const k = pop(useCurrentFrame(), at);
  return (
    <div style={{ position: "absolute", ...(left !== undefined ? { left } : { right }), top, padding: "8px 28px 4px", background: TEAL, borderRadius: 8, fontFamily: BEBAS, fontSize: 54,
      letterSpacing: 3, color: GROUND, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: left !== undefined ? "0 50%" : "100% 50%", whiteSpace: "nowrap" }}>{text}</div>
  );
};

/** our own rank badges (no Riot art): a hexagon with a gem; the higher tier wears a crown */
const Badge: React.FC<{ color: string; crown?: boolean; size: number }> = ({ color, crown, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {crown && <path d="M22 26 L30 4 L40 20 L50 0 L60 20 L70 4 L78 26 Z" fill={color} />}
    <polygon points="50,14 84,33 84,71 50,90 16,71 16,33" fill="none" stroke={color} strokeWidth={6} />
    <polygon points="50,30 68,52 50,74 32,52" fill={color} />
  </svg>
);

/** Ranked-style Elo (ay 14:54: "like ranked, you steal points; the favourite loses more to an underdog"). K = 32:
 *  1,700 v 1,300 gives the favourite +3 / -3 and the underdog +29 / -29. cues: steal (the arrow), n26 (games count),
 *  fav (the favourite wins row), upset (the upset row; the ratings tick), hurt (the -29 boxed) */
export const RankedElo: React.FC<{ cues: { steal: number; n26: number; games: number; fav: number; upset: number; hurt: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 12);
  const up = interpolate(f, [cues.upset + 6, cues.upset + 30], [0, 29], { ...clamp, easing: easeOut });
  const cards = [{ role: "UNDERDOG", tier: "DIAMOND", color: "#7DB3E8", v: 1300 + up, cx: 520 }, { role: "FAVOURITE", tier: "GRANDMASTER", color: "#E0675F", v: 1700 - up, cx: 1400, crown: true }];
  const steal = pop(f, cues.steal, 10) * (1 - interpolate(f, [cues.fav - 6, cues.fav + 4], [0, 1], clamp));
  const games = Math.round(interpolate(f, [cues.n26, cues.games + 10], [0, 26000], clamp));
  const rows = [{ at: cues.fav, l: "-3", r: "+3", mid: "IF THE FAVOURITE WINS" }, { at: cues.upset, l: "+29", r: "-29", mid: "IF THE UNDERDOG WINS" }];
  const hurt = pop(f, cues.hurt, 10);
  const val = (t: string) => (t.startsWith("+") ? TEAL : RED);
  // a points chip flying from the favourite to the underdog on the upset
  const fly = interpolate(f, [cues.upset, cues.upset + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: 120, top: 60, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>TEAM RATINGS, LIKE RANKED</div>
      {cards.map((c, i) => {
        const k = pop(f, 4 + i * 6, 12);
        return (
          <div key={c.role} style={{ position: "absolute", left: c.cx - 250, top: 230, width: 500, height: 420, background: PANEL, borderTop: `6px solid ${c.color}`,
            opacity: k, transform: `translateY(${(1 - k) * 24}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginTop: 22, fontFamily: BEBAS, fontSize: 44, letterSpacing: 4, color: MUTE }}>{c.role}</div>
            <div style={{ marginTop: 8 }}><Badge color={c.color} crown={c.crown} size={140} /></div>
            <div style={{ marginTop: 4, fontFamily: BEBAS, fontSize: 48, letterSpacing: 3, color: c.color }}>{c.tier}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 124, lineHeight: 1, color: INK }}>{Math.round(c.v).toLocaleString("en-US")}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 860, width: 200, top: 390, textAlign: "center", fontFamily: BEBAS, fontSize: 96, color: MUTE, opacity: pop(f, 10) }}>VS</div>
      {/* "win, and you steal points off the team you beat" */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: steal }}>
        <path d="M1150 300 Q960 200 770 300" fill="none" stroke={TEAL} strokeWidth={6} strokeDasharray="16 12" />
        <polygon points="770,300 800,272 806,312" fill={TEAL} />
        <text x={960} y={212} textAnchor="middle" fontFamily={BEBAS} fontSize={46} letterSpacing={3} fill={TEAL}>WIN = STEAL THEIR POINTS</text>
      </svg>
      {fly > 0 && fly < 1 && (
        <div style={{ position: "absolute", left: 1400 + (520 - 1400) * fly - 70, top: 470 - Math.sin(fly * Math.PI) * 200, width: 140, textAlign: "center", padding: "6px 0 2px",
          background: TEAL, borderRadius: 40, fontFamily: BEBAS, fontSize: 54, color: GROUND }}>29</div>
      )}
      {rows.map((r, i) => {
        const k = pop(f, r.at, 10), y = 700 + i * 125;
        return (
          <React.Fragment key={r.mid}>
            <div style={{ position: "absolute", left: 360, width: 320, top: y, textAlign: "center", fontFamily: BEBAS, fontSize: 104, lineHeight: 1, color: val(r.l), opacity: k }}>{r.l}</div>
            <div style={{ position: "absolute", left: 660, width: 600, top: y + 30, textAlign: "center", fontFamily: BEBAS, fontSize: 50, letterSpacing: 3, color: INK, opacity: k }}>{r.mid}</div>
            <div style={{ position: "absolute", left: 1240, width: 320, top: y, textAlign: "center", fontFamily: BEBAS, fontSize: 104, lineHeight: 1, color: val(r.r), opacity: k }}>{r.r}</div>
          </React.Fragment>
        );
      })}
      {/* "losing to an underdog hurts the favourite way more" */}
      <div style={{ position: "absolute", left: 1290, top: 813, width: 220, height: 122, border: `5px solid ${RED}`, borderRadius: 10, opacity: hurt, transform: `scale(${0.9 + 0.1 * hurt})` }} />
      <div style={{ position: "absolute", left: 1530, top: 843, fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: RED, opacity: hurt, whiteSpace: "nowrap" }}>HURTS WAY MORE</div>
      <div style={{ position: "absolute", right: 70, bottom: 40, fontFamily: BEBAS, fontSize: 40, letterSpacing: 3, color: MUTE, opacity: f >= cues.n26 ? 1 : 0 }}>
        GAMES RATED {games.toLocaleString("en-US")}</div>
    </AbsoluteFill>
  );
};

// longevity: each year's value above the elite line, capped at 0.4 (a Worlds top 4 or a league final counts at least 0.3).
// season_ratings.csv + title_credits.csv, which reproduce longevity_raw in draft_scores_v15.3 exactly (24 Nov)
/** ay 24 Nov 19:01: the rank badges read badly, so the Elo is drawn plainly again, after j3m's "The Elo Rating System"
 *  (chart-refs-2/05-j3m-elo-rating-system, 01:26 and 03:00: each rating is a tower on one ground line and after a game
 *  height flows from the loser's tower to the winner's). Same story as the ranked version: winning takes points off the
 *  team you beat, the favourite gets 2 for an expected win, the underdog takes 22 for an upset, and the two outcomes stay
 *  side by side in a small ledger so "hurts way more" is a plain -2 next to -22. */
export const EloTowers: React.FC<{ cues: { steal: number; n26: number; games: number; fav: number; upset: number; hurt: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const G = 900, K = 0.27, TW = 230, XL = 400, XR = 940;
  const io = Easing.bezier(0.65, 0, 0.35, 1);
  const grow = interpolate(f, [2, 22], [0, 1], { ...clamp, easing: easeOut });
  // favourite win: 2 points flow underdog -> favourite; then reset; upset: 22 flow favourite -> underdog
  const t3 = interpolate(f, [cues.fav, cues.fav + 20], [0, 1], { ...clamp, easing: io });
  const back = interpolate(f, [cues.upset - 8, cues.upset], [0, 1], { ...clamp, easing: io });
  const t29 = interpolate(f, [cues.upset, cues.upset + 22], [0, 1], { ...clamp, easing: io });
  const d = 2 * t3 * (1 - back) - 22 * t29;
  const vL = 1300 - d, vR = 1700 + d;
  const steal = pop(f, cues.steal, 10) * (1 - pop(f, cues.fav - 8, 8));
  const games = Math.round(interpolate(f, [cues.n26, cues.games + 10], [0, 26000], clamp));
  const hurt = pop(f, cues.hurt, 10);
  const top = (v: number) => G - v * K * grow;
  const Tower = ({ x, v, name, col }: { x: number; v: number; name: string; col: string }) => (
    <>
      <div style={{ position: "absolute", left: x, top: top(v), width: TW, height: G - top(v), background: "rgba(242,242,238,0.05)", border: `4px solid ${col}`, borderBottom: "none" }} />
      <div style={{ position: "absolute", left: x - 40, width: TW + 80, top: top(v) - 110, textAlign: "center", fontFamily: BEBAS, fontSize: 96, lineHeight: 1, color: INK, opacity: grow }}>
        {Math.round(v).toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: x - 60, width: TW + 120, top: G + 22, textAlign: "center", fontFamily: BEBAS, fontSize: 50, letterSpacing: 4, color: MUTE }}>{name}</div>
    </>
  );
  // the points chip travelling between the tower tops, its size is the points moved
  const chip = (t: number, n: number, from: number, to: number, y0: number, y1: number) => {
    if (t <= 0 || t >= 1) return null;
    const x = from + (to - from) * t, y = y0 + (y1 - y0) * t - 125 - Math.sin(t * Math.PI) * 50, h = 26 + n * 2.4;
    return <div style={{ position: "absolute", left: x - 70, top: y - h, width: 140, height: h, background: n > 10 ? TEAL : INK, borderRadius: 8,
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BEBAS, fontSize: 48, color: GROUND }}>{n}</div>;
  };
  const delta = (a: number, txt: string, x: number, y: number) => {
    const k = pop(f, a, 8);
    return k > 0 ? <div style={{ position: "absolute", left: x, top: y, width: 140, textAlign: "center", fontFamily: BEBAS, fontSize: 72, lineHeight: 1,
      color: txt.startsWith("+") ? TEAL : RED, opacity: k }}>{txt}</div> : null;
  };
  const showFav = f >= cues.fav + 16 && f < cues.upset - 8, showUp = f >= cues.upset + 18;
  const rows = [{ at: cues.fav, who: "FAVOURITE WINS", fav: "+2", dog: "-2" }, { at: cues.upset, who: "UNDERDOG WINS", fav: "-22", dog: "+22" }];
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 120, top: 60, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>TEAM RATINGS</div>
      <div style={{ position: "absolute", left: 120, top: 136, fontFamily: BEBAS, fontSize: 36, letterSpacing: 3, color: MUTE }}>WIN A GAME, TAKE POINTS OFF THE TEAM YOU BEAT</div>
      <div style={{ position: "absolute", left: 160, width: 1100 * grow, top: G, height: 4, background: INK }} />
      <Tower x={XL} v={vL} name="UNDERDOG" col={MUTE} />
      <Tower x={XR} v={vR} name="FAVOURITE" col={MUTE} />
      {/* "the team you beat": an arc from loser to winner while the rule is said */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: steal }}>
        <path d={`M${XL + TW / 2} ${top(1300) - 130} Q${(XL + XR + TW) / 2} ${top(1700) - 260} ${XR + TW / 2 - 20} ${top(1700) - 140}`} fill="none" stroke={TEAL} strokeWidth={6} strokeDasharray="16 12" />
        <polygon points={`${XR + TW / 2 - 20},${top(1700) - 140} ${XR + TW / 2 - 60},${top(1700) - 158} ${XR + TW / 2 - 44},${top(1700) - 118}`} fill={TEAL} />
      </svg>
      {chip(t3, 2, XL + TW / 2, XR + TW / 2, top(1300), top(1700))}
      {chip(t29, 22, XR + TW / 2, XL + TW / 2, top(1700), top(1300))}
      {showFav && <>{delta(cues.fav + 16, "-2", XL - 160, top(vL) - 90)}{delta(cues.fav + 16, "+2", XR + TW + 20, top(vR) - 90)}</>}
      {showUp && <>{delta(cues.upset + 18, "+22", XL - 160, top(vL) - 90)}{delta(cues.upset + 18, "-22", XR + TW + 20, top(vR) - 90)}</>}
      {/* the ledger keeps both outcomes on screen */}
      <div style={{ position: "absolute", left: 1400, top: 330, width: 440 }}>
        <div style={{ display: "flex", fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE, opacity: pop(f, cues.fav, 8) }}>
          <div style={{ flex: 1 }} /><div style={{ width: 130, textAlign: "center" }}>FAVOURITE</div></div>
        {rows.map((r, i) => {
          const k = pop(f, r.at + 16, 8);
          return (
            <div key={r.who} style={{ display: "flex", alignItems: "center", height: 120, borderTop: `2px solid rgba(242,242,238,0.15)`, opacity: k }}>
              <div style={{ flex: 1, fontFamily: BEBAS, fontSize: 46, letterSpacing: 2, color: INK }}>{r.who}</div>
              <div style={{ width: 130, textAlign: "center", fontFamily: BEBAS, fontSize: 84, color: r.fav.startsWith("+") ? TEAL : RED, position: "relative" }}>
                {r.fav}
                {i === 1 && <div style={{ position: "absolute", inset: "-4px 0px 4px", border: `5px solid ${RED}`, borderRadius: 10, opacity: hurt, transform: `scale(${0.9 + 0.1 * hurt})` }} />}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 18, textAlign: "right", fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: RED, opacity: hurt }}>HURTS WAY MORE</div>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 40, fontFamily: BEBAS, fontSize: 40, letterSpacing: 3, color: MUTE, opacity: f >= cues.n26 ? 1 : 0 }}>
        GAMES RATED {games.toLocaleString("en-US")}</div>
    </AbsoluteFill>
  );
};

/** ay 24 Nov 19:01: the clutch axes sat empty under "flip a coin 10 times and sometimes you get 8 heads". Ten coins
 *  land one by one on "flip", 8 heads and 2 tails (3Blue1Brown's tick and cross rows, chart-refs-2/02 00:24), then
 *  the row leaves as the dots come in. */
export const CoinRow: React.FC<{ cues: { flip: number; heads: number; out: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const res = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1];
  const span = Math.max(20, cues.heads - cues.flip - 4);
  const k = pop(f, cues.flip - 6, 8) * (1 - pop(f, cues.out, 10));
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <AbsoluteFill style={{ background: "rgba(15,16,18,0.82)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 26 }}>
        {res.map((h, i) => {
          const a = cues.flip + (i * span) / res.length, t = interpolate(f, [a, a + 8], [0, 1], { ...clamp, easing: easeOut });
          return (
            <div key={i} style={{ width: 130, height: 130, borderRadius: 130, border: `5px solid ${h ? TEAL : MUTE}`, background: h ? "rgba(63,208,181,0.12)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BEBAS, fontSize: 76, color: h ? TEAL : MUTE,
              opacity: t, transform: `scaleX(${Math.abs(Math.cos((1 - t) * Math.PI * 1.5))})` }}>{h ? "H" : "T"}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: BEBAS, fontSize: 110, color: INK, opacity: pop(f, cues.heads, 8) }}>
        8 HEADS OUT OF 10</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 3, color: MUTE, opacity: pop(f, cues.heads + 10, 8) }}>
        SAME COIN, JUST LUCK</div>
    </AbsoluteFill>
  );
};

const LONG: { name: string; v: number; yrs: Record<number, number> }[] = [
  { name: "FAKER", v: 100, yrs: { 2013: 0.4, 2014: 0.3, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.06, 2019: 0.3, 2020: 0.3, 2021: 0.3, 2022: 0.3, 2023: 0.3, 2024: 0.3, 2025: 0.3, 2026: 0.3 } },
  { name: "DEFT", v: 92, yrs: { 2013: 0.03, 2014: 0.37, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.3, 2019: 0.29, 2020: 0.4, 2021: 0.34, 2022: 0.3, 2023: 0.4, 2024: 0.14 } },
  { name: "KNIGHT", v: 90, yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) },
  { name: "CHOVY", v: 90, yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) }];
// recognition part score (c_recognition, v15.3)
const RECOG = [{ name: "CHOVY", v: 100 }, { name: "FAKER", v: 89 }, { name: "KNIGHT", v: 87 }];

/** Longevity (left) then recognition (right) on one board; the left dims to a quarter when the right comes in (Jxmy) */
export const LongRec: React.FC<{ cues: { rows: number[]; tagL: number; right: number; bars: number[]; tagR: number; key?: number[]; patch?: number[] } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const dimL = 1 - 0.7 * interpolate(f, [cues.right, cues.right + 12], [0, 1], clamp);
  const rK = pop(f, cues.right, 12);
  const x0 = 110, y0 = 330, rowH = 118;
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      {/* ay 26 Nov 17:00: the year grid with empty squares was rejected ("Knight and Chovy have empty bits").
          Rebuilt from the Jxmy column-stack reference (video-research/jxmy-graphs/style-sheets/column-stack_p1.jpg,
          Rlyp8PLqFS0 g09): one stacked pill per great year, the face rides the top of its column as it builds.
          Only years that count are stacked, so no column has a gap; the year is written in its pill. */}
      <div style={{ opacity: dimL }}>
        <div style={{ position: "absolute", left: x0, top: 110, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>LONGEVITY</div>
        <div style={{ position: "absolute", left: x0, top: 190, fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE }}>GREAT YEARS AT THE TOP</div>
        <PartTop text="#1 FAKER" at={cues.tagL} top={118} right={1920 - 1010} />
        {LONG.map((p, i) => {
          const cx = 240 + i * 220, base = 945, ph = 28, pitch = 35, pw = 150;
          const yrs = Object.keys(p.yrs).map(Number).sort((u, v) => u - v);
          const t0 = cues.rows[i], k = pop(f, t0, 10), lead = i === 0;
          const built = interpolate(f, [t0, t0 + yrs.length * 2.5], [0, yrs.length], clamp);
          const topY = base - built * pitch;
          return (
            <div key={p.name} style={{ opacity: k }}>
              {yrs.map((yr, j) => {
                const v = p.yrs[yr], g = interpolate(built, [j, j + 1], [0, 1], clamp);
                const tier = v >= 0.395 ? 2 : v >= 0.2 ? 1 : 0;
                return g > 0 ? (
                  <div key={yr} style={{ position: "absolute", left: cx - pw / 2, top: base - (j + 1) * pitch + (1 - g) * -40, width: pw, height: ph, borderRadius: ph / 2,
                    opacity: g, background: tier === 2 ? TEAL : tier === 1 ? INK : "transparent", border: tier === 0 ? "3px solid rgba(242,242,238,0.45)" : "none",
                    boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BEBAS, fontSize: 24, letterSpacing: 2,
                    color: tier === 0 ? MUTE : "#12161B" }}>{yr}</div>
                ) : null;
              })}
              <div style={{ position: "absolute", left: cx - 48, top: topY - 104, width: 96, height: 96, borderRadius: "50%", overflow: "hidden",
                border: `5px solid ${lead ? TEAL : INK}`, boxSizing: "border-box", background: "#1B2027" }}>
                <Img src={staticFile(P(p.name.toLowerCase()).photo ?? "")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
              </div>
              <div style={{ position: "absolute", left: cx - 100, width: 200, top: topY - 160, textAlign: "center", fontFamily: BEBAS, fontSize: 50, lineHeight: 1,
                color: lead ? TEAL : INK, opacity: interpolate(built, [yrs.length - 0.5, yrs.length], [0, 1], clamp) }}>{p.v}</div>
              <div style={{ position: "absolute", left: cx - 110, width: 220, top: base + 6, textAlign: "center", fontFamily: BEBAS, fontSize: 48, letterSpacing: 2,
                color: lead ? TEAL : INK }}>{p.name}</div>
            </div>
          );
        })}
        {/* ay 24 Nov 19:01: the key, said word by word, now as the three pills; it leaves as the columns come in */}
        {cues.key && (() => {
          const out = 1 - pop(f, cues.rows[0] - 10, 8);
          const items = [{ t: "GREAT YEAR", tier: 1, at: cues.key[0] }, { t: "MONSTER YEAR", tier: 2, at: cues.key[1] }, { t: "ONLY JUST MADE IT", tier: 0, at: cues.key[2] }];
          return out > 0 ? (
            <div style={{ position: "absolute", left: 140, top: 470, display: "flex", gap: 70, opacity: out }}>
              {items.map((it) => {
                const kk = pop(f, it.at, 10);
                return (
                  <div key={it.t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: kk, transform: `translateY(${(1 - kk) * -30}px)` }}>
                    <div style={{ width: 220, height: 56, borderRadius: 28, boxSizing: "border-box", background: it.tier === 2 ? TEAL : it.tier === 1 ? INK : "transparent",
                      border: it.tier === 0 ? "4px solid rgba(242,242,238,0.45)" : "none" }} />
                    <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: it.tier === 2 ? TEAL : it.tier === 1 ? INK : MUTE, whiteSpace: "nowrap" }}>{it.t}</div>
                  </div>
                );
              })}
            </div>
          ) : null;
        })()}
      </div>
      {/* v19f line 79 (38e, 25 Nov): while ay says why staying great is hard, the empty right half says it on its words,
          and leaves as recognition comes in */}
      {cues.patch && (() => {
        const out = 1 - pop(f, cues.right - 8, 8);
        const items = [{ big: "NEW PATCH", small: "EVERY COUPLE OF WEEKS", at: cues.patch[0] }, { big: "NEW META", small: "EVERY YEAR", at: cues.patch[1] },
          { big: "RELEARN THE GAME", small: "OVER AND OVER", at: cues.patch[2] }];
        return out > 0 ? (
          <div style={{ position: "absolute", left: 1150, top: 330, display: "flex", flexDirection: "column", gap: 44, opacity: out }}>
            {items.map((it, i) => {
              const k = pop(f, it.at, 10);
              return (
                <div key={it.big} style={{ opacity: k, transform: `translateX(${(1 - k) * 30}px)`, borderLeft: `8px solid ${i === 2 ? TEAL : INK}`, paddingLeft: 28 }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 72, lineHeight: 1, letterSpacing: 2, color: i === 2 ? TEAL : INK, whiteSpace: "nowrap" }}>{it.big}</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 3, color: MUTE, whiteSpace: "nowrap" }}>{it.small}</div>
                </div>
              );
            })}
          </div>
        ) : null;
      })()}
      <div style={{ opacity: rK }}>
        <div style={{ position: "absolute", left: 1150, top: 110, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>RECOGNITION</div>
        <div style={{ position: "absolute", left: 1150, top: 190, fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE }}>ALL-PRO TEAMS AND MVPS, 0 TO 100</div>
        <PartTop text="#1 CHOVY" at={cues.tagR} top={118} right={70} />
        {RECOG.map((p, i) => {
          const k = interpolate(f, [cues.bars[i], cues.bars[i] + 16], [0, 1], { ...clamp, easing: easeOut }), y = y0 + i * rowH * 1.25, lead = i === 0;
          return (
            <div key={p.name} style={{ opacity: Math.min(1, k * 3) }}>
              <div style={{ position: "absolute", left: 1150, top: y - 4, fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, color: lead ? TEAL : INK }}>{p.name}</div>
              <div style={{ position: "absolute", left: 1330, top: y, width: (p.v / 100) * 360 * k, height: 50, background: lead ? TEAL : "#5E6670" }} />
              <div style={{ position: "absolute", left: 1330 + (p.v / 100) * 360 * k + 16, top: y - 6, fontFamily: BEBAS, fontSize: 56, color: lead ? TEAL : INK }}>{p.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ section openers on footage (ay 24 Nov 16:21)
// From video-research/goat-section-study (Goodly Rogue "Eye Test" 11:37 and "Winning" 0:43; Jxmy XMaPrXzclaQ 3:19
// "FORMULA METHOD"): the chapter word sits big over blurred, darkened footage for 1 to 3 s, the blur clears, and clips
// that show the idea play under the opening lines, each cut on its word. The section's first graph follows.
export const SectionOpener: React.FC<{ title: string; size?: number; shots: { id: ClipId; from: number; at: number }[]; cardEnd: number }> = ({ title, size = 200, shots, cardEnd }) => {
  const f = useCurrentFrame();
  const card = 1 - interpolate(f, [cardEnd, cardEnd + 10], [0, 1], { ...clamp, easing: easeOut });
  const n = Math.floor(interpolate(f, [2, 2 + title.length * 1.5], [0, title.length], clamp));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: card > 0.01 ? `blur(${10 * card}px)` : undefined }}>
        {shots.map((s, i) => {
          const end = i + 1 < shots.length ? shots[i + 1].at : undefined;
          return <Sequence key={i} from={s.at} durationInFrames={end !== undefined ? end - s.at : undefined} layout="none"><Clip id={s.id} from={s.from} dim={0.1} /></Sequence>;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(10,12,16,${0.45 * card})` }} />
      {card > 0 && <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: card }}>
        <div style={{ fontFamily: BEBAS, fontSize: size, letterSpacing: size * 0.12, color: INK, textShadow: "0 4px 0 rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>{title.slice(0, n)}</div>
      </AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ay 24 Nov 20:09: when the voice says "going right" / "higher up", an arrow runs along that axis (Jxmy's axis arrows,
// video-research/jxmy-graphs). Full-frame coordinates of the axis corner and ends.
export const AxisSweep: React.FC<{ x0: number; x1: number; yb: number; y0: number; y1: number; right: number; up: number; out: number; color?: string }> =
  ({ x0, x1, yb, y0, y1, right, up, out, color = INK }) => {
    const f = useCurrentFrame();
    const dx = interpolate(f, [right, right + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const dy = interpolate(f, [up, up + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const k = 1 - interpolate(f, [out, out + 10], [0, 1], clamp);
    if (dx <= 0 || k <= 0) return null;
    const xe = x0 + (x1 - x0) * dx, ye = y0 + (y1 - y0) * dy;
    return (
      <AbsoluteFill style={{ opacity: k, pointerEvents: "none" }}>
        <svg width={1920} height={1080}>
          <line x1={x0} x2={xe} y1={yb} y2={yb} stroke={color} strokeWidth={8} strokeLinecap="round" />
          <polygon points={`${xe + 26},${yb} ${xe - 6},${yb - 18} ${xe - 6},${yb + 18}`} fill={color} />
          {dy > 0 && <><line x1={x0} x2={x0} y1={y0} y2={ye} stroke={color} strokeWidth={8} strokeLinecap="round" />
            <polygon points={`${x0},${ye - 26} ${x0 - 18},${ye + 6} ${x0 + 18},${ye + 6}`} fill={color} /></>}
        </svg>
      </AbsoluteFill>
    );
  };

// ------------------------------------------------------------------ v19f additions (ay's full re-record, 25 Nov)
/** Line 26 (16c): what skill is scored on, before any adjustment. A post-game stat row (MachineLoLing's portrait stat
 *  table, machineloling-frames/07m54, and the formula board 04m10): each stat lights on its word with a Jxmy good/bad
 *  arrow (deaths: fewer is better), then the role strip keeps only your own role on "own role". */
export const StatSheet: React.FC<{ cues: { stats: number[]; role: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const STATS = [{ t: "GOLD AHEAD", s: "AT 15 MIN" }, { t: "CS AHEAD", s: "AT 15 MIN" }, { t: "KILLS", s: "EVERY GAME" }, { t: "DAMAGE SHARE", s: "OF YOUR TEAM'S" },
    { t: "DEATHS", s: "FEWER IS BETTER", bad: true }];
  const ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"];
  const inK = pop(f, 0, 10), rK = pop(f, cues.role, 10), strike = interpolate(f, [cues.role + 10, cues.role + 22], [0, 1], { ...clamp, easing: easeOut });
  const colW = 316, x0 = 170;
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: x0, top: 150, fontFamily: BEBAS, fontSize: 84, letterSpacing: 3, color: INK }}>WHAT EVERY GAME IS SCORED ON</div>
      <div style={{ position: "absolute", left: x0, top: 330, width: colW * 5, height: 330, background: "rgba(27,30,37,0.85)", border: "2px solid rgba(242,242,238,0.14)" }} />
      {STATS.map((st, i) => {
        const a = cues.stats[i], k = pop(f, a, 10), lit = 0.16 + 0.84 * k, ar = interpolate(f, [a + 4, a + 16], [0, 1], { ...clamp, easing: easeOut });
        const col = st.bad ? RED : TEAL;
        return (
          <div key={st.t} style={{ position: "absolute", left: x0 + i * colW, top: 330, width: colW, height: 330, opacity: lit,
            borderLeft: i ? "2px solid rgba(242,242,238,0.10)" : undefined, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 58, lineHeight: 1, letterSpacing: 1, color: INK, whiteSpace: "nowrap" }}>{st.t}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE, marginTop: 8, whiteSpace: "nowrap" }}>{st.s}</div>
            <svg width={110} height={130} style={{ marginTop: 24, transform: `translateY(${(1 - ar) * (st.bad ? -24 : 24)}px)`, opacity: ar }}>
              {st.bad ? <polygon points="55,124 8,58 36,58 36,6 74,6 74,58 102,58" fill={col} />
                : <polygon points="55,6 102,72 74,72 74,124 36,124 36,72 8,72" fill={col} />}
            </svg>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x0, top: 740, display: "flex", alignItems: "center", gap: 26, opacity: rK }}>
        <div style={{ fontFamily: BEBAS, fontSize: 52, letterSpacing: 3, color: MUTE, marginRight: 14, whiteSpace: "nowrap" }}>ONLY COMPARED WITH</div>
        {ROLES.map((r) => {
          const me = r === "MID";
          return (
            <div key={r} style={{ position: "relative", padding: "10px 30px 4px", borderRadius: 8, fontFamily: BEBAS, fontSize: 60, letterSpacing: 3,
              background: me ? TEAL : "transparent", color: me ? GROUND : INK, border: me ? `3px solid ${TEAL}` : "3px solid rgba(242,242,238,0.35)",
              opacity: me ? 1 : 1 - 0.7 * strike }}>
              {r}
              {!me && <div style={{ position: "absolute", left: 10, right: 10, top: "52%", height: 5, background: RED, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: x0, top: 862, fontFamily: BEBAS, fontSize: 44, letterSpacing: 3, color: INK, opacity: pop(f, cues.role + 22, 10) }}>
        A MID ONLY EVER AGAINST OTHER MIDS</div>
    </AbsoluteFill>
  );
};

/** footage cut on its words, each shot with a small name tag bottom left (who you are looking at) */
export const TaggedClips: React.FC<{ shots: { id: ClipId; from: number; at: number; tag?: string; rate?: number }[] }> = ({ shots }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.map((s, i) => {
        const end = i + 1 < shots.length ? shots[i + 1].at : undefined;
        const k = pop(f, s.at + 6, 8) * (end !== undefined ? 1 - pop(f, end - 4, 4) : 1);
        return (
          <Sequence key={i} from={s.at} durationInFrames={end !== undefined ? end - s.at : undefined} layout="none">
            <Clip id={s.id} from={s.from} dim={0.08} rate={s.rate ?? 1} />
            {s.tag && <div style={{ position: "absolute", left: 70, bottom: 70, padding: "8px 24px 2px", background: "rgba(15,16,18,0.86)", borderLeft: `6px solid ${TEAL}`,
              fontFamily: BEBAS, fontSize: 50, letterSpacing: 3, color: INK, opacity: k, whiteSpace: "nowrap" }}>{s.tag}</div>}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Line 26 (16c), v20 (ay 26 Nov: "a certain League graphic that shows the difference between two players", the
 *  column-and-arrows sheet was "trash"). A real lane matchup in the League broadcast's post-game layout: values on
 *  the outside, the stat in the middle, bars that show who was ahead and by how much (refs: Worlds 2026 post-game
 *  team compare, video-research/refs-1126/worlds26-postgame-team-compare-gold-diff.png; Jxmy two-player box score
 *  board, jxmy-graphs/style-sheets/head-to-head_p1.jpg GPH4nK5sQ-8 g01). Data: Oracle's Elixir, Worlds 2026 semifinal
 *  game 1 (LOLTMNT02_488293), Knight vs Faker. Each row lights on its word; the role strip comes on "own role". */
const MATCHUP = {
  sub: "WORLDS 2026 SEMIFINAL · GAME 1 · MID VS MID",
  l: { id: "knight", name: "KNIGHT", team: "BLG" }, r: { id: "faker", name: "FAKER", team: "T1" },
  rows: [
    { t: "GOLD AHEAD", s: "AT 15 MIN", l: 684, r: -684, fmt: (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toLocaleString("en-GB"), diff: 1000 },
    { t: "CS AHEAD", s: "AT 15 MIN", l: 39, r: -39, fmt: (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v), diff: 60 },
    { t: "KILLS", s: "", l: 8, r: 4, fmt: (v: number) => String(v), max: 10 },
    { t: "DAMAGE SHARE", s: "OF THE TEAM'S", l: 28.7, r: 28.9, fmt: (v: number) => v.toFixed(1) + "%", max: 35 },
    { t: "DEATHS", s: "FEWER IS BETTER", l: 0, r: 2, fmt: (v: number) => String(v), max: 5, low: true },
  ] as { t: string; s: string; l: number; r: number; fmt: (v: number) => string; diff?: number; max?: number; low?: boolean }[],
};
export const MatchupSheet: React.FC<{ cues: { stats: number[]; role: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10), rK = pop(f, cues.role, 10), strike = interpolate(f, [cues.role + 10, cues.role + 22], [0, 1], { ...clamp, easing: easeOut });
  const ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"];
  const cx = 960, half = 330, top0 = 236, rowH = 116;
  const card = (side: "l" | "r") => {
    const p = MATCHUP[side], ph = P(p.id).photo;
    return (
      <div style={{ position: "absolute", top: 230, [side === "l" ? "left" : "right"]: 110, width: 300 }}>
        <div style={{ width: 300, height: 380, overflow: "hidden", background: "#1B212B", border: `3px solid ${side === "l" ? TEAL : "rgba(242,242,238,0.35)"}` }}>
          {ph && <Img src={staticFile(ph)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />}
        </div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: BEBAS, fontSize: 58, letterSpacing: 3, color: INK, lineHeight: 1 }}>{p.name}</div>
        <div style={{ textAlign: "center", fontFamily: BEBAS, fontSize: 32, letterSpacing: 3, color: MUTE }}>{p.team} · MID</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 62, textAlign: "center", fontFamily: BEBAS, fontSize: 80, letterSpacing: 3, color: INK }}>WHAT EVERY GAME IS SCORED ON</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 152, textAlign: "center", fontFamily: BEBAS, fontSize: 34, letterSpacing: 4, color: MUTE }}>{MATCHUP.sub}</div>
      {card("l")}{card("r")}
      {MATCHUP.rows.map((r, i) => {
        const a = cues.stats[i], k = pop(f, a, 10), grow = interpolate(f, [a + 4, a + 20], [0, 1], { ...clamp, easing: easeOut });
        const lWins = r.low ? r.l < r.r : r.l > r.r, rWins = r.low ? r.r < r.l : r.r > r.l;
        const y = top0 + i * rowH;
        const valStyle = (win: boolean): React.CSSProperties => ({ position: "absolute", top: y - 6, width: 200, fontFamily: BEBAS, fontSize: 64, lineHeight: 1,
          color: win ? TEAL : MUTE, opacity: 0.2 + 0.8 * k });
        return (
          <React.Fragment key={r.t}>
            <div style={{ ...valStyle(lWins), left: cx - half - 230, textAlign: "right" }}>{r.fmt(r.l)}</div>
            <div style={{ ...valStyle(rWins), left: cx + half + 30, textAlign: "left" }}>{r.fmt(r.r)}</div>
            <div style={{ position: "absolute", left: cx - half, width: half * 2, top: y - 4, textAlign: "center", opacity: 0.2 + 0.8 * k }}>
              <span style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK }}>{r.t}</span>
              {r.s && <span style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: MUTE, marginLeft: 14 }}>{r.s}</span>}
            </div>
            {/* the track: split in the middle like the broadcast's damage bars */}
            <div style={{ position: "absolute", left: cx - half, width: half * 2, top: y + 50, height: 22, background: "rgba(242,242,238,0.07)", opacity: 0.3 + 0.7 * k }} />
            <div style={{ position: "absolute", left: cx - 2, width: 4, top: y + 44, height: 34, background: "rgba(242,242,238,0.5)", opacity: 0.3 + 0.7 * k }} />
            {r.diff !== undefined ? (() => {
              // a gap: one bar from the middle toward whoever was ahead, as long as the gap
              const w = (Math.abs(r.l) / r.diff) * half * grow, toLeft = r.l > 0;
              return <div style={{ position: "absolute", top: y + 50, height: 22, width: w, left: toLeft ? cx - w : cx, background: TEAL }} />;
            })() : (<>
              <div style={{ position: "absolute", top: y + 50, height: 22, width: (r.l / r.max!) * half * grow, left: cx - (r.l / r.max!) * half * grow - 3, background: lWins ? TEAL : "#7C8591" }} />
              <div style={{ position: "absolute", top: y + 50, height: 22, width: (r.r / r.max!) * half * grow, left: cx + 3, background: rWins ? TEAL : "#7C8591" }} />
            </>)}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: rK }}>
        <div style={{ fontFamily: BEBAS, fontSize: 48, letterSpacing: 3, color: MUTE, marginRight: 12, whiteSpace: "nowrap" }}>ONLY COMPARED WITH</div>
        {ROLES.map((ro) => {
          const me = ro === "MID";
          return (
            <div key={ro} style={{ position: "relative", padding: "8px 26px 2px", borderRadius: 8, fontFamily: BEBAS, fontSize: 54, letterSpacing: 3,
              background: me ? TEAL : "transparent", color: me ? GROUND : INK, border: me ? `3px solid ${TEAL}` : "3px solid rgba(242,242,238,0.35)",
              opacity: me ? 1 : 1 - 0.7 * strike }}>
              {ro}
              {!me && <div style={{ position: "absolute", left: 10, right: 10, top: "52%", height: 5, background: RED, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
