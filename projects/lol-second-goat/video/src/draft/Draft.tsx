// Full draft (19 Nov night): every visual cut to ay's assembled voiceover (voiceover-assembled.mp3, word times from
// voiceover-timing.json). A scene starts on its line and holds until the next scene's line. Footage cards stand in for
// broadcast clips; no music (ay picks the track); the outro is a placeholder until ay records it.
import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import * as St from "../stills/Stills";
import * as Mo from "../motion/Tests";
import * as Cl from "../samples/Climb";
import * as Sm from "../samples/Samples";
import { Build, Count527, Footage, Formula, Quote, Words } from "../rough/RoughCut";
import { AllProTest, MLBoard, SideBars, SideCoins, SideScale, SideTowers, WithWithout } from "./Boards";
import { TeamRoles } from "./TeamRoles";
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
import { TrophyWeight, HardRunBonus, AbsoluteCinema, ChatLine } from "./Averaged";
import { PyramidStates } from "./PyramidStates";
import { CHOVY_ROW, GUMA_ROW, KNIGHT_ROW, Silverware } from "./Silverware";
import { PlayerCards, DreamSeasons, MonteCarlo, ORDER_2025, ORDER_2026, ORDER_GENG, PyramidTwist, TwoFakers } from "./Graphics";
import { L, VO_AUDIO, VO_DURATION, VO_KEEP, VO_LINES, VO_PREVIEW, vt, W, WA, WE } from "../data/vo";

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
  const pulse = { perkz: a(W("65", "perkz")), bjergsen: a(W("65", "bjergsen")), jankos: a(W("65", "jankos")), caps: a(W("66", "caps")) + 20 };
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
  // Jxmy verdict word over the shot: #14, then WRONG (style map 0:58)
  ["11", (c) => <AbsoluteFill><Concrete />
    <Ov.VerdictWord words={[{ text: "WRONG", at: at(c, W("11", "wrong")) }, { text: "FAKER #14", at: at(c, W("11", "14th")) }]} /></AbsoluteFill>],
  // Jxmy handwritten note over the shot (style map 1:08); photo stands in for a rebuild-year game
  // ay 20 Nov: show his titles getting cut down by the averaging
  ["13", (c) => <TrophyWeight barAt={at(c, WA("13", ["trophies", "main"]))} cupsAt={at(c, WA("13", ["six", "barely", "worlds"]))}
    avgAt={at(c, W("13", "averaging"))} dragAt={at(c, WA("13", ["dragging", "later", "down"]))} />], // script 16:05: trophy weight too small + averaging
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
  // ay 20 Nov 14:36: two LPL teams side by side, same role against same role (replaces the text reveal)
  ["18", (c) => <TeamRoles cues={{ rows: Math.max(4, at(c, W("18", "compares")) - 6), role: at(c, W("18", "role")) }} />],
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
  ["22@how", (c) => { const w1 = at(c, WA("23", ["100", "hundred"])), w2 = at(c, WA("23", ["56", "fifty"])), w3 = at(c, WA("23", ["44", "forty"]));
    return <PriceClimb cues={[Math.min(w1, 20), w2, w3, w3 + 10, w3 + 16]} out={w3 + 22} />; }],
  // line 24: every Worlds winner by the strength of the field it beat; "down here" lights DAMWON 2020, "all the way up here" T1 2024
  ["24", (c) => <WorldsValues cues={{ rise: 4, lit: [{ team: "DAMWON Gaming", year: 2020, at: at(c, WA("24", ["down", "damwon"])) },
    { team: "T1", year: 2024, at: at(c, WA("24", ["t1", "toughest"])) }] }} />],
  // 24b: the biggest underdog is a different question: each champion's own odds, DRX 2022 lit on "DRX", the 1 in 500 on "500"
  ["24b", (c) => <HardestRuns cues={{ rise: 0, lit: [{ team: "DRX", year: 2022, at: at(c, WA("24b", ["drx"])) }] }} />],
  // 25: what BLG's harder run is worth to Knight
  ["25", (c) => <HardRunBonus barAt={at(c, L("25").start + 0.3)} bonusAt={at(c, WA("25", ["11", "eleven", "added"]))} scoreAt={at(c, WA("25", ["half", "less"]))} />],
  // stand-in shot of a team lift, then Jxmy's article page with the key line highlighted (style map 2:44)
  ["26@win", (c) => <Ov.ArticlePage kicker="Sports stats" title="Win Shares" markAt={at(c, W("26", "splits"))}
    before="Win Shares takes the games a team won and" mark="splits those wins between its players," after="so every player gets credit for part of each win, based on what they did in the game. Two players on the same team can end up with very different shares." />],
  // ay 20 Nov 13:13: BLG 2026 shares are back (TitleShare.tsx, the no-names version, is kept but unused)
  ["27", (c) => <TrophySplit cues={{ photos: 0, pie: at(c, L("27").start + 0.4), shares: at(c, L("27").start + 1.6), caption: at(c, L("27").start + 3.0) }} />], // ay 20 Nov 13:13: back to BLG 2026, current shares
  ["28", (c) => { // script 15:52, Jxmy's walk: "at the bottom" zooms on the chokers (named on "Creme"), "in the middle" lights the band,
    // "all the way up here" pans to the clutch players, "yup" names Faker
    const rv = at(c, WA("31", ["yup"])), ch = at(c, WA("30", ["creme", "bottom"]));
    return <Build C={() => <St.S16Clutch reveal={rv} chokeAt={ch} walk={{ bottom: at(c, WA("30", ["bottom"])), mid: at(c, L("30b").start), top: at(c, L("31").start) }}
      nameAt={Object.fromEntries(["on", "zeus", "gumayusi", "bin"].map((id) => [id, at(c, id === "on" ? WE("31", "on") : WA("31", [id === "gumayusi" ? "guma" : id]))]))} />} mode="wipe" dur={c.dur} />; }], // ay 19 Nov: hold the clutch scatter from "clutch" to the end of the Faker line
  // ay 20 Nov: the old with/without graph with all three players back (only Chovy is talked about)
  ["32", (c) => <Build C={() => <St.SampleWithWithout lit="chovy" />} mode="wipe" dur={c.dur} />],
  // ay 20 Nov: from the Chovy graph straight to the wins-added graph, held the whole time, then the climb to Faker
  // ay 20 Nov (draft 7): the "when he's out, who comes in" explainer back, then the wins-added graph, then the climb
  ["34", anchored(<Sm.SPlusMinus voice={false} />, Sm.PM_T0)],
  ["37", (c) => { const k = Math.max(1, fr(Cl.CLIMB_T0 - c.t0)); // ay 20 Nov 14:36: line 36 cut, straight to the graph
    return <><Sequence durationInFrames={k} layout="none"><Freeze frame={30}><Cl.SClimb voice={false} /></Freeze></Sequence>
      <Sequence from={k} layout="none"><Cl.SClimb voice={false} /></Sequence></>; }],
  // Jxmy percent stack (jxmy-graphs XMaPrXzclaQ g08), with 100 picks lit on the right
  ["38", (c) => <PercentStack header="HOW MANY ALL-PRO PICKS COME OUT RIGHT" rows={[
    { icon: "trophy", label: "PICK FROM THE WINNING TEAMS", pct: 58, at: at(c, W("40", "winning")) },
    { icon: "model", label: "THE MODEL", pct: 63, at: at(c, W("41", "63")), accent: true }]}
    cues={{ votes: at(c, W("39", "all")), hide: at(c, W("40", "model")), ask: at(c, W("40", "If")) }} />],
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
  ["47", (c) => { const top = at(c, WA("48", ["chovy", "top"])); return <SeasonList n={8} cues={{ scroll0: at(c, WA("48", ["zeus", "here"])), scroll1: top - 2, spot: top }} />; }], // v15.2: climbs to Chovy 2025
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
    { text: "Each title = price × how hard × his share", at: at(c, W("51", "stack")) },
    { text: "Added up over a whole career", at: at(c, W("51", "share")), accent: true }]} />],
  // The cabinet without Faker in view (Canyon, Ruler, Knight named), held still, then on "here's Faker" the camera climbs
  // all the way up to Faker and holds, zooms out on line 55 to compare him with everyone, and the gap bracket lands on
  // "anyone". No "more than double" card; it holds until "how sure" (ay 20 Nov 14:36, like Jxmy's climb then zoom out).
  ["51@only", (c) => <ClimbRemap c={c} />],
  // ay 20 Nov 15:28: still on "how sure", the rolls start on "the model rolls a dice", a clean cut to the Monte Carlo page,
  // then back with the count carried on: about 10 rolls, a hold on one, the time-lapse to 1,000 on "all 1000"
  ["56", (c) => <MonteCarlo cues={[at(c, WA("57", ["dice", "rolls"])), 1e6, 1e6]} />],
  // Jxmy article page (jxmy-graphics XyihDTdpF8w x08, style map 6:11): our own page, the line marked as it is said
  ["57b", (c) => <Ov.ArticlePage kicker="How to test a ranking" title="The Monte Carlo test"
    before="Rerun the whole thing many times, and each time roll the choices it rests on at random."
    mark="Named after the casino, because it runs on luck." after="If an answer holds across a thousand rolls, it was never the luck."
    markAt={at(c, WA("57b", ["named"]))} />],
  ["58", (c) => { const done = Math.max(1, Math.floor((startOf("57b") - WA("57", ["dice", "rolls"])) * 30 / 20) + 1);
    return <MonteCarlo from={Math.min(10, done)} cues={[6, at(c, W("60", "ran")), at(c, W("61", "1000"))]} />; }], // back from the page: ~10 rolls, hold, time-lapse to 1,000 on "all 1000"; holds through 61-63
  // Jxmy record card (jxmy-graphs 4lbvnNVGd-I g06, style map 6:32)
  // Jxmy quote subtitle over footage (jxmy-graphics 3hZ6Su5PVnI x02, style map 6:42)
  ["64", (c) => <OGPyramid c={c} />],
  // ay 20 Nov: the Uzi/Bengi cards repeated the six-part cards; now a slope chart, fans vs the model (league-v14 ranks)
  // ay 20 Nov: back to the bordered face cards for Uzi and Bengi
  ["68", (c) => <PlayerCards title="NOT EVERYTHING FITS IN A NUMBER" titleAt={at(c, WA("68", ["intangibles", "also"]))} stamp={{ text: "GLAZED?", at: at(c, W("68", "bit")) + 12, card: 0 }} cards={[
    { id: "uzi", sub: "#25 ALL TIME", flipAt: at(c, W("68", "uzi")), lines: [{ text: "0 WORLDS", at: at(c, W("68", "worlds")), bad: true }, { text: "AURA", at: at(c, W("68", "aura")) }] },
    { id: "bengi", sub: "#37 ALL TIME", flipAt: at(c, WA("68", ["bengi", "benji"])), lines: [{ text: "3 WORLDS", at: at(c, W("68", "won", 1)) }, { text: "#182 OWN NUMBERS", at: at(c, WA("68", ["182", "numbers"])), bad: true }, { text: "SHOTCALLING", at: at(c, W("68", "shot")) }] },
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
  ["88@whole", (c) => <St.SampleKnightRadar gapAt={at(c, W("88", "gap"))} />], // 88 now ends "the glaring gap you can see is the trophies": circle and zoom on "gap"
  // ay 20 Nov: silverware needed to reach Faker's score today (Faker held flat), no years; Gumayusi joins after his quote
  ["92", (c) => <Silverware fakerAt={4} rows={[KNIGHT_ROW(at(c, WA("93", ["knight"]))), CHOVY_ROW(at(c, WA("93", ["chovy", "trophy"])))]} />],
  // ay 20 Nov: no B-roll, just the quote on screen, then Gumayusi's row joins Knight and Chovy
  ["94", (c) => { const back = at(c, W("94", "but")); return <>
    <Sequence durationInFrames={back} layout="none"><AbsoluteFill><Concrete /><Ov.GumaQuoteCard /></AbsoluteFill></Sequence>
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
    <Sequence from={fr(LEAD + W("80", "cinema"))} durationInFrames={41} layout="none"><AbsoluteCinema at={0} out={40} /></Sequence>
    <Sequence from={fr(LEAD + VO_END + 0.8)}><EndCard /></Sequence>
    {VO_KEEP.map(([a, b], i) => (
      <Sequence key={"vo" + i} from={fr(LEAD + vt(a))} durationInFrames={fr(b - a)}><Audio src={staticFile(VO_AUDIO)} startFrom={fr(a)} endAt={fr(b)} /></Sequence>
    ))}
    {VO_PREVIEW && VO_LINES.filter((l) => l.sub).flatMap((l) => subChunks(l).map((c, k) => (
      <Sequence key={"sub" + l.line + "-" + k} from={fr(LEAD + c.a - 0.1)} durationInFrames={Math.max(1, fr(c.b - c.a + 0.1))} layout="none"><Subtitle text={c.text} /></Sequence>
    )))}
    <div style={{ position: "absolute", right: 24, top: 16, fontFamily: F.body, fontSize: 18, color: "#4A5361" }}>{VO_PREVIEW ? "TIMING PREVIEW · new lines as subtitles, not recorded yet" : "DRAFT · no music yet"}</div>
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
