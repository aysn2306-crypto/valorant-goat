// MachineLoLing formula boards (video-research/machineloling-frames/01m08-definition-card, 04m10-formula-board):
// flat near-black ground, sentence-case sans title, a grey label, formula lines that land one per spoken beat with
// real numbers and small faces inline, the last line in the accent, and a small chart on the right.
// Plus the With/Without and All-Pro charts rebuilt with Jxmy's build (jxmy-cards/MOTION.md: bar grows in 0.75 s,
// labels pop about 1 s apart, a circled difference in a summary column).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { P } from "../lib/data";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const TEAL = "#3FD0B5";
const INK = "#E9ECEF";
const GREY = "#8E97A3";

export const Face: React.FC<{ id: string; size: number; ring?: string }> = ({ id, size, ring = "rgba(233,236,239,0.4)" }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: size * 0.18, overflow: "hidden", position: "relative", verticalAlign: "middle",
    background: "#1B212B", boxShadow: `inset 0 0 0 2px ${ring}`, marginRight: 12 }}>
    {P(id).photo && <Img src={staticFile(P(id).photo!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
  </span>
);

export type BLine = { text: string; at: number; face?: string; accent?: boolean; dim?: boolean };
/** `at` values are frames inside the scene */
// council 22 Nov: `big` = phone-size text (used on "What changed")
export const MLBoard: React.FC<{ title: string; label?: string; def?: string; defAt?: number; lines: BLine[]; side?: React.ReactNode; sideAt?: number; big?: boolean }> = ({ title, label, def, defAt = 0, lines, side, sideAt = 0, big }) => {
  const f = useCurrentFrame();
  const pop = (a: number) => ({ opacity: interpolate(f, [a, a + 5], [0, 1], clamp), transform: `translateY(${interpolate(f, [a, a + 8], [10, 0], { ...clamp, easing: easeOut })}px)` });
  return (
    <AbsoluteFill style={{ background: "#0B0C0F" }}>
      <div style={{ position: "absolute", left: big ? 90 : 110, top: big ? 80 : 120, width: big ? 1080 : 1000 }}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: big ? 84 : 76, color: INK, letterSpacing: -0.5, ...pop(2) }}>{title}</div>
        {def && <div style={{ marginTop: 36, ...pop(defAt) }}>
          {label && <div style={{ fontFamily: F.body, fontSize: 40, color: GREY }}>{label}</div>}
          <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 46, color: INK, lineHeight: 1.25, marginTop: 6 }}>{def}</div>
        </div>}
        <div style={{ marginTop: def ? 54 : big ? 50 : 70, display: "flex", flexDirection: "column", gap: big ? 24 : 26 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: F.body, fontWeight: l.accent ? 600 : 500, fontSize: big ? 60 : 46, lineHeight: 1.15, color: l.accent ? TEAL : l.dim ? GREY : INK, ...pop(l.at) }}>
              {l.face && <Face id={l.face} size={big ? 68 : 54} ring={l.accent ? TEAL : undefined} />}{l.text}
            </div>
          ))}
        </div>
      </div>
      {side && <div style={{ position: "absolute", left: big ? 1250 : 1220, top: 160, width: 600, height: 760, ...pop(sideAt) }}>{side}</div>}
    </AbsoluteFill>
  );
};

