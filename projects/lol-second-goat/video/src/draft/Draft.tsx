// Full draft (19 Nov night): every visual cut to ay's assembled voiceover (voiceover-assembled.mp3, word times from
// voiceover-timing.json). A scene starts on its line and holds until the next scene's line. Footage cards stand in for
// broadcast clips; no music (ay picks the track); the outro is a placeholder until ay records it.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C, F } from "../theme";
import * as St from "../stills/Stills";
import * as Mo from "../motion/Tests";
import * as Sm from "../samples/Samples";
import { Build, Count527, FairCoin, Footage, Formula, Quote, Words } from "../rough/RoughCut";
import { PlayerCards, DreamSeasons, MonteCarlo, ORDER_2025, ORDER_2026, ORDER_GENG, PyramidTwist, TwoFakers } from "./Graphics";
import { L, VO_DURATION, W } from "../data/vo";

const FPS = 30;
const LEAD = 4; // seconds before the voice: the broadcast call goes here
const OUTRO = 8;
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
  ["4", () => <Words text={"WHO IS #2\nAFTER FAKER?"} black />],
  ["5", still("S2Debate")],
  ["10", () => <Count527 />],
  ["11", () => <Words text="FAKER: #14" sub="version 1" />],
  ["14", () => <Formula name="PEAK, NOT AVERAGE" lines={["every year averaged  ✗", "best years + longevity  ✓"]} />],
  ["16", still("S22Kills", "wipe")],
  ["18", () => <Formula name="OWN LEAGUE ONLY" lines={["LPL mids against LPL mids", "same year · same role"]} />],
  ["19", ft("a stomp, then a close win over Gen.G")],
  ["20", anchored(<Sm.SElo voice={false} />, Sm.ELO_T0)],
  ["21", () => <Formula name="STRONGER TEAMS COUNT MORE" lines={["same stat line", "better opponent → more credit"]} />],
  ["22", ft("a trophy lift")],
  ["23", () => <Formula name="HOW HARD WAS THE TITLE?" lines={["coin flips in a row", "a top team needs to win that bracket"]} />],
  ["24", still("S14Hardest", "wipe")],
  ["25", still("S13PriceList", "rise")],
  ["26", () => <Formula name="TITLE SHARES" lines={["like Win Shares in basketball", "split each trophy between the five"]} />],
  ["27", still("S24Credit", "rise")],
  ["28", still("R6ClutchHist", "rise")],
  ["29", () => <FairCoin />],
  ["31", still("S16Clutch", "wipe")],
  ["32", still("SampleWithWithout", "rise")],
  ["34", anchored(<Sm.SPlusMinus voice={false} />, Sm.PM_T0)],
  ["36", () => <Words text="ONLY WHO WON" />],
  ["37", still("S15Impact", "rise")],
  ["38", still("S23AllPro")],
  ["42@final", anchored(<Sm.SCards voice={false} />, Sm.CARDS_T0)],
  ["43", () => <Formula name="EVERY PART, 0 TO 100" lines={["50 = middle of the pack", "100 = the best there's been"]} />],
  ["44", () => <Words text="THE CATEGORIES" />],
  ["45", () => <Formula name="BIG GAMES" lines={["form at Worlds and MSI", "+ clutch"]} />],
  ["46", still("R4BigStage", "rise")],
  ["47", () => <Formula name="SKILL" lines={["season rating, opponent and region adjusted", "best 5 years + best single year"]} />],
  ["48", () => <Mo.T1Rise />],
  ["49", still("SampleSkillSwarm", "rise")],
  ["50", still("R4TeamsTimeline", "wipe")],
  ["51", () => <Formula name="TROPHY SCORE" lines={["price × how hard × his share", "added up over a career"]} />],
  ["52", still("R4CabinetStack", "wipe")],
  // T2Climb holds 2 s, then climbs: the climb starts in the silent beat after "by the way"
  ["53", anchored(<Mo.T2Climb />, L("53").end + 0.1, 60)],
  ["56", (c) => <MonteCarlo cues={[at(c, W("57", "rolls")), at(c, W("60", "thousand")), at(c, W("61", "first"))]} />],
  ["64", anchored(<Sm.SPyramid voice={false} />, Sm.PYR_A[0])],
  ["67", still("S10aPyramidInternet")],
  ["68", (c) => <PlayerCards title="NOT EVERYTHING FITS IN A NUMBER" titleAt={at(c, W("68", "also"))} stamp={{ text: "GLAZED?", at: at(c, W("68", "glazed")), card: 0 }} cards={[
    { id: "uzi", sub: "#21 ALL TIME", flipAt: at(c, W("68", "uzi")), lines: [{ text: "0 WORLDS", at: at(c, W("68", "worlds")), bad: true }, { text: "AURA", at: at(c, W("68", "aura")) }, { text: "MECHANICS", at: at(c, W("68", "mechanical")) }] },
    { id: "bengi", sub: "#44 ALL TIME", flipAt: at(c, W("68", "benji")), lines: [{ text: "3 WORLDS", at: at(c, W("68", "won", 1)) }, { text: "#247 OWN NUMBERS", at: at(c, W("68", "247")), bad: true }, { text: "SHOTCALLING", at: at(c, W("68", "shotcalling")) }] },
  ]} />],
  ["69", anchored(<Sm.SPyramid voice={false} />, Sm.PYR_B[0], Math.round((Sm.PYR_A[1] - Sm.PYR_A[0]) * FPS))],
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
  ["92", (c) => <DreamSeasons cues={[at(c, W("93", "2029") - 66 / FPS), at(c, W("93", "four") - 88 / FPS)]} />],
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
