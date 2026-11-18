import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../theme";
import { CategoryIntro } from "./CategoryIntro";
import { CategoryBoard, T } from "./CategoryBoard";
import { Sfx, VoLine } from "./parts";
import { FIELD, TOP5 } from "../data/trophies";

// League sample, 27 s: P21 category intro -> P22 field histogram -> top 5 countdown (Trophies).
// Real DRAFT numbers from scoring (test 4). Narration lines are scratch text for timing; ay's voiceover replaces them.
const BOARD = 140;
const g = (local: number) => BOARD + local;
export const TROPHIES_SAMPLE_FRAMES = 810;

export const TrophiesSample: React.FC<{ showVo: boolean }> = ({ showVo }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={BOARD + 10}>
      <CategoryIntro index={1} total={8} name="TROPHIES" meaning="Who won the most, and how much did they carry?"
        ingredients={["Worlds 100 · MSI 50 · league titles up to 20", "Finals and semis count too", "Times each player's carry share"]} exitAt={BOARD - 2} />
    </Sequence>
    <Sequence from={BOARD}>
      <CategoryBoard />
    </Sequence>

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
        <VoLine from={6} to={56} text="Category one. Trophies." />
        <VoLine from={60} to={134} text="Who won the most, and how much did they actually carry?" />
        <VoLine from={g(12)} to={g(T.highlight - 12)} text={`Here's every player with a real trophy case: ${FIELD.length} of them.`} />
        <VoLine from={g(T.highlight)} to={g(T.rows[0] - 30)} text="Five stand out. And one is on another planet." />
        <VoLine from={g(T.rows[0])} to={g(T.rows[1] - 4)} text={`Number five: ${TOP5[4].name}.`} />
        <VoLine from={g(T.rows[1])} to={g(T.rows[2] - 4)} text={`Four: ${TOP5[3].name}.`} />
        <VoLine from={g(T.rows[2])} to={g(T.rows[3] - 4)} text={`Three: ${TOP5[2].name}.`} />
        <VoLine from={g(T.rows[3])} to={g(T.rows[3] + 50)} text={`Two: ${TOP5[1].name}.`} />
        <VoLine from={g(T.rows[3] + 54)} to={g(T.rows[4] - 2)} text="And no surprise at number one..." />
        <VoLine from={g(T.rows[4])} to={g(T.rows[4] + 100)} text={`${TOP5[0].name}.`} />
      </>
    )}
  </AbsoluteFill>
);
