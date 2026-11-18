# 8 Unbelievable Charts That Will Change The Way You See The NBA (VCIKek1f-Hs)

https://www.youtube.com/watch?v=VCIKek1f-Hs  
Channel: Jxmy Highroller (2019-20 style). Style: white dots + small white labels on a dark chalkboard texture, big condensed axis numbers on the left, no gridlines

## Graph moments

| Time | Chart type | Axis / range | Motion | Sound |
|---|---|---|---|---|
| 00:14-01:06 | dot chart, one axis (points) | starts at 400 (cut axis), camera climbs to 800 | holds on the pack at 400-500, then a long vertical camera climb through empty axis to the lone top dot, then zoom out | music keeps going under the climb |
| 01:26-03:00 | dot chart (salary) | $4 mil climbing to $32 mil | same climb, labels 'Name ($x)' beside each dot; ends with zoom out to whole column |  |
| 03:38-04:50 | dot chart (triple-doubles) | 5 to 95 | climb past 35, 70, 90: one outlier far above | drop at 03:28 on Westbrook |
| 05:34-07:00 | XY scatter rings vs playoff games | rings 0-11 x, games y | white arrows point at corners ('more rings', 'more playoff games'), green highlight on one dot, then names fade in | music cuts at 06:41 on Bill Russell 'very low and very right, eleven rings' |
| 07:40-09:22 | dot climb (playoff games) | starts ~90, climbs to 240 | climb, pack at bottom, LeBron alone at top; zoom out then a ranked list |  |
| 09:38-10:40 | dot climb (team wins since 2015) | starts 250, cut; climb to 400 | 10:02-10:08 hold on pack (Rockets 303, Raptors 307, Spurs 299); 10:08-10:11.5 fast climb 300->400 (~30 units/s) through empty space; Warriors (399) dot arrives top; 10:12-10:15 hold; 10:15+ slow zoom out to show the gap; then a bracket note '92 wins between Warriors and 2nd best' | MUSIC CUT 10:12 for 4.5 s exactly as he says '399 wins' |
| 11:34-12:54 | dot climb (games of 20+ rebounds) | 0 to 55 | climb to Dwight Howard alone at 52, zoom out, list of names on the right with brackets |  |

0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.

## What to copy

- The big-gap move: start the axis at the pack (not zero), hold while talking, then climb fast through empty axis numbers to the one dot, cut the music the moment the number is said, hold in silence ~3 s, then zoom out slowly so the whole gap shows.
- Labels are tiny 'Name (value)' under each dot; no photos needed.
- Every chart is the same template so the viewer learns to read it.

## Where the music stops

Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.

| Starts | Length | Said just before (transcript) |
|---|---|---|
| 03:28 | 4.0 s | t apparently it was less impressive and the third time he did it this past season he finished 10th and MVP voting 10th but regardless of how |
| 06:41 | 7.5 s | and seventy nine playoff games that means on average MJ won a ring every thirty playoff games he played and then |
| 10:12 | 4.5 s | come nowhere near the success the Warriors had because since 2015 the Warriors have put up 399 wins |
| 10:49 | 2.0 s | been vicious and unrelenting you can't help but to just feel bad for the guy and quite frankly I'm getting sick of it |
| 11:14 | 2.0 s | nster if you didn't get the privilege of watching this man in his prime do yourself a favor and you two-bit man's would give you 20 and 14 a |
| 13:13 | 2.0 s | statistics visuals things like that that's where I really get excited so let me know we all think and let me know down in the comments below |
| 13:20 | 2.0 s | let me know down in the comments below which chart was the most interesting and which one blew you away the most be sure |
| 13:22 | 1.0 s |  was the most interesting and which one blew you away the most be sure to subscribe to join high-roller nation and as always until next time |

## Music style switches (bed spectrum change, 8 s before vs after)

- 04:07 (change score 1.84, median 0.66)
- 08:56 (change score 1.81, median 0.66)
- 10:21 (change score 1.97, median 0.66)
- 13:27 (change score 2.19, median 0.66)

## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)

Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.

| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |
|---|---|---|---|---|---|
| VCIKek1f-Hs_biggap_warriors_399_music_cut_09m56s.mp3 | biggap_warriors_399_music_cut | 92.3 | 0.104 | 0.342 | 0.413 |
| VCIKek1f-Hs_biggap_bill_russell_11_rings_06m27s.mp3 | biggap_bill_russell_11_rings | 78.3 | 0.077 | 0.443 | 0.286 |
| VCIKek1f-Hs_drop_westbrook_03m10s.mp3 | drop_westbrook | 60.1 | 0.064 | 0.434 | 0.316 |
| VCIKek1f-Hs_normal_talk_over_graph_01m45s.mp3 | normal_talk_over_graph | 63.0 | 0.066 | 0.456 | 0.358 |
| VCIKek1f-Hs_music_switch_1_03m52s.mp3 | music_switch_1 | 161.5 | 0.074 | 0.52 | 0.331 |
| VCIKek1f-Hs_music_switch_2_08m41s.mp3 | music_switch_2 | 92.3 | 0.084 | 0.4 | 0.406 |
| VCIKek1f-Hs_music_switch_3_10m06s.mp3 | music_switch_3 | 107.7 | 0.11 | 0.384 | 0.366 |
| VCIKek1f-Hs_music_switch_4_13m12s.mp3 | music_switch_4 | 161.5 | 0.604 | 0.153 | 0.54 |

## Music notes

- Credit in description: 'Music provided by LCS Beats' (YouTube beat producer). No licence found online: ask the producer before using.
- Measured: soft, bass-led, weak beat (beat strength mostly < 0.11), roughly 60-95 bpm: chill instrumental hip-hop type bed.

## Files

- `transcript.txt` timestamps [mm:ss]
- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db
- `audio_analysis.json` all numbers above
