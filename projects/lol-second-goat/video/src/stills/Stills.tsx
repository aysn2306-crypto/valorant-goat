import React from "react";
import { Img, staticFile } from "remotion";
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
  const xr: [number, number] = [0, 380], yr: [number, number] = [55, 103];
  const { X, Y } = scale(B, xr, yr);
  const pts = PL.map((p) => ({ id: p.id, x: p.stats.intl_games ?? 0, y: (S.bigStage as Record<string, number>)[p.id] })).filter((d) => d.y !== undefined && d.y >= 55);
  return (
    <Stage title="BIG GAMES AND CLUTCH">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 50, 100, 150, 200, 250, 300, 350]} yt={[60, 70, 80, 90, 100]} xl="INTERNATIONAL GAMES" yl="BIG GAMES SCORE" />
      {pts.filter((d) => d.id !== "zeus").map((d) => <Star key={d.id} x={X(d.x)} y={Y(d.y)} r={11} color={heat((d.y - 55) / 45)} o={0.9} />)}
      <Callout x={X(181)} y={Y(94.8)} name="Knight" value="95" side="right" ring={22} />
      <Callout x={X(221)} y={Y(92.6)} name="Keria" value="93" side="right" ring={22} />
      <Callout x={X(352)} y={Y(80.5)} name="Faker" value="81" side="above" ring={22} />
      <Face id="zeus" x={X(169)} y={Y(100)} size={92} ring={C.text} glow="rgba(92,190,80,0.9)" />
      <Callout x={X(169)} y={Y(100)} name="Zeus" value="100" side="left" ring={0} pad={52} size={1.25} />
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
  const third = new Set<number>(); let k = 7; while (third.size < 25) { k = (k * 7919 + 13) % 1000; third.add(k); }
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
      <Big x={b.x1 + 40} y={rows[2] - 40} size={76} color={C.cyan}>975</Big>
      <Big x={b.x1 + 40} y={rows[3] - 34} size={60}>25</Big>
      {/* the mystery player: a blank face */}
      <div style={{ position: "absolute", left: b.x1 + 190, top: rows[2] - 46, width: 92, height: 92, borderRadius: 46, background: "#1B212B",
        border: `3px solid ${C.cyan}`, boxShadow: `0 0 22px ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.title, fontSize: 58, color: C.cyan }}>?</div>
    </Stage>
  );
};

// 8. Twist two: international trophies only
export const S8IntlOnly: React.FC = () => {
  const b: Box = { x0: 380, y0: 200, x1: 1500, y1: 820 };
  const yr: [number, number] = [62, 86];
  const nudge: Record<string, number> = { chovy: -10, keria: 12, knight: -4 };
  const Y = (v: number) => b.y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (b.y1 - b.y0);
  const XL = b.x0 + 330, XR = b.x1 - 300;
  const intl = Object.fromEntries((S.intl as [string, string, number][]).map(([id, , s]) => [id, s]));
  const ids = ["faker", "keria", "knight", "chovy", "zeus", "ruler"];
  const col = (id: string) => (id === "keria" ? C.cyan : id === "faker" ? C.gold : "rgba(190,196,206,0.75)");
  return (
    <Stage title="INTERNATIONAL TROPHIES ONLY">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[65, 70, 75, 80, 85].map((v) => <Big key={v} x={b.x0 - 20} y={Y(v) - 28} size={46} align="right" w={120}>{v}</Big>)}
      <div style={{ position: "absolute", left: b.x0 + 22, top: b.y0 - 26, fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SCORE</div>
      <Big x={XL} y={b.y1 + 14} size={38} align="center" w={400}>ALL TROPHIES</Big>
      <Big x={XR} y={b.y1 + 14} size={38} align="center" w={400}>INTERNATIONAL ONLY</Big>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {ids.map((id) => (
          <g key={id} style={{ filter: `drop-shadow(0 0 6px ${col(id)})` }}>
            <line x1={XL} x2={XR} y1={Y(P(id).score)} y2={Y(intl[id])} stroke={col(id)} strokeWidth={id === "keria" || id === "faker" ? 6 : 3} />
            <circle cx={XL} cy={Y(P(id).score)} r={9} fill={col(id)} />
            {id !== "keria" && <circle cx={XR} cy={Y(intl[id])} r={9} fill={col(id)} />}
          </g>
        ))}
      </svg>
      {ids.map((id) => (
        <div key={"l" + id} style={{ position: "absolute", left: XL - 320, width: 300, textAlign: "right", top: Y(P(id).score) - 17 + (nudge[id] ?? 0), fontFamily: F.body, fontWeight: 800,
          fontSize: 25, color: id === "keria" ? C.cyan : id === "faker" ? C.gold : C.text, whiteSpace: "nowrap" }}>{P(id).name.toUpperCase()} {r0(P(id).score)}</div>
      ))}
      {ids.filter((id) => id !== "keria").map((id) => (
        <div key={"r" + id} style={{ position: "absolute", left: XR + (id === "knight" ? 50 : 22), top: Y(intl[id]) - 17 + (id === "knight" ? 8 : 0), fontFamily: F.body, fontWeight: 800, fontSize: 25,
          color: id === "faker" ? C.gold : C.text, whiteSpace: "nowrap" }}>{P(id).name.toUpperCase()} {r0(intl[id])}</div>
      ))}
      <Face id="keria" x={XR} y={Y(intl.keria)} size={76} ring={C.cyan} glow={C.cyan} />
      <div style={{ position: "absolute", left: XR + 50, top: Y(intl.keria) - 84, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.cyan }}>KERIA #2</div>
        <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 40, color: C.text, lineHeight: 1 }}>{r0(intl.keria)}</div>
      </div>
    </Stage>
  );
};

// 9. Twist three: split Faker in two
export const S9TwoFakers: React.FC = () => {
  const xr: [number, number] = [2012, 2022], yr: [number, number] = [69, 89];
  const { X, Y } = scale(B, xr, yr);
  const rows = (S.split as [string, string, string, number][]).map(([link, name, years, s]) => ({ link, name, first: Number(years.slice(0, 4)), s }));
  const cut = 73.6;
  const side: Record<string, "left" | "right" | "above" | "below"> = { Knight: "left", Keria: "right", Chovy: "left", Ruler: "left", Zeus: "right" };
  return (
    <Stage title="TWO FAKERS">
      <div style={{ position: "absolute", left: B.x0, top: B.y0 - 10, width: B.x1 - B.x0 + 30, height: Y(cut) - B.y0 + 10,
        background: "linear-gradient(180deg, rgba(92,190,80,0.16) 0%, rgba(92,190,80,0.05) 100%)" }} />
      <div style={{ position: "absolute", left: B.x0, top: Y(cut), width: B.x1 - B.x0 + 30, borderTop: "3px dashed rgba(237,239,242,0.7)" }} />
      <Big x={B.x1 - 10} y={Y(cut) - 52} size={40} align="right" w={300}>TOP 7</Big>
      <Axes b={B} xr={xr} yr={yr} xt={[2012, 2014, 2016, 2018, 2020, 2022]} yt={[70, 75, 80, 85]} xl="FIRST SEASON" yl="SCORE" xf={(v) => String(v)} />
      {rows.filter((r) => !r.name.startsWith("Faker")).map((r) => (
        <React.Fragment key={r.link}>
          <Dot x={X(r.first)} y={Y(r.s)} r={10} color={heat((r.s - 69) / 18)} />
          {side[r.name] && <Callout x={X(r.first)} y={Y(r.s)} name={r.name} value={r0(r.s)} side={side[r.name]} ring={22} />}
        </React.Fragment>
      ))}
      {rows.filter((r) => r.name.startsWith("Faker")).map((r) => (
        <React.Fragment key={r.link}>
          <Face id="faker" x={X(r.first)} y={Y(r.s)} size={92} />
          <div style={{ position: "absolute", left: X(r.first) + 58, top: Y(r.s) - 34, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 26, color: C.gold }}>FAKER {r.name.slice(6)}</div>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 38, color: C.text, lineHeight: 1 }}>{r0(r.s)}</div>
          </div>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// 10. Finale: the GOAT pyramid, tiers cut where the score gaps are
export const S10Pyramid: React.FC = () => {
  const top = 160, base = 900, half = 640, cx = 1010;
  const yr: [number, number] = [58, 89];
  const Y = (v: number) => base - ((v - yr[0]) / (yr[1] - yr[0])) * (base - top);
  const hw = (y: number) => ((y - top) / (base - top)) * half;
  const tiers = [{ lo: 79.6, hi: 89, ids: ["faker"] }, { lo: 70, hi: 79.6, ids: ["knight", "chovy", "keria"] }, { lo: 64.9, hi: 70, ids: ["zeus", "ruler"] },
    { lo: 58, hi: 64.9, ids: ["bin", "viper", "canyon", "caps", "oner", "kiin"] }];
  const fills = ["rgba(245,184,61,0.30)", "rgba(34,211,238,0.16)", "rgba(150,160,175,0.14)", "rgba(150,160,175,0.09)"];
  return (
    <Stage title="THE PYRAMID" glow="gold">
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {tiers.map((t, i) => {
          const y0 = Y(t.hi), y1 = Y(t.lo);
          return <polygon key={i} points={`${cx - hw(y0)},${y0} ${cx + hw(y0)},${y0} ${cx + hw(y1)},${y1} ${cx - hw(y1)},${y1}`} fill={fills[i]}
            stroke="rgba(237,239,242,0.55)" strokeWidth={2} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 250 - 2, top: top, width: 3, height: base - top, background: "rgba(237,239,242,0.85)" }} />
      {[60, 65, 70, 75, 80, 85].map((v) => <Big key={v} x={230} y={Y(v) - 28} size={44} align="right" w={120}>{v}</Big>)}
      <div style={{ position: "absolute", left: 272, top: top - 20, fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>SCORE</div>
      {tiers.map((t, i) => {
        const yc = (Y(t.hi) + Y(t.lo)) / 2 - (i === 0 ? 0 : 12);
        const size = i === 0 ? 140 : i === 1 ? 118 : i === 2 ? 80 : 92;
        const gap = i === 3 ? 158 : i === 2 ? 220 : 220;
        return t.ids.map((id, j) => {
          const x = cx + (j - (t.ids.length - 1) / 2) * gap + (i === 0 ? 0 : 0);
          const y = i === 0 ? Y(84) - 14 : i === 2 ? yc - 6 : yc;
          return (
            <React.Fragment key={id}>
              <Face id={id} x={x} y={y} size={size} ring={i === 0 ? C.gold : "rgba(237,239,242,0.8)"} glow={i === 0 ? C.gold : "rgba(0,0,0,0.6)"} />
              <div style={{ position: "absolute", left: x - 100, width: 200, top: y + size / 2 + 4, textAlign: "center", fontFamily: F.body, fontWeight: 800,
                fontSize: i === 0 ? 30 : 22, color: i === 0 ? C.gold : C.text, whiteSpace: "nowrap" }}>{P(id).name.toUpperCase()} {r0(P(id).score)}</div>
            </React.Fragment>
          );
        });
      })}
    </Stage>
  );
};

// 11. What Knight needs to pass Faker
export const S11KnightNeeds: React.FC = () => {
  const xr: [number, number] = [-0.3, 3.5], yr: [number, number] = [72, 88];
  const { X, Y } = scale(B, xr, yr);
  const kn = (S.knightNeeds as [string, number, number][]).slice(0, 4).map((r) => r[1]);
  const fk = (S.knightNeeds as [string, number, number][])[0][2];
  const pts = kn.map((v, i) => `${X(i)},${Y(v)}`).join(" L ");
  return (
    <Stage title="WHAT KNIGHT NEEDS">
      <Axes b={B} xr={xr} yr={yr} xt={[0, 1, 2, 3]} yt={[72, 76, 80, 84, 88]} xl="MORE WORLD TITLES" yl="SCORE" xf={(v) => (v === 0 ? "NOW" : "+" + v)} />
      <div style={{ position: "absolute", left: B.x0, top: Y(fk), width: B.x1 - B.x0 - 110, borderTop: `4px dashed ${C.gold}`, filter: `drop-shadow(0 0 6px ${C.gold})` }} />
      <Face id="faker" x={B.x1 - 40} y={Y(fk)} size={96} />
      <Callout x={B.x1 - 40} y={Y(fk)} name="Faker" value={r0(fk)} side="below" ring={0} pad={50} color={C.gold} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d={"M " + pts} stroke={C.cyan} strokeWidth={6} fill="none" style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
        {kn.slice(0, 3).map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={12} fill={C.cyan} />)}
      </svg>
      {kn.slice(0, 3).map((v, i) => <Big key={i} x={X(i) + 22} y={Y(v) + 4} size={52}>{r0(v)}</Big>)}
      {/* the gap today */}
      <div style={{ position: "absolute", left: X(0) - 40, top: Y(fk), height: Y(kn[0]) - Y(fk), borderLeft: "3px dashed rgba(237,239,242,0.8)" }} />
      <Big x={X(0) - 56} y={(Y(fk) + Y(kn[0])) / 2 - 30} size={52} align="right" w={120}>-9</Big>
      <Face id="knight" x={X(3)} y={Y(kn[3])} size={104} ring={C.cyan} glow={C.cyan} />
      <Callout x={X(3)} y={Y(kn[3])} name="Knight" value={r0(kn[3])} side="above" ring={0} pad={54} color={C.cyan} size={1.2} />
    </Stage>
  );
};

// 11a. Knight vs Faker, part by part (numbers from the ranking thread, 18 Nov 16:03)
const PARTS: [string, number, number][] = [["TROPHIES", 100, 44], ["BIG GAMES", 81, 95], ["BEST SEASON", 77, 100], ["YEARS AT THE TOP", 79, 100],
  ["SKILL", 78, 99], ["CARRYING", 73, 63], ["RESPECT", 61, 78]];
export const S11aKnightVsFaker: React.FC = () => {
  const b: Box = { x0: 560, y0: 210, x1: 1640, y1: 830 };
  const X = (v: number) => b.x0 + ((v - 30) / 72) * (b.x1 - b.x0);
  const Y = (i: number) => b.y0 + 40 + i * ((b.y1 - b.y0 - 70) / 6);
  return (
    <Stage title="KNIGHT VS FAKER">
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y0 - 20, width: 3, height: b.y1 - b.y0 + 22, background: "rgba(237,239,242,0.85)" }} />
      <div style={{ position: "absolute", left: b.x0 - 2, top: b.y1, width: b.x1 - b.x0 + 30, height: 3, background: "rgba(237,239,242,0.85)" }} />
      {[40, 60, 80, 100].map((v) => <Big key={v} x={X(v)} y={b.y1 + 12} size={40} align="center" w={160}>{v}</Big>)}
      <div style={{ position: "absolute", left: b.x0, right: 1920 - b.x1, top: b.y1 + 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
        fontFamily: F.title, fontSize: 40, letterSpacing: 1.5, color: C.text }}>PART SCORE
        <svg width="70" height="40" viewBox="0 0 70 40"><path d="M70 20 L40 40 L40 28 L0 28 L0 12 L40 12 L40 0 Z" fill={C.text} /></svg></div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {PARTS.map(([, f, k], i) => {
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
      {PARTS.map(([n, f, k], i) => {
        const kWin = k > f;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: b.x0 - 440, width: 410, textAlign: "right", top: Y(i) - 24, fontFamily: F.title, fontSize: 40, letterSpacing: 1,
              color: kWin ? C.text : C.gold }}>{n}</div>
            <div style={{ position: "absolute", left: X(Math.max(f, k)) + 26, top: Y(i) - 20, fontFamily: F.body, fontWeight: 800, fontSize: 30,
              color: kWin ? C.cyan : C.gold, whiteSpace: "nowrap" }}>{kWin ? "+" + (k - f) : "-" + (f - k)}</div>
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

// 11b. Paths to pass Faker: trophy points added vs Knight's score. Points are derived from each path's score
// using the model's slope (+1 Worlds = about 106 points = +3.2 score), so they are approximate.
const PATHS: [string, number, "left" | "right" | "above" | "below"][] = [["NOW", 74.9, "below"], ["+8 LPL", 78.3, "below"], ["+1 WORLDS", 78.1, "above"],
  ["+1 WORLDS +4 LPL", 79.8, "below"], ["+2 WORLDS", 81.3, "above"], ["+2 WORLDS +4 LPL", 83.0, "below"], ["3 WORLDS", 84.5, "above"]];
export const S11bKnightPaths: React.FC = () => {
  const slope = (78.1 - 74.9) / 106;
  const pts = (s: number) => (s - 74.9) / slope;
  const xr: [number, number] = [-20, 360], yr: [number, number] = [72, 88];
  const { X, Y } = scale(B, xr, yr);
  const fk = 84.3;
  return (
    <Stage title="WHAT KNIGHT NEEDS">
      <div style={{ position: "absolute", left: B.x0, top: B.y0 - 10, width: B.x1 - B.x0 + 30, height: Y(fk) - B.y0 + 10,
        background: "linear-gradient(180deg, rgba(92,190,80,0.2) 0%, rgba(92,190,80,0.04) 100%)" }} />
      <Axes b={B} xr={xr} yr={yr} xt={[0, 100, 200, 300]} yt={[72, 76, 80, 84, 88]} xl="TROPHY POINTS ADDED" yl="KNIGHT'S SCORE" />
      <div style={{ position: "absolute", left: B.x0, top: Y(fk), width: B.x1 - B.x0 - 120, borderTop: `4px dashed ${C.gold}`, filter: `drop-shadow(0 0 6px ${C.gold})` }} />
      <Face id="faker" x={B.x1 - 50} y={Y(fk)} size={92} />
      <Callout x={B.x1 - 50} y={Y(fk)} name="Faker" value="84" side="below" ring={0} pad={48} color={C.gold} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={X(0)} y1={Y(74.9)} x2={X(pts(84.5))} y2={Y(84.5)} stroke="rgba(34,211,238,0.35)" strokeWidth={3} strokeDasharray="6 8" />
      </svg>
      {PATHS.filter(([n]) => n !== "3 WORLDS").map(([n, s, side]) => (
        <React.Fragment key={n}>
          <Dot x={X(pts(s))} y={Y(s)} r={11} color={C.cyan} />
          <div style={{ position: "absolute", left: X(pts(s)) - 150, width: 300, textAlign: "center", top: side === "above" ? Y(s) - 66 : Y(s) + 18,
            whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 20, color: C.text }}>{n}</div>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 26, color: C.cyan, lineHeight: 1 }}>{s.toFixed(0)}</div>
          </div>
        </React.Fragment>
      ))}
      <Face id="knight" x={X(pts(84.5))} y={Y(84.5)} size={88} ring={C.cyan} glow={C.cyan} />
      <Callout x={X(pts(84.5))} y={Y(84.5)} name="+3 Worlds" value="85" side="above" ring={0} pad={46} color={C.cyan} size={1.1} />
    </Stage>
  );
};
