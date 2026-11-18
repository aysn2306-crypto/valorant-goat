import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Photo, clamp, ease, prog } from "../lib/ui";
import league from "../data/league.json";
import vo from "../data/tower_vo.json";

// The trophy cabinet award, about 30 s: the pack at ~500, the camera scrolls up to Faker, then
// Ruler + Gumayusi stacked beside him still fall short. Style guide: faces as data, gold only for Faker,
// one new thing at a time, no narration on screen, nothing in the bottom 12%.

type Pl = { id: string; name: string; raw: { trophies: number } };
const ALL = (league as { players: Pl[] }).players;
const pts = (id: string) => Math.round(ALL.find((p) => p.id === id)!.raw.trophies);
const PACK = ["bin", "caps", "chovy", "wolf", "bang", "zeus", "oner", "keria", "knight", "canyon", "gumayusi", "ruler"]
  .map((id) => ({ id, name: ALL.find((p) => p.id === id)!.name, v: pts(id) }));
const NOMINEES = ["ruler", "gumayusi", "canyon", "knight"];
const FAKER = pts("faker");
const RULER = pts("ruler");
const GUMA = pts("gumayusi");

// timeline from the scratch VO lengths
const GAPS = [15, 10, 8, 6, 6, 16, 16];
const starts: number[] = [];
let t = 0;
vo.forEach((l, i) => { t += GAPS[i]; starts.push(t); t += Math.round(l.sec * 30); });
export const TOWER_FRAMES = t + 45;
const at = (line: number, word: string) => {
  const text = vo[line].text;
  return starts[line] + Math.round((text.indexOf(word) / text.length) * vo[line].sec * 30 * 0.92);
};
const T = {
  grow: starts[0] + 85,
  names: NOMINEES.map((id) => at(1, ALL.find((p) => p.id === id)!.name)),
  line500: at(1, "500") - 6,
  pan: starts[2],
  land: at(4, "Faker") + 4,
  zoom: at(4, "points") + 20,
  stackA: starts[5] + 6,
  stackB: starts[5] + 34,
  gap: starts[5] + 64,
  dimAll: starts[6],
};

// world geometry (px at scale 1): baseline at y 0, values go up
const K = 1.1;
const BASE = 910;
const xPack = (i: number) => 250 + i * 97;
const X_STACK = 1520;
const X_FAKER = 1715;
const BAR = 70;
const BAR_F = 110;

const Bar: React.FC<{ x: number; v: number; w: number; color: string; face?: string; label?: string; labelO?: number; faceO?: number; ring?: string; name?: string; nameColor?: string }> = ({
  x, v, w, color, face, label, labelO = 0, faceO = 1, ring, name, nameColor = C.muted,
}) => {
  const h = v * K;
  return (
    <>
      <div style={{ position: "absolute", left: x - w / 2, top: -h, width: w, height: h, background: color, borderRadius: "4px 4px 0 0" }} />
      {face && v > 1 && (
        <div style={{ position: "absolute", left: x - w / 2, top: -h - w - 8, opacity: faceO }}>
          <Photo id={face} size={w} ring={ring} />
        </div>
      )}
      {label && (
        <div style={{ position: "absolute", left: x - 100, width: 200, top: -h - w - 52, textAlign: "center", opacity: labelO,
          fontFamily: F.body, fontWeight: 700, fontSize: w > 90 ? 44 : 30, color: C.text, fontVariantNumeric: "tabular-nums" }}>{label}</div>
      )}
      {name && (
        <div style={{ position: "absolute", left: x - 60, width: 120, top: 14, textAlign: "center", fontFamily: F.body, fontWeight: 600,
          fontSize: w > 90 ? 26 : 19, color: nameColor }}>{name}</div>
      )}
    </>
  );
};

