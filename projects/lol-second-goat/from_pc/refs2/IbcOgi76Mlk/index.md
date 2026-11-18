# When You Score 83 Points In A Game And Nobody Cares (IbcOgi76Mlk)

https://www.youtube.com/watch?v=IbcOgi76Mlk  
Channel: Jxmy Highroller (2026 style). Style: black, glowing neon lines, white heavy title

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 00:16-00:34 | top scoring games table |  | rows scroll |  |
| 08:34-08:48 | stacked photo list |  | list builds |  |
| 09:10-10:14 | race line chart (cumulative points per minute) | 0-100 points vs game clock by quarter | all lines draw together; reference red line (Wilt's 100) runs ahead with a photo at its tip; 09:21 everything fades grey and one line at a time lights up with a small photo + total ('73 points') |  |
| 13:22-13:40 | list builds top-down (game score) |  | rows drop in |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- Race lines = good for 'Faker's titles over time vs everyone else': all lines draw, fade the rest, light one.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 00:26 | 2.5 s | greatest [music] nights in NBA history by some of the greatest players in NBA history. Which begs the question, what the hell is Bam Adebayo |
| 00:29 | 2.0 s | by some of the greatest players in NBA history. Which begs the question, what the hell is Bam Adebayo doing here with a mind-boggling modern |
| 00:31 | 2.0 s | question, what the hell is Bam Adebayo doing here with a mind-boggling modern NBA record of 83 points? Well, this my |
| 00:59 | 2.5 s | (no transcript) |
| 01:37 | 2.0 s | al showroom for others to see. You can also put it up for auction or have the physical card shipped directly to you. The choice is yours. In |
| 01:51 | 3.5 s | peek at some of the potential grails you can hit out of the ruby packs. Open for something good today. Here we go, boys. |
| 01:56 | 2.5 s | There's no way. 09 LeBron tops gold numbered 510 out of 2009. This is |
| 02:31 | 4.5 s | and using code J X M Y. That's arenaclub.com/jimmy, code J X M Y. |
| 03:22 | 7.5 s | ashington is now guarding him with their entire roster. And what started as a normal basketball game has now become a full-blown circus act. |
| 05:23 | 2.5 s | negative consequences. How did Bam Adebayo drop the most points in modern NBA [music] history on a random Tuesday night in March? |
| 05:36 | 3.5 s | Now three. Bam. He gets fouled. |
| 05:40 | 2.5 s | He gets fouled. &gt;&gt; By choosing option C, and infringing on the integrity of the game. In what could |
| 07:12 | 6.0 s | rd stood [music] for so long and why no one can seem to match it despite a number of players getting close. Because Wait, I actually already |
| 07:32 | 3.0 s | doing so without infringing on the integrity of the game, is so narrow that we may never see it happen again. Ah, |
| 07:36 | 2.5 s | y never see it happen again. Ah, that's right. The fallout for unapologetically chasing out Yeah, yeah, yeah. This is truly a definitive and |
| 08:50 | 5.5 s | ters attempted in a game. Oh, and he also broke the record for the most criticism received by a single player in one game. Now, if we ignore |
| 14:49 | 1.5 s | (no transcript) |

## Music style switches (bed spectrum change, 8 s before vs after)

- 01:00 (change score 3.42, median 0.68)
- 05:39 (change score 2.6, median 0.68)
- 07:16 (change score 2.42, median 0.68)
- 14:30 (change score 2.17, median 0.68)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| IbcOgi76Mlk_biggap_race_lines_highlight_09m05s.mp3 | biggap_race_lines_highlight | 161.5 | 0.052 | 0.492 | 0.299 |
| IbcOgi76Mlk_normal_talk_over_graph_09m25s.mp3 | normal_talk_over_graph | 64.6 | 0.038 | 0.221 | 0.384 |
| IbcOgi76Mlk_music_switch_1_00m45s.mp3 | music_switch_1 | 60.1 | 0.125 | 0.13 | 0.571 |
| IbcOgi76Mlk_music_switch_2_05m24s.mp3 | music_switch_2 | 60.1 | 0.079 | 0.389 | 0.18 |
| IbcOgi76Mlk_music_switch_3_07m01s.mp3 | music_switch_3 | 60.1 | 0.076 | 0.577 | 0.166 |
| IbcOgi76Mlk_music_switch_4_14m15s.mp3 | music_switch_4 | 92.3 | 0.182 | 0.6 | 0.379 |

## Music notes

- No credit.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
