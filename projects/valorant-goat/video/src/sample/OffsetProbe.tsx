import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

// Measures the render pipeline's audio offset: click-soft starts exactly at frames 30, 75, 120.
export const OffsetProbe: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {[30, 75, 120].map((f) => (
      <Sequence key={f} from={f} layout="none"><Audio src={staticFile("sfx/click-soft.mp3")} /></Sequence>
    ))}
  </AbsoluteFill>
);
