import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, loadFonts } from "./theme";
import { Leaderboard } from "./components/Leaderboard";
import { OffsetProbe } from "./sample/OffsetProbe";
import { ClutchSample, CLUTCH_SAMPLE_FRAMES } from "./sample/ClutchSample";

loadFonts();

const before = [
  { name: "TenZ", team: "SEN", value: 82.4 },
  { name: "aspas", team: "LEV", value: 81.9 },
  { name: "Derke", team: "FNC", value: 80.7 },
  { name: "Chronicle", team: "FNC", value: 79.3 },
  { name: "yay", team: "OPTC", value: 78.8 },
  { name: "Demon1", team: "EG", value: 76.1 },
];
const after = [
  { name: "aspas", value: 86.2 },
  { name: "Chronicle", value: 84.0 },
  { name: "Derke", value: 82.1 },
  { name: "TenZ", value: 78.5 },
  { name: "Demon1", value: 77.9 },
  { name: "yay", value: 74.2 },
];

export const Root: React.FC = () => (
  <>
    <Composition id="OffsetProbe" component={OffsetProbe} durationInFrames={150} fps={FPS} width={640} height={360} />
    <Composition id="ClutchSample" component={ClutchSample} durationInFrames={CLUTCH_SAMPLE_FRAMES} fps={FPS} width={W} height={H}
      defaultProps={{ showVo: true }} />
    <Composition id="TestLeaderboard" component={Leaderboard} durationInFrames={FPS * 7} fps={FPS} width={W} height={H}
      defaultProps={{ title: "TWIST #1: TROPHIES COUNT", subtitle: "Demo numbers, not real scores", before, after, reshuffleAt: 75, goldTop: 3 }} />
  </>
);
