# How Jxmy Highroller and MachineLoLing use sound effects (measured 18 Nov 2026)

Videos: VCIKek1f-Hs (8 Charts, 2020), QF17UQYg65o (He Should Win This Award, 2026), R4_XtNi7A08 (Wembanyama, 2024), IbcOgi76Mlk (83 Points, 2026), j7tOMY-HAsk (MachineLoLing, draft maths, 2026). Whole videos, audio only. Audio deleted after.

## Method

1. Demucs htdemucs (two stems) splits voice from everything else (music + effects + footage sound).
2. On the no-voice stem: onsets in the strongest 10% of their 16 s neighbourhood, at least 4 dB over the bed in the 0.5 s before.
3. Removed as part of the music: any onset whose spectral shape (32-band mel, cosine > 0.97) and level (within 3 dB) repeats at 2 or more other onsets within 4 s, i.e. drums and loops.
4. Removed as inaudible: anything more than 24 dB under the voice (voice level = 90th percentile of the voice stem within 5 s).
5. Labels from the spectrum: hit / low thump (over 35% of new energy under 150 Hz, gone within 0.3 s, under 0.7 s long), pop / click (under 0.12 s, over 50% above 2 kHz), whoosh (0.15 to 1 s, noisy, centroid sweep over 500 Hz), riser (level climbs over 6 dB in the 2.5 s before, r > 0.7), noise burst, other.
6. Screen: the 2 s frame tile nearest each event (`sheets_2s`). Said: transcript 3 s before to 1 s after. Moment: inside a graph window from the graph study, within 1.5 s of a music drop, or within 3 s of a bed change.

Limits: the classifier is rule-based and only a guide. "Other" is mostly footage sound (crowd, sneakers, broadcast). The listening check is the 3 s clips in each folder's `sfx_clips/`. R4 has no transcript (YouTube 429).

## Per video

| Video | Effects/min | Hits | Pops/clicks | Risers | Other | Median level vs voice | Where they land |
|---|---|---|---|---|---|---|---|
| Jxmy 8 Charts (2020) | 1.8 | 5 | 10 | 0 | 10 | -11 dB | 20 of 25 inside graphs |
| Jxmy Award (2026) | 1.3 | 4 | 3 | 0 | 16 | -16 dB | year-title slams, winner cards |
| Jxmy Wembanyama (2024) | 1.3 | 3 | 0 | 0 | 12 | -16 dB | mostly the DraftKings ad read; 1 on the ranked list |
| Jxmy 83 Points (2026) | 0.9 | 0 | 3 | 2 | 8 | -14 dB | number slam in the cold open, race-line tags, footage |
| MachineLoLing draft (2026) | 0.2 | 3 | 0 | 0 | 1 | effectively none | none tied to graphics |

## The moments that get a sound

| Video, time | What is on screen | Said | Sound | Level vs voice |
|---|---|---|---|---|
| VCIK 08:38 to 08:54 | dots popping onto the playoff-games chart one by one | "different chart, I know, I know" | soft pop per dot | -10 to -13 dB |
| VCIK 10:09.3 and 10:11.2 | camera climbing the empty axis 320 to 380 | "Warriors have put up 399 wins" | short low thump x2 as the climb arrives, then the music cuts | -2 dB |
| VCIK 09:17.5 | playoff chart, zoom on the top dot | "unfortunately the majority of the time" | low thump | -2 dB |
| VCIK 02:16.5 | salary axis climbing ($22 to $28 mil) | "by far the largest chunk of money" | low thump | -14 dB |
| QF 04:02 to 04:07 | big white year title "2024 NIKOLA JOKIC" slams in over footage | "in an effort to bring some artificial glory back" | pop + thump on the title | -16 to -20 dB |
| QF 04:48.0 | winner's card lights gold, others greyed ("American MVP") | "Cade Cunningham. This season, Cade has been" | heavy hit, LOUDER than the voice | +8 to +10 dB |
| QF 06:49.1 | same, Jamal Murray's card lights gold | "This season Murray put up 25, 7 and 4" | heavy hit | +8 dB |
| QF 12:44.8 | nominee cards for the next award | list of nominees | 1.2 s swell into the drop | -19 dB |
| Ibc 00:11 | "71 DAMIAN LILLARD" number slam in the cold open | "Kobe Bryant's famous 81" | hit on the number | -19 dB |
| Ibc 09:36.7, 10:08.7 | race lines, photo tag pops at a line's end | "that and-one bucket in the fourth" | tiny pop | -18 dB |
| R4 08:29.8 | ranked list (Wembanyama 4.23 in orange) | (no transcript) | low thump on the list | -18 dB |
| MachineLoLing | icon scatters, bell curves, heat maps | | nothing; graphics move in silence over a soft constant bed | |

Each row's 3 s clip is in that video's `sfx_clips/`, and `<id>_sfx_top10_board.jpg` shows the screen for each of the 10 clearest events.

## Rules to copy for the League video

1. **Few effects.** Jxmy uses about 1 to 2 audible effects a minute; MachineLoLing almost none. The music cuts do more work than effects do.
2. **Graph builds get soft pops**, one per dot or label as it appears, about 10 to 13 dB under the voice. Never on every element of a dense chart; Jxmy pops 5 to 7 dots, then lets the rest fade in.
3. **The reveal gets one low thump, near voice level** (about -2 dB), on the frame the camera lands on the outlier, then the music cuts to silence. For Faker: soft climb, thump as Faker's dot lands, silence, hold, zoom out.
4. **A winner or verdict card gets the one loud hit** of the section, louder than the voice (+8 dB), when that card lights up and the rest go grey. Use it once per verdict, not per stat.
5. **Big number or title slams** (year, player name, a record number) get a pop plus a thump about 16 to 20 dB under the voice.
6. **No whooshes measured on transitions** in these videos; cuts are dry. Risers are rare and short.
7. **Silence is the effect**: the strongest moments (399 wins, the award reveals, the top-75 board) are music cuts, not added sounds.

## Files

Per video in `refs2/<id>/`: `sfx_events.csv` (every event with time, type, length, excess over bed, level vs voice, moment, what is said, spectral features), `sfx_summary.json`, `sfx_clips/` (10 clips, 3 s, 64 kbps mono), `<id>_sfx_top10_board.jpg`. Script: `tools/sfx_events2.py`.
