import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F } from "../theme";
import { D, P } from "../lib/data";
import S from "../data/stills.json";
import { Axes, Big, Box, Callout, CREAM, Dot, Face, hash, heat, scale, Stage, Star } from "./kit";

// Graph stills for ay to judge (18 Nov). Each is the finished frame of one graph; motion comes after ay's notes.
// Numbers: league.json + stills.json (from the ranking thread's CSVs). Nothing below y = 950 (YouTube bar).

const B: Box = { x0: 250, y0: 190, x1: 1700, y1: 820 };
const seasons = (years: string) => { const y = years.split("-"); return Number(y[y.length - 1]) - Number(y[0]) + 1; };
const PL = D.players;
const r0 = (v: number) => Math.round(v).toString();
// id, name, games, skill, big stage, teams won titles with, titles, worlds, % of Faker, international games
type BoardRow = [string, string, number, number | null, number | null, number, number, number, number, number | null];

// 1. Cold open: six world titles, nobody else more than three
export const S1Worlds: React.FC = () => {
  const xr: [number, number] = [0, 15], yr: [number, number] = [-0.5, 6.6];
  const { X, Y } = scale(B, xr, yr);
  const fixed: Record<string, [number, number]> = { gumayusi: [-0.22, 0.1], oner: [0.22, -0.1], keria: [0, 0], bengi: [0, 0] };
  return (
    <Stage title="WORLD TITLES">
      <Axes b={B} xr={xr} yr={yr} xt={[1, 3, 5, 7, 9, 11, 13, 15]} yt={[0, 1, 2, 3, 4, 5, 6]} xl="SEASONS AS A PRO" yl="WORLDS WON" />
      {PL.filter((p) => p.id !== "faker").map((p) => {
        const w = p.titles.worlds; const n = seasons(p.years);
        const f = fixed[p.id];
        const jx = f ? f[0] : (hash(p.id) - 0.5) * 0.8, jy = f ? f[1] : (hash(p.id + "y") - 0.5) * (w === 0 ? 0.6 : w === 2 ? 0.15 : 0.35);
        return <Dot key={p.id} x={X(n + jx)} y={Y(w + jy)} r={8} color={heat(w / 3)} o={w === 0 ? 0.7 : 1} />;
      })}
      <Callout x={X(5)} y={Y(3)} name="Bengi" side="left" ring={22} />
      <Callout x={X(6 - 0.22)} y={Y(3.1)} name="Gumayusi" side="above" ring={22} />
      <Callout x={X(6 + 0.22)} y={Y(2.9)} name="Oner" side="below" ring={22} />
      <Callout x={X(7)} y={Y(3)} name="Keria" side="right" ring={22} />
      <Face id="faker" x={X(14)} y={Y(6)} size={130} />
      <Callout x={X(14)} y={Y(6)} name="Faker" value="6" side="left" ring={0} pad={72} color={C.gold} size={1.4} />
      <div style={{ position: "absolute", left: X(15.3), top: Y(6), height: Y(3) - Y(6), borderLeft: "3px dashed rgba(237,239,242,0.8)" }} />
      <Big x={X(15.3) + 14} y={(Y(6) + Y(3)) / 2 - 30} size={52}>+3</Big>
    </Stage>
  );
};

// 3. Trophy cabinet: trophy points vs seasons as a pro (v11 trophy values). The next best is found from the data.
export const S3Cabinet: React.FC = () => {
  const xr: [number, number] = [0, 15.5], yr: [number, number] = [0, 1650];
  const { X, Y } = scale(B, xr, yr);
  const fk = P("faker");
  const rest = PL.filter((p) => p.id !== "faker").sort((a, b) => b.trophyPts - a.trophyPts);
  const named = rest.slice(0, 3);
  const jx = (id: string) => (named.some((p) => p.id === id) ? 0 : (hash(id) - 0.5) * 0.7);
  const sides: ("left" | "right" | "below")[] = ["left", "right", "below"];
  const nb = named[0];
  return (
    <Stage title="THE TROPHY CABINET">
      <Axes b={B} xr={xr} yr={yr} xt={[1, 3, 5, 7, 9, 11, 13, 15]} yt={[0, 400, 800, 1200, 1600]} xl="SEASONS AS A PRO" yl="TROPHY POINTS" />
      {rest.map((p) => <Dot key={p.id} x={X(seasons(p.years) + jx(p.id))} y={Y(p.trophyPts)} r={8} color={heat(p.trophyPts / 650)} o={0.85} />)}
      {named.map((p, i) => <Callout key={p.id} x={X(seasons(p.years))} y={Y(p.trophyPts)} name={p.name} value={Math.round(p.trophyPts).toLocaleString("en-US")} side={sides[i]} ring={20} />)}
      <div style={{ position: "absolute", left: X(14) + 70, top: Y(fk.trophyPts), height: Y(nb.trophyPts) - Y(fk.trophyPts), borderLeft: "3px dashed rgba(237,239,242,0.8)" }} />
      <Big x={X(14) + 86} y={(Y(fk.trophyPts) + Y(nb.trophyPts)) / 2 - 30} size={52}>+{Math.round(fk.trophyPts - nb.trophyPts).toLocaleString("en-US")}</Big>
      <Face id="faker" x={X(seasons(fk.years))} y={Y(fk.trophyPts)} size={120} />
      <Callout x={X(seasons(fk.years))} y={Y(fk.trophyPts)} name="Faker" value={Math.round(fk.trophyPts).toLocaleString("en-US")} side="left" ring={0} pad={68} color={C.gold} size={1.4} />
    </Stage>
  );
};

// 2. The debate: stacked Reddit and article screenshots
const Shot: React.FC<{ src: string; x: number; y: number; w: number; rot: number }> = ({ src, x, y, w, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot}deg)`, borderRadius: 14, overflow: "hidden",
    boxShadow: "0 18px 50px rgba(0,0,0,0.75), 0 0 0 2px rgba(255,255,255,0.08)" }}>
    <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
  </div>
);
export const S2Debate: React.FC = () => (
  <Stage glow="blue">
    <Shot src="debate/tl-photo.png" x={1010} y={300} w={820} rot={3} />
    <Shot src="debate/tl-title.png" x={1060} y={70} w={700} rot={2} />
    <Shot src="debate/reddit-post.png" x={90} y={110} w={940} rot={-3} />
    <Shot src="debate/reddit-c1.png" x={140} y={470} w={860} rot={-1.5} />
    <Shot src="debate/reddit-uzi.png" x={330} y={680} w={820} rot={1.5} />
    <Shot src="debate/reddit-faker.png" x={1000} y={800} w={760} rot={-2} />
  </Stage>
);

// 4. Big games and clutch: international games played vs the score
export const S4BigStage: React.FC = () => {
  // v11 / script v4: "Biggest stage: Keria" = the big stage board (c_big_stage, international and finals play), not the combined part
  const xr: [number, number] = [0, 380], yr: [number, number] = [55, 104];
  const { X, Y } = scale(B, xr, yr);
  const pts = (S.board as BoardRow[]).map((r) => ({ id: r[0], x: r[9] ?? 0, y: r[4] ?? 0 })).filter((d) => d.y >= 55 && d.x > 0);
  const at = (id: string) => pts.find((q) => q.id === id)!;
  const kr = at("keria");
  return (
    <Stage title="BIGGEST STAGE">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 50, 100, 150, 200, 250, 300, 350]} yt={[60, 70, 80, 90, 100]} xl="INTERNATIONAL GAMES" yl="BIG STAGE SCORE" />
      {pts.filter((d) => d.id !== "keria").map((d) => <Star key={d.id} x={X(d.x)} y={Y(d.y)} r={11} color={heat((d.y - 55) / 45)} o={0.9} />)}
      {([["zeus", "left"], ["knight", "below"], ["faker", "above"]] as [string, "left" | "below" | "above"][]).map(([id, side]) => {
        const d = at(id); return <Callout key={id} x={X(d.x)} y={Y(d.y)} name={P(id).name} value={r0(d.y)} side={side} ring={20} />;
      })}
      <Face id="keria" x={X(kr.x)} y={Y(kr.y)} size={92} ring={C.cyan} glow={C.cyan} />
      <Callout x={X(kr.x)} y={Y(kr.y)} name="Keria" value="100" side="right" ring={0} pad={52} color={C.cyan} size={1.25} />
    </Stage>
  );
};

// 5. Best season vs years at the top
export const S5PeakLongevity: React.FC = () => {
  const xr: [number, number] = [-0.5, 11.5], yr: [number, number] = [40, 104];
  const { X, Y } = scale(B, xr, yr);
  const named: Record<string, [string, "left" | "right" | "above" | "below"]> = { chovy: ["Chovy", "left"], kiin: ["Kiin", "below"], faker: ["Faker", "right"], keria: ["Keria", "left"] };
  const nx: Record<string, number> = { chovy: -0.4, kiin: 0.3, knight: 0.05 };
  return (
    <Stage title="BEST SEASON VS YEARS AT THE TOP">
      <div style={{ position: "absolute", left: X(6.5), top: B.y0 - 10, width: B.x1 - X(6.5) + 30, height: Y(80) - B.y0 + 10,
        background: "radial-gradient(ellipse at 100% 0%, rgba(92,190,80,0.28) 0%, rgba(92,190,80,0) 70%)" }} />
      <Axes b={B} xr={xr} yr={yr} xt={[0, 2, 4, 6, 8, 10]} yt={[40, 50, 60, 70, 80, 90, 100]} xl="ELITE YEARS" yl="BEST SEASON" />
      {PL.filter((p) => p.id !== "knight" && p.cats.peak >= 40).map((p) => {
        const jx = named[p.id] ? nx[p.id] ?? 0 : (hash(p.id) - 0.5) * 0.7;
        return <Dot key={p.id} x={X(p.eliteYears + jx)} y={Y(p.cats.peak)} r={8} color={heat((p.cats.peak - 40) / 60)} o={named[p.id] ? 1 : 0.8} />;
      })}
      {Object.entries(named).map(([id, [n, side]]) => {
        const p = P(id);
        return <Callout key={id} x={X(p.eliteYears + (nx[id] ?? 0))} y={Y(p.cats.peak)} name={n} value={r0(p.cats.peak)} side={side} ring={22} />;
      })}
      <Face id="knight" x={X(9.05)} y={Y(100)} size={78} ring={C.cyan} glow={C.cyan} />
      <Callout x={X(9.05)} y={Y(100)} name="Knight" value="100" side="right" ring={0} pad={42} color={C.cyan} size={1.25} />
    </Stage>
  );
};

// 6. Twist one: slide the trophy weight
export const S6Slider: React.FC = () => {
  const xr: [number, number] = [0, 60], yr: [number, number] = [56, 100];
  const { X, Y } = scale(B, xr, yr);
  const lines: [string, string, string, number][] = [["ruler", "Ruler", "rgba(170,178,190,0.7)", 3], ["keria", "Keria", "rgba(170,178,190,0.7)", 3],
    ["chovy", "Chovy", C.red, 5], ["knight", "Knight", C.cyan, 5], ["faker", "Faker", C.gold, 6]];
  const path = (id: string) => D.sweep.map((s) => { const v = s.top.find((t) => t[0] === id); return v ? `${X(s.w)},${Y(v[1])}` : null; }).filter(Boolean).join(" L ");
  const at = (id: string, w: number) => D.sweep.find((s) => s.w === w)!.top.find((t) => t[0] === id)![1];
  return (
    <Stage title="WHAT IF TROPHIES COUNTED LESS?">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 10, 20, 30, 40, 50, 60]} yt={[60, 70, 80, 90, 100]} xl="TROPHY WEIGHT" yl="SCORE" xf={(v) => v + "%"} />
      <div style={{ position: "absolute", left: X(35), top: B.y0, height: B.y1 - B.y0, borderLeft: "3px dashed rgba(237,239,242,0.6)" }} />
      <Big x={X(35) + 12} y={B.y1 - 60} size={34} color={C.text}>WE USE 35%</Big>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {lines.map(([id, , col, w]) => (
          <path key={id} d={"M " + path(id)} stroke={col} strokeWidth={w} fill="none" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
        ))}
      </svg>
      {/* where Faker takes over first place */}
      <div style={{ position: "absolute", left: X(22.4) - 24, top: Y(81.6) - 24, width: 48, height: 48, borderRadius: 24, border: "3px solid rgba(255,255,255,0.95)" }} />
      <Big x={X(22.4)} y={Y(81.6) - 110} size={36} align="center" w={400}>FAKER #1 ABOVE 22%</Big>
      {lines.filter(([id]) => id !== "faker").map(([id, n, col]) => (
        <div key={id} style={{ position: "absolute", left: B.x0 + 16, top: Y(at(id, 0)) - 44, whiteSpace: "nowrap",
          fontFamily: F.body, fontWeight: 800, fontSize: 26, color: col === "rgba(170,178,190,0.7)" ? "#AAB2BE" : col }}>{n.toUpperCase()} {r0(at(id, 0))}</div>
      ))}
      <Face id="faker" x={X(60) + 70} y={Y(at("faker", 60))} size={96} />
      <Callout x={X(60) + 70} y={Y(at("faker", 60))} name="Faker" value={r0(at("faker", 60))} side="below" ring={0} pad={50} color={C.gold} />
    </Stage>
  );
};

// 7. The 975 tease: where the mystery player finished in each of 1,000 reruns
export const S7Reruns: React.FC = () => {
  const b: Box = { x0: 300, y0: 230, x1: 1560, y1: 800 };
  const rows = { 1: 330, 2: 520, 3: 710 } as Record<number, number>;
  const [, second] = (S.reruns as Record<string, number[]>).knight; // v10: #2 in 1,000 of 1,000
  const third = new Set<number>(); let k = 7; while (third.size < 1000 - second) { k = (k * 7919 + 13) % 1000; third.add(k); }
  const w = (b.x1 - b.x0) / 1000;
  return (
    <Stage title="1,000 RERUNS">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[1, 2, 3].map((r) => <Big key={r} x={b.x0 - 30} y={rows[r] - 34} size={58} align="right" w={150}>#{r}</Big>)}
      {[1, 250, 500, 750, 1000].map((v) => <Big key={v} x={b.x0 + (v - 0.5) * w} y={b.y1 + 12} size={40} align="center" w={200}>{v.toLocaleString("en-US")}</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 72, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>RERUN</div>
      <div style={{ position: "absolute", left: b.x0 + 22, top: b.y0 - 26, fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>FINISHED</div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={b.x0 + 4} x2={b.x1} y1={rows[1]} y2={rows[1]} stroke="rgba(237,239,242,0.25)" strokeWidth={2} strokeDasharray="8 10" />
        {Array.from({ length: 1000 }, (_, i) => {
          const r = third.has(i) ? 3 : 2;
          return <rect key={i} x={b.x0 + 4 + i * w} y={rows[r] - 40} width={Math.max(0.9, w - 0.35)} height={80} fill={r === 2 ? C.cyan : "#7FE3F5"} opacity={0.95} />;
        })}
      </svg>
      <Big x={b.x1 + 40} y={rows[1] - 34} size={60} color="#6B7685">0</Big>
      <Big x={b.x1 + 40} y={rows[2] - 40} size={76} color={C.cyan}>{second.toLocaleString("en-US")}</Big>
      <Big x={b.x1 + 40} y={rows[3] - 34} size={60} color={second === 1000 ? "#6B7685" : C.text}>{1000 - second}</Big>
      {/* the mystery player: a blank face */}
      <div style={{ position: "absolute", left: b.x1 + 230, top: rows[2] - 46, width: 92, height: 92, borderRadius: 46, background: "#1B212B",
        border: `3px solid ${C.cyan}`, boxShadow: `0 0 22px ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.title, fontSize: 58, color: C.cyan }}>?</div>
    </Stage>
  );
};

