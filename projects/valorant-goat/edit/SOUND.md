# Sound design rules and cue grammar

Sources: video-shotcraft `references/sound-design.md` + `music-beat-sync.md` (Apache-2.0, adopted),
HyperFrames `references/sound.md`, our own measurements. The reference-video cue study (Jxmy, MachineLoLing,
top video essays) refines the cue sheet at the bottom; until it lands those cues are marked DRAFT.

## Rules

1. **Sound is a timeline asset.** One SFX table per section (`{ at, src, volume }`), derived from the beat map, never
   hard-coded frame numbers inside scene components. If the picture moves, the sound moves with it.
2. **Music first, then effects.** Lay the bed to set the energy, then pin only the actions unique to the picture.
   If the music already hits on a beat, don't add an impact on top of it.
3. **Every effect has a cause on screen.** Whoosh = something moves fast or a scene changes; pop/tick = a chip,
   number or row lands; riser = build to a payoff; impact = the payoff lands; shimmer = a highlight or glow appears.
   No synth notification tones or meme sounds.
4. **Peaks, not file starts.** Align each sound's loudest point (measured per file, stored in the manifest) to
   one frame after the picture lands. Our render pipeline (Remotion 4.0.544, AAC 48 kHz MP4) measured
   **0 frames output offset** on 17 Nov 2026 (click probe, cross-correlation, `OffsetProbe` composition):
   re-measure if Remotion, codec, sample rate or container changes.
5. **No machine-gun.** Repeated cues alternate two takes and step the volume down (e.g. 0.40 -> 0.25); if they
   come too fast to hear one by one, replace them with one swoosh or swell.
6. **The payoff sentence: riser -> impact -> shimmer**, used once per chapter at most (the #1 reveal) and once
   big for the GOAT. Drop the music out 0.3 to 0.75 s before the impact; silence sells the reveal.
7. **Levels.** Voice is king. Music bed around 0.14 under speech (duck), back up in gaps; each hit 3 to 6 dB over
   the bed; final mix -14 LUFS integrated, true peak at or under -1 dBTP (`edit/review.py` checks).
   Low-only sound (all energy under 150 Hz) disappears on phone speakers.
8. **Music structure.** Change the bed at each chapter; enter at the track's strongest bar, not a quiet intro; end
   on a bar line with a short fade. Deliver a no-music stem as well (for Shorts and re-edits).
9. **Licences on file.** Every audio file has a manifest row (source page, licence, SHA-256). Freesound: CC0 by
   default; CC-BY only with its credit line in the YouTube description. Mixkit: free licence, no credit needed.

## Where sounds come from (automatic, no manual downloads)

| Need | Source | Tool |
| --- | --- | --- |
| Specific SFX (whoosh, card slide, impact, riser, shimmer, ticks) | Freesound, CC0 | `tools/audio/sfx_source.py search "short soft whoosh" --max-duration 1` then `get fs:<id> --out-dir video/public/sfx` |
| Music beds, extra SFX | Mixkit (free licence) | `tools/audio/mixkit_fetch.py list music cinematic`, then `get <url> --out video/public/music` |
| Already in the project | Pixabay SFX pack | `video/public/sfx/` (CREDITS.md) |
| Optional upgrade | YouTube Audio Library (ay's Studio login) | only if ay wants a specific track |

Both fetchers need freesound.org / mixkit.co, which the cloud can't reach, so they run on ay's PC through Remote
Control. Search by the real sound source and length ("dry paper slide 0.3 s"), not by mood words alone.

## Cue sheet by panel (DRAFT until the reference study lands)

| Panel moment | Cue | Notes |
| --- | --- | --- |
| Category card: name lands (P21) | soft whoosh into a light impact | one per chapter, same family each time = a recognisable "chapter sting" |
| Ingredient chips appear | 2 alternating soft ticks | low volume, stepped |
| Field histogram builds (P22) | one rising swell or a quiet granular tick bed | never one tick per chip |
| Top 5 light up | shimmer | |
| Tiles blur and fly to slots | one whoosh | |
| Countdown #5 to #2 | card slide / pop, alternating 2 takes | volume ladder up toward #2 |
| #1 of a category | music dips, riser -> impact -> shimmer | rule 6 |
| Number counts up (hero numbers only) | fast soft ticker under the count, stops on the final value | |
| Leaderboard reshuffle (P07, P08) | one whoosh per big move; rows that rise get a light up-swish | no tones |
| "WRONG" stamp (P04) | dry stamp / thud | |
| Player panel rank slam (P12) | impact | |
| Cut to gameplay | game audio takes over, music ducks further | |
| GOAT reveal (P18) | music stops, ~1 s of near silence, then the biggest impact of the video | once |
