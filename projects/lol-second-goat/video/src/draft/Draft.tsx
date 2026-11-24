// Full draft (19 Nov night): every visual cut to ay's assembled voiceover (voiceover-assembled.mp3, word times from
// voiceover-timing.json). A scene starts on its line and holds until the next scene's line. Footage cards stand in for
// broadcast clips; music is ay's own Suno tracks (Music.tsx); the outro is a placeholder until ay records it.
import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import * as St from "../stills/Stills";
import * as Mo from "../motion/Tests";
import * as Cl from "../samples/Climb";
import * as Sm from "../samples/Samples";
import { Build, Count527, Footage, Formula, Quote, Words } from "../rough/RoughCut";
import { AllProTest, MLBoard, SideBars, SideCoins, SideScale, SideTowers, WithWithout } from "./Boards";
import { TeamRoles } from "./TeamRoles";
import { PMLedger } from "./PMLedger";
import { Music } from "./Music";
import { TrophyShare } from "./TrophyShare";
import { VersionOne } from "./VersionOne";
import { TrophySplit } from "./TrophySplit";
import { TitleShare } from "./TitleShare";
import { SeasonList } from "./SeasonList";
import { HeadToHead } from "./HeadToHead";
import { LeadBars } from "./LeadBars";
import { OutroCard } from "./OutroCard";
import * as Ov from "./Overlays";
import { KillsLine } from "./KillsLine";
import { WorldsValues, HardestRuns, PriceClimb } from "./Bars";
import { Concrete } from "../samples/Climb";
import { PercentStack } from "./PercentStack";
import { BIG_PART, PillBars, StackedLines, TitleList } from "./Lists";
import { OnBlack, RecordCounter } from "./Banners";
import { Clip, Cuts, RingClip, SplitClips } from "./Clip";
import { FansVsModel } from "./Slope";
import { TrophyWeight, AbsoluteCinema, ChatLine } from "./Averaged";
import { PyramidStates } from "./PyramidStates";
import { CHOVY_ROW, GUMA_ROW, KNIGHT_ROW, Silverware } from "./Silverware";
import { LongRec, PartTop, RankedElo, Roadmap, SourceNote } from "./Polish";
import { PlayerCards, DreamSeasons, MonteCarlo, ORDER_2025, ORDER_2026, ORDER_GENG, PyramidTwist, TwoFakers } from "./Graphics";
import { HAS, L, VO_AUDIO, VO_DURATION, VO_KEEP, VO_LINES, VO_PREVIEW, vt, W, WA, WE } from "../data/vo";

const FPS = 30;
// ay 20 Nov: the cold open runs from the caster's "It's been five years" to his "LPL", the picture fades in, the
// caster fades out on "LPL" and ay's voice comes straight in (no fade on ay). COLD_FROM/COLD_LPL are clip seconds in
// 01_coldopen_nexus_caster_call.mp4.
const COLD_FROM = 29.85, COLD_LPL = 36.4; // Whisper on ay's PC: "It's been" 29.90, "LPL" ends 36.38, next line 37.10
const LEAD = COLD_LPL - COLD_FROM; // seconds before ay's first line
const OUTRO = 12; // ay 20 Nov: no "who's your #2" card; a quiet end card holds the YouTube end screen and the Riot line
const TEAL = "#3FD0B5";
/** renders its child only from frame k on (so a clip can join mid-way at a set frame) */
/** plays T2Climb on the voice: hold, climb at 1x from "here's", hold on Faker, zoom out 1.6x from line 55, bracket on "anyone" */
const ClimbRemap: React.FC<{ c: { t0: number; dur: number } }> = ({ c }) => {
  const f = useCurrentFrame();
  // ay 20 Nov 15:28: "but we're missing one name", then the climb itself reveals Faker (silent beat 54), holds a second at
  // the top, zooms out to everyone, and the bracket lands on "anyone else"
  const K = 86, b0 = at(c, WA("53", ["name", "here"])) + 8, z0 = b0 + (165 - K) + 30, br = Math.max(z0 + 100, at(c, WA("55", ["anyone"])));
  const g = f < b0 ? K : f < b0 + (165 - K) ? K + (f - b0) : f < z0 ? 165 : f < z0 + 94 ? 270 + (f - z0) * 1.6 : f < br ? 420 : 495 + (f - br);
  return <Freeze frame={Math.round(Math.min(g, 540))}><Mo.T2Climb /></Freeze>;
};
/** ay 20 Nov 14:36: the OG pyramid (round photos, rank badge) for the whole pyramid section, built bottom up on the
 *  voice, the camera moving tier by tier, a long hold on Caps, and the Uzi and Bengi outlier arrows on line 67. */
