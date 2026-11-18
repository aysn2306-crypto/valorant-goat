import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, loadFonts } from "./theme";
import { OffsetProbe } from "./sample/OffsetProbe";
import { TrophiesSample, TROPHIES_SAMPLE_FRAMES } from "./sample/TrophiesSample";

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="OffsetProbe" component={OffsetProbe} durationInFrames={150} fps={FPS} width={640} height={360} />
    <Composition id="TrophiesSample" component={TrophiesSample} durationInFrames={TROPHIES_SAMPLE_FRAMES} fps={FPS} width={W} height={H}
      defaultProps={{ showVo: true }} />
  </>
);
