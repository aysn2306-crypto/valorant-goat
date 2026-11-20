import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { D } from "../lib/data";
import S from "../data/stills.json";
import { Photo } from "../lib/ui";
import { Big, Box, CREAM, hash, heat, scale, Stage } from "../stills/kit";

// Motion tests (18 Nov), each copying one move measured in refs/motion-notes.md. Numbers are placeholders until the model is locked.
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.22, 1, 0.36, 1);
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const p = (f: number, a: number, b: number, e: (x: number) => number = out) => interpolate(f, [a, b], [0, 1], { ...cl, easing: e });
const pop = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 13, stiffness: 160, mass: 0.6 } });
const ArrowR = () => <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg>;
const ArrowU = () => <svg width="30" height="46" viewBox="0 0 46 70"><path d="M23 0 L46 30 L31 30 L31 70 L15 70 L15 30 L0 30 Z" fill={C.text} /></svg>;
const Tag: React.FC<{ x: number; y: number; name: string; value: string; o: number; color?: string; side?: "right" | "left"; pad?: number; s?: number }> = ({ x, y, name, value, o, color = C.text, side = "right", pad = 30, s = 1 }) => (
  <div style={{ position: "absolute", top: y - 32 * s, opacity: o, whiteSpace: "nowrap", textShadow: "0 0 8px #0B0B0F, 0 0 16px #0B0B0F",
    transform: `translateX(${(1 - o) * (side === "right" ? -14 : 14)}px)`, ...(side === "right" ? { left: x + pad } : { left: x - pad - 400, width: 400, textAlign: "right" as const }) }}>
    <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 24 * s, color, letterSpacing: 0.5 }}>{name}</div>
    <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 36 * s, color: C.text, lineHeight: 1 }}>{value}</div>
  </div>
);
// a ring that draws itself (stroke dash), like a pen circling the point
const DrawRing: React.FC<{ x: number; y: number; r: number; t: number; color?: string }> = ({ x, y, r, t, color = "rgba(255,255,255,0.95)" }) => {
  const c = 2 * Math.PI * r;
  return (
    <svg style={{ position: "absolute", left: x - r - 4, top: y - r - 4, overflow: "visible" }} width={2 * r + 8} height={2 * r + 8}>
      <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={c} strokeDashoffset={c * (1 - t)}
        transform={`rotate(-90 ${r + 4} ${r + 4})`} strokeLinecap="round" />
    </svg>
  );
};

