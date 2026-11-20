// ay 20 Nov 14:36 (line 18): two LPL teams, five players a side, top to bottom by role, each player next to the
// player in the same role on the other team. Reference: Jxmy's head-to-head board (video-research/jxmy-graphs/videos/
// GPH4nK5sQ-8/graphs/g01_head-to-head_box-score-stats-two-player-board): stat name in the centre, the two values
// either side, the better value marked. Here the centre column is the role, so the eye reads across one role at a time.
// Data: Oracle's Elixir LPL 2026, every game (BLG 140, AL 138; Flandre 86 games as AL's main top).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE", TEAL = "#3FD0B5", MUTE = "#9BA3AE";

type P = { id: string; name: string; gd: number; dmg: number; kda: number };
const ROLES = ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"];
const BLG: P[] = [
  { id: "bin", name: "Bin", gd: 406, dmg: 21.2, kda: 3.7 },
  { id: "xun", name: "Xun", gd: -43, dmg: 16.6, kda: 4.7 },
  { id: "knight", name: "Knight", gd: 536, dmg: 26.4, kda: 6.6 },
  { id: "viper", name: "Viper", gd: 172, dmg: 28.2, kda: 5.4 },
  { id: "on", name: "ON", gd: 128, dmg: 8.0, kda: 3.9 },
];
const AL: P[] = [
  { id: "flandre", name: "Flandre", gd: -110, dmg: 21.4, kda: 3.4 },
  { id: "tarzan", name: "Tarzan", gd: 191, dmg: 18.8, kda: 4.7 },
  { id: "shanks", name: "Shanks", gd: 95, dmg: 24.7, kda: 4.1 },
  { id: "hope", name: "Hope", gd: 62, dmg: 27.5, kda: 4.5 },
  { id: "kael", name: "Kael", gd: 40, dmg: 8.1, kda: 4.3 },
];
// Script 18b (ay 20 Nov 18:32, "swap the players for like older years, like 5v5"): on "2013" the board turns into
// SK Telecom T1 K vs MVP Ozone, OGN Champions Spring + Summer 2013 (Leaguepedia scoreboards, data/csv/early_games.csv,
// 38 and 39 games). Gold at 15 and damage were not tracked then, so that column reads NOT TRACKED (the "thin data"),
// kill participation stands in for damage share, KDA is real.
type O = { id: string; name: string; kp: number; kda: number };
const SKT: O[] = [
  { id: "impact", name: "Impact", kp: 65.8, kda: 4.0 }, { id: "bengi", name: "Bengi", kp: 71.6, kda: 5.2 },
  { id: "faker", name: "Faker", kp: 71.0, kda: 4.6 }, { id: "piglet", name: "Piglet", kp: 67.0, kda: 6.3 },
  { id: "poohmandu", name: "PoohManDu", kp: 70.1, kda: 4.4 }];
const OZ: O[] = [
  { id: "homme", name: "Homme", kp: 61.6, kda: 4.7 }, { id: "dandy", name: "DanDy", kp: 69.8, kda: 4.1 },
  { id: "dade", name: "Dade", kp: 73.5, kda: 4.8 }, { id: "imp", name: "Imp", kp: 66.7, kda: 6.3 },
  { id: "mata", name: "Mata", kp: 72.9, kda: 4.6 }];
const OLD_STATS = [{ label: "GOLD AHEAD AT 15" }, { label: "KILL PARTICI\u00ADPATION" }, { label: "KDA" }];

const STATS: { key: "gd" | "dmg" | "kda"; label: string; fmt: (v: number) => string }[] = [
  { key: "gd", label: "GOLD AHEAD AT 15", fmt: (v) => (v > 0 ? "+" : "") + v },
  { key: "dmg", label: "DAMAGE SHARE", fmt: (v) => v.toFixed(1) + "%" },
  { key: "kda", label: "KDA", fmt: (v) => v.toFixed(1) },
];

const Y0 = 262, RH = 158;
// stat columns: left side reads outside-in, right side mirrors it, so the same stat sits either side of the role
const LX = [470, 640, 790], RX = [1450, 1280, 1130];

