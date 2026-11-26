// Footage from lol-second-goat/footage/ (copied to public/_local/footage, never pushed: third-party broadcast video).
// ay 20 Nov: no still player photos in the video, every player moment and transition is video.
import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const CLIPS = {
  coldopen: { f: "01_coldopen_nexus_caster_call.mp4", len: 70 },
  crowd: { f: "02_victory_crowd_knight_walk.mp4", len: 24 },
  lift: { f: "03_blg_trophy_lift.mp4", len: 100 },
  walkoff: { f: "04_blg_walkoff_with_trophy.mp4", len: 55 },
  stage: { f: "05_broll_stage_trophy_pregame4.mp4", len: 26 },
  stomp: { f: "06_stomp_qf_g1_blg_vs_dk_end.mp4", len: 32 },
  close: { f: "07_close_win_final_g2_blg_vs_geng_end.mp4", len: 38 },
  knightWalk: { f: "08_broll_knight_viper_walk_worlds_sign.mp4", len: 10 },
  knightFans: { f: "09_broll_knight_with_fans.mp4", len: 7 },
  onStage: { f: "10_broll_blg_on_stage_crowd.mp4", len: 13 },
  desk: { f: "11_broll_blg_desk_laughing.mp4", len: 10 },
  gengWalk: { f: "12_broll_geng_barclays_walk.mp4", len: 18 },
  cupNight: { f: "13_broll_trophy_closeup_night.mp4", len: 7 },
  nameplate: { f: "14_broll_trophy_nameplate.mp4", len: 5 },
  chovyBack: { f: "15_broll_chovy_back_skylight.mp4", len: 4 },
  skyline: { f: "16_broll_nyc_skyline.mp4", len: 14 },
  semis: { f: "17_semis_blg_beat_t1_caster_call.mp4", len: 44 },
  skt2013: { f: "18_skt_win_worlds2013.mp4", len: 106 },
  sktCup2013: { f: "19_skt_trophy_worlds2013.mp4", len: 48 },
  msiLift: { f: "20_msi2026_hle_trophy_lift.mp4", len: 38 },
  fakerWalkout: { f: "21_faker_t1_walkout_worlds2026.mp4", len: 21 },
  fakerJerseys: { f: "22_faker_walk_hall_jerseys.mp4", len: 5.4 },
  fakerCar: { f: "23_faker_car_night.mp4", len: 2 },
  faker2013Desk: { f: "24_faker_2013_lck_desk.mp4", len: 4.5 },
  skt2013Hug: { f: "26a_skt_worlds2013_win_hug.mp4", len: 2 },
  skt2013Party: { f: "26b_skt_worlds2013_celebrate.mp4", len: 2.6 },
  skt2013Faker: { f: "26b_skt_worlds2013_celebrate_faker_closeup.mp4", len: 5 },
  skt2013Cup: { f: "26c_skt_worlds2013_trophy.mp4", len: 5 },
  chovyArena: { f: "27_chovy_alone_in_arena.mp4", len: 6 },
  chovyScreens: { f: "28_chovy_back_gen_screens.mp4", len: 6 },
  blgPair: { f: "29_blg_pair_knockout_trailer.mp4", len: 8 },
  walkoutFans: { f: "31_broll_blg_hle_walkout_fans.mp4", len: 48 },
  guma: { f: "32_gumayusi_fan_sign_then_desk.mp4", len: 13 },
  // ay 24 Nov 16:21: section-opener B-roll, official LPL / LCK / LoL Esports VODs (goat-section-study/clips/CLIPS.md)
  lplFight1: { f: "40_lpl26_al_vs_lgd_tarzan_fight.mp4", len: 6 },
  lplFight2: { f: "41_lpl26_ig_vs_lgd_river_fight.mp4", len: 6 },
  lplFight3: { f: "42_lpl26_al_vs_we_final_fight.mp4", len: 6 },
  msi25Lift: { f: "43_geng_msi2025_trophy_lift.mp4", len: 6 },
  worlds23Lift: { f: "44_t1_worlds2023_trophy_lift.mp4", len: 7 },
  g5Worlds24: { f: "45_worlds2024_final_g5_t1_vs_blg.mp4", len: 7 },
  g5Worlds25: { f: "46_worlds2025_final_g5_t1_vs_kt.mp4", len: 7 },
  g5Lck24: { f: "47_lck2024s_final_g5_hle_vs_geng.mp4", len: 7 },
  chovyMvpFilm: { f: "48_chovy_closeup_mvp_film.mp4", len: 2.8 }, // burned subtitle from 3.0 s: never past 2.8 s
  gengMsi24Win: { f: "49_geng_msi2024_final_win_chovy.mp4", len: 7 },
  // v19f line 41 (ay 24 Nov 20:09: Chovy dodging and farming, Bin running people over on Jax): footage/clips-2009/CLIPS.md
  chovySolo: { f: "chovy1_solokill-faker-lck.mp4", len: 17 }, // 0-5 s is a WORLDS title card: start at 6+
  chovyDodge: { f: "chovy2_lane-spacing-zoomed.mp4", len: 16 },
  binJax: { f: "bin1_jax-vs-renekton-worlds2020-fight.mp4", len: 16 }, // last 2 s are the scoreboard
  binLane: { f: "bin2_jax-vs-renekton-worlds2020-lane-stats.mp4", len: 19 },
} as const;
export type ClipId = keyof typeof CLIPS;

