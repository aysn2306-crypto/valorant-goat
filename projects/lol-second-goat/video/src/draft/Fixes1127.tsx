// Draft 22 (ay 27 Nov 01:29): four graphics rebuilt so each one shows what the line says, each from a saved reference
// image (video-research/refs-1127/SOURCES.md has the side by sides):
// - MissingYears (lines 11 to 14, 1:40): Stats Science 101's numbered leaderboard boxes (refs-1126-yt/A/kkp_LMYBEFY,
//   0:148) for "Faker in 14th", then Secret Base's unit grid (chart-refs-2/03 14:22) for the games the data had, then
//   Secret Base's year grid with a coloured band over the years being talked about (chart-refs-2/03 05:32).
// - StatMeanings (16c, 2:20): Thinking Basketball's definition board ("Player Plus-Minus = his team's point
//   differential when he is on the court", chart-refs-2/01 05:20) and Stats Science 101's big stat names with one line
//   under each (kkp_LMYBEFY 0:18 to 0:22, 2:10 to 2:20). Only what each stat means, no player against player.
// - EloLine (20 and 20a, 3:30): j3m's Elo video (chart-refs-2/05): ratings tick after every game in green and red
//   (00:22), rating lines drawn over games (04:16, 13:32 to 13:50). No arrows: the lines go up and down and the
//   points gained and lost print where they happen.
// - LongRace (38a to 38f, 9:52): the NFL "career passing yards, timeline" race (refs-1126-yt/B/Xwe8CdKKqSc): a big
//   year clock in the corner while each career bar grows one season at a time, so longevity reads as time.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";
import { PartTop } from "./Polish";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", TEAL = "#3FD0B5", RED = "#E5484D", GROUND = "#0F1012";
const pop = (f: number, a: number, d = 8) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: easeOut });
const LINE = "rgba(242,242,238,0.18)";

// ------------------------------------------------------------------------------------------------ lines 11 to 14
/** v1 had Faker 14th (leaderboard, rows 1 to 13 left blank so no rank leaks), then the 2013 games the data had (38 of
 *  65, from the model thread), then the years with no damage stats (before 2020) as a red band on his career years */
