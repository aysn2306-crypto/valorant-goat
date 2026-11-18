import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { D, P } from "../lib/data";
import { clamp, Count, Frame, Photo, pop, prog, roleIcon } from "../lib/ui";

/** Leaderboard that re-sorts from order A to order B at frame `tSwap`. Rows: [id, scoreA, scoreB]. */
export const RankShift: React.FC<{ title: string; sub?: string; rows: { id: string; a: number; b: number; ra: number; rb: number }[]; tSwap: number;
  labelA: string; labelB: string; focus?: string[]; chapter?: string; stamp?: { text: string; at: number } }> = ({ title, sub, rows, tSwap, labelA, labelB, focus = [], chapter, stamp }) => {
  const f = useCurrentFrame();
  const p = prog(f, tSwap, tSwap + 40);
  const RH = 52, Y0 = 230;
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      <div style={{ position: "absolute", left: 560, top: 190, fontFamily: F.body, fontSize: 24, color: p < 0.5 ? C.text : C.muted }}>{p < 0.5 ? labelA : labelB}</div>
      {rows.map((r, i) => {
        const o = prog(f, 4 + i * 2, 12 + i * 2);
        const y = Y0 + interpolate(p, [0, 1], [r.ra - 1, r.rb - 1]) * RH;
        const v = interpolate(p, [0, 1], [r.a, r.b]);
        const hi = focus.includes(r.id);
        const rank = p < 0.5 ? r.ra : r.rb;
        if (Math.min(r.ra, r.rb) > 12 && !hi) return null;
        if (Math.max(r.ra, r.rb) > 13 && !hi && (p < 0.5 ? r.ra : r.rb) > 12 && f > tSwap + 40) return null;
        return (
          <div key={r.id} style={{ position: "absolute", left: 480, top: y, width: 960, height: RH - 8, display: "flex", alignItems: "center", gap: 16,
            opacity: o, background: hi ? "rgba(34,211,238,0.10)" : "transparent", borderRadius: 8, paddingLeft: 12 }}>
            <div style={{ width: 54, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: hi ? C.cyan : C.muted, textAlign: "right" }}>#{rank}</div>
            <Photo id={r.id} size={42} />
            <div style={{ width: 260, fontFamily: F.body, fontWeight: hi ? 700 : 500, fontSize: 28, color: hi ? C.text : "#B9C0CA" }}>{P(r.id).name}</div>
            <div style={{ width: 420, height: 12, background: "#1F2631", borderRadius: 6 }}>
              <div style={{ width: `${v}%`, height: "100%", background: hi ? C.cyan : "#4A5361", borderRadius: 6 }} />
            </div>
            <div style={{ width: 80, fontFamily: F.body, fontSize: 24, color: C.muted, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{v.toFixed(1)}</div>
          </div>
        );
      })}
      {stamp && f >= stamp.at && f < tSwap + 10 && (
        <div style={{ position: "absolute", right: 170, top: 420, transform: `rotate(-8deg) scale(${1.6 - 0.6 * pop(f, stamp.at)})`, opacity: prog(f, stamp.at, stamp.at + 4),
          border: `8px solid ${C.red}`, color: C.red, fontFamily: F.title, fontSize: 120, padding: "4px 30px", borderRadius: 12 }}>{stamp.text}</div>
      )}
    </Frame>
  );
};

/** Stacked score breakdown: one bar per player, one segment per category (points = weight x category score / 100). */
export const Breakdown: React.FC<{ title: string; sub?: string; ids: string[]; cats: string[]; names: Record<string, string>; t0?: number; chapter?: string; hiCat?: string }> = ({ title, sub, ids, cats, names, t0 = 10, chapter, hiCat }) => {
  const f = useCurrentFrame();
  const W = D.meta.weights;
  const L = 420, R = 1720, RH = 110, Y0 = 260;
  const shades = ["#22D3EE", "#1BA9C0", "#167F92", "#7C8796", "#5F6977", "#4A5361", "#3B4350", "#F5B83D", "#C99632", "#9F7728", "#8A6CCF", "#6D55A6", "#E0605F", "#B54C4B", "#34D399"];
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      {ids.map((id, i) => {
        const p = P(id);
        let acc = 0;
        return (
          <div key={id} style={{ position: "absolute", left: 140, top: Y0 + i * RH, display: "flex", alignItems: "center", gap: 16, opacity: prog(f, t0 + i * 6, t0 + i * 6 + 8) }}>
            <Photo id={id} size={78} />
            <div style={{ width: 170, fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text }}>{p.name}</div>
            <div style={{ position: "relative", width: R - L, height: 50 }}>
              {cats.map((c, k) => {
                const pts = (W[c] * p.cats[c]) / 100;
                const grow = prog(f, t0 + 10 + k * 5, t0 + 22 + k * 5);
                const x = (acc / 100) * (R - L); acc += pts;
                return <div key={c} style={{ position: "absolute", left: x, width: Math.max(0, (pts / 100) * (R - L) * grow - 2), top: 0, height: 50,
                  background: hiCat && hiCat !== c ? "#2A3240" : shades[k % shades.length] }} />;
              })}
            </div>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.text, width: 90, textAlign: "right" }}>{p.score.toFixed(1)}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 140 + 78 + 16 + 170 + 16, top: Y0 + ids.length * RH + 10, display: "flex", flexWrap: "wrap", gap: "8px 22px", width: R - L,
        opacity: prog(f, t0 + 30, t0 + 40) }}>
        {cats.map((c, k) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F.body, fontSize: 22, color: C.muted }}>
            <div style={{ width: 14, height: 14, background: shades[k % shades.length] }} />{names[c]} {D.meta.weights[c]}
          </div>
        ))}
      </div>
    </Frame>
  );
};

