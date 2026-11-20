// New graphics for the full draft (19 Nov night): the 2025 pyramid twist, two Fakers in the top 100, dream seasons,
// the Monte Carlo rolls and the trophy gap. Every cue is a frame inside the scene, computed from ay's word times.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { P } from "../lib/data";
import { CREAM } from "../stills/kit";
import DD from "./draftData.json";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const idOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const BOXED = new Set(["jankos", "cabochard", "cyanide", "lilballz", "shushei"]);

const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 40%, rgba(70,80,100,0.35) 0%, rgba(0,0,0,0) 60%), #0D0F14", overflow: "hidden" }}>{children}</AbsoluteFill>
);

const Figure: React.FC<{ id: string; h: number; ring: string; rank: number; nameColor?: string; glow?: number }> = ({ id, h, ring, rank, nameColor = C.text, glow = 0 }) => {
  const w = Math.round(h * 0.86);
  const p = P(id);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: `drop-shadow(0 0 ${2 + 22 * glow}px ${glow ? ring : "rgba(0,0,0,0.6)"})` }}>
        {p.photo && <Img src={staticFile(p.photo)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%",
          ...(BOXED.has(id) ? { WebkitMaskImage: "radial-gradient(ellipse 48% 62% at 50% 42%, #000 70%, transparent 100%)" } : {}) }} />}
      </div>
      <div style={{ position: "absolute", right: -8, top: 4, padding: "0 8px", height: 32, borderRadius: 12, background: ring, fontFamily: F.title, fontSize: 26, color: "#0B0B0F", display: "flex", alignItems: "center" }}>#{rank}</div>
      <div style={{ position: "absolute", left: w / 2 - 120, width: 240, bottom: 4, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 24, letterSpacing: 1,
        color: nameColor, textShadow: "0 0 6px #0B0B0F, 0 0 12px #0B0B0F", whiteSpace: "nowrap" }}>{p.name.toUpperCase()}</div>
    </div>
  );
};

// ------------------------------------------------------------------ the 2025 pyramid twist (top three tiers)
// model v15.1 (data/csv/draft_scores_cut2025.csv, draft_scores.csv, draft_scores_geng_wins.csv)
export const ORDER_2025 = ["faker", "chovy", "ruler", "knight", "keria", "peanut", "canyon", "oner", "zeus", "xiaohu"]; // v15.3
export const ORDER_2026 = ["faker", "knight", "chovy", "ruler", "keria", "canyon", "zeus", "bin", "peanut", "viper"];
export const ORDER_GENG = ["faker", "chovy", "knight", "ruler", "canyon", "keria", "zeus", "peanut", "bin", "kiin"];
/** states: from frame `at`, the pyramid shows `order` (top 10) under the label */
export const PyramidTwist: React.FC<{ states: { at: number; order: string[]; label: string }[]; glowIds?: string[] }> = ({ states, glowIds = [] }) => {
  const f = useCurrentFrame();
  const cx = 960, top = 120, base = 1010, half = 920;
  const cuts = [top, 390, 680, base];
  const hw = (y: number) => ((y - top) / (base - top)) * half;
  const figH = [220, 230, 200];
  const slot = (rank: number) => {
    const tier = rank === 0 ? 0 : rank <= 2 ? 1 : 2;
    const j = tier === 0 ? 0 : tier === 1 ? rank - 1 : rank - 3;
    const n = [1, 2, 7][tier], gap = [0, 420, 236][tier];
    return { tier, x: cx + (j - (n - 1) / 2) * gap, floor: cuts[tier + 1] - 4 };
  };
  let si = 0;
  states.forEach((s, i) => { if (f >= s.at) si = i; });
  const cur = states[si], prev = states[Math.max(0, si - 1)];
  const t = si === 0 ? 1 : interpolate(f, [cur.at, cur.at + 30], [0, 1], { ...clamp, easing: inOut });
  const ids = Array.from(new Set([...prev.order, ...cur.order]));
  const lab = interpolate(f, [cur.at, cur.at + 8], [0, 1], clamp);
  return (
    <Ground>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><linearGradient id="bandT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B4352" /><stop offset="1" stopColor="#262C37" /></linearGradient></defs>
        {[0, 1, 2].map((i) => {
          const y0 = cuts[i] + (i ? 6 : 0), y1 = cuts[i + 1];
          return <polygon key={i} points={`${cx - hw(y0)},${y0} ${cx + hw(y0)},${y0} ${cx + hw(y1)},${y1} ${cx - hw(y1)},${y1}`} fill="url(#bandT)" stroke="rgba(237,239,242,0.18)" strokeWidth={2} />;
        })}
      </svg>
      {ids.map((id) => {
        const a = prev.order.indexOf(id), b = cur.order.indexOf(id);
        const A = a >= 0 ? slot(a) : null, B = b >= 0 ? slot(b) : null;
        const from = A ?? B!, to = B ?? A!;
        const x = from.x + (to.x - from.x) * t, floor = from.floor + (to.floor - from.floor) * t;
        const o = A && B ? 1 : A ? 1 - t : t;
        const rank = (t < 0.5 ? a : b) + 1 || (b + 1) || (a + 1);
        const tier = (t < 0.5 ? from : to).tier;
        const h = figH[from.tier] + (figH[to.tier] - figH[from.tier]) * t;
        const ring = tier === 0 ? C.gold : tier === 1 ? C.cyan : "#E9ECF1";
        const lift = A && B && A.tier !== B.tier ? -Math.sin(t * Math.PI) * 60 : 0;
        const glow = glowIds.includes(id) && si > 0 ? Math.sin(t * Math.PI) : 0;
        return (
          <div key={id} style={{ position: "absolute", left: x - (h * 0.86) / 2, top: floor - h + lift, opacity: o }}>
            <Figure id={id} h={h} ring={ring} rank={rank} nameColor={tier === 1 ? C.cyan : C.text} glow={glow} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 70, top: 70, opacity: lab, lineHeight: 0.95 }}>
        <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 6, color: C.gold }}>LEAGUE G.O.A.T. PYRAMID</div>
        <div style={{ fontFamily: F.title, fontSize: 96, letterSpacing: 2, color: CREAM, whiteSpace: "pre-line" }}>{cur.label}</div>
      </div>
    </Ground>
  );
};

