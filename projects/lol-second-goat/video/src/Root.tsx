import * as Cl from "./samples/Climb";
import React from "react";
import { Composition, Still } from "remotion";
import * as St from "./stills/Stills";
import * as Mo from "./motion/Tests";
import { FPS, H, W, loadFonts } from "./theme";
import { OffsetProbe } from "./sample/OffsetProbe";
import { TrophiesSample, TROPHIES_SAMPLE_FRAMES } from "./sample/TrophiesSample";
import { Main, TOTAL } from "./Main";
import { TrophyTower, TOWER_FRAMES } from "./sample/TrophyTower";
import { TrophyDots, DOTS_FRAMES } from "./sample/TrophyDots";
import { RoughCut, ROUGH_TOTAL } from "./rough/RoughCut";
import * as Sm from "./samples/Samples";
import { Draft, DRAFT_TOTAL } from "./draft/Draft";

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="OffsetProbe" component={OffsetProbe} durationInFrames={150} fps={FPS} width={640} height={360} />
    <Composition id="TrophiesSample" component={TrophiesSample} durationInFrames={TROPHIES_SAMPLE_FRAMES} fps={FPS} width={W} height={H}
      defaultProps={{ showVo: true }} />
    <Composition id="TrophyTower" component={TrophyTower} durationInFrames={TOWER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="TrophyDots" component={TrophyDots} durationInFrames={DOTS_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ captions: true, scratchTag: true }} />
    <Composition id="Draft" component={Draft} durationInFrames={DRAFT_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SCards" component={Sm.SCards} durationInFrames={Sm.CARDS_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="SClimb" component={Cl.SClimb} durationInFrames={Cl.CLIMB_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="SPyramidCam" component={Sm.SPyramidCam} durationInFrames={Sm.PYRC_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="SElo" component={Sm.SElo} durationInFrames={Sm.ELO_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="SPlusMinus" component={Sm.SPlusMinus} durationInFrames={Sm.PM_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="SPyramid" component={Sm.SPyramid} durationInFrames={Sm.PYR_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="RoughCut" component={RoughCut} durationInFrames={ROUGH_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="T1Rise" component={Mo.T1Rise} durationInFrames={Mo.T1_RISE} fps={FPS} width={W} height={H} />
    <Composition id="T2Climb" component={Mo.T2Climb} durationInFrames={Mo.T2_CLIMB} fps={FPS} width={W} height={H} />
    <Composition id="T3Count" component={Mo.T3Count} durationInFrames={Mo.T3_COUNT} fps={FPS} width={W} height={H} />
    <Composition id="T4Spot" component={Mo.T4Spot} durationInFrames={Mo.T4_SPOT} fps={FPS} width={W} height={H} />
    {Object.entries(St).map(([k, Comp]) => (
      <Still key={k} id={k} component={Comp as React.FC} width={W} height={H} />
    ))}
  </>
);