/** a clip from `from` seconds; loops if the scene outlasts what is left of it. dim: a flat darken for text on top. */
export const Clip: React.FC<{ id: ClipId; from?: number; rate?: number; dim?: number; volume?: number }> = ({ id, from = 0, rate = 1, dim = 0.15, volume = 0 }) => {
  const { fps } = useVideoConfig();
  const c = CLIPS[id];
  const avail = Math.max(1, Math.floor(((c.len - from - 0.1) / rate) * fps));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Loop durationInFrames={avail} layout="none">
        <OffthreadVideo src={staticFile(`_local/footage/${c.f}`)} startFrom={Math.round(from * fps)} playbackRate={rate} volume={volume} muted={volume === 0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Loop>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(10,12,16,${dim})` }} />}
    </AbsoluteFill>
  );
};

/** Jxmy circular writing around a video (jxmy-graphics E-F0qcmdWRA x19): the clip in a round window, text circling it */
export const RingClip: React.FC<{ id: ClipId; from?: number; text: string; bg?: ClipId; bgFrom?: number }> = ({ id, from = 0, text, bg, bgFrom = 0 }) => {
  const f = useCurrentFrame();
  const R = 300, cx = 960, cy = 540, rt = R + 70;
  const phrase = Array.from({ length: 6 }, () => text).join("   ·   ");
  return (
    <AbsoluteFill style={{ background: "#14161B" }}>
      {/* Jxmy x19: the footage fills the frame and the words circle over it; the round window keeps the subject bright */}
      <AbsoluteFill style={{ opacity: 0.55 }}><Clip id={bg ?? id} from={bg ? bgFrom : from} dim={0.45} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden" }}>
        <Clip id={id} from={from} dim={0} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `rotate(${f * 0.25}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
        <defs><path id="ringPath" d={`M ${cx - rt},${cy} a ${rt},${rt} 0 1,1 ${2 * rt},0 a ${rt},${rt} 0 1,1 ${-2 * rt},0`} /></defs>
        <text fontFamily="Bebas Neue" fontSize={58} letterSpacing={4} fill="#F2F2EE"><textPath href="#ringPath">{phrase}</textPath></text>
      </svg>
    </AbsoluteFill>
  );
};

/** hard cuts through several clips: [clip, from (s), seconds on screen] */
export const Cuts: React.FC<{ shots: [ClipId, number, number][]; rate?: number; dim?: number }> = ({ shots, rate = 1, dim = 0.12 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let t = 0;
  const idx = shots.findIndex(([, , d]) => { t += d * fps; return f < t; });
  const i = idx < 0 ? shots.length - 1 : idx;
  const start = shots.slice(0, i).reduce((a, [, , d]) => a + d * fps, 0);
  const [id, from] = shots[i];
  return <Sequence from={Math.round(start)} layout="none"><Clip id={id} from={from} rate={rate} dim={dim} /></Sequence>;
};

/** two clips side by side with a year over each (Faker 2013 | Faker 2026) */
export const SplitClips: React.FC<{ left: [ClipId, number, number][]; right: [ClipId, number, number][]; labels: [string, string] }> = ({ left, right, labels }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {[left, right].map((shots, k) => (
      <div key={k} style={{ position: "absolute", left: k * 966, top: 0, width: 954, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -483, top: 0, width: 1920, height: 1080 }}><Cuts shots={shots} dim={0.1} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: "Bebas Neue", fontSize: 120, letterSpacing: 6, color: "#F2F2EE",
          WebkitTextStroke: "2px rgba(10,12,16,0.5)", paintOrder: "stroke fill" }}>{labels[k]}</div>
      </div>
    ))}
  </AbsoluteFill>
);
