# The Harsh Truth About the GOAT Debate (IVdJ6Z9jluc)

https://www.youtube.com/watch?v=IVdJ6Z9jluc  
Channel: Jxmy Highroller (2023 style). Style: chapters on black with serif titles; head-to-head with two cut-out players and stats between them on a gold/dark split

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 02:28-02:58 | pie chart between two cut-outs | % | slices fill, small icons pop on the slice |  |
| 03:36-04:40 | head-to-head basic stats |  | chapter card, then stat rows tick in between the players |  |
| 05:00-06:00 | head-to-head advanced stats |  | labels first, values tick in, green dot marks the winner of each row |  |
| 07:16-07:50 | head-to-head accolades |  | counts tick up |  |
| 10:00-11:06 | career line chart on pale green | age vs value | one yellow line draws, then a second, then a pile of lines overlay |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Chapter cards: black, serif 'CHAPTER 2' + subtitle, ~5 s, music changes style at chapters.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:06 | 6.0 s | to get the fresh 14 for the Lakers LeBron look out oh my lord it's never going to end |
| 00:58 | 6.0 s | and if he isn't what would he need to do to truly once and for all be the goat |
| 01:05 | 1.0 s | [Music] |
| 01:06 | 2.5 s | [Music] |
| 02:16 | 1.5 s |  redundant and ESPN already gives you a daily update on the goat debate anyways so no need for me to do it but I think it's time we actually |
| 02:19 | 2.0 s | u a daily update on the goat debate anyways so no need for me to do it but I think it's time we actually discuss this because what LeBron is |
| 02:24 | 2.0 s | discuss this because what LeBron is doing at this point in his career is just absurd at the moment there are |
| 02:36 | 2.0 s | ebate people who think Michael Jordan is the goat people who think LeBron is the goat and people who are wrong I'm just joking of course but |
| 02:55 | 3.5 s | these other fans believe the goats is Wilt or Kobe or Kareem there's not many of them but boy will they die on that |
| 03:16 | 2.0 s | can use to distinguish the greatest player of all time no opinions no bias just the facts if LeBron somehow won |
| 03:32 | 2.5 s | become the greatest ever but where does that threshold whyly and what would LeBron have to achieve to get |
| 03:36 | 3.0 s | that threshold whyly and what would LeBron have to achieve to get |
| 04:09 | 2.0 s | rebounder or Defender or shooter than Jordan they just prove that LeBron's been good at these things for a very very long time these numbers |
| 04:42 | 4.0 s | ir finals records and you pretty much have a condensed version of most goat debates but there is so much more to unpack here so let's unpack |
| 04:48 | 2.5 s | unpack here so let's unpack it so y'all know how much I like |
| 06:19 | 3.0 s | necessarily about who is the better player it's about who is the greatest player we've got some more unpacking to |
| 06:24 | 3.0 s | player we've got some more unpacking to [Music] |
| 08:17 | 4.5 s | hat we'll have no choice but to concede that he is in fact the greatest player of all time which brings us to a real dilemma in this age-old |
| 08:23 | 2.5 s | us to a real dilemma in this age-old debate the flame that burns twice as |
| 11:32 | 4.5 s | still doing this in a couple years while still putting up all NBA numbers I really think it's going to be difficult to say that he's not the |
| 11:38 | 2.5 s | difficult to say that he's not the greatest player ever you know what I'm just going to say |
| 14:15 | 2.5 s | is a necessary burden but unfortunately it's a burden that most fans won't bother to take |

## Music style switches (bed spectrum change, 8 s before vs after)

- 09:12 (change score 1.96, median 0.63)
- 11:42 (change score 1.96, median 0.63)
- 14:15 (change score 2.44, median 0.63)
- 14:58 (change score 2.61, median 0.63)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| IVdJ6Z9jluc_line_chart_overlay_10m17s.mp3 | line_chart_overlay | 161.5 | 0.072 | 0.403 | 0.349 |
| IVdJ6Z9jluc_punchline_drop_02m12s.mp3 | punchline_drop | 83.4 | 0.085 | 0.108 | 0.423 |
| IVdJ6Z9jluc_normal_talk_over_graph_05m05s.mp3 | normal_talk_over_graph | 123.0 | 0.063 | 0.223 | 0.425 |
| IVdJ6Z9jluc_music_switch_1_08m57s.mp3 | music_switch_1 | 92.3 | 0.086 | 0.397 | 0.381 |
| IVdJ6Z9jluc_music_switch_2_11m27s.mp3 | music_switch_2 | 69.8 | 0.133 | 0.224 | 0.477 |
| IVdJ6Z9jluc_music_switch_3_14m00s.mp3 | music_switch_3 | 68.0 | 0.133 | 0.529 | 0.421 |
| IVdJ6Z9jluc_music_switch_4_14m43s.mp3 | music_switch_4 | 117.5 | 0.228 | 0.659 | 0.367 |

## Music notes

- No credit.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