// ---------- Test 1: MachineLoLing build (dots on the x axis, y axis appears, dots rise), then Jxmy ring on one player ----------
export const T1_RISE = 270;
export const T1Rise: React.FC<{ map?: [number[], number[]] }> = ({ map }) => {
  const f0 = useCurrentFrame();
  // optional time map (draft): squeezes the build so the ring lands on the spoken name instead of being cut off
  const f = map ? interpolate(f0, map[0], map[1], { extrapolateLeft: "clamp", extrapolateRight: "extend" }) : f0;
  const B: Box = { x0: 250, y0: 190, x1: 1700, y1: 820 };
  const xr: [number, number] = [-0.5, 11.5], yr: [number, number] = [40, 104];
  const { X, Y } = scale(B, xr, yr);
  const pts = D.players.filter((q) => q.cats.peak >= 40).map((q) => ({ id: q.id, x: q.eliteYears + (q.id === "knight" ? 0 : (hash(q.id) - 0.5) * 0.7), y: q.cats.peak }));
  const order = [...pts].sort((a, b) => a.x - b.x).map((d) => d.id);
  const xAx = p(f, 0, 14), yAx = p(f, 44, 58), dim = p(f, 165, 178), ring = p(f, 178, 192, inOut), tag = p(f, 190, 200);
  const drift = interpolate(f, [100, 270], [1, 1.03], cl);
  return (
    <Stage title={undefined}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: F.title, fontSize: 80, letterSpacing: 2, color: CREAM,
        textShadow: "0 0 18px rgba(236,230,210,0.35)", opacity: p(f, 0, 10) }}>BEST SEASON VS YEARS AT THE TOP</div>
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: "60% 45%" }}>
        {/* x axis grows from the left */}
        <div style={{ position: "absolute", left: B.x0 - 2, top: B.y1, width: (B.x1 - B.x0 + 30) * xAx, height: 3, background: "rgba(237,239,242,0.85)" }} />
        {[0, 2, 4, 6, 8, 10].map((v, i) => <Big key={v} x={X(v)} y={B.y1 + 12} size={40} align="center" w={160}><span style={{ opacity: p(f, 4 + i * 2, 12 + i * 2) }}>{v}</span></Big>)}
        <div style={{ position: "absolute", left: B.x0, right: 1920 - B.x1, top: B.y1 + 72, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", opacity: p(f, 10, 20) }}>
          <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>ELITE YEARS</div><ArrowR />
        </div>
        {/* y axis grows upward */}
        <div style={{ position: "absolute", left: B.x0 - 2, top: B.y1 - (B.y1 - B.y0 + 20) * yAx, width: 3, height: (B.y1 - B.y0 + 20) * yAx, background: "rgba(237,239,242,0.85)" }} />
        {[40, 50, 60, 70, 80, 90, 100].map((v, i) => <Big key={v} x={B.x0 - 20} y={Y(v) - 28} size={46} align="right" w={150}><span style={{ opacity: p(f, 46 + i * 1.5, 54 + i * 1.5) }}>{v}</span></Big>)}
        <div style={{ position: "absolute", left: B.x0 + 22, top: B.y0 - 22, display: "flex", gap: 14, alignItems: "center", opacity: p(f, 52, 62) }}>
          <ArrowU /><div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>BEST SEASON</div>
        </div>
        {pts.map((d) => {
          const k = order.indexOf(d.id) / order.length;
          const s = p(f, 14 + k * 26, 22 + k * 26);
          const rise = p(f, 60 + hash(d.id + "r") * 18, 92 + hash(d.id + "r") * 18);
          const yy = interpolate(rise, [0, 1], [B.y1 - 9, Y(d.y)]);
          const isK = d.id === "knight";
          const col = heat((d.y - 40) / 60);
          const o = isK ? 1 : 1 - 0.72 * dim;
          return <div key={d.id} style={{ position: "absolute", left: X(d.x) - 8, top: yy - 8, width: 16, height: 16, borderRadius: 8, background: col,
            boxShadow: `0 0 8px ${col}`, opacity: o * (isK ? 1 : 0.85), transform: `scale(${s})`, filter: dim > 0 && !isK ? `saturate(${1 - 0.6 * dim})` : undefined }} />;
        })}
        {f >= 178 && <DrawRing x={X(9)} y={Y(100)} r={30} t={ring} />}
        {f >= 186 && (() => { const s = pop(f, 186); return (
          <div style={{ position: "absolute", left: X(9) - 40, top: Y(100) - 40, transform: `scale(${s})`, filter: `drop-shadow(0 0 18px ${C.cyan})` }}>
            <Photo id="knight" size={80} round ring={C.cyan} /></div>); })()}
        <Tag x={X(9)} y={Y(100)} name="KNIGHT" value="100" o={tag} color={C.cyan} pad={52} s={1.2} />
      </AbsoluteFill>
    </Stage>
  );
};

