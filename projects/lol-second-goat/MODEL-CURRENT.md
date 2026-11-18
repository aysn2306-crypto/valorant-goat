# Current League model (the one every thread uses)

**Version 12 (FINAL unless ay reopens), 18 Nov 2026, 19:25 London. v12 = career-level plus-minus (ay chose "Fix it" 19:14).** ay approved each change on cards: halfway trophy blend (16:58), LCK/LPL fix (17:09), keep trophies as share of Faker (17:09), count 2013-15 games (17:10). Owner: the model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## GOAT pyramid (ay 18 Nov 17:46, final design)

Tiers follow the model's ranking only, never reputation. A few example faces per tier, sorted by rank. Uses the earlier circle design (round photos, rank badge, name under the photo), with a small "TIER N" label on each row. No percentages, no text beside the tiers, no next ten. 18 faces.

| Tier | Ranks | Faces shown |
|---|---|---|
| 1 | #1 | Faker (#1) |
| 2 | #2 to #3 | Knight (#2), Chovy (#3) |
| 3 | #4 to #10 | Ruler (#4), Keria (#5), Bin (#8), Viper (#10) |
| 4 | #11 to #30 | Gumayusi (#12), Caps (#13), Deft (#17), TheShy (#21), Uzi (#30) |
| 5 | #31 to #62 | Scout (#31), Doinb (#35), Bengi (#41), Perkz (#43), Bjergsen (#56), Jankos (#62) |

Faces picked for a spread of regions (ay 18:09: less LCK and old SKT heavy).

Reveal: build from the bottom up. In tier 2, Chovy fills first, then a beat of silence, then Knight. Faker goes alone on top. Zoom in on Knight at #2, then an arrow draws from tier 2 up to tier 1 ("what would it take to get from here to here?") and leads into the outro.

