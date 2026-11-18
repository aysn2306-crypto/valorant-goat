# He Should Win This Award (QF17UQYg65o)

https://www.youtube.com/watch?v=QF17UQYg65o  
Channel: Jxmy Highroller (2026 style). Style: awards show: black and gold, gold serif award titles over footage, gold stat cards with player cut-outs

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 01:00-01:46 | photo wall by year (every past winner) | years across the top | columns of player cards slide in year by year, camera pans right |  |
| 04:22-04:52 | nominee stat cards (4 cards, cut-out + 4 stats) |  | cards pop in one by one, the losers grey out |  |
| 09:22-09:34 | ranked list with photos and +/- numbers |  | list scrolls, highlighted row in gold |  |
| 10:46-12:28 | paper-texture tables with green horizontal bars | 0-100 percentile | bars grow in, then several tables side by side |  |
| 13:36-13:52 | horizontal bars for every player in the league (grey), one gold | 15-35 minutes | camera falls down the long list, one gold bar with a curved arrow out to a photo callout 'Jalen Green 25.9 MPG 17th in the NBA'; a second chart slides in beside it |  |
| 13:52-14:34 | photo-dot scatter on dark red gradient | shots per minute vs minutes | slow upward drift through small round photo dots, each with a tiny value |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Music cuts right before every winner name: 'And for that, [name] is our 2026 ...'.
- Grey everything, colour only the subject: the one gold bar in a wall of grey bars is the cleanest 'here's Faker' device.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 01:59 | 3.0 s | find the rightful winners of the 2026 NBA season. |
| 02:03 | 3.0 s | Today's video is sponsored by DraftKings. The playoffs are here and |
| 02:08 | 2.5 s | s. The playoffs are here and right now you can get in on the action with DraftKings newest easy-to-play fantasy pick'em DraftKings pick six. |
| 02:59 | 3.0 s | Jimmy Highroller to claim your offer. That's promo code Jimmy Highroller only on DraftKings pick six. |
| 03:12 | 4.0 s | BLACK ON THE DRIVE. TAKE THAT WITH YOU. |
| 03:16 | 2.0 s | TAKE THAT WITH YOU. &gt;&gt; WHEN I FIRST SAW this play, I wasn't quite sure what I had just witnessed. In |
| 03:54 | 2.0 s | ire Grizzlies roster. But, we've got got lot of other awards to hand out here today. So, let's bring them out and see our nominees. Now, the |
| 06:03 | 2.5 s | work is too strong to ignore. And for that, Cade Cunningham is our 2026 American MVP. Now, our next award is the |
| 07:36 | 2.5 s | productive second option in the NBA. And for this, Jamal Murray is our 2026 sidekick of the year. The next award |
| 09:11 | 2.0 s | , and you'll see a player that leaves his imprint on the game every time he touches the court. [music] One of the only players in the league |
| 09:19 | 2.0 s | he only players in the league who can score zero points and be an absolute positive for his team on his limited 18 minutes a night. In fact, |
| 09:35 | 2.0 s | player this season, despite him being the tenth man in their rotation. He's an All-NBA caliber defender, a veteran |
| 09:46 | 2.0 s | shoe mid-play and still find [music] a way to get the stop. And for that, Alex Caruso is our 2026 10th Man of the Year. |
| 12:33 | 4.0 s | n Brunson is a one-way [music] demon, and for that, he shall be rewarded as the one-way Player of the Year. The next award we're handing out |
| 12:39 | 2.0 s | ward we're handing out today is the Kobe Bryant Get It Out the Net [music] Award for the player who is least likely to pass the ball once he |
| 12:43 | 2.0 s | rd for the player who is least likely to pass the ball once he gets it in his hands. And our nominees are Jalen Green, Kawhi Leonard, Dillon |
| 15:11 | 2.5 s | no denying his status this year as the rightful winner of the 2026 Kobe Bryant get it out the net award. And for our |

## Music style switches (bed spectrum change, 8 s before vs after)

- 02:00 (change score 2.06, median 0.58)
- 03:12 (change score 2.35, median 0.58)
- 12:21 (change score 2.02, median 0.58)
- 17:14 (change score 2.42, median 0.58)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| QF17UQYg65o_biggap_award_reveal_cade_mvp_music_cut_05m50s.mp3 | biggap_award_reveal_cade_mvp_music_cut | 78.3 | 0.05 | 0.218 | 0.379 |
| QF17UQYg65o_photo_scatter_drift_13m41s.mp3 | photo_scatter_drift | 80.7 | 0.071 | 0.397 | 0.267 |
| QF17UQYg65o_normal_talk_over_graph_11m25s.mp3 | normal_talk_over_graph | 89.1 | 0.07 | 0.084 | 0.427 |
| QF17UQYg65o_music_switch_1_01m45s.mp3 | music_switch_1 | 107.7 | 0.155 | 0.139 | 0.461 |
| QF17UQYg65o_music_switch_2_02m57s.mp3 | music_switch_2 | 161.5 | 0.215 | 0.388 | 0.089 |
| QF17UQYg65o_music_switch_3_12m06s.mp3 | music_switch_3 | 143.6 | 0.071 | 0.094 | 0.397 |
| QF17UQYg65o_music_switch_4_16m59s.mp3 | music_switch_4 | 66.3 | 0.193 | 0.321 | 0.674 |

## Music notes

- No credit (DraftKings sponsor only).

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
