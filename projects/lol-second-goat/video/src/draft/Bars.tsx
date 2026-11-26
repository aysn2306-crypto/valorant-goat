// Two bar charts in Jxmy's shapes, made in our look (dark slate ground, Bebas, one TEAL accent, neutral bars, no gradient).
// HardestBars: Jxmy's ranked vertical bars (video-research/jxmy-graphs/videos/4lbvnNVGd-I/graphs/
//   g08_vbar-ranking_worst-nba-teams-gold-bars-build): ten bars, lowest on the left, rising together from the floor in a
//   quick left-to-right ripple, the value above each bar, a small title top centre, the axis on the right.
//   Data: stills.json events (title difficulty in coin flips, model v13/v14), the ten hardest titles since 2016.
// PriceClimb: Jxmy's ranked horizontal bars with the camera close on the rows (eHZsARuvxfg/graphs/
//   g04_hbar-ranking_box-plus-minus-climb-zoomout): tight on one row at a time, the label inside the bar, the camera
//   moving row to row as each is said, then a pull back to the whole list. Data: model v11+ trophy values.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import S from "../data/stills.json";
import HW from "../data/hardest_worlds.json";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const BAR = "#5E6670";

type Ev = [string, string, string, number, number];
const TEAM: Record<string, string> = { "Bilibili Gaming": "BLG", "Hanwha Life Esports": "HLE", "JD Gaming": "JDG", "Gen.G": "GEN.G", T1: "T1", DRX: "DRX" };
const KIND = (e: Ev) => e[1] === "worlds" ? "WORLDS" : e[1] === "msi" ? "MSI" : e[1] === "dom_LCK" ? (e[0].includes("Summer") ? "LCK SUMMER" : "LCK") : e[1] === "dom_LPL" ? "LPL" : e[1].toUpperCase();

