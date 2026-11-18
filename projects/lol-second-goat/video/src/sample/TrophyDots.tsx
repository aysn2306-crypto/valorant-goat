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

type Pl = { id: string; name: string; years: string; raw: { trophies: number } };
const ALL = (league as { players: Pl[] }).players;

// x = seasons as a pro (first to last year active), y = trophy points (ay 18 Nov: a real x-axis, like Jxmy's newer charts)
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };
const SMAX = 15;
const XS0 = 300, XS1 = 1700;
const xs = (n: number) => XS0 + ((n - 1) / (SMAX - 1)) * (XS1 - XS0);
const seasons = (p: Pl) => { const y = p.years.split("-"); return Number(y[y.length - 1]) - Number(y[0]) + 1; };
const DOTS = ALL.filter((p) => p.id !== "faker").map((p) => ({ id: p.id, name: p.name, v: p.raw.trophies, n: seasons(p),
  x: xs(seasons(p)) + (["gumayusi", "canyon", "knight", "ruler"].includes(p.id) ? 0 : (hash(p.id) - 0.5) * 70) }));
// where each named label sits relative to its dot, so no two labels meet
const SIDE_OF: Record<string, "left" | "right" | "below"> = { gumayusi: "left", canyon: "left", knight: "below", ruler: "right" };
const FAKER = Math.round(ALL.find((p) => p.id === "faker")!.raw.trophies);
const FAKER_N = seasons(ALL.find((p) => p.id === "faker")!);
const X_FAKER = xs(FAKER_N);
const RULER = ALL.find((p) => p.id === "ruler")!.raw.trophies;
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
const GAPS = [15, 30, 8, 10, 0];
const starts: number[] = [];
let t = 0;
vo.slice(0, 4).forEach((l, i) => { t += GAPS[i]; starts.push(t); t += Math.round(l.sec * 30); });
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
// Jxmy 8 charts (Warriors 399): fast climb ~3.5 s, music cuts as the number is said, 3 s of silence, then a slow zoom out
const CLIMB = 105;
T.land = T.climb + CLIMB;
T.musicCut = T.land;
starts.push(T.land + 2);
T.zoomOut = T.land + 90;
export const DOTS_FRAMES = T.zoomOut + 75 + 120;

