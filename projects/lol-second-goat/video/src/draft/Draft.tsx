// Full draft (19 Nov night): every visual cut to ay's assembled voiceover (voiceover-assembled.mp3, word times from
// voiceover-timing.json). A scene starts on its line and holds until the next scene's line. Footage cards stand in for
// broadcast clips; no music (ay picks the track); the outro is a placeholder until ay records it.
import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import * as St from "../stills/Stills";
import * as Mo from "../motion/Tests";
import * as Cl from "../samples/Climb";
import * as Sm from "../samples/Samples";
import { Build, Count527, Footage, Formula, Quote, Words } from "../rough/RoughCut";
import { AllProTest, MLBoard, SideBars, SideCoins, SideScale, SideTowers, WithWithout } from "./Boards";
import { TrophySplit } from "./TrophySplit";
import { SeasonList } from "./SeasonList";
import { HeadToHead } from "./HeadToHead";
import * as Ov from "./Overlays";
import { KillsLine } from "./KillsLine";
import { Concrete } from "../samples/Climb";
import { PercentStack } from "./PercentStack";
import { PlayerCards, DreamSeasons, MonteCarlo, ORDER_2025, ORDER_2026, ORDER_GENG, PyramidTwist, TwoFakers } from "./Graphics";
import { L, VO_DURATION, W } from "../data/vo";

const FPS = 30;
const LEAD = 4; // seconds before the voice: the broadcast call goes here
const OUTRO = 8;
const TEAL = "#3FD0B5";
/** renders its child only from frame k on (so a clip can join mid-way at a set frame) */
const FromFrame: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => (useCurrentFrame() >= k ? <>{children}</> : null);
const fr = (s: number) => Math.round(s * FPS);

type Ctx = { t0: number; dur: number };
/** a sample built on its own voiceover clock: its frame 0 is VO time T0 (frame `k` is VO time `tk`) */
const anchored = (el: React.ReactNode, T0: number, k = 0) => (c: Ctx) => <Sequence from={fr(T0 - c.t0) - k} layout="none">{el}</Sequence>;
const ft = (text: string) => () => <Footage text={text} />;
const still = (k: keyof typeof St, mode: "wipe" | "rise" | "cut" = "cut") => (c: Ctx) => <Build C={St[k] as React.FC} mode={mode} dur={c.dur} />;
const at = (c: Ctx, t: number) => fr(t - c.t0);

