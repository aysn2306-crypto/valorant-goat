// Draft 23 (ay 27 Nov 16:04): two graphics rebuilt, each picked by what the LINE has to show (refs-1127/SOURCES.md):
// - StatRadar (16c, 2:20): ay asked for a spider diagram. Reference: the broadcast "player radars" panel ay sent on
//   18 Nov (refs-1127/ay-radar-broadcast-lck-t1.png: one teal player shape, a white dashed league average, short stat
//   names at the spoke ends) and ay's mid-lane small multiples (ay-radar-small-multiples-mid.png: dashed role
//   average ring). One shape grows a spoke at a time as each stat is said; the dashed ring comes in on "own role".
// - EloSteal (20 and 20a, 3:30): "win and steal points off the team you beat". Reference: j3m's Elo video at 03:04
//   (chart-refs-2/05-j3m-elo-rating-system/graphs/0300-key.jpg), where after a game a block of rating lifts off the
//   loser's tower and lands on the winner's ("the winner taking a certain amount of Elo from the loser"). No arrows,
//   no second line: the block itself moves. Towers stand on 1,250 so a 22 point block is big enough to see.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", TEAL = "#3FD0B5", RED = "#E5484D", GROUND = "#0F1012";
const pop = (f: number, a: number, d = 8) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: easeOut });

// ------------------------------------------------------------------------------------------------ line 16c
// ay 28 Nov 00:13: the spokes follow the voice (kills and deaths, not KDA: the model uses kills and deaths per minute and
// KDA barely counts) and the shape is REAL data, not an invented example: Chovy 2025 against the 12 LCK mids with 20+
// games, spoke = percentile rank (1 = best), dashed ring = the median mid (draft-v26/spider-data.md). No text under the
// names (ay 27 Nov 18:38). LOCKED.
const SPOKES = [
  { term: "GOLD AHEAD AT 15", v: 1.0 },
  { term: "CS AHEAD AT 15", v: 1.0 },
  { term: "KILLS", v: 0.92 },
  { term: "DAMAGE SHARE", v: 0.92 },
  { term: "DEATHS", v: 1.0 }];
const ROLE_AVG = 0.5;

