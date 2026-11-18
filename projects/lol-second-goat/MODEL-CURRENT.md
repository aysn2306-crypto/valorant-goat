# Current League model (the one every thread uses)

**Version 10, 18 Nov 2026, 16:50 London (ay chose v10 at 16:37).** Owner: the "2nd greatest" model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## What changed
**v10 (from v9):** new part **Team impact (12%)**: plus-minus (RAPM, basketball's method; WAR idea from baseball) over 21,851 games from 2016 on, one rating per player per season, best 5 seasons (careers that began before 2016 average their covered seasons). It replaces **Carry** (still shown as a board, unweighted). Skill 22 to 18. Code: `scoring/rapm.py`.

**v9 (from v8):** longevity years capped at 0.4 above the line; clutch as a career total; peak and individual merged into skill; team lift median when never apart; short careers padded.

## How the score is added up
Each part is 0 to 100: pool median = 50, best player = 100 (trophies: Faker = 100, the rest in proportion). Score = weighted sum:
trophies 40, big stage clutch 14, skill 18, impact 12, longevity 9, intangibles 7. 527 players with 150+ games. A raw 60 is already top 2-3%,
so **on screen show rank and % of Faker, not the raw score.**

## Top 16 with part scores
|   Rank | Player   | Role    |   Score |   % of Faker |   Trophy pts |   Worlds |   trophies (40) |   big stage clutch (14) |   skill (18) |   impact (12) |   longevity (9) |   intangibles (7) |
|-------:|:---------|:--------|--------:|-------------:|-------------:|---------:|----------------:|------------------------:|-------------:|--------------:|----------------:|------------------:|
|      1 | Faker    | Mid     |    91.5 |          100 |       1153.8 |        6 |           100   |                    87.5 |         77.6 |         100   |           100   |              61.2 |
|      2 | Knight   | Mid     |    73.1 |           80 |        506.8 |        1 |            43.9 |                    99   |         99.8 |          84.9 |            89.8 |              77.5 |
|      3 | Keria    | Support |    70.1 |           77 |        498.6 |        3 |            43.2 |                    94.8 |         95.4 |          82.5 |            78.3 |              77.5 |
|      4 | Chovy    | Mid     |    69.2 |           76 |        432.9 |        0 |            37.5 |                    72.8 |        100   |          91.1 |            89.8 |             100   |
|      5 | Ruler    | Bot     |    67.9 |           74 |        518.5 |        1 |            44.9 |                    75.1 |         81.2 |          95.3 |            88.4 |              76.8 |
|      6 | Zeus     | Top     |    66.2 |           72 |        448.6 |        2 |            38.9 |                   100   |         91.1 |          80.8 |            68.6 |              62.5 |
|      7 | Canyon   | Jungle  |    64.5 |           70 |        510.3 |        1 |            44.2 |                    68.8 |         78.9 |          89.3 |            79.2 |              72.8 |
|      8 | Bin      | Top     |    64   |           70 |        421.3 |        1 |            36.5 |                    96.5 |         79.4 |          82   |            74.2 |              72.6 |
|      9 | Gumayusi | Bot     |    62.8 |           69 |        513.3 |        3 |            44.5 |                    91.7 |         70.1 |          79.2 |            71.2 |              52.2 |
|     10 | Oner     | Jungle  |    62.4 |           68 |        466.4 |        3 |            40.4 |                    80.8 |         81   |          84.8 |            72.2 |              53   |
|     11 | Viper    | Bot     |    62.2 |           68 |        398.6 |        2 |            34.5 |                    79   |         80.4 |          83.1 |            83.3 |              77.3 |
|     12 | Caps     | Mid     |    61.6 |           67 |        428.8 |        0 |            37.2 |                    78.6 |         78   |          75.3 |            81.7 |              75   |
|     13 | Peanut   | Jungle  |    60.1 |           66 |        366.9 |        0 |            31.8 |                    70.8 |         76.1 |          87.5 |            86.6 |              77.6 |
|     14 | Kiin     | Top     |    58.6 |           64 |        294.8 |        0 |            25.6 |                    67.5 |         90.4 |          86.6 |            84.3 |              66.3 |
|     15 | Kanavi   | Jungle  |    57.9 |           63 |        283.2 |        0 |            24.5 |                    72.9 |         87.8 |          78.9 |            79.2 |              78.3 |
|     16 | Xiaohu   | Mid     |    57.7 |           63 |        363.9 |        0 |            31.5 |                    78.3 |         71.4 |          77.4 |            80.9 |              67.9 |

Weight reruns (each weight moved up to 30%, 1,000 times): Faker #1 in 1,000, Knight #2 in 1,000.
Players above 70: 3. Caps #12 (67% of Faker). Uzi #31. Bengi #53.

## Twists and what-ifs
**International trophies only:** Faker 91.5, Keria 72.1, Knight 70.4, Zeus 67.5, Ruler 66.3, Gumayusi 65.4, Chovy 65.3, Oner 64.5, Bin 63.0, Canyon 62.7.

**Two Fakers (2013-16 and 2017-26 as two players):** 14 players above 70 in this version.
|   Rank | name          |   score |
|-------:|:--------------|--------:|
|      1 | Knight        |    87.2 |
|      2 | Faker 2017-26 |    85.2 |
|      3 | Keria         |    83.7 |
|      4 | Ruler         |    82.3 |
|      5 | Chovy         |    81.4 |
|      6 | Canyon        |    78.5 |
|      7 | Zeus          |    78.3 |
|      8 | Gumayusi      |    76.7 |
|      9 | Bin           |    75.6 |
|     10 | Oner          |    75.1 |
|     11 | Faker 2013-16 |    73.8 |
|     12 | Caps          |    73.5 |
Faker 2013-16 is #11 at 73.8.

**What Knight needs** (only his trophies change, Faker wins nothing more; a lower bound, since titles would also lift his big stage):
| case             |   knight |   faker |   trophy_pts_added |
|:-----------------|---------:|--------:|-------------------:|
| now              |     73.1 |    91.5 |                  0 |
| +1 Worlds        |     76.8 |    91.5 |                106 |
| +1 Worlds +4 LPL |     78.8 |    91.5 |                163 |
| +2 Worlds        |     80.5 |    91.5 |                212 |
| +2 Worlds +2 MSI |     84.2 |    91.5 |                320 |
| +3 Worlds        |     84.1 |    91.5 |                318 |
| +3 Worlds +1 MSI |     86   |    91.5 |                372 |
| +4 Worlds        |     87.8 |    91.5 |                425 |
| +8 LPL           |     77.1 |    91.5 |                114 |

**Four Worlds each** (one player at a time):
| player   |   worlds_now |   worlds_added |   score_now |   score_with_4 |   faker |
|:---------|-------------:|---------------:|------------:|---------------:|--------:|
| Knight   |            1 |              3 |        73.1 |           84.1 |    91.5 |
| Chovy    |            0 |              4 |        69.2 |           83.9 |    91.5 |
| Ruler    |            1 |              3 |        67.9 |           78.9 |    91.5 |
| Caps     |            0 |              4 |        61.6 |           76.3 |    91.5 |
| Canyon   |            1 |              3 |        64.5 |           75.5 |    91.5 |
| Bin      |            1 |              3 |        64   |           75.1 |    91.5 |
| Keria    |            3 |              1 |        70.1 |           73.8 |    91.5 |
| Zeus     |            2 |              2 |        66.2 |           73.6 |    91.5 |
| Viper    |            2 |              2 |        62.2 |           69.6 |    91.5 |
| Gumayusi |            3 |              1 |        62.8 |           66.5 |    91.5 |
| Oner     |            3 |              1 |        62.4 |           66.1 |    91.5 |

**Ruler vs Chovy:** gap -1.4 for Ruler at the current weights. Ruler passes Chovy once trophies are 50% or more of the score.

## Known limits (say them on screen)
- Bengi and other setup junglers: box scores can't see them.
- Best of five and plus-minus data start in 2016, so Faker's 2013 to 2015 series and games aren't in clutch or team impact.
- Intangibles are proxies (All-Pro votes, team record with and without). Uzi (Hall of Legends) sits low because the Hall honours impact and fame while we weight titles at 40%.
