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
import * as Ov from "./Overlays";
import { KillsLine } from "./KillsLine";
import { WorldsValues, HardestRuns, PriceClimb } from "./Bars";
import { Concrete } from "../samples/Climb";
import { PercentStack } from "./PercentStack";
import { PillBars, StackedLines, TitleList } from "./Lists";
import { OnBlack, RecordCounter } from "./Banners";
import { Clip, Cuts, RingClip, SplitClips } from "./Clip";
import { FansVsModel } from "./Slope";
import { TrophyWeight, AbsoluteCinema, ChatLine } from "./Averaged";
import { PyramidStates } from "./PyramidStates";
import { CHOVY_ROW, GUMA_ROW, KNIGHT_ROW, Silverware } from "./Silverware";
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

const SCENES: [string, (c: Ctx) => React.ReactNode][] = [
  // ay 20 Nov: footage only, never still player photos (lol-second-goat/footage, public/_local/footage)
  ["1", () => <Clip id="lift" from={2} />],
  ["1@knight", () => <Clip id="lift" from={37} />],
  // ay 20 Nov: plain Faker B-roll, no circle text (clip 21 is Peyz, not Faker: checked frame by frame)
  ["3", () => <Clip id="fakerJerseys" from={0.3} dim={0} />],
  // ay 19 Nov style map: Jxmy giant word over footage, then his comment-bubble pile (photo stands in for footage)
  // ay 20 Nov: B-roll stops at "who's the second best"; plain backgrounds from here on
  ["3@who", (c) => <AbsoluteFill><Concrete /><Ov.BigWord text="WHO IS #2?" at={4} /></AbsoluteFill>],
  // the invented comment pile is gone (ay 20 Nov): real fan answers from real sites go here once collected
  ["5", (c) => <AbsoluteFill><Concrete /><Ov.CommentPile cues={{ from: 2, to: at(c, W("5", "answers")),
    focus: [{ id: "keria", at: at(c, WA("6", ["keria", "carrier"])) }, { id: "chovy", at: at(c, W("7", "chovy")) }], all: at(c, W("9", "everyone")) }} /></AbsoluteFill>],
  // Jxmy text card, then his big number card on the number (style map 0:44)
  ["10", (c) => <AbsoluteFill><Concrete /><Ov.ModelCard text="SO I BUILT A MODEL" years="2011 TO 2026" yearsAt={at(c, W("10", "2011"))} value="527" unit="PLAYERS" numAt={at(c, W("10", "527"))} /></AbsoluteFill>], // ay 14:36: one card, added on
  // ay 21 Nov 01:22: the WRONG / FAKER #14 verdict card looked low budget; the version 1 graph now starts on line 11
  ["11", (c) => <VersionOne trophiesAt={10} partsAt={at(c, WA("11", ["14th", "14"]))} gamesAt={at(c, WA("13", ["tracked", "early"]))} damageAt={HAS("13b") ? at(c, WA("13b", ["damage"])) : 1e9 /* 13b not recorded yet: the damage row waits for it */} />], // lines 11 to 13b
  // ay 21 Nov 00:29: "Peak, not average" was misleading (team impact and clutch use the whole career); the board now says
  // exactly what line 15 says changed
  ["15", (c) => <MLBoard title="What changed" lines={[
    { text: "Version 1: early games untracked, no damage stats before 2020", at: 4 },
    { face: "faker", text: "Faker in version 1: #14", at: 16, dim: true },
    { text: "Now: fixed for every old player", at: at(c, WA("15", ["every"])) },
    { text: "Missing games filled in", at: at(c, WA("15", ["filled"])) },
    { text: "Missing stats made up for", at: at(c, WA("15", ["made"])) },
    { face: "faker", text: "Faker now: #1", at: at(c, L("15").end) - 10, accent: true }]}
    side={<SideBars caption="Faker's all-time rank" rows={[
      { label: "Version 1", value: "#14", frac: 0.3, color: "#8E97A3", at: 10 },
      { label: "Now", value: "#1", frac: 1, color: TEAL, at: at(c, L("15").end) - 10 }]} />} sideAt={10} />],
  // v15.3 (ay 20 Nov 23:09): trophies are 30% of the score; the share swings on "subjective", settles on "30%"
  // 21 Nov 15:40 take has 15b and 15d again
  ["15b", (c) => <TrophyShare swingAt={at(c, WA("15b", ["worth", "trophy"]))} settleAt={at(c, WA("15d", ["30%", "30"]))} />],
  // Jxmy line chart (style map 1:22)
  ["16", (c) => <KillsLine cues={{ lck: at(c, L("16").start + 0.3), lpl: at(c, W("16", "lpl")), gap: at(c, W("17", "3")) }} />],
  // Jxmy highlighted page, then big text sliding past (style map 1:34)
  // ay 20 Nov 14:36: two LPL teams side by side, same role against same role (replaces the text reveal)
  ["18", (c) => <TeamRoles cues={{ rows: Math.max(4, at(c, W("18", "compares")) - 6), role: at(c, W("18", "role")), old: at(c, WA("18b", ["2013", "old"])) }} />], // 18b: the old-era 5v5 on "2013"
  // ay 20 Nov: keep this B-roll (the DK "bottom team" joke), with a tiny chat line on it
  ["19", (c) => <AbsoluteFill><Clip id="stomp" from={20} /><ChatLine user="dk_enjoyer" text="DK LOL" at={at(c, W("19", "bottom"))} /></AbsoluteFill>],
  ["19@gen", () => <Clip id="close" from={22} />],
  ["20", anchored(<Sm.SElo voice={false} />, Sm.ELO_T0)],
  ["21", (c) => <MLBoard title="Stronger teams count more" lines={[
    { text: "Same stat line", at: at(c, W("21", "same")) },
    { text: "Better opponent, more credit", at: at(c, W("21", "counts")), accent: true }]}
    side={<SideTowers at={at(c, W("21", "same"))} at2={at(c, W("21", "counts"))} />} sideAt={at(c, W("21", "same"))} />],
  // script 20 Nov 15:52 (ay: trophies go straight into what each title is worth, no blank screen, no coin-flip card)
  ["22", (c) => <AbsoluteFill><Concrete /><Ov.ChapterTitle text="TROPHIES" at={at(c, L("22").start + 0.2)} /></AbsoluteFill>],
  // the worth bars open on "how much is an MSI worth", then each value lands as it is said in 23
  ["22@but", (c) => { const w1 = at(c, WA("23", ["100", "hundred"])), w2 = at(c, WA("23", ["56", "fifty"])), w3 = at(c, WA("23", ["44", "forty"]));
    // ay 21 Nov 17:07: zoom out right after "44" and hold the whole graph about a second (0.8 s pause added after line 23)
    return <PriceClimb cues={[Math.min(w1, 20), w2, w3, w3 + 6, w3 + 10]} out={w3 + 12} />; }],
  // line 24: every Worlds winner by the strength of the field it beat; "down here" lights DAMWON 2020, "all the way up here" T1 2024
  ["24", (c) => <WorldsValues cues={{ rise: 4, lit: [{ team: "DAMWON Gaming", year: 2020, at: at(c, WA("24", ["down", "damwon"])) },
    { team: "T1", year: 2024, at: at(c, WA("24", ["t1", "toughest"])) }] }} />],
  // 24b: the biggest underdog is a different question: each champion's own odds, DRX 2022 lit on "DRX", the 1 in 500 on "500"
  ["24b", (c) => <HardestRuns cues={{ rise: 0, lit: [{ team: "DRX", year: 2022, at: at(c, WA("24b", ["drx"])) }] }} />],
  // 25: what BLG's harder run is worth to Knight
  // 25 cut (ay 20 Nov 19:16): no Knight trophy-points segment
  // stand-in shot of a team lift, then Jxmy's article page with the key line highlighted (style map 2:44)
  ["26@win", (c) => <Ov.ArticlePage kicker="Sports stats" title="Win Shares" markAt={at(c, W("26", "splits"))}
    before="Win Shares takes the games a team won and" mark="splits those wins between its players," after="so every player gets credit for part of each win, based on what they did in the game. Two players on the same team can end up with very different shares." />],
  // ay 20 Nov 13:13: BLG 2026 shares are back (TitleShare.tsx, the no-names version, is kept but unused)
  ["27", (c) => <TrophySplit cues={{ photos: 0, pie: at(c, WA("27", ["same", "titles"])), shares: at(c, WA("27", ["take", "ig"])) /* ay 21 Nov 17:07: players on screen from "Take IG in 2018" */, caption: at(c, WA("27", ["ig", "2018"])),
    names: { rookie: at(c, WA("27", ["rookie"])), theshy: at(c, WA("27", ["shy"])), baolan: at(c, WA("27b", ["bao", "baolan"])), jackeylove: at(c, WA("27b", ["jackie", "jackey"])), ning: at(c, WA("27b", ["ning"])) },
    top: at(c, WA("27", ["rookie", "biggest"])), mvp: at(c, WA("27b", ["ning", "finals"])) }} />], // ay 19:16: IG 2018 shares, Ning (Finals MVP) smallest on 27b
  ["28", (c) => { // script 15:52, Jxmy's walk: "at the bottom" zooms on the chokers (named on "Creme"), "in the middle" lights the band,
    // "all the way up here" pans to the clutch players, "yup" names Faker
    const rv = at(c, WA("31", ["faker's", "faker"])), ch = at(c, WA("30", ["creme", "bottom"]));
    const d0 = at(c, L("30").start) + 4, d1 = Math.max(d0 + 90, at(c, WA("30", ["down", "bottom"])) - 12);
    return <Build C={() => <St.S16Clutch reveal={rv} chokeAt={ch} dots={[d0, d1]} walk={{ bottom: at(c, WA("30", ["bottom"])), mid: at(c, L("30b").start), top: at(c, L("31").start) }}
      nameAt={Object.fromEntries([...["on", "zeus", "gumayusi", "zeka"].map((id) => [id, at(c, WA("31", ["gumayusi"]))]), ["bin", at(c, WA("31", ["bin"]))],
        ...[["369", "369"], ["gala", "369"], ["zven", "369"], ["doran", "doran"]].map(([id, w]) => [id, at(c, WA("30b", [w]))])] /* ay 20:19: highlight four, voice names two */)} />} mode="wipe" dur={c.dur} />; }], // ay 19 Nov: hold the clutch scatter from "clutch" to the end of the Faker line
  // ay 20 Nov: the old with/without graph with all three players back (only Chovy is talked about)
  ["32", (c) => <Build C={() => <St.SampleWithWithout lit="chovy" />} mode="wipe" dur={c.dur} />],
  // ay 20 Nov: from the Chovy graph straight to the wins-added graph, held the whole time, then the climb to Faker
  // ay 20 Nov (draft 7): the "when he's out, who comes in" explainer back, then the wins-added graph, then the climb
  ["34", anchored(<Sm.SPlusMinus voice={false} />, Sm.PM_T0)],
  // ay 20 Nov 20:01: line 35 as a running ledger for Chovy (the grid was confusing)
  ["35", (c) => <PMLedger cues={{ lineup: at(c, WA("35", ["against", "players"])), result: at(c, WA("35", ["over", "26"])), n26: at(c, WA("35", ["26", "about"])),
    fast: at(c, WA("35", ["add", "up"])), done: at(c, L("35").end) + 12 }} />],
  ["37", (c) => { const k = Math.max(1, fr(Cl.CLIMB_T0 - c.t0)); // ay 20 Nov 14:36: line 36 cut, straight to the graph
    return <><Sequence durationInFrames={k} layout="none"><Freeze frame={30}><Cl.SClimb voice={false} /></Freeze></Sequence>
      <Sequence from={k} layout="none"><Cl.SClimb voice={false} /></Sequence></>; }],
  // Jxmy percent stack (jxmy-graphs XMaPrXzclaQ g08), with 100 picks lit on the right
  ["38", (c) => <PercentStack header="HOW MANY ALL-PRO PICKS COME OUT RIGHT" rows={[
    { icon: "trophy", label: "PICK FROM THE WINNING TEAMS", pct: 58, at: at(c, W("40", "winning")) },
    { icon: "model", label: "THE MODEL", pct: 63, at: at(c, W("41", "63")), accent: true }]}
    cues={{ votes: at(c, W("39", "all")), hide: at(c, W("40", "model")), ask: at(c, WA("40", ["asked", "pick"])) }} />],
  ["42@final", anchored(<Sm.SCards voice={false} />, Sm.CARDS_T0)],
  // Jxmy small stacked text card (jxmy-graphics l38FEWdJnhg x03, style map 4:56)
  ["43", (c) => <StackedLines lines={[
    { text: "50 = MIDDLE OF THE PACK", at: -30 }, // ay 14:36: on screen from the start
    { text: "100 = THE BEST EVER", at: at(c, W("43", "100")) },
    { text: "TROPHIES: FAKER = 100", at: at(c, W("43", "faker")), accent: true, gap: 50 },
    { text: "EVERYONE ELSE = A SHARE OF HIM", at: at(c, W("43", "everyone")) }]} />],
  // ay 20 Nov: no chapter titles in the six-parts section, footage between the graphs
  // Jxmy pill bars with the players at the foot (jxmy-graphs eatF7QHwga4 g08, style map 5:15); v14 big-stage half alone
  ["45", (c) => <PillBars cues={{ rise: 4, lit: at(c, WA("46", ["knight", "carrier"])), side: 1e6 }} />],
  ["47", (c) => { const top = at(c, WA("48", ["chovy", "top"])); return <SeasonList n={8} cues={{ scroll0: at(c, WA("48", ["zeus", "here"])), scroll1: top - 2, spot: top, second: at(c, W("48", "knight")) }} />; }], // v15.2: climbs to Chovy 2025
  // Jxmy two-player board (jxmy-graphs GPH4nK5sQ-8 g01): Chovy vs Knight, the skill score "by a hair" last
  // 48b (Faker's best season) cut, ay 20 Nov 18:03: not in the video
  ["49", (c) => <HeadToHead left="chovy" right="knight" title="MOST SKILLED" cues={{ in: 0, rows: 6, last: at(c, WA("49", ["behind", "just", "knight"])) }} rows={[
    { label: "CS AHEAD AT 15 MIN", l: "+10.4", r: "+7.7", better: "l" },
    { label: "GOLD AHEAD AT 15 MIN", l: "+339", r: "+451", better: "r" },
    { label: "KDA", l: "5.67", r: "5.77", better: "r" },
    { label: "DEATHS A GAME", l: "1.69", r: "1.94", better: "l" },
    { label: "WIN RATE", l: "69.2%", r: "66.9%", better: "l" },
    { label: "SKILL SCORE", l: "100", r: "97.8", better: "l", big: true }]} />],
  ["51", (c) => <MLBoard title="Trophy score" lines={[
    { text: "Each title = which trophy × how hard × his share", at: at(c, WA("51", ["how", "times"])) },
    { text: "Added up over a whole career", at: at(c, W("51", "share")), accent: true }]} />],
  // The cabinet without Faker in view (Canyon, Ruler, Knight named), held still, then on "here's Faker" the camera climbs
  // all the way up to Faker and holds, zooms out on line 55 to compare him with everyone, and the gap bracket lands on
  // "anyone". No "more than double" card; it holds until "how sure" (ay 20 Nov 14:36, like Jxmy's climb then zoom out).
  ["51@only", (c) => <ClimbRemap c={c} />],
  // ay 20 Nov 15:28: still on "how sure", the rolls start on "the model rolls a dice", a clean cut to the Monte Carlo page,
  // then back with the count carried on: about 10 rolls, a hold on one, the time-lapse to 1,000 on "all 1000"
  // ay 20 Nov 19:16: the graph holds still while ay explains the Monte Carlo test (57, 57b), then moves on
  // "the model rolls a dice" (58): rolls one by one, a time-lapse on "ran it", 1,000 on "all 1,000". No article page cut.
  // ay 20 Nov 23:03: Monte Carlo explained (56 to 57b) before the roll-the-dice graph from 58
  // ay 21 Nov 00:29: the definition page, like before (not the wheel)
  ["56", (c) => <Ov.ArticlePage kicker="Statistics" title="Monte Carlo method" markAt={at(c, WA("57b", ["changes", "inputs", "luck"]))}
    before="A Monte Carlo test runs the same model thousands of times, " mark="changing the inputs at random each time," after=" then counts how often each result comes up. It is named after the Monte Carlo casino, because it runs on chance." />],
  ["58", (c) => <MonteCarlo cues={[at(c, WA("58", ["dice", "rolls"])), at(c, WA("60", ["ran", "thousand"])), at(c, WA("61", ["1000", "1,000", "all"]))]} twoAt={at(c, WA("61", ["number", "but"]))} />],
  // Jxmy record card (jxmy-graphs 4lbvnNVGd-I g06, style map 6:32)
  // Jxmy quote subtitle over footage (jxmy-graphics 3hZ6Su5PVnI x02, style map 6:42)
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
];

