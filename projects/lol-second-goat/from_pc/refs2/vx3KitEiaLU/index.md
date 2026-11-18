# Using Numbers to Find the 75 Greatest NBA Players of All-Time (vx3KitEiaLU)

https://www.youtube.com/watch?v=vx3KitEiaLU  
Channel: Jxmy Highroller (2021 style). Style: NBA 75 red/blue split background, dark tables with photo thumbnails

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 03:10-03:30 | grid of every player photo |  | grid fills, then 'PLAYER' highlight |  |
| 04:48-05:40 | top-20 tables per category (2 columns) |  | table slides in, next category replaces it |  |
| 10:40-13:20 | 75-player board (5 columns) |  | whole board appears, then gold highlight bars mark individual players being discussed | 5 s silence at 10:16 on '...who rounds out the top 75 NBA players of all time', board revealed after |
| 14:18-14:32 | board with red X over photos |  | players crossed out |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Silence BEFORE a big reveal (board), not only on the number.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 01:48 | 2.0 s |  and team executives but even with all that basketball knowledge and experience there are bound to be entries that leave you baffled writers |
| 04:13 | 4.0 s | finals mvps regular season mvps and championships are weighted slightly heavier than the other categories since you know those things are um |
| 04:42 | 2.0 s | points and the top 75 points earners will be our top 75 list so with that out of the way let's get into this the first category we looked |
| 05:20 | 1.0 s | here's about oh i don't know a hundred percent chance that if the award existed when bill was playing he would have more than six anyways so |
| 10:16 | 5.0 s | players cracked the top 20 and who rounds out the top 75 nba players of all time |
| 10:36 | 2.5 s | [Music] |
| 12:04 | 2.0 s | s reed rounded out the top 20. now i'm not going to go into detail on each and every player but let's talk about some notable rankings kawhi |
| 12:46 | 2.0 s | lakers roster made this list five and dwight howard who would have been the sixth player to make this list just narrowly missed it some more |
| 14:10 | 2.5 s |  doesn't even qualify for half of these categories yet and he still rose this high on this list but i want to make something clear this list |

## Music style switches (bed spectrum change, 8 s before vs after)

- 03:07 (change score 1.57, median 0.6)
- 10:36 (change score 2.23, median 0.6)
- 12:43 (change score 1.44, median 0.6)
- 16:37 (change score 2.62, median 0.6)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| vx3KitEiaLU_biggap_top75_board_reveal_silence_10m05s.mp3 | biggap_top75_board_reveal_silence | 83.4 | 0.212 | 0.125 | 0.399 |
| vx3KitEiaLU_normal_talk_over_graph_05m05s.mp3 | normal_talk_over_graph | 83.4 | 0.136 | 0.162 | 0.395 |
| vx3KitEiaLU_music_switch_1_02m52s.mp3 | music_switch_1 | 73.8 | 0.05 | 0.081 | 0.483 |
| vx3KitEiaLU_music_switch_2_10m21s.mp3 | music_switch_2 | 83.4 | 0.285 | 0.402 | 0.393 |
| vx3KitEiaLU_music_switch_3_12m28s.mp3 | music_switch_3 | 61.5 | 0.113 | 0.292 | 0.364 |
| vx3KitEiaLU_music_switch_4_16m22s.mp3 | music_switch_4 | 60.1 | 0.418 | 0.423 | 0.508 |

## Music notes

- Credit: 'Music by LCS Beats'.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
