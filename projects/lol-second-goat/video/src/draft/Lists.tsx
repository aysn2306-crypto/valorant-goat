// Three Jxmy shapes in our look (Concrete ground, Bebas, one TEAL accent, neutral elsewhere, no gradient or glow).
// StackedLines: Jxmy's small stacked text card (video-research/jxmy-graphics/videos/l38FEWdJnhg/graphs/
//   x03_text-card_play-not-possession-and-definition): a few short lines, centred, one at a time, on a plain ground.
// PillBars: Jxmy's tall pill bars with the player standing at the foot of each (jxmy-graphs/videos/eatF7QHwga4/graphs/
//   g08_vbar-compare_wins-contributed): rounded tops, the value inside the top, a side list beside it.
//   Data: research/league-v14.json boards.big_stage (the big-stage half alone, 0 to 100).
// TitleList: Jxmy's year list with drawn arrows from a note on the left (jxmy-graphs/videos/GPH4nK5sQ-8/graphs/
//   g09_timeline-list_back-to-back-mvps-arrows). Data: stills.json titleTimeline (Peanut) and the title events.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const BAR = "#5E6670";
const GROUND = "#1B1E25";

/** lines appear one by one on their cue; `lift` moves the block up so a later line has room */
export const StackedLines: React.FC<{ lines: { text: string; at: number; accent?: boolean; gap?: number }[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const LH = 112;
  let y = 0;
  const ys = lines.map((l) => { y += l.gap ?? 0; const v = y; y += LH; return v; });
  // the block stays centred on the lines shown so far
  let shown = 0;
  lines.forEach((l, i) => { shown += interpolate(f, [l.at - 2, l.at + 10], [0, 1], { ...clamp, easing: inOut }) * (i === 0 ? 0 : LH + (l.gap ?? 0)); });
  const top = 540 - LH / 2 - shown / 2;
  return (
    <AbsoluteFill>
      <Concrete />
      {lines.map((l, i) => {
        const k = interpolate(f, [l.at, l.at + 8], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: top + ys[i], height: LH, textAlign: "center", fontFamily: BEBAS, fontSize: 96,
            letterSpacing: 4, lineHeight: `${LH}px`, color: l.accent ? TEAL : INK, opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>{l.text}</div>
        );
      })}
    </AbsoluteFill>
  );
};

export const BIG_STAGE: { id: string; name: string; v: number; overall: number }[] = [
  // model v15.1 c_big_stage (play and big series won): Knight, then Faker
  { id: "knight", name: "KNIGHT", v: 100, overall: 2 }, { id: "faker", name: "FAKER", v: 93.7, overall: 1 },
  { id: "bin", name: "BIN", v: 91.4, overall: 8 }, { id: "keria", name: "KERIA", v: 88.7, overall: 5 },
  { id: "zeus", name: "ZEUS", v: 88.4, overall: 7 }];

/** cues: rise (bars grow), lit (the first bar turns teal), side (the side list slides in) */
export const PillBars: React.FC<{ cues: { rise: number; lit: number; side: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const x0 = 200, x1 = 1270, base = 930, hpx = 600, vmax = 100;
  const gw = (x1 - x0) / BIG_STAGE.length, bw = 132;
  const H = (v: number) => (v / vmax) * hpx;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const lit = interpolate(f, [cues.lit, cues.lit + 8], [0, 1], clamp);
  const sk = interpolate(f, [cues.side, cues.side + 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: x0 - 40, top: 60, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>BEST ON THE BIG STAGE</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>PLAY AND SERIES WON IN PLAYOFFS, FINALS, WORLDS AND MSI, 0 TO 100</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0 - 40} x2={x0 - 40} y1={base - hpx - 20} y2={base} stroke={INK} strokeOpacity={0.5} strokeWidth={3} opacity={tO} />
        {[0, 25, 50, 75, 100].map((v) => <g key={v} opacity={tO}>
          <line x1={x0 - 40} x2={x1} y1={base - H(v)} y2={base - H(v)} stroke={INK} strokeOpacity={v ? 0.07 : 0.5} strokeWidth={v ? 2 : 3} />
          <text x={x0 - 58} y={base - H(v) + 11} textAnchor="end" fontFamily={BEBAS} fontSize={32} fill={MUTE}>{v}</text></g>)}
      </svg>
      {BIG_STAGE.map((p, i) => {
        const k = interpolate(f, [cues.rise + i * 3, cues.rise + i * 3 + 18], [0, 1], { ...clamp, easing: easeOut });
        const h = H(p.v) * k, cx = x0 + gw * (i + 0.5), first = i === 0;
        const col = first && lit > 0.5 ? TEAL : BAR;
        return (
          <React.Fragment key={p.id}>
            <div style={{ position: "absolute", left: cx - bw / 2, top: base - h, width: bw, height: h, background: col, borderRadius: `${bw / 2}px ${bw / 2}px 0 0` }} />
            <div style={{ position: "absolute", left: cx - bw / 2, width: bw, top: base - h + 26, textAlign: "center", fontFamily: BEBAS, fontSize: 58,
              color: first && lit > 0.5 ? GROUND : INK, opacity: k }}>{p.v.toFixed(p.v === 100 ? 0 : 1)}</div>
            {/* the player stands ON the axis line at the foot of the bar, like Jxmy's (ay 20 Nov 15:28: they used to float above it) */}
            <Img src={staticFile(`players/${p.id}.png`)} style={{ position: "absolute", left: cx - 95, top: base - 190 - 1.5, width: 190, height: 190, objectFit: "cover", objectPosition: "50% 100%",
              opacity: k, filter: first && lit > 0.5 ? undefined : "grayscale(0.35)" }} />
            <div style={{ position: "absolute", left: cx - gw / 2, width: gw, top: base + 12, textAlign: "center", fontFamily: BEBAS, fontSize: 40, letterSpacing: 2,
              color: first && lit > 0.5 ? TEAL : INK, opacity: k }}>{p.name}</div>
          </React.Fragment>
        );
      })}
      {/* side list: where each sits in the whole ranking */}
      <div style={{ position: "absolute", left: 1400, top: 200, width: 400, height: 790, background: "#23272F", opacity: sk, transform: `translateX(${(1 - sk) * 60}px)` }}>
        <div style={{ padding: "26px 0 6px", textAlign: "center", fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: MUTE }}>RANK IN THE WHOLE MODEL</div>
        {BIG_STAGE.map((p, i) => {
          const first = i === 0;
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", height: 138, padding: "0 36px" }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `3px solid ${first ? TEAL : "#4A515C"}` }}>
                <Img src={staticFile(`players/${p.id}.png`)} style={{ width: 96, height: 96, objectFit: "cover" }} />
              </div>
              <div style={{ marginLeft: 28, fontFamily: BEBAS, fontSize: 76, color: first ? TEAL : INK }}>#{p.overall}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

type Row = { year: number; team: string; title: string };
export const PEANUT: Row[] = [
  { year: 2016, team: "ROX TIGERS", title: "LCK SUMMER" },
  { year: 2017, team: "SK TELECOM T1", title: "LCK SPRING" },
  { year: 2017, team: "SK TELECOM T1", title: "MSI" },
  { year: 2018, team: "KINGZONE DRAGONX", title: "LCK SPRING" },
  { year: 2022, team: "GEN.G", title: "LCK SUMMER" },
  { year: 2023, team: "GEN.G", title: "LCK SPRING" },
  { year: 2023, team: "GEN.G", title: "LCK SUMMER" },
  { year: 2024, team: "HANWHA LIFE", title: "LCK SUMMER" },
  { year: 2025, team: "HANWHA LIFE", title: "LCK CUP" },
  { year: 2025, team: "HANWHA LIFE", title: "FIRST STAND" },
];

/** cues: rows (list drops in), arrows (note and arrows to each first title with a new team), count (5 TEAMS) */
export const TitleList: React.FC<{ cues: { rows: number; arrows: number; count: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const LX = 900, Y0 = 150, RH = 84;
  const firsts = PEANUT.map((r, i) => i === 0 || PEANUT[i - 1].team !== r.team);
  let n = 0;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const ck = interpolate(f, [cues.count, cues.count + 10], [0, 1], { ...clamp, easing: easeOut });
  const noteX = 330, noteY = 540;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 110, top: 60, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>PEANUT'S TITLES</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>EVERY TROPHY, BY YEAR</div>
      </div>
      {PEANUT.map((r, i) => {
        const k = interpolate(f, [cues.rows + i * 2, cues.rows + i * 2 + 10], [0, 1], { ...clamp, easing: easeOut });
        const isNew = firsts[i];
        if (isNew) n++;
        const lit = isNew && f >= cues.arrows + (n - 1) * 3 + 8;
        return (
          <div key={i} style={{ position: "absolute", left: LX, top: Y0 + i * RH, height: RH, display: "flex", alignItems: "center", opacity: k,
            transform: `translateY(${(1 - k) * -14}px)` }}>
            <div style={{ width: 120, fontFamily: BEBAS, fontSize: 52, color: MUTE }}>{r.year}</div>
            <div style={{ width: 470, fontFamily: BEBAS, fontSize: 52, letterSpacing: 1, color: lit ? TEAL : INK }}>{r.team}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 1, color: MUTE }}>{r.title}</div>
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {(() => {
          let m = 0;
          return PEANUT.map((r, i) => {
            if (!firsts[i]) return null;
            const j = m++;
            const p = interpolate(f, [cues.arrows + j * 3, cues.arrows + j * 3 + 12], [0, 1], { ...clamp, easing: inOut });
            const sx = noteX + 330, sy = noteY + 10, ex = LX - 24, ey = Y0 + i * RH + RH / 2;
            const qx = (sx + ex) / 2 - 40, qy = (sy + ey) / 2 + (ey < sy ? -30 : 30);
            const len = 700;
            // arrowhead pointing along the last stretch of the curve
            const ang = Math.atan2(ey - qy, ex - qx);
            const ah = (a: number) => `${ex - 22 * Math.cos(ang + a)},${ey - 22 * Math.sin(ang + a)}`;
            return (
              <g key={i}>
                <path d={`M${sx},${sy} Q${qx},${qy} ${ex},${ey}`} fill="none" stroke={INK} strokeWidth={4} strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
                <polyline points={`${ah(0.45)} ${ex},${ey} ${ah(-0.45)}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.95 ? 1 : 0} />
              </g>
            );
          });
        })()}
      </svg>
      <div style={{ position: "absolute", left: noteX - 230, top: noteY - 40, width: 560, textAlign: "right", fontFamily: BEBAS, fontSize: 52, letterSpacing: 2, color: INK,
        opacity: interpolate(f, [cues.arrows - 6, cues.arrows], [0, 1], clamp) }}>A NEW TEAM</div>
      <div style={{ position: "absolute", left: noteX - 230, top: noteY + 30, width: 560, textAlign: "right", fontFamily: BEBAS, fontSize: 150, lineHeight: 1, color: TEAL,
        opacity: ck, transform: `scale(${0.9 + 0.1 * ck})`, transformOrigin: "100% 0" }}>5 TEAMS</div>
    </AbsoluteFill>
  );
};