/** Worlds winners 2011 -> 2026, one column per year, MVP-style chip of the highest-credit player. */
export const WorldsTimeline: React.FC<{ title: string; sub?: string; t0?: number; step?: number; chapter?: string; hiTeams?: string[] }> = ({ title, sub, t0 = 10, step = 6, chapter }) => {
  const f = useCurrentFrame();
  const ws = D.worlds;
  const L = 110, R = 1810, colW = (R - L) / ws.length;
  return (
    <Frame title={title} sub={sub} chapter={chapter}>
      {ws.map((w, i) => {
        const at = t0 + i * step;
        const o = prog(f, at, at + 10);
        const reg = w.players.map((p) => p[0]).find((id) => { try { P(id); return true; } catch { return false; } });
        const color = reg ? P(reg).color : C.muted;
        const best = [...w.players].sort((a, b) => b[2] - a[2])[0];
        const inPool = (() => { try { P(best[0]); return true; } catch { return false; } })();
        return (
          <div key={w.year} style={{ position: "absolute", left: L + i * colW, width: colW - 10, top: 330, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.text, textAlign: "center" }}>{w.year}</div>
            <div style={{ height: 6, background: color, borderRadius: 3, margin: "10px 6px" }} />
            <div style={{ fontFamily: F.body, fontSize: 19, color: C.muted, textAlign: "center", height: 78, lineHeight: 1.2 }}>{w.team.replace(/ \(.*\)/, "")}</div>
            <div style={{ display: "flex", justifyContent: "center" }}>{inPool ? <Photo id={best[0]} size={colW - 26} /> : null}</div>
            <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 20, color: C.text, textAlign: "center", marginTop: 8 }}>{best[1]}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: L, top: 760, display: "flex", gap: 28, fontFamily: F.body, fontSize: 21, color: C.muted, opacity: prog(f, t0 + 10, t0 + 20) }}>
        {Object.entries({ LCK: "#22D3EE", LPL: "#FF5A5F", LEC: "#F59E0B", LCS: "#A78BFA", LMS: "#34D399" }).map(([k, v]) => (
          <span key={k}><span style={{ display: "inline-block", width: 14, height: 14, background: v, marginRight: 8 }} />{k}</span>
        ))}
        <span>· face = the champion's top carry share in that run</span>
      </div>
    </Frame>
  );
};