// ---------- small side charts ----------
/** horizontal bars, MachineLoLing's win/loss bar style; frac 0..1 */
export const SideBars: React.FC<{ rows: { label: string; value: string; frac: number; color: string; face?: string; at: number }[]; caption?: string }> = ({ rows, caption }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", gap: 34 }}>
      {rows.map((r) => {
        const g = interpolate(f, [r.at, r.at + 22], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div key={r.label}>
            <div style={{ fontFamily: F.body, fontSize: 44, color: GREY, marginBottom: 10, display: "flex", alignItems: "center" }}>{r.face && <Face id={r.face} size={40} />}{r.label}</div>
            <div style={{ height: 80, background: "rgba(233,236,239,0.06)", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.frac * 100 * g}%`, background: r.color }} />
              <div style={{ position: "absolute", left: 18, top: 10, fontFamily: F.body, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: "#0B0C0F", opacity: g > 0.6 ? 1 : 0 }}>{r.value}</div>
            </div>
          </div>
        );
      })}
      {caption && <div style={{ fontFamily: F.body, fontSize: 36, color: GREY }}>{caption}</div>}
    </div>
  );
};

/** a 0-100 number line with labelled markers (MachineLoLing 01m08 right side) */
export const SideScale: React.FC<{ marks: { v: number; label: string; color: string; face?: string; at: number; up?: boolean }[]; axis: string }> = ({ marks, axis }) => {
  const f = useCurrentFrame();
  const x0 = 20, x1 = 580, y = 420, X = (v: number) => x0 + (v / 100) * (x1 - x0);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={600} height={760} style={{ position: "absolute" }}>
        <line x1={x0} x2={x1} y1={y} y2={y} stroke={INK} strokeWidth={3} />
        {[0, 25, 50, 75, 100].map((v) => <g key={v}><line x1={X(v)} x2={X(v)} y1={y} y2={y + 12} stroke={INK} strokeWidth={2} />
          <text x={X(v)} y={y + 46} textAnchor="middle" fill={GREY} fontFamily="Inter" fontSize={26}>{v}</text></g>)}
        <text x={(x0 + x1) / 2} y={y + 96} textAnchor="middle" fill={GREY} fontFamily="Inter" fontSize={26}>{axis}</text>
        {marks.map((m) => {
          const o = interpolate(f, [m.at, m.at + 6], [0, 1], clamp);
          const yy = m.up === false ? y + 0 : y;
          return <line key={m.label} x1={X(m.v)} x2={X(m.v)} y1={yy - (m.up === false ? -150 : 150)} y2={yy} stroke={m.color} strokeWidth={3} strokeDasharray="6 6" opacity={o} />;
        })}
      </svg>
      {marks.map((m) => {
        const o = interpolate(f, [m.at, m.at + 6], [0, 1], clamp);
        const top = m.up === false ? y + 160 : y - 230;
        return (
          <div key={m.label} style={{ position: "absolute", left: X(m.v) - 110, width: 220, top, textAlign: "center", opacity: o }}>
            {m.face && <div><Face id={m.face} size={56} ring={m.color} /></div>}
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 26, color: m.color, marginTop: 6, whiteSpace: "nowrap" }}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** coin flips in a row: each coin lands on its own frame */
export const SideCoins: React.FC<{ n: number; at: number; label: string }> = ({ n, at, label }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 160 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, width: 560 }}>
        {Array.from({ length: n }, (_, i) => {
          const a = at + i * 5, o = interpolate(f, [a, a + 4], [0, 1], clamp), rot = interpolate(f, [a, a + 6], [90, 0], clamp);
          return <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: "#C9A64A", border: "6px solid #E8C766", opacity: o, transform: `rotateY(${rot}deg)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 800, fontSize: 40, color: "#5A4715" }}>{i + 1}</div>;
        })}
      </div>
      <div style={{ fontFamily: F.body, fontSize: 28, color: GREY, marginTop: 28, opacity: interpolate(f, [at + n * 5, at + n * 5 + 6], [0, 1], clamp) }}>{label}</div>
    </div>
  );
};

/** two Elo towers: a weak team and a strong team, the credit for the same stat line written on top */
export const SideTowers: React.FC<{ at: number; at2: number }> = ({ at, at2 }) => {
  const f = useCurrentFrame();
  const g1 = interpolate(f, [at, at + 20], [0, 1], { ...clamp, easing: easeOut }), g2 = interpolate(f, [at2, at2 + 20], [0, 1], { ...clamp, easing: easeOut });
  const T = ({ x, h, g, lab, cred }: { x: number; h: number; g: number; lab: string; cred: string }) => (
    <>
      <div style={{ position: "absolute", left: x, bottom: 200, width: 180, height: h * g, border: `3px solid ${TEAL}`, background: "rgba(63,208,181,0.08)" }} />
      <div style={{ position: "absolute", left: x - 40, width: 260, bottom: 140, textAlign: "center", fontFamily: F.body, fontSize: 28, color: GREY }}>{lab}</div>
      <div style={{ position: "absolute", left: x - 40, width: 260, bottom: 220 + h * g, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 34, color: TEAL, opacity: g > 0.9 ? 1 : 0 }}>{cred}</div>
    </>
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 197, height: 3, background: INK }} />
      <T x={60} h={160} g={g1} lab="bottom team" cred="a little credit" />
      <T x={340} h={420} g={g2} lab="Gen.G" cred="a lot of credit" />
    </div>
  );
};

