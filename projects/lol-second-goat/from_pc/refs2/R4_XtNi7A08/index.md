# Victor Wembanyama Is WAY Better Than We Thought He Would Be (R4_XtNi7A08)

https://www.youtube.com/watch?v=R4_XtNi7A08  
Channel: Jxmy Highroller (2024 style). Style: dark blue-to-red gradient, glowing stars or dots, circled labels with NAME and value

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 03:34-03:52 | rank card with cut-out |  | stats then 'NO ONE' punch card |  |
| 03:52-04:22 | grouped bars with cut-out on cream |  | bars grow |  |
| 04:22-05:34 | star scatter (minutes vs plus-minus), stars coloured red to yellow to green by value | +6 to -5 y, 15-38 mpg x | camera slowly pans up through the stars, white circles + NAME/value labels on key players, big ellipse around the subject |  |
| 06:00-06:46 | rookie stat cards grid |  | cards grey out, subject stays lit |  |
| 08:34-09:14 | blue dot scatter (minutes vs stocks) |  | full cloud held, hard cut in on the top outliers (Wembanyama 4.23, Noel, Embid) with small photo + name + value, then ~3 s zoom out filling labels down the pack | music silent 08:48-08:53 across the cut |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- This is ay's 'dots + name above the dot + zoom out to the anomaly' reference.
- Transcript missing (429), retry pending.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:12 | 3.5 s | (no transcript) |
| 00:16 | 5.5 s | (no transcript) |
| 01:04 | 3.0 s | (no transcript) |
| 02:03 | 7.0 s | (no transcript) |
| 02:57 | 3.0 s | (no transcript) |
| 05:57 | 3.0 s | (no transcript) |
| 06:45 | 2.5 s | (no transcript) |
| 08:48 | 2.0 s | (no transcript) |
| 08:51 | 2.0 s | (no transcript) |
| 10:09 | 2.0 s | (no transcript) |

## Music style switches (bed spectrum change, 8 s before vs after)

- 00:12 (change score 2.78, median 0.65)
- 08:42 (change score 1.99, median 0.65)
- 10:22 (change score 1.52, median 0.65)
- 11:15 (change score 2.05, median 0.65)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| R4_XtNi7A08_biggap_wemby_scatter_zoom_silence_08m37s.mp3 | biggap_wemby_scatter_zoom_silence | 60.1 | 0.075 | 0.168 | 0.408 |
| R4_XtNi7A08_star_scatter_talk_04m20s.mp3 | star_scatter_talk | 71.8 | 0.039 | 0.678 | 0.218 |
| R4_XtNi7A08_normal_talk_over_graph_04m35s.mp3 | normal_talk_over_graph | 86.1 | 0.103 | 0.684 | 0.198 |
| R4_XtNi7A08_music_switch_1_00m00s.mp3 | music_switch_1 | 161.5 | 0.097 | 0.542 | 0.25 |
| R4_XtNi7A08_music_switch_2_08m27s.mp3 | music_switch_2 | 161.5 | 0.069 | 0.157 | 0.461 |
| R4_XtNi7A08_music_switch_3_10m07s.mp3 | music_switch_3 | 60.1 | 0.04 | 0.494 | 0.275 |
| R4_XtNi7A08_music_switch_4_11m00s.mp3 | music_switch_4 | 123.0 | 0.17 | 0.454 | 0.477 |

## Music notes

- No credit.

## Files

- `transcript.txt` timestamps [mm:ss] (missing: YouTube 429 on subtitles)
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