/** cues (frames in the scene): bars rise, T1 lit, BLG lit */
export const HardestBars: React.FC<{ cues: { rise: number; t1: number; blg: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const top = [...(S.events as Ev[])].sort((a, b) => b[4] - a[4]).slice(0, 10).reverse(); // lowest left, hardest right
  const x0 = 250, x1 = 1590, base = 860, vmax = 10, hpx = 560;
  const bw = (x1 - x0) / top.length;
  const H = (v: number) => (v / vmax) * hpx;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>THE HARDEST TITLES SINCE 2016</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>COIN FLIPS IN A ROW A TOP TEAM WOULD NEED TO WIN IT</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* axis on the right, like Jxmy's */}
        <line x1={x1 + 30} x2={x1 + 30} y1={base - hpx - 10} y2={base} stroke={INK} strokeOpacity={0.5} strokeWidth={3} opacity={tO} />
        {[0, 2, 4, 6, 8, 10].map((v) => <g key={v} opacity={tO}>
          <line x1={x0 - 20} x2={x1 + 30} y1={base - H(v)} y2={base - H(v)} stroke={INK} strokeOpacity={v ? 0.07 : 0.5} strokeWidth={v ? 2 : 3} />
          <text x={x1 + 48} y={base - H(v) + 12} fontFamily={BEBAS} fontSize={34} fill={MUTE}>{v}</text></g>)}
        {top.map((e, i) => {
          const k = interpolate(f, [cues.rise + i * 2, cues.rise + i * 2 + 14], [0, 1], { ...clamp, easing: easeOut });
          const isT1 = e[3] === 2024 && e[1] === "worlds", isBLG = e[3] === 2026 && e[1] === "worlds";
          const lit = isT1 ? interpolate(f, [cues.t1, cues.t1 + 8], [0, 1], clamp) : isBLG ? interpolate(f, [cues.blg, cues.blg + 8], [0, 1], clamp) : 0;
          const col = lit > 0.5 ? (isT1 ? TEAL : INK) : BAR;
          const h = H(e[4]) * k, x = x0 + i * bw + bw * 0.14, w = bw * 0.72;
          return (
            <g key={e[0]}>
              <rect x={x} y={base - h} width={w} height={h} fill={col} />
              <text x={x + w / 2} y={base - h - 16} textAnchor="middle" fontFamily={BEBAS} fontSize={lit > 0.5 ? 52 : 40} fill={lit > 0.5 ? col : INK} opacity={k}>{e[4].toFixed(1)}</text>
              <text transform={`translate(${x + w / 2 + 10} ${base + 30}) rotate(-35)`} textAnchor="end" fontFamily={BEBAS} fontSize={30} letterSpacing={1}
                fill={lit > 0.5 ? col : MUTE} opacity={k}>{`${TEAM[e[2]] ?? e[2]} · ${KIND(e)} ${String(e[3]).slice(2)}`}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const PRICES: [string, number][] = [["WORLDS", 100], ["MSI", 56], ["LCK TITLE", 44], ["FIRST STAND", 40], ["LPL TITLE", 35]];

/** rows land on their cue (one per row); the camera sits close on the newest row, then pulls back at `out` */
export const PriceClimb: React.FC<{ cues: number[]; out: number }> = ({ cues, out }) => {
  const f = useCurrentFrame();
  const RH = 150, Y0 = 250, BX = 330, BW = 1240;
  const rowY = (i: number) => Y0 + i * RH;
  // camera: centre y follows the newest row; zoom 1.35 close (Worlds and its 100 still fit), 1 at the end; the title shows before the first row and after the pull back
  let cy = rowY(0) + RH / 2;
  cues.forEach((c, i) => { if (i > 0) { const k = interpolate(f, [c - 4, c + 10], [0, 1], { ...clamp, easing: inOut }); cy += k * RH; } });
  const ko = interpolate(f, [out, out + 26], [0, 1], { ...clamp, easing: inOut });
  const s = 1.35 + (1 - 1.35) * ko;
  const cx = 1020 + (960 - 1020) * ko;
  cy = cy + ((rowY(0) + rowY(cues.length - 1) + RH) / 2 - 110 - cy) * ko;
  const cam = `translate(960px, 540px) scale(${s}) translate(${-cx}px, ${-cy}px)`;
  // ay 23 Nov 17:29: the title stays at the top the WHOLE time the scores scroll (rows pass under a strip of the ground)
  const tO = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <AbsoluteFill style={{ transform: cam, transformOrigin: "0 0" }}>
        {PRICES.map(([name, v], i) => {
          const k = interpolate(f, [cues[i], cues[i] + 12], [0, 1], { ...clamp, easing: easeOut });
          const w = (v / 100) * BW * k, lit = i === 0;
          return (
            <div key={name} style={{ position: "absolute", left: BX, top: rowY(i) + 20, height: RH - 40, width: Math.max(1, w), background: lit ? TEAL : INK,
              opacity: k > 0 ? 1 : 0, display: "flex", alignItems: "center", overflow: "visible" }}>
              <div style={{ paddingLeft: 22, fontFamily: BEBAS, fontSize: 64, letterSpacing: 2, color: "#1B1E25", whiteSpace: "nowrap", opacity: k }}>{name}</div>
              <div style={{ position: "absolute", left: w + 24, fontFamily: BEBAS, fontSize: 84, color: lit ? TEAL : INK, opacity: k }}>{v}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: BX - 4, top: rowY(0), width: 4, height: PRICES.length * RH, background: INK, opacity: 0.6 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 190, overflow: "hidden", opacity: tO }}><Concrete /></div>
      <div style={{ position: "absolute", left: 110, top: 70, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>WHAT EACH TROPHY IS WORTH</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>TROPHY POINTS, A WORLDS TITLE = 100</div>
      </div>
    </AbsoluteFill>
  );
};

// ay 20 Nov 12:35: the hardest Worlds runs, rebuilt on the champion's OWN chance (research/data/hardest_worlds_own_elo.csv:
// each knockout series won at the odds the champion's Elo gave it, multiplied; 2012-13 left out, brackets incomplete).
// Bars = coin flips in a row at those odds (log2 of 1/chance), hardest on the right, the chance written as "1 in N".
const TEAM_SHORT: Record<string, string> = { "Samsung Galaxy": "SSG", "Samsung White": "SSW", "SK Telecom T1": "SKT", "EDward Gaming": "EDG",
  "Invictus Gaming": "IG", "FunPlus Phoenix": "FPX", "DAMWON Gaming": "DWG", "Bilibili Gaming": "BLG" };
// ay 20 Nov 13:10: each team's logo (from the year it won) on top of its bar, like Jxmy's; no coin flips, the axis is the
// champion's chance of winning the title before the knockouts started, so a shorter bar is a harder run. BLG 2026 picked
// out as the 5th hardest. Logos: Liquipedia Commons, lol-second-goat/logos/SOURCES.md (kept in public/_local, not in git).
const LOGO: Record<string, string> = { "DRX 2022": "DRX_allmode.png", "T1 2023": "T1_allmode.png", "T1 2024": "T1_allmode.png", "T1 2025": "T1_allmode.png",
  "Samsung Galaxy 2017": "Samsung_Galaxy_allmode.png", "Bilibili Gaming 2026": "Bilibili_Gaming_2021_allmode.png", "Samsung White 2014": "Samsung_White_Logo.png",
  "SK Telecom T1 2015": "SK_Telecom_T1_allmode.png", "SK Telecom T1 2016": "SK_Telecom_T1_allmode.png", "EDward Gaming 2021": "EDward_Gaming_2017_darkmode.png",
  "Invictus Gaming 2018": "Invictus_Gaming_darkmode.png", "FunPlus Phoenix 2019": "FunPlus_Phoenix_2019_allmode.png", "DAMWON Gaming 2020": "DAMWON_Gaming_allmode.png" };
const HARD_KEEP = { team: "Bilibili Gaming", year: 2026 }; // always picked out (ay: "where is BLG?")
// v20 (25 Nov take: line 24b runs about 25 s on this chart): `notes` stack short lines beside DRX on their words
export const HardestRuns: React.FC<{ cues: { rise: number; lit: { team: string; year: number; at: number }[]; notes?: { at: number; text: string; accent?: boolean }[] } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const rows = [...(HW as [string, number, number, number][])].sort((a, b) => a[2] - b[2]); // hardest (lowest chance) on the left
  const x0 = 250, x1 = 1700, base = 800, vmax = 60, hpx = 440;
  const bw = (x1 - x0) / rows.length, lw = bw * 0.96;
  const H = (v: number) => Math.max(5, (v / vmax) * hpx);
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const pctTxt = (v: number) => (v < 2 ? v.toFixed(1) : String(Math.round(v))) + "%";
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>THE HARDEST WORLDS RUNS</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>EACH CHAMPION'S CHANCE TO WIN THE TITLE, BEFORE THE KNOCKOUTS STARTED · 2014 TO 2026</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0 - 30} x2={x0 - 30} y1={base - hpx - 10} y2={base} stroke={INK} strokeOpacity={0.5} strokeWidth={3} opacity={tO} />
        {[0, 20, 40, 60].map((v) => <g key={v} opacity={tO}>
          <line x1={x0 - 30} x2={x1} y1={base - (v / vmax) * hpx} y2={base - (v / vmax) * hpx} stroke={INK} strokeOpacity={v ? 0.07 : 0.5} strokeWidth={v ? 2 : 3} />
          <text x={x0 - 46} y={base - (v / vmax) * hpx + 12} textAnchor="end" fontFamily={BEBAS} fontSize={34} fill={MUTE}>{v}%</text></g>)}
        <text transform={`translate(${x0 - 130} ${base - hpx / 2}) rotate(-90)`} textAnchor="middle" fontFamily={BEBAS} fontSize={30} letterSpacing={2} fill={MUTE} opacity={tO}>CHANCE TO WIN IT</text>
        <text x={x0} y={base + 150} fontFamily={BEBAS} fontSize={30} letterSpacing={2} fill={MUTE} opacity={tO}>← HARDER</text>
        <text x={x1} y={base + 150} textAnchor="end" fontFamily={BEBAS} fontSize={30} letterSpacing={2} fill={MUTE} opacity={tO}>EASIER →</text>
      </svg>
      {rows.map(([team, year, pct], i) => {
        const k = interpolate(f, [cues.rise + i * 2, cues.rise + i * 2 + 14], [0, 1], { ...clamp, easing: easeOut });
        const L = cues.lit.find((q) => q.team === team && q.year === year);
        const lit = L ? interpolate(f, [L.at, L.at + 8], [0, 1], clamp) : 0;
        const keep = team === HARD_KEEP.team && year === HARD_KEEP.year;
        const first = L === cues.lit[0];
        const col = lit > 0.5 ? (first ? TEAL : INK) : keep ? "#C9CED6" : BAR;
        const h = H(pct) * k, cx = x0 + i * bw + bw / 2, w = bw * 0.62;
        const big = lit > 0.5 || keep;
        return (
          <React.Fragment key={team + year}>
            <div style={{ position: "absolute", left: cx - w / 2, top: base - h, width: w, height: h, background: col }} />
            <Img src={staticFile(`_local/logos/${LOGO[`${team} ${year}`]}`)} style={{ position: "absolute", left: cx - lw / 2, top: base - h - lw * 0.62 - 12,
              width: lw, height: lw * 0.62, objectFit: "contain", opacity: k,
              filter: team === "DAMWON Gaming" ? "brightness(0) invert(0.92)" : undefined }} />
            <div style={{ position: "absolute", left: cx - bw, width: bw * 2, top: base - h - lw * 0.62 - (big ? 66 : 50), textAlign: "center", fontFamily: BEBAS,
              fontSize: big ? 46 : 32, color: lit > 0.5 ? col : keep ? INK : MUTE, opacity: k }}>{pctTxt(pct)}</div>
            <div style={{ position: "absolute", left: cx - bw / 2, width: bw, top: base + 14, textAlign: "center", fontFamily: BEBAS, fontSize: 30, lineHeight: 1,
              color: big ? (lit > 0.5 ? col : INK) : MUTE, opacity: k }}>{`#${i + 1}`}<br /><span style={{ fontSize: 26 }}>{`${TEAM_SHORT[team] ?? team} ${String(year).slice(2)}`}</span></div>
          </React.Fragment>
        );
      })}
      {cues.notes && <div style={{ position: "absolute", left: 360, top: 330, width: 620 }}>
        {cues.notes.map((n, k) => { const o = interpolate(f, [n.at, n.at + 8], [0, 1], { ...clamp, easing: easeOut });
          return <div key={k} style={{ fontFamily: BEBAS, fontSize: 50, lineHeight: 1.15, letterSpacing: 1, color: n.accent ? TEAL : INK, opacity: o,
            transform: `translateY(${(1 - o) * 14}px)`, borderLeft: `5px solid ${n.accent ? TEAL : "rgba(237,239,242,0.35)"}`, paddingLeft: 18, marginBottom: 16 }}>{n.text}</div>; })}
      </div>}
    </AbsoluteFill>
  );
};

// Script v15.1 line 24 (ay 20 Nov 15:28: trophies go straight into what each title is worth): what each Worlds title
// from 2016 is worth in the model. 100 is a normal Worlds; the harder the field a champion beat, the higher it counts
// (data/csv/title_credits.csv "path", 0.95 to 1.14). Bars grow up or down from the 100 line, hardest on the left, the
// winner's logo at the end of each bar, in the trophy gold (style sheet: gold = trophies).
const WORLDS_VALUE: [string, number, number][] = [["T1", 2024, 114.1], ["T1", 2023, 112.2], ["Bilibili Gaming", 2026, 110.3], ["T1", 2025, 108.4],
  ["SK Telecom T1", 2016, 106.6], ["DRX", 2022, 104.7], ["Samsung Galaxy", 2017, 102.8], ["EDward Gaming", 2021, 100.9], ["Invictus Gaming", 2018, 99.1],
  ["FunPlus Phoenix", 2019, 97.2], ["DAMWON Gaming", 2020, 95.3]];
const GOLD = "#E8B04B";
// council 22 Nov: the second Worlds chart (HardestRuns) is cut; DRX lights on this one with a "0.2% chance" callout
type Lit = { team: string; year: number; at: number; until?: number };
export const WorldsValues: React.FC<{ cues: { rise: number; lit: Lit[]; note?: { team: string; year: number; at: number; big: string; small: string } } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const rows = WORLDS_VALUE;
  const x0 = 260, x1 = 1700, mid = 640, ppu = 22; // 1 point = 22 px
  const bw = (x1 - x0) / rows.length, lw = bw * 0.72;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const Y = (v: number) => mid - (v - 100) * ppu;
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>WHAT EACH WORLDS TITLE IS WORTH</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>THE STRONGER THE TEAMS THE CHAMPION BEAT, THE MORE IT COUNTS · 2016 TO 2026</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[90, 95, 105, 110, 115].map((v) => <g key={v} opacity={tO}>
          <line x1={x0 - 30} x2={x1} y1={Y(v)} y2={Y(v)} stroke={INK} strokeOpacity={0.07} strokeWidth={2} />
          <text x={x0 - 46} y={Y(v) + 12} textAnchor="end" fontFamily={BEBAS} fontSize={34} fill={MUTE}>{v}</text></g>)}
        <line x1={x0 - 30} x2={x1} y1={mid} y2={mid} stroke={INK} strokeOpacity={0.6} strokeWidth={3} opacity={tO} />
        <text x={x0 - 46} y={mid + 12} textAnchor="end" fontFamily={BEBAS} fontSize={38} fill={INK} opacity={tO}>100</text>
        <text x={x1 + 20} y={mid + 10} fontFamily={BEBAS} fontSize={28} letterSpacing={1.5} fill={MUTE} opacity={tO}>A NORMAL</text>
        <text x={x1 + 20} y={mid + 40} fontFamily={BEBAS} fontSize={28} letterSpacing={1.5} fill={MUTE} opacity={tO}>WORLDS</text>
        <text x={x0} y={1010} fontFamily={BEBAS} fontSize={30} letterSpacing={2} fill={MUTE} opacity={tO}>← HARDER FIELD</text>
        <text x={x1} y={1010} textAnchor="end" fontFamily={BEBAS} fontSize={30} letterSpacing={2} fill={MUTE} opacity={tO}>EASIER FIELD →</text>
      </svg>
      {rows.map(([team, year, v], i) => {
        const k = interpolate(f, [cues.rise + i * 2, cues.rise + i * 2 + 14], [0, 1], { ...clamp, easing: easeOut });
        const L = cues.lit.find((q) => q.team === team && q.year === year);
        const lit = L ? interpolate(f, [L.at, L.at + 8], [0, 1], clamp) * (L.until ? interpolate(f, [L.until, L.until + 8], [1, 0], clamp) : 1) : 0;
        const up = v >= 100, h = Math.abs(v - 100) * ppu * k, cx = x0 + i * bw + bw / 2, w = bw * 0.56;
        const col = lit > 0.5 ? GOLD : "rgba(232,176,75,0.38)";
        const top = up ? mid - h : mid, end = up ? mid - h : mid + h;
        return (
          <React.Fragment key={team + year}>
            <div style={{ position: "absolute", left: cx - w / 2, top, width: w, height: Math.max(h, 3), background: col }} />
            <Img src={staticFile(`_local/logos/${LOGO[`${team} ${year}`]}`)} style={{ position: "absolute", left: cx - lw / 2, top: up ? end - lw * 0.62 - 10 : end + 10,
              width: lw, height: lw * 0.62, objectFit: "contain", opacity: k * (lit > 0.5 || !cues.lit.length ? 1 : 0.75),
              filter: team === "DAMWON Gaming" ? "brightness(0) invert(0.92)" : undefined }} />
            <div style={{ position: "absolute", left: cx - bw, width: bw * 2, top: up ? end - lw * 0.62 - (lit > 0.5 ? 72 : 52) : end + lw * 0.62 + 14, textAlign: "center",
              fontFamily: BEBAS, fontSize: lit > 0.5 ? 54 : 34, color: lit > 0.5 ? GOLD : MUTE, opacity: k }}>{Math.round(v)}</div>
            <div style={{ position: "absolute", left: cx - bw / 2, width: bw, top: up ? mid + 14 : mid - 44, textAlign: "center", fontFamily: BEBAS, fontSize: 28,
              color: lit > 0.5 ? INK : MUTE, opacity: k }}>{`${TEAM_SHORT[team] ?? team} ${String(year).slice(2)}`}</div>
          </React.Fragment>
        );
      })}
      {cues.note && (() => { const N = cues.note!, i = rows.findIndex(([t, y]) => t === N.team && y === N.year); if (i < 0) return null;
        const v = rows[i][2], cx = x0 + i * bw + bw / 2, ty = Y(v) - lw * 0.62 - 90; // just above the bar's number
        const k = interpolate(f, [N.at, N.at + 10], [0, 1], { ...clamp, easing: easeOut });
        const bx = 1090, by = 215;
        return <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: k }}>
            <path d={`M ${bx - 10} ${by + 80} C ${bx - 70} ${by + 90}, ${cx + 40} ${ty - 60}, ${cx + 14} ${ty - 6}`} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${cx + 14} ${ty - 6} l -14 -18 M ${cx + 14} ${ty - 6} l 20 -12`} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: bx, top: by, opacity: k, transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: "left center" }}>
            <div style={{ fontFamily: BEBAS, fontSize: 120, lineHeight: 0.9, color: GOLD }}>{N.big}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: INK }}>{N.small}</div>
          </div></>; })()}
    </AbsoluteFill>
  );
};