// view: the value range [lo, hi] maps to screen y [880, 230]
const Y_LO = 790, Y_HI = 230;
const SPAN_IN = 190;
const view = (f: number): [number, number] => {
  const zi = interpolate(f, [T.zoomIn, T.zoomIn + 40], [0, 1], { ...clamp, easing: ease });
  // slow start, fast middle, slow arrival: the climb should feel long
  const cl = interpolate(f, [T.climb, T.land], [0, 1], { ...clamp, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) });
  const zo = interpolate(f, [T.zoomOut, T.zoomOut + 75], [0, 1], { ...clamp, easing: ease });
  let lo = interpolate(zi, [0, 1], [0, 375]);
  let hi = interpolate(zi, [0, 1], [640, 375 + SPAN_IN]);
  // slow push in while the pack is talked about, so the hold never sits dead still
  const push = interpolate(f, [T.zoomIn + 40, T.climb], [0, 1], clamp);
  lo += 14 * push; hi -= 14 * push;
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
  const step = span < 260 ? 25 : span < 700 ? 100 : 200;
  const grid: number[] = [];
  for (let g = Math.ceil(lo / step) * step; g <= hi + 1; g += step) grid.push(g);

  const fadeIn = interpolate(f, [0, 12], [0, 1], clamp);
  const focus = interpolate(f, [T.names[0] - 6, T.names[0] + 6], [0, 1], clamp);
  const fakerIn = interpolate(f, [T.land - 50, T.land - 38], [0, 1], clamp);
  const fakerLabel = interpolate(f, [T.land - 4, T.land + 6], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 45%, rgba(40,58,92,0.55) 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at 72% 55%, rgba(92,34,40,0.55) 0%, rgba(0,0,0,0) 55%), #0B0B0F", overflow: "hidden" }}>
      {/* axis: white line and big condensed numbers on the left, as in Jxmy's climbs (8 charts, 10:02 to 10:18) */}
      <div style={{ position: "absolute", left: 190, top: 150, width: 3, height: Y_LO - 150 + 33, background: "rgba(237,239,242,0.85)", opacity: fadeIn }} />
      {grid.map((g) => {
        const gy = y(g);
        if (gy < 140 || gy > Y_LO + 20) return null;
        return (
          <div key={g} style={{ position: "absolute", left: 40, width: 130, top: gy - 30, textAlign: "right", fontFamily: F.title, fontSize: 52,
            color: C.text, fontVariantNumeric: "tabular-nums", opacity: fadeIn }}>{g.toLocaleString("en-US")}</div>
        );
      })}

      {DOTS.map((d, i) => {
        const g = interpolate(f, [T.grow + (i % 40) * 1.2, T.grow + (i % 40) * 1.2 + 14], [0, 1], { ...clamp, easing: ease });
        const dy = y(d.v * g);
        if (dy < 120 || dy > Y_LO + 12) return null;
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
                {win && (
                  <div style={{ position: "absolute", left: d.x - 60, top: dy - 62, width: 300, height: 124, borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.9)", opacity: labelO * interpolate(f, [T.winner, T.winner + 10], [0, 1], clamp) * (1 - interpolate(f, [T.zoomOut, T.zoomOut + 20], [0, 1], clamp)) }} />
                )}
                <div style={{ position: "absolute", left: d.x - 28, top: dy - 28, width: 56, height: 56, borderRadius: 28,
                  border: `3px solid ${win ? C.cyan : "rgba(255,255,255,0.9)"}`, opacity: labelO, transform: `scale(${ringS})` }} />
                <div style={{ position: "absolute", whiteSpace: "nowrap", opacity: labelO,
                  ...(SIDE_OF[d.id] === "below" ? { left: d.x - 80, width: 160, textAlign: "center" as const, top: dy + 32 }
                    : SIDE_OF[d.id] === "left" ? { left: d.x - 236, width: 200, textAlign: "right" as const, top: dy - 34 }
                    : { left: d.x + 36, top: dy - 34 }) }}>
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
            <div style={{ position: "absolute", left: X_FAKER - 440, top: fy - 95, width: 560, height: 190, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.9)", opacity: fakerLabel }} />
            <div style={{ position: "absolute", left: X_FAKER - 380, width: 300, textAlign: "right", top: fy - 52, opacity: fakerLabel, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 40, letterSpacing: 0.5, color: C.gold }}>FAKER</div>
              <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 54, color: C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{FAKER.toLocaleString("en-US")}</div>
            </div>
          </>
        );
      })()}

      {/* the gap, after the zoom out (Jxmy: "92 wins between Warriors and the 2nd best team") */}
      {(() => {
        const o = interpolate(f, [T.zoomOut + 80, T.zoomOut + 95], [0, 1], clamp);
        if (o <= 0) return null;
        const a = y(FAKER), b = y(RULER);
        return (
          <div style={{ position: "absolute", left: X_FAKER + 90, top: a, height: b - a, borderLeft: "3px dashed rgba(237,239,242,0.8)", opacity: o }}>
            <div style={{ position: "absolute", left: -420, textAlign: "right", top: (b - a) * 0.42, width: 390, fontFamily: F.body, fontWeight: 700, fontSize: 38,
              color: C.text, lineHeight: 1.25 }}>{(FAKER - Math.round(RULER)).toLocaleString("en-US")} points between Faker and the next best</div>
          </div>
        );
      })()}

      {/* title, top centre */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", opacity: fadeIn * (1 - 0.0 * focus) }}>
        <div style={{ fontFamily: F.title, fontSize: 84, letterSpacing: 2, color: "#ECE6D2", textShadow: "0 0 18px rgba(236,230,210,0.35)" }}>THE TROPHY CABINET</div>
      </div>
      {/* x-axis: seasons as a pro */}
      <div style={{ position: "absolute", left: 190, top: Y_LO + 30, width: 1570, height: 3, background: "rgba(237,239,242,0.85)", opacity: fadeIn }} />
      {Array.from({ length: SMAX }, (_, i) => i + 1).filter((n) => n % 2 === 1).map((n) => (
        <div key={n} style={{ position: "absolute", left: xs(n) - 40, width: 80, top: Y_LO + 40, textAlign: "center", fontFamily: F.title, fontSize: 40,
          color: C.text, opacity: fadeIn }}>{n}</div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: Y_LO + 100, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: fadeIn }}>
        <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SEASONS AS A PRO</div>
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg>
      </div>
      {/* y-axis name */}
      <div style={{ position: "absolute", left: 214, top: 150, display: "flex", alignItems: "center", gap: 14, opacity: fadeIn }}>
        <svg width="30" height="46" viewBox="0 0 46 70"><path d="M23 0 L46 30 L31 30 L31 70 L15 70 L15 30 L0 30 Z" fill={C.text} /></svg>
        <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>TROPHY POINTS</div>
      </div>

      {vo.map((l, i) => (
        <Sequence key={i} from={starts[i]} layout="none"><Audio src={staticFile(l.src)} /></Sequence>
      ))}
      {/* no music: ay supplies the backing track. Keep the cue: bed plays until T.land, silent to T.land + 95, back from T.land + 140 */}
    </AbsoluteFill>
  );
};
