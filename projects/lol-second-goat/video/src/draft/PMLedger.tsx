// ay 20 Nov 20:01: the 5:16 plus-minus grid was confusing. Line 35 now as a running ledger for one player: each game the
// lineups give his team a chance to win; the result minus that chance is what the game adds (or takes away); add it up
// over a career. The first four games are an illustration (chances made up, labelled); the total is real: Chovy +139 wins
// added over 1,018 games (data/csv/rapm_career.csv, model v15.2). Chovy, not Faker, so line 37's reveal stays a reveal.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE", TEAL = "#3FD0B5", MUTE = "#9BA3AE", BAD = "#E06A5A";
const GAMES = [{ exp: 55, win: true }, { exp: 62, win: false }, { exp: 40, win: true }, { exp: 70, win: true }];
const TOTAL = 139, TOTAL_G = 1018, PER100 = 13.7; // research/data/impact_v15_3_per100.csv

const Chip: React.FC<{ chovy?: boolean; size?: number }> = ({ chovy, size = 92 }) => (
  <div style={{ width: size, height: size, borderRadius: size, overflow: "hidden", flex: "none", background: chovy ? "#E9E6DE" : "#2A2E35",
    border: `3px solid ${chovy ? TEAL : "rgba(242,242,238,0.35)"}` }}>
    {chovy && <Img src={staticFile("players/chovy.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
  </div>
);

/** cues (frames in the scene): lineup = chance bar fills, result = game 1 result, fast = time-lapse starts, done = it lands, n26 = the 26,000 line */
export const PMLedger: React.FC<{ cues: { lineup: number; result: number; fast: number; done: number; n26: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  // which illustrated game is showing, and how far through it
  const gStart = (i: number) => (i === 0 ? cues.lineup : cues.result + 6 + (i - 1) * 16);
  const resAt = (i: number) => (i === 0 ? cues.result : gStart(i) + 8);
  let gi = 0; for (let i = 1; i < GAMES.length; i++) if (f >= gStart(i)) gi = i;
  const g = GAMES[gi];
  const barK = gi === 0 ? interpolate(f, [cues.lineup, cues.lineup + 14], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const resK = interpolate(f, [resAt(gi), resAt(gi) + 5], [0, 1], clamp);
  const delta = (k: number) => (GAMES[k].win ? 1 : 0) - GAMES[k].exp / 100;
  const shownTally = GAMES.reduce((a, _, k) => a + (f >= resAt(k) + 4 ? delta(k) : 0), 0);
  const games = GAMES.filter((_, k) => f >= resAt(k)).length;
  const fast = interpolate(f, [cues.fast, cues.done], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const tally = fast > 0 ? shownTally + (TOTAL - shownTally) * fast : shownTally;
  const gamesN = fast > 0 ? Math.round(games + (TOTAL_G - games) * fast) : games;
  const cardO = 1 - interpolate(f, [cues.fast, cues.fast + 10], [0, 0.65], clamp);
  const landed = f >= cues.done;
  const d = delta(gi);
  const n26 = interpolate(f, [cues.n26, cues.n26 + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 120, top: 60, opacity: tO, fontFamily: BEBAS, fontSize: 72, letterSpacing: 3, color: INK }}>PLUS-MINUS: WINS ADDED</div>
      <div style={{ position: "absolute", left: 124, top: 142, opacity: n26, fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: MUTE }}>26,000 GAMES, EVERY PLAYER WORKED OUT AT ONCE</div>
      {/* the game card */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 1040, opacity: tO * cardO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: MUTE }}>{fast > 0 ? "GAME " + gamesN.toLocaleString("en-US") : "GAME " + (gi + 1)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          {[0, 1, 2, 3, 4].map((k) => <Chip key={"a" + k} chovy={k === 2} />)}
          <div style={{ width: 90, textAlign: "center", fontFamily: BEBAS, fontSize: 48, color: MUTE }}>VS</div>
          {[0, 1, 2, 3, 4].map((k) => <Chip key={"b" + k} />)}
        </div>
        {/* the chance the lineups give his team */}
        <div style={{ marginTop: 46, fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: INK }}>THE LINEUPS SAY: <span style={{ color: TEAL }}>{Math.round(g.exp * barK)}% TO WIN</span></div>
        <div style={{ marginTop: 12, width: 1000, height: 40, background: "rgba(242,242,238,0.08)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${g.exp * barK}%`, background: "#6B7178" }} />
          <div style={{ position: "absolute", left: "50%", top: -8, bottom: -8, width: 2, background: "rgba(242,242,238,0.4)" }} />
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 28, opacity: resK }}>
          <div style={{ padding: "4px 22px", fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, color: "#0F1012", background: g.win ? TEAL : BAD }}>{g.win ? "WIN" : "LOSS"}</div>
          <div style={{ fontFamily: BEBAS, fontSize: 56, color: d > 0 ? TEAL : BAD }}>{(d > 0 ? "+" : "−") + Math.abs(d).toFixed(2)} WINS</div>
          <div style={{ fontFamily: BEBAS, fontSize: 30, color: MUTE, letterSpacing: 1 }}>= RESULT − CHANCE</div>
        </div>
      </div>
      {/* the running total */}
      <div style={{ position: "absolute", left: 1290, top: 250, width: 520, height: 520, border: `3px solid ${landed ? TEAL : "rgba(242,242,238,0.25)"}`, opacity: tO,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Chip chovy size={130} />
        <div style={{ fontFamily: BEBAS, fontSize: 48, letterSpacing: 2, color: INK }}>CHOVY</div>
        <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 1, color: tally >= 0 ? TEAL : BAD }}>{(tally >= 0 ? "+" : "−") + (landed || fast > 0.3 ? Math.round(Math.abs(tally)).toString() : Math.abs(tally).toFixed(2))}</div>
        <div style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: MUTE }}>WINS ADDED · {gamesN.toLocaleString("en-US")} GAMES</div>
        {/* v15.3 (ay 20 Nov 23:09): the score uses wins added per 100 games, so playing more games is not rewarded */}
        <div style={{ fontFamily: BEBAS, fontSize: 52, letterSpacing: 2, color: TEAL, opacity: interpolate(f, [cues.done + 10, cues.done + 18], [0, 1], clamp) }}>
          = +{PER100.toFixed(1)} EVERY 100 GAMES</div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 54, opacity: tO * (1 - fast), fontFamily: BEBAS, fontSize: 26, letterSpacing: 1.5, color: "rgba(155,163,174,0.7)" }}>
        FIRST GAMES ARE AN ILLUSTRATION · THE TOTAL IS CHOVY'S REAL CAREER NUMBER</div>
    </AbsoluteFill>
  );
};
