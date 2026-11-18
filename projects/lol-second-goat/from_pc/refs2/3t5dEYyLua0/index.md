# The math behind champion blindability (3t5dEYyLua0)

https://www.youtube.com/watch?v=3t5dEYyLua0  
Channel: MachineLoLing. Style: same as his other video

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 01:30-02:20 | Ahri vs icons, then bell curve from icons | WR % above expected | row of opponent icons with %, they drop into a histogram, curve drawn |  |
| 03:50-04:30 | odds maths with small bars |  | equations type in line by line next to a 2-bar comparison |  |
| 10:00-10:30 | stacked area + icon scatter |  | areas fill, then scatter |  |
| 10:36-11:40 | matchup web (lines between role icons) then ridgeline curves per role |  | lines draw out from one icon, then 5 stacked curves |  |
| 13:00-14:20 | icon bell on red/green zones |  | icons stack |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Quiet constant bed again; cuts only at the intro (00:23, 00:43).

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:23 | 2.0 s | have a PhD and over 10 years of experience in bioinformatics, and today I'm going to show you the math behind blindability. |
| 00:43 | 10.0 s | [music] |

## Music style switches (bed spectrum change, 8 s before vs after)

- 05:32 (change score 2.37, median 0.65)
- 07:41 (change score 2.8, median 0.65)
- 10:51 (change score 2.38, median 0.65)
- 17:31 (change score 3.29, median 0.65)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| 3t5dEYyLua0_icon_bell_zones_13m15s.mp3 | icon_bell_zones | 63.0 | 0.051 | 0.299 | 0.463 |
| 3t5dEYyLua0_normal_talk_over_graph_02m05s.mp3 | normal_talk_over_graph | 68.0 | 0.048 | 0.429 | 0.495 |
| 3t5dEYyLua0_music_switch_1_05m17s.mp3 | music_switch_1 | 86.1 | 0.097 | 0.326 | 0.496 |
| 3t5dEYyLua0_music_switch_2_07m26s.mp3 | music_switch_2 | 107.7 | 0.113 | 0.253 | 0.523 |
| 3t5dEYyLua0_music_switch_3_10m36s.mp3 | music_switch_3 | 99.4 | 0.082 | 0.349 | 0.529 |
| 3t5dEYyLua0_music_switch_4_17m16s.mp3 | music_switch_4 | 103.4 | 0.121 | 0.358 | 0.462 |

## Music notes

- No credit in description.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
