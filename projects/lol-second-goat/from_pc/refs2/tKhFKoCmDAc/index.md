# There May Never Be Another GOAT (tKhFKoCmDAc)

https://www.youtube.com/watch?v=tKhFKoCmDAc  
Channel: Jxmy Highroller (2024-25 style). Style: mostly documentary footage + TV clips; graphics are ring/trophy image grids on black

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 02:06-02:44 | image grid comparison (championship rings) | none | rings fill in as a grid, then split '60s < 90s' with a less-than sign between two groups |  |
| 06:14-06:30 | trophy rows by year | years (1978, 2005) | row of trophies with the year under it, swaps per era |  |
| 07:00-08:48 | column chart of titles per season over a faded team photo | years on x | columns build left to right as the decades are narrated; red marks for repeat champions |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Few charts; the hook is footage and TV debate clips. Many 'drops' here are just TV-clip audio with no music under it.
- Transcript missing (YouTube 429 on subtitles), retry pending.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:37 | 11.5 s | (no transcript) |
| 00:58 | 3.0 s | (no transcript) |
| 01:10 | 3.5 s | (no transcript) |
| 02:38 | 4.0 s | (no transcript) |
| 03:21 | 3.0 s | (no transcript) |
| 04:00 | 2.0 s | (no transcript) |
| 04:15 | 2.0 s | (no transcript) |
| 04:51 | 4.0 s | (no transcript) |
| 06:32 | 10.0 s | (no transcript) |
| 09:08 | 3.5 s | (no transcript) |
| 09:16 | 3.0 s | (no transcript) |
| 09:24 | 4.5 s | (no transcript) |
| 09:30 | 3.0 s | (no transcript) |
| 09:56 | 3.5 s | (no transcript) |
| 11:24 | 4.0 s | (no transcript) |
| 11:33 | 2.0 s | (no transcript) |
| 11:35 | 2.5 s | (no transcript) |
| 12:54 | 4.0 s | (no transcript) |
| 13:00 | 2.0 s | (no transcript) |
| 13:11 | 2.5 s | (no transcript) |
| 13:14 | 3.5 s | (no transcript) |
| 13:20 | 3.0 s | (no transcript) |
| 13:53 | 1.0 s | (no transcript) |
| 15:43 | 4.5 s | (no transcript) |
| 15:48 | 3.5 s | (no transcript) |
| 15:53 | 2.0 s | (no transcript) |
| 16:00 | 2.0 s | (no transcript) |
| 17:48 | 2.0 s | (no transcript) |
| 18:38 | 2.5 s | (no transcript) |
| 19:35 | 1.5 s | (no transcript) |

## Music style switches (bed spectrum change, 8 s before vs after)

- 12:55 (change score 3.14, median 0.72)
- 14:04 (change score 2.5, median 0.72)
- 16:19 (change score 2.39, median 0.72)
- 19:23 (change score 3.01, median 0.72)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| tKhFKoCmDAc_rings_grid_compare_02m11s.mp3 | rings_grid_compare | 61.5 | 0.043 | 0.154 | 0.348 |
| tKhFKoCmDAc_normal_talk_over_graph_07m35s.mp3 | normal_talk_over_graph | 66.3 | 0.072 | 0.672 | 0.147 |
| tKhFKoCmDAc_music_switch_1_12m40s.mp3 | music_switch_1 | 61.5 | 0.053 | 0.547 | 0.108 |
| tKhFKoCmDAc_music_switch_2_13m49s.mp3 | music_switch_2 | 152.0 | 0.103 | 0.55 | 0.262 |
| tKhFKoCmDAc_music_switch_3_16m04s.mp3 | music_switch_3 | 152.0 | 0.131 | 0.647 | 0.115 |
| tKhFKoCmDAc_music_switch_4_19m08s.mp3 | music_switch_4 | 172.3 | 0.233 | 0.6 | 0.364 |

## Music notes

- No credit in description (sponsor only).

## Files

- `transcript.txt` timestamps [mm:ss] (missing: YouTube 429 on subtitles)
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