const Face: React.FC<{ id: string; x: number }> = ({ id, x }) => (
  <div style={{ position: "absolute", left: x - 58, top: -58, width: 116, height: 116, borderRadius: 58, overflow: "hidden", background: "#E9E6DE", border: `3px solid ${INK}` }}>
    <Img src={staticFile(`players/${id}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

const Logo: React.FC<{ src: string; x: number; name: string; align: "l" | "r" }> = ({ src, x, name, align }) => (
  <div style={{ position: "absolute", top: 128, left: x, display: "flex", flexDirection: align === "l" ? "row" : "row-reverse", alignItems: "center", gap: 18, transform: align === "r" ? "translateX(-100%)" : undefined }}>
    <div style={{ width: 84, height: 84, borderRadius: 42, background: "#E9E6DE", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile(src)} style={{ width: 64, height: 64, objectFit: "contain" }} />
    </div>
    <div style={{ fontFamily: BEBAS, fontSize: 56, color: INK, letterSpacing: 2, whiteSpace: "nowrap" }}>{name}</div>
  </div>
);

/** cues: frames in the scene. rows land top to bottom from `rows`; the role column lights up at `role` */
export const TeamRoles: React.FC<{ cues: { rows: number; role: number; old?: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const oldAt = cues.old ?? 1e9;
  // the old board comes in row by row, top to bottom, like the first one did
  const oldK = (j: number) => interpolate(f, [oldAt + j * 6, oldAt + j * 6 + 10], [0, 1], { ...clamp, easing: easeOut });
  const head = interpolate(f, [oldAt, oldAt + 10], [0, 1], clamp);
  const rowIn = (j: number) => interpolate(f, [cues.rows + j * 9, cues.rows + j * 9 + 10], [0, 1], { ...clamp, easing: easeOut });
  const roleLit = interpolate(f, [cues.role, cues.role + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, textAlign: "center", fontFamily: BEBAS, fontSize: 66, color: INK, letterSpacing: 3 }}>
        {head > 0.5 ? "OGN CHAMPIONS 2013 · SAME LEAGUE, SAME ROLE" : "LPL 2026 · SAME LEAGUE, SAME ROLE"}</div>
      <div style={{ opacity: 1 - head }}>
        <Logo src="_local/logos/Bilibili_Gaming_2021_allmode.png" x={70} name="BILIBILI GAMING" align="l" />
        <Logo src="_local/logos/Anyones_Legend.png" x={1850} name="ANYONE'S LEGEND" align="r" />
      </div>
      {head > 0 && <div style={{ opacity: head }}>
        <Logo src="_local/logos/SK_Telecom_T1_allmode.png" x={70} name="SK TELECOM T1 K" align="l" />
        <div style={{ position: "absolute", top: 128, right: 70, height: 84, lineHeight: "90px", fontFamily: BEBAS, fontSize: 56, color: INK, letterSpacing: 2 }}>MVP OZONE</div>
      </div>}
      {STATS.map((s, k) => [LX[k], RX[k]].map((x, side) => (
        <div key={s.key + side} style={{ position: "absolute", top: 214, left: x - 80, width: 160, textAlign: "center", fontFamily: BEBAS, fontSize: 27, lineHeight: 1.0, color: MUTE, letterSpacing: 1.5 }}>{head > 0.5 ? OLD_STATS[k].label : s.label}</div>
      )))}
      {head > 0 && ROLES.map((role, j) => {
        const o = oldK(j), l = SKT[j], r = OZ[j], y = Y0 + j * RH + 60;
        return (
          <div key={"old" + role} style={{ position: "absolute", left: 0, top: y, width: 1920, opacity: o, transform: `translateY(${(1 - o) * 24}px)` }}>
            <div style={{ position: "absolute", left: 70, right: 70, top: -RH / 2 + 2, height: RH - 4, borderTop: j ? "1px solid rgba(242,242,238,0.12)" : undefined }} />
            <Face id={l.id} x={130} />
            <div style={{ position: "absolute", left: 210, top: l.name.length > 7 ? -26 : -34, fontFamily: BEBAS, fontSize: l.name.length > 7 ? 46 : 64, color: INK, letterSpacing: 1 }}>{l.name.toUpperCase()}</div>
            <Face id={r.id} x={1790} />
            <div style={{ position: "absolute", right: 210, top: -34, fontFamily: BEBAS, fontSize: 64, color: INK, letterSpacing: 1, textAlign: "right" }}>{r.name.toUpperCase()}</div>
            <div style={{ position: "absolute", left: 960 - 92, width: 184, top: -26, height: 52, lineHeight: "54px", textAlign: "center", fontFamily: BEBAS, fontSize: 40, letterSpacing: 2,
              color: "#10241F", background: TEAL, border: `2px solid ${TEAL}`, borderRadius: 6 }}>{role}</div>
            {[LX[0], RX[0]].map((x, side) => (
              <div key={"nt" + side} style={{ position: "absolute", left: x - 60, width: 120, top: -14, textAlign: "center", fontFamily: BEBAS, fontSize: 26, color: "rgba(155,163,174,0.6)", letterSpacing: 1 }}>NOT TRACKED</div>
            ))}
            {([["kp", (v: number) => v.toFixed(0) + "%"], ["kda", (v: number) => v.toFixed(1)]] as const).map(([key, fmt], i) => {
              const k = i + 1, lv = l[key], rv = r[key];
              return [[LX[k], lv, lv > rv], [RX[k], rv, rv > lv]].map(([x, v, best], side) => (
                <div key={key + side} style={{ position: "absolute", left: (x as number) - 80, width: 160, top: -30, textAlign: "center", fontFamily: BEBAS, fontSize: 54, color: best ? TEAL : MUTE }}>
                  {fmt(v as number)}
                  {best && <div style={{ margin: "-4px auto 0", width: 70, height: 4, background: TEAL }} />}
                </div>
              ));
            })}
          </div>
        );
      })}
      {ROLES.map((role, j) => {
        const o = rowIn(j) * (1 - oldK(j)), l = BLG[j], r = AL[j], y = Y0 + j * RH + 60;
        return (
          <div key={role} style={{ position: "absolute", left: 0, top: y, width: 1920, opacity: o, transform: `translateY(${(1 - o) * 24}px)` }}>
            <div style={{ position: "absolute", left: 70, right: 70, top: -RH / 2 + 2, height: RH - 4, borderTop: j ? "1px solid rgba(242,242,238,0.12)" : undefined }} />
            <Face id={l.id} x={130} />
            <div style={{ position: "absolute", left: 210, top: -34, fontFamily: BEBAS, fontSize: 64, color: INK, letterSpacing: 1 }}>{l.name.toUpperCase()}</div>
            <Face id={r.id} x={1790} />
            <div style={{ position: "absolute", right: 210, top: -34, fontFamily: BEBAS, fontSize: 64, color: INK, letterSpacing: 1, textAlign: "right" }}>{r.name.toUpperCase()}</div>
            <div style={{ position: "absolute", left: 960 - 92, width: 184, top: -26, height: 52, lineHeight: "54px", textAlign: "center", fontFamily: BEBAS, fontSize: 40, letterSpacing: 2,
              color: roleLit > 0.5 ? "#10241F" : INK, background: `rgba(63,208,181,${roleLit})`, border: `2px solid ${roleLit > 0.5 ? TEAL : "rgba(242,242,238,0.5)"}`, borderRadius: 6 }}>{role}</div>
            {STATS.map((s, k) => {
              const lb = l[s.key] > r[s.key], rb = r[s.key] > l[s.key];
              return [[LX[k], l[s.key], lb], [RX[k], r[s.key], rb]].map(([x, v, best], side) => (
                <div key={s.key + side} style={{ position: "absolute", left: (x as number) - 80, width: 160, top: -30, textAlign: "center", fontFamily: BEBAS, fontSize: 54,
                  color: best ? TEAL : MUTE }}>
                  {s.fmt(v as number)}
                  {best && <div style={{ margin: "-4px auto 0", width: 70, height: 4, background: TEAL }} />}
                </div>
              ));
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