## What changed
**v12 (ay 19:14, audit thread):** team impact plus-minus now fits a career rating per player under each season rating. Season-only keys could not tell five players apart when they played every game together (49% of player seasons had a rating identical to a teammate's; now 3%). Ruler moves to #4 and Keria to #5. Top 10: Faker 92.6, Knight 72.9, Chovy 70.7, Ruler 68.1, Keria 66.7, Zeus 64.5, Canyon 64.4, Bin 63.3, Peanut 62.8, Viper 61.2. Knight #2 in all 1,000 reruns. Two Fakers: Faker 2013-19 is now #1 (88.1, ahead of Knight 86.7, #1 in 768 of 1,000 reruns); Faker 2020-26 #13.

**v11.1 (audit fixes, 18 Nov 19:15):** Recognition counts major-league All-Pro votes only (academy and minor-league picks such as LCK CL and LTA South used to add points). Team impact averages the best 5 plus-minus seasons for everyone (data now covers 2011 on). Scores move by 0.01 to 0.02 at most in the top 12, and no rank changes in the top 80.

**v11 (from 10.1):** trophy values = halfway blend of our values and measured title difficulty (region offsets and byes counted): Worlds 100, MSI 56, First Stand 40, LCK title 44, LPL 35, LEC (20 x strength + 13)/2, LCS (20 x strength + 8)/2; placings scaled the same. Every 2011-15 game result added (data/build_games_all.py), so Elo, clutch, team impact and title difficulty cover Faker's 2013-15. Trophies stay a share of Faker's total. On screen, call "intangibles" **Recognition** (All-Pro votes + team record with and without him). Note: LEC 2026 splits count at full value (no Season Finals that year); small.

**v10.1:** bug fix. The harder-path bonus (0.85x to 1.15x by opponent strength) was never applied to Worlds titles from 2017 on (their games sit on a "/Main Event" page). Now applied: BLG 2026 x1.08, T1 2024 x1.14, T1 2023 x1.11, DWG 2020 x0.86. Knight unchanged at 73.1, Keria 70.1 to 70.7, Chovy and Ruler down slightly.

**v10 (from v9):** new part **Team impact (12%)**: plus-minus (RAPM, basketball's method; WAR idea from baseball) over 21,851 games from 2016 on, one rating per player per season, best 5 seasons (careers that began before 2016 average their covered seasons). It replaces **Carry** (still shown as a board, unweighted). Skill 22 to 18. Code: `scoring/rapm.py`.

**v9 (from v8):** longevity years capped at 0.4 above the line; clutch as a career total; peak and individual merged into skill; team lift median when never apart; short careers padded.

## How the score is added up
Each part is 0 to 100: pool median = 50, best player = 100 (trophies: Faker = 100, the rest in proportion). Score = weighted sum:
trophies 40, big stage clutch 14, skill 18, impact 12, longevity 9, intangibles 7. 527 players with 150+ games. A raw 60 is already top 2-3%,
so **on screen show rank and % of Faker, not the raw score.**

## Top 16 with part scores
|   Rank | Player   | Role    |   Score |   % of Faker |   Trophy pts |   Worlds |   trophies (40) |   big stage clutch (14) |   skill (18) |   impact (12) |   longevity (9) |   intangibles (7) |
|-------:|:---------|:--------|--------:|-------------:|-------------:|---------:|----------------:|------------------------:|-------------:|--------------:|----------------:|------------------:|
|      1 | Faker    | Mid     |    92.6 |          100 |       1509   |        6 |           100   |                    94.1 |         78.6 |         100   |           100   |              61.3 |
|      2 | Knight   | Mid     |    72.9 |           79 |        695.5 |        1 |            46.1 |                    98.9 |         99.9 |          75.9 |            89.7 |              77.6 |
|      3 | Chovy    | Mid     |    70.7 |           76 |        684.3 |        0 |            45.3 |                    73   |        100   |          77.6 |            89.7 |             100   |
|      4 | Ruler    | Bot     |    68.1 |           73 |        705.3 |        1 |            46.7 |                    75.4 |         80.9 |          90.8 |            88.5 |              76.8 |
|      5 | Keria    | Support |    66.7 |           72 |        613.7 |        3 |            40.7 |                    94.9 |         95.3 |          62.2 |            78.3 |              77.5 |
|      6 | Zeus     | Top     |    64.5 |           70 |        582.9 |        2 |            38.6 |                   100   |         91.1 |          68   |            68.5 |              62.5 |
|      7 | Canyon   | Jungle  |    64.4 |           70 |        714.2 |        1 |            47.3 |                    69.1 |         78.6 |          78.7 |            79.1 |              72.8 |
|      8 | Bin      | Top     |    63.3 |           68 |        561.3 |        1 |            37.2 |                    96.4 |         79.3 |          74.2 |            74.4 |              72.7 |
|      9 | Peanut   | Jungle  |    62.8 |           68 |        628.8 |        0 |            41.7 |                    71.4 |         76.4 |          75.8 |            87   |              77.7 |
|     10 | Viper    | Bot     |    61.2 |           66 |        553.9 |        2 |            36.7 |                    79   |         80.2 |          67.6 |            83.4 |              77.4 |
|     11 | Oner     | Jungle  |    59.5 |           64 |        571.5 |        3 |            37.9 |                    80.9 |         80.8 |          68.6 |            72.2 |              53   |
|     12 | Gumayusi | Bot     |    59.1 |           64 |        620.9 |        3 |            41.1 |                    91.8 |         69.8 |          59.5 |            71.3 |              52.2 |
|     13 | Caps     | Mid     |    58.5 |           63 |        455.1 |        0 |            30.2 |                    78.8 |         77.8 |          72.8 |            81.8 |              75   |
|     14 | Kiin     | Top     |    58.4 |           63 |        440.9 |        0 |            29.2 |                    67.7 |         90.3 |          72.9 |            84.3 |              66.4 |
|     15 | Xiaohu   | Mid     |    58   |           63 |        489.1 |        0 |            32.4 |                    78.3 |         71.2 |          76.7 |            80.9 |              68   |
|     16 | Kanavi   | Jungle  |    57   |           62 |        401.1 |        0 |            26.6 |                    73   |         87.6 |          64.8 |            79.1 |              78.3 |

Weight reruns (each weight moved up to 30%, 1,000 times): Faker #1 in 1,000; Knight #2 in 996 (see whatif.py output).
Players above 70: 3. Caps #13 (63% of Faker). Uzi #30. Bengi #41.

## Twists and what-ifs
**International trophies only:** Faker 92.6, Keria 70.6, Knight 70.3, Zeus 67.4, Ruler 66.0, Gumayusi 64.1, Chovy 64.0, Oner 63.4, Bin 62.9, Canyon 61.3.

**Two Fakers (2013-19 and 2020-26, even halves by years, 3 Worlds each; ay 17:23):** 12 players above 70 in this version.
|   Rank | name          |   score |
|-------:|:--------------|--------:|
|      1 | Faker 2013-19 |    88.1 |
|      2 | Knight        |    86.7 |
|      3 | Chovy         |    84.3 |
|      4 | Ruler         |    82.1 |
|      5 | Keria         |    78.6 |
|      6 | Canyon        |    78.3 |
|      7 | Zeus          |    75.8 |
|      8 | Peanut        |    75.3 |
|      9 | Bin           |    74.4 |
|     10 | Viper         |    72.2 |
|     11 | Gumayusi      |    71   |
|     12 | Oner          |    70.6 |
|     13 | Faker 2020-26 |    69.6 |
|     14 | Xiaohu        |    67.8 |
Faker 2020-26 is #13 at 69.6. Weight reruns in this version: #1 Faker 2013-19 768, Knight 232.

**What Knight or Gumayusi need to pass Faker:** on hold (ay 16:57). The old frozen-stats tables were wrong (they only added trophies) and are removed.

**Ruler vs Chovy:** gap -2.7 for Ruler at the current weights. Ruler passes Chovy once trophies are 80% or more of the score.

## Known limits (say them on screen)
- Bengi and other setup junglers: box scores can't see them.
- Best of five and plus-minus data start in 2016, so Faker's 2013 to 2015 series and games aren't in clutch or team impact.
- Intangibles are proxies (All-Pro votes, team record with and without). Uzi (Hall of Legends) sits low because the Hall honours impact and fame while we weight titles at 40%.
