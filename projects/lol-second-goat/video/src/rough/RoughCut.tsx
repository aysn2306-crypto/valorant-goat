// Rough cut of the whole video (18 Nov evening): script v4 timed at 150 wpm, captions in place of ay's voice,
// grey cards where footage goes, no music. Graphs are the model v12 panels; motion follows refs/ANIMATION.md
// (hard cut in, one change, then hold). Half-size draft for ay's notes.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { clamp, prog, Photo } from "../lib/ui";
import * as St from "../stills/Stills";
import * as Mo from "../motion/Tests";
import { CREAM, Stage } from "../stills/kit";

const FPS = 30;

// ---------- small scene parts ----------
const Footage: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ background: "#1A1D22", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#5D6573" }}>FOOTAGE</div>
    <div style={{ fontFamily: F.body, fontSize: 40, color: "#9AA3B2", marginTop: 14, maxWidth: 1300, textAlign: "center" }}>{text}</div>
  </AbsoluteFill>
);

const Words: React.FC<{ text: string; sub?: string; black?: boolean }> = ({ text, sub, black }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: black ? "#000" : "#0B0B0F", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: F.title, fontSize: 130, color: CREAM, letterSpacing: 2, textAlign: "center", lineHeight: 1.05, whiteSpace: "pre-line", opacity: f >= 4 ? 1 : 0 }}>{text}</div>
      {sub && <div style={{ fontFamily: F.body, fontSize: 36, color: C.muted, marginTop: 24, opacity: f >= 4 ? 1 : 0 }}>{sub}</div>}
    </AbsoluteFill>
  );
};

/** A finished v12 panel, entered by hard cut. "wipe" draws it left to right (lines, scatters), "rise" bottom up
 *  (bars, pyramid, lists), "cut" holds still. A barely visible push keeps long holds alive (ANIMATION.md C, 20 px/s). */
const Build: React.FC<{ C: React.FC; mode?: "wipe" | "rise" | "cut"; dur: number }> = ({ C: Comp, mode = "cut", dur }) => {
  const f = useCurrentFrame();
  const t = prog(f, 6, 6 + 40);
  const clip = mode === "wipe" ? `inset(0 ${(1 - t) * 100}% 0 0)` : mode === "rise" ? `inset(${(1 - t) * 100}% 0 0 0)` : undefined;
  const s = interpolate(f, [0, Math.max(dur, 60)], [1, 1 + dur / FPS * 0.0011], clamp);
  return (
    <AbsoluteFill style={{ background: "#0B0B0F" }}>
      {/* the axes/title frame stays, the data reveals: show the panel dimmed underneath, the full one revealed on top */}
      {mode !== "cut" && <AbsoluteFill style={{ opacity: 0.18, transform: `scale(${s})` }}><Comp /></AbsoluteFill>}
      <AbsoluteFill style={{ clipPath: clip, transform: `scale(${s})` }}><Comp /></AbsoluteFill>
    </AbsoluteFill>
  );
};

