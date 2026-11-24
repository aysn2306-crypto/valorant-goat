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
import { AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame } from "remotion";
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
const LONG: { name: string; v: number; yrs: Record<number, number> }[] = [
  { name: "FAKER", v: 100, yrs: { 2013: 0.4, 2014: 0.3, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.06, 2019: 0.3, 2020: 0.3, 2021: 0.3, 2022: 0.3, 2023: 0.3, 2024: 0.3, 2025: 0.3, 2026: 0.3 } },
  { name: "DEFT", v: 92, yrs: { 2013: 0.03, 2014: 0.37, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.3, 2019: 0.29, 2020: 0.4, 2021: 0.34, 2022: 0.3, 2023: 0.4, 2024: 0.14 } },
  { name: "KNIGHT", v: 90, yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) },
  { name: "CHOVY", v: 90, yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) }];
// recognition part score (c_recognition, v15.3)
const RECOG = [{ name: "CHOVY", v: 100 }, { name: "FAKER", v: 89 }, { name: "KNIGHT", v: 87 }];

/** Longevity (left) then recognition (right) on one board; the left dims to a quarter when the right comes in (Jxmy) */
export const LongRec: React.FC<{ cues: { rows: number[]; tagL: number; right: number; bars: number[]; tagR: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const dimL = 1 - 0.7 * interpolate(f, [cues.right, cues.right + 12], [0, 1], clamp);
  const rK = pop(f, cues.right, 12);
  const x0 = 110, gx = 280, pitch = 50, cell = 44, y0 = 330, rowH = 118;
  const years = Array.from({ length: 14 }, (_, i) => 2013 + i);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ opacity: dimL }}>
        <div style={{ position: "absolute", left: x0, top: 110, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>LONGEVITY</div>
        <div style={{ position: "absolute", left: x0, top: 190, fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE }}>GREAT YEARS AT THE TOP</div>
        <PartTop text="#1 FAKER" at={cues.tagL} top={118} right={1920 - 1010} />
        {LONG.map((p, i) => {
          const k = pop(f, cues.rows[i], 10), y = y0 + i * rowH, lead = i === 0;
          return (
            <div key={p.name} style={{ opacity: k }}>
              <div style={{ position: "absolute", left: x0, top: y - 4, fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, color: lead ? TEAL : INK }}>{p.name}</div>
              {years.map((yr, j) => {
                const v = p.yrs[yr] ?? 0, g = interpolate(f, [cues.rows[i] + j * 1.5, cues.rows[i] + j * 1.5 + 8], [0, 1], clamp);
                return (
                  <div key={yr} style={{ position: "absolute", left: gx + j * pitch, top: y, width: cell, height: cell, border: "2px solid rgba(242,242,238,0.18)" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(v / 0.4) * 100 * g}%`, background: lead ? TEAL : INK, opacity: lead ? 1 : 0.8 }} />
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: gx + 14 * pitch + 14, top: y - 6, fontFamily: BEBAS, fontSize: 56, color: lead ? TEAL : INK }}>{p.v}</div>
            </div>
          );
        })}
        {[2013, 2016, 2019, 2022, 2026].map((yr) => (
          <div key={yr} style={{ position: "absolute", left: gx + (yr - 2013) * pitch - 30, width: cell + 60, top: y0 + 4 * rowH - 6, textAlign: "center",
            fontFamily: BEBAS, fontSize: 34, color: MUTE, opacity: pop(f, cues.rows[0]) }}>{yr}</div>
        ))}
      </div>
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
