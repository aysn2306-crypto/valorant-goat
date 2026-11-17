import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Placeholder portrait until prosettings.net photos are pulled on ay's PC:
// dark tile, team-colour border, player initials.
export const Portrait: React.FC<{ name: string; color: string; size: number; blur?: number; dim?: number; ring?: number; label?: boolean }> = ({
  name, color, size, blur = 0, dim = 0, ring = 0, label = true,
}) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.18, background: C.panel,
    border: `${Math.max(2, size * 0.05)}px solid ${color}`, boxSizing: "border-box",
    display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
    boxShadow: ring > 0 ? `0 0 0 ${size * 0.08}px rgba(34,211,238,${ring}), 0 0 ${size * 0.5}px rgba(34,211,238,${ring * 0.5})` : "none",
    filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
    {label && <span style={{ fontFamily: F.title, fontSize: size * 0.42, color: C.text, lineHeight: 1 }}>
      {name.slice(0, 2).toUpperCase()}
    </span>}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.18, background: C.bg, opacity: dim }} />}
  </div>
);

// One sound effect, placed so its loudest moment lands `peak` seconds after `at`
// (sound arrives one frame after the picture).
export const Sfx: React.FC<{ src: string; at: number; peak?: number; volume?: number; trimEnd?: number; skip?: number }> = ({
  src, at, peak = 0, volume = 1, trimEnd, skip = 0,
}) => {
  const from = Math.max(0, Math.round(at - (peak - skip) * 30) + 1);
  return (
    <Sequence from={from} durationInFrames={trimEnd ? Math.round(trimEnd * 30) : undefined} layout="none">
      <Audio src={staticFile(`sfx/${src}`)} volume={volume} startFrom={Math.round(skip * 30)} />
    </Sequence>
  );
};

// Scratch narration line, so the timing can be judged before ay records.
export const VoLine: React.FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 4, to - 4, to], [0, 1, 1, 0], clamp);
  if (f < from || f > to) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: F.body, fontSize: 30, fontStyle: "italic", color: C.muted, background: "rgba(14,17,22,0.8)",
        padding: "8px 18px", borderRadius: 8 }}>
        <span style={{ fontStyle: "normal", fontWeight: 700, color: C.muted, marginRight: 12, fontSize: 22 }}>VO</span>
        {text}
      </div>
    </div>
  );
};

export const SourceTag: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", right: 96, bottom: 40, fontFamily: F.body, fontSize: 20, color: C.muted, opacity }}>
    Data: vlr.gg, Liquipedia (CC-BY-SA) · <span style={{ color: C.red }}>DEMO NUMBERS</span>
  </div>
);

export const Bg: React.FC = () => <AbsoluteFill style={{ backgroundColor: C.bg }} />;
