import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Photo, clamp, ease } from "../lib/ui";
import league from "../data/league.json";
import vo from "../data/dots_vo.json";

// Trophy cabinet as a dot chart (ay 18 Nov, Jxmy "8 charts" pattern): every player is a dot, names on a few.
// Zoom in on the top of the pack, name the nominees and the winner (Ruler), then "here's Faker, by the way":
// the music cuts, the axis climbs through empty space to one dot, then the chart zooms out to show the gap.
// The axis rescales; dots keep their size. Nothing in the bottom 12%. No narration on screen.

type Pl = { id: string; name: string; raw: { trophies: number } };
const ALL = (league as { players: Pl[] }).players;

// deterministic spread across the width
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };
const X0 = 300, X1 = 1700;
const DOTS = ALL.filter((p) => p.id !== "faker").map((p) => ({ id: p.id, name: p.name, v: p.raw.trophies, x: X0 + hash(p.id) * (X1 - X0) }));
// the top of the pack gets even spacing so names never collide
{
  const top = DOTS.filter((d) => d.v >= 360).sort((a, b) => a.x - b.x);
  // nominees get fixed, well separated spots; the rest of the top pack fills the gaps
  const FIX: Record<string, number> = { gumayusi: 420, knight: 780, ruler: 1240, canyon: 1560 };
  const rest = top.filter((d) => !(d.id in FIX));
  const free = [340, 520, 640, 900, 1000, 1120, 1360, 1460, 1660, 1720];
  rest.forEach((d, i) => { d.x = free[i % free.length]; });
  top.forEach((d) => { if (d.id in FIX) d.x = FIX[d.id]; });
}
const FAKER = Math.round(ALL.find((p) => p.id === "faker")!.raw.trophies);
const X_FAKER = 1100;
// colour by value: red (nothing won) to orange, yellow, green (top of the pack); gold is kept for Faker
const STOPS: [number, number[]][] = [[0, [232, 57, 43]], [150, [242, 120, 40]], [330, [232, 205, 58]], [500, [92, 190, 80]]];
const heat = (v: number) => {
  let i = 0; while (i < STOPS.length - 2 && v > STOPS[i + 1][0]) i++;
  const [a, ca] = STOPS[i]; const [b, cb] = STOPS[i + 1];
  const k = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k)).join(",")})`;
};
const NOMINEES = ["knight", "canyon", "gumayusi", "ruler"];
const SIDE = ["keria", "bin", "oner", "zeus", "chovy"];

// timeline from the scratch VO lengths
const GAPS = [15, 30, 8, 10];
const starts: number[] = [];
let t = 0;
vo.forEach((l, i) => { t += GAPS[i]; starts.push(t); t += Math.round(l.sec * 30); });
const at = (line: number, word: string) => {
  const text = vo[line].text;
  return starts[line] + Math.round((text.indexOf(word) / text.length) * vo[line].sec * 30 * 0.92);
};
const T = {
  grow: starts[0] + 20,
  zoomIn: starts[0] + Math.round(vo[0].sec * 30) - 10,
  names: NOMINEES.map((id) => at(1, ALL.find((p) => p.id === id)!.name)),
  winner: at(2, "Ruler"),
  musicCut: at(3, "Faker") - 6,
  climb: starts[3] + Math.round(vo[3].sec * 30) + 4,
  land: 0,
  zoomOut: 0,
};
const CLIMB = 150;
T.land = T.climb + CLIMB;
T.zoomOut = T.land + 50;
export const DOTS_FRAMES = T.zoomOut + 60 + 90;

// view: the value range [lo, hi] maps to screen y [880, 230]
const Y_LO = 840, Y_HI = 230;
const SPAN_IN = 190;
const view = (f: number): [number, number] => {
  const zi = interpolate(f, [T.zoomIn, T.zoomIn + 40], [0, 1], { ...clamp, easing: ease });
  // slow start, fast middle, slow arrival: the climb should feel long
  const cl = interpolate(f, [T.climb, T.land], [0, 1], { ...clamp, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) });
  const zo = interpolate(f, [T.zoomOut, T.zoomOut + 45], [0, 1], { ...clamp, easing: ease });
  let lo = interpolate(zi, [0, 1], [0, 375]);
  let hi = interpolate(zi, [0, 1], [640, 375 + SPAN_IN]);
  const top = FAKER + 45;
  lo += cl * (top - SPAN_IN - 375);
  hi += cl * (top - (375 + SPAN_IN));
  lo = interpolate(zo, [0, 1], [lo, 0]);
  hi = interpolate(zo, [0, 1], [hi, 1250]);
  return [lo, hi];
};

export const TrophyDots: React.FC = () => {
  const f = useCurrentFrame();
  const [lo, hi] = view(f);
  const y = (v: number) => Y_LO + ((v - lo) / (hi - lo)) * (Y_HI - Y_LO);
  const span = hi - lo;
  const step = span < 260 ? 50 : span < 700 ? 100 : 200;
  const grid: number[] = [];
  for (let g = Math.ceil(lo / step) * step; g <= hi + 1; g += step) grid.push(g);

  const fadeIn = interpolate(f, [0, 12], [0, 1], clamp);
  const focus = interpolate(f, [T.names[0] - 6, T.names[0] + 6], [0, 1], clamp);
  const fakerIn = interpolate(f, [T.land - 50, T.land - 38], [0, 1], clamp);
  const fakerLabel = interpolate(f, [T.land - 4, T.land + 6], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1C1A22 0%, #0D0C10 70%, #060507 100%)", overflow: "hidden" }}>
      {/* faint values down the middle, like the reference star fields */}
      {grid.map((g) => {
        const gy = y(g);
        if (gy < 150 || gy > 900) return null;
        return (
          <div key={g} style={{ position: "absolute", left: 860, width: 200, top: gy - 22, textAlign: "center", fontFamily: F.title, fontSize: 40,
            color: "rgba(237,239,242,0.13)", fontVariantNumeric: "tabular-nums", opacity: fadeIn }}>{g.toLocaleString("en-US")}</div>
        );
      })}

      {DOTS.map((d, i) => {
        const g = interpolate(f, [T.grow + (i % 40) * 1.2, T.grow + (i % 40) * 1.2 + 14], [0, 1], { ...clamp, easing: ease });
        const dy = y(d.v * g);
        if (dy < 120 || dy > 1000) return null;
        const n = NOMINEES.indexOf(d.id);
        const named = n >= 0 && f >= T.names[n] - 2;
        const win = d.id === "ruler" && f >= T.winner - 2;
        const r = 11;
        const op = g * (n >= 0 ? 1 : 1 - 0.5 * focus);
        const out = d.id === "ruler" ? 0 : interpolate(f, [T.zoomOut, T.zoomOut + 20], [0, 1], clamp);
        const labelO = (1 - out) * (named ? interpolate(f, [T.names[n] - 2, T.names[n] + 6], [0, 1], clamp) : 0);
        const ringS = 1 + 0.25 * (1 - labelO);
        return (
          <React.Fragment key={d.id}>
            <div style={{ position: "absolute", left: d.x - r, top: dy - r, width: r * 2, height: r * 2, borderRadius: r, background: heat(d.v),
              boxShadow: `0 0 ${r}px ${heat(d.v)}`, opacity: op }} />
            {labelO > 0 && (
              <>
                <div style={{ position: "absolute", left: d.x - 28, top: dy - 28, width: 56, height: 56, borderRadius: 28,
                  border: `3px solid ${win ? C.cyan : "rgba(255,255,255,0.9)"}`, opacity: labelO, transform: `scale(${ringS})` }} />
                <div style={{ position: "absolute", left: d.x + 36, top: dy - 34, opacity: labelO, whiteSpace: "nowrap" }}>
                  <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 24, letterSpacing: 0.5, color: win ? C.cyan : C.text }}>{d.name.toUpperCase()}</div>
                  <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 34, color: C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(d.v)}</div>
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* Faker: one face, far above everyone */}
      {(() => {
        const fy = y(FAKER);
        if (fy < 60 || fy > 1000) return null;
        const s = 0.6 + 0.4 * fakerIn;
        return (
          <>
            <div style={{ position: "absolute", left: X_FAKER - 60, top: fy - 60, opacity: fakerIn, transform: `scale(${s})`,
              filter: `drop-shadow(0 0 24px ${C.gold})` }}>
              <Photo id="faker" size={120} round ring={C.gold} />
            </div>
            <div style={{ position: "absolute", left: X_FAKER - 120, top: fy - 95, width: 560, height: 190, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.9)", opacity: fakerLabel }} />
            <div style={{ position: "absolute", left: X_FAKER + 80, top: fy - 52, opacity: fakerLabel, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 40, letterSpacing: 0.5, color: C.gold }}>FAKER</div>
              <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 54, color: C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{FAKER.toLocaleString("en-US")}</div>
            </div>
          </>
        );
      })()}

      {/* title, top centre */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", opacity: fadeIn * (1 - 0.0 * focus) }}>
        <div style={{ fontFamily: F.title, fontSize: 84, letterSpacing: 2, color: "#ECE6D2", textShadow: "0 0 18px rgba(236,230,210,0.35)" }}>THE TROPHY CABINET</div>
      </div>
      {/* axis name with a big arrow, bottom right, above the YouTube bar */}
      <div style={{ position: "absolute", right: 110, top: 880, display: "flex", alignItems: "center", gap: 18, opacity: fadeIn }}>
        <div style={{ fontFamily: F.title, fontSize: 46, letterSpacing: 1.5, color: C.text }}>TROPHY POINTS</div>
        <svg width="46" height="70" viewBox="0 0 46 70"><path d="M23 0 L46 30 L31 30 L31 70 L15 70 L15 30 L0 30 Z" fill={C.text} /></svg>
      </div>

      {vo.map((l, i) => (
        <Sequence key={i} from={starts[i]} layout="none"><Audio src={staticFile(l.src)} /></Sequence>
      ))}
      {/* music bed is a placeholder slot: the track gets picked from the reference study (instrumental only) */}
    </AbsoluteFill>
  );
};
