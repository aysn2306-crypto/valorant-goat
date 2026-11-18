# WE DONE WITH THE 90'S!!! (dPZ_HlpI8x8)

https://www.youtube.com/watch?v=dPZ_HlpI8x8  
Channel: Jxmy Highroller (2024 style). Style: mixed: black timeline with round photos, cream court charts, blue ISO scatter

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 07:04-07:28 | twin line charts on black |  | lines draw |  |
| 11:10-13:08 | photo timeline (round photos branching from year ticks) | 1972-2024 | photos branch in per era, then gold arcing arrows connect eras |  |
| 16:28-16:40 | leaderboard with 'FUTURE PLAYER' placeholders |  | scroll |  |
| 19:40-20:50 | shot chart on a court |  | dots by hand colour |  |
| 22:06-22:46 | ISO scatter on royal blue with photo dots | points per ISO 0.70-1.35 vs ISO per game | photo dots drop in, one huge-photo outlier at the top with a waving hand icon | music cuts at 22:43 '...cannot believe we had to dig into the data to come to this' |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Big music style changes at chapter starts (16:00, 18:53): strongest switch scores of all videos.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 01:18 | 5.0 s | and some of y'all ain't going to like [Music] |
| 01:26 | 3.5 s | it today's video is sponsored by SeatGeek the NBA season is in full swing the MLB season is just around the corner |
| 01:44 | 2.0 s | it's the best one yet for the rest of the season everyone who uses code Jimmy 10 will get 10% off any tickets on |
| 02:01 | 2.0 s | Geek just get into the app find the best tickets for you by using their color-coded seating map punch in the promo code and you're done take |
| 02:11 | 5.0 s | around download the SeatGeek app and use code Jimmy 10 for 10% off any |
| 02:52 | 3.5 s | long-winded take on this whole [Music] |
| 03:43 | 2.0 s | f the footage was buried or lost and it's finally being Unearthed for the world to see it's been right here on YouTube for the past 15 years |
| 04:57 | 3.0 s | course if Michael Jordan really had no left hand spoiler he |
| 07:36 | 3.5 s | factored in to really understand why these players were not as skilled as the players of [Music] |
| 09:03 | 2.0 s | here's some more clips of players is getting called for travels and Carries doing moves that are very typical and allowed in 2024 90% of the |
| 09:10 | 2.0 s | typical and allowed in 2024 90% of the moves you see today the very method most players generate their offense would be |
| 09:15 | 1.5 s | players generate their offense would be called for some sort of violation 40 or 30 or even 20 years ago and this isn't |
| 09:34 | 5.0 s | rs grew up and shaped their game around these looser rules and now they have free reign to let their basketball bag run wild but that's kind |
| 10:40 | 4.0 s | say the game was trash back then or that the superstars of these eras couldn't compete in today's [Music] |
| 13:30 | 4.0 s | logic does not apply to the vast majority of the league throughout the 80s and '90s |
| 15:48 | 3.5 s | objectively that this era was not trash and most players of this generation would do just fine in today's league but |
| 16:00 | 3.5 s | are holding a ticking time bomb and they might not even know it |
| 17:46 | 6.5 s | why I think it is so important to have genuine thought out discourse about the game if you're truly a fan of it but to all of the older fans |
| 17:55 | 3.5 s | started this whole thing for years we heard y'all badmouth modern players saying the league is soft players today couldn't compete back then |
| 18:51 | 3.5 s | to make that distinction in 20 years when some snot-nose brat tells me my glorious King was trash I'm not so |
| 22:43 | 4.0 s | cannot believe we had to dig into the data to come to this |

## Music style switches (bed spectrum change, 8 s before vs after)

- 16:00 (change score 5.33, median 0.61)
- 18:53 (change score 8.0, median 0.61)
- 22:53 (change score 4.99, median 0.61)
- 25:06 (change score 4.99, median 0.61)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| dPZ_HlpI8x8_iso_scatter_mj_outlier_22m03s.mp3 | iso_scatter_mj_outlier | 66.3 | 0.068 | 0.352 | 0.299 |
| dPZ_HlpI8x8_timeline_arcs_11m45s.mp3 | timeline_arcs | 123.0 | 0.061 | 0.328 | 0.277 |
| dPZ_HlpI8x8_normal_talk_over_graph_19m45s.mp3 | normal_talk_over_graph | 123.0 | 0.059 | 0.326 | 0.347 |
| dPZ_HlpI8x8_music_switch_1_15m45s.mp3 | music_switch_1 | 71.8 | 0.303 | 0.965 | 0.302 |
| dPZ_HlpI8x8_music_switch_2_18m38s.mp3 | music_switch_2 | 112.3 | 0.271 | 0.324 | 0.448 |
| dPZ_HlpI8x8_music_switch_3_22m38s.mp3 | music_switch_3 | 95.7 | 0.222 | 0.297 | 0.513 |
| dPZ_HlpI8x8_music_switch_4_24m51s.mp3 | music_switch_4 | 172.3 | 0.324 | 0.651 | 0.367 |

## Music notes

- No credit (SeatGeek sponsor).

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