// ---------- Test 2: Jxmy climb (pack hold, fast climb through empty axis, dead-still hold, true camera zoom out) ----------
export const T2_CLIMB = 560;
export const T2Climb: React.FC = () => {
  const f = useCurrentFrame();
  const PX = 3; // world px per trophy point
  // measured on Jxmy (refs/ANIMATION.md A): hold, 3.5 s climb at constant speed with a short ease in and a near hard stop,
  // 3.5 s still hold, 5 s ease in-out zoom out to about 0.2, 2.5 s hold, then the bracket pops on with no animation
  const T = { climb: 60, land: 165, zoom: 270, zoomEnd: 420, bracket: 495 };
  const A = 0.15, vmax = 1 / (1 - A / 2);
  const climbE = (x: number) => (x < A ? (vmax * x * x) / (2 * A) : vmax * (A / 2 + (x - A)));
  const fk = D.players.find((q) => q.id === "faker")!;
  const FK = fk.raw.trophies;
  const seasons = (y: string) => { const a = y.split("-"); return Number(a[a.length - 1]) - Number(a[0]) + 1; };
  const xs = (n: number) => 330 + ((n - 1) / 14) * 1350;
  const named = ["gumayusi", "keria", "oner"]; // v15 line 51: the three-time world champions, Gumayusi, Keria, Oner
  const side: Record<string, "left" | "right"> = { gumayusi: "right", keria: "left", oner: "right" };
  // camera: value at screen centre (c) and zoom (s)
  const climb = p(f, T.climb, T.land, climbE), zoom = p(f, T.zoom, T.zoomEnd, inOut);
  const TOP = 1100; // the axis runs just past Faker's 1,058 (v15)
  const c0 = 520, c1 = FK - 270 / PX, c2 = TOP / 2 + 10;
  const c = interpolate(zoom, [0, 1], [interpolate(climb, [0, 1], [c0, c1]), c2]);
  // camera pull back: y fits the whole range, x shrinks less so the chart keeps its width
  const s = interpolate(zoom, [0, 1], [1, 860 / (TOP * PX)]);
  const syk = s;
  const sy = (v: number) => 560 - (v - c) * PX * syk;
  const sx = (x: number) => 380 + (x - 380) * s;
  const axisX = sx(250);
  const step = syk > 0.5 ? 50 : syk > 0.3 ? 100 : 200;
  const ticks: number[] = []; for (let v = 0; v <= TOP; v += step) ticks.push(v);
  const gap = f >= T.bracket ? 1 : 0;
  const rulerV = Math.max(...D.players.filter((q) => q.id !== "faker").map((q) => q.raw.trophies)); // next best (Gumayusi in v15)
  return (
    <Stage title="THE TROPHY CABINET">
      <div style={{ position: "absolute", left: axisX, top: Math.max(0, sy(TOP)), width: 3, height: Math.min(1080, sy(0) + 20) - Math.max(0, sy(TOP)), background: "rgba(237,239,242,0.85)" }} />
      {ticks.map((v) => { const y = sy(v); if (y < 120 || y > 1080) return null; return (
        <div key={v} style={{ position: "absolute", left: axisX - 175 * s - 20, width: 160 * s + 10, top: y - 32 * s, textAlign: "right", fontFamily: F.title,
          fontSize: 52 * s, color: C.text }}>{v.toLocaleString("en-US")}</div>); })}
      {D.players.filter((q) => q.id !== "faker").map((q) => {
        const v = q.raw.trophies, y = sy(v); if (y < 110 || y > 1100) return null;
        const x = sx(xs(seasons(q.years)) + (named.includes(q.id) ? 0 : (hash(q.id) - 0.5) * 70)); const r = 11 * s; const col = heat(v / 520);
        return <div key={q.id} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: col, boxShadow: `0 0 ${r}px ${col}` }} />;
      })}
      {named.map((id) => { const q = D.players.find((z) => z.id === id)!; const x = sx(xs(seasons(q.years))), y = sy(q.raw.trophies);
        return <Tag key={id} x={x} y={y} name={q.name.toUpperCase()} value={String(Math.round(q.raw.trophies))} o={1} side={side[id]} pad={20 * s + 6} s={s} />; })}
      {(() => { const x = sx(xs(seasons(fk.years))), y = sy(FK); const r = 16 * s; return (<>
        {/* ay 20 Nov: Faker is a dot like everyone else, only its colour differs */}
        <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: C.gold }} />
        <Tag x={x} y={y} name="FAKER" value={Math.round(FK).toLocaleString("en-US")} o={1} color={C.gold} side="left" pad={20 * s + 6} s={Math.max(s, 0.5)} />
      </>); })()}
      {gap > 0 && (() => { const x = sx(xs(seasons(fk.years))) + 50, a = sy(FK), b = sy(rulerV); return (
        <div style={{ position: "absolute", left: x, top: a, height: b - a, borderLeft: "3px dashed rgba(237,239,242,0.8)", opacity: gap }}>
          <div style={{ position: "absolute", left: 30, top: (b - a) / 2 - 60, fontFamily: F.title, fontSize: 64, color: C.text, whiteSpace: "nowrap", lineHeight: 1.1 }}>
            {Math.round(FK) - Math.round(rulerV)} POINTS BETWEEN<br />FAKER AND THE NEXT BEST</div>
        </div>); })()}
    </Stage>
  );
};

