// LOCKED (ay 20 Nov 20:01): each row shows the combo that lands CLOSEST above Faker's score, never far over it.
// What it takes to reach Faker (ay 20 Nov): no years and no Faker decline, just the silverware each player would need
// to reach Faker's score as it stands today (94.4, v14.1). A unit chart, one icon per title (Jxmy's unit grid, jxmy-graphs
// XMaPrXzclaQ g07): titles already won in grey, the ones still needed drawn in teal, row by row as each name is said.
// Data: research/data/silverware_needed.csv (model v15.1 e118a8f: combo closest above 94.9 (v15.3) (v15.2), Faker frozen) and
// league-v14.json titles. Faker today: 6 Worlds, 2 MSI, 10 LCK titles.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const GOLD = "#E9B949";
const HAVE = "#7A828C";

export type SilverRow = { id: string; have: [number, number, number]; need: [number, number, number]; at: number; score?: string };

const Cup: React.FC<{ s: number; fill?: string; stroke?: string }> = ({ s, fill, stroke }) => (
  <svg width={s} height={s} viewBox="0 0 32 32">
    <path d="M7 3h18v6c0 6-4 10-9 10s-9-4-9-10zM13 19h6v5h4v4H9v-4h4z" fill={fill ?? "none"} stroke={stroke ?? "none"} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);
const Box: React.FC<{ s: number; fill?: string; stroke?: string }> = ({ s, fill, stroke }) => (
  <div style={{ width: s, height: s, boxSizing: "border-box", background: fill ?? "transparent", border: stroke ? `3px solid ${stroke}` : undefined }} />
);

export const Silverware: React.FC<{ rows: SilverRow[]; fakerAt?: number }> = ({ rows, fakerAt = 0 }) => {
  const f = useCurrentFrame();
  const COL = [450, 900, 1290], ICON = [34, 34, 18], GAP = [6, 6, 4], CW = [440, 380, 580];
  const all: SilverRow[] = [{ id: "faker", have: [6, 2, 10], need: [0, 0, 0], at: fakerAt }, ...rows];
  const RH = 170, Y0 = 250;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 110, top: 50, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>WHAT IT TAKES TO REACH FAKER</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>TITLES NEEDED TO MATCH FAKER'S SCORE TODAY · GREY = WON · TEAL = STILL NEEDED</div>
      </div>
      {["WORLDS", "MSI", "LEAGUE TITLES"].map((h, j) => (
        <div key={h} style={{ position: "absolute", left: COL[j], top: Y0 - 50, fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: MUTE, opacity: tO }}>{h}</div>
      ))}
      {all.map((r, i) => {
        const o = interpolate(f, [r.at - 8, r.at], [0, 1], clamp);
        const y = Y0 + i * RH;
        const fk = r.id === "faker";
        const col = fk ? GOLD : TEAL;
        return (
          <div key={r.id} style={{ opacity: o }}>
            <div style={{ position: "absolute", left: 110, top: y + 10, display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 92, height: 92, borderRadius: "50%", overflow: "hidden", background: "#2E333C", border: `4px solid ${col}` }}>
                {P(r.id).photo && <Img src={staticFile(P(r.id).photo!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 48, letterSpacing: 2, color: col, lineHeight: 1 }}>{P(r.id).name.toUpperCase()}</div>
                <div style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 2, color: MUTE }}>{fk ? "TODAY · 94.9" : r.score ?? ""}</div>
              </div>
            </div>
            {[0, 1, 2].map((j) => {
              const n = r.have[j] + r.need[j];
              return (
                <div key={j} style={{ position: "absolute", left: COL[j], top: y + (j === 2 ? 14 : 22), width: CW[j], display: "flex", flexWrap: "wrap", gap: GAP[j] }}>
                  {Array.from({ length: n }, (_, k) => {
                    const needed = k >= r.have[j];
                    const nk = needed ? interpolate(f, [r.at + 6 + (k - r.have[j]) * 2, r.at + 12 + (k - r.have[j]) * 2], [0, 1], { ...clamp, easing: easeOut }) : 1;
                    const fill = fk ? GOLD : needed ? undefined : HAVE;
                    const stroke = needed ? TEAL : undefined;
                    return <div key={k} style={{ opacity: nk, transform: `scale(${0.6 + 0.4 * nk})` }}>
                      {j === 2 ? <Box s={ICON[j]} fill={fill} stroke={stroke} /> : <Cup s={ICON[j]} fill={fill} stroke={stroke} />}
                    </div>;
                  })}
                  {r.need[j] > 0 && <div style={{ fontFamily: BEBAS, fontSize: j === 2 ? 34 : 44, color: TEAL, marginLeft: 8, alignSelf: "center",
                    opacity: interpolate(f, [r.at + 14, r.at + 20], [0, 1], clamp) }}>+{r.need[j]}</div>}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const KNIGHT_ROW = (at: number): SilverRow => ({ id: "knight", have: [1, 1, 8], need: [5, 0, 0], at, score: "WITH THESE · 97.6" });
export const CHOVY_ROW = (at: number): SilverRow => ({ id: "chovy", have: [0, 2, 7], need: [4, 0, 8], at, score: "WITH THESE · 95.3" });
export const GUMA_ROW = (at: number): SilverRow => ({ id: "gumayusi", have: [3, 1, 1], need: [6, 6, 12], at, score: "WITH THESE · 97.6" });
