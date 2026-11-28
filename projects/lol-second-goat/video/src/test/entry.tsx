import React from "react";
import { Composition, registerRoot } from "remotion";
import { MatchupSheet, TaggedClips } from "../draft/Polish";
import { loadFonts } from "../theme";
loadFonts();
const T: React.FC = () => <MatchupSheet cues={{ stats: [20, 40, 60, 80, 100], role: 130 }} />;
const C: React.FC = () => <TaggedClips shots={[{ id: "chovySolo", from: 7, at: 0, tag: "CHOVY" }, { id: "chovyDodge", from: 0, at: 60, tag: "CHOVY" }, { id: "binJax", from: 0, at: 120, tag: "BIN ON JAX" }]} />;
registerRoot(() => <><Composition id="T" component={T} durationInFrames={200} fps={30} width={1920} height={1080} />
  <Composition id="C" component={C} durationInFrames={200} fps={30} width={1920} height={1080} /></>);
