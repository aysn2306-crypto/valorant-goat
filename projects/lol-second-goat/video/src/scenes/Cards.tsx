// Text-led scenes: chapter card, big number, formula, statement, quote list.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Count, Frame, Photo, pop, prog } from "../lib/ui";

export const ChapterCard: React.FC<{ n: number; total?: number; name: string; line?: string; field?: "orange" | "bone" | "dark" }> = ({ n, total, name, line, field = "dark" }) => {
  const f = useCurrentFrame();
  const bg = field === "orange" ? "#E8742A" : field === "bone" ? "#EDE6D8" : C.bg;
  const ink = field === "bone" ? "#14171C" : C.text;
  const sub = field === "bone" ? "#5A5F68" : field === "orange" ? "#2B1408" : C.muted;
  const a = prog(f, 0, 12), b = prog(f, 8, 22), c = prog(f, 16, 30);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: "center", paddingLeft: 160 }}>
      <div style={{ fontFamily: F.body, fontSize: 30, letterSpacing: 6, color: sub, opacity: a }}>
        CHAPTER {n}{total ? ` / ${total}` : ""}
      </div>
      <div style={{ fontFamily: F.title, fontSize: 170, lineHeight: 1.0, color: ink, marginTop: 10, opacity: b,
        transform: `translateY(${(1 - b) * 30}px)` }}>{name.toUpperCase()}</div>
      {line && <div style={{ fontFamily: F.body, fontSize: 36, color: sub, marginTop: 22, opacity: c, maxWidth: 1300 }}>{line}</div>}
    </AbsoluteFill>
  );
};

export const BigNumbers: React.FC<{ title?: string; items: { v: number; label: string; d?: number; suffix?: string; at: number }[]; chapter?: string }> = ({ title, items, chapter }) => {
  const f = useCurrentFrame();
  return (
    <Frame title={title} chapter={chapter}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 360, display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 40 }}>
        {items.map((it, i) => {
          const o = prog(f, it.at, it.at + 10);
          return (
            <div key={i} style={{ opacity: o, transform: `translateY(${(1 - o) * 20}px)`, textAlign: "left" }}>
              <div style={{ fontFamily: F.title, fontSize: items.length > 3 ? 120 : 160, color: C.text, lineHeight: 1 }}>
                <Count to={it.v} at={it.at} dur={36} d={it.d ?? 0} suffix={it.suffix ?? ""} />
              </div>
              <div style={{ fontFamily: F.body, fontSize: 32, color: C.muted, marginTop: 12 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

/** Formula board: lines appear one at a time; parts in [[...]] show in cyan, {{...}} in gold. */
export const Formula: React.FC<{ title: string; sub?: string; lines: { t: string; at: number; small?: boolean }[]; subject?: string; chapter?: string; side?: React.ReactNode }> = ({
  title, sub, lines, subject, chapter, side,
}) => {
  const f = useCurrentFrame();
  const render = (t: string) =>
    t.split(/(\[\[.*?\]\]|\{\{.*?\}\})/).map((part, i) =>
      part.startsWith("[[") ? <span key={i} style={{ color: C.cyan }}>{part.slice(2, -2)}</span>
        : part.startsWith("{{") ? <span key={i} style={{ color: C.gold }}>{part.slice(2, -2)}</span>
          : <span key={i}>{part}</span>);
  return (
    <Frame title={title} sub={sub} subject={subject} chapter={chapter}>
      <div style={{ position: "absolute", left: 140, top: 290, width: side ? 980 : 1640 }}>
        {lines.map((l, i) => {
          const o = prog(f, l.at, l.at + 10);
          return (
            <div key={i} style={{ fontFamily: F.body, fontSize: l.small ? 32 : 50, fontWeight: l.small ? 400 : 500, color: l.small ? C.muted : C.text,
              marginBottom: l.small ? 22 : 40, opacity: o, transform: `translateX(${(1 - o) * -16}px)`, lineHeight: 1.3 }}>{render(l.t)}</div>
          );
        })}
      </div>
      {side && <div style={{ position: "absolute", left: 1180, top: 250, width: 600 }}>{side}</div>}
    </Frame>
  );
};

export const Statement: React.FC<{ text: string; sub?: string; field?: "dark" | "bone" | "orange"; photos?: string[]; at?: number }> = ({ text, sub, field = "dark", photos = [], at = 0 }) => {
  const f = useCurrentFrame();
  const bg = field === "orange" ? "#E8742A" : field === "bone" ? "#EDE6D8" : C.bg;
  const ink = field === "bone" ? "#14171C" : C.text;
  const a = prog(f, at, at + 12), b = prog(f, at + 10, at + 24);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {photos.length > 0 && (
        <div style={{ display: "flex", gap: 24, marginBottom: 50 }}>
          {photos.map((id, i) => <div key={id} style={{ transform: `scale(${pop(f, at + 4 + i * 4)})` }}><Photo id={id} size={150} /></div>)}
        </div>
      )}
      <div style={{ fontFamily: F.title, fontSize: 110, color: ink, textAlign: "center", lineHeight: 1.05, opacity: a, maxWidth: 1600,
        transform: `translateY(${(1 - a) * 24}px)` }}>{text}</div>
      {sub && <div style={{ fontFamily: F.body, fontSize: 38, color: field === "bone" ? "#5A5F68" : field === "orange" ? "#2B1408" : C.muted, marginTop: 28, opacity: b,
        textAlign: "center", maxWidth: 1400 }}>{sub}</div>}
    </AbsoluteFill>
  );
};
