# Current League model (the one every thread uses)

**Version 10.1, 18 Nov 2026, 17:05 London (v10 chosen by ay at 16:37; 10.1 = Worlds difficulty bug fix).** Owner: the "2nd greatest" model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## What changed
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
|      1 | Faker    | Mid     |    91.5 |          100 |       1180.8 |        6 |           100   |                    87.5 |         77.6 |         100   |           100   |              61.2 |
|      2 | Knight   | Mid     |    73.1 |           80 |        517.9 |        1 |            43.9 |                    99   |         99.8 |          84.9 |            89.8 |              77.5 |
|      3 | Keria    | Support |    70.7 |           77 |        529.3 |        3 |            44.8 |                    94.8 |         95.4 |          82.5 |            78.3 |              77.5 |
|      4 | Chovy    | Mid     |    68.9 |           75 |        434.8 |        0 |            36.8 |                    72.8 |        100   |          91.1 |            89.8 |             100   |
|      5 | Ruler    | Bot     |    67.5 |           74 |        519.7 |        1 |            44   |                    75.1 |         81.2 |          95.3 |            88.4 |              76.8 |
|      6 | Zeus     | Top     |    66.7 |           73 |        474.9 |        2 |            40.2 |                   100   |         91.1 |          80.8 |            68.6 |              62.5 |
|      7 | Bin      | Top     |    63.9 |           70 |        427.7 |        1 |            36.2 |                    96.5 |         79.4 |          82   |            74.2 |              72.6 |
|      8 | Canyon   | Jungle  |    63.6 |           70 |        497.6 |        1 |            42.1 |                    68.8 |         78.9 |          89.3 |            79.2 |              72.8 |
|      9 | Gumayusi | Bot     |    63.5 |           69 |        544.1 |        3 |            46.1 |                    91.7 |         70.1 |          79.2 |            71.2 |              52.2 |
|     10 | Oner     | Jungle  |    63.1 |           69 |        496.5 |        3 |            42   |                    80.8 |         81   |          84.8 |            72.2 |              53   |
|     11 | Viper    | Bot     |    62   |           68 |        401.2 |        2 |            34   |                    79   |         80.4 |          83.1 |            83.3 |              77.3 |
|     12 | Caps     | Mid     |    61.2 |           67 |        429.6 |        0 |            36.4 |                    78.6 |         78   |          75.3 |            81.7 |              75   |
|     13 | Peanut   | Jungle  |    59.7 |           65 |        366.1 |        0 |            31   |                    70.8 |         76.1 |          87.5 |            86.6 |              77.6 |
|     14 | Kiin     | Top     |    58.4 |           64 |        296.9 |        0 |            25.1 |                    67.5 |         90.4 |          86.6 |            84.3 |              66.3 |
|     15 | Kanavi   | Jungle  |    57.8 |           63 |        286.4 |        0 |            24.3 |                    72.9 |         87.8 |          78.9 |            79.2 |              78.3 |
|     16 | Xiaohu   | Mid     |    57.3 |           63 |        359.7 |        0 |            30.5 |                    78.3 |         71.4 |          77.4 |            80.9 |              67.9 |

Weight reruns (each weight moved up to 30%, 1,000 times): Faker #1 in 1,000, Knight #2 in 1,000.
Players above 70: 3. Caps #12 (67% of Faker). Uzi #31. Bengi #53.

## Twists and what-ifs
**International trophies only:** Faker 91.5, Keria 72.9, Knight 70.4, Zeus 68.1, Gumayusi 66.2, Ruler 65.8, Oner 65.2, Chovy 65.1, Bin 62.9, Canyon 61.7.

**Two Fakers (2013-16 and 2017-26 as two players):** 13 players above 70 in this version.
|   Rank | name          |   score |
|-------:|:--------------|--------:|
|      1 | Knight        |    86.6 |
|      2 | Faker 2017-26 |    85.2 |
|      3 | Keria         |    84.3 |
|      4 | Ruler         |    81.1 |
|      5 | Chovy         |    80.5 |
|      6 | Zeus          |    78.7 |
|      7 | Gumayusi      |    77.2 |
|      8 | Canyon        |    76.5 |
|      9 | Oner          |    75.7 |
|     10 | Bin           |    74.9 |
|     11 | Viper         |    72.6 |
|     12 | Faker 2013-16 |    72.5 |
Faker 2013-16 is #12 at 72.5.

**What Knight needs** (only his trophies change, Faker wins nothing more; a lower bound, since titles would also lift his big stage):
| case             |   knight |   faker |   trophy_pts_added |
|:-----------------|---------:|--------:|-------------------:|
| now              |     73.1 |    91.5 |                  0 |
| +1 Worlds        |     77   |    91.5 |                115 |
| +1 Worlds +4 LPL |     78.9 |    91.5 |                172 |
| +2 Worlds        |     80.9 |    91.5 |                230 |
| +2 Worlds +2 MSI |     84.7 |    91.5 |                342 |
| +3 Worlds        |     84.7 |    91.5 |                344 |
| +3 Worlds +1 MSI |     86.6 |    91.5 |                401 |
| +4 Worlds        |     88.6 |    91.5 |                459 |
| +8 LPL           |     76.9 |    91.5 |                114 |

**Four Worlds each** (one player at a time):
| player   |   worlds_now |   worlds_added |   score_now |   score_with_4 |   faker |
|:---------|-------------:|---------------:|------------:|---------------:|--------:|
| Knight   |            1 |              3 |        73.1 |           84.7 |    91.5 |
| Chovy    |            0 |              4 |        68.9 |           84.5 |    91.5 |
| Ruler    |            1 |              3 |        67.5 |           79.2 |    91.5 |
| Caps     |            0 |              4 |        61.2 |           76.8 |    91.5 |
| Bin      |            1 |              3 |        63.9 |           75.6 |    91.5 |
| Canyon   |            1 |              3 |        63.6 |           75.3 |    91.5 |
| Keria    |            3 |              1 |        70.7 |           74.6 |    91.5 |
| Zeus     |            2 |              2 |        66.7 |           74.5 |    91.5 |
| Viper    |            2 |              2 |        62   |           69.8 |    91.5 |
| Gumayusi |            3 |              1 |        63.5 |           67.3 |    91.5 |
| Oner     |            3 |              1 |        63.1 |           67   |    91.5 |

**Ruler vs Chovy:** gap -1.4 for Ruler at the current weights. Ruler passes Chovy once trophies are 51% or more of the score.

## Known limits (say them on screen)
- Bengi and other setup junglers: box scores can't see them.
- Best of five and plus-minus data start in 2016, so Faker's 2013 to 2015 series and games aren't in clutch or team impact.
- Intangibles are proxies (All-Pro votes, team record with and without). Uzi (Hall of Legends) sits low because the Hall honours impact and fame while we weight titles at 40%.
