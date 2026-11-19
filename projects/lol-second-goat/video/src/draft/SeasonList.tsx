// Best single season ever, as Jxmy's scrolling ranked list (video-research/jxmy-graphs/videos/eatF7QHwga4/graphs/
// g02_ranked-list-spotlight_ppg-seasons-list-scroll, strips p01-p05): a narrow column of rows (rank, square face, name
// stacked over the season, the number in the accent), the camera scrolls up steadily from the bottom of the list to #1,
// then every other row greys out and one row stays lit. Made in our look (dark slate ground, Bebas, one accent).
// Data: model v13 best single season (league.json cats.peak, peakYear), one season per player.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { D } from "../lib/data";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut = Easing.bezier(0.45, 0, 0.55, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";

/** cues (frames in the scene): scroll start, scroll end (lands on #1), spotlight */
export const SeasonList: React.FC<{ cues: { scroll0: number; scroll1: number; spot: number }; n?: number }> = ({ cues, n = 10 }) => {
  const f = useCurrentFrame();
  const rows = [...D.players].filter((p) => p.cats.peak !== undefined).sort((a, b) => b.cats.peak - a.cats.peak).slice(0, n);
  const RH = 176, X0 = 560, W = 900, k = RH / 118; // big rows, so only five or six fit and the list has to scroll
  // list top at y; camera starts showing the bottom rows and ends with #1 at the top of the frame
  const yStart = 1080 - 60 - n * RH, yEnd = 170;
  const y = interpolate(f, [cues.scroll0, cues.scroll1], [yStart, yEnd], { ...clamp, easing: inOut });
  const spot = interpolate(f, [cues.spot, cues.spot + 10], [0, 1], clamp);
  const fade = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Concrete />
      {rows.map((p, i) => {
        const top = y + i * RH;
        const lit = i === 0;
        const dim = lit ? 0 : spot;
        return (
          <div key={p.id} style={{ position: "absolute", left: X0, top, width: W, height: RH - 12, display: "flex", alignItems: "center",
            background: lit ? `rgba(63,208,181,${0.10 + 0.12 * spot})` : "rgba(255,255,255,0.04)", borderRadius: 6,
            boxShadow: lit && spot ? `inset 0 0 0 3px ${TEAL}` : undefined, opacity: 1 - 0.6 * dim, filter: dim ? `grayscale(${dim})` : undefined }}>
            <div style={{ width: 90 * k, textAlign: "center", fontFamily: BEBAS, fontSize: 58 * k, color: lit ? TEAL : "#8E97A3" }}>{i + 1}</div>
            <div style={{ width: RH - 22, height: RH - 22, borderRadius: 6, overflow: "hidden", background: "#2A2E36", flex: "none" }}>
              {p.photo && <Img src={staticFile(p.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />}
            </div>
            <div style={{ flex: 1, paddingLeft: 26 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 54 * k, lineHeight: 1, color: INK, letterSpacing: 1 }}>{p.name}</div>
              <div style={{ fontFamily: BEBAS, fontSize: 30 * k, lineHeight: 1.1, color: "#9BA3AE", letterSpacing: 1 }}>{p.peakYear} season</div>
            </div>
            <div style={{ width: 150 * k, textAlign: "right", paddingRight: 28, fontFamily: BEBAS, fontSize: 72 * k, color: lit ? TEAL : INK }}>{Math.round(p.cats.peak)}</div>
          </div>
        );
      })}
      {/* fixed header, top left, like the small label Jxmy keeps over a scrolling list */}
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: BEBAS, fontSize: 64, letterSpacing: 2, color: INK, lineHeight: 0.95 }}>
        BEST SINGLE<br />SEASON EVER</div>
      <div style={{ position: "absolute", left: 72, top: 196, fontFamily: BEBAS, fontSize: 30, letterSpacing: 1.5, color: "#9BA3AE", width: 420 }}>
        SEASON SCORE, BEST EVER = 100</div>
    </AbsoluteFill>
  );
};