export const TrophyTower: React.FC = () => {
  const f = useCurrentFrame();

  // camera: pan up with Faker's bar, then pull back to show the whole tower
  const pan = prog(f, T.pan, T.land);
  const zoom = prog(f, T.zoom, T.zoom + 36);
  const panY = 790 * pan;
  const scale = interpolate(zoom, [0, 1], [1, 0.52]);
  const zoomY = interpolate(zoom, [0, 1], [panY, 399]);
  const camY = zoom > 0 ? zoomY : panY;

  // Faker's bar leads the camera up; it starts at the top of the pack and climbs to its value
  const fGrow = interpolate(f, [T.pan - 10, T.land], [0, FAKER], { ...clamp, easing: ease });
  const fFace = prog(f, T.land - 2, T.land + 8);
  const fLabel = prog(f, T.land + 6, T.land + 16);

  const dimPack = prog(f, T.names[0] - 4, T.names[0] + 6);
  const dimEnd = prog(f, T.dimAll, T.dimAll + 15);
  const stackA = interpolate(f, [T.stackA, T.stackA + 24], [0, RULER], { ...clamp, easing: ease });
  const stackB = interpolate(f, [T.stackB, T.stackB + 24], [0, GUMA], { ...clamp, easing: ease });
  const gapO = prog(f, T.gap, T.gap + 12) * (1 - dimEnd);
  const line500 = prog(f, T.line500, T.line500 + 15) * (1 - prog(f, T.pan, T.pan + 15));
  const titleO = prog(f, 4, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
        transform: `scale(${scale}) translateY(${camY}px)`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: 0, top: BASE, width: 1920 }}>
          {/* grid: every 100 points, fixed at its final size before any bar grows */}
          {Array.from({ length: 12 }, (_, i) => (i + 1) * 100).map((g) => (
            <div key={g} style={{ position: "absolute", left: 180, right: 80, top: -g * K, height: 1.5,
              background: "rgba(237,239,242,0.07)", opacity: prog(f, 0, 14) }}>
              <div style={{ position: "absolute", left: -110, top: -15, width: 96, textAlign: "right", fontFamily: F.body, fontSize: 24,
                color: C.muted, fontVariantNumeric: "tabular-nums" }}>{g.toLocaleString("en-US")}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 180, right: 80, top: 0, height: 2, background: "rgba(237,239,242,0.25)" }} />
          {/* "just over 500" */}
          <div style={{ position: "absolute", left: 180, right: 380, top: -500 * K, borderTop: `2px dashed ${C.text}`, opacity: line500 * 0.5 }} />

          {PACK.map((p, i) => {
            const g = interpolate(f, [T.grow + i * 6, T.grow + i * 6 + 30], [0, p.v], { ...clamp, easing: ease });
            const n = NOMINEES.indexOf(p.id);
            const lit = n >= 0 && f >= T.names[n] - 2;
            const now = n >= 0 && f >= T.names[n] - 2 && (n === 3 ? f < T.pan : f < T.names[n + 1] - 2);
            const o = (n >= 0 ? 1 : 1 - 0.7 * dimPack) * (1 - 0.6 * dimEnd);
            return (
              <div key={p.id} style={{ opacity: o }}>
                <Bar x={xPack(i)} v={g} w={BAR} color={now ? C.cyan : lit ? "#AEB7C2" : "#3A4350"} face={p.id}
                  ring={now ? C.cyan : undefined} faceO={prog(f, T.grow + i * 6 + 18, T.grow + i * 6 + 28)}
                  label={lit ? `${p.v}` : undefined} labelO={lit ? prog(f, T.names[n] - 2, T.names[n] + 8) : 0}
                  name={p.name} nameColor={lit ? C.text : C.muted} />
              </div>
            );
          })}

          {/* Ruler + Gumayusi stacked, beside Faker */}
          {stackA > 0 && (
            <div style={{ opacity: 1 - 0.7 * dimEnd }}>
              <div style={{ position: "absolute", left: X_STACK - BAR_F / 2, top: -stackA * K, width: BAR_F, height: stackA * K, background: "#AEB7C2", borderRadius: 4 }} />
              <div style={{ position: "absolute", left: X_STACK - BAR_F / 2 + 10, top: -stackA * K / 2 - 50, opacity: prog(f, T.stackA + 10, T.stackA + 20) }}>
                <Photo id="ruler" size={BAR_F - 20} />
              </div>
              <div style={{ position: "absolute", left: X_STACK - BAR_F / 2, top: -(RULER + stackB) * K, width: BAR_F, height: stackB * K, background: "#7E8894",
                borderRadius: 4, boxShadow: `inset 0 3px 0 ${C.bg}` }} />
              {stackB > 0 && (
                <div style={{ position: "absolute", left: X_STACK - BAR_F / 2 + 10, top: -(RULER + stackB / 2) * K - 50, opacity: prog(f, T.stackB + 10, T.stackB + 20) }}>
                  <Photo id="gumayusi" size={BAR_F - 20} />
                </div>
              )}
              <div style={{ position: "absolute", left: X_STACK - BAR_F / 2 - 220, width: 200, top: -(RULER + GUMA) * K - 26, textAlign: "right",
                fontFamily: F.body, fontWeight: 700, fontSize: 44, color: C.text, opacity: prog(f, T.stackB + 24, T.stackB + 34) }}>
                {(RULER + GUMA).toLocaleString("en-US")}
              </div>
              <div style={{ position: "absolute", left: X_STACK - 100, width: 200, top: 14, textAlign: "center", fontFamily: F.body, fontWeight: 600,
                fontSize: 26, color: C.text }}>#2 + #3</div>
            </div>
          )}
          {/* the gap that is left */}
          <div style={{ position: "absolute", left: X_STACK - BAR_F / 2, width: X_FAKER - X_STACK + BAR_F, top: -FAKER * K,
            height: (FAKER - RULER - GUMA) * K, borderTop: `3px dashed ${C.gold}`, opacity: gapO }}>
            <div style={{ position: "absolute", left: 0, width: BAR_F, top: (FAKER - RULER - GUMA) * K / 2 - 30, textAlign: "center",
              fontFamily: F.body, fontWeight: 700, fontSize: 48, color: C.gold }}>+{FAKER - RULER - GUMA}</div>
          </div>

          {/* Faker */}
          <Bar x={X_FAKER} v={fGrow} w={BAR_F} color={C.gold} face="faker" faceO={fFace} ring={C.gold}
            label={FAKER.toLocaleString("en-US")} labelO={fLabel} name={f >= T.pan ? "Faker" : undefined} nameColor={C.gold} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 170, background: C.bg }} />
      <div style={{ position: "absolute", left: 96, top: 64, opacity: titleO }}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 46, color: C.text, letterSpacing: -0.5 }}>The trophy cabinet</div>
        <div style={{ fontFamily: F.body, fontSize: 26, color: C.muted, marginTop: 6 }}>Trophy points, whole career</div>
      </div>

      {/* sound: voice, one bed that drops out when Faker lands, one swell under the climb, one soft hit */}
      {vo.map((l, i) => (
        <Sequence key={i} from={starts[i]} layout="none"><Audio src={staticFile(l.src)} /></Sequence>
      ))}
      <Audio src={staticFile("music/2_data_bed.mp3")} volume={(fr) =>
        0.09 * interpolate(fr, [0, 20, T.land - 4, T.land + 2, T.dimAll - 10, T.dimAll + 20, TOWER_FRAMES - 20, TOWER_FRAMES], [0, 1, 1, 0, 0, 1, 1, 0], clamp)} />
      <Sequence from={T.pan + 2} durationInFrames={T.land - T.pan + 4} layout="none">
        <Audio src={staticFile("sfx/soft-swell.wav")} volume={0.18} startFrom={Math.max(0, 150 - (T.land - T.pan))} />
      </Sequence>
      <Sequence from={T.land} layout="none"><Audio src={staticFile("sfx/soft-hit.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