// ---------- Test 3: counter that lands on the word, synced with the strip filling ----------
export const T3_COUNT = 240;
export const T3Count: React.FC = () => {
  const f = useCurrentFrame();
  const b: Box = { x0: 300, y0: 230, x1: 1560, y1: 800 };
  const rows: Record<number, number> = { 1: 330, 2: 520, 3: 710 };
  const third = new Set<number>(); let k = 7; while (third.size < 25) { k = (k * 7919 + 13) % 1000; third.add(k); }
  const w = (b.x1 - b.x0) / 1000;
  const LAND = 84; // the frame the voice says "975"
  const fill = p(f, 24, LAND, (x) => 1 - Math.pow(1 - x, 2.2)); // fast, then slows into the number
  const n2 = Math.round(975 * fill);
  const fill3 = p(f, 120, 150);
  const punch = f >= LAND ? 1 + 0.12 * Math.max(0, 1 - (f - LAND) / 8) : 1;
  const ax = p(f, 0, 14);
  let seen = 0; const idx2: number[] = []; for (let i = 0; i < 1000; i++) if (!third.has(i)) idx2.push(i);
  return (
    <Stage title="1,000 RERUNS">
      <div style={{ opacity: ax }}>
        <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
        <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
        {[1, 2, 3].map((r) => <Big key={r} x={b.x0 - 30} y={rows[r] - 34} size={58} align="right" w={150}>#{r}</Big>)}
        {[1, 250, 500, 750, 1000].map((v) => <Big key={v} x={b.x0 + (v - 0.5) * w} y={b.y1 + 12} size={40} align="center" w={200}>{v.toLocaleString("en-US")}</Big>)}
        <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 72, textAlign: "center", fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>RERUN</div>
        <div style={{ position: "absolute", left: b.x0 + 22, top: b.y0 - 26, fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>FINISHED</div>
      </div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={b.x0 + 4} x2={b.x1} y1={rows[1]} y2={rows[1]} stroke="rgba(237,239,242,0.25)" strokeWidth={2} strokeDasharray="8 10" opacity={ax} />
        {idx2.slice(0, n2).map((i) => <rect key={i} x={b.x0 + 4 + i * w} y={rows[2] - 40} width={Math.max(0.9, w - 0.35)} height={80} fill={C.cyan} />)}
        {[...third].sort((a, z) => a - z).map((i, j) => { const o = p(f, 120 + j * 1.2, 126 + j * 1.2); return (
          <rect key={i} x={b.x0 + 4 + i * w} y={rows[3] - 40 + (1 - o) * -60} width={Math.max(0.9, w - 0.35)} height={80} fill="#7FE3F5" opacity={o} />); })}
      </svg>
      <Big x={b.x1 + 40} y={rows[1] - 34} size={60} color="#6B7685"><span style={{ opacity: ax }}>0</span></Big>
      <div style={{ position: "absolute", left: b.x1 + 40, top: rows[2] - 42, fontFamily: F.title, fontSize: 76, color: C.cyan, transform: `scale(${punch})`,
        transformOrigin: "left center", fontVariantNumeric: "tabular-nums", textShadow: f >= LAND ? `0 0 ${18 * (punch - 0.95) * 8}px ${C.cyan}` : undefined }}>{n2}</div>
      <Big x={b.x1 + 40} y={rows[3] - 34} size={60}><span style={{ opacity: fill3 }}>{Math.round(25 * fill3)}</span></Big>
      {f >= 165 && (() => { const s = pop(f, 165); return (
        <div style={{ position: "absolute", left: b.x1 + 190, top: rows[2] - 46, width: 92, height: 92, borderRadius: 46, background: "#1B212B", transform: `scale(${s})`,
          border: `3px solid ${C.cyan}`, boxShadow: `0 0 22px ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.title, fontSize: 58, color: C.cyan }}>?</div>); })()}
      {seen > 0 && null}
    </Stage>
  );
};

// ---------- Test 4: spotlight that moves across a held chart (dim to ~25%, face pops on the lit point) ----------
export const T4_SPOT = 300;
export const T4Spot: React.FC = () => {
  const f = useCurrentFrame();
  const B: Box = { x0: 250, y0: 190, x1: 1700, y1: 820 };
  const xr: [number, number] = [2010.5, 2026.5], yr: [number, number] = [15, 92];
  const { X, Y } = scale(B, xr, yr);
  const rows = (S.split as [string, string, string, number][]).map(([link, name, years, s]) => ({ link, name, first: Number(years.slice(0, 4)), s }));
  const cut = 73.6;
  const dimAll = p(f, 30, 42);           // everything below the line drops
  const lit1 = p(f, 75, 85), dim1 = p(f, 165, 177), lit2 = p(f, 165, 177), both = p(f, 240, 252);
  const drift = interpolate(f, [0, 300], [1, 1.035], cl);
  const fakers = rows.filter((r) => r.name.startsWith("Faker")).sort((a, z) => a.first - z.first);
  return (
    <Stage title="TWO FAKERS">
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: B.x0, top: B.y0 - 10, width: B.x1 - B.x0 + 30, height: Y(cut) - B.y0 + 10,
          background: "linear-gradient(180deg, rgba(92,190,80,0.2) 0%, rgba(92,190,80,0.06) 100%)", opacity: 0.4 + 0.6 * dimAll }} />
        <div style={{ position: "absolute", left: B.x0, top: Y(cut), width: B.x1 - B.x0 + 30, borderTop: "3px dashed rgba(237,239,242,0.7)" }} />
        <Big x={B.x1 + 20} y={Y(cut) - 50} size={36} align="right" w={200}>TOP 7</Big>
        <div style={{ position: "absolute", left: B.x0 - 2, top: B.y0 - 20, width: 3, height: B.y1 - B.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
        <div style={{ position: "absolute", left: B.x0 - 2, top: B.y1, width: B.x1 - B.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
        {[20, 40, 60, 80].map((v) => <Big key={v} x={B.x0 - 20} y={Y(v) - 28} size={46} align="right" w={150}>{v}</Big>)}
        {[2011, 2014, 2017, 2020, 2023, 2026].map((v) => <Big key={v} x={X(v)} y={B.y1 + 12} size={40} align="center" w={160}>{v}</Big>)}
        <div style={{ position: "absolute", left: B.x0, right: 1920 - B.x1, top: B.y1 + 72, display: "flex", justifyContent: "center", gap: 18, alignItems: "center" }}>
          <div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>FIRST SEASON</div><ArrowR /></div>
        <div style={{ position: "absolute", left: B.x0 + 22, top: B.y0 - 22, display: "flex", gap: 14, alignItems: "center" }}>
          <ArrowU /><div style={{ fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SCORE</div></div>
        {rows.filter((r) => !r.name.startsWith("Faker")).map((r) => {
          const top = r.s > cut; const col = heat((r.s - 20) / 62);
          const o = top ? 1 - 0.7 * Math.max(lit1 - both, 0) : 1 - 0.75 * dimAll;
          return <div key={r.link} style={{ position: "absolute", left: X(r.first + (hash(r.link) - 0.5) * 0.75) - 7, top: Y(r.s) - 7, width: 14, height: 14,
            borderRadius: 7, background: col, boxShadow: `0 0 7px ${col}`, opacity: o, filter: `saturate(${top ? 1 : 1 - 0.7 * dimAll})` }} />;
        })}
        {fakers.map((r, i) => {
          const lit = i === 0 ? Math.max(lit1 - 0.65 * dim1, both) : Math.max(lit2, both);
          const at = i === 0 ? 75 : 165; const s = f >= at ? pop(f, at) : 0;
          const x = X(r.first), y = Y(r.s);
          return (
            <React.Fragment key={r.link}>
              <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: C.gold, boxShadow: `0 0 10px ${C.gold}` }} />
              {s > 0 && <div style={{ position: "absolute", left: x - 38, top: y - 38, transform: `scale(${s})`, opacity: 0.35 + 0.65 * lit, filter: `drop-shadow(0 0 ${18 * lit}px ${C.gold})` }}>
                <Photo id="faker" size={76} round ring={C.gold} /></div>}
              <Tag x={x} y={y} name={`FAKER ${r.name.slice(6)}`} value={String(Math.round(r.s))} o={Math.min(1, s) * (0.35 + 0.65 * lit)} color={C.gold} side="right" pad={46} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
