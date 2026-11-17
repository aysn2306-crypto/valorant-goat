import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../theme";
import { CategoryIntro } from "./CategoryIntro";
import { ClutchBoard, T } from "./ClutchBoard";
import { Sfx, VoLine } from "./parts";

// Sample section, 27 s: P21 category intro -> P22 field histogram -> top 5 countdown.
// Narration lines are scratch text for timing; ay's voiceover replaces them.
const BOARD = 140; // board starts (global frame)
const g = (local: number) => BOARD + local;

export const CLUTCH_SAMPLE_FRAMES = 810;

export const ClutchSample: React.FC<{ showVo: boolean }> = ({ showVo }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={BOARD + 10}>
      <CategoryIntro index={3} total={9} name="CLUTCH" meaning="Who wins the rounds that already look lost?"
        ingredients={["1vX rounds won", "Clutches per map", "Weighted by match importance"]} exitAt={BOARD - 2} />
    </Sequence>
    <Sequence from={BOARD}>
      <ClutchBoard />
    </Sequence>

    {/* sound: every effect has a cause on screen; no music bed yet (none licensed) */}
    <Sfx src="whoosh-short.mp3" at={6} peak={0.157} volume={0.5 * 0.7} />
    <Sfx src="pop.mp3" at={99} peak={0.096} volume={0.3 * 0.7} />
    <Sfx src="click-soft.mp3" at={109} peak={0.026} volume={0.5 * 0.7} />
    <Sfx src="pop.mp3" at={119} peak={0.096} volume={0.3 * 0.7} />
    <Sfx src="whoosh-short.mp3" at={BOARD + 2} peak={0.157} volume={0.45 * 0.7} />
    <Sfx src="pop.mp3" at={g(T.highlight)} peak={0.096} volume={0.45 * 0.7} />
    <Sfx src="whoosh.mp3" at={g(T.fly + 10)} peak={0.3} volume={0.4 * 0.7} />
    <Sfx src="pop.mp3" at={g(T.rows[0])} peak={0.096} volume={0.55 * 0.7} />
    <Sfx src="click-soft.mp3" at={g(T.rows[1])} peak={0.026} volume={0.8 * 0.7} />
    <Sfx src="pop.mp3" at={g(T.rows[2])} peak={0.096} volume={0.55 * 0.7} />
    <Sfx src="click-soft.mp3" at={g(T.rows[3])} peak={0.026} volume={0.8 * 0.7} />
    <Sfx src="riser.mp3" at={g(T.rows[4])} peak={3.96} skip={1.6} volume={0.3 * 0.7} trimEnd={2.45} />
    <Sfx src="impact-bass-1.mp3" at={g(T.rows[4])} peak={0.052} volume={0.8 * 0.7} />

    {showVo && (
      <>
        <VoLine from={6} to={56} text="Category three. Clutch." />
        <VoLine from={60} to={134} text="Who wins the rounds that already look lost?" />
        <VoLine from={g(12)} to={g(T.highlight - 12)} text="Here's every pro with fifty-plus maps, scored on clutch." />
        <VoLine from={g(T.highlight)} to={g(T.rows[0] - 30)} text="Most sit right around the middle. But five are out on their own." />
        <VoLine from={g(T.rows[0])} to={g(T.rows[1] - 4)} text="Number five: something." />
        <VoLine from={g(T.rows[1])} to={g(T.rows[2] - 4)} text="Four: Less." />
        <VoLine from={g(T.rows[2])} to={g(T.rows[3] - 4)} text="Three: Derke." />
        <VoLine from={g(T.rows[3])} to={g(T.rows[3] + 50)} text="Two: aspas." />
        <VoLine from={g(T.rows[3] + 54)} to={g(T.rows[4] - 2)} text="And the best clutch player in Valorant..." />
        <VoLine from={g(T.rows[4])} to={g(T.rows[4] + 100)} text="Chronicle." />
      </>
    )}
  </AbsoluteFill>
);