// ------------------------------------------------------------------ two Fakers in the top 100 (bar chart)
const SPLIT = DD.split as unknown as [string, number][];
/** cues: [Faker 2013-19 drops in, Faker 2020-26 drops in] */
export const TwoFakers: React.FC<{ cues: [number, number] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const x0 = 200, x1 = 1820, y0 = 220, y1 = 860, vmin = 40, vmax = 95;
  const Y = (v: number) => y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0);
  const isF = (n: string) => n.startsWith("Faker");
  const others = SPLIT.filter(([n]) => !isF(n));
  const orderA = others.map(([n]) => n);
  const orderB = ["Faker 2013-19", ...orderA];
  const orderC = SPLIT.map(([n]) => n);
  const t1 = interpolate(f, [cues[0], cues[0] + 24], [0, 1], { ...clamp, easing: inOut });
  const t2 = interpolate(f, [cues[1], cues[1] + 24], [0, 1], { ...clamp, easing: inOut });
  const grow = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: easeOut });
  const bw = (x1 - x0) / 100;
  const xOf = (n: string) => {
    const a = orderA.indexOf(n), b = orderB.indexOf(n), c = orderC.indexOf(n);
    const pa = a < 0 ? b : a, pb = b < 0 ? c : b;
    const r = pa + (pb - pa) * t1, r2 = r + (c - pb) * t2;
    return x0 + Math.max(0, r2) * bw;
  };
  const score = Object.fromEntries(SPLIT);
  return (
    <Ground>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[40, 60, 80].map((v) => (
          <g key={v}><line x1={x0} x2={x1} y1={Y(v)} y2={Y(v)} stroke="rgba(237,239,242,0.12)" strokeWidth={2} />
            <text x={x0 - 18} y={Y(v) + 12} textAnchor="end" fill={C.muted} fontFamily={F.title} fontSize={34}>{v}</text></g>
        ))}
        <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        <line x1={x0} x2={x0} y1={y0 - 30} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        {[1, 25, 50, 75, 100].map((r) => <text key={r} x={x0 + (r - 0.5) * bw} y={y1 + 46} textAnchor="middle" fill={C.text} fontFamily={F.title} fontSize={34}>#{r}</text>)}
        <text x={(x0 + x1) / 2} y={y1 + 100} textAnchor="middle" fill={C.text} fontFamily={F.title} fontSize={36} letterSpacing={2}>ALL-TIME RANK, TOP 100</text>
        <text x={x0 - 18} y={y0 - 40} textAnchor="end" fill={C.text} fontFamily={F.title} fontSize={36} letterSpacing={2}>SCORE</text>
        {orderC.map((n) => {
          const fk = isF(n);
          const t = n === "Faker 2013-19" ? t1 : n === "Faker 2020-26" ? t2 : 1;
          if (fk && t <= 0) return null;
          const v = score[n] * (fk ? 1 : grow);
          const h = (Y(vmin) - Y(Math.max(vmin, v)));
          const drop = fk ? (1 - t) * -500 : 0;
          const col = fk ? C.gold : n === "Knight" ? C.cyan : "#4A5361";
          return <rect key={n} x={xOf(n) + 2} y={y1 - h + drop} width={bw - 4} height={h} fill={col} opacity={fk ? Math.min(1, t * 2) : 1} />;
        })}
      </svg>
      {t1 > 0.9 && <Tag x={xOf("Faker 2013-19") + bw / 2} y={Y(score["Faker 2013-19"]) - 20} id="faker" text="FAKER 2013–19" sub="#1" color={C.gold} />}
      {t2 > 0.9 && <Tag x={xOf("Faker 2020-26") + bw / 2} y={Y(score["Faker 2020-26"]) - 20} id="faker" text="FAKER 2020–26" sub={"#" + (orderC.indexOf("Faker 2020-26") + 1)} color={C.gold} />}
      {grow > 0.9 && <Tag x={xOf("Knight") + bw / 2 + 430} y={Y(score["Knight"]) - 10} id="knight" text="KNIGHT" sub={"#" + ((t1 > 0.5 ? orderB : orderA).indexOf("Knight") + 1)} color={C.cyan} small />}
      {grow > 0.9 && <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={xOf("Knight") + bw} y1={Y(score["Knight"]) + 6} x2={xOf("Knight") + bw / 2 + 420} y2={Y(score["Knight"]) - 50} stroke={C.cyan} strokeWidth={3} /></svg>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: F.title, fontSize: 72, color: CREAM, letterSpacing: 2 }}>TWO FAKERS</div>
    </Ground>
  );
};
const Tag: React.FC<{ x: number; y: number; id: string; text: string; sub: string; color: string; small?: boolean }> = ({ x, y, id, text, sub, color, small }) => {
  const s = small ? 70 : 92;
  return (
    <div style={{ position: "absolute", left: x - 6, top: y - s - 10, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: s, height: s, borderRadius: s, overflow: "hidden", boxShadow: `inset 0 0 0 3px ${color}`, background: "#1B212B", position: "relative" }}>
        {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <div style={{ position: "absolute", inset: 0, borderRadius: s, boxShadow: `inset 0 0 0 3px ${color}` }} />
      </div>
      <div>
        <div style={{ fontFamily: F.title, fontSize: small ? 34 : 44, color, lineHeight: 1 }}>{text}</div>
        <div style={{ fontFamily: F.title, fontSize: small ? 30 : 40, color: C.text, lineHeight: 1.1 }}>{sub}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ dream seasons, small multiples
const DREAM = DD.dream as unknown as Record<string, [number, number, number][]>;
/** cues: Knight panel draws season by season from cues[0]; Chovy panel from cues[1] */
export const DreamSeasons: React.FC<{ cues: [number, number] }> = ({ cues }) => {
  return (
    <Ground>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: F.title, fontSize: 72, color: CREAM, letterSpacing: 2 }}>WIN EVERYTHING, EVERY YEAR</div>
      <DreamPanel who="Knight" id="knight" x={90} start={cues[0]} need={3} />
      <DreamPanel who="Chovy" id="chovy" x={990} start={cues[1]} need={4} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: F.body, fontSize: 26, color: C.muted }}>Each season: a Worlds, an MSI and his best league year. Faker plays no more.</div>
    </Ground>
  );
};
const DreamPanel: React.FC<{ who: string; id: string; x: number; start: number; need: number }> = ({ who, id, x, start, need }) => {
  const f = useCurrentFrame();
  const rows = DREAM[who];
  const w = 840, y0 = 260, y1 = 880, px0 = x + 110, px1 = x + w - 40;
  const X = (yr: number) => px0 + ((yr - 2026) / 4) * (px1 - px0);
  const Y = (v: number) => y1 - ((v - 60) / 40) * (y1 - y0);
  const k = interpolate(f, [start, start + 4 * 22], [0, 4], { ...clamp });
  const pts = (col: 1 | 2) => rows.filter((_, i) => i <= Math.ceil(k)).map((r, i) => {
    const frac = Math.min(1, k - (i - 1));
    if (i === 0) return [X(r[0]), Y(r[col])];
    const p = rows[i - 1];
    return [X(p[0] + (r[0] - p[0]) * frac), Y(p[col] + (r[col] - p[col]) * frac)];
  });
  const line = (pp: number[][]) => pp.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const passed = k >= need;
  const o = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[60, 80, 100].map((v) => <g key={v}><line x1={px0} x2={px1} y1={Y(v)} y2={Y(v)} stroke="rgba(237,239,242,0.12)" strokeWidth={2} />
          <text x={px0 - 16} y={Y(v) + 12} textAnchor="end" fill={C.muted} fontFamily={F.title} fontSize={32}>{v}</text></g>)}
        <line x1={px0} x2={px1} y1={y1} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        <line x1={px0} x2={px0} y1={y0 - 20} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        {rows.map((r) => <text key={r[0]} x={X(r[0])} y={y1 + 44} textAnchor="middle" fill={C.text} fontFamily={F.title} fontSize={32}>{r[0]}</text>)}
        <path d={line(pts(2))} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" />
        <path d={line(pts(1))} fill="none" stroke={C.cyan} strokeWidth={7} />
        {passed && <circle cx={X(rows[need][0])} cy={Y(rows[need][1])} r={14} fill={C.cyan} />}
      </svg>
      <div style={{ position: "absolute", left: px0, top: y0 - 110, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: 80, overflow: "hidden", position: "relative", background: "#1B212B", boxShadow: `inset 0 0 0 3px ${C.cyan}` }}>
          {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        <div style={{ fontFamily: F.title, fontSize: 52, color: C.cyan }}>{who.toUpperCase()}</div>
        <div style={{ fontFamily: F.title, fontSize: 52, color: C.text, opacity: passed ? 1 : 0 }}>· {need} SEASONS</div>
      </div>
      <div style={{ position: "absolute", left: X(2026) + 10, top: Y(rows[0][2]) - 52, fontFamily: F.title, fontSize: 34, color: C.gold }}>FAKER</div>
      {passed && <div style={{ position: "absolute", left: Math.min(X(rows[need][0]) - 140, px1 - 300), top: Y(rows[need][1]) - 70, width: 280, textAlign: "center", fontFamily: F.title, fontSize: 40, color: C.cyan }}>PASSES IN {rows[need][0]}</div>}
    </div>
  );
};