const OGPyramid: React.FC<{ c: { t0: number; dur: number } }> = ({ c }) => {
  const f = useCurrentFrame();
  const a = (t: number) => at(c, t);
  const FULL = { x: 960, y: 540, s: 1 }, T = (y: number, s = 1.9, x = 960) => ({ x, y, s });
  const keys: [number, { x: number; y: number; s: number }][] = [
    [a(L("64").start) - 1e4, FULL], [a(W("65", "bottom")) - 4, FULL], [a(W("65", "bottom")) + 18, T(871)],
    [a(W("66", "tier")) - 4, T(871)], [a(W("66", "tier")) + 18, T(717)], [a(W("66", "caps")) - 2, T(717)], [a(W("66", "caps")) + 20, T(717, 2.8, 610)],
    [a(L("67").start) - 2, T(717, 2.8, 610)], [a(L("67").start) + 22, T(600, 1.05, 1010)],
    [a(W("69", "tier")) - 4, T(600, 1.05, 1010)], [a(W("69", "tier")) + 18, T(565)], [a(W("70", "tier")) - 4, T(565)], [a(W("70", "tier")) + 18, T(410, 2.2)],
    [a(W("71", "knight")) + 6, T(410, 2.2)], [a(W("71", "knight")) + 30, T(410, 2.9, 845)],
    // ay 20 Nov 15:28: once Knight is revealed, zoom out on the whole pyramid while he is talked about
    [a(L("74").start) - 4, T(410, 2.9, 845)], [a(L("74").start) + 40, FULL]];
  let k = 0; while (k < keys.length - 2 && f >= keys[k + 1][0]) k++;
  const [f0, v0] = keys[k], [f1, v1] = keys[k + 1];
  const e = interpolate(f, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const cam = { x: v0.x + (v1.x - v0.x) * e, y: v0.y + (v1.y - v0.y) * e, s: v0.s + (v1.s - v0.s) * e };
  const showAt = (i: number, j: number) => i === 4 ? a(W("65", "bottom")) + 18 + j * 5 : i === 3 ? a(W("66", "tier")) + 18 + j * 5 : i === 2 ? a(W("69", "tier")) + 18 + j * 6
    : i === 1 ? (j === 1 ? a(W("71", "chovy")) : a(W("71", "knight"))) : 0; // ay 20 Nov 15:28: Faker sits in the top row from the start
  const pulse = { perkz: a(W("65", "perkz")), bjergsen: a(W("65", "bjergsen")), jankos: a(W("65", "bjergsen")) /* ay 20:21: highlighted, not spoken */, caps: a(W("66", "caps")) + 20 };
  return <St.PyramidOld showAt={showAt} cam={cam} pulse={pulse} outlierAt={c.t0 < L("68").start ? a(W("67", "uzi")) : undefined} />;
};
const FromFrame: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => (useCurrentFrame() >= k ? <>{children}</> : null);
const fr = (s: number) => Math.round(s * FPS);

type Ctx = { t0: number; dur: number };
/** a sample built on its own voiceover clock: its frame 0 is VO time T0 (frame `k` is VO time `tk`) */
const anchored = (el: React.ReactNode, T0: number, k = 0) => (c: Ctx) => <Sequence from={fr(T0 - c.t0) - k} layout="none">{el}</Sequence>;
const ft = (text: string) => () => <Footage text={text} />;
const still = (k: keyof typeof St, mode: "wipe" | "rise" | "cut" = "cut") => (c: Ctx) => <Build C={St[k] as React.FC} mode={mode} dur={c.dur} />;
const at = (c: Ctx, t: number) => fr(t - c.t0);

// ay 24 Nov (1:08 note): "Faker back where he belongs" and the panel stays up longer (through 15x, until skill starts)
const whatChanged = (c: Ctx) => <MLBoard title="What changed" lines={[
    { text: "Version 1: early games untracked, no damage stats before 2020", at: 4 },
    { face: "faker", text: "Faker in version 1: #14", at: 16, dim: true },
    { text: "Now: fixed for every old player", at: at(c, WA("15", ["every"])) },
    { text: "Missing games filled in", at: at(c, WA("15", ["filled"])) },
    { text: "Missing stats made up for", at: at(c, WA("15", ["made"])) },
    { face: "faker", text: "Faker now: #1", at: HAS("15x") ? at(c, WA("15x", ["back", "straight"])) : at(c, L("15").end) - 10, accent: true }]}
    side={<SideBars caption="Faker's all-time rank" rows={[
      { label: "Version 1", value: "#14", frac: 0.3, color: "#8E97A3", at: 10 },
      { label: "Now", value: "#1", frac: 1, color: TEAL, at: at(c, W("15", "fixed")) }]} />} sideAt={10} big />;

const SCENES: [string, (c: Ctx) => React.ReactNode][] = [
  // ay 20 Nov: footage only, never still player photos (lol-second-goat/footage, public/_local/footage)
  ["1", () => <Clip id="lift" from={2} />],
  // v19 (ay 24 Nov: "the intro is too fast, add context to the first scene"): BLG's run through three LCK teams, each
  // clip on its team's name (footage as proof, rival study). The Gen.G final itself is the cold open, so the stage
  // before game 4 stands in for it here. Knight's lift lands on "Knight".
  ["1b", () => <Clip id="stomp" from={0.5} />],
  ["1b@t1", () => <Clip id="semis" from={24} />],
  ["1b@gen", () => <Clip id="stage" from={6} />],
  ["1b@knight", () => <Clip id="lift" from={37} />],
  // ay 20 Nov: plain Faker B-roll, no circle text (clip 21 is Peyz, not Faker: checked frame by frame)
  ["3", () => <Clip id="fakerJerseys" from={0.3} dim={0} />],
  // v19: "he's won Worlds six times": SKT with the cup in 2013, his first
  ["3b", () => <Clip id="sktCup2013" from={8} dim={0} />],
  // v19b (ay 14:27): "every year Faker doesn't win it, that number 2 spot changes hands": HLE passing the MSI 2026 cup
  ["3d", () => <Clip id="msiLift" from={8} dim={0} />],
  // ay 20 Nov: B-roll stops at "who's the second best"; plain backgrounds from here on
  ["3c", (c) => <AbsoluteFill><Concrete /><Ov.BigWord text="WHO IS #2?" at={4} /></AbsoluteFill>],
  ["5", (c) => <AbsoluteFill><Concrete /><Ov.CommentPile cues={{ from: 2, to: at(c, W("5", "answers")),
    focus: [{ id: "keria", at: at(c, WA("6", ["keria", "carrier"])) }, { id: "chovy", at: at(c, W("7", "chovy")) }], all: at(c, W("9", "everyone")) }} /></AbsoluteFill>],
  // v19: the sources are named in the voice (10b) and written under the card as they are said
  ["10", (c) => <AbsoluteFill><Concrete /><Ov.ModelCard text="SO I BUILT A MODEL" years="2011 TO 2026" yearsAt={at(c, W("10", "2011"))} value="527" unit="PLAYERS" numAt={at(c, W("10", "527"))} />
    {HAS("10b") && <SourceNote text="LEAGUEPEDIA + ORACLE'S ELIXIR · ABOUT 26,000 GAMES" at={at(c, WA("10b", ["leaguepedia", "pulled"]))} />}</AbsoluteFill>],
  // v19: the chapter preview (3Blue1Brown), each step on its word
  // ay 24 Nov 14:54: plain names, each on its word (how it scores / testing it / the final ranking)
  ["10c", (c) => <Roadmap at={[at(c, WA("10c", ["first", "scores"])), at(c, WA("10c", ["test", "trust"])), at(c, WA("10c", ["final", "ranking", "build"]))]} />],
  // v19: the recipe comes first (ay asked what clutch and plus-minus are added to): the six cards, moved up from 4:57
  // the cards are anchored to their spoken words in line 42 (empty ground for 3.6 s before "six"); until the title comes
  // in on "six", the roadmap stays up with step 1 (the six parts) lit, under "here's the recipe" (v19b)
  ["42p", (c) => { const gap = at(c, W("42", "6")) - 3; return <>
    {anchored(<Sm.SCards voice={false} />, Sm.CARDS_T0)(c)}
    {gap > 0 && <Sequence durationInFrames={gap} layout="none"><Roadmap at={[-30, -20, -10]} cur={0} /></Sequence>}</>; }],
  ["43", (c) => <StackedLines lines={[
    { text: "50 = MIDDLE OF THE PACK", at: -30 },
    { text: "100 = THE BEST EVER", at: at(c, W("43", "100")) },
    { text: "TROPHIES: FAKER = 100", at: at(c, W("43", "faker")), accent: true, gap: 50 },
    { text: "EVERYONE ELSE = A SHARE OF HIM", at: at(c, W("43", "everyone")) }]} />],
  // ay 24 Nov 14:54: the trophies vs everything else bar is gone; the weights are explained once, in the Monte Carlo part
  ["11", (c) => <VersionOne trophiesAt={10} partsAt={at(c, WA("11", ["14th", "14"]))} gamesAt={at(c, WA("13", ["tracked", "early"]))} damageAt={HAS("13b") ? at(c, WA("13b", ["damage"])) : 1e9} />],
  // v19 (ay 24 Nov: "made up for the missing stats" needs a close, and the panel needs longer): "Faker now: #1" lands on
  // the new line 15x ("Faker went straight back to where he belongs"), and the board holds through it
  ["15", (c) => whatChanged(c)],
  // v19: each method opens on its part's name, a Jxmy chapter title (eatF7QHwga4 x04)
  ["16a", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="SKILL" at={4} /></AbsoluteFill>],
  ["16", (c) => <KillsLine cues={{ lck: at(c, L("16").start + 0.3), lpl: at(c, W("16", "lpl")), gap: at(c, W("17", "3")) }} />],
  ["18", (c) => <TeamRoles cues={{ rows: Math.max(4, at(c, WA("18", ["compares"])) - 6), role: at(c, WA("18a", ["role", "lined"])), old: at(c, WA("18b", ["2013", "old"])) }} />],
  ["19", (c) => <AbsoluteFill><Clip id="stomp" from={20} /><ChatLine user="dk_enjoyer" text="DK LOL" at={at(c, W("19", "bottom"))} /></AbsoluteFill>],
  ["19@gen", () => <Clip id="close" from={22} />],
  // ay 24 Nov 14:54: Elo told like ranked: steal points, the favourite drops 29 losing to the underdog but gains only 3
  // beating them. Holds through 20a and 21
  ["20", (c) => <RankedElo cues={{ steal: at(c, WA("20", ["steal"])), n26: at(c, WA("20", ["26,000", "26"])), games: at(c, WA("20", ["games"])),
    fav: at(c, WA("20a", ["3", "three"])), upset: at(c, WA("20a", ["steal", "29"])), hurt: at(c, WA("20a", ["hurts", "way"])) }} />],
  ["47", (c) => { const top = at(c, WA("48", ["chovy", "top"])); return <SeasonList n={8} cues={{ scroll0: at(c, WA("48", ["zeus", "here"])), scroll1: top - 2, spot: top, second: at(c, WA("48", ["knight", "night"])) }} />; }],
  ["49", (c) => <HeadToHead left="chovy" right="knight" title="SKILL PART: #1 VS #2" cues={{ in: 0, rows: 6, last: at(c, WA("49", ["behind", "just", "knight"])) }} rows={[
    { label: "CS AHEAD AT 15 MIN", l: "+10.4", r: "+7.7", better: "l" },
    { label: "GOLD AHEAD AT 15 MIN", l: "+339", r: "+451", better: "r" },
    { label: "KDA", l: "5.67", r: "5.77", better: "r" },
    { label: "DEATHS A GAME", l: "1.69", r: "1.94", better: "l" },
    { label: "WIN RATE", l: "69.2%", r: "66.9%", better: "l" },
    { label: "SKILL SCORE", l: "100", r: "97.8", better: "l", big: true }]} />],
  ["22", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="TROPHIES" at={at(c, L("22").start + 0.2)} /></AbsoluteFill>],
  // the worth bars open on "how much is an MSI worth", then each value lands as it is said; v19: the LPL bar lands on
  // "LPL" in 23a and the zoom-out waits for it
  ["22@but", (c) => { const w1 = at(c, WA("23", ["100", "hundred"])), w2 = at(c, WA("23", ["56", "fifty"])), w3 = at(c, WA("23", ["44", "forty"]));
    const lpl = HAS("23a") ? at(c, WA("23a", ["lpl"])) : w3 + 10;
    return <PriceClimb cues={[Math.min(w1, 20), w2, w3, Math.max(w3 + 6, lpl - 8), lpl]} out={lpl + 14} />; }],
  ["24", (c) => <WorldsValues cues={{ rise: 4, lit: [{ team: "DAMWON Gaming", year: 2020, at: at(c, WA("24", ["down", "damwon"])) },
    { team: "T1", year: 2024, at: at(c, WA("24", ["t1", "toughest"])) }] }} />],
  // LOCKED (ay 22 Nov 20:53): keep this separate DRX graph
  ["24b", (c) => <HardestRuns cues={{ rise: 0, lit: [{ team: "DRX", year: 2022, at: at(c, WA("24b", ["drx"])) }] }} />],
  // v19: the Win Shares page comes up on "basketball" (it was on screen 3.6 s)
  ["26@basketball", (c) => <Ov.ArticlePage kicker="Sports stats" title="Win Shares" markAt={at(c, W("26", "splits"))}
    before="Win Shares takes the games a team won and" mark="splits those wins between its players," after="so every player gets credit for part of each win, based on what they did in the game. Two players on the same team can end up with very different shares." />],
  ["27", (c) => <TrophySplit cues={{ photos: 0, pie: at(c, WA("27", ["same", "titles"])), shares: at(c, WA("27", ["take", "ig"])), caption: at(c, WA("27", ["ig", "2018"])),
    names: { rookie: at(c, WA("27", ["rookie"])), theshy: at(c, WA("27", ["shy"])), baolan: at(c, WA("27b", ["bao", "baolan"])), jackeylove: at(c, WA("27b", ["jackie", "jackey"])), ning: at(c, WA("27b", ["ning"])) },
    top: at(c, WA("27", ["rookie", "biggest"])), mvp: at(c, WA("27b", ["ning", "finals"])) }} />],
  // v19 (ay: no full graph for a few seconds): the 5 s "Trophy score" board is gone, the cabinet starts on line 51
  ["51", (c) => <><ClimbRemap c={c} /><PartTop text="#1 IN TROPHIES: FAKER" at={at(c, WA("55", ["tops"]))} top={150} /></>],
  ["28", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="BIG GAMES + CLUTCH" at={4} size={170} /></AbsoluteFill>],
  ["29", (c) => { // the clutch scatter (locked walk: bottom, middle, top), now from line 29 so the title card gets line 28
    // v19: dots pop in over "Here's every player..." (about 4 s, locked 21 Nov), then 30a names the axes on the full graph
    const rv = at(c, WA("31", ["faker's", "faker", "baker's"])), ch = at(c, WA("30c", ["cream", "creme", "bottom"]));
    const d0 = at(c, L("30").start) + 4, d1 = d0 + 110;
    return <Build C={() => <St.S16Clutch reveal={rv} chokeAt={ch} dots={[d0, d1]} walk={{ bottom: at(c, WA("30c", ["bottom"])), mid: at(c, L("30b").start), top: at(c, L("31").start) }}
      nameAt={Object.fromEntries([...["gumayusi", "zeka"].map((id) => [id, at(c, WA("31", ["gumayusi", "guma"]))]), ["bin", at(c, WA("31", ["bin"]))],
        ...[["369", "369"], ["gala", "369"], ["doran", "doran"]].map(([id, w]) => [id, at(c, WA("30b", [w]))])])} />} mode="wipe" dur={c.dur} />; }],
  // v19b: the part's winners come straight after the clutch graph (line 45 dropped, 46 opens it). ay 24 Nov 14:54: the board
  // is the WHOLE part (big-game play + series won + clutch), so Bin tops it by 0.7 over Knight
  ["46", (c) => <PillBars data={BIG_PART} title="#1 IN BIG GAMES + CLUTCH" sub="PLAY IN BIG GAMES, BIG SERIES WON AND CLUTCH TOGETHER, 0 TO 100"
    cues={{ rise: 4, lit: at(c, WA("46", ["bin", "tops"])), side: 1e6 }} />],
  ["32", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="TEAM IMPACT" at={4} /></AbsoluteFill>],
  // v19: the title holds through "now for team impact", the with/without bars come in on "with him"
  ["32@with", (c) => <Build C={() => <St.SampleWithWithout lit="chovy" />} mode="wipe" dur={c.dur} />],
  ["34", anchored(<Sm.SPlusMinus voice={false} />, Sm.PM_T0)],
  ["35", (c) => <PMLedger cues={{ lineup: at(c, WA("35", ["against", "players"])), result: at(c, WA("35", ["over", "26"])), n26: at(c, WA("35", ["26", "about"])),
    fast: at(c, WA("35", ["add", "up"])), done: at(c, L("35").end) + 12 }} />],
  // v19 (ay's 4:28 note): the climb opens on the whole chart for the walk-through (axes, bottom, middle), see Climb.tsx
  [HAS("37a") ? "37a" : "37", (c) => { const k = Math.max(1, fr(Cl.CLIMB_T0 - c.t0));
    return <><Sequence durationInFrames={k} layout="none"><Freeze frame={30}><Cl.SClimb voice={false} /></Freeze></Sequence>
      <Sequence from={k} layout="none"><Cl.SClimb voice={false} /></Sequence>
      {HAS("37e") && <PartTop text="#1 IN TEAM IMPACT: FAKER" at={at(c, WA("37e", ["tops"]))} left={640} top={60} />}</>; }],
  ["38a", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="LONGEVITY + RECOGNITION" at={4} size={136} /></AbsoluteFill>],
  // ay 24 Nov 14:54: the title had nothing after it. Longevity (great years, Faker #1) then recognition (Chovy #1) on one board
  ...(HAS("38c") ? [["38a@longevity", (c: Ctx) => <LongRec cues={{ rows: [at(c, WA("38c", ["faker"])), at(c, WA("38c", ["deft"])), at(c, WA("38c", ["knight"])), at(c, WA("38c", ["chovy"]))],
    tagL: at(c, WA("38c", ["tops"])), right: at(c, L("38d").start), bars: [at(c, WA("38f", ["chovy"])), at(c, WA("38f", ["faker"])), at(c, WA("38f", ["knight"]))], tagR: at(c, WA("38f", ["tops"])) }} />] as [string, (c: Ctx) => React.ReactNode]] : []),
  ["38", (c) => <PercentStack header="HOW MANY ALL-PRO PICKS COME OUT RIGHT" rows={[
    { icon: "trophy", label: "PICK FROM THE WINNING TEAMS", pct: 58, at: at(c, W("40", "winning")) },
    { icon: "model", label: "THE MODEL", pct: 63, at: at(c, W("41", "63")), accent: true }]}
    cues={{ votes: at(c, WA("39", ["all", "real", "check"])), hide: at(c, W("40", "model")), ask: at(c, WA("40", ["asked", "pick"])) }} />],
  // ay 24 Nov 14:54: one graph for the whole part. The dice graph comes first with my weights (each number on its word, the
  // bars drift on "move them around"), then the definition page on "Monte Carlo" (locked: page, not the wheel), then the
  // dice graph again from 58, rolling (locked)
  ["56", (c) => <MonteCarlo cues={[1e9, 1e9, 1e9]} weights={[at(c, WA("15d", ["30%", "30"])), at(c, WA("15e", ["21%", "21", "skill"])), at(c, WA("15e", ["16"])),
    at(c, WA("15e", ["14"])), at(c, WA("15e", ["11"])), at(c, WA("15e", ["8"]))]} wobbleAt={at(c, WA("56b", ["move", "around"]))} />],
  ["57", (c) => <Ov.ArticlePage kicker="Statistics" title="Monte Carlo method" markAt={at(c, WA("57b", ["changes", "inputs", "luck"]))}
    before="A Monte Carlo test runs the same model thousands of times, " mark="changing the inputs at random each time," after=" then counts how often each result comes up. It is named after the Monte Carlo casino, because it runs on chance." />],
  ["58", (c) => <MonteCarlo cues={[at(c, WA("58", ["dice", "rolls"])), at(c, WA("60", ["ran", "thousand"])), at(c, WA("61", ["1000", "1,000", "all"]))]} twoAt={at(c, WA("61", ["number", "but"]))} />],
  ["64", (c) => <OGPyramid c={c} />],
  // ay 20 Nov: the Uzi/Bengi cards repeated the six-part cards; now a slope chart, fans vs the model (league-v14 ranks)
  // ay 20 Nov: back to the bordered face cards for Uzi and Bengi
  ["68", (c) => <PlayerCards title="NOT EVERYTHING FITS IN A NUMBER" titleAt={at(c, WA("68", ["intangibles", "also"]))} /* 21 Nov 15:40 take: ay no longer says "Uzi's a little bit glazed", so no GLAZED? stamp; it comes back if he does */ cards={[
    // ay 21 Nov 17:07: UNDERRATED under 0 WORLDS on "underrated", then AURA, and the Intimidator badge on "Intimidator"
    { id: "uzi", sub: "#22 ALL TIME", flipAt: at(c, W("68", "uzi")), badgeAt: at(c, WA("68", ["intimidator", "badge", "hall"])), lines: [{ text: "0 WORLDS", at: at(c, W("68", "worlds")), bad: true },
      { text: "UNDERRATED", at: at(c, WA("68", ["underrated", "early"])) }, { text: "AURA", at: at(c, W("68", "aura")) }] },
    { id: "bengi", sub: "#43 ALL TIME", flipAt: at(c, WA("68", ["bengi", "benji"])), lines: [{ text: "3 WORLDS", at: at(c, W("68", "won", 1)) }, { text: "#182 OWN NUMBERS", at: at(c, WA("68", ["182", "numbers"])), bad: true }, { text: "SHOTCALLING", at: at(c, WA("68b", ["shotcalling", "shot", "leadership"])) }] },
  ]} />],
  ["69", (c) => <OGPyramid c={c} />],
  // council 22 Nov (ay: "make any changes you think are suitable"): after the zoom-out on the pyramid, where Knight's lead
  // over Chovy comes from (big games; trophies about a tie), on "this year he's just beat everyone"
  ["74@this", () => <LeadBars startAt={4} />],
  ["76", () => <Words text="TWO TWISTS" />],
  // ay 20 Nov: the twists on the original five-tier pyramid, with the G.O.A.T. pyramid writing top left
  ["77", (c) => <PyramidStates states={[{ at: 0, order: ORDER_2026, label: "2026" }, { at: at(c, W("77", "2025")), order: ORDER_2025, label: "END OF 2025" }]} />],
  ["80", (c) => <><PyramidStates glowIds={["knight", "chovy"]} states={[{ at: 0, order: ORDER_2025, label: "END OF 2025" }, { at: at(c, WA("80", ["second", "2nd"])), order: ORDER_2026, label: "2026" },
    { at: at(c, W("81", "gen")), order: ORDER_GENG, label: "IF GEN.G\nHAD WON" }]} /></>],
  ["82", (c) => <TwoFakers cues={[at(c, W("85", "greatest")), at(c, WA("85", ["down", "13", "15"]))]} />],
  // ay 20 Nov: the arrow was over before it could be seen; zoom on "Knight", arrow drawn through "from here to there", held into 88
  ["86", (c) => <St.S10bPyramidArrow zoomAt={at(c, W("86", "knight")) - 6} arrowAt={at(c, W("86", "from"))} />],
  ["88", (c) => <St.SampleKnightRadar gapAt={at(c, W("88", "gap"))} />], // 88 now ends "the glaring gap you can see is the trophies": circle and zoom on "gap"
  // ay 20 Nov: silverware needed to reach Faker's score today (Faker held flat), no years; Gumayusi joins after his quote
  ["92", (c) => <Silverware fakerAt={4} rows={[KNIGHT_ROW(at(c, WA("93", ["knight"]))), CHOVY_ROW(at(c, WA("93", ["chovy", "and"])))]} />],
  // ay 20 Nov: no B-roll, just the quote on screen, then Gumayusi's row joins Knight and Chovy
  ["94", (c) => { const back = at(c, WA("94", ["still", "long"])); return <>
    <Sequence durationInFrames={back} layout="none"><AbsoluteFill><Concrete /><Ov.GumaQuoteCard emojiAt={at(c, WA("94", ["error", "era"])) + 6} /></AbsoluteFill></Sequence>
    <Sequence from={back} layout="none"><Silverware fakerAt={-30} rows={[KNIGHT_ROW(-30), CHOVY_ROW(-30), GUMA_ROW(4)]} catAt={26} /></Sequence></>; }],
  // ay's outro (23 Nov, voice only): plain card, a few words on their spoken words (OutroCard.tsx); the end card follows
  ...(HAS("101") ? [["101", (c: Ctx) => <OutroCard pages={[
    { at: 0, big: "MY FIRST VIDEO", small: "A LIKE OR SUB MEANS A LOT", smallAt: at(c, WA("101", ["please", "leave", "like"])) },
    { at: at(c, WA("102", ["ranking", "this"])), big: "THE MODEL'S LIST", small: "NOT PERFECT", smallAt: at(c, WA("102", ["perfect", "course"])) },
    { at: at(c, WA("103", ["keria", "personal"])), face: "keria", big: "MY OWN #2: KERIA", small: "YOUR #2? COMMENTS", smallAt: at(c, WA("103", ["feel", "leave"])) },
    { at: at(c, WA("104", ["mistakes", "anyone"])), big: "SPOT A MISTAKE?", small: "TELL ME IN THE COMMENTS", smallAt: at(c, WA("104", ["please", "let"])) },
  ]} />] as [string, (c: Ctx) => React.ReactNode]] : []),
];

const VO_END = VO_DURATION;
// ay 21 Nov 17:24: hold the last panel (laughing cat under Guma's titles) about 3 s before the end card
const TAIL = 3.0; // ay 22 Nov 21:54: laugh sound gone, back to the 3 s hold
// with the outro recorded (23 Nov), the Guma panel holds until the outro, and the end card starts on "have a blessed day"
// and stays about 13 s after the last word (music runs on under it, OUTRO-STUDY.md)
// ay 23 Nov 22:50: no bridge footage at the end; the last outro card stays on for a few seconds after "have a blessed
// day", with the Riot line on it (RIOT_AT), and the video ends there
const RIOT_AT = HAS("105") ? L("105").start - 0.15 : VO_DURATION + TAIL;
const END_AT = HAS("105") ? VO_DURATION + 6 : VO_DURATION + TAIL;
const END_HOLD = HAS("105") ? 0 : OUTRO;
/** "42" starts on line 42; "42@final" starts on the word "final" in line 42 */
const startOf = (key: string) => { const [id, w] = key.split("@"); return (w ? W(id, w) : L(id).start) - 0.05; };
const TL = SCENES.map(([id, el], i) => {
  const t0 = i === 0 ? -LEAD : startOf(id);
  const t1 = i + 1 < SCENES.length ? startOf(SCENES[i + 1][0]) : END_AT;
  return { id, el, t0, dur: fr(t1 - t0) };
});
export const DRAFT_TOTAL = fr(LEAD + END_AT + END_HOLD);

// End card (ay 20 Nov: no "who's your #2"). 12 s of quiet footage with room for YouTube's end-screen
// video and subscribe elements in the middle, and the Riot line at the foot.
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><AbsoluteFill style={{ opacity: interpolate(f, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <Clip id="coldopen" from={COLD_FROM} dim={0} /></AbsoluteFill></AbsoluteFill>;
};

const RiotLine: React.FC = () => (
  <AbsoluteFill style={{ opacity: interpolate(useCurrentFrame(), [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: F.body, fontSize: 24, color: "#B7BDC6", lineHeight: 1.5 }}>
      Not endorsed by Riot Games. League of Legends and Riot Games are trademarks of Riot Games, Inc.<br />Footage from LoL Esports broadcasts.</div>
  </AbsoluteFill>
);
const EndCard: React.FC = () => (
  <AbsoluteFill>
    <Clip id="skyline" from={0} dim={0.6} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: F.body, fontSize: 24, color: "#B7BDC6", lineHeight: 1.5 }}>
      Not endorsed by Riot Games. League of Legends and Riot Games are trademarks of Riot Games, Inc.<br />Footage from LoL Esports broadcasts.</div>
  </AbsoluteFill>
);

const LaughFlash: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const out = interpolate(f, [fr(3.75) - 6, fr(3.75)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = Math.sin(f * 1.9) * 6 * (f < fr(3.2) ? 1 : 0);
  // ay 22 Nov 20:53: the laughing cat on the last panel (bottom right, clear of the rows), not on the quote
  return <Img src={staticFile("_local/memes/laughing-cat-sticker.png")} style={{ position: "absolute", left: 1660, top: 840, width: 240, height: 223, objectFit: "contain",
    opacity: out, transform: `scale(${k}) rotate(${-5 + shake * 0.4}deg) translate(${shake}px, ${-shake * 0.5}px)` }} />;
};

export const Draft: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F" }}>
    <Sequence durationInFrames={fr(LEAD)}><ColdOpen /></Sequence>
    <Sequence durationInFrames={fr(LEAD + 0.7)}><Audio src={staticFile("_local/footage/01_coldopen_nexus_caster_call.mp4")} startFrom={fr(COLD_FROM)}
      volume={(f) => interpolate(f, [0, 6, fr(LEAD) - 2, fr(LEAD + 0.7)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>
    {TL.map((s, i) => (
      <Sequence key={i} from={fr(LEAD + s.t0) + (i === 0 ? fr(LEAD) : 0)} durationInFrames={s.dur - (i === 0 ? fr(LEAD) : 0)} name={"line " + s.id}>
        <AbsoluteFill>{s.el({ t0: i === 0 ? 0 : s.t0, dur: s.dur })}</AbsoluteFill>
      </Sequence>
    ))}
    {/* the meme sits above the act's ground colour so its black and white stay true */}
    {/* ay 21 Nov 17:24: after "I heard it was a Guma error" the music stops; vine boom, the laughing minion emote pops in on
        the left of the Guma photo (so it stays readable) with ay's minion laugh, played whole but turned well down; then ay
        carries on. ay's clips live in public/_local/memes (not in the public repo). */}
    {/* ay 22 Nov 20:53: no laugh on the quote; the cat, vine boom and laugh play when the panel shows the Worlds Guma needs */}
    {/* ay 22 Nov 21:54: no laughing cat and no laugh sound anywhere; only the vine boom as the minion pops in on the last panel */}
    <Sequence from={fr(LEAD + WA("94", ["still", "long"])) + 26} durationInFrames={fr(2)} layout="none" name="Guma vine boom">
      <Audio src={staticFile("_local/memes/vine-boom.mp3")} volume={0.32} />
    </Sequence>
    {/* ay 21 Nov 17:07: "this model is lowkey cinema" now ends line 81 */}
    <Sequence from={fr(LEAD + W("81", "cinema"))} durationInFrames={41} layout="none"><AbsoluteCinema at={0} out={40} /></Sequence>
    {HAS("105") ? <Sequence from={fr(LEAD + RIOT_AT)}><RiotLine /></Sequence> : <Sequence from={fr(LEAD + END_AT)}><EndCard /></Sequence>}
    {VO_KEEP.map(([a, b], i) => (
      <Sequence key={"vo" + i} from={fr(LEAD + vt(a))} durationInFrames={fr(b - a)}><Audio src={staticFile(VO_AUDIO)} startFrom={fr(a)} endAt={fr(b)} /></Sequence>
    ))}
    <Music lead={LEAD} total={DRAFT_TOTAL} />
    {VO_PREVIEW && VO_LINES.filter((l) => l.sub).flatMap((l) => subChunks(l).map((c, k) => (
      <Sequence key={"sub" + l.line + "-" + k} from={fr(LEAD + c.a - 0.1)} durationInFrames={Math.max(1, fr(c.b - c.a + 0.1))} layout="none"><Subtitle text={c.text} /></Sequence>
    )))}
    {/* the DRAFT tag is off for the final upload render (23 Nov); only a timing preview is labelled */}
    {VO_PREVIEW && <div style={{ position: "absolute", right: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>TIMING PREVIEW · new lines as subtitles, not recorded yet</div>}
  </AbsoluteFill>
);

/** subtitle chunks: a sentence, or at most 14 words, each on screen from its first word to the next chunk */
const subChunks = (l: { end: number; words: { w: string; start: number }[] }) => {
  const groups: { w: string; start: number }[][] = [[]];
  for (const w of l.words) {
    const g = groups[groups.length - 1]; g.push(w);
    if (/[.?!]$/.test(w.w) || g.length >= 14) groups.push([]);
  }
  const gs = groups.filter((g) => g.length);
  return gs.map((g, i) => ({ text: g.map((w) => w.w).join(" "), a: g[0].start, b: i + 1 < gs.length ? gs[i + 1][0].start : l.end + 0.2 }));
};

/** timing preview only: a line of the new script that has no recording yet, read at ay's pace */
const Subtitle: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 160, right: 160, bottom: 46, textAlign: "center" }}>
    <span style={{ fontFamily: F.body, fontSize: 34, lineHeight: 1.45, color: "#F2F2EE", background: "rgba(10,10,12,0.82)", padding: "4px 14px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
      {text}</span>
  </div>
);