/** Player profile card used for the countdown and the reveal. */
export const PlayerCard: React.FC<{ id: string; rank: number; lines: { k: string; v: string; at: number }[]; tName?: number; chapter?: string; gold?: boolean; blurUntil?: number; profileAt?: number }> = ({ id, rank, lines, tName = 0, chapter, gold, blurUntil, profileAt }) => {
  const f = useCurrentFrame();
  const p = P(id);
  const s = pop(f, tName);
  const hidden = blurUntil !== undefined && f < blurUntil;
  const accent = gold ? C.gold : C.cyan;
  return (
    <Frame chapter={chapter}>
      <div style={{ position: "absolute", left: 140, top: 120, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <Photo id={id} size={480} ring={accent} blur={hidden ? 26 : 0} />
      </div>
      <div style={{ position: "absolute", left: 720, top: 110, width: 1060 }}>
        <div style={{ fontFamily: F.title, fontSize: 100, color: accent, lineHeight: 1 }}>#{rank}</div>
        <div style={{ fontFamily: F.title, fontSize: 130, color: C.text, lineHeight: 1.05, filter: hidden ? "blur(24px)" : undefined }}>{p.name.toUpperCase()}</div>
        <div style={{ fontFamily: F.body, fontSize: 30, color: C.muted, marginTop: 6, filter: hidden ? "blur(14px)" : undefined }}>{p.role} · {p.regions} · {p.years} · {p.games.toLocaleString()} games</div>
        <div style={{ marginTop: 20 }}>
          {lines.map((l, i) => {
            const o = prog(f, l.at, l.at + 10);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #252D3A", padding: "10px 0", opacity: o }}>
                <div style={{ fontFamily: F.body, fontSize: 30, color: C.muted }}>{l.k}</div>
                <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.text }}>{l.v}</div>
              </div>
            );
          })}
        </div>
      </div>
      {profileAt !== undefined && (
        <div style={{ position: "absolute", left: 140, right: 140, top: 680, height: 200, display: "flex", gap: 14, alignItems: "flex-end" }}>
          {Object.keys(D.meta.weights).map((c, i) => {
            const v = p.cats[c] ?? 0;
            const g = prog(f, profileAt + i * 2, profileAt + i * 2 + 16);
            return (
              <div key={c} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 20, color: v >= 95 ? accent : C.text, opacity: g }}>{Math.round(v * g)}</div>
                <div style={{ width: "70%", height: 100, background: "#1F2631", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${v * g}%`, background: v >= 95 ? accent : "#4A5361" }} />
                </div>
                <div style={{ fontFamily: F.body, fontSize: 15, color: C.muted, textAlign: "center", height: 38, lineHeight: 1.15 }}>{CAT_SHORT[c] ?? c}</div>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
};

const CAT_SHORT: Record<string, string> = { trophies: "Trophies", big_stage: "Big stage", peak: "Peak", longevity: "Longevity", winning: "Winning",
  consistency: "Consistency", laning: "Laning", killing: "Killing", teamfight: "Team-fights", clean_play: "Clean play", team_carry: "Team carry",
  solo_carry: "Solo carry", vision: "Vision", recognition: "Votes (proxy)", team_lift: "Team lift (proxy)" };

/** Grid of faces (contender wall / teaser). */
export const FaceWall: React.FC<{ ids: string[]; cols?: number; size?: number; blur?: boolean; title?: string; hi?: string[]; at?: number }> = ({ ids, cols = 8, size = 170, blur, title, hi = [], at = 0 }) => {
  const f = useCurrentFrame();
  const rows = Math.ceil(ids.length / cols);
  const gap = 22;
  const W0 = cols * size + (cols - 1) * gap, H0 = rows * (size + 44) + (rows - 1) * gap;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {title && <div style={{ position: "absolute", left: 96, top: 64, fontFamily: F.body, fontWeight: 700, fontSize: 46, color: C.text, opacity: prog(f, at, at + 10) }}>{title}</div>}
      <div style={{ position: "absolute", left: (1920 - W0) / 2, top: (1080 - H0) / 2 + 30, display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap }}>
        {ids.map((id, i) => {
          const s = pop(f, at + 4 + i * 2);
          const isHi = hi.includes(id);
          return (
            <div key={id} style={{ transform: `scale(${s})`, textAlign: "center" }}>
              <Photo id={id} size={size} blur={blur && !isHi ? 10 : 0} ring={isHi ? C.cyan : undefined} dim={hi.length && !isHi ? 0.55 : 0} />
              <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 22, color: C.text, marginTop: 8, filter: blur && !isHi ? "blur(8px)" : undefined }}>{P(id).name}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { Count, roleIcon, clamp };