// ------------------------------------------------------------------ Monte Carlo rolls
const PARTS6 = ["TROPHIES", "SKILL", "BIG GAMES", "TEAM IMPACT", "LONGEVITY", "RECOGNITION"];
const BASE = [30, 21, 16.3, 14, 10.5, 8.2]; // v15.3 weights
const rr = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
/** ay 20 Nov 14:36: cues: [first roll, time-lapse starts, 1,000 reached]. About ten rolls one by one (so the viewer
 *  sees how a roll moves the weights), then it holds on roll 10, then a time-lapse to 1,000. */
/** cues: [slow rolls start, time-lapse start, time-lapse end]; from = rolls already done before this scene (the roll count
 *  carries on after the cut to the Monte Carlo page) */
export const MonteCarlo: React.FC<{ cues: [number, number, number]; from?: number }> = ({ cues, from = 0 }) => {
  const f = useCurrentFrame();
  const slow = Math.min(10, from + Math.max(0, Math.floor((f - cues[0]) / 20) + (from ? 0 : 1)));
  const fast = f > cues[1] ? interpolate(f, [cues[1], cues[2]], [0, 990], { ...clamp, easing: Easing.inOut(Easing.quad) }) : 0;
  const rolls = f < cues[0] && !from ? 0 : Math.min(1000, Math.round(slow + fast));
  const roll = rolls;
  const bars = BASE.map((b, i) => (roll === 0 ? b : b * (0.7 + 0.6 * rr(roll * 7 + i))));
  const max = 56;
  return (
    <Ground>
      <div style={{ position: "absolute", left: 120, top: 70, fontFamily: F.title, fontSize: 72, color: CREAM, letterSpacing: 2 }}>ROLL THE DICE</div>
      {PARTS6.map((p, i) => (
        <div key={p} style={{ position: "absolute", left: 120, top: 220 + i * 118, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 300, textAlign: "right", fontFamily: F.title, fontSize: 40, color: C.text, letterSpacing: 1 }}>{p}</div>
          <div style={{ width: 560, height: 54, background: "rgba(237,239,242,0.06)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(bars[i] / max) * 100}%`, background: i === 0 ? C.gold : "#8C96A6" }} />
            <div style={{ position: "absolute", left: `${(BASE[i] / max) * 100}%`, top: -8, bottom: -8, width: 3, background: "rgba(237,239,242,0.6)" }} />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 1180, top: 230, width: 640 }}>
        <div style={{ fontFamily: F.title, fontSize: 40, color: C.muted, letterSpacing: 2 }}>ROLLS</div>
        <div style={{ fontFamily: F.title, fontSize: 170, color: CREAM, lineHeight: 1 }}>{rolls.toLocaleString("en-US")}</div>
        {[["faker", "FAKER #1", C.gold], ["mystery", "#2, SAME NAME", C.cyan]].map(([id, lab, col], k) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
            <div style={{ width: 96, height: 96, borderRadius: 96, overflow: "hidden", position: "relative", background: "#1B212B", boxShadow: `inset 0 0 0 3px ${col}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.title, fontSize: 56, color: col }}>
              {id === "faker" ? P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : "?"}
            </div>
            <div>
              <div style={{ fontFamily: F.title, fontSize: 40, color: col }}>{lab}</div>
              <div style={{ fontFamily: F.title, fontSize: 58, color: C.text, lineHeight: 1 }}>{rolls.toLocaleString("en-US")} <span style={{ color: C.muted, fontSize: 40 }}>OF {rolls.toLocaleString("en-US")}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 40, fontFamily: F.body, fontSize: 26, color: C.muted }}>White tick: my weights. Each roll moves every weight up to 30% up or down.</div>
    </Ground>
  );
};


// ------------------------------------------------------------------ Uzi and Bengi, as Jxmy trading cards
import { Cutout, Flip, RED, BLUE, YEL, TitleBar, Vignette } from "../samples/Samples";
type CardSpec = { id: string; sub: string; flipAt: number; lines: { text: string; at: number; bad?: boolean }[] };
const BigCard: React.FC<{ c: CardSpec; w: number; h: number }> = ({ c, w, h }) => {
  const pad = 16, plateH = 110, photoH = h - pad * 2 - plateH - 10;
  return (
    <div style={{ width: w, height: h, background: RED, borderRadius: 6, position: "relative", overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.62, height: 20, background: CREAM }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.62 + 20, height: 20, background: BLUE }} />
      <div style={{ position: "absolute", left: pad, top: pad, width: w - pad * 2, height: h - pad * 2, borderRadius: 24, border: `8px solid ${YEL}`, background: RED, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: photoH, overflow: "hidden" }}><Cutout id={c.id} w={w - pad * 2 - 16} h={photoH} /></div>
        <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: plateH, borderRadius: 14, background: BLUE, border: `4px solid ${YEL}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F.title, fontSize: 48, color: CREAM, letterSpacing: 1 }}>{P(c.id).name.toUpperCase()}</div>
          <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 20, color: "rgba(236,230,210,0.85)", letterSpacing: 1 }}>{c.sub}</div>
        </div>
      </div>
    </div>
  );
};
export const PlayerCards: React.FC<{ title: string; titleAt: number; cards: CardSpec[]; stamp?: { text: string; at: number; card: number } }> = ({ title, titleAt, cards, stamp }) => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 900], [1, 1.07], clamp);
  const w = 380, h = 560, gap = 800, x0 = 960 - ((cards.length - 1) * gap + 550) / 2;
  return (
    <AbsoluteFill>
      <Vignette bg="#121316" />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <TitleBar text={title} inAt={titleAt} top={70} />
      {cards.map((c, i) => (
        <React.Fragment key={c.id}>
          <div style={{ position: "absolute", left: x0 + i * gap - 60, top: 240 }}><Flip startAt={c.flipAt} w={w} h={h}><BigCard c={c} w={w} h={h} /></Flip></div>
          <div style={{ position: "absolute", left: x0 + i * gap + w - 100, top: 500, width: 330, background: "#ECE6D2", boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
            opacity: f >= Math.max(c.lines[0].at, c.flipAt + 6) ? 1 : 0 }}>{/* ay 14:36: a panel never shows before its card */}
            <div style={{ height: 16, background: RED }} />
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {c.lines.map((l) => (
                <div key={l.text} style={{ fontFamily: F.title, fontSize: 34, lineHeight: 1.05, color: l.bad ? "#B3261E" : "#1C1D22", opacity: f >= Math.max(l.at, c.flipAt + 6) ? 1 : 0,
                  transform: `translateX(${interpolate(f, [l.at, l.at + 6], [-20, 0], clamp)}px)` }}>{l.text}</div>
              ))}
            </div>
            <div style={{ height: 10, background: BLUE }} /><div style={{ height: 10, background: RED }} />
          </div>
        </React.Fragment>
      ))}
      {stamp && f >= stamp.at && (
        <div style={{ position: "absolute", left: x0 + stamp.card * gap - 20, top: 330, transform: `rotate(-14deg) scale(${interpolate(f, [stamp.at, stamp.at + 5], [1.6, 1], clamp)})`,
          border: "8px solid #E0352B", color: "#E0352B", fontFamily: F.title, fontSize: 96, padding: "0 26px", letterSpacing: 4, background: "rgba(236,230,210,0.94)" }}>{stamp.text}</div>
      )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ay 20 Nov 23:03: a Monte Carlo card while ay explains the test (56 to 57b), BEFORE the roll-the-dice graph (58).
// A casino wheel (drawn here, no outside art): still at first, the title on "Monte Carlo", the wheel spins on "luck".
export const MonteCarloIntro: React.FC<{ titleAt: number; spinAt: number }> = ({ titleAt, spinAt }) => {
  const f = useCurrentFrame();
  const N = 24, R = 300, cx = 960, cy = 600;
  const inO = interpolate(f, [0, 10], [0, 1], clamp);
  const tO = interpolate(f, [titleAt - 4, titleAt + 6], [0, 1], { ...clamp, easing: easeOut });
  const spin = f < spinAt ? 0 : (f - spinAt) * 6 * interpolate(f, [spinAt, spinAt + 20], [0.2, 1], clamp);
  const ball = -spin * 1.6;
  const seg = (i: number) => {
    const a0 = (i / N) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / N) * 2 * Math.PI - Math.PI / 2;
    return `M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`;
  };
  return (
    <Ground>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F.title, fontSize: 110, color: CREAM, letterSpacing: 4, opacity: tO,
        transform: `translateY(${(1 - tO) * 20}px)` }}>THE MONTE CARLO TEST</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: inO }}>
        <g transform={`translate(${cx} ${cy + 60})`}>
          <circle r={R + 26} fill="#1B212B" stroke="rgba(237,239,242,0.25)" strokeWidth={3} />
          <g transform={`rotate(${spin})`}>
            {Array.from({ length: N }, (_, i) => <path key={i} d={seg(i)} fill={i === 0 ? C.gold : i % 2 ? "#2A313D" : "#3A4250"} stroke="#0D0F14" strokeWidth={2} />)}
            <circle r={R * 0.42} fill="#0D0F14" stroke="rgba(237,239,242,0.25)" strokeWidth={3} />
            {Array.from({ length: 4 }, (_, i) => <rect key={i} x={-6} y={-R * 0.4} width={12} height={R * 0.8} rx={6} fill="#8C96A6" transform={`rotate(${i * 45})`} />)}
          </g>
          <circle cx={(R + 8) * Math.cos((ball * Math.PI) / 180 - Math.PI / 2)} cy={(R + 8) * Math.sin((ball * Math.PI) / 180 - Math.PI / 2)} r={14} fill={CREAM} />
        </g>
      </svg>
    </Ground>
  );
};