// 8. Twist two: international trophies only. v10: Faker is 91.5 in both, far above, so he sits as a note at the top and the
// axis zooms on the chase (labels show rank, not raw score, per MODEL-CURRENT).
export const S8IntlOnly: React.FC = () => {
  const b: Box = { x0: 380, y0: 250, x1: 1500, y1: 820 };
  const yr: [number, number] = [64, 74];
  const Y = (v: number) => b.y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (b.y1 - b.y0);
  const XL = b.x0 + 330, XR = b.x1 - 300;
  const intlRows = S.intl as [string, string, number][];
  const intl = Object.fromEntries(intlRows.map(([id, , s]) => [id, s]));
  const rankR = Object.fromEntries(intlRows.map(([id], i) => [id, i + 1]));
  const ids = ["knight", "keria", "chovy", "ruler", "zeus"];
  const col = (id: string) => (id === "keria" ? C.cyan : id === "knight" ? "#FF6B70" : "rgba(190,196,206,0.75)");
  const lab = (id: string) => (id === "keria" ? C.cyan : id === "knight" ? "#FF8A8E" : C.text);
  return (
    <Stage title="INTERNATIONAL TROPHIES ONLY">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[64, 66, 68, 70, 72, 74].map((v) => <Big key={v} x={b.x0 - 20} y={Y(v) - 28} size={46} align="right" w={120}>{v}</Big>)}
      <div style={{ position: "absolute", left: b.x0 + 22, top: b.y0 - 26, fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SCORE</div>
      <div style={{ position: "absolute", left: b.x0 + 260, top: 160, display: "flex", alignItems: "center", gap: 16 }}>
        <Face id="faker" x={30} y={30} size={60} />
        <div style={{ marginLeft: 70, fontFamily: F.body, fontWeight: 800, fontSize: 28, color: C.gold, whiteSpace: "nowrap" }}>FAKER STAYS #1</div>
      </div>
      <Big x={XL} y={b.y1 + 14} size={38} align="center" w={400}>ALL TROPHIES</Big>
      <Big x={XR} y={b.y1 + 14} size={38} align="center" w={400}>INTERNATIONAL ONLY</Big>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {ids.map((id) => (
          <g key={id} style={{ filter: `drop-shadow(0 0 6px ${col(id)})` }}>
            <line x1={XL} x2={XR} y1={Y(P(id).score)} y2={Y(intl[id])} stroke={col(id)} strokeWidth={id === "keria" || id === "knight" ? 6 : 3} />
            <circle cx={XL} cy={Y(P(id).score)} r={9} fill={col(id)} />
            {id !== "keria" && <circle cx={XR} cy={Y(intl[id])} r={9} fill={col(id)} />}
          </g>
        ))}
      </svg>
      {ids.map((id) => (
        <div key={"l" + id} style={{ position: "absolute", left: XL - 320, width: 300, textAlign: "right", top: Y(P(id).score) - 17, fontFamily: F.body, fontWeight: 800,
          fontSize: 25, color: lab(id), whiteSpace: "nowrap" }}>{P(id).name.toUpperCase()} #{P(id).rank}</div>
      ))}
      {ids.filter((id) => id !== "keria").map((id) => (
        <div key={"r" + id} style={{ position: "absolute", left: XR + 22, top: Y(intl[id]) - 17, fontFamily: F.body, fontWeight: 800, fontSize: 25,
          color: lab(id), whiteSpace: "nowrap" }}>#{rankR[id]} {P(id).name.toUpperCase()}</div>
      ))}
      <Face id="keria" x={XR} y={Y(intl.keria)} size={76} ring={C.cyan} glow={C.cyan} />
      <div style={{ position: "absolute", left: XR + 50, top: Y(intl.keria) - 40, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 40, color: C.cyan }}>#2 KERIA</div>
      </div>
    </Stage>
  );
};

// 9. Twist three: split Faker in two (ay: even halves, 2013-19 and 2020-26, three Worlds each). Whole pool shown.
// Labels show rank; the left-hand Faker gets his label on the right.
export const S9TwoFakers: React.FC = () => {
  const xr: [number, number] = [2010.5, 2026.5], yr: [number, number] = [15, 92];
  const { X, Y } = scale(B, xr, yr);
  const rows = (S.split as [string, string, string, number][]).map(([link, name, years, s]) => ({ link, name, first: Number(years.slice(0, 4)), s }));
  const cut = (rows[9].s + rows[10].s) / 2; // between #10 and #11
  const knight = rows.find((r) => r.name === "Knight")!;
  // Knight and Chovy both start in 2018 and sit 1.7 apart: spread them by hand so both rings read
  const jx = (r: { link: string; first: number }) => r.first + (r.link === "Chovy" ? -0.15 : r.link === knight.link ? 0.4 : (hash(r.link) - 0.5) * 0.75);
  return (
    <Stage title="TWO FAKERS">
      <div style={{ position: "absolute", left: B.x0, top: B.y0 - 10, width: B.x1 - B.x0 + 30, height: Y(cut) - B.y0 + 10,
        background: "linear-gradient(180deg, rgba(92,190,80,0.2) 0%, rgba(92,190,80,0.06) 100%)" }} />
      <div style={{ position: "absolute", left: B.x0, top: Y(cut), width: B.x1 - B.x0 + 30, borderTop: "3px dashed rgba(237,239,242,0.7)" }} />
      <Big x={B.x1 + 20} y={Y(cut) - 50} size={36} align="right" w={200}>TOP 10</Big>
      <Axes b={B} xr={xr} yr={yr} xt={[2011, 2014, 2017, 2020, 2023, 2026]} yt={[20, 40, 60, 80]} xl="FIRST SEASON" yl="SCORE" xf={(v) => String(v)} />
      {rows.filter((r) => !r.name.startsWith("Faker")).map((r) => (
        <Dot key={r.link} x={X(jx(r))} y={Y(r.s)} r={7} color={heat((r.s - 20) / 62)} o={r.s > cut ? 1 : 0.8} />
      ))}
      <Callout x={X(jx(knight))} y={Y(knight.s)} name="Knight" value="#1" side="right" ring={20} />
      {(() => { const c = rows.find((r) => r.name === "Chovy")!; const i = rows.indexOf(c) + 1;
        return <Callout x={X(jx(c))} y={Y(c.s)} name="Chovy" value={"#" + i} side="below" ring={20} />; })()}
      {rows.filter((r) => r.name.startsWith("Faker")).map((r) => (
        <React.Fragment key={r.link}>
          <Face id="faker" x={X(r.first)} y={Y(r.s)} size={76} />
          <div style={{ position: "absolute", ...(r.first < 2015 ? { left: X(r.first) + 46 } : { left: X(r.first) - 360, width: 315, textAlign: "right" as const }), top: Y(r.s) - 34, whiteSpace: "nowrap",
            textShadow: "0 0 6px #0B0B0F, 0 0 12px #0B0B0F, 0 0 18px #0B0B0F" }}>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 26, color: C.gold }}>FAKER {r.name.slice(6)}</div>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 38, color: C.text, lineHeight: 1 }}>#{rows.indexOf(r) + 1}</div>
          </div>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// 10. Finale: the GOAT pyramid (ay 18 Nov 17:46: back to round photos). Tiers follow our ranking only, sorted by rank
// (MODEL-CURRENT commit 67d8ad3): round photo, small rank badge, name under it, a small "TIER n" per row, no percentages, no title.
// ay 18:09: wider spread of regions (MODEL-CURRENT commit 789f9d7)
const TIERS = [["faker"], ["knight", "chovy"], ["keria", "ruler", "bin", "viper"], ["gumayusi", "caps", "deft", "theshy", "uzi"],
  ["scout", "perkz", "doinb", "bengi", "jankos", "bjergsen"]];
// 19a (ay 18:15): after tiers 5 and 4 fill, dim all but Uzi and Bengi and show where 2025/26 published lists put them
// (research/model-vs-published-lists.md; esports.net and spilled.gg only, Red Bull dropped as unranked).
const LISTS: Record<string, [string, string][]> = {
  uzi: [["ESPORTS.NET 2025", "#4"], ["SPILLED.GG 2026", "#5"]],
  bengi: [["ESPORTS.NET 2025", "#2"], ["SPILLED.GG 2026", "#9"]],
};
const Pyramid: React.FC<{ focus?: boolean; internet?: boolean }> = ({ focus, internet }) => {
  const top = 110, base = 948, half = 800, cx = 960;
  const cuts = [top, 330, 490, 640, 795, base];
  const hw = (y: number) => ((y - top) / (base - top)) * half;
  const fills = ["rgba(245,184,61,0.30)", "rgba(34,211,238,0.18)", "rgba(150,160,175,0.15)", "rgba(150,160,175,0.10)", "rgba(150,160,175,0.06)"];
  const sizes = [112, 86, 74, 68, 68], gaps = [0, 230, 190, 175, 165];
  const pos = (i: number, j: number) => ({ x: cx + (j - (TIERS[i].length - 1) / 2) * gaps[i], y: i === 0 ? 236 : cuts[i] + 34 + sizes[i] / 2 });
  const kn = pos(1, 0), fk = pos(0, 0);
  const lit = (id: string) => (internet ? id in LISTS : !focus || id === "knight" || id === "faker");
  const hidden = (i: number) => internet && i < 3;
  return (
    <Stage glow="gold">
      <AbsoluteFill style={{ transform: focus ? "scale(1.45)" : undefined, transformOrigin: `${kn.x + 80}px ${top + 20}px` }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {TIERS.map((_, i) => {
            const y0 = cuts[i], y1 = cuts[i + 1];
            return <polygon key={i} points={`${cx - hw(y0)},${y0} ${cx + hw(y0)},${y0} ${cx + hw(y1)},${y1} ${cx - hw(y1)},${y1}`} fill={fills[i]}
              stroke="rgba(237,239,242,0.55)" strokeWidth={2} opacity={(focus && i > 1) || (internet && i < 3) ? 0.35 : 1} />;
          })}
        </svg>
        {TIERS.map((_, i) => (
          <div key={"t" + i} style={{ position: "absolute", left: i === 0 ? cx - 100 : cx - hw(cuts[i] + 30) + 18, width: 200, top: i === 0 ? top - 36 : cuts[i] + 14,
            textAlign: i === 0 ? "center" : "left", fontFamily: F.title,
            fontSize: 22, letterSpacing: 1.5, color: i === 0 ? C.gold : i === 1 ? C.cyan : "#AEB6C2", opacity: (focus && i > 1) || (internet && i < 3) ? 0.3 : 1 }}>TIER {i + 1}</div>
        ))}
        {TIERS.map((ids, i) => ids.map((id, j) => {
          const size = sizes[i]; const { x, y } = pos(i, j);
          const ring = i === 0 ? C.gold : i === 1 ? C.cyan : "#E9ECF1";
          if (hidden(i)) return <div key={id} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size,
            border: "3px dashed rgba(237,239,242,0.25)" }} />;
          return (
            <div key={id} style={{ opacity: lit(id) ? 1 : 0.25, filter: lit(id) ? undefined : "grayscale(1)" }}>
              <Face id={id} x={x} y={y} size={size} ring={i < 2 ? ring : "rgba(237,239,242,0.8)"} glow={i === 0 ? C.gold : i === 1 ? C.cyan : "rgba(0,0,0,0.6)"} />
              <div style={{ position: "absolute", left: x + size * 0.26, top: y - size * 0.64, minWidth: 26, padding: "0 6px", height: Math.max(22, size * 0.3), borderRadius: 12,
                background: ring, color: "#0B0B0F", fontFamily: F.title, fontSize: Math.max(17, size * 0.23),
                display: "flex", alignItems: "center", justifyContent: "center" }}>#{P(id).rank}</div>
              <div style={{ position: "absolute", left: x - 100, width: 200, top: y + size / 2 + 2, textAlign: "center", fontFamily: F.body, fontWeight: 800,
                fontSize: i === 0 ? 28 : i === 1 ? 24 : 20, color: i === 0 ? C.gold : i === 1 ? C.cyan : C.text, whiteSpace: "nowrap", lineHeight: 1.1,
                textShadow: "0 0 6px #0B0B0F" }}>{P(id).name.toUpperCase()}</div>
            </div>
          );
        }))}
        {internet && Object.entries(LISTS).map(([id, rows]) => {
          const i = TIERS.findIndex((t) => t.includes(id)); const { x, y } = pos(i, TIERS[i].indexOf(id));
          const cx0 = 1590, cy0 = id === "uzi" ? 450 : 640, cw = 300, ch = 104;
          // Uzi: straight line to the card; Bengi: elbow below the base so it never crosses Jankos.
          const pts = id === "uzi" ? `${x + 40},${y} ${cx0},${cy0 + ch / 2}` : `${x},${y + 66} ${x},${985} ${cx0 + 170},${985} ${cx0 + 170},${cy0 + ch}`;
          return (
            <React.Fragment key={"c" + id}>
              <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
                <polyline points={pts} fill="none" stroke="rgba(237,239,242,0.7)" strokeWidth={2} />
              </svg>
              <div style={{ position: "absolute", left: cx0, top: cy0, width: cw, height: ch, boxSizing: "border-box", padding: "12px 16px", background: "rgba(11,11,15,0.92)", border: "2px solid rgba(237,239,242,0.6)",
                borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
                {rows.map(([n, v]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: F.body, fontWeight: 800, lineHeight: 1.45 }}>
                    <span style={{ fontSize: 20, color: "#AEB6C2" }}>{n}</span>
                    <span style={{ fontSize: v === "LISTED" ? 20 : 28, color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
        {focus && (
          <>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={C.text} /></marker></defs>
              <path d={`M ${kn.x - 30} ${kn.y - 50} C ${kn.x - 100} ${kn.y - 130}, ${fk.x - 150} ${fk.y + 40}, ${fk.x - 72} ${fk.y + 10}`} stroke={C.text} strokeWidth={5}
                fill="none" strokeDasharray="14 10" markerEnd="url(#ah)" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }} />
            </svg>
            <div style={{ position: "absolute", left: kn.x - 470, top: (kn.y + fk.y) / 2 - 60, width: 300, textAlign: "right", fontFamily: F.title, fontSize: 40,
              letterSpacing: 1, color: CREAM, lineHeight: 1.05, textShadow: "0 0 12px #0B0B0F" }}>WHAT WOULD IT TAKE?</div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
export const S10Pyramid: React.FC = () => <Pyramid />;
export const S10bPyramidArrow: React.FC = () => <Pyramid focus />;
export const S10aPyramidInternet: React.FC = () => <Pyramid internet />;

// 11a. Knight vs Faker, part by part (v11 parts and weights, MODEL-CURRENT 18 Nov 17:20; "intangibles" is called Recognition on screen)
const PARTS: [string, number, number, number][] = [["TROPHIES", 40, 100, 46.1], ["BIG GAMES", 14, 94.1, 98.9], ["SKILL", 18, 78.6, 99.9],
  ["TEAM IMPACT", 12, 100, 84.6], ["YEARS AT THE TOP", 9, 100, 89.7], ["RECOGNITION", 7, 61.2, 77.5]];
export const S11aKnightVsFaker: React.FC = () => {
  const b: Box = { x0: 620, y0: 210, x1: 1640, y1: 830 };
  const X = (v: number) => b.x0 + ((v - 30) / 72) * (b.x1 - b.x0);
  const Y = (i: number) => b.y0 + 50 + i * ((b.y1 - b.y0 - 90) / (PARTS.length - 1));
  return (
    <Stage title="KNIGHT VS FAKER">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[40, 60, 80, 100].map((v) => <Big key={v} x={X(v)} y={b.y1 + 12} size={40} align="center" w={160}>{v}</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>PART SCORE
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg></div>
      <div style={{ position: "absolute", left: b.x0 - 150, width: 120, textAlign: "right", top: b.y0 - 34, fontFamily: F.title, fontSize: 30, letterSpacing: 1, color: "#8A94A3" }}>WEIGHT</div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {PARTS.map(([, , f, k], i) => {
          const kWin = k > f;
          return (
            <g key={i}>
              <line x1={X(f)} x2={X(k)} y1={Y(i)} y2={Y(i)} stroke={kWin ? "rgba(34,211,238,0.55)" : "rgba(245,184,61,0.55)"} strokeWidth={8} strokeLinecap="round" />
              <circle cx={X(f)} cy={Y(i)} r={15} fill={C.gold} style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />
              <circle cx={X(k)} cy={Y(i)} r={15} fill={C.cyan} style={{ filter: `drop-shadow(0 0 8px ${C.cyan})` }} />
            </g>
          );
        })}
      </svg>
      {PARTS.map(([n, w, f, k], i) => {
        const kWin = k > f;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: b.x0 - 600, width: 430, textAlign: "right", top: Y(i) - 24, fontFamily: F.title, fontSize: 40, letterSpacing: 1,
              color: kWin ? C.text : C.gold }}>{n}</div>
            <div style={{ position: "absolute", left: b.x0 - 150, width: 120, textAlign: "right", top: Y(i) - 22, fontFamily: F.title, fontSize: 40, color: "#8A94A3" }}>{w}%</div>
            <div style={{ position: "absolute", left: X(Math.max(f, k)) + 26, top: Y(i) - 20, fontFamily: F.body, fontWeight: 800, fontSize: 30,
              color: kWin ? C.cyan : C.gold, whiteSpace: "nowrap" }}>{kWin ? "+" + r0(k - f) : "-" + r0(f - k)}</div>
          </React.Fragment>
        );
      })}
      {/* legend: faces, top right */}
      <Face id="knight" x={1590} y={150} size={70} ring={C.cyan} glow={C.cyan} />
      <Big x={1640} y={128} size={36} color={C.cyan}>KNIGHT</Big>
      <Face id="faker" x={1390} y={150} size={70} />
      <Big x={1440} y={128} size={36} color={C.gold}>FAKER</Big>
    </Stage>
  );
};

// 12. Champion pool board (unweighted, research/champpool/pool_board.csv): champions played vs games played, whole pool.
type PoolRow = [string, string, number, number, number, string]; // id/link, name, games, champions, comfort, signature
export const S12ChampPool: React.FC = () => {
  const xr: [number, number] = [0, 1700], yr: [number, number] = [0, 96];
  const { X, Y } = scale(B, xr, yr);
  const rows = S.pool as PoolRow[];
  const at = (n: string) => rows.find((r) => r[1] === n)!;
  const named: [string, "left" | "right" | "above" | "below"][] = [["Flandre", "above"], ["Caps", "left"], ["Chovy", "below"], ["Knight", "right"], ["Ruler", "below"]];
  const fk = at("Faker");
  return (
    <Stage title="CHAMPION POOL">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 400, 800, 1200, 1600]} yt={[0, 20, 40, 60, 80]} xl="PRO GAMES PLAYED" yl="CHAMPIONS PLAYED" />
      {rows.filter((r) => r[1] !== "Faker").map((r) => (
        <Dot key={r[0]} x={X(r[2])} y={Y(r[3] + (hash(r[0]) - 0.5) * 0.8)} r={7} color={heat((r[3] - 15) / 65)} o={named.some(([n]) => n === r[1]) ? 1 : 0.75} />
      ))}
      {named.map(([n, side]) => { const r = at(n); return <Callout key={n} x={X(r[2])} y={Y(r[3])} name={n} value={String(r[3])} side={side} ring={20} />; })}
      <Face id="faker" x={X(fk[2])} y={Y(fk[3])} size={110} />
      <Callout x={X(fk[2])} y={Y(fk[3])} name="Faker" value={String(fk[3])} side="below" ring={0} pad={58} color={C.gold} size={1.3} />
    </Stage>
  );
};


// ---- Script v4 stills (model v11) ----
const BOARD = S.board as BoardRow[];

// 13. The trophy price list (MODEL-CURRENT v11: halfway blend of tradition and measured difficulty)
const PRICES: [string, number][] = [["WORLDS", 100], ["MSI", 56], ["LCK TITLE", 44], ["FIRST STAND", 40], ["LPL TITLE", 35], ["LEC TITLE", 12]];
export const S13PriceList: React.FC = () => {
  const b: Box = { x0: 620, y0: 230, x1: 1640, y1: 830 };
  const X = (v: number) => b.x0 + (v / 105) * (b.x1 - b.x0);
  const Y = (i: number) => b.y0 + 45 + i * ((b.y1 - b.y0 - 90) / (PRICES.length - 1));
  return (
    <Stage title="WHAT A TROPHY IS WORTH">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[0, 25, 50, 75, 100].map((v) => <Big key={v} x={X(v)} y={b.y1 + 12} size={40} align="center" w={160}>{v}</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>TROPHY POINTS
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg></div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {PRICES.map(([, v], i) => (
          <g key={i}>
            <line x1={X(0)} x2={X(v)} y1={Y(i)} y2={Y(i)} stroke={i === 0 ? "rgba(245,184,61,0.6)" : "rgba(237,239,242,0.35)"} strokeWidth={6} strokeLinecap="round" />
            <circle cx={X(v)} cy={Y(i)} r={i === 0 ? 20 : 15} fill={i === 0 ? C.gold : heat(v / 100)} style={{ filter: `drop-shadow(0 0 8px ${i === 0 ? C.gold : heat(v / 100)})` }} />
          </g>
        ))}
      </svg>
      {PRICES.map(([n, v], i) => (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: b.x0 - 460, width: 430, textAlign: "right", top: Y(i) - 26, fontFamily: F.title, fontSize: 44, letterSpacing: 1,
            color: i === 0 ? C.gold : C.text }}>{n}</div>
          <div style={{ position: "absolute", left: X(v) + 32, top: Y(i) - 24, fontFamily: F.body, fontWeight: 800, fontSize: 38, color: i === 0 ? C.gold : C.text }}>{v}</div>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// 14. Titles ranked by difficulty: coin flips in a row an elite team would need on the champion's real path (2016 on)
type Ev = [string, string, string, number, number];
export const S14Hardest: React.FC = () => {
  const ev = (S.events as Ev[]).filter((e) => e[1] === "worlds" || e[1] === "msi");
  const xr: [number, number] = [2015.5, 2026.8], yr: [number, number] = [0, 10];
  const { X, Y } = scale(B, xr, yr);
  const lit = (e: Ev) => e[1] === "worlds" && (e[3] === 2024 || e[3] === 2026);
  const label = (e: Ev) => (e[3] === 2024 ? "T1 2024" : "BLG 2026");
  return (
    <Stage title="THE HARDEST TITLES">
      <Axes b={B} xr={xr} yr={yr} xt={[2016, 2018, 2020, 2022, 2024, 2026]} yt={[0, 2, 4, 6, 8, 10]} xl="YEAR" yl="COIN FLIPS IN A ROW" xf={(v) => String(v)} />
      {ev.filter((e) => !lit(e)).map((e) => e[1] === "worlds"
        ? <Star key={e[0]} x={X(e[3] - 0.15)} y={Y(e[4])} r={14} color={heat(e[4] / 9)} o={0.95} />
        : <Dot key={e[0]} x={X(e[3] + 0.15)} y={Y(e[4])} r={8} color="rgba(190,196,206,0.7)" />)}
      {ev.filter(lit).map((e) => (
        <React.Fragment key={e[0]}>
          <Star x={X(e[3] - 0.15)} y={Y(e[4])} r={20} color={C.gold} />
          <Callout x={X(e[3] - 0.15)} y={Y(e[4])} name={label(e)} value={e[4].toFixed(1)} side={e[3] === 2024 ? "left" : "right"} ring={28} color={C.gold} size={1.2} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: B.x1 - 330, top: B.y1 - 110, fontFamily: F.body, fontWeight: 800, fontSize: 24, color: C.text, lineHeight: 1.6 }}>
        <span style={{ color: C.gold }}>★</span> WORLDS &nbsp;&nbsp; <span style={{ color: "rgba(190,196,206,0.9)" }}>●</span> MSI
      </div>
    </Stage>
  );
};

// 15. Team impact: plus-minus wins added over a career (v11, data/csv/rapm_career.csv)
type Imp = [string, string, number, number];
export const S15Impact: React.FC = () => {
  const rows = S.impact as Imp[];
  const xr: [number, number] = [0, 1700], yr: [number, number] = [-40, 125];
  const { X, Y } = scale(B, xr, yr);
  const fk = rows.find((r) => r[0] === "faker")!;
  const named: [string, "left" | "right" | "above" | "below"][] = [["ruler", "right"], ["chovy", "left"]];
  return (
    <Stage title="WHO MAKES THE TEAM WIN">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 400, 800, 1200, 1600]} yt={[-40, 0, 40, 80, 120]} xl="GAMES PLAYED" yl="WINS ADDED" />
      <div style={{ position: "absolute", left: B.x0, top: Y(0), width: B.x1 - B.x0 + 30, borderTop: "2px dashed rgba(237,239,242,0.35)" }} />
      {rows.filter((r) => r[0] !== "faker").map((r) => <Dot key={r[0]} x={X(r[2])} y={Y(r[3])} r={7} color={heat((r[3] + 20) / 90)} o={0.8} />)}
      {named.map(([id, side]) => { const r = rows.find((q) => q[0] === id)!; return <Callout key={id} x={X(r[2])} y={Y(r[3])} name={P(id).name} value={"+" + r0(r[3])} side={side} ring={20} />; })}
      <Face id="faker" x={X(fk[2])} y={Y(fk[3])} size={110} />
      <Callout x={X(fk[2])} y={Y(fk[3])} name="Faker" value={"+" + r0(fk[3])} side="left" ring={0} pad={62} color={C.gold} size={1.3} />
    </Stage>
  );
};

// 16. Clutch vs luck: best-of-five and best-of-three series won above what the team ratings expected, with the luck band
// (2 standard deviations of pure coin flips: about the square root of the series played)
type Cl = [string, string, number, number];
export const S16Clutch: React.FC = () => {
  const rows = S.clutch as Cl[];
  const xr: [number, number] = [0, 260], yr: [number, number] = [-22, 30];
  const { X, Y } = scale(B, xr, yr);
  const band = Array.from({ length: 53 }, (_, i) => i * 5);
  const up = band.map((n) => `${X(n)},${Y(Math.sqrt(n))}`).join(" ");
  const dn = band.slice().reverse().map((n) => `${X(n)},${Y(-Math.sqrt(n))}`).join(" ");
  const fk = rows.find((r) => r[0] === "faker")!;
  const named: [string, "left" | "right" | "above" | "below"][] = [["bin", "above"], ["gumayusi", "left"]];
  return (
    <Stage title="CLUTCH OR LUCK">
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <polygon points={up + " " + dn} fill="rgba(150,160,175,0.16)" stroke="rgba(190,196,206,0.4)" strokeWidth={2} />
      </svg>
      <Big x={X(200)} y={Y(-11)} size={40} color="#9AA3B1" align="center" w={300}>LUCK</Big>
      <Axes b={B} xr={xr} yr={yr} xt={[0, 50, 100, 150, 200, 250]} yt={[-20, -10, 0, 10, 20, 30]} xl="SERIES PLAYED" yl="SERIES WON ABOVE EXPECTED" yf={(v) => (v > 0 ? "+" + v : String(v))} />
      {rows.filter((r) => r[0] !== "faker").map((r) => <Dot key={r[0]} x={X(r[2])} y={Y(r[3])} r={6} color={heat((r[3] + 8) / 26)} o={r[3] > Math.sqrt(r[2]) ? 1 : 0.6} />)}
      {named.map(([id, side]) => { const r = rows.find((q) => q[0] === id)!; return <Callout key={id} x={X(r[2])} y={Y(r[3])} name={P(id).name} value={"+" + r0(r[3])} side={side} ring={18} />; })}
      <Face id="faker" x={X(fk[2])} y={Y(fk[3])} size={100} />
      <Callout x={X(fk[2])} y={Y(fk[3])} name="Faker" value={"+" + r0(fk[3])} side="left" ring={0} pad={56} color={C.gold} size={1.3} />
    </Stage>
  );
};

// 17. The score card: six parts and their weights (v11). Recognition = All-Pro votes plus team record with and without him.
const CARD: [string, number, string][] = [["TROPHIES", 40, C.gold], ["SKILL", 18, "#5CBE50"], ["BIG GAMES + CLUTCH", 14, "#22D3EE"],
  ["TEAM IMPACT", 12, "#E8CD3A"], ["LONGEVITY", 9, "#F27828"], ["RECOGNITION", 7, "#C77DFF"]];
export const S17ScoreCard: React.FC = () => {
  const x0 = 160, x1 = 1760, y = 470, h = 120;
  const W = (v: number) => (v / 100) * (x1 - x0);
  let acc = 0;
  return (
    <Stage title="THE SCORE, OUT OF 100">
      {CARD.map(([n, w, c], i) => {
        const left = x0 + W(acc); acc += w;
        const above = i % 2 === 0;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: left + 2, top: y, width: W(w) - 4, height: h, background: c, opacity: 0.9, borderRadius: 6,
              boxShadow: `0 0 18px ${c}55` }} />
            <div style={{ position: "absolute", left: left + 2, width: W(w) - 4, top: y + h / 2 - 34, textAlign: "center", fontFamily: F.title, fontSize: w >= 12 ? 56 : 44,
              color: "#0B0B0F" }}>{w}%</div>
            <div style={{ position: "absolute", left: left + W(w) / 2 - 200, width: 400, textAlign: "center", top: above ? y - 70 : y + h + 22,
              fontFamily: F.title, fontSize: 36, letterSpacing: 1, color: c, whiteSpace: "nowrap" }}>{n}</div>
          </React.Fragment>
        );
      })}
      {/* a real scale under the card */}
      <div style={{ position: "absolute", left: x0, top: 780, width: x1 - x0, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[0, 20, 40, 60, 80, 100].map((v) => (
        <React.Fragment key={v}>
          <div style={{ position: "absolute", left: x0 + W(v) - 1, top: 772, width: 3, height: 18, background: "rgba(237,239,242,0.85)" }} />
          <Big x={x0 + W(v)} y={796} size={40} align="center" w={140}>{v}</Big>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// 18. Most skilled: skill part vs games (Chovy 100, Knight 99.9)
export const S18Skill: React.FC = () => {
  const pts = BOARD.filter((r) => r[3] !== null && (r[3] as number) >= 40).map((r) => ({ id: r[0], x: r[2], y: r[3] as number }));
  const xr: [number, number] = [0, 1700], yr: [number, number] = [40, 104];
  const { X, Y } = scale(B, xr, yr);
  const at = (id: string) => pts.find((q) => q.id === id)!;
  const ch = at("chovy");
  return (
    <Stage title="MOST SKILLED">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 400, 800, 1200, 1600]} yt={[40, 50, 60, 70, 80, 90, 100]} xl="GAMES PLAYED" yl="SKILL SCORE" />
      {pts.filter((d) => d.id !== "chovy").map((d) => <Dot key={d.id} x={X(d.x)} y={Y(d.y)} r={7} color={heat((d.y - 40) / 60)} o={0.8} />)}
      {([["knight", "right"], ["keria", "below"], ["faker", "below"]] as [string, "right" | "below"][]).map(([id, side]) => {
        const d = at(id); return <Callout key={id} x={X(d.x)} y={Y(d.y)} name={P(id).name} value={d.y >= 99.5 ? d.y.toFixed(1) : r0(d.y)} side={side} ring={20} />;
      })}
      <Face id="chovy" x={X(ch.x)} y={Y(ch.y)} size={92} ring={"#5CBE50"} glow={"#5CBE50"} />
      <Callout x={X(ch.x)} y={Y(ch.y)} name="Chovy" value="100" side="left" ring={0} pad={52} color={"#5CBE50"} size={1.25} />
    </Stage>
  );
};

// 19. Titles with different teams (Peanut 5)
export const S19Teams: React.FC = () => {
  const pts = BOARD.filter((r) => r[6] > 0);
  const xr: [number, number] = [0, 21], yr: [number, number] = [0, 5.8];
  const { X, Y } = scale(B, xr, yr);
  const pn = pts.find((r) => r[0] === "peanut")!;
  const named: [string, "left" | "right" | "above" | "below"][] = [["deft", "left"], ["mata", "right"], ["faker", "above"]];
  const nx: Record<string, number> = { deft: -0.5, mata: 0.5, faker: 0 };
  const px = (r: BoardRow) => r[6] + (r[0] in nx ? nx[r[0]] : (hash(r[0]) - 0.5) * 0.6);
  const py = (r: BoardRow) => r[5] + (r[0] in nx ? 0 : (hash(r[0] + "y") - 0.5) * 0.3);
  return (
    <Stage title="TITLES WITH DIFFERENT TEAMS">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 4, 8, 12, 16, 20]} yt={[1, 2, 3, 4, 5]} xl="TITLES WON" yl="TEAMS" />
      {pts.filter((r) => r[0] !== "peanut").map((r) => (
        <Dot key={r[0]} x={X(px(r))} y={Y(py(r))} r={7} color={heat((r[5] - 1) / 3.5)} o={0.85} />
      ))}
      {named.map(([id, side]) => { const r = pts.find((q) => q[0] === id); if (!r) return null;
        return <Callout key={id} x={X(px(r))} y={Y(py(r))} name={r[1]} value={String(r[5])} side={side} ring={18} />; })}
      <Face id="peanut" x={X(pn[6])} y={Y(pn[5])} size={96} ring={"#5CBE50"} glow={"#5CBE50"} />
      <Callout x={X(pn[6])} y={Y(pn[5])} name="Peanut" value="5 TEAMS" side="right" ring={0} pad={54} color={"#5CBE50"} size={1.25} />
    </Stage>
  );
};

// 20 and 21. The field: world titles vs % of Faker. Bengi (#44) and Gumayusi (#11) are lit; the model can't see shotcalling.
const Field: React.FC<{ id: string; title: string; note?: React.ReactNode }> = ({ id, title, note }) => {
  const xr: [number, number] = [-0.5, 6.6], yr: [number, number] = [15, 105];
  const { X, Y } = scale(B, xr, yr);
  const jx = (r: BoardRow) => (r[0] === id ? 0 : (hash(r[0]) - 0.5) * 0.6);
  const me = BOARD.find((r) => r[0] === id)!;
  const fk = BOARD.find((r) => r[0] === "faker")!;
  return (
    <Stage title={title}>
      <Axes b={B} xr={xr} yr={yr} xt={[0, 1, 2, 3, 4, 5, 6]} yt={[20, 40, 60, 80, 100]} xl="WORLDS WON" yl="% OF FAKER" yf={(v) => v + "%"} />
      {BOARD.filter((r) => r[0] !== id && r[0] !== "faker").map((r) => <Dot key={r[0]} x={X(r[7] + jx(r))} y={Y(r[8])} r={7} color={heat((r[8] - 20) / 55)} o={0.75} />)}
      <Face id="faker" x={X(6)} y={Y(100)} size={84} />
      <Callout x={X(6)} y={Y(100)} name="Faker" side="left" ring={0} pad={48} color={C.gold} />
      <Face id={id} x={X(me[7])} y={Y(me[8])} size={92} ring={C.cyan} glow={C.cyan} />
      <Callout x={X(me[7])} y={Y(me[8])} name={me[1] + "  #" + P(id).rank} value={r0(me[8]) + "%"} side="right" ring={0} pad={52} color={C.cyan} size={1.25} />
      {note}
    </Stage>
  );
};
export const S20Bengi: React.FC = () => (
  <Field id="bengi" title="WHAT THE MODEL CAN'T SEE" note={
    <div style={{ position: "absolute", left: 1180, top: 610, width: 520, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.text, lineHeight: 1.3 }}>
      SHOTCALLING, COMMS, THE VOICE IN THE ROOM</div>} />
);
export const S21Gumayusi: React.FC = () => (
  <Field id="gumayusi" title="LONG WAY TO GO" note={
    <div style={{ position: "absolute", left: 1010, top: 580, width: 680, padding: "22px 28px", background: "rgba(11,11,15,0.85)", borderLeft: `6px solid ${C.cyan}`,
      fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, lineHeight: 1.35 }}>
      "If my goal was to become the best player in the world, I couldn't stay with T1 forever."
      <div style={{ marginTop: 12, fontSize: 22, color: "#9AA3B1" }}>GUMAYUSI, DAILY ESPORTS (TRANSLATED)</div>
    </div>} />
);

// 22. Not every league plays the same game: kills per game, LPL vs LCK, by year (games_2016on.csv)
export const S22Kills: React.FC = () => {
  const K = S.kills as Record<string, Record<string, number>>;
  const all = S.killsAll as Record<string, number>;
  const xr: [number, number] = [2015.6, 2026.6], yr: [number, number] = [16, 32];
  const { X, Y } = scale(B, xr, yr);
  const col: Record<string, string> = { LPL: "#E8392B", LCK: "#4F8DF5" };
  const line = (rg: string) => Object.entries(K[rg]).map(([y, v]) => `${X(Number(y))},${Y(v)}`).join(" L ");
  return (
    <Stage title="MORE FIGHTING IN THE LPL">
      <Axes b={B} xr={xr} yr={yr} xt={[2016, 2018, 2020, 2022, 2024, 2026]} yt={[16, 20, 24, 28, 32]} xl="YEAR" yl="KILLS PER GAME" xf={(v) => String(v)} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {["LCK", "LPL"].map((rg) => (
          <g key={rg} style={{ filter: `drop-shadow(0 0 8px ${col[rg]})` }}>
            <path d={"M " + line(rg)} stroke={col[rg]} strokeWidth={6} fill="none" />
            {Object.entries(K[rg]).map(([y, v]) => <circle key={y} cx={X(Number(y))} cy={Y(v)} r={8} fill={col[rg]} />)}
          </g>
        ))}
      </svg>
      {["LPL", "LCK"].map((rg) => (
        <div key={rg} style={{ position: "absolute", left: rg === "LPL" ? 420 : 900, top: rg === "LPL" ? Y(29.5) : Y(19), whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: F.title, fontSize: 52, letterSpacing: 1, color: col[rg] }}>{rg}</div>
          <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.text }}>{all[rg]} A GAME</div>
        </div>
      ))}
    </Stage>
  );
};

// 23. Does it work? Picking each year's first-team All-Pros on held-out 2022-26 (validate.py)
const TEST: [string, number][] = [["PICKING AT RANDOM", 12], ["PICKING WINNERS", 58], ["MY MODEL", 63]];
export const S23AllPro: React.FC = () => {
  const b: Box = { x0: 620, y0: 300, x1: 1640, y1: 760 };
  const X = (v: number) => b.x0 + (v / 100) * (b.x1 - b.x0);
  const Y = (i: number) => b.y0 + 60 + i * 140;
  return (
    <Stage title="DOES IT WORK?">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[0, 25, 50, 75, 100].map((v) => <Big key={v} x={X(v)} y={b.y1 + 12} size={40} align="center" w={160}>{v}%</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>ALL-PROS PICKED RIGHT
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg></div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {TEST.map(([, v], i) => (
          <g key={i}>
            <line x1={X(0)} x2={X(v)} y1={Y(i)} y2={Y(i)} stroke={i === 2 ? "rgba(92,190,80,0.6)" : "rgba(237,239,242,0.3)"} strokeWidth={6} strokeLinecap="round" />
            <circle cx={X(v)} cy={Y(i)} r={i === 2 ? 22 : 15} fill={i === 2 ? "#5CBE50" : heat(v / 100)} style={{ filter: `drop-shadow(0 0 10px ${i === 2 ? "#5CBE50" : heat(v / 100)})` }} />
          </g>
        ))}
      </svg>
      {TEST.map(([n, v], i) => (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: b.x0 - 560, width: 530, textAlign: "right", top: Y(i) - 26, fontFamily: F.title, fontSize: 46, letterSpacing: 1,
            color: i === 2 ? "#5CBE50" : C.text }}>{n}</div>
          <div style={{ position: "absolute", left: X(v) + 36, top: Y(i) - 30, fontFamily: F.body, fontWeight: 800, fontSize: i === 2 ? 52 : 40, color: i === 2 ? "#5CBE50" : C.text }}>{v}%</div>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// 24. Five players lift a trophy: BLG's Worlds 2026 credit per starter, inside the 0.85 to 1.15 band (title_credits.csv)
export const S24Credit: React.FC = () => {
  const rows = (S.blgCredit as [string, string, number][]).slice().sort((a, b) => b[2] - a[2]);
  const b: Box = { x0: 520, y0: 230, x1: 1640, y1: 820 };
  const X = (v: number) => b.x0 + ((v - 0.8) / 0.4) * (b.x1 - b.x0);
  const Y = (i: number) => b.y0 + 60 + i * ((b.y1 - b.y0 - 110) / 4);
  return (
    <Stage title="FIVE PLAYERS LIFT A TROPHY">
      <div style={{ position: "absolute", left: X(0.85), top: b.y0 - 10, width: X(1.15) - X(0.85), height: b.y1 - b.y0 + 10, background: "rgba(34,211,238,0.10)",
        borderLeft: "2px dashed rgba(34,211,238,0.5)", borderRight: "2px dashed rgba(34,211,238,0.5)" }} />
      <div style={{ position: "absolute", left: X(1) - 1, top: b.y0 - 10, width: 2, height: b.y1 - b.y0 + 10, background: "rgba(237,239,242,0.35)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[0.8, 0.9, 1, 1.1, 1.2].map((v) => <Big key={v} x={X(v)} y={b.y1 + 12} size={40} align="center" w={160}>{v.toFixed(1)}x</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SHARE OF THE TITLE
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg></div>
      {rows.map(([id, n, v], i) => (
        <React.Fragment key={id}>
          <div style={{ position: "absolute", left: Math.min(X(1), X(v)), top: Y(i) - 4, width: Math.abs(X(v) - X(1)), height: 8, background: "rgba(34,211,238,0.6)", borderRadius: 4 }} />
          <Face id={id} x={X(v)} y={Y(i)} size={70} ring={C.cyan} glow={"rgba(34,211,238,0.5)"} />
          <div style={{ position: "absolute", left: b.x0 - 360, width: 330, textAlign: "right", top: Y(i) - 26, fontFamily: F.title, fontSize: 44, color: C.text }}>{n.toUpperCase()}</div>
          <div style={{ position: "absolute", ...(v < 1 ? { left: X(v) - 166, width: 120, textAlign: "right" as const } : { left: X(v) + 46 }), top: Y(i) - 20, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.cyan }}>{v.toFixed(2)}x</div>
        </React.Fragment>
      ))}
      <Big x={X(1.15) - 10} y={b.y0 - 50} size={30} align="right" w={600} color={C.cyan}>ALLOWED RANGE 0.85x TO 1.15x</Big>
    </Stage>
  );
};

// SAMPLE (ay 18:32, wider chart forms): Knight vs Faker as a radar, same v11 PARTS as still 20. Each part is 0 to 100,
// pool median 50 (dashed ring), so the shapes are on one honest scale from 0.
export const SampleKnightRadar: React.FC = () => {
  const cx = 820, cy = 545, R = 300;
  const ang = (i: number) => ((-90 + 60 * i) * Math.PI) / 180;
  const pt = (i: number, v: number) => [cx + Math.cos(ang(i)) * R * v / 100, cy + Math.sin(ang(i)) * R * v / 100];
  const poly = (k: 2 | 3) => PARTS.map((p, i) => pt(i, p[k]).join(",")).join(" ");
  const label = (i: number) => {
    const [x, y] = pt(i, 100); const c = Math.cos(ang(i)), s = Math.sin(ang(i));
    const align: "left" | "right" | "center" = Math.abs(c) < 0.1 ? "center" : c > 0 ? "left" : "right";
    return { x: x + c * 34, y: y + s * 34 - (s < -0.9 ? 52 : s > 0.9 ? 0 : 24), align };
  };
  const [kx, ky] = pt(0, PARTS[0][3]), [fx, fy] = pt(0, 100);
  return (
    <Stage title="KNIGHT VS FAKER" glow="split">
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {[25, 50, 75, 100].map((v) => (
          <polygon key={v} points={PARTS.map((_, i) => pt(i, v).join(",")).join(" ")} fill="none"
            stroke={v === 50 ? "rgba(237,239,242,0.55)" : "rgba(237,239,242,0.16)"} strokeWidth={v === 100 ? 2.5 : 2} strokeDasharray={v === 50 ? "10 8" : undefined} />
        ))}
        {PARTS.map((_, i) => { const [x, y] = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(237,239,242,0.35)" strokeWidth={2} />; })}
        <polygon points={poly(2)} fill="rgba(245,184,61,0.10)" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
        <polygon points={poly(3)} fill="rgba(34,211,238,0.20)" stroke={C.cyan} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
        {PARTS.map((p, i) => { const [x, y] = pt(i, p[3]); return <circle key={"k" + i} cx={x} cy={y} r={9} fill={C.cyan} />; })}
        {PARTS.map((p, i) => { const [x, y] = pt(i, p[2]); return <circle key={"f" + i} cx={x} cy={y} r={8} fill={C.gold} />; })}
      </svg>
      {[25, 50, 75].map((v) => { const a = (150 * Math.PI) / 180; const r = R * v / 100 * Math.cos(Math.PI / 6) + (v === 100 ? 34 : -6);
        return <Big key={v} x={cx + Math.cos(a) * r} y={cy + Math.sin(a) * r - 16} size={26} color="#8A94A3" align="center" w={80}>{v}</Big>; })}
      <div style={{ position: "absolute", left: cx + Math.cos((150 * Math.PI) / 180) * 124 + 28, top: cy + Math.sin((150 * Math.PI) / 180) * 124 - 10,
        fontFamily: F.body, fontWeight: 800, fontSize: 18, color: "#AEB6C2", letterSpacing: 1 }}>AVERAGE PRO</div>
      {PARTS.map(([n], i) => { const l = label(i); return <Big key={n} x={l.x} y={l.y} size={38} align={l.align} w={420}
        color={PARTS[i][3] > PARTS[i][2] ? C.cyan : C.gold}>{n}</Big>; })}
      <Big x={kx + 14} y={ky + 8} size={44} color={C.cyan} w={200}>{r0(PARTS[0][3])}</Big>
      <Big x={fx - 20} y={fy - 44} size={44} align="right" color={C.gold} w={200}>100</Big>
      <Face id="faker" x={1560} y={400} size={140} ring={C.gold} glow={C.gold} />
      <Big x={1560} y={480} size={48} align="center" color={C.gold} w={300}>#1 FAKER</Big>
      <Face id="knight" x={1560} y={680} size={140} ring={C.cyan} glow={C.cyan} />
      <Big x={1560} y={760} size={48} align="center" color={C.cyan} w={300}>#2 KNIGHT</Big>
    </Stage>
  );
};

// SAMPLE (ay 18:32, wider chart forms): most skilled as a dot histogram of the whole pool (one dot = one player,
// stacked by skill score), top 5 lit with faces, Faker as the gold benchmark. Same c_skill board as still 12.
export const SampleSkillSwarm: React.FC = () => {
  const b: Box = { x0: 240, y0: 300, x1: 1700, y1: 840 };
  const xr: [number, number] = [20, 102], yr: [number, number] = [0, 26];
  const { X, Y } = scale(b, xr, yr);
  const rows = BOARD.filter((r) => r[3] !== null).map((r) => ({ id: r[0], v: r[3] as number })).sort((a, z) => a.v - z.v);
  const stack: Record<number, number> = {};
  const dots = rows.map((r) => { const bin = Math.floor(r.v); const k = (stack[bin] = (stack[bin] ?? -1) + 1); return { ...r, x: X(bin + 0.5), y: Y(k + 0.5) }; });
  const top = [...dots].sort((a, z) => z.v - a.v).slice(0, 5).reverse();
  const at = (id: string) => dots.find((d) => d.id === id)!;
  const fk = at("faker");
  return (
    <Stage title="MOST SKILLED">
      <Axes b={b} xr={xr} yr={yr} xt={[25, 50, 75, 100]} yt={[0, 10, 20]} xl="SKILL SCORE" yl="PLAYERS" />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {dots.map((d) => <circle key={d.id} cx={d.x} cy={d.y} r={7.5} fill="rgba(174,182,194,0.42)" />)}
        <circle cx={fk.x} cy={fk.y} r={9} fill={C.gold} style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />
        {top.map((d, i) => {
          const fx = 1180 + i * 125, fy = 300;
          return <g key={d.id}><line x1={fx} y1={fy + 50} x2={d.x} y2={d.y - 10} stroke="rgba(34,211,238,0.6)" strokeWidth={2} />
            <circle cx={d.x} cy={d.y} r={9} fill={C.cyan} style={{ filter: `drop-shadow(0 0 8px ${C.cyan})` }} /></g>;
        })}
      </svg>
      {top.map((d, i) => {
        const fx = 1180 + i * 125, fy = 300;
        return <React.Fragment key={"f" + d.id}>
          <Face id={d.id} x={fx} y={fy} size={88} ring={C.cyan} glow="rgba(34,211,238,0.5)" />
          <Big x={fx} y={fy - 96} size={30} align="center" w={140} color={C.cyan}>{P(d.id).name.toUpperCase()}</Big>
        </React.Fragment>;
      })}
      <Big x={fk.x} y={fk.y - 64} size={32} align="center" w={200} color={C.gold}>FAKER</Big>
    </Stage>
  );
};

// SAMPLE (ay 18:32, wider chart forms): bump chart of the all-time rank at the end of each year (v11 rerun with data cut
// at each year, research/rank_by_year.csv, 2016 on). Ranks below 10 dive under the axis (clipped). Knight lit, Faker faint.
export const SampleRaceBump: React.FC = () => {
  const b: Box = { x0: 250, y0: 220, x1: 1500, y1: 830 };
  const xr: [number, number] = [2015.6, 2026.4], yr: [number, number] = [-10.6, -0.4];
  const { X, Y } = scale(b, xr, yr);
  const rows = S.bump as [string, string, (number | null)[]][];
  const yrs = Array.from({ length: 11 }, (_, i) => 2016 + i);
  const yOf = (r: number | null) => Y(-(r === null || r > 10 ? 12.5 : r));
  const path = (rk: (number | null)[]) => {
    let d = "";
    for (let i = 0; i < rk.length - 1; i++) {
      const a = rk[i], c = rk[i + 1];
      if ((a === null || a > 10) && (c === null || c > 10)) continue;
      const x0 = X(yrs[i]), x1 = X(yrs[i + 1]), y0 = yOf(a), y1 = yOf(c), m = (x0 + x1) / 2;
      d += `M ${x0} ${y0} C ${m} ${y0}, ${m} ${y1}, ${x1} ${y1} `;
    }
    return d;
  };
  const style = (id: string) => id === "knight" ? { s: C.cyan, w: 7, o: 1 } : id === "faker" ? { s: C.gold, w: 5, o: 0.45 } : { s: "rgba(174,182,194,1)", w: 3, o: 0.28 };
  const order = [...rows].sort((a, z) => (a[0] === "knight" ? 1 : a[0] === "faker" ? 0 : -1) - (z[0] === "knight" ? 1 : z[0] === "faker" ? 0 : -1));
  const end = rows.filter((r) => r[2][10] !== null && (r[2][10] as number) <= 10).sort((a, z) => (a[2][10] as number) - (z[2][10] as number));
  const kn = rows.find((r) => r[0] === "knight")![2];
  return (
    <Stage title="THE ALL-TIME RANKING, YEAR BY YEAR">
      <Axes b={b} xr={xr} yr={yr} xt={[2016, 2018, 2020, 2022, 2024, 2026]} yt={[-1, -5, -10]} xl="END OF YEAR" yl="RANK"
        xf={(v) => String(v)} yf={(v) => `#${-v}`} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <defs><clipPath id="bumpclip"><rect x={b.x0 + 2} y={b.y0 - 30} width={b.x1 - b.x0 + 60} height={b.y1 - b.y0 + 28} /></clipPath></defs>
        <g clipPath="url(#bumpclip)">
          {order.map(([id, , rk]) => { const st = style(id);
            return <path key={id} d={path(rk)} fill="none" stroke={st.s} strokeWidth={st.w} strokeOpacity={st.o} strokeLinecap="round"
              style={id === "knight" ? { filter: `drop-shadow(0 0 10px ${C.cyan})` } : undefined} />; })}
        </g>
        {kn.map((r, i) => r !== null && r <= 10 ? <circle key={i} cx={X(yrs[i])} cy={yOf(r)} r={11} fill={C.cyan} /> : null)}
      </svg>
      {kn.map((r, i) => r !== null && r <= 10 ? <Big key={"k" + i} x={X(yrs[i])} y={yOf(r) - 58} size={36} align="center" w={80} color={C.cyan}>#{r}</Big> : null)}
      {end.map(([id, name, rk]) => (
        <div key={id} style={{ position: "absolute", left: b.x1 + 34, top: yOf(rk[10]) - 18, fontFamily: F.body, fontWeight: 800, fontSize: id === "knight" ? 30 : 24,
          color: id === "knight" ? C.cyan : id === "faker" ? C.gold : "#AEB6C2", whiteSpace: "nowrap", lineHeight: "36px" }}>{name.toUpperCase()}</div>
      ))}
      <Face id="knight" x={b.x1 + 250} y={yOf(2)} size={92} ring={C.cyan} glow="rgba(34,211,238,0.6)" />
      {/* #2 holders on their lines (script v4 VO, 19:00): Bang 2016-22, Ruler 2023, Chovy 2024-25, then Knight */}
      {([["BANG", 2019], ["RULER", 2023], ["CHOVY", 2024.5]] as [string, number][]).map(([n, yv]) => (
        <div key={n} style={{ position: "absolute", left: X(yv) - 80, width: 160, top: yOf(2) - 40, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 24,
          color: "#D6DBE2", letterSpacing: 1, textShadow: "0 0 6px #0B0B0F, 0 0 6px #0B0B0F" }}>{n}</div>
      ))}
    </Stage>
  );
};

// SAMPLE (ay 18:37, Jxmy "with and without" ref): team win % with him vs without him. research/with_without.csv
// (domestic games, team's record within 2 years of his stint, Leaguepedia event totals). Keria left out: his "without"
// years are the Faker-era T1, so it says nothing about him (League thread, 18:46).
const yearsShort = (s: string) => {
  const y = s.split(",").filter(Boolean).map(Number); const out: string[] = [];
  for (let i = 0; i < y.length; ) { let j = i; while (j + 1 < y.length && y[j + 1] === y[j] + 1) j++;
    out.push(j > i ? `${y[i]}-${String(y[j]).slice(2)}` : `${y[i]}`); i = j + 1; }
  return out.join(" + ");
};
export const SampleWithWithout: React.FC = () => {
  const b: Box = { x0: 270, y0: 250, x1: 1720, y1: 780 };
  const { Y } = scale(b, [0, 1], [0, 100]);
  const rows = S.withWithout as [string, string, string, number, number, number, number, string][];
  const gw = (b.x1 - b.x0) / rows.length, bw = 112;
  return (
    <Stage title="WITH HIM VS WITHOUT HIM">
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 22, letterSpacing: 1.5, color: "#8A94A3" }}>
        DOMESTIC GAMES, TEAM'S RECORD WITHIN 2 YEARS OF HIS STINT</div>
      <Axes b={b} xr={[0, 1]} yr={[0, 100]} xt={[]} yt={[0, 25, 50, 75, 100]} xl="" yl="TEAM WIN %" xArrow={false} yf={(v) => `${v}%`} />
      {rows.map(([id, , abbr, wW, wL, oW, oL, yrs], i) => {
        const cx = b.x0 + gw * (i + 0.5), xa = cx - bw - 10, xb = cx + 10;
        const pw = (100 * wW) / (wW + wL), po = oW + oL ? (100 * oW) / (oW + oL) : null;
        const lit = id === "knight", fk = id === "faker";
        const colW = lit ? C.cyan : fk ? "rgba(245,184,61,0.55)" : "rgba(214,219,226,0.75)";
        return (
          <React.Fragment key={id}>
            <div style={{ position: "absolute", left: xa, top: Y(pw), width: bw, height: b.y1 - Y(pw), background: colW, borderRadius: "14px 14px 0 0",
              boxShadow: lit ? `0 0 26px rgba(34,211,238,0.45)` : undefined }} />
            <Big x={xa + bw / 2} y={Y(pw) + 14} size={36} align="center" w={bw} color="#0B0B0F">{pw.toFixed(1)}%</Big>
            <Face id={id} x={xa + bw / 2} y={Y(pw) - 58} size={96} ring={lit ? C.cyan : fk ? C.gold : "#E9ECF1"} glow={lit ? "rgba(34,211,238,0.6)" : "rgba(0,0,0,0.5)"} />
            {po !== null ? (
              <>
                <div style={{ position: "absolute", left: xb, top: Y(po), width: bw, height: b.y1 - Y(po), background: "rgba(120,128,140,0.45)", borderRadius: "14px 14px 0 0" }} />
                <Big x={xb + bw / 2} y={Y(po) + 14} size={36} align="center" w={bw} color={C.text}>{po.toFixed(1)}%</Big>
                <div style={{ position: "absolute", left: xb + bw / 2 - 72, top: Y(po) - 92, width: 144, height: 60, borderRadius: "50%",
                  border: `3px solid ${lit ? C.cyan : "rgba(237,239,242,0.7)"}`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: F.title, fontSize: 36, color: lit ? C.cyan : C.text }}>+{(pw - po).toFixed(1)}</div>
              </>
            ) : (
              <div style={{ position: "absolute", left: xb - 10, width: bw + 20, top: b.y1 - 92, textAlign: "center", fontFamily: F.title, fontSize: 30, lineHeight: 1.05,
                color: C.gold }}>0 GAMES<br />WITHOUT</div>
            )}
            <div style={{ position: "absolute", left: xa - 10, width: bw + 20, top: b.y1 + 10, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 19, color: "#AEB6C2" }}>WITH</div>
            <div style={{ position: "absolute", left: xb - 50, width: bw + 100, top: b.y1 + 10, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 19, color: "#AEB6C2", lineHeight: 1.15, whiteSpace: "nowrap" }}>
              WITHOUT{yrs ? <><br />{yearsShort(yrs)}</> : null}</div>
            <Big x={cx} y={b.y1 + 66} size={42} align="center" w={gw} color={lit ? C.cyan : fk ? C.gold : C.text}>{P(id).name.toUpperCase()} · {abbr}</Big>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// ---------- Round 4 shapes (ay 18:52: vary the chart types; with/without bars were "a breath of fresh air") ----------
const Cup: React.FC<{ x: number; y: number; s: number; color: string; glow?: boolean }> = ({ x, y, s, color, glow }) => (
  <svg style={{ position: "absolute", left: x - s / 2, top: y - s / 2, filter: glow ? `drop-shadow(0 0 8px ${color})` : undefined }} width={s} height={s} viewBox="0 0 64 64">
    <path d="M16 6 H48 V20 C48 32 40 38 32 38 C24 38 16 32 16 20 Z M16 10 H6 V16 C6 24 12 28 18 28 M48 10 H58 V16 C58 24 52 28 46 28" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M16 6 H48 V20 C48 32 40 38 32 38 C24 38 16 32 16 20 Z" fill={color} />
    <rect x={28} y={38} width={8} height={12} fill={color} /><rect x={18} y={50} width={28} height={8} rx={2} fill={color} />
  </svg>
);

// 10 (round 4). Biggest stage as towers: the big stage board (c_big_stage), top 5, faces on top, average pro line.
export const R4BigStage: React.FC = () => {
  const b: Box = { x0: 300, y0: 250, x1: 1640, y1: 800 };
  const { Y } = scale(b, [0, 1], [0, 108]);
  const top = (S.board as BoardRow[]).filter((r) => r[4] !== null).sort((a, z) => (z[4] as number) - (a[4] as number)).slice(0, 5);
  const pad = 120, gw = (b.x1 - b.x0 - pad) / top.length, bw = 130;
  return (
    <Stage title="BIGGEST STAGE">
      <Axes b={b} xr={[0, 1]} yr={[0, 108]} xt={[]} yt={[0, 25, 50, 75, 100]} xl="" yl="SCORE" xArrow={false} />
      <div style={{ position: "absolute", left: b.x0, width: b.x1 - b.x0 + 30, top: Y(50), borderTop: "3px dashed rgba(237,239,242,0.45)" }} />
      <div style={{ position: "absolute", left: b.x1 - 210, top: Y(50) + 8, fontFamily: F.body, fontWeight: 800, fontSize: 20, color: "#AEB6C2", letterSpacing: 1 }}>AVERAGE PRO</div>
      {top.map((r, i) => {
        const v = r[4] as number, x = b.x0 + pad + gw * (i + 0.5) - bw / 2, kn = r[0] === "knight", first = i === 0;
        const col = first ? C.cyan : "rgba(214,219,226,0.72)";
        return (
          <React.Fragment key={r[0]}>
            <div style={{ position: "absolute", left: x, top: Y(v), width: bw, height: b.y1 - Y(v), background: col, borderRadius: "16px 16px 0 0",
              boxShadow: first ? "0 0 26px rgba(34,211,238,0.45)" : undefined }} />
            <Big x={x + bw / 2} y={Y(v) + 16} size={44} align="center" w={bw} color="#0B0B0F">{r0(v)}</Big>
            <Face id={r[0]} x={x + bw / 2} y={Y(v) - 64} size={104} ring={first ? C.cyan : "#E9ECF1"} glow={first ? "rgba(34,211,238,0.6)" : "rgba(0,0,0,0.5)"} />
            <Big x={x + bw / 2} y={b.y1 + 16} size={40} align="center" w={gw} color={first || kn ? C.cyan : C.text}>{r[1].toUpperCase()}</Big>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// 13 (round 4). Titles with different teams as a timeline: one row per player, a pill per team, a cup per title.
export const R4TeamsTimeline: React.FC = () => {
  const rows = S.titleTimeline as [string, [number, string][]][];
  const b: Box = { x0: 420, y0: 230, x1: 1620, y1: 830 };
  const xr: [number, number] = [2012.4, 2026.6];
  const { X } = scale(b, xr, [0, 1]);
  const pitch = (b.y1 - b.y0) / rows.length;
  return (
    <Stage title="TITLES WITH DIFFERENT TEAMS">
      <Axes b={b} xr={xr} yr={[0, 1]} xt={[2014, 2016, 2018, 2020, 2022, 2024, 2026]} yt={[]} xl="YEAR" yl="" xf={(v) => String(v)} />
      {rows.map(([id, ts], i) => {
        const cy = b.y0 + pitch * (i + 0.5), kn = id === "knight";
        const orgs: { org: string; y0: number; y1: number; per: Record<number, number> }[] = [];
        ts.forEach(([y, o]) => { let g = orgs.find((q) => q.org === o); if (!g) { g = { org: o, y0: y, y1: y, per: {} }; orgs.push(g); }
          g.y1 = Math.max(g.y1, y); g.per[y] = (g.per[y] ?? 0) + 1; });
        return (
          <React.Fragment key={id}>
            <Face id={id} x={b.x0 - 200} y={cy - 6} size={96} ring={kn ? C.cyan : "#E9ECF1"} glow={kn ? "rgba(34,211,238,0.6)" : "rgba(0,0,0,0.5)"} />
            <Big x={b.x0 - 200} y={cy + 44} size={30} align="center" w={200} color={kn ? C.cyan : C.text}>{P(id).name.toUpperCase()}</Big>
            {orgs.map((g) => {
              const x0 = X(g.y0) - 34, x1 = X(g.y1) + 34;
              return (
                <React.Fragment key={g.org}>
                  <div style={{ position: "absolute", left: x0, top: cy - 40, width: x1 - x0, height: 64, borderRadius: 32,
                    background: kn ? "rgba(34,211,238,0.18)" : "rgba(214,219,226,0.10)", border: `3px solid ${kn ? C.cyan : "rgba(214,219,226,0.6)"}` }} />
                  {Object.entries(g.per).map(([y, n]) => (
                    <React.Fragment key={y}>
                      <Cup x={X(Number(y))} y={cy - 8} s={38} color={kn ? C.cyan : C.text} />
                      {n > 1 && <div style={{ position: "absolute", left: X(Number(y)) + 14, top: cy - 14, fontFamily: F.title, fontSize: 22, color: kn ? C.cyan : C.text,
                        textShadow: "0 0 4px #0B0B0F, 0 0 4px #0B0B0F" }}>×{n}</div>}
                    </React.Fragment>
                  ))}
                  <div style={{ position: "absolute", left: (x0 + x1) / 2 - 60, width: 120, top: cy + 28, textAlign: "center", fontFamily: F.body, fontWeight: 800, fontSize: 20,
                    color: kn ? C.cyan : "#AEB6C2", letterSpacing: 1 }}>{g.org}</div>
                </React.Fragment>
              );
            })}
            <Big x={b.x1 + 60} y={cy - 30} size={52} color={kn ? C.cyan : C.text} w={260}>{orgs.length} TEAMS</Big>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// 14 (round 4). The trophy cabinet as stacked bars: trophy points by competition, top 8 (title_credits pts, sums = trophy_pts).
export const R4CabinetStack: React.FC = () => {
  const rows = (S.cabinetStack as (string | number)[][]).map((r) => [r[0], r[1], r[2], r[3], r[4]] as [string, number, number, number, number]);
  const totals = Object.fromEntries((S.cabinetStack as (string | number)[][]).map((r) => [r[0], r[5] as number]));
  const b: Box = { x0: 400, y0: 270, x1: 1700, y1: 840 };
  const xr: [number, number] = [0, 1600];
  const { X } = scale(b, xr, [0, 1]);
  const segs = [{ n: "WORLDS", c: C.gold }, { n: "MSI", c: "#E9E2CC" }, { n: "DOMESTIC", c: "#6F8199" }, { n: "OTHER", c: "#3E4756" }];
  const pitch = (b.y1 - b.y0) / rows.length, bh = 44;
  return (
    <Stage title="THE TROPHY CABINET">
      <Axes b={b} xr={xr} yr={[0, 1]} xt={[0, 400, 800, 1200, 1600]} yt={[]} xl="TROPHY POINTS" yl="" />
      <div style={{ position: "absolute", left: b.x0, top: 175, display: "flex", gap: 34 }}>
        {segs.map((s) => <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.body, fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: 1 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: s.c }} />{s.n}</div>)}
      </div>
      {rows.map(([id, ...v], i) => {
        const cy = b.y0 + pitch * (i + 0.5); let acc = 0; const tot = v.reduce((a, z) => a + z, 0), kn = id === "knight";
        return (
          <React.Fragment key={id}>
            <Face id={id} x={b.x0 - 52} y={cy} size={58} ring={kn ? C.cyan : id === "faker" ? C.gold : "#E9ECF1"} glow="rgba(0,0,0,0.5)" />
            <Big x={b.x0 - 96} y={cy - 22} size={36} align="right" w={300} color={kn ? C.cyan : C.text}>{P(id).name.toUpperCase()}</Big>
            {v.map((w, k) => { const x0 = X(acc); acc += w;
              return <div key={k} style={{ position: "absolute", left: x0 + (k ? 2 : 0), top: cy - bh / 2, width: Math.max(0, X(acc) - x0 - (k ? 2 : 0)), height: bh, background: segs[k].c,
                borderRadius: k === 3 || (k < 3 && v.slice(k + 1).every((z) => z === 0)) ? "0 6px 6px 0" : 0 }} />; })}
            <Big x={X(tot) + 16} y={cy - 24} size={40} w={200} color={kn ? C.cyan : C.text}>{totals[id].toLocaleString("en-US")}</Big>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// 23 (round 4). World titles as a unit chart: one cup per world title, everyone with 2 or more.
export const R4WorldCups: React.FC = () => {
  const rows = (S.board as BoardRow[]).filter((r) => r[7] >= 2).sort((a, z) => z[7] - a[7] || z[8] - a[8]);
  const top = 250, pitch = Math.min(110, 600 / rows.length);
  return (
    <Stage title="WORLD TITLES">
      {rows.map((r, i) => {
        const cy = top + pitch * (i + 0.5), fk = r[0] === "faker";
        return (
          <React.Fragment key={r[0]}>
            <Face id={r[0]} x={820} y={cy} size={Math.min(84, pitch - 14)} ring={fk ? C.gold : "#E9ECF1"} glow={fk ? C.gold : "rgba(0,0,0,0.5)"} />
            <Big x={760} y={cy - 22} size={36} align="right" w={300} color={fk ? C.gold : C.text}>{r[1].toUpperCase()}</Big>
            {Array.from({ length: r[7] }, (_, k) => <Cup key={k} x={920 + k * 110} y={cy} s={Math.min(72, pitch - 20)} color={fk ? C.gold : "#D6DBE2"} glow={fk} />)}
            <Big x={920 + r[7] * 110 - 20} y={cy - 26} size={48} w={100} color={fk ? C.gold : C.text}>{r[7]}</Big>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

// 22 (round 4). Champion pool as a lollipop: most champions played, top 7 plus Knight, with each one's signature pick.
export const R4ChampPool: React.FC = () => {
  const all = S.pool as PoolRow[];
  const top = [...all].sort((a, z) => z[3] - a[3]).slice(0, 7);
  const kn = all.find((r) => r[0] === "knight")!;
  const rows = top.some((r) => r[0] === "knight") ? top : [...top, kn];
  const b: Box = { x0: 520, y0: 230, x1: 1560, y1: 860 };
  const xr: [number, number] = [0, 100];
  const { X } = scale(b, xr, [0, 1]);
  const pitch = (b.y1 - b.y0) / rows.length;
  return (
    <Stage title="CHAMPION POOL">
      <Axes b={b} xr={xr} yr={[0, 1]} xt={[0, 25, 50, 75, 100]} yt={[]} xl="CHAMPIONS PLAYED" yl="" />
      {rows.map((r, i) => {
        const cy = b.y0 + pitch * (i + 0.5), k = r[0] === "knight", f = r[0] === "faker", col = k ? C.cyan : f ? C.gold : "rgba(214,219,226,0.75)";
        return (
          <React.Fragment key={r[0]}>
            {k && i === rows.length - 1 && <div style={{ position: "absolute", left: b.x0 - 300, width: b.x1 - b.x0 + 330, top: cy - pitch / 2, borderTop: "2px dashed rgba(237,239,242,0.25)" }} />}
            <div style={{ position: "absolute", left: b.x0, top: cy - 3, width: X(r[3]) - b.x0, height: 6, background: col, borderRadius: 3 }} />
            {k || f ? <Face id={r[0]} x={X(r[3])} y={cy} size={Math.min(70, pitch - 8)} ring={col} glow={k ? "rgba(34,211,238,0.6)" : C.gold} />
              : <div style={{ position: "absolute", left: X(r[3]) - 14, top: cy - 14, width: 28, height: 28, borderRadius: 14, background: col }} />}
            <Big x={b.x0 - 24} y={cy - 24} size={38} align="right" w={300} color={k ? C.cyan : f ? C.gold : C.text}>{r[1].toUpperCase()}</Big>
            <Big x={X(r[3]) + (k || f ? 50 : 30)} y={cy - 24} size={40} w={80} color={k ? C.cyan : f ? C.gold : C.text}>{r[3]}</Big>
            <div style={{ position: "absolute", left: X(r[3]) + (k || f ? 130 : 110), top: cy - 14, fontFamily: F.body, fontWeight: 800, fontSize: 22, color: "#AEB6C2", whiteSpace: "nowrap" }}>
              MOST PLAYED: {r[5].toUpperCase()}</div>
          </React.Fragment>
        );
      })}
    </Stage>
  );
};
