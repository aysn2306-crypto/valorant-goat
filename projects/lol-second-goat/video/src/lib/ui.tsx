import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { P, Player } from "./data";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0..1 progress between two frames, eased. */
export const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
export const pop = (f: number, at: number, fps = 30) => spring({ frame: f - at, fps, config: { damping: 14, stiffness: 140, mass: 0.6 } });

/** Player photo tile: transparent cutout on a dark tile, thin ring. */
export const Photo: React.FC<{ id: string; size: number; ring?: string; dim?: number; blur?: number; round?: boolean; bg?: string }> = ({
  id, size, ring = "rgba(237,239,242,0.25)", dim = 0, blur = 0, round = false, bg = C.panelHi,
}) => {
  const p = P(id);
  const r = round ? size / 2 : size * 0.16;
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: bg, overflow: "hidden", position: "relative",
      boxShadow: `inset 0 0 0 ${Math.max(1.5, size * 0.02)}px ${ring}`, filter: blur ? `blur(${blur}px)` : undefined, flexShrink: 0 }}>
      {p.photo ? (
        <Img src={staticFile(p.photo)} style={{ position: "absolute", left: "-8%", width: "116%", bottom: -size * 0.02, objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.title, fontSize: size * 0.4, color: C.text }}>{p.name.slice(0, 2).toUpperCase()}</div>
      )}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: `inset 0 0 0 ${Math.max(1.5, size * 0.02)}px ${ring}` }} />
      {dim > 0 && <div style={{ position: "absolute", inset: 0, background: C.bg, opacity: dim }} />}
    </div>
  );
};

/** Standard scene frame: title top-left, optional subject chip top-right, source line bottom-right. */
export const Frame: React.FC<{ title?: string; sub?: string; subject?: string; chapter?: string; children: React.ReactNode; inAt?: number; source?: string }> = ({
  title, sub, subject, chapter, children, inAt = 0, source = "Data: Leaguepedia · Oracle's Elixir · Liquipedia",
}) => {
  const f = useCurrentFrame();
  const o = prog(f, inAt, inAt + 10);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {children}
      {title && (
        <div style={{ position: "absolute", left: 96, top: 64, opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 46, color: C.text, letterSpacing: -0.5 }}>{title}</div>
          {sub && <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 26, color: C.muted, marginTop: 6 }}>{sub}</div>}
        </div>
      )}
      {subject && (
        <div style={{ position: "absolute", right: 96, top: 60, display: "flex", alignItems: "center", gap: 14, opacity: o }}>
          <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 28, color: C.text }}>{P(subject).name}</div>
          <Photo id={subject} size={64} />
        </div>
      )}
      {chapter && (
        <div style={{ position: "absolute", left: 96, bottom: 40, fontFamily: F.body, fontSize: 18, letterSpacing: 2, color: C.muted, opacity: o }}>
          {chapter.toUpperCase()}
        </div>
      )}
      {source && (
        <div style={{ position: "absolute", right: 96, bottom: 40, fontFamily: F.body, fontSize: 17, color: "#4A5361", opacity: o }}>{source}</div>
      )}
    </AbsoluteFill>
  );
};

/** Count-up number. */
export const Count: React.FC<{ to: number; at: number; dur?: number; d?: number; style?: React.CSSProperties; prefix?: string; suffix?: string }> = ({
  to, at, dur = 30, d = 0, style, prefix = "", suffix = "",
}) => {
  const f = useCurrentFrame();
  const v = to * prog(f, at, at + dur);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{prefix}{v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}{suffix}</span>;
};

export const roleIcon = (r: string) => ({ Top: "TOP", Jungle: "JG", Mid: "MID", Bot: "BOT", Support: "SUP" } as Record<string, string>)[r] || r;
export const useFps = () => useVideoConfig().fps;
export type { Player };