export const MissingYears: React.FC<{ cues: { rank: number; games: number; damage: number; y2020: number; long: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const boardOut = pop(f, cues.games - 10, 10);
  const lowK = pop(f, cues.games, 12);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      {/* 1. the leaderboard */}
      <div style={{ opacity: 1 - boardOut }}>
        <div style={{ position: "absolute", left: 160, top: 70, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>MY FIRST VERSION OF THE MODEL</div>
        {Array.from({ length: 14 }, (_, i) => {
          const col = i < 7 ? 0 : 1, row = i % 7, x = 250 + col * 760, y = 210 + row * 112, me = i === 13;
          const k = me ? pop(f, cues.rank, 10) : pop(f, 6 + i * 1.5, 8);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 18, opacity: k, transform: `translateX(${(1 - k) * -20}px)` }}>
              <div style={{ width: 84, height: 80, border: `4px solid ${me ? TEAL : MUTE}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: BEBAS, fontSize: 56, color: me ? TEAL : MUTE }}>{i + 1}</div>
              <div style={{ width: 560, height: 80, border: `4px solid ${me ? TEAL : "rgba(155,163,174,0.35)"}`, boxSizing: "border-box", background: me ? "rgba(63,208,181,0.14)" : "transparent",
                display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: TEAL }}>{me ? "FAKER" : ""}</div>
            </div>
          );
        })}
      </div>
      {/* 2. his 2013 games: the ones in the data filled, the missing ones empty */}
      <div style={{ opacity: lowK }}>
        <div style={{ position: "absolute", left: 160, top: 70, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>FAKER'S 2013 GAMES</div>
        <div style={{ position: "absolute", left: 160, top: 160, display: "flex", gap: 40, fontFamily: BEBAS, fontSize: 44, letterSpacing: 3 }}>
          <span style={{ color: TEAL }}>■ IN THE DATA: 38</span><span style={{ color: MUTE, opacity: pop(f, cues.games + 20, 8) }}>□ NEVER TRACKED: 27</span></div>
        <div style={{ position: "absolute", left: 160, top: 250, width: 1600, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {Array.from({ length: 65 }, (_, i) => {
            const k = pop(f, cues.games + i * 0.5, 6), have = i < 38;
            return <div key={i} style={{ width: 80, height: 50, boxSizing: "border-box", background: have ? TEAL : "transparent",
              border: have ? "none" : `3px dashed ${MUTE}`, opacity: k * (have ? 1 : 0.9) }} />;
          })}
        </div>
      </div>
      {/* 3. his years: damage stats only from 2020 */}
      {(() => {
        const k = pop(f, cues.damage, 12);
        const years = Array.from({ length: 14 }, (_, i) => 2013 + i), x0 = 160, cw = 114, y = 640;
        const band = interpolate(f, [cues.damage + 6, cues.y2020], [0, 1], { ...clamp, easing: io });
        const longK = pop(f, cues.long, 12);
        return k > 0 ? (
          <div style={{ opacity: k }}>
            <div style={{ position: "absolute", left: x0, top: y - 74, fontFamily: BEBAS, fontSize: 44, letterSpacing: 3, color: INK }}>DAMAGE STATS IN HIS GAMES</div>
            {years.map((yr, i) => {
              const has = yr >= 2020, lit = has ? pop(f, cues.y2020 + (yr - 2020) * 2, 8) : 0;
              return (
                <React.Fragment key={yr}>
                  <div style={{ position: "absolute", left: x0 + i * cw, top: y, width: cw - 10, height: 90, boxSizing: "border-box",
                    background: has ? `rgba(63,208,181,${0.9 * lit})` : "transparent", border: `3px solid ${has && lit > 0.5 ? TEAL : "rgba(242,242,238,0.3)"}` }} />
                  <div style={{ position: "absolute", left: x0 + i * cw, width: cw - 10, top: y + 104, textAlign: "center", fontFamily: BEBAS, fontSize: 34, letterSpacing: 1,
                    color: has ? INK : MUTE }}>{yr}</div>
                </React.Fragment>
              );
            })}
            {/* Secret Base's band over the years being talked about */}
            <div style={{ position: "absolute", left: x0 - 6, top: y - 6, width: (7 * cw + 2) * band, height: 102, background: "rgba(229,72,77,0.82)", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, width: 7 * cw, top: 22, textAlign: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 4, color: INK,
                opacity: interpolate(band, [0.7, 1], [0, 1], clamp), whiteSpace: "nowrap" }}>NO DAMAGE STATS</div>
            </div>
            {/* "played so long": a bracket over all fourteen years */}
            <div style={{ position: "absolute", left: x0, top: y + 170, width: (14 * cw - 10) * longK, height: 24, borderLeft: `4px solid ${INK}`, borderRight: longK > 0.98 ? `4px solid ${INK}` : "none",
              borderBottom: `4px solid ${INK}`, boxSizing: "border-box", opacity: longK }} />
            <div style={{ position: "absolute", left: x0, width: 14 * cw - 10, top: y + 210, textAlign: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 3, color: INK,
              opacity: pop(f, cues.long + 10, 8) }}>14 SEASONS</div>
          </div>
        ) : null;
      })()}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ line 16c
const STATS = [
  { term: "GOLD AHEAD AT 15", mean: "HOW MUCH MORE GOLD YOU HAVE THAN THE PLAYER IN YOUR ROLE, AT 15 MINUTES" },
  { term: "CS AHEAD AT 15", mean: "HOW MANY MORE MINIONS AND MONSTERS YOU'VE KILLED THAN THEM, AT 15 MINUTES" },
  { term: "KILLS", mean: "ENEMY CHAMPIONS YOU KILL" },
  { term: "DAMAGE SHARE", mean: "YOUR PART OF ALL THE DAMAGE YOUR TEAM DOES TO CHAMPIONS" },
  { term: "DEATHS", mean: "HOW OFTEN YOU DIE. FEWER IS BETTER" }];

/** each stat name lands on its word with what it means beside it; on "your own role" the role row comes in */
export const StatMeanings: React.FC<{ cues: { stats: number[]; role: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const roleK = pop(f, cues.role, 10);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: 160, top: 70, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>WHAT THE MODEL LOOKS AT IN EVERY GAME</div>
      {STATS.map((s, i) => {
        const k = pop(f, cues.stats[i], 10), y = 175 + i * 142;
        const cur = f >= cues.stats[i] && (i === STATS.length - 1 ? f < cues.role : f < cues.stats[i + 1]);
        return (
          <div key={s.term} style={{ position: "absolute", left: 160, top: y, display: "flex", flexDirection: "column", gap: 8, opacity: k * (cur || f >= cues.role ? 1 : 0.55),
            transform: `translateY(${(1 - k) * 24}px)` }}>
            <div style={{ fontFamily: BEBAS, fontSize: 80, lineHeight: 1, letterSpacing: 2, color: TEAL, whiteSpace: "nowrap" }}>{s.term}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 44, lineHeight: 1, letterSpacing: 2, color: INK, whiteSpace: "nowrap" }}>{s.mean}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 160, top: 905, display: "flex", alignItems: "center", gap: 30, opacity: roleK, transform: `translateY(${(1 - roleK) * 20}px)` }}>
        <div style={{ padding: "8px 28px 4px", background: TEAL, borderRadius: 8, fontFamily: BEBAS, fontSize: 56, letterSpacing: 3, color: GROUND, whiteSpace: "nowrap" }}>
          ONLY AGAINST YOUR OWN ROLE</div>
        {["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"].map((r, i) => (
          <div key={r} style={{ fontFamily: BEBAS, fontSize: 56, letterSpacing: 3, color: INK, opacity: pop(f, cues.role + 8 + i * 4, 8) }}>{r}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ lines 20, 20a
// past games before the example: points won or lost each game (made up for the picture, said as an example)
const FAV_HIST = [22, -27, 14, 25, -19, 12, -24, 17, 11, -10, 19, -9];
const DOG_HIST = [-21, 30, -15, -26, 23, -18, 28, -17, -22, 26, -14, 19];
const CLIMB = [21, 19, 18, 16, 15];

const series = (end: number, hist: number[]) => {
  const out = [end - hist.reduce((a, b) => a + b, 0)];
  hist.forEach((d) => out.push(out[out.length - 1] + d));
  return out;
};

/** two rating lines over games. The past games draw while the rule is said, every step printing its points in green
 *  or red; then the example: favourite wins (+2 / -2), underdog wins (+22 / -22, the -22 ringed), the underdog keeps
 *  winning and climbs. The two example games get wider steps so their numbers have room. */
export const EloLine: React.FC<{ cues: { draw: number; drawEnd: number; n26: number; games: number; dog: number; fav: number; win2: number; win22: number; hurt: number; climb: number; strong: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const H = FAV_HIST.length; // index of the 1,300 / 1,700 point
  const fav = [...series(1700, FAV_HIST), 1702, 1680, 1683, 1679, 1684, 1681, 1685];
  let v = 1320; const dog = [...series(1300, DOG_HIST), 1298, 1320, ...CLIMB.map((d) => (v += d))];
  const N = fav.length - 1;
  // x units per step: the two example games are 3 units wide, the rest 1
  const units = Array.from({ length: N }, (_, i) => (i === H || i === H + 1 ? 3 : 1));
  const cum = units.reduce<number[]>((a, u) => [...a, a[a.length - 1] + u], [0]);
  const X0 = 260, X1 = 1560, YT = 300, YB = 900, R0 = 1220, R1 = 1780;
  const sx = (i: number) => { const n = Math.min(N - 1, Math.floor(i)), fr = i - n; return X0 + 40 + ((cum[n] + units[n] * fr) / cum[N]) * (X1 - X0 - 120); };
  const sy = (r: number) => YB - ((r - R0) / (R1 - R0)) * (YB - YT);
  const prog = interpolate(f, [cues.draw, cues.drawEnd], [0, H], { ...clamp, easing: Easing.linear })
    + interpolate(f, [cues.win2, cues.win2 + 10], [0, 1], { ...clamp, easing: io })
    + interpolate(f, [cues.win22, cues.win22 + 10], [0, 1], { ...clamp, easing: io })
    + interpolate(f, [cues.climb, cues.climb + 36], [0, CLIMB.length], { ...clamp, easing: io });
  const at = (pts: number[], p: number) => { const n = Math.min(pts.length - 1, Math.floor(p)), fr = n < pts.length - 1 ? p - n : 0; return pts[n] + ((pts[n + 1] ?? pts[n]) - pts[n]) * fr; };
  const path = (pts: number[]) => {
    const n = Math.floor(prog), p = pts.slice(0, n + 1).map((r, i) => `${i ? "L" : "M"}${sx(i)} ${sy(r)}`);
    if (n < pts.length - 1 && prog > n) p.push(`L${sx(prog)} ${sy(at(pts, prog))}`);
    return p.join(" ");
  };
  const games = Math.round(interpolate(f, [cues.n26, cues.games + 10], [0, 26000], clamp));
  const hurt = pop(f, cues.hurt, 10), strong = pop(f, cues.strong, 10), climbK = pop(f, cues.climb, 10);
  const histOut = 1 - pop(f, cues.dog - 6, 8);
  // the points at step i, printed when the line reaches it (fav above its line, underdog below)
  const Tick = ({ pts, i, above, big, keep }: { pts: number[]; i: number; above: boolean; big?: boolean; keep: number }) => {
    const d = pts[i] - pts[i - 1], reach = prog - (i - 1);
    if (reach <= 0.6) return null;
    const k = interpolate(reach, [0.6, 0.9], [0, 1], clamp) * keep;
    if (k <= 0) return null;
    const x = sx(i), y = sy(pts[i]);
    return <div style={{ position: "absolute", left: x - 90, width: 180, top: above ? y - (big ? 112 : 64) : y + (big ? 22 : 16), textAlign: "center", fontFamily: BEBAS,
      fontSize: big ? 88 : 44, lineHeight: 1, color: d >= 0 ? TEAL : RED, opacity: k }}>{d >= 0 ? `+${d}` : `\u2212${-d}`}</div>;
  };
  const caption = (txt: string, a: number, b: number, i: number) => {
    const k = pop(f, a, 8) * (1 - pop(f, b, 8));
    return k > 0 ? <div style={{ position: "absolute", left: sx(i - 0.5) - 200, width: 400, top: YB + 18, textAlign: "center", fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK, opacity: k }}>{txt}</div> : null;
  };
  return (
    <AbsoluteFill style={{ opacity: pop(f, 0, 10) }}>
      <Concrete />
      <div style={{ position: "absolute", left: 160, top: 60, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>TEAM RATINGS (ELO)</div>
      <div style={{ position: "absolute", left: 160, top: 140, fontFamily: BEBAS, fontSize: 36, letterSpacing: 3, color: MUTE }}>WIN AND YOU TAKE POINTS OFF THE TEAM YOU BEAT</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[1300, 1500, 1700].map((r) => (
          <g key={r}>
            <line x1={X0} x2={X1} y1={sy(r)} y2={sy(r)} stroke={LINE} strokeWidth={2} />
            <text x={X0 - 20} y={sy(r) + 14} textAnchor="end" fontFamily={BEBAS} fontSize={40} fill={MUTE}>{r.toLocaleString("en-US")}</text>
          </g>
        ))}
        <line x1={X0} x2={X0} y1={YT - 30} y2={YB} stroke={INK} strokeWidth={4} />
        <line x1={X0} x2={X1} y1={YB} y2={YB} stroke={INK} strokeWidth={4} />
        <text x={X0 - 20} y={YT - 40} textAnchor="end" fontFamily={BEBAS} fontSize={36} letterSpacing={3} fill={MUTE}>RATING</text>
        <text x={X1} y={YB + 50} textAnchor="end" fontFamily={BEBAS} fontSize={36} letterSpacing={3} fill={MUTE}>GAMES</text>
        <path d={path(fav)} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={path(dog)} fill="none" stroke={TEAL} strokeWidth={6} strokeLinejoin="round" />
        {prog > 0.02 && <><circle cx={sx(prog)} cy={sy(at(fav, prog))} r={11} fill={INK} /><circle cx={sx(prog)} cy={sy(at(dog, prog))} r={11 + 5 * strong} fill={TEAL} /></>}
      </svg>
      {Array.from({ length: H }, (_, j) => j + 1).map((i) => (
        <React.Fragment key={i}>
          <Tick pts={fav} i={i} above keep={histOut * interpolate(prog - i, [1.2, 1.8], [1, 0], clamp)} />
          <Tick pts={dog} i={i} above={false} keep={histOut * interpolate(prog - i, [1.2, 1.8], [1, 0], clamp)} />
        </React.Fragment>
      ))}
      {[H + 1, H + 2].map((i) => (
        <React.Fragment key={i}>
          <Tick pts={fav} i={i} above big keep={1 - climbK} />
          <Tick pts={dog} i={i} above={false} big keep={1 - climbK} />
        </React.Fragment>
      ))}
      {CLIMB.map((_, j) => <Tick key={j} pts={dog} i={H + 3 + j} above keep={(1 - strong) * (j === CLIMB.length - 1 ? 1 : interpolate(prog - (H + 3 + j), [1.2, 1.8], [1, 0], clamp))} />)}
      {/* the two example teams named on their ratings, inside the gap between the lines */}
      {[{ k: pop(f, cues.dog, 8), txt: "UNDERDOG 1,300", col: TEAL, y: sy(1300) - 80 }, { k: pop(f, cues.fav, 8), txt: "FAVOURITE 1,700", col: INK, y: sy(1700) + 26 }].map((l) => (
        <div key={l.txt} style={{ position: "absolute", left: sx(H) - 430, width: 400, textAlign: "right", top: l.y, fontFamily: BEBAS, fontSize: 52, letterSpacing: 2, color: l.col,
          opacity: l.k * (1 - climbK) }}>{l.txt}</div>
      ))}
      {caption("FAVOURITE WINS", cues.win2, cues.win22, H + 1)}
      {caption("UNDERDOG WINS", cues.win22, cues.climb, H + 2)}
      {/* "hurts the favourite way more": the -22 ringed */}
      <div style={{ position: "absolute", left: sx(H + 2) - 95, top: sy(1680) - 124, width: 190, height: 112, border: `5px solid ${RED}`, borderRadius: 12,
        opacity: hurt * (1 - climbK), transform: `scale(${0.9 + 0.1 * hurt})` }} />
      <div style={{ position: "absolute", left: sx(N) - 330, width: 300, textAlign: "right", top: sy(dog[N]) - 90, fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, color: TEAL, opacity: strong }}>
        {dog[N].toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", right: 70, bottom: 40, fontFamily: BEBAS, fontSize: 40, letterSpacing: 3, color: MUTE, opacity: f >= cues.n26 ? 1 : 0 }}>
        GAMES RATED {games.toLocaleString("en-US")}</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ 38a to 38f
// longevity_raw per season (season_ratings.csv + title_credits.csv, v15.3; same numbers as the old LongRec board)
const LONG: { name: string; yrs: Record<number, number> }[] = [
  { name: "FAKER", yrs: { 2013: 0.4, 2014: 0.3, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.06, 2019: 0.3, 2020: 0.3, 2021: 0.3, 2022: 0.3, 2023: 0.3, 2024: 0.3, 2025: 0.3, 2026: 0.3 } },
  { name: "DEFT", yrs: { 2013: 0.03, 2014: 0.37, 2015: 0.4, 2016: 0.4, 2017: 0.4, 2018: 0.3, 2019: 0.29, 2020: 0.4, 2021: 0.34, 2022: 0.3, 2023: 0.4, 2024: 0.14 } },
  { name: "KNIGHT", yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) },
  { name: "CHOVY", yrs: Object.fromEntries([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, 0.4])) }];
const RECOG = [{ name: "CHOVY", v: 100 }, { name: "FAKER", v: 89 }, { name: "KNIGHT", v: 87 }];
const tierOf = (v: number) => (v >= 0.395 ? 2 : v >= 0.2 ? 1 : 0);

/** the year clock runs 2013 to 2026 and each career bar grows by that season (a monster season adds more than one
 *  they only just made); then "#1 FAKER", "14 YEARS", Deft lit; the patch and meta lines on the right; recognition
 *  takes the right half and the left dims (as before) */
export const LongRace: React.FC<{ cues: { start: number; end: number; key: number[]; tagL: number; years: number; deft: number; patch?: number[]; right: number; bars: number[]; tagR: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const dimL = 1 - 0.7 * interpolate(f, [cues.right, cues.right + 12], [0, 1], clamp);
  const rK = pop(f, cues.right, 12);
  const clock = interpolate(f, [cues.start, cues.end], [2012, 2026], clamp); // season 2013 fills between 2012 and 2013
  const year = Math.max(2013, Math.ceil(clock - 0.0001));
  const X0 = 330, W = 740, total = Object.values(LONG[0].yrs).reduce((a, b) => a + b, 0);
  const rowY = (i: number) => 300 + i * 150;
  const sideOut = 1 - pop(f, cues.right - 8, 8);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ opacity: dimL, transform: `scale(${1 - 0.36 * (1 - dimL) / 0.7})`, transformOrigin: "60px 300px" }}>
        <div style={{ position: "absolute", left: 110, top: 110, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>LONGEVITY</div>
        <div style={{ position: "absolute", left: 110, top: 190, fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE }}>GREAT YEARS AT THE TOP, SEASON BY SEASON</div>
        <PartTop text="#1 FAKER" at={cues.tagL} top={118} right={1920 - 1010} />
        {/* the key, said word by word, as a legend */}
        <div style={{ position: "absolute", left: 110, top: 900, display: "flex", gap: 46 }}>
          {[{ t: "GREAT YEAR", tier: 1 }, { t: "MONSTER YEAR", tier: 2 }, { t: "ONLY JUST MADE IT", tier: 0 }].map((it, i) => (
            <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 14, opacity: pop(f, cues.key[i], 8) }}>
              <div style={{ width: 70, height: 34, boxSizing: "border-box", background: it.tier === 2 ? TEAL : it.tier === 1 ? INK : "transparent",
                border: it.tier === 0 ? "3px solid rgba(242,242,238,0.5)" : "none" }} />
              <div style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: it.tier === 2 ? TEAL : it.tier === 1 ? INK : MUTE, whiteSpace: "nowrap" }}>{it.t}</div>
            </div>
          ))}
        </div>
        {LONG.map((p, i) => {
          const y = rowY(i), lead = i === 0, deft = i === 1;
          const yrs = Object.keys(p.yrs).map(Number).sort((a, b) => a - b);
          let x = X0, count = 0;
          const segs = yrs.map((yr) => {
            const g = interpolate(clock, [yr - 1, yr], [0, 1], clamp), w = (p.yrs[yr] / total) * W * g;
            if (g > 0) count++;
            const s = { yr, x, w, tier: tierOf(p.yrs[yr]), g };
            x += w > 0 ? w + 4 * g : 0;
            return s;
          });
          const started = segs.some((s) => s.g > 0);
          const lit = deft ? pop(f, cues.deft, 8) : 0;
          return (
            <div key={p.name} style={{ opacity: started ? 1 : 0.35 }}>
              <div style={{ position: "absolute", left: 110, width: 200, top: y + 6, textAlign: "right", fontFamily: BEBAS, fontSize: 56, letterSpacing: 2,
                color: lead || lit > 0.5 ? TEAL : INK }}>{p.name}</div>
              {segs.map((s) => s.w > 0.5 ? (
                <div key={s.yr} style={{ position: "absolute", left: s.x, top: y, width: s.w, height: 72, boxSizing: "border-box",
                  background: s.tier === 2 ? TEAL : s.tier === 1 ? INK : "transparent", border: s.tier === 0 ? "3px solid rgba(242,242,238,0.5)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: BEBAS, fontSize: 26, color: GROUND }}>
                  {s.w > 44 && s.tier > 0 ? `'${String(s.yr).slice(2)}` : ""}</div>
              ) : null)}
              {/* the face rides the end of the bar, the number of great years beside it */}
              {started && (
                <>
                  <div style={{ position: "absolute", left: x + 10, top: y - 8, width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: `5px solid ${lead ? TEAL : INK}`,
                    boxSizing: "border-box", background: "#1B2027" }}>
                    <Img src={staticFile(P(p.name.toLowerCase()).photo ?? "")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
                  </div>
                  <div style={{ position: "absolute", left: x + 112, top: y + 8, fontFamily: BEBAS, fontSize: 56, lineHeight: 1, color: lead ? TEAL : INK, whiteSpace: "nowrap" }}>
                    {count}<span style={{ fontSize: 34, letterSpacing: 2, color: MUTE }}>{lead && f >= cues.years ? " YEARS" : " YRS"}</span></div>
                </>
              )}
              {deft && lit > 0 && <div style={{ position: "absolute", left: 96, top: y - 10, width: x + 230 - 96, height: 92, border: `4px solid ${TEAL}`, borderRadius: 12, opacity: lit }} />}
            </div>
          );
        })}
      </div>
      {/* the year clock (the NFL timeline's big year in the corner) */}
      <div style={{ position: "absolute", right: 90, top: 250, textAlign: "right", opacity: pop(f, cues.start, 8) * sideOut }}>
        <div style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 4, color: MUTE }}>SEASON</div>
        <div style={{ fontFamily: BEBAS, fontSize: 200, lineHeight: 0.9, color: f >= cues.end ? TEAL : INK }}>{year}</div>
      </div>
      {cues.patch && sideOut > 0 && (
        <div style={{ position: "absolute", right: 90, top: 520, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 34, opacity: sideOut }}>
          {[{ big: "NEW PATCH", small: "EVERY COUPLE OF WEEKS" }, { big: "NEW META", small: "EVERY YEAR" }, { big: "RELEARN THE GAME", small: "OVER AND OVER" }].map((it, i) => {
            const k = pop(f, cues.patch![i], 10);
            return (
              <div key={it.big} style={{ opacity: k, transform: `translateX(${(1 - k) * 30}px)`, borderRight: `8px solid ${i === 2 ? TEAL : INK}`, paddingRight: 24, textAlign: "right" }}>
                <div style={{ fontFamily: BEBAS, fontSize: 64, lineHeight: 1, letterSpacing: 2, color: i === 2 ? TEAL : INK, whiteSpace: "nowrap" }}>{it.big}</div>
                <div style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE, whiteSpace: "nowrap" }}>{it.small}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ opacity: rK }}>
        <div style={{ position: "absolute", left: 1150, top: 110, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>RECOGNITION</div>
        <div style={{ position: "absolute", left: 1150, top: 190, fontFamily: BEBAS, fontSize: 34, letterSpacing: 3, color: MUTE }}>ALL-PRO TEAMS AND MVPS, 0 TO 100</div>
        <PartTop text="#1 CHOVY" at={cues.tagR} top={118} right={70} />
        {RECOG.map((p, i) => {
          const k = interpolate(f, [cues.bars[i], cues.bars[i] + 16], [0, 1], { ...clamp, easing: easeOut }), y = 330 + i * 148, lead = i === 0;
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
