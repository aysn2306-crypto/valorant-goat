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
import { HardestBars, PriceClimb } from "./Bars";
import { Concrete } from "../samples/Climb";
import { PercentStack } from "./PercentStack";
import { PillBars, StackedLines, TitleList } from "./Lists";
import { OnBlack, RecordCounter } from "./Banners";
import { Clip, Cuts, RingClip, SplitClips } from "./Clip";
import { FansVsModel } from "./Slope";
import { CHOVY_ROW, GUMA_ROW, KNIGHT_ROW, Silverware } from "./Silverware";
import { PlayerCards, DreamSeasons, MonteCarlo, ORDER_2025, ORDER_2026, ORDER_GENG, PyramidTwist, TwoFakers } from "./Graphics";
import { L, VO_DURATION, W } from "../data/vo";

const FPS = 30;
const LEAD = 20; // the Nexus (clip 0:32) and the full caster call before ay's first line (FOOTAGE-MAP.md) // seconds before the voice: the broadcast call goes here
const OUTRO = 0; // ay 20 Nov: no "who's your #2" card; ay may add a camera ending
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
  // ay 20 Nov: footage only, never still player photos (lol-second-goat/footage, public/_local/footage)
  ["1", () => <Clip id="lift" from={2} />],
  ["1@knight", () => <Clip id="lift" from={37} />],
  ["3", () => <RingClip id="fakerWalkout" from={8} text="STILL THE GOAT" />],
  // ay 19 Nov style map: Jxmy giant word over footage, then his comment-bubble pile (photo stands in for footage)
  ["3@who", (c) => <AbsoluteFill><Clip id="onStage" from={1} dim={0.25} /><Ov.BigWord text="WHO IS #2?" at={4} /></AbsoluteFill>],
  // the invented comment pile is gone (ay 20 Nov): real fan answers from real sites go here once collected
  ["5", (c) => <AbsoluteFill><Clip id="walkoutFans" from={6} dim={0.72} /><Ov.CommentPile cues={{ from: 2, to: at(c, W("5", "answers")),
    focus: [{ id: "keria", at: at(c, W("6", "carrier")) }, { id: "chovy", at: at(c, W("7", "chovy")) }], all: at(c, W("9", "everyone")) }} /></AbsoluteFill>],
  // Jxmy text card, then his big number card on the number (style map 0:44)
  ["10", (c) => <AbsoluteFill><Concrete /><Ov.CardThenNumber text="SO I BUILT A MODEL" value="527" unit="PLAYERS" at={at(c, W("10", "527"))} /></AbsoluteFill>],
  // Jxmy verdict word over the shot: #14, then WRONG (style map 0:58)
  ["11", (c) => <AbsoluteFill><Clip id="fakerJerseys" rate={0.8} dim={0.3} />
    <Ov.VerdictWord words={[{ text: "WRONG", at: at(c, W("11", "wrong")) }, { text: "FAKER #14", at: at(c, W("11", "14th")) }]} /></AbsoluteFill>],
  // Jxmy handwritten note over the shot (style map 1:08); photo stands in for a rebuild-year game
  ["13", (c) => <AbsoluteFill><Clip id="faker2013Desk" rate={0.5} dim={0.25} />
    <Ov.Note text="HIS WHOLE CAREER, AVERAGED" aside="(EACH TITLE WORTH LESS)" at={at(c, W("13", "averaging"))} asideAt={at(c, W("13", "less"))} x={170} y={120} to={[1040, 260]} /></AbsoluteFill>],
  ["15", (c) => <MLBoard title="Peak, not average" lines={[
    { text: "Version 1: the average of every year", at: 4 },
    { face: "faker", text: "Faker in version 1: #14", at: 16, dim: true },
    { text: "Now: his best years, and longevity on its own", at: at(c, W("15", "best")) },
    { face: "faker", text: "Faker now: #1", at: at(c, W("15", "longevity")), accent: true }]}
    side={<SideBars caption="Faker's all-time rank" rows={[
      { label: "Average of every year", value: "#14", frac: 0.3, color: "#8E97A3", at: 10 },
      { label: "Best years + longevity", value: "#1", frac: 1, color: TEAL, at: at(c, W("15", "longevity")) }]} />} sideAt={10} />],
  // Jxmy line chart (style map 1:22)
  ["16", (c) => <KillsLine cues={{ lck: at(c, L("16").start + 0.3), lpl: at(c, W("16", "lpl")), gap: at(c, W("17", "3")) }} />],
  // Jxmy highlighted page, then big text sliding past (style map 1:34)
  ["18", (c) => <Ov.TextReveal before="So now the model only compares you to" mark="your own league," after="the same year and the same role."
    markAt={at(c, W("18", "compares"))} scroll="LPL MIDS AGAINST LPL MIDS" scrollAt={at(c, W("18", "lpl"))} scrollEnd={at(c, L("18").end + 0.3)} />],
  ["19", () => <Clip id="stomp" from={20} />],
  ["19@gen", () => <Clip id="close" from={22} />],
  ["20", anchored(<Sm.SElo voice={false} />, Sm.ELO_T0)],
  ["21", (c) => <MLBoard title="Stronger teams count more" lines={[
    { text: "Same stat line", at: at(c, W("21", "same")) },
    { text: "Better opponent, more credit", at: at(c, W("21", "counts")), accent: true }]}
    side={<SideTowers at={at(c, W("21", "same"))} at2={at(c, W("21", "counts"))} />} sideAt={at(c, W("21", "same"))} />],
  // Jxmy chapter title over footage (style map 2:07); photo stands in for a trophy lift
  ["22", (c) => <AbsoluteFill><Clip id="msiLift" from={4} dim={0.2} /><Ov.ChapterTitle text="TROPHIES" at={at(c, L("22").start + 0.2)} /></AbsoluteFill>],
  // Jxmy number over footage as a running count (style map 2:13): each extra coin flip doubles the odds
  ["23", (c) => <AbsoluteFill><Clip id="cupNight" dim={0.3} /><Ov.FlipCounter at={at(c, W("23", "coin"))} end={at(c, W("23", "opponents"))} /></AbsoluteFill>],
  // Jxmy gold-bar ranking in our look (style map 2:22): T1 2024 = 8.7 flips, BLG 2026 second (stills.json events)
  ["24", (c) => <HardestBars cues={{ rise: 4, t1: at(c, W("24", "hardest")), blg: at(c, W("24", "blg")) }} />],
  // Jxmy close-up bar list, camera row to row, then pull back (style map 2:31); LEC left off (ay 19 Nov)
  ["25", (c) => <PriceClimb cues={[at(c, W("25", "worlds")), at(c, W("25", "messiah")), at(c, W("25", "so", 1)), at(c, W("25", "so", 1)) + 6, at(c, W("25", "so", 1)) + 12]} out={at(c, W("25", "so", 1)) + 14} />],
  // stand-in shot of a team lift, then Jxmy's article page with the key line highlighted (style map 2:44)
  ["26@players", () => <Clip id="lift" from={8} />],
  ["26@basketball", (c) => <Ov.ArticlePage kicker="Basketball stats" title="Win Shares" markAt={at(c, W("26", "splits"))}
    before="Win Shares takes the games a team won and" mark="splits those wins between its players," after="so every player gets credit for part of each win, based on what they did on the floor. Two players on the same team can end up with very different shares." />],
  ["27", (c) => <TrophySplit cues={{ photos: 0, pie: at(c, L("27").start + 0.4), shares: at(c, L("27").start + 1.6), caption: at(c, L("27").start + 3.0) }} />],
  ["28", (c) => { const rv = at(c, W("31", "yep")); return <Build C={() => <St.S16Clutch reveal={rv} />} mode="wipe" dur={c.dur} />; }], // ay 19 Nov: hold the clutch scatter from "clutch" to the end of the Faker line
  ["32", (c) => <WithWithout cues={{ withAt: at(c, W("33", "77")), withoutAt: at(c, W("33", "64")), diffAt: at(c, W("33", "13")), doubtAt: at(c, W("33", "not")) }} />],
  // ay 20 Nov: from the Chovy graph straight to the wins-added graph, held the whole time, then the climb to Faker
  ["34", (c) => { const k = Math.max(1, fr(Cl.CLIMB_T0 - c.t0));
    return <><Sequence durationInFrames={k} layout="none"><Freeze frame={0}><Cl.SClimb voice={false} /></Freeze></Sequence>
      <Sequence from={k} layout="none"><Cl.SClimb voice={false} /></Sequence></>; }],
  // Jxmy percent stack (jxmy-graphs XMaPrXzclaQ g08), with 100 picks lit on the right
  ["38", (c) => <PercentStack header="HOW MANY ALL-PRO PICKS COME OUT RIGHT" rows={[
    { icon: "trophy", label: "PICK FROM THE WINNING TEAMS", pct: 58, at: at(c, W("40", "winning")) },
    { icon: "model", label: "THE MODEL", pct: 63, at: at(c, W("41", "63")), accent: true }]}
    cues={{ votes: at(c, W("39", "all")), hide: at(c, W("40", "model")), ask: at(c, W("40", "If")) }} />],
  ["42@final", anchored(<Sm.SCards voice={false} />, Sm.CARDS_T0)],
  // Jxmy small stacked text card (jxmy-graphics l38FEWdJnhg x03, style map 4:56)
  ["43", (c) => <StackedLines lines={[
    { text: "50 = MIDDLE OF THE PACK", at: at(c, W("43", "50")) },
    { text: "100 = THE BEST EVER", at: at(c, W("43", "100")) },
    { text: "TROPHIES: FAKER = 100", at: at(c, W("43", "faker")), accent: true, gap: 50 },
    { text: "EVERYONE ELSE = A SHARE OF HIM", at: at(c, W("43", "everyone")) }]} />],
  // ay 20 Nov: no chapter titles in the six-parts section, footage between the graphs
  ["44", () => <Clip id="stage" from={2} />],
  ["45", () => <Clip id="semis" from={2} />],
  // Jxmy pill bars with the players at the foot (jxmy-graphs eatF7QHwga4 g08, style map 5:15); v14 big-stage half alone
  ["46", (c) => <PillBars cues={{ rise: 4, lit: at(c, W("46", "carrier")), side: at(c, W("46", "stage")) }} />],
  ["47", () => <Clip id="desk" />],
  ["48", (c) => { const kn = at(c, W("48", "knight")); return <SeasonList n={8} cues={{ scroll0: 2, scroll1: kn - 2, spot: kn }} />; }],
  // Jxmy two-player board (jxmy-graphs GPH4nK5sQ-8 g01): Chovy vs Knight, the skill score "by a hair" last
  ["49", (c) => <HeadToHead left="chovy" right="knight" title="MOST SKILLED" cues={{ in: 0, rows: 6, last: at(c, W("49", "ahead")) }} rows={[
    { label: "CS AHEAD AT 15 MIN", l: "+10.4", r: "+7.7", better: "l" },
    { label: "GOLD AHEAD AT 15 MIN", l: "+339", r: "+451", better: "r" },
    { label: "KDA", l: "5.67", r: "5.77", better: "r" },
    { label: "DEATHS A GAME", l: "1.69", r: "1.94", better: "l" },
    { label: "WIN RATE", l: "69.2%", r: "66.9%", better: "l" },
    { label: "SKILL SCORE", l: "100", r: "99.9", better: "l", big: true }]} />],
  ["51", (c) => <MLBoard title="Trophy score" lines={[
    { text: "Each title = price × how hard × his share", at: at(c, W("51", "stack")) },
    { text: "Added up over a whole career", at: at(c, W("51", "share")), accent: true }]} />],
  // The cabinet without Faker in view (Canyon, Ruler, Knight named), held still until the silent beat after
  // "by the way", then T2Climb's camera climbs to Faker's trophy score (ay 01:32). Faker's bar is never shown early.
  ["51@ended", (c) => {
    const K = 86; // T2Climb frame where the camera shows Canyon, Ruler and Knight (around 700 points)
    const beat = fr(L("53").end + 0.1 - c.t0);
    return <><Sequence durationInFrames={Math.max(1, beat)} layout="none"><Freeze frame={K}><Mo.T2Climb /></Freeze></Sequence>
      <Sequence from={beat - K} layout="none"><FromFrame k={K}><Mo.T2Climb /></FromFrame></Sequence></>;
  }],
  // Jxmy angled stat banner over footage (jxmy-graphics XyihDTdpF8w x07, style map 5:57); v14 trophy points
  ["55", (c) => <OnBlack at={at(c, W("55", "double"))} big="MORE THAN DOUBLE" sub="FAKER 1,509 TROPHY POINTS · NEXT BEST 714" subAt={at(c, W("55", "anyone"))} />],
  ["56", (c) => <MonteCarlo cues={[at(c, W("57", "rolls")), at(c, W("60", "thousand")), at(c, L("60").end)]} />],
  // Jxmy article page (jxmy-graphics XyihDTdpF8w x08, style map 6:11): our own page, the line marked as it is said
  ["57@monte", (c) => <Ov.ArticlePage kicker="How to test a ranking" title="The Monte Carlo test"
    before="Rerun the whole thing many times, and each time roll the choices it rests on at random."
    mark="Named after the casino, because it runs on luck." after="If an answer holds across a thousand rolls, it was never the luck."
    markAt={at(c, W("57", "named"))} />],
  ["58", (c) => <MonteCarlo cues={[at(c, W("57", "rolls")), at(c, W("60", "thousand")), at(c, L("60").end)]} />],
  // Jxmy record card (jxmy-graphs 4lbvnNVGd-I g06, style map 6:32)
  ["61", (c) => <RecordCounter cues={{ first: at(c, W("61", "faker")), second: at(c, W("61", "one")) }} />],
  // Jxmy quote subtitle over footage (jxmy-graphics 3hZ6Su5PVnI x02, style map 6:42)
  ["63", (c) => <RingClip id="blgPair" from={0} text="WHO IS IT?" />],
  ["64", anchored(<Sm.SPyramidCam voice={false} />, Sm.PYRC_T0)], // one pyramid, tier by tier (ay 19 Nov)
  // ay 20 Nov: the Uzi/Bengi cards repeated the six-part cards; now a slope chart, fans vs the model (league-v14 ranks)
  ["68", (c) => <FansVsModel stamp={{ text: "GLAZED?", at: at(c, W("68", "bit")) + 12 }} rows={[
    { id: "uzi", fan: 4, model: 21, at: at(c, W("68", "uzi")), notes: [{ text: "0 WORLDS", at: at(c, W("68", "worlds")), bad: true }, { text: "AURA", at: at(c, W("68", "aura")) }] },
    { id: "bengi", fan: 8, model: 44, at: at(c, W("68", "benji")), notes: [{ text: "3 WORLDS", at: at(c, W("68", "3")) }, { text: "#247 ON HIS OWN NUMBERS", at: at(c, W("68", "247")), bad: true },
      { text: "SHOTCALLING", at: at(c, W("68", "shot")) }] }]} />],
  ["69", anchored(<Sm.SPyramidCam voice={false} />, Sm.PYRC_T0)],
  ["75", () => <Cuts shots={[["knightFans", 0, 3.5], ["knightWalk", 0, 6]]} />],
  ["76", () => <Words text="TWO TWISTS" />],
  ["77", (c) => <PyramidTwist states={[{ at: 0, order: ORDER_2026, label: "2026" }, { at: at(c, W("77", "2025")), order: ORDER_2025, label: "END OF 2025" }]} />],
  ["78@but", () => <Cuts shots={[["gengWalk", 2, 1.6], ["knightWalk", 1, 1.6], ["chovyScreens", 0, 1.6], ["coldopen", 30, 6]]} />],
  ["80", (c) => <PyramidTwist glowIds={["knight", "chovy"]} states={[{ at: 0, order: ORDER_2025, label: "END OF 2025" }, { at: at(c, W("80", "2nd")), order: ORDER_2026, label: "2026" },
    { at: at(c, W("81", "gen")), order: ORDER_GENG, label: "IF GEN.G\nHAD WON" }]} />],
  ["82", () => <SplitClips labels={["2013", "2026"]} left={[["faker2013Desk", 0, 4.4], ["skt2013Hug", 0, 2], ["skt2013Faker", 0, 4.9], ["skt2013Cup", 0, 5]]} right={[["fakerWalkout", 4, 16]]} />],
  ["82@treats", (c) => <TwoFakers cues={[at(c, W("85", "greatest")), at(c, W("85", "15"))]} />],
  ["86", (c) => <St.S10bPyramidArrow zoomAt={at(c, W("86", "here"))} arrowAt={at(c, W("86", "here")) + 4} />],
  ["88", (c) => <St.SampleKnightRadar gapAt={at(c, W("88", "gap"))} />], // re-cue to the last line once ay re-records 88/90 (trophies gap last)
  // ay 20 Nov: silverware needed to reach Faker's score today (Faker held flat), no years; Gumayusi joins after his quote
  ["92", (c) => <Silverware fakerAt={4} rows={[KNIGHT_ROW(at(c, W("93", "knight"))), CHOVY_ROW(at(c, W("93", "trovie")))]} />],
  ["94", (c) => { const back = at(c, W("94", "you")); return <>
    <Sequence durationInFrames={back} layout="none"><AbsoluteFill><Clip id="guma" from={0} dim={0.5} /><Ov.QuoteOnClip /></AbsoluteFill></Sequence>
    <Sequence from={back} layout="none"><Silverware fakerAt={-30} rows={[KNIGHT_ROW(-30), CHOVY_ROW(-30), GUMA_ROW(4)]} /></Sequence></>; }],
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
    <Sequence durationInFrames={fr(LEAD)}><Clip id="coldopen" from={27} dim={0} volume={1} /></Sequence>
    {TL.map((s, i) => (
      <Sequence key={i} from={fr(LEAD + s.t0) + (i === 0 ? fr(LEAD) : 0)} durationInFrames={s.dur - (i === 0 ? fr(LEAD) : 0)} name={"line " + s.id}>
        <AbsoluteFill>{s.el({ t0: i === 0 ? 0 : s.t0, dur: s.dur })}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={fr(LEAD)}><Audio src={staticFile("vo/vo-assembled.mp3")} /></Sequence>
    <div style={{ position: "absolute", right: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>DRAFT · no music yet</div>
  </AbsoluteFill>
);