const SCENES: [string, (c: Ctx) => React.ReactNode][] = [
  ["1", ft("BLG lift the Worlds trophy")],
  ["2", ft("Knight close up. Lower third: KNIGHT, FINALS MVP 2026")],
  ["3", ft("Faker, slow motion")],
  // ay 19 Nov style map: Jxmy giant word over footage, then his comment-bubble pile (photo stands in for footage)
  ["4", (c) => <AbsoluteFill><Ov.StandIn src="_local/bin-knight-celebrate-w26-final.jpg" focus={[55, 35]} /><Ov.BigWord text="WHO IS #2?" at={at(c, W("4", "who"))} /></AbsoluteFill>],
  ["5", (c) => <AbsoluteFill><Concrete /><Ov.CommentPile cues={{ from: 2, to: at(c, W("5", "answers")),
    focus: [{ id: "keria", at: at(c, W("6", "ker")) }, { id: "chovy", at: at(c, W("7", "chovy")) }], all: at(c, W("9", "everyone")) }} /></AbsoluteFill>],
  // Jxmy text card, then his big number card on the number (style map 0:44)
  ["10", (c) => <AbsoluteFill><Concrete /><Ov.CardThenNumber text="SO I BUILT A MODEL" value="527" unit="PLAYERS" at={at(c, W("10", "527"))} /></AbsoluteFill>],
  // Jxmy verdict word over the shot: #14, then WRONG (style map 0:58)
  ["11", (c) => <AbsoluteFill><Ov.StandIn src="_local/faker-mvp-award-w24-final.jpg" focus={[50, 30]} />
    <Ov.VerdictWord words={[{ text: "FAKER #14", at: at(c, W("11", "14th")) }, { text: "WRONG", at: at(c, W("13", "wrong")) }]} /></AbsoluteFill>],
  // Jxmy handwritten note over the shot (style map 1:08); photo stands in for a rebuild-year game
  ["14", (c) => <AbsoluteFill><Ov.StandIn src="_local/faker-holds-trophy-w24.jpg" focus={[60, 25]} />
    <Ov.Note text="HIS REBUILDING YEARS" aside="(COUNTED THE SAME)" at={at(c, W("14", "rebuilding"))} asideAt={at(c, W("14", "everything"))} x={170} y={120} to={[1040, 260]} /></AbsoluteFill>],
  ["15", (c) => <MLBoard title="Peak, not average" lines={[
    { text: "Version 1: the average of every year", at: at(c, W("14", "averaging")) },
    { face: "faker", text: "Faker in version 1: #14", at: at(c, W("14", "rebuilding")), dim: true },
    { text: "Now: his best years, and longevity on its own", at: at(c, W("15", "best")) },
    { face: "faker", text: "Faker now: #1", at: at(c, W("15", "longevity")), accent: true }]}
    side={<SideBars caption="Faker's all-time rank" rows={[
      { label: "Average of every year", value: "#14", frac: 0.3, color: "#8E97A3", at: at(c, W("14", "career")) },
      { label: "Best years + longevity", value: "#1", frac: 1, color: TEAL, at: at(c, W("15", "longevity")) }]} />} sideAt={at(c, W("14", "career"))} />],
  // Jxmy line chart (style map 1:22)
  ["16", (c) => <KillsLine cues={{ lck: at(c, L("16").start + 0.3), lpl: at(c, W("16", "lpl")), gap: at(c, W("17", "3")) }} />],
  // Jxmy highlighted page, then big text sliding past (style map 1:34)
  ["18", (c) => <Ov.TextReveal before="So now the model only compares you to" mark="your own league," after="the same year and the same role."
    markAt={at(c, W("18", "compares"))} scroll="LPL MIDS AGAINST LPL MIDS" scrollAt={at(c, W("18", "lpl"))} scrollEnd={at(c, L("18").end + 0.3)} />],
  ["19", ft("a stomp, then a close win over Gen.G")],
  ["20", anchored(<Sm.SElo voice={false} />, Sm.ELO_T0)],
  ["21", (c) => <MLBoard title="Stronger teams count more" lines={[
    { text: "Same stat line", at: at(c, W("21", "same")) },
    { text: "Better opponent, more credit", at: at(c, W("21", "counts")), accent: true }]}
    side={<SideTowers at={at(c, W("21", "same"))} at2={at(c, W("21", "counts"))} />} sideAt={at(c, W("21", "same"))} />],
  // Jxmy chapter title over footage (style map 2:07); photo stands in for a trophy lift
  ["22", (c) => <AbsoluteFill><Ov.StandIn src="_local/faker-kkoma-lift-trophy-w24.jpg" focus={[50, 30]} /><Ov.ChapterTitle text="TROPHIES" at={at(c, L("22").start + 0.2)} /></AbsoluteFill>],
  ["23", (c) => <MLBoard title="How hard was the title?" lines={[
    { text: "Each series: a win chance from Elo", at: at(c, W("23", "brackets")) },
    { text: "Title chance = p1 × p2 × … × pn", at: at(c, W("23", "every")) },
    { text: "Difficulty = coin flips in a row", at: at(c, W("23", "coin")), accent: true }]}
    side={<SideCoins n={9} at={at(c, W("23", "coin"))} label="T1, Worlds 2024: about nine in a row" />} sideAt={at(c, W("23", "coin"))} />],
  // Jxmy number typed over footage (style map 2:13): T1 2024 = 8.69 flips (stills.json events), 2^8.69 = 413; then the hardest-titles bars on "BLG"
  ["24", (c) => <AbsoluteFill><Ov.StandIn src="_local/faker-lifts-trophy-w24-wide.jpg" focus={[50, 35]} /><Ov.TypedNumber text="1 IN 413" at={at(c, W("24", "9"))} sub="ABOUT NINE COIN FLIPS IN A ROW (8.7)" subAt={at(c, W("24", "row"))} /></AbsoluteFill>],
  ["24@bog", still("S14Hardest", "wipe")],
  ["25", still("S13PriceList", "rise")],
  ["26", (c) => <MLBoard title="Five players lift a trophy" label="Win Shares, from basketball:" def="split a team's wins between its players" defAt={at(c, W("26", "winshares"))} lines={[
    { text: "Here: split each title between the five", at: at(c, W("26", "splits")), accent: true }]}
    side={<SideBars caption="BLG, Worlds 2026: share of the title" rows={[["knight", "Knight", 1.061], ["xun", "Xun", 1.027], ["bin", "Bin", 0.988], ["viper", "Viper", 0.983], ["on", "ON", 0.941]].map(([id, n, v], i) => (
      { face: id as string, label: n as string, value: `${(v as number).toFixed(2)}x`, frac: ((v as number) - 0.8) / 0.4, color: i === 0 ? TEAL : "#8E97A3", at: at(c, W("26", "lift")) + i * 6 }))} />} sideAt={at(c, W("26", "lift"))} />],
  // ay 19 Nov: one trophy split five ways (Jxmy pie between photos); cues from the line start, since line 27 is being re-recorded
  ["27", (c) => <TrophySplit cues={{ photos: 0, pie: at(c, L("27").start + 0.4), shares: at(c, L("27").start + 1.6), caption: at(c, L("27").start + 3.0) }} />],
  ["28", still("S16Clutch", "wipe")], // ay 19 Nov: hold the clutch scatter from "clutch" to the end of the Faker line
  ["32", (c) => <WithWithout cues={{ withAt: at(c, W("33", "77")), withoutAt: at(c, W("33", "64")), diffAt: at(c, W("33", "13")), doubtAt: at(c, W("33", "not")) }} />],
  ["34", anchored(<Sm.SPlusMinus voice={false} />, Sm.PM_T0)],
  ["36", () => <Words text="ONLY WHO WON" />],
  ["37", anchored(<Cl.SClimb voice={false} />, Cl.CLIMB_T0)], // Jxmy camera climb to Faker (samples-v14)
  // Jxmy percent stack (jxmy-graphs XMaPrXzclaQ g08), with 100 picks lit on the right
  ["38", (c) => <PercentStack header="HOW MANY ALL-PRO PICKS COME OUT RIGHT" rows={[
    { icon: "dice", label: "PICK AT RANDOM", pct: 12, at: at(c, W("40", "random")) },
    { icon: "trophy", label: "PICK FROM THE WINNING TEAMS", pct: 58, at: at(c, W("40", "winning")) },
    { icon: "model", label: "THE MODEL", pct: 63, at: at(c, W("41", "63")), accent: true }]}
    cues={{ votes: at(c, W("39", "all")), hide: at(c, W("40", "model")), ask: at(c, W("40", "If")) }} />],
  ["42@final", anchored(<Sm.SCards voice={false} />, Sm.CARDS_T0)],
  ["43", (c) => <MLBoard title="Every part, 0 to 100" lines={[
    { text: "50 = the middle of the pack", at: at(c, W("43", "50")) },
    { text: "100 = the best there's ever been", at: at(c, W("43", "100")) },
    { face: "faker", text: "Trophies: Faker is the 100", at: at(c, W("43", "trophies")), accent: true }]}
    side={<SideScale axis="Trophies part, 0 to 100" marks={[
      { v: 50, label: "middle of the pack", color: "#8E97A3", at: at(c, W("43", "50")) },
      { v: 100, label: "Faker 100", color: C.gold, face: "faker", at: at(c, W("43", "faker")) },
      { v: 46, label: "Knight 46", color: TEAL, face: "knight", at: at(c, W("43", "share")), up: false }]} />} sideAt={at(c, W("43", "50"))} />],
  ["44", () => <Words text="THE CATEGORIES" />],
  ["45", (c) => <MLBoard title="Big games" lines={[
    { text: "Form at Worlds and MSI", at: at(c, W("45", "worlds")) },
    { text: "+ clutch: series won above what Elo expected", at: at(c, W("45", "clutch")), accent: true }]}
    side={<SideBars caption="Big games and clutch, 0 to 100" rows={[
      { face: "knight", label: "Knight", value: "99", frac: 0.989, color: TEAL, at: at(c, W("45", "clutch")) },
      { face: "faker", label: "Faker", value: "94", frac: 0.941, color: C.gold, at: at(c, W("45", "clutch")) + 8 }]} />} sideAt={at(c, W("45", "worlds"))} />],
  ["46", still("R4BigStage", "rise")],
  ["47", (c) => <MLBoard title="Skill" lines={[
    { text: "A season rating, adjusted for the opponent and the region", at: at(c, W("47", "adjusted")) },
    { text: "Your best 5 years", at: at(c, W("47", "best")) },
    { text: "+ your single best year", at: at(c, W("47", "single")), accent: true }]} />],
  // Jxmy ranked list that scrolls up to #1 (jxmy-graphs eatF7QHwga4 g02), lands on Knight as he is named
  ["48", (c) => { const kn = at(c, W("48", "knight")); return <SeasonList n={8} cues={{ scroll0: 2, scroll1: kn - 2, spot: kn }} />; }],
  // Jxmy two-player board (jxmy-graphs GPH4nK5sQ-8 g01): Chovy vs Knight, the skill score "by a hair" last
  ["49", (c) => <HeadToHead left="chovy" right="knight" title="MOST SKILLED" cues={{ in: 0, rows: 6, last: at(c, W("49", "hair")) }} rows={[
    { label: "CS AHEAD AT 15 MIN", l: "+10.4", r: "+7.7", better: "l" },
    { label: "GOLD AHEAD AT 15 MIN", l: "+339", r: "+451", better: "r" },
    { label: "KDA", l: "5.67", r: "5.77", better: "r" },
    { label: "DEATHS A GAME", l: "1.69", r: "1.94", better: "l" },
    { label: "WIN RATE", l: "69.2%", r: "66.9%", better: "l" },
    { label: "SKILL SCORE", l: "100", r: "99.9", better: "l", big: true }]} />],
  ["50", still("R4TeamsTimeline", "wipe")],
  ["51", (c) => <MLBoard title="Trophy score" lines={[
    { text: "Each title = price × how hard × his share", at: at(c, W("51", "stack")) },
    { text: "Worlds 100 · MSI 56 · LCK 44 · LPL 35", at: at(c, W("51", "price")), dim: true },
    { text: "Added up over a whole career", at: at(c, W("51", "share")), accent: true }]} />],
  // The cabinet without Faker in view (Canyon, Ruler, Knight named), held still until the silent beat after
  // "by the way", then T2Climb's camera climbs to Faker's trophy score (ay 01:32). Faker's bar is never shown early.
  ["52", (c) => {
    const K = 86; // T2Climb frame where the camera shows Canyon, Ruler and Knight (around 700 points)
    const beat = fr(L("53").end + 0.1 - c.t0);
    return <><Sequence durationInFrames={Math.max(1, beat)} layout="none"><Freeze frame={K}><Mo.T2Climb /></Freeze></Sequence>
      <Sequence from={beat - K} layout="none"><FromFrame k={K}><Mo.T2Climb /></FromFrame></Sequence></>;
  }],
  ["56", (c) => <MonteCarlo cues={[at(c, W("57", "rolls")), at(c, W("60", "thousand")), at(c, W("61", "first"))]} />],
  ["64", anchored(<Sm.SPyramidCam voice={false} />, Sm.PYRC_T0)], // one pyramid, tier by tier (ay 19 Nov)
  ["68", (c) => <PlayerCards title="NOT EVERYTHING FITS IN A NUMBER" titleAt={at(c, W("68", "also"))} stamp={{ text: "GLAZED?", at: at(c, W("68", "glazed")), card: 0 }} cards={[
    { id: "uzi", sub: "#21 ALL TIME", flipAt: at(c, W("68", "uzi")), lines: [{ text: "0 WORLDS", at: at(c, W("68", "worlds")), bad: true }, { text: "AURA", at: at(c, W("68", "aura")) }, { text: "MECHANICS", at: at(c, W("68", "mechanical")) }] },
    { id: "bengi", sub: "#44 ALL TIME", flipAt: at(c, W("68", "benji")), lines: [{ text: "3 WORLDS", at: at(c, W("68", "won", 1)) }, { text: "#247 OWN NUMBERS", at: at(c, W("68", "247")), bad: true }, { text: "SHOTCALLING", at: at(c, W("68", "shot")) }] },
  ]} />],
  ["69", anchored(<Sm.SPyramidCam voice={false} />, Sm.PYRC_T0)],
  ["75", ft("Knight's face; two all-time list cards with no Knight on them")],
  ["76", () => <Words text="TWO TWISTS" />],
  ["77", (c) => <PyramidTwist states={[{ at: 0, order: ORDER_2026, label: "2026" }, { at: at(c, W("77", "2025")), order: ORDER_2025, label: "END OF 2025" }]} />],
  ["79", ft("Worlds 2026 final, BLG vs Gen.G, Knight and Chovy face to face")],
  ["80", (c) => <PyramidTwist glowIds={["knight", "chovy"]} states={[{ at: 0, order: ORDER_2025, label: "END OF 2025" }, { at: at(c, W("80", "fifth")), order: ORDER_2026, label: "2026" },
    { at: at(c, W("81", "gen")), order: ORDER_GENG, label: "IF GEN.G\nHAD WON" }]} />],
  ["82", ft("Faker 2013 and Faker 2026, side by side")],
  ["84", (c) => <TwoFakers cues={[at(c, W("85", "greatest")), at(c, W("85", "15"))]} />],
  ["86", still("S10bPyramidArrow")],
  ["88", still("SampleKnightRadar")],
  ["92", (c) => <DreamSeasons cues={[at(c, W("93", "2029") - 66 / FPS), at(c, W("93", "4") - 88 / FPS)]} />],
  ["94", () => <Quote />],
];