/** MachineLoLing "Fair Coin": one walk, then 60 faint walks, the band of luck narrowing as series grow. */
const rnd = (seed: number) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; };
const WALKS = Array.from({ length: 60 }, (_, k) => {
  const r = rnd(k * 7919 + 13); let h = 0; const pts: number[] = [];
  for (let n = 1; n <= 400; n++) { h += r() < 0.5 ? 1 : 0; pts.push(h / n); }
  return pts;
});
const FairCoin: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 260, x1 = 1700, y0 = 200, y1 = 820;
  const X = (n: number) => x0 + (Math.log(n) / Math.log(400)) * (x1 - x0);
  const Y = (v: number) => y1 - v * (y1 - y0);
  const path = (pts: number[], upto: number) => pts.slice(0, upto).map((v, i) => `${i ? "L" : "M"}${X(i + 1).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const one = Math.floor(interpolate(f, [10, 100], [1, 400], clamp));
  const many = Math.floor(interpolate(f, [130, 230], [1, 400], clamp));
  const band = prog(f, 250, 280);
  return (
    <Stage title="A FAIR COIN">
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} y1={y1} x2={x1 + 20} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        <line x1={x0} y1={y0 - 20} x2={x0} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        <line x1={x0} y1={Y(0.5)} x2={x1} y2={Y(0.5)} stroke="rgba(237,239,242,0.35)" strokeDasharray="6 8" strokeWidth={2} />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => <text key={v} x={x0 - 24} y={Y(v) + 14} textAnchor="end" fill={C.text} fontFamily={F.title} fontSize={40}>{Math.round(v * 100)}%</text>)}
        {[1, 5, 25, 100, 400].map((n) => <text key={n} x={X(n)} y={y1 + 54} textAnchor="middle" fill={C.text} fontFamily={F.title} fontSize={40}>{n}</text>)}
        <text x={(x0 + x1) / 2} y={y1 + 110} textAnchor="middle" fill={C.text} fontFamily={F.title} fontSize={40} letterSpacing={1.5}>SERIES PLAYED (LOG SCALE)</text>
        <text x={x0 + 24} y={y0 - 4} fill={C.text} fontFamily={F.title} fontSize={40} letterSpacing={1.5}>SHARE WON</text>
        {f >= 130 && WALKS.map((w, k) => <path key={k} d={path(w, many)} fill="none" stroke={C.cyan} strokeOpacity={0.22} strokeWidth={2} />)}
        <path d={path(WALKS[3], one)} fill="none" stroke={C.cyan} strokeWidth={4} />
        {band > 0 && <path d={`M${X(1)},${Y(0.5 + 0.5)} ${Array.from({ length: 80 }, (_, i) => { const n = Math.exp((i / 79) * Math.log(400)); return `L${X(n)},${Y(Math.min(1, 0.5 + 1.96 * 0.5 / Math.sqrt(n)))}`; }).join(" ")} ${Array.from({ length: 80 }, (_, i) => { const n = Math.exp(((79 - i) / 79) * Math.log(400)); return `L${X(n)},${Y(Math.max(0, 0.5 - 1.96 * 0.5 / Math.sqrt(n)))}`; }).join(" ")} Z`}
          fill="rgba(245,184,61,0.12)" stroke={C.gold} strokeWidth={2} opacity={band} />}
        {band >= 1 && <text x={X(60)} y={Y(0.7)} fill={C.gold} fontFamily={F.title} fontSize={48}>LUCK</text>}
      </svg>
    </Stage>
  );
};

/** MachineLoLing formula board: the concept's name, then one line at a time, the last line in the accent. */
const Formula: React.FC<{ lines: string[]; name?: string }> = ({ lines, name }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      {name && <div style={{ position: "absolute", left: 220, top: 170, fontFamily: F.title, fontSize: 84, letterSpacing: 2, color: CREAM }}>{name}</div>}
      <div style={{ position: "absolute", left: 220, top: name ? 340 : 300, display: "flex", flexDirection: "column", gap: 34 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: F.body, fontWeight: 600, fontSize: l.length > 44 ? 46 : 64, maxWidth: 1500, color: i === lines.length - 1 ? C.cyan : C.text, opacity: f >= 8 + i * 40 ? 1 : 0 }}>{l}</div>
        ))}
      </div>
    </Stage>
  );
};

const Count527: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(527 * prog(f, 10, 100));
  const r = rnd(5);
  const pts = Array.from({ length: 527 }, () => [120 + r() * 1680, 150 + r() * 780, r()]);
  return (
    <Stage>
      {pts.slice(0, n).map(([x, y, h], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: 7, borderRadius: 4, background: h > 0.96 ? C.gold : h > 0.7 ? "#F2C14A" : "#E8622C", opacity: 0.75 }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: F.title, fontSize: 220, color: CREAM, textShadow: "0 0 30px rgba(0,0,0,0.9)" }}>{n}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: F.title, fontSize: 56, color: C.text, letterSpacing: 2 }}>PROS SCORED, 2011 TO 2026</div>
    </Stage>
  );
};

/** Titles needed to pass Faker (scoring/titles_needed.py), active non-T1 players only. Trophies only. */
const NEED: [string, number, number][] = [["knight", 1, 7], ["chovy", 0, 8], ["ruler", 1, 9], ["zeus", 2, 10], ["canyon", 1, 11]];
const Cup: React.FC<{ filled: boolean; o: number }> = ({ filled, o }) => (
  <svg width={34} height={40} viewBox="0 0 34 40" style={{ opacity: o }}>
    <path d="M6 2 H28 V12 C28 20 22 24 17 24 C12 24 6 20 6 12 Z M14 24 H20 V31 H25 V37 H9 V31 H14 Z" fill={filled ? C.gold : "none"} stroke={filled ? C.gold : "rgba(237,239,242,0.55)"} strokeWidth={2} />
  </svg>
);
const TitlesNeeded: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage title="WORLDS NEEDED TO PASS FAKER">
      <div style={{ position: "absolute", left: 140, right: 140, top: 230, display: "flex", flexDirection: "column", gap: 34 }}>
        {NEED.map(([id, have, need], i) => {
          const a = 10 + i * 14;
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 26, opacity: f >= a ? 1 : 0 }}>
              <Photo id={id} size={92} round ring={i === 0 ? C.cyan : "rgba(237,239,242,0.4)"} />
              <div style={{ width: 230, fontFamily: F.title, fontSize: 46, color: i === 0 ? C.cyan : C.text, letterSpacing: 1 }}>{id.toUpperCase()}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {Array.from({ length: have + need }, (_, k) => <Cup key={k} filled={k < have} o={k < have || f >= a + 30 + k * 3 ? 1 : 0} />)}
              </div>
              <div style={{ marginLeft: "auto", fontFamily: F.title, fontSize: 52, color: C.text, opacity: f >= a + 70 ? 1 : 0 }}>+{need}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 130, fontFamily: F.body, fontSize: 24, color: C.muted }}>Gold = Worlds won · outline = extra Worlds needed, everything else unchanged · Faker's teammates left out</div>
    </Stage>
  );
};

const Quote: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{ position: "absolute", left: 220, right: 220, top: 300, display: "flex", gap: 50, alignItems: "center", opacity: prog(f, 0, 8) }}>
        <Photo id="gumayusi" size={260} round ring={C.gold} />
        <div>
          <div style={{ fontFamily: F.body, fontSize: 56, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>"If my goal was to become the best player in the world, I couldn't stay with T1 forever."</div>
          <div style={{ fontFamily: F.body, fontSize: 30, color: C.muted, marginTop: 20 }}>Gumayusi, Daily Esports (translated)</div>
        </div>
      </div>
    </Stage>
  );
};

const EndCard: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ fontFamily: F.title, fontSize: 110, color: CREAM }}>WHO'S YOUR #2?</div>
    <div style={{ fontFamily: F.body, fontSize: 28, color: C.muted }}>Not endorsed by Riot Games.</div>
  </AbsoluteFill>
);

/** Pyramid built bottom up: everything above `top` (px) stays hidden; tier 2 can show Chovy's half only. */
const Pyr: React.FC<{ top: number; chovyOnly?: boolean }> = ({ top, chovyOnly }) => {
  const clip = chovyOnly
    ? `polygon(0 489px, 960px 489px, 960px 321px, 1920px 321px, 1920px 1080px, 0 1080px)`
    : `inset(${top}px 0 0 0)`;
  return (
    <AbsoluteFill style={{ background: "#0B0B0F" }}>
      <AbsoluteFill style={{ opacity: 0.22, clipPath: "inset(0 0 0 0)" }}><St.S10aPyramidInternet /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}><St.S10Pyramid /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- the script, row by row ----------
type V = { k: string; el: (dur: number) => React.ReactNode };
const ft = (text: string): V => ({ k: "ft:" + text, el: () => <Footage text={text} /> });
const still = (k: keyof typeof St, mode: "wipe" | "rise" | "cut" = "cut"): V => ({ k: "st:" + k, el: (d) => <Build C={St[k] as React.FC} mode={mode} dur={d} /> });
const mo = (k: string, el: React.ReactNode): V => ({ k: "mo:" + k, el: () => el });

// [voice line, visual, extra silence in seconds after it]
const ROWS: [string, V, number?][] = [
  ["(broadcast call)", ft("Worlds 2026 final, last fight, BLG wins, caster call"), 0],
  ["Bilibili Gaming just won the World Championship.", ft("BLG lift the trophy")],
  ["Knight is Finals MVP, the first Chinese mid laner to ever win Worlds. Viper has his second title.", ft("Knight close up, then Viper. Lower third: KNIGHT, FINALS MVP 2026")],
  ["Faker is still the greatest of all time. Nobody serious argues that.", ft("Faker, slow motion")],
  ["But this win changes the race for number two. So who is it now?", mo("title", <Words text={"WHO IS #2\nAFTER FAKER?"} black />), 1.5],
  ["This is one of the most asked questions in League.", still("S2Debate", "cut")],
  ["Some say Keria, three world titles before most players win one.", still("S2Debate", "cut")],
  ["Some say Chovy, maybe the best laner we have ever seen, still chasing a Worlds.", still("S2Debate", "cut")],
  ["And after this month, a lot of people are saying Knight.", still("S2Debate", "cut")],
  ["Everyone has an opinion. I wanted an answer.", still("S2Debate", "cut")],
  ["So I built a model that scores every pro with enough games, from 2011 to now. Five hundred and twenty seven players.", mo("527", <Count527 />)],
  ["My first version did the obvious thing. Add up trophies, add up stats, rank everyone.", mo("f1", <Formula lines={["score = trophies + stats", "rank everyone"]} />)],
  ["And it put Faker at number 14.", mo("w14", <Words text="FAKER: #14" sub="version 1" />)],
  ["That's obviously wrong. So the question is why.", mo("w14", <Words text="FAKER: #14" sub="version 1" />)],
  ["It was averaging his whole career, rebuilding years and all.", mo("f2", <Formula name="PEAK, NOT AVERAGE" lines={["average of every year  ✗", "best years + longevity  ✓"]} />)],
  ["Nobody judges a great by their quiet years. So the model looks at each player's best years, and longevity gets its own score.", mo("f2", <Formula name="PEAK, NOT AVERAGE" lines={["average of every year  ✗", "best years + longevity  ✓"]} />)],
  ["Next problem. LPL players looked like monsters.", still("S22Kills", "wipe")],
  ["Since 2016, an LPL game has had about three more kills in it than an LCK game. More fighting, more kills for everyone.", still("S22Kills", "wipe")],
  ["So every stat is compared only against players in the same role, same league, same year.", mo("f3", <Formula name="LEAGUE-ADJUSTED Z-SCORE" lines={["z = (stat − average) ÷ spread", "average and spread: same role · same league · same year"]} />)],
  ["Then there's who you're playing against. Stomping a bottom team is not the same as beating Gen.G.", ft("a stomp vs a close win over Gen.G")],
  ["The model rates every team after every game since 2011, like chess ratings. Almost twenty six thousand games.", mo("elo", <Formula name="ELO RATING" lines={["rating gap → expected win chance", "win more than expected → rating goes up", "25,987 games, every team rated after every one", "used in: strength of schedule · title difficulty · clutch"]} />)],
  ["Against stronger teams, the same stat line counts for more.", mo("f4", <Formula name="STRENGTH OF SCHEDULE" lines={["same stat line", "stronger opponent (higher Elo) → more credit"]} />)],
  ["Trophies are the biggest part of any GOAT case. But how much is an MSI worth next to a Worlds?", ft("a trophy lift")],
  ["The model works it out from the brackets. For every title, how many coin flips in a row would a top team need to win it, against those exact opponents?", mo("f5", <Formula name="TITLE DIFFICULTY" lines={["P(title) = p₁ × p₂ × … × pₙ   (each series from Elo)", "difficulty = coin flips in a row with the same odds"]} />)],
  ["T1's 2024 Worlds run was the hardest since 2016: almost nine coin flips in a row. BLG this year, second.", still("S14Hardest", "wipe")],
  ["So the price list is half tradition, half maths. Worlds 100. MSI 56. An LCK title 44, an LPL title 35.", still("S13PriceList", "rise")],
  ["And five players lift a trophy. Basketball has Win Shares, which splits a team's wins between its players.", mo("ws", <Formula name="TITLE SHARES" lines={["like Win Shares: split each trophy between the five", "share = how far above his role he played, held to 0.85x–1.15x", "BLG, Worlds 2026: Knight 1.06 · Xun 1.03 · Bin 0.99 · Viper 0.98 · On 0.94", "Knight: 695 trophy points (672 if split equally) · still #2 either way"]} />)],
  ["The model does the same with titles. A support doesn't win less of a Worlds, so everyone on the team gets close to equal credit.", still("S24Credit", "rise")],
  ["Here's the part I find most interesting. Some players look clutch. They win every game five.", still("R6ClutchHist", "rise")],
  ["But flip a coin ten times and sometimes you get eight heads. That doesn't make the coin clutch.", mo("coin", <FairCoin />)],
  ["So the model asks how many more best of fives you won than the team ratings expected, across a whole career.", mo("coin", <FairCoin />)],
  ["The most clutch player in the data? Faker, about 25 more series won than expected. Just ahead of Bin.", still("S16Clutch", "wipe"), 1.5],
  ["Last piece. The simple version first: how does a team do with him, and without him?", still("SampleWithWithout", "rise")],
  ["Gen G won seventy seven percent of their games with Chovy. Sixty four without him. Ruler and Knight, about the same jump.", still("SampleWithWithout", "rise")],
  ["But teams change more than one player at a time. So the model uses the grown up version, borrowed from basketball. Plus minus.", mo("pm", <Formula name="ADJUSTED PLUS-MINUS (RAPM)" lines={["each game: win or loss = 5 ratings − 5 ratings", "solve for all players at once, 25,987 games", "small samples are pulled toward zero (ridge)", "→ the Team impact part of the score"]} />)],
  ["Every game, five players against five. Over twenty six thousand games, you can work out who makes their team win more than the lineup says it should.", mo("pm", <Formula name="ADJUSTED PLUS-MINUS (RAPM)" lines={["each game: win or loss = 5 ratings − 5 ratings", "solve for all players at once, 25,987 games", "small samples are pulled toward zero (ridge)", "→ the Team impact part of the score"]} />)],
  ["It knows nothing about kills or trophies. Only who won.", mo("pm", <Formula name="ADJUSTED PLUS-MINUS (RAPM)" lines={["each game: win or loss = 5 ratings − 5 ratings", "solve for all players at once, 25,987 games", "small samples are pulled toward zero (ridge)", "→ the Team impact part of the score"]} />)],
  ["And it still puts Faker first, by a mile. Then Ruler.", still("S15Impact", "rise")],
  ["So how do you know a model like this is right?", still("S23AllPro", "cut")],
  ["The All-Pro votes were hidden from it. Every year, the people who watch every game pick the best players at each position.", still("S23AllPro", "cut")],
  ["Then I asked the model to pick them. Picking at random gets it right 12% of the time. Just picking players from winning teams, 58%.", still("S23AllPro", "cut")],
  ["My model: 63%.", still("S23AllPro", "cut"), 1.5],
  ["The final score comes from six parts: trophies, skill, big games and clutch, team impact, longevity, and recognition.", still("S17ScoreCard", "wipe")],
  ["Every part is scored the same way. The middle player in the pool gets fifty, the best gets a hundred. For trophies, Faker is the hundred and everyone else is a share of him.", mo("parts", <Formula name="EACH PART, 0 TO 100" lines={["pool median = 50 · best player = 100", "trophies: Faker = 100, everyone else in proportion"]} />)],
  ["Before the final ranking, here's who wins each part.", mo("cats", <Words text="THE CATEGORIES" />)],
  ["Big games mixes two things: form at Worlds and MSI, and clutch.", mo("big", <Formula name="BIG GAMES + CLUTCH" lines={["form at Worlds and MSI", "+ best-of-five wins above Elo expectation"]} />)],
  ["On the form half alone, best on the big stage: Keria.", still("R4BigStage", "rise")],
  ["Skill uses a season rating, adjusted for the opponent and the region. It looks at your best five years, and at your single best year.", mo("skill", <Formula name="SKILL" lines={["season rating: opponent and region adjusted", "best 5 years + best single year"]} />)],
  ["Best single season: Knight, this year.", mo("t1rise", <Mo.T1Rise />), 3.5],
  ["Most skilled: Chovy, by a hair over Knight.", still("SampleSkillSwarm", "rise")],
  ["Most titles with different teams: Peanut, with five.", still("R4TeamsTimeline", "wipe")],
  ["Trophy points stack everything from before: the price list, how hard the title was, and his title share.", mo("tp", <Formula name="TROPHY POINTS" lines={["each title: price × difficulty (0.85x–1.15x) × title share", "summed over a whole career, placings included"]} />)],
  ["And the trophy cabinet. Canyon wins it, just ahead of Ruler and Knight.", still("R4CabinetStack", "wipe")],
  ["Oh, and here's Faker, by the way.", mo("climb", <Mo.T2Climb />), 3.5],
  ["1,509.", mo("climb", <Mo.T2Climb />), 3.5],
  ["More than double anyone else. So the real fight is for second.", mo("climb", <Mo.T2Climb />)],
  ["But how sure can we be? The weights are my choices. Move them a little, and maybe the answer moves too.", mo("mcq", <Footage text="PENDING: the six part names on the score card, each part bar wobbling, no numbers" />)],
  ["So the model rolls the dice. It's called a Monte Carlo test, named after the casino, because it runs on chance.", mo("mc", <Formula name="MONTE CARLO TEST" lines={["roll the dice on every weight: up to 30% up or down", "rank all 527 players again", "repeat 1,000 times, count where each player lands"]} />)],
  ["One roll might make trophies count a bit more and skill a bit less. The next one, the other way round. Then everyone gets ranked again.", mo("mcroll", <Footage text="PENDING: one roll shown: six weight bars jump, the top 5 reshuffles, a counter ticks 1 of 1,000" />)],
  ["If someone is only number two because of my exact numbers, a thousand rolls will find out fast.", mo("mcroll", <Footage text="PENDING: one roll shown: six weight bars jump, the top 5 reshuffles, a counter ticks 1 of 1,000" />)],
  ["So the model did it a thousand times.", still("S7Reruns", "wipe")],
  ["Faker came first in all one thousand.", still("S7Reruns", "wipe")],
  ["And one name came second in every single one.", still("S7Reruns", "wipe"), 1.5],
  ["We'll get to who. First, a couple of things that could change the answer.", still("S7Reruns", "wipe")],
  ["First twist. Split Faker's career down the middle. 2013 to 2019, and 2020 to now. Three world titles in each half.", ft("Faker 2013 and Faker 2026, side by side")],
  ["Same model, same weights. Only his games are split by year.", mo("split", <Formula name="TWO FAKERS" lines={["Faker 2013–19: 3 Worlds", "Faker 2020–26: 3 Worlds", "scored as two separate players against everyone else"]} />)],
  ["So I split him into two players.", still("S9TwoFakers", "cut")],
  ["The young Faker alone would be the greatest of all time. Ahead of Knight, ahead of everyone. In three out of four reruns, he's number one. And the second half is still top fifteen. He did both.", still("S9TwoFakers", "cut"), 1.5],
  ["Second twist. Let's go back in time. Run the model at the end of every year, using only the games played up to then.", mo("tt", <Footage text="PENDING: rewind sweep, year counter running back from 2026" />)],
  ["2025, Faker. 2024, Faker. And the year before that. And the year before that.", mo("ttf", <Footage text="PENDING: year-end number one by year, 2015 to 2026, Faker's face in every slot; number two never named" />)],
  ["All the way back to 2015, the first year with enough games to judge. That's when Faker takes number one. He has never come down.", mo("ttf", <Footage text="PENDING: year-end number one by year, 2015 to 2026, Faker's face in every slot; number two never named" />), 1.5],
  ["And watch the gap. In 2015 he's fifteen points clear. By 2020, thirty one.", mo("gap", <Footage text="PENDING: Faker minus number two by year, 2015 to 2026: 15.5, peak 31 in 2020 to 2021, 19.7 now" />)],
  ["Now it's under twenty. The closest anyone has been since 2015.", mo("gap", <Footage text="PENDING: Faker minus number two by year, 2015 to 2026: 15.5, peak 31 in 2020 to 2021, 19.7 now" />), 1.5],
  ["So here's the pyramid. Not a top ten. Tiers of greatness.", mo("p0", <Pyr top={1080} />)],
  ["At the bottom, numbers thirty one to sixty two. Legends of their own regions.", mo("p5", <Pyr top={795} />)],
  ["Then the stars. The best player on a great team.", mo("p4", <Pyr top={639} />)],
  ["Now, the internet won't like this. Every all-time list from the last two years has Uzi and Bengi in its top ten.", still("S10aPyramidInternet", "cut")],
  ["We have them at thirty and forty one. Uzi never won Worlds, and trophies are the biggest part of this model. Bengi won three, but his own numbers rank two hundred and forty seventh. Shotcalling, comms, being the voice in the room: the model can't see any of that.", still("S10aPyramidInternet", "cut"), 1.5],
  ["Then the absolute top of League.", mo("p3", <Pyr top={489} />)],
  ["Then a tier of two, two points apart.", mo("p3b", <Pyr top={489} />), 1],
  ["Chovy.", mo("p2c", <Pyr top={489} chovyOnly />)],
  ["And second greatest of all time...", mo("p2c2", <Pyr top={489} chovyOnly />), 1],
  ["Knight.", mo("p2", <Pyr top={321} />), 1.5],
  ["And here's the part that gets me. Rewind one year, to the end of 2025.", mo("tt2025", <Footage text="PENDING: the pyramid rewinds to end of 2025: Chovy in tier 2, Knight drops to number 5 (waits on the year-end export)" />)],
  ["Chovy was second. Knight was fifth.", mo("tt2025", <Footage text="PENDING: the pyramid rewinds to end of 2025: Chovy in tier 2, Knight drops to number 5 (waits on the year-end export)" />), 1],
  ["Then the Worlds final. Knight against Chovy.", ft("Worlds 2026 final, BLG vs Gen.G, Knight and Chovy face to face")],
  ["One year, capped by that final, took Knight from fifth to second. Past the man across the lane.", mo("tt2026", <Footage text="PENDING: pyramid snaps back to 2026, Knight climbs from 5 into tier 2 above Chovy (motion like T2Climb)" />)],
  ["PENDING: if Gen.G had won it, would Chovy have locked in second? (model thread what-if)", mo("tt2026", <Footage text="PENDING: pyramid snaps back to 2026, Knight climbs from 5 into tier 2 above Chovy (motion like T2Climb)" />), 1.5],
  ["One world title. But the best single season ever recorded, by this model, near the top for years, and he just beat everyone.", ft("Knight at Worlds 2026")],
  ["And none of those lists even have him. They were written before he won Worlds.", ft("Knight's face, the two list cards with no Knight")],
  ["And at the top, alone, Faker. Number two.", still("S10bPyramidArrow", "cut")],
  ["But what would it take for a player like Knight or Chovy to get from here... to here?", still("S10bPyramidArrow", "cut")],
  ["Here's the whole score, part by part. The model has Knight level with Faker, or ahead, almost everywhere. The gap is trophies.", mo("kvf", <Formula name="KNIGHT VS FAKER" lines={["trophies: Faker 100 · Knight 46", "big games: 94 · 99   skill: 79 · 100", "team impact: 100 · 76   longevity: 100 · 90", "recognition: being fixed (LCK All-Pro votes only from 2020)"]} />), 1.5],
  ["What would it take for Knight to reach Faker's legacy?", still("SampleKnightRadar", "cut")],
  ["The model says Knight already beats Faker at skill and in big games.", still("SampleKnightRadar", "cut")],
  ["Faker wins team impact and longevity. And winning.", still("SampleKnightRadar", "cut"), 1.5],
  ["So the model played his future forward. One season at a time: his stats, his trophies, everything, until his total passes Faker's.", mo("needf", <Formula name="DREAM SEASONS" lines={["add one full season: stats + every trophy (league, MSI, Worlds)", "rescore all six parts, Faker included", "repeat until the total passes 92.6", "PENDING: model thread's full-score sim for Knight and Chovy"]} />)],
  ["PENDING: the number of dream seasons Knight and Chovy need, from the full-score sim.", mo("need", <TitlesNeeded />), 3],
  ["Speaking of catching Faker. Gumayusi left T1 last year, and said this.", mo("quote", <Quote />), 1],
  ["You've still got a long way to go, buddy.", mo("guma", <Formula name="GUMAYUSI" lines={["3 Worlds now", "Worlds only: +13 more to pass Faker", "or 9 perfect years"]} />), 1.5],
  ["Who's your number two? Let me know in the comments.", ft("ay on camera (face cam outro)")],
  ["(ay, own words: first big video, thanks for watching, like and subscribe if you want more like this)", ft("ay on camera, end screen with two video slots for the last 20 s")],
];

const secsFor = (t: string) => Math.max(2, t.split(/\s+/).length / 2.5 + 0.4);
type Beat = { start: number; dur: number; text: string; v: V };
const LINES: Beat[] = [];
{
  let at = 0;
  for (const [text, v, extra] of ROWS) {
    const d = Math.round((text.startsWith("(") ? 6 : secsFor(text) + (extra ?? 0)) * FPS);
    LINES.push({ start: at, dur: d, text, v });
    at += d;
  }
}
// merge rows that keep the same visual, so its animation runs on
const SCENES: { start: number; dur: number; v: V }[] = [];
for (const l of LINES) {
  const last = SCENES[SCENES.length - 1];
  if (last && last.v.k === l.v.k) last.dur += l.dur; else SCENES.push({ start: l.start, dur: l.dur, v: l.v });
}
export const ROUGH_TOTAL = LINES[LINES.length - 1].start + LINES[LINES.length - 1].dur;

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: F.body, fontSize: 34, fontWeight: 500, color: C.text, background: "rgba(0,0,0,0.72)", padding: "8px 22px", borderRadius: 8, maxWidth: 1600, textAlign: "center" }}>{text}</div>
  </div>
);

export const RoughCut: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F" }}>
    {SCENES.map((s, i) => (
      <Sequence key={i} from={s.start} durationInFrames={s.dur} name={s.v.k}>{s.v.el(s.dur)}</Sequence>
    ))}
    {LINES.map((l, i) => (
      <Sequence key={"c" + i} from={l.start} durationInFrames={l.dur} layout="none"><Caption text={l.text} /></Sequence>
    ))}
    <div style={{ position: "absolute", left: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>ROUGH CUT · captions stand in for ay's voice · no music</div>
  </AbsoluteFill>
);
