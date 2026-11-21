// Line 13 (ay 21 Nov 00:42 "be honest about why he was 14th"): in model version 1 Faker already had full marks on
// trophies; he was 14th because of missing data. Part scores from version 1 (trophies 100, big stage play 12, carry 48),
// then the 2013 games the data had (38 of his 65) and no damage stats before 2020. Numbers from the model thread.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue", INK = "#F2F2EE", MUTE = "#9BA3AE", GOLD = "#E8B04B", GREY = "#6B7178";

export const VersionOne: React.FC<{ trophiesAt: number; partsAt: number; gamesAt: number; damageAt: number }> = ({ trophiesAt, partsAt, gamesAt, damageAt }) => {
  const f = useCurrentFrame();
  const tO = interpolate(f, [0, 8], [0, 1], clamp);
  const BX = 520, BW = 1100;
  const parts: [string, number, string, number][] = [["TROPHIES", 100, GOLD, trophiesAt], ["BIG STAGE PLAY", 12, GREY, partsAt], ["CARRY", 48, GREY, partsAt + 6]];
  const gO = interpolate(f, [gamesAt, gamesAt + 8], [0, 1], clamp);
  const dO = interpolate(f, [damageAt, damageAt + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Concrete />
      <div style={{ position: "absolute", left: 160, top: 60, opacity: tO, fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, color: INK }}>FAKER IN MODEL VERSION 1: #14</div>
      {parts.map(([name, v, col, at], i) => {
        const k = interpolate(f, [at, at + 20], [0, 1], { ...clamp, easing: easeOut });
        const y = 200 + i * 110;
        return (
          <div key={name} style={{ opacity: interpolate(f, [at - 4, at + 4], [0, 1], clamp) }}>
            <div style={{ position: "absolute", left: 160, width: 330, top: y + 8, textAlign: "right", fontFamily: BEBAS, fontSize: 48, letterSpacing: 2, color: i === 0 ? GOLD : INK }}>{name}</div>
            <div style={{ position: "absolute", left: BX, top: y, width: BW, height: 70, background: "rgba(242,242,238,0.08)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v * k}%`, background: col }} />
            </div>
            <div style={{ position: "absolute", left: BX + (BW * v * k) / 100 + 20, top: y + 6, fontFamily: BEBAS, fontSize: 56, color: i === 0 ? GOLD : INK }}>{Math.round(v * k)}</div>
          </div>
        );
      })}
      {/* the 2013 games in the data: 38 of 65 */}
      <div style={{ position: "absolute", left: 160, top: 590, opacity: gO, fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK }}>
        HIS 2013 GAMES IN THE DATA: <span style={{ color: GOLD }}>38 OF 65</span></div>
      <div style={{ position: "absolute", left: 160, top: 660, width: 1452, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Array.from({ length: 65 }, (_, i) => {
          const k = interpolate(f, [gamesAt + i * 0.6, gamesAt + 6 + i * 0.6], [0, 1], clamp);
          const have = i < 38;
          return <div key={i} style={{ width: 36, height: 36, boxSizing: "border-box", opacity: k, background: have ? INK : "transparent", border: have ? "none" : `3px dashed ${MUTE}` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 160, top: 900, opacity: dO, fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: INK }}>
        DAMAGE STATS: <span style={{ color: MUTE }}>NONE BEFORE 2020</span></div>
    </AbsoluteFill>
  );
};
