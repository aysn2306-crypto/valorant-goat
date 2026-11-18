# The math behind who should pick first in draft (j7tOMY-HAsk)

https://www.youtube.com/watch?v=j7tOMY-HAsk  
Channel: MachineLoLing. Style: very dark navy, thin teal/red accents, champion icons as data points, small clean sans labels, red-to-green zone shading

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 01:34-02:30 | champion-icon scatter with trendline | true spread vs chance of a counter | icons placed, list of points appears top-left, faded background |  |
| 02:40-03:56 | bell curve built from icons over red/green halves | WR % above expected | icons stack into a histogram, curve drawn over, then icons fade leaving the curve |  |
| 04:20-04:50 | convergence lines (coin flip) | games (log) | one line wobbles then many lines fan in |  |
| 10:40-11:30 | icon scatter around a centre line | chance of a counter % | icons spread, role icons on left |  |
| 12:04-12:50 | role beeswarm + heat-map grid |  | beeswarm per role with % label, box highlight, then 5x5 coloured matchup grid |  |
| 17:40-18:30 | favourable vs unfavourable zone scatter | WR gained vs chance of counter | red-left/green-right zones, icons placed, highlights |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Music bed stays quiet and constant (bed ~7 dB below Jxmy's) with almost no cuts: the calm 'lecture' feel. Only cut: title card 00:51.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:51 | 2.5 s | Who should pick first? [music] |

## Music style switches (bed spectrum change, 8 s before vs after)

- 17:40 (change score 2.52, median 0.72)
- 21:00 (change score 3.23, median 0.72)
- 21:54 (change score 2.73, median 0.72)
- 22:39 (change score 2.48, median 0.72)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| j7tOMY-HAsk_favourable_zone_scatter_17m25s.mp3 | favourable_zone_scatter | 129.2 | 0.046 | 0.362 | 0.621 |
| j7tOMY-HAsk_normal_talk_over_graph_02m45s.mp3 | normal_talk_over_graph | 107.7 | 0.039 | 0.316 | 0.655 |
| j7tOMY-HAsk_music_switch_1_17m25s.mp3 | music_switch_1 | 129.2 | 0.046 | 0.362 | 0.621 |
| j7tOMY-HAsk_music_switch_2_20m45s.mp3 | music_switch_2 | 123.0 | 0.131 | 0.349 | 0.568 |
| j7tOMY-HAsk_music_switch_3_21m39s.mp3 | music_switch_3 | 107.7 | 0.07 | 0.316 | 0.627 |
| j7tOMY-HAsk_music_switch_4_22m24s.mp3 | music_switch_4 | 64.6 | 0.147 | 0.216 | 0.649 |

## Music notes

- No credit in description.
- Measured: soft, warm, bass-heavy bed (bass share ~0.6), weak beat: ambient/lo-fi type.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