const VO_END = VO_DURATION;
// ay 21 Nov 17:24: hold the last panel (laughing cat under Guma's titles) about 3 s before the end card
const TAIL = 3.0;
/** "42" starts on line 42; "42@final" starts on the word "final" in line 42 */
const startOf = (key: string) => { const [id, w] = key.split("@"); return (w ? W(id, w) : L(id).start) - 0.05; };
const TL = SCENES.map(([id, el], i) => {
  const t0 = i === 0 ? -LEAD : startOf(id);
  const t1 = i + 1 < SCENES.length ? startOf(SCENES[i + 1][0]) : VO_END + TAIL;
  return { id, el, t0, dur: fr(t1 - t0) };
});
export const DRAFT_TOTAL = fr(LEAD + VO_END + TAIL + OUTRO);

// End card (ay 20 Nov: no "who's your #2"). 12 s of quiet footage with room for YouTube's end-screen
// video and subscribe elements in the middle, and the Riot line at the foot.
const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><AbsoluteFill style={{ opacity: interpolate(f, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <Clip id="coldopen" from={COLD_FROM} dim={0} /></AbsoluteFill></AbsoluteFill>;
};

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
  // ay 21 Nov 17:28: the laughing cat beside the Guma quote during the laugh (the minion goes on the last panel)
  return <Img src={staticFile("_local/memes/laughing-cat-sticker.png")} style={{ position: "absolute", left: 90, top: 380, width: 330, height: 307, objectFit: "contain",
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
    <Sequence from={fr(LEAD + W("94", "error") + 0.35)} durationInFrames={fr(3.75)} layout="none" name="Guma laugh">
      <LaughFlash />
      <Audio src={staticFile("_local/memes/vine-boom.mp3")} volume={0.32} />
      <Sequence from={4} layout="none"><Audio src={staticFile("_local/memes/minion-laugh.mp3")} volume={0.55} /></Sequence>
    </Sequence>
    {/* ay 21 Nov 17:07: "this model is lowkey cinema" now ends line 81 */}
    <Sequence from={fr(LEAD + W("81", "cinema"))} durationInFrames={41} layout="none"><AbsoluteCinema at={0} out={40} /></Sequence>
    <Sequence from={fr(LEAD + VO_END + TAIL)}><EndCard /></Sequence>
    {VO_KEEP.map(([a, b], i) => (
      <Sequence key={"vo" + i} from={fr(LEAD + vt(a))} durationInFrames={fr(b - a)}><Audio src={staticFile(VO_AUDIO)} startFrom={fr(a)} endAt={fr(b)} /></Sequence>
    ))}
    <Music lead={LEAD} total={DRAFT_TOTAL} />
    {VO_PREVIEW && VO_LINES.filter((l) => l.sub).flatMap((l) => subChunks(l).map((c, k) => (
      <Sequence key={"sub" + l.line + "-" + k} from={fr(LEAD + c.a - 0.1)} durationInFrames={Math.max(1, fr(c.b - c.a + 0.1))} layout="none"><Subtitle text={c.text} /></Sequence>
    )))}
    <div style={{ position: "absolute", right: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>{VO_PREVIEW ? "TIMING PREVIEW · new lines as subtitles, not recorded yet" : "DRAFT"}</div>
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
