// LOCKED (ay 20 Nov 20:01, 21 Nov 01:03): closest above Faker's score, trophies SPREAD across Worlds, MSI and league
// titles for Knight and Chovy (model runs draft_scores_spread_*.csv); Gumayusi 6+6+12 as computed.
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

// ay 21 Nov 17:24/17:28: the video ends on the laughing minion (ay's LO emote) under Gumayusi's titles, with an arrow
// to the Worlds he still needs.
export const Silverware: React.FC<{ rows: SilverRow[]; fakerAt?: number; catAt?: number }> = ({ rows, fakerAt = 0, catAt }) => {
  const f = useCurrentFrame();
  // council 22 Nov: icons were too small on a phone; cups about 2x, league boxes about 2.4x, wrapping to a second line
  const COL = [450, 1000, 1380], ICON = [72, 72, 44], GAP = [10, 10, 7], CW = [520, 380, 520];
  const all: SilverRow[] = [{ id: "faker", have: [6, 2, 10], need: [0, 0, 0], at: fakerAt }, ...rows];
  const RH = 172, Y0 = 222;
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 110, top: 50, opacity: tO }}>
        <div style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>WHAT IT TAKES TO REACH FAKER</div>
        <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>TITLES NEEDED TO MATCH FAKER'S SCORE TODAY · GREY = WON · TEAL = STILL NEEDED</div>
      </div>
      {["WORLDS", "MSI", "LEAGUE TITLES"].map((h, j) => (
        <div key={h} style={{ position: "absolute", left: COL[j], top: Y0 - 56, fontFamily: BEBAS, fontSize: 40, letterSpacing: 2, color: MUTE, opacity: tO }}>{h}</div>
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
                <div style={{ fontFamily: BEBAS, fontSize: 56, letterSpacing: 2, color: col, lineHeight: 1 }}>{P(r.id).name.toUpperCase()}</div>
                <div style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: MUTE }}>{fk ? "TODAY · 94.9" : r.score ?? ""}</div>
              </div>
            </div>
            {[0, 1, 2].map((j) => {
              const n = r.have[j] + r.need[j];
              return (
                <div key={j} style={{ position: "absolute", left: COL[j], top: y + (j === 2 ? 8 : 0), width: CW[j], display: "flex", flexWrap: "wrap", gap: GAP[j] }}>
                  {Array.from({ length: n }, (_, k) => {
                    const needed = k >= r.have[j];
                    const nk = needed ? interpolate(f, [r.at + 6 + (k - r.have[j]) * 2, r.at + 12 + (k - r.have[j]) * 2], [0, 1], { ...clamp, easing: easeOut }) : 1;
                    const fill = fk ? GOLD : needed ? undefined : HAVE;
                    const stroke = needed ? TEAL : undefined;
                    return <div key={k} style={{ opacity: nk, transform: `scale(${0.6 + 0.4 * nk})` }}>
                      {j === 2 ? <Box s={ICON[j]} fill={fill} stroke={stroke} /> : <Cup s={ICON[j]} fill={fill} stroke={stroke} />}
                    </div>;
                  })}
                  {r.need[j] > 0 && <div style={{ fontFamily: BEBAS, fontSize: 60, lineHeight: 1, color: TEAL, marginLeft: 8, alignSelf: "center",
                    opacity: interpolate(f, [r.at + 14, r.at + 20], [0, 1], clamp) }}>+{r.need[j]}</div>}
                </div>
              );
            })}
          </div>
        );
      })}
      {catAt !== undefined && (() => {
        const k = interpolate(f, [catAt, catAt + 8], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
        const ar = interpolate(f, [catAt + 8, catAt + 22], [0, 1], { ...clamp, easing: easeOut });
        const path = "M 1000 985 C 880 990, 800 960, 772 900"; // to Gumayusi's Worlds cups (council 22 Nov layout)
        return <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={path} fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ar} />
            <path d="M 754 910 L 772 900 L 784 920" fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={ar > 0.95 ? 1 : 0} />
          </svg>
          <Img src={staticFile("_local/memes/laugh-emote.png")} style={{ position: "absolute", left: 1010, top: 905, width: 320, height: 160, objectFit: "cover",
            borderRadius: 12, border: "6px solid #F2F2EE",
            opacity: Math.min(1, k * 2), transform: `scale(${k}) rotate(${-6 + Math.sin(f / 5) * 3}deg)` }} />
        </>;
      })()}
    </AbsoluteFill>
  );
};

export const KNIGHT_ROW = (at: number): SilverRow => ({ id: "knight", have: [1, 1, 8], need: [3, 1, 5], at, score: "WITH THESE · 95.1" });
export const CHOVY_ROW = (at: number): SilverRow => ({ id: "chovy", have: [0, 2, 7], need: [4, 1, 5], at, score: "WITH THESE · 95.0" });
export const GUMA_ROW = (at: number): SilverRow => ({ id: "gumayusi", have: [3, 1, 1], need: [6, 6, 12], at, score: "WITH THESE · 97.6" });