const VO_END = VO_DURATION;
/** "42" starts on line 42; "42@final" starts on the word "final" in line 42 */
const startOf = (key: string) => { const [id, w] = key.split("@"); return (w ? W(id, w) : L(id).start) - 0.05; };
const TL = SCENES.map(([id, el], i) => {
  const t0 = i === 0 ? -LEAD : startOf(id);
  const t1 = i + 1 < SCENES.length ? startOf(SCENES[i + 1][0]) : VO_END + 0.8;
  return { id, el, t0, dur: fr(t1 - t0) };
});
export const DRAFT_TOTAL = fr(LEAD + VO_END + 0.8 + OUTRO);

const Outro: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ fontFamily: F.title, fontSize: 110, color: "#ECE6D2" }}>WHO'S YOUR #2?</div>
    <div style={{ fontFamily: F.body, fontSize: 30, color: C.muted }}>Outro: ay on camera, recorded later</div>
    <div style={{ fontFamily: F.body, fontSize: 26, color: C.muted }}>Not endorsed by Riot Games.</div>
  </AbsoluteFill>
);

export const Draft: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F" }}>
    <Sequence durationInFrames={fr(LEAD)}><Footage text="Cold open: Worlds 2026 final, caster call (broadcast audio)" /></Sequence>
    {TL.map((s, i) => (
      <Sequence key={i} from={fr(LEAD + s.t0) + (i === 0 ? fr(LEAD) : 0)} durationInFrames={s.dur - (i === 0 ? fr(LEAD) : 0)} name={"line " + s.id}>
        <AbsoluteFill>{s.el({ t0: i === 0 ? 0 : s.t0, dur: s.dur })}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={fr(LEAD + VO_END + 0.8)}><Outro /></Sequence>
    <Sequence from={fr(LEAD)}><Audio src={staticFile("vo/vo-assembled.mp3")} /></Sequence>
    <div style={{ position: "absolute", right: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>DRAFT · no music yet</div>
  </AbsoluteFill>
);
