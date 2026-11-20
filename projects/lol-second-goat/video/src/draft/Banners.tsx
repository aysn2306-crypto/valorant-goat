// Three more Jxmy shapes in our look (Bebas and Inter, one TEAL accent, no gradient, glow or resting shadow).
// StatBanner: Jxmy's angled stat banner over footage (video-research/jxmy-graphics/videos/XyihDTdpF8w/graphs/
//   x07_stat-banner_angled-stat-banner-over-footage): a light trapezoid hanging from the top edge, three small labels
//   over three big numbers, a thin rule before the last one. Data: research/league-v14.json trophyPts.
// RecordCounter: Jxmy's record card (jxmy-graphs/videos/4lbvnNVGd-I/graphs/g06_record-counter_as-scaled-to-82-games):
//   a round badge, a name and a year line, a big record with small labels under it, the next fact appearing beside it.
//   Data: the 1,000 reruns (MODEL-CURRENT.md, v14: Faker #1 and Knight #2 in 1,000 of 1,000).
// QuoteSubtitle: Jxmy's quote subtitles over footage (jxmy-graphics/videos/3hZ6Su5PVnI/graphs/
//   x02_quote-subtitle_quote-subtitles-over-footage): one short line in quotes, wide heavy type, centred over the shot.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Concrete } from "../samples/Climb";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const BEBAS = "Bebas Neue";
const INK = "#F2F2EE";
const TEAL = "#3FD0B5";
const MUTE = "#9BA3AE";
const GROUND = "#1B1E25";
const BONE = "#E9E6DE";

/** the banner drops from the top at `at`; each cell's number appears on its own cue */
export const StatBanner: React.FC<{ at: number; cells: { label: string; value: string; at: number; accent?: boolean }[] }> = ({ at, cells }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: easeOut });
  const W = 1240, H = 190, x = (1920 - W) / 2, slant = 70;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polygon points={`${x},0 ${x + W},0 ${x + W - slant},${H} ${x + slant},${H}`} fill={BONE} transform={`translate(0 ${(k - 1) * (H + 10)})`} />
      </svg>
      <div style={{ position: "absolute", left: x + slant, width: W - 2 * slant, top: (k - 1) * (H + 10), height: H, display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
        {cells.map((c, i) => {
          const v = interpolate(f, [c.at, c.at + 6], [0, 1], clamp);
          return (
            <React.Fragment key={i}>
              {i === cells.length - 1 && <div style={{ width: 3, height: 110, background: "#B9B5AC" }} />}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: "#7A7D84" }}>{c.label}</div>
                <div style={{ fontFamily: BEBAS, fontSize: 112, lineHeight: 1, color: c.accent ? "#1E9C86" : GROUND, opacity: v }}>{c.value}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** cues: first (the Faker row lands), second (the mystery row lands) */
export const RecordCounter: React.FC<{ cues: { first: number; second: number } }> = ({ cues }) => {
  const f = useCurrentFrame();
  const rows = [
    { at: cues.first, badge: "players/faker.png", name: "FAKER", sub: "1,000 RERUNS, WEIGHTS ROLLED AT RANDOM", rank: "#1", accent: false, n: 1000 },
    { at: cues.second, badge: null, name: "? ? ?", sub: "THE SAME NAME EVERY TIME", rank: "#2", accent: true, n: 1000 }, // v15.1: Knight 1,000 of 1,000
  ];
  return (
    <AbsoluteFill>
      <Concrete />
      {rows.map((r, i) => {
        const k = interpolate(f, [r.at, r.at + 10], [0, 1], { ...clamp, easing: easeOut });
        const rec = interpolate(f, [r.at + 6, r.at + 30], [0, r.n], { ...clamp, easing: Easing.out(Easing.quad) });
        const top = 170 + i * 400;
        const col = r.accent ? TEAL : INK;
        return (
          <div key={i} style={{ position: "absolute", left: 470, top, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 230, height: 230, borderRadius: "50%", overflow: "hidden", background: "#2E333C",
              border: `5px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BEBAS, fontSize: 150, color: col }}>
              {r.badge ? <Img src={staticFile(r.badge)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "?"}
            </div>
            <div style={{ position: "absolute", left: 280, top: 6, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: BEBAS, fontSize: 58, letterSpacing: 3, color: col }}>{r.name}</div>
              <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: MUTE, marginTop: -6 }}>{r.sub}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 70, marginTop: 6 }}>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.95, color: INK }}>{Math.round(rec).toLocaleString("en-US")} <span style={{ color: MUTE }}>/</span> 1,000</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>RERUNS AT THIS RANK</div>
                </div>
                <div style={{ opacity: interpolate(f, [r.at + 30, r.at + 36], [0, 1], clamp) }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: MUTE }}>RANK</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.95, color: col }}>{r.rank}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** each line cuts in on its cue and replaces the one before, like a subtitle */
export const QuoteSubtitle: React.FC<{ lines: { text: string; at: number }[]; y?: number }> = ({ lines, y = 480 }) => {
  const f = useCurrentFrame();
  const cur = [...lines].reverse().find((l) => f >= l.at);
  if (!cur) return null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Inter", fontWeight: 900, fontSize: 92, letterSpacing: 1,
        color: INK, WebkitTextStroke: "2px rgba(16,18,22,0.55)", paintOrder: "stroke fill" }}>“{cur.text}”</div>
    </AbsoluteFill>
  );
};

/** ay 20 Nov: "just write it on the screen, black background" */
export const OnBlack: React.FC<{ big: string; at: number; sub?: string; subAt?: number }> = ({ big, at, sub, subAt = at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 6], [0, 1], clamp);
  const s = interpolate(f, [subAt, subAt + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: BEBAS, fontSize: 210, letterSpacing: 6, color: INK, opacity: k, lineHeight: 1 }}>{big}</div>
      {sub && <div style={{ fontFamily: BEBAS, fontSize: 46, letterSpacing: 4, color: MUTE, opacity: s, marginTop: 24 }}>{sub}</div>}
    </AbsoluteFill>
  );
};