export const StatRadar: React.FC<{ cues: { intro: number; stats: number[]; role: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const CX = 760, CY = 600, R = 300, n = SPOKES.length;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number) => [CX + Math.cos(ang(i)) * r * R, CY + Math.sin(ang(i)) * r * R];
  const poly = (rs: number[]) => rs.map((r, i) => pt(i, r).join(",")).join(" ");
  const web = interpolate(f, [2, 18], [0, 1], { ...clamp, easing: easeOut });
  // each spoke of the player's shape grows on its word
  const grow = SPOKES.map((s, i) => s.v * interpolate(f, [cues.stats[i], cues.stats[i] + 14], [0, 1], { ...clamp, easing: easeOut }));
  const anyShape = grow.some((g) => g > 0.001);
  const roleK = pop(f, cues.role, 12);
  const cur = (i: number) => f >= cues.stats[i] && (i === n - 1 ? f < cues.role : f < cues.stats[i + 1]);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: 120, top: 60, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>WHAT THE MODEL LOOKS AT IN EVERY GAME</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* web: four rings and five spokes, like the broadcast panel */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon key={r} points={poly(SPOKES.map(() => r * web))} fill="none" stroke="rgba(242,242,238,0.16)" strokeWidth={r === 1 ? 3 : 2} />
        ))}
        {SPOKES.map((_, i) => {
          const [x, y] = pt(i, web);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke={cur(i) ? "rgba(63,208,181,0.7)" : "rgba(242,242,238,0.2)"} strokeWidth={cur(i) ? 4 : 2} />;
        })}
        {/* the average player in your role: dashed white ring */}
        {roleK > 0 && <polygon points={poly(SPOKES.map(() => ROLE_AVG * roleK))} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="18 12" opacity={roleK} />}
        {/* the player's shape */}
        {anyShape && <polygon points={poly(grow)} fill="rgba(63,208,181,0.28)" stroke={TEAL} strokeWidth={6} strokeLinejoin="round" />}
        {anyShape && grow.map((g, i) => g > 0.001 ? <circle key={i} cx={pt(i, g)[0]} cy={pt(i, g)[1]} r={cur(i) ? 13 : 9} fill={TEAL} /> : null)}
      </svg>
      {/* spoke names (stat + what it means) */}
      {SPOKES.map((s, i) => {
        const k = Math.max(0.4 * pop(f, cues.intro + i * 3, 8), pop(f, cues.stats[i], 8));
        const [x, y] = pt(i, 1.12);
        const c = Math.cos(ang(i));
        const align = Math.abs(c) < 0.2 ? "center" : c > 0 ? "left" : "right";
        const left = align === "center" ? x - 400 : align === "left" ? x + 6 : x - 806;
        const top = i === 0 ? y - 66 : y - 30;
        return (
          <div key={s.term} style={{ position: "absolute", left, top, width: 800, textAlign: align, opacity: f < cues.stats[i] ? k : k * (cur(i) || f >= cues.role ? 1 : 0.6) }}>
            <div style={{ fontFamily: BEBAS, fontSize: 58, lineHeight: 1, letterSpacing: 2, color: cur(i) ? TEAL : INK, whiteSpace: "nowrap" }}>{s.term}</div>
          </div>
        );
      })}
      {/* legend, as on the broadcast panel (player / average), and the role line */}
      <div style={{ position: "absolute", left: 1300, top: 190, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: pop(f, cues.stats[0], 8) }}>
          <div style={{ width: 80, height: 0, borderTop: `6px solid ${TEAL}` }} />
          <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: TEAL }}>CHOVY 2025</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: roleK }}>
          <div style={{ width: 80, height: 0, borderTop: `6px dashed ${INK}` }} />
          <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK }}>AVERAGE LCK MID</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1300, top: 790, opacity: roleK, transform: `translateY(${(1 - roleK) * 20}px)` }}>
        <div style={{ display: "inline-block", padding: "8px 24px 4px", background: TEAL, borderRadius: 8, fontFamily: BEBAS, fontSize: 48, letterSpacing: 3, color: GROUND, whiteSpace: "nowrap" }}>
          ONLY AGAINST YOUR OWN ROLE</div>
        <div style={{ display: "flex", gap: 22, marginTop: 22 }}>
          {["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"].map((r, i) => (
            <div key={r} style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: MUTE, opacity: pop(f, cues.role + 8 + i * 4, 8) }}>{r}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ lines 20, 20a
const BASE = 1250, PX = 1.4, G = 930, TW = 300, XL = 470, XR = 1050;
const CLIMB = [21, 19, 18];

/** a block of rating lifts off one tower and lands on the other. 20: two even teams, the winner takes 12 (the rule);
 *  20a: underdog 1,300 v favourite 1,700. Favourite wins: a 2 point sliver crosses. Underdog wins: a 22 point block
 *  breaks off the favourite and lands on the underdog, the favourite's -22 in red ("hurts way more"). Then three more
 *  wins against good teams drop onto the underdog ("climbs fast"). */
export const EloSteal: React.FC<{ cues: { steal: number; n26: number; games: number; dog: number; fav: number; win2: number; win22: number; hurt: number; climb: number; strong: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const inK = pop(f, 0, 10);
  const grow = interpolate(f, [2, 22], [0, 1], { ...clamp, easing: easeOut });
  const mv = (a: number, d = 26) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: io });
  // phase 1 (line 20): 1,500 v 1,500, winner takes 12
  const tEven = mv(cues.steal, 26);
  // phase 2 (line 20a): towers move to 1,300 / 1,700 on the numbers
  const toEx = mv(cues.dog - 4, 20);
  const t2 = mv(cues.win2, 22), back2 = mv(cues.win22 - 14, 10), t22 = mv(cues.win22, 30);
  const climbT = CLIMB.map((_, i) => mv(cues.climb + i * 14, 18));
  // the source tower loses its block as it lifts, the other tower only gains it when it lands
  const src = (t: number) => interpolate(t, [0, 0.15], [0, 1], clamp), dst = (t: number) => interpolate(t, [0.85, 1], [0, 1], clamp);
  const climbSum = CLIMB.reduce((a, c, i) => a + c * dst(climbT[i]), 0);
  const exL = 1300 - 2 * src(t2) * (1 - back2) + 22 * dst(t22) + climbSum;
  const exR = 1700 + 2 * dst(t2) * (1 - back2) - 22 * src(t22);
  const vL = (1500 + 12 * dst(tEven)) * (1 - toEx) + exL * toEx;
  const vR = (1500 - 12 * src(tEven)) * (1 - toEx) + exR * toEx;
  const h = (v: number) => (v - BASE) * PX * grow;
  const names = toEx < 0.5 ? ["WINNER", "LOSER"] : ["UNDERDOG", "FAVOURITE"];
  const nameK = toEx < 0.5 ? pop(f, cues.steal + 26, 8) : pop(f, cues.dog, 8);
  const hurt = pop(f, cues.hurt, 10);
  const strong = pop(f, cues.strong, 10);
  const games = Math.round(interpolate(f, [cues.n26, cues.games + 10], [0, 26000], clamp));
  const gamesK = f >= cues.n26 ? 1 - pop(f, cues.dog - 10, 8) : 0;

  // the moving block: lifts off the top of one tower, crosses, lands on the other
  const block = (t: number, pts: number, fromX: number, toX: number, fromTop: number, toTop: number, col: string, a = -1e9) => {
    const bh = Math.max(4, pts * PX);
    if (t <= 0 && f >= a - 12 && f < a + 1) {
      const k = pop(f, a - 12, 6);
      return <div style={{ position: "absolute", left: fromX, top: fromTop - bh, width: TW, height: bh, background: RED, opacity: k }} />;
    }
    if (t <= 0 || t >= 1) return null;
    const lift = Math.sin(Math.min(1, t * 1.15) * Math.PI) * 150;
    const x = fromX + (toX - fromX) * t, y = fromTop + (toTop - fromTop) * t - lift - bh;
    return (
      <>
        <div style={{ position: "absolute", left: x, top: y, width: TW, height: bh, background: col }} />
        <div style={{ position: "absolute", left: x, width: TW, top: y - 92, textAlign: "center", fontFamily: BEBAS, fontSize: 84, lineHeight: 1, color: col,
          opacity: interpolate(t, [0.14, 0.3, 0.85, 0.95], [0, 1, 1, 0], clamp) }}>{pts}</div>
      </>
    );
  };
  const delta = (a: number, b: number, txt: string, x: number, y: number, big = false) => {
    const k = pop(f, a, 8) * (1 - pop(f, b, 8));
    return k > 0 ? <div style={{ position: "absolute", left: x, top: y, width: 220, textAlign: "center", fontFamily: BEBAS, fontSize: big ? 120 : 80, lineHeight: 1,
      color: txt.startsWith("+") ? TEAL : RED, opacity: k }}>{txt}</div> : null;
  };
  const Tower = ({ x, v, name, lit }: { x: number; v: number; name: string; lit: boolean }) => (
    <>
      <div style={{ position: "absolute", left: x, top: G - h(v), width: TW, height: h(v), background: lit ? "rgba(63,208,181,0.16)" : "rgba(242,242,238,0.07)",
        border: `5px solid ${lit ? TEAL : INK}`, borderBottom: "none", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: x - 60, width: TW + 120, top: G - h(v) - 124, textAlign: "center", fontFamily: BEBAS, fontSize: 110, lineHeight: 1, color: lit ? TEAL : INK, opacity: grow }}>
        {Math.round(v).toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: x - 80, width: TW + 160, top: G + 22, textAlign: "center", fontFamily: BEBAS, fontSize: 56, letterSpacing: 4, color: lit ? TEAL : MUTE, opacity: nameK }}>{name}</div>
    </>
  );
  const topL = G - h(vL), topR = G - h(vR);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <Concrete />
      <div style={{ position: "absolute", left: 120, top: 60, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>TEAM RATINGS (ELO)</div>
      <div style={{ position: "absolute", left: 120, top: 140, fontFamily: BEBAS, fontSize: 38, letterSpacing: 3, color: MUTE }}>WIN, AND YOU TAKE POINTS OFF THE TEAM YOU BEAT</div>
      <div style={{ position: "absolute", left: 300, width: 1320 * grow, top: G, height: 5, background: INK }} />
      <Tower x={XL} v={vL} name={names[0]} lit={strong > 0.5} />
      <Tower x={XR} v={vR} name={names[1]} lit={false} />
      {/* line 20: the loser's top block goes to the winner */}
      {block(tEven, 12, XR, XL, G - h(1488), G - h(1500), TEAL, cues.steal)}
      {delta(cues.steal + 26, cues.dog - 10, "+12", XL - 240, topL - 20)}
      {delta(cues.steal + 26, cues.dog - 10, "−12", XR + TW + 20, topR - 20)}
      {/* 20a: favourite wins, 2 points */}
      {block(t2, 2, XL, XR, G - h(1298), G - h(1700), TEAL, cues.win2)}
      {delta(cues.win2 + 22, cues.win22 - 14, "+2", XR + TW + 20, topR - 20)}
      {delta(cues.win2 + 22, cues.win22 - 14, "−2", XL - 240, topL - 20)}
      {/* 20a: underdog wins, 22 points break off the favourite */}
      {block(t22, 22, XR, XL, G - h(1678), G - h(1300), TEAL, cues.win22)}
      {delta(cues.win22 + 30, cues.climb - 4, "+22", XL - 240, topL - 20)}
      {delta(cues.win22 + 30, 1e9, "−22", XR + TW + 20, topR - 20, hurt > 0)}
      {hurt > 0 && <div style={{ position: "absolute", left: XR + TW + 20, width: 220, top: topR + 110, textAlign: "center", fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: RED, opacity: hurt }}>
        HURTS WAY MORE</div>}
      {/* climbs fast: three more wins over good teams land on the underdog */}
      {CLIMB.map((c, i) => {
        const t = climbT[i];
        if (t <= 0 || t >= 1) return null;
        const bh = c * PX, y = -120 + (topL - (-120)) * t - bh;
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: XL, top: y, width: TW, height: bh, background: TEAL }} />
          <div style={{ position: "absolute", left: XL - 240, width: 220, top: y - 30, textAlign: "center", fontFamily: BEBAS, fontSize: 80, lineHeight: 1, color: TEAL }}>+{c}</div>
        </React.Fragment>;
      })}
      <div style={{ position: "absolute", right: 80, bottom: 46, fontFamily: BEBAS, fontSize: 44, letterSpacing: 3, color: MUTE, opacity: gamesK }}>
        GAMES RATED {games.toLocaleString("en-US")}</div>
    </AbsoluteFill>
  );
};
