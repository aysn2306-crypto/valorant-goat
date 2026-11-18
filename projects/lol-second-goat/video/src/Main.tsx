// The whole video, driven by data/timeline.json (written by edit/build_timeline.py from the script + scratch VO lengths).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import timeline from "./data/timeline.json";
import { C, F } from "./theme";
import { D, fmt, P, sign } from "./lib/data";
import { clamp, prog } from "./lib/ui";
import { CategoryField } from "./scenes/CategoryField";
import { Top5 } from "./scenes/Top5";
import { BigNumbers, ChapterCard, Formula, Statement } from "./scenes/Cards";
import { HBars, LineChart, Scatter } from "./scenes/Charts";
import { Breakdown, FaceWall, PlayerCard, RankShift, WorldsTimeline } from "./scenes/Story";
import { FakerSix, TrophySlider, WorldsCard } from "./scenes/Special";

const S = (p: any) => p;
const ST = (id: string) => P(id).stats;
// per-category: axis tick format and the label under each lifted face
export const FIELD: Record<string, { tick: (v: number) => string; label: (id: string) => string; log?: boolean; include?: (id: string) => boolean }> = {
  trophies: { include: (id) => P(id).trophyPts > 0, tick: (v) => v.toFixed(0), label: (id) => `${P(id).titles.worlds} Worlds · ${P(id).titles.msi} MSI · ${P(id).titles.domestic} domestic`, log: true },
  big_stage: { include: (id) => (ST(id).intl_games ?? 0) > 0, tick: (v) => sign(v, 1), label: (id) => `${ST(id).intl_games} intl games · ${fmt(ST(id).intl_wr, 0)}% won` },
  peak: { tick: (v) => sign(v, 1), label: (id) => `best year: ${P(id).peakYear}` },
  longevity: { tick: (v) => v.toFixed(0), label: (id) => `${P(id).eliteYears} elite years` },
  winning: { tick: (v) => sign(v * 100, 0), label: (id) => `${fmt(ST(id).wr, 1)}% of games won` },
  consistency: { tick: (v) => (v * 100).toFixed(0) + "%", label: (id) => `${(P(id).raw.consistency * 100).toFixed(0)}% of events above par` },
  laning: { include: (id) => ST(id).gd15 !== null && ST(id).gd15 !== undefined, tick: (v) => sign(v, 1), label: (id) => `${sign(ST(id).gd15, 0)} gold at 15 min` },
  killing: { tick: (v) => sign(v, 1), label: (id) => `${fmt(ST(id).kills_pg, 1)} kills a game` },
  teamfight: { include: (id) => ST(id).dshare !== null && ST(id).dshare !== undefined, tick: (v) => sign(v, 1), label: (id) => `${fmt(ST(id).dshare, 1)}% dmg share · ${fmt(ST(id).kp, 0)}% KP` },
  clean_play: { tick: (v) => sign(v, 1), label: (id) => `KDA ${fmt(ST(id).kda, 1)}` },
  vision: { include: (id) => ST(id).vis_pm !== null && ST(id).vis_pm !== undefined, tick: (v) => sign(v, 1), label: (id) => `${fmt(ST(id).vis_pm, 2)} vision / min` },
  team_carry: { tick: (v) => sign(v, 1), label: (id) => `${sign(P(id).raw.team_carry, 2)} SD over teammates` },
  solo_carry: { include: (id) => P(id).soloCarryPts > 0, tick: (v) => v.toFixed(0), label: (id) => `${P(id).soloCarryPts} carry points`, log: true },
  recognition: { include: (id) => P(id).coveredSplits > 0, tick: (v) => v.toFixed(1), label: (id) => `${P(id).allpro} All-Pro pts in ${P(id).coveredSplits} splits` },
  team_lift: { include: (id) => P(id).teamLift !== 0, tick: (v) => sign(v * 100, 0), label: (id) => `${sign(P(id).teamLift, 1)} pts team win rate` },
};
const FMT: Record<string, (v: number) => string> = {
  pct: (v) => v.toFixed(0) + "%", pct1: (v) => v.toFixed(1) + "%", int: (v) => v.toFixed(0), d1: (v) => v.toFixed(1), d2: (v) => v.toFixed(2),
};

