import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { D, P } from "../lib/data";
import { clamp, Frame, Photo, pop, prog } from "../lib/ui";

/** Cold open: the new world champions. */
export const WorldsCard: React.FC<{ team: string; ids: string[]; score: string; opp: string; place: string; date: string; mvp: string; tTeam?: number; tScore?: number; tMvp?: number }> = ({
  team, ids, score, opp, place, date, mvp, tTeam = 10, tScore = 40, tMvp = 70,
}) => {
  const f = useCurrentFrame();
  const a = prog(f, 0, 14);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.body, fontSize: 32, letterSpacing: 8, color: C.muted, opacity: a }}>
        WORLDS 2026 · {place.toUpperCase()} · {date.toUpperCase()}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F.title, fontSize: 150, color: C.gold, opacity: prog(f, tTeam, tTeam + 12) }}>
        {team.toUpperCase()}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 36 }}>
        {ids.map((id, i) => {
          const s = pop(f, tTeam + 8 + i * 4);
          const isMvp = id === mvp && f >= tMvp;
          return (
            <div key={id} style={{ transform: `scale(${s * (isMvp ? 1 + 0.08 * pop(f, tMvp) : 1)})`, textAlign: "center" }}>
              <Photo id={id} size={230} ring={isMvp ? C.gold : "rgba(237,239,242,0.25)"} dim={f >= tMvp && !isMvp ? 0.45 : 0} />
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: isMvp ? C.gold : C.text, marginTop: 10 }}>{P(id).name}</div>
              <div style={{ fontFamily: F.body, fontSize: 20, color: C.muted }}>{P(id).role}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 64, color: C.text, opacity: prog(f, tScore, tScore + 10) }}>
        {score} <span style={{ color: C.muted, fontWeight: 400 }}>vs</span> {opp}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: F.body, fontWeight: 600, fontSize: 40, color: C.gold, opacity: prog(f, tMvp, tMvp + 10) }}>
        Finals MVP: {P(mvp).name}</div>
    </AbsoluteFill>
  );
};

/** Faker's six Worlds titles, then the empty "#2 ?" slot. */
export const FakerSix: React.FC<{ years: number[]; t0?: number; tSlot?: number }> = ({ years, t0 = 20, tSlot = 90 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", left: 140, top: 140, transform: `scale(${pop(f, 0)})`, transformOrigin: "0 0" }}>
        <Photo id="faker" size={330} ring={C.gold} />
        <div style={{ fontFamily: F.title, fontSize: 90, color: C.text, marginTop: 14 }}>FAKER</div>
        <div style={{ fontFamily: F.body, fontSize: 28, color: C.muted }}>T1 · Mid · {P("faker").years}</div>
      </div>
      <div style={{ position: "absolute", left: 620, top: 200, display: "grid", gridTemplateColumns: "repeat(3, 330px)", gap: 30 }}>
        {years.map((y, i) => {
          const s = pop(f, t0 + i * 8);
          return (
            <div key={y} style={{ transform: `scale(${s})`, height: 200, background: "rgba(245,184,61,0.08)", border: `2px solid ${C.gold}`, borderRadius: 18,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: F.title, fontSize: 90, color: C.gold, lineHeight: 1 }}>{y}</div>
              <div style={{ fontFamily: F.body, fontSize: 24, color: C.text, marginTop: 6 }}>World Champion</div>
            </div>
          );
        })}
      </div>
      {f >= tSlot && (
        <div style={{ position: "absolute", left: 620, top: 700, width: 1050, height: 220, border: `3px dashed ${C.muted}`, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 40, opacity: prog(f, tSlot, tSlot + 12) }}>
          <div style={{ fontFamily: F.title, fontSize: 130, color: C.text }}>#2</div>
          <div style={{ fontFamily: F.title, fontSize: 130, color: C.muted }}>?</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Trophy-weight slider: the top 3 at each trophy weight, from data.sweep. */
export const TrophySlider: React.FC<{ from: number; to: number; t0: number; t1: number; real: number; chapter?: string; marks?: number[] }> = ({ from, to, t0, t1, real, chapter, marks = [] }) => {
  const f = useCurrentFrame();
  const w = Math.round(interpolate(f, [t0, t1], [from, to], clamp));
  const row = D.sweep.find((s) => s.w === w) ?? D.sweep[0];
  const L = 300, R = 1620;
  const X = (v: number) => L + (v / 60) * (R - L);
  return (
    <Frame title="How much should trophies count?" sub="the same 15 categories; only the trophy weight changes, the rest share what's left" chapter={chapter}>
      <div style={{ position: "absolute", left: L, top: 300, width: R - L, height: 8, background: "#252D3A", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: L, top: 300, width: X(w) - L, height: 8, background: C.gold, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: X(w) - 20, top: 284, width: 40, height: 40, borderRadius: 20, background: C.gold }} />
      <div style={{ position: "absolute", left: X(w) - 100, top: 220, width: 200, textAlign: "center", fontFamily: F.title, fontSize: 56, color: C.gold }}>{w}%</div>
      <div style={{ position: "absolute", left: X(real) - 1, top: 330, height: 40, borderLeft: `2px dashed ${C.text}` }} />
      <div style={{ position: "absolute", left: X(real) - 140, top: 372, width: 280, textAlign: "center", fontFamily: F.body, fontSize: 20, color: C.text }}>our weight: {real}%</div>
      {[0, 10, 20, 30, 40, 50, 60].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v) - 30, top: 330, width: 60, textAlign: "center", fontFamily: F.body, fontSize: 18, color: C.muted }}>{v}</div>
      ))}
      <div style={{ position: "absolute", left: 300, top: 470, display: "flex", gap: 50 }}>
        {row.top.slice(0, 3).map(([id, sc], i) => (
          <div key={id + i} style={{ display: "flex", alignItems: "center", gap: 22, width: 420 }}>
            <div style={{ fontFamily: F.title, fontSize: 80, color: i === 0 ? C.gold : C.muted }}>{i + 1}</div>
            <Photo id={id} size={150} ring={i === 0 ? C.gold : undefined} />
            <div>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 38, color: C.text }}>{P(id).name}</div>
              <div style={{ fontFamily: F.body, fontSize: 24, color: C.muted }}>{sc.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