// ---------- With / without, Jxmy build (withwithout/ sheets, 05:34 to 06:34) ----------
export const WithWithout: React.FC<{ cues: { withAt: number; withoutAt: number; diffAt: number; doubtAt: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const W = 403 / (403 + 122) * 100, O = 127 / (127 + 71) * 100; // Gen.G with and without Chovy, domestic games (stills.json withWithout)
  const y1 = 860, top = 260, H = (v: number) => (v / 100) * (y1 - top);
  const g1 = interpolate(f, [cues.withAt, cues.withAt + 22], [0, 1], { ...clamp, easing: easeOut });
  const g2 = interpolate(f, [cues.withoutAt, cues.withoutAt + 22], [0, 1], { ...clamp, easing: easeOut });
  const pop = (a: number) => interpolate(f, [a, a + 5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 55%), #18243A" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#D9D3C2", padding: "10px 46px", fontFamily: F.title, fontSize: 58, letterSpacing: 2.5, color: "#1C1D22" }}>WITH VS WITHOUT</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 196, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 26, letterSpacing: 1.5, color: "#AEB6C2" }}>
        GEN.G, DOMESTIC GAMES, WITHIN 2 YEARS OF HIS STINT</div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={360} x2={1180} y1={y1} y2={y1} stroke="rgba(237,239,242,0.85)" strokeWidth={3} />
        {[0, 25, 50, 75, 100].map((v) => <text key={v} x={340} y={y1 - H(v) + 12} textAnchor="end" fill="#AEB6C2" fontFamily={F.title} fontSize={34}>{v}%</text>)}
      </svg>
      {[{ x: 470, v: W, g: g1, col: C.cyan, lab: "WITH CHOVY" }, { x: 790, v: O, g: g2, col: "rgba(150,158,170,0.6)", lab: "WITHOUT" }].map((b) => (
        <React.Fragment key={b.lab}>
          <div style={{ position: "absolute", left: b.x, top: y1 - H(b.v) * b.g, width: 220, height: H(b.v) * b.g, background: b.col, borderRadius: "16px 16px 0 0" }} />
          <div style={{ position: "absolute", left: b.x, width: 220, top: y1 - H(b.v) + 18, textAlign: "center", fontFamily: F.title, fontSize: 52, color: "#0B0B0F", opacity: b.g > 0.95 ? 1 : 0 }}>{b.v.toFixed(1)}%</div>
          <div style={{ position: "absolute", left: b.x - 40, width: 300, top: y1 + 16, textAlign: "center", fontFamily: F.title, fontSize: 38, color: C.text, opacity: b.g > 0.3 ? 1 : 0 }}>{b.lab}</div>
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 470 + 110 - 70, top: y1 - H(W) * g1 - 150, opacity: g1 }}><Face id="chovy" size={140} ring={C.cyan} /></div>
      {/* summary column, right */}
      <div style={{ position: "absolute", left: 1330, top: 330, width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: F.title, fontSize: 64, color: C.cyan, opacity: pop(cues.withAt + 20) }}>{W.toFixed(1)}%</div>
        <div style={{ fontFamily: F.title, fontSize: 40, color: "#AEB6C2", opacity: pop(cues.withoutAt) }}>▼</div>
        <div style={{ fontFamily: F.title, fontSize: 64, color: C.text, opacity: pop(cues.withoutAt + 20) }}>{O.toFixed(1)}%</div>
        <div style={{ marginTop: 20, width: 300, height: 130, borderRadius: "50%", border: `5px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.title, fontSize: 70, color: C.cyan, opacity: pop(cues.diffAt), transform: `scale(${interpolate(f, [cues.diffAt, cues.diffAt + 6], [1.3, 1], clamp)})` }}>+{(W - O).toFixed(1)}</div>
        <div style={{ fontFamily: F.title, fontSize: 56, color: "#E0352B", opacity: pop(cues.doubtAt), transform: `rotate(-6deg)` }}>NOT REALLY</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- All-Pro test, built one row per spoken number ----------
export const AllProTest: React.FC<{ cues: [number, number, number] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const rows: [string, number, string][] = [["Picking at random", 12, "#C26A5A"], ["Picking the winning teams", 58, "#C9A64A"], ["The model", 63, TEAL]];
  const x0 = 640, x1 = 1700, X = (v: number) => x0 + (v / 100) * (x1 - x0);
  return (
    <AbsoluteFill style={{ background: "#0B0C0F" }}>
      <div style={{ position: "absolute", left: 110, top: 110, fontFamily: F.body, fontWeight: 700, fontSize: 76, color: INK }}>Does it work?</div>
      <div style={{ position: "absolute", left: 110, top: 210, fontFamily: F.body, fontSize: 40, color: GREY }}>All-Pro teams, hidden from the model: how many it picks right</div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} x2={x1} y1={860} y2={860} stroke={INK} strokeWidth={3} />
        {[0, 25, 50, 75, 100].map((v) => <g key={v}><line x1={X(v)} x2={X(v)} y1={380} y2={860} stroke="rgba(233,236,239,0.08)" strokeWidth={2} />
          <text x={X(v)} y={906} textAnchor="middle" fill={GREY} fontFamily="Inter" fontSize={30}>{v}%</text></g>)}
        {rows.map(([, v, col], i) => {
          const g = interpolate(f, [cues[i], cues[i] + 22], [0, 1], { ...clamp, easing: easeOut });
          const y = 450 + i * 150;
          return g > 0 ? <g key={i}><rect x={x0} y={y - 32} width={(X(v) - x0) * g} height={64} fill={col} /></g> : null;
        })}
      </svg>
      {rows.map(([n, v, col], i) => {
        const o = interpolate(f, [cues[i], cues[i] + 5], [0, 1], clamp), y = 450 + i * 150;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: 110, width: 500, top: y - 30, textAlign: "right", fontFamily: F.body, fontWeight: i === 2 ? 700 : 500, fontSize: 40, color: i === 2 ? TEAL : INK, opacity: o }}>{n}</div>
            <div style={{ position: "absolute", left: X(v) + 20, top: y - 34, fontFamily: F.body, fontWeight: 800, fontSize: 52, color: col, opacity: interpolate(f, [cues[i] + 18, cues[i] + 23], [0, 1], clamp) }}>{v}%</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