const Scene: React.FC<{ b: any }> = ({ b }) => {
  const p = b.props ?? {};
  switch (b.scene) {
    case "chapter": return <ChapterCard {...p} />;
    case "statement": return <Statement {...p} />;
    case "numbers": return <BigNumbers {...p} />;
    case "formula": return <Formula {...p} />;
    case "field": return <CategoryField {...p} tick={FIELD[p.cat]?.tick} label={FIELD[p.cat]?.label} log={FIELD[p.cat]?.log} filter={(id: string) => (!p.role || P(id).role === p.role) && (!FIELD[p.cat]?.include || FIELD[p.cat].include!(id))} />;
    case "top5": return <Top5 {...p} />;
    case "line": return <LineChart {...p} yFmt={FMT[p.yFmt ?? "d1"]} />;
    case "hbars": return <HBars {...p} fmt={FMT[p.fmt ?? "int"]} />;
    case "scatter": return <Scatter {...p} />;
    case "rankshift": return <RankShift {...p} />;
    case "breakdown": return <Breakdown {...p} />;
    case "timeline": return <WorldsTimeline {...p} />;
    case "card": return <PlayerCard {...p} />;
    case "wall": return <FaceWall {...p} />;
    case "worlds": return <WorldsCard {...p} />;
    case "fakersix": return <FakerSix {...p} />;
    case "slider": return <TrophySlider {...p} />;
    default: return <AbsoluteFill style={{ background: "#300" }} />;
  }
};

const Caption: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4, dur - 4, dur], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: F.body, fontSize: 30, fontWeight: 500, color: C.text, background: "rgba(14,17,22,0.78)", padding: "8px 20px", borderRadius: 8, maxWidth: 1500, textAlign: "center" }}>
        {text}</div>
    </div>
  );
};

export const TOTAL = (timeline as any).total as number;
export const Main: React.FC<{ captions?: boolean; scratchTag?: boolean; only?: string }> = ({ captions = true, scratchTag = true }) => {
  const T = timeline as any;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {T.beats.map((b: any) => (
        <Sequence key={b.id} from={b.start} durationInFrames={b.dur} name={`${b.id} ${b.scene}`}>
          <Scene b={b} />
        </Sequence>
      ))}
      {T.lines.map((l: any, i: number) => (
        <Sequence key={"vo" + i} from={l.start} durationInFrames={l.dur} layout="none">
          <Audio src={staticFile(l.audio)} volume={1} />
        </Sequence>
      ))}
      {captions && T.lines.map((l: any, i: number) => (
        <Sequence key={"cap" + i} from={l.start} durationInFrames={l.dur}>
          <Caption text={l.text} dur={l.dur} />
        </Sequence>
      ))}
      {T.music.map((m: any, i: number) => (
        <Sequence key={"m" + i} from={m.from} durationInFrames={m.dur} layout="none">
          <Audio src={staticFile(m.src)} startFrom={m.skip ?? 0}
            volume={(f: number) => m.vol * interpolate(f, [0, 30, m.dur - 45, m.dur], [0, 1, 1, 0], clamp) * (duck(T.lines, m.from + f) ? 0.45 : 1)} />
        </Sequence>
      ))}
      {T.sfx.map((s: any, i: number) => (
        <Sequence key={"s" + i} from={Math.max(0, s.at)} durationInFrames={s.dur ?? 60} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol ?? 0.5} />
        </Sequence>
      ))}
      {scratchTag && (
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: F.body, fontSize: 16, color: "#4A5361" }}>CONCEPT DRAFT · scratch AI voice (ay re-records)</div>
      )}
    </AbsoluteFill>
  );
};

// music ducks while a VO line plays
const duck = (lines: any[], fr: number) => lines.some((l) => fr >= l.start - 3 && fr < l.start + l.dur + 6);
