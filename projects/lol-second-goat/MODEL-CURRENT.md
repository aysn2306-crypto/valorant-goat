# Current League model (the one every thread uses)

**Version 9, 18 Nov 2026, 16:30 London.** Owner: the "2nd greatest" model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (repo branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`.

## What changed in v9 (from v8)
1. **Longevity:** each elite year is capped at 0.4 above the line, so one monster year counts as one great year, not three. Faker 79 to 100, Knight 100 to 90.
2. **Clutch:** career total of best of five and game 5 wins above Elo expectation, not a per series rate, so volume counts. Faker 81 to 90 (big stage + clutch 80 to 87.5). Data starts 2016.
3. **Peak and Individual merged into one Skill part** (70% best 5 years, 30% best year). They were the same yearly rating (correlation 0.90), so box score skill was counted twice (28%).
4. **Weights:** trophies 40, big stage + clutch 14, skill 22, longevity 9, carry 8, intangibles 7 (sum 100).
5. **Team lift:** a player who never played without his team (Faker) gets the pool median, not zero (tiny effect).
6. **Short careers:** individual counts missing years below 5 as average.

## How the score is added up
Each part is 0 to 100: pool median = 50, best player = 100 (trophies: Faker = 100, the rest in proportion). Score = weighted sum. 527 players with 150+ games. Because the median pro is 50 on every part, the pool lives between about 30 and 89, so a raw 60 is top 2%. **On screen, show rank and % of Faker, not the raw score.**

## Top 16 with part scores
|   Rank | Player   | Role    |   Score |   % of Faker |   Trophy pts |   Worlds |   trophies |   big stage clutch |   skill |   longevity |   carry pillar |   intangibles |
|-------:|:---------|:--------|--------:|-------------:|-------------:|---------:|-----------:|-------------------:|--------:|------------:|---------------:|--------------:|
|      1 | Faker    | Mid     |    88.5 |          100 |       1153.8 |        6 |      100   |               87.5 |    77.6 |       100   |           73.2 |          61.2 |
|      2 | Knight   | Mid     |    71.9 |           81 |        506.8 |        1 |       43.9 |               99   |    99.8 |        89.8 |           63.1 |          77.5 |
|      3 | Keria    | Support |    69.5 |           79 |        498.6 |        3 |       43.2 |               94.8 |    95.4 |        78.3 |           68.9 |          77.5 |
|      4 | Chovy    | Mid     |    69.5 |           79 |        432.9 |        0 |       37.5 |               72.8 |   100   |        89.8 |           89.9 |         100   |
|      5 | Ruler    | Bot     |    65.5 |           74 |        518.5 |        1 |       44.9 |               75.1 |    81.2 |        88.4 |           72.8 |          76.8 |
|      6 | Zeus     | Top     |    64.4 |           73 |        448.6 |        2 |       38.9 |              100   |    91.1 |        68.6 |           52.8 |          62.5 |
|      7 | Bin      | Top     |    62.6 |           71 |        421.3 |        1 |       36.5 |               96.5 |    79.4 |        74.2 |           66.1 |          72.6 |
|      8 | Canyon   | Jungle  |    60.7 |           69 |        510.3 |        1 |       44.2 |               68.8 |    78.9 |        79.2 |           48   |          72.8 |
|      9 | Viper    | Bot     |    60.7 |           69 |        398.6 |        2 |       34.5 |               79   |    80.4 |        83.3 |           65.8 |          77.3 |
|     10 | Caps     | Mid     |    60.4 |           68 |        428.8 |        0 |       37.2 |               78.6 |    78   |        81.7 |           58.9 |          75   |
|     11 | Gumayusi | Bot     |    59.4 |           67 |        513.3 |        3 |       44.5 |               91.7 |    70.1 |        71.2 |           40.8 |          52.2 |
|     12 | Oner     | Jungle  |    59.3 |           67 |        466.4 |        3 |       40.4 |               80.8 |    81   |        72.2 |           47.5 |          53   |
|     13 | Peanut   | Jungle  |    57.3 |           65 |        366.9 |        0 |       31.8 |               70.8 |    76.1 |        86.6 |           59   |          77.6 |
|     14 | Kiin     | Top     |    57.3 |           65 |        294.8 |        0 |       25.6 |               67.5 |    90.4 |        84.3 |           68.9 |          66.3 |
|     15 | Kanavi   | Jungle  |    56.8 |           64 |        283.2 |        0 |       24.5 |               72.9 |    87.8 |        79.2 |           60.1 |          78.3 |
|     16 | Xiaohu   | Mid     |    55.8 |           63 |        363.9 |        0 |       31.5 |               78.3 |    71.4 |        80.9 |           55.8 |          67.9 |

Weight reruns (each weight moved up to 30%, 1,000 times): Faker #1 in 1,000, Knight #2 in 1,000.
Faker passes Knight once trophies are above about 15% of the score.

## Twists and what-ifs
**International trophies only:** Faker 88.5, Keria 71.6, Knight 69.2, Zeus 65.7, Chovy 65.6, Ruler 63.9, Gumayusi 62.0, Bin 61.6, Oner 61.3, Viper 59.8.

**Two Fakers (2013-16 and 2017-26 as two players):**
|   Rank | name          |   score |
|-------:|:--------------|--------:|
|      1 | Knight        |    86   |
|      2 | Keria         |    83.1 |
|      3 | Chovy         |    81.6 |
|      4 | Ruler         |    79.8 |
|      5 | Faker 2017-26 |    79.7 |
|      6 | Zeus          |    76.4 |
|      7 | Canyon        |    74.6 |
|      8 | Bin           |    74.1 |
|      9 | Gumayusi      |    73.2 |
|     10 | Caps          |    72.2 |
|     11 | Oner          |    71.9 |
|     12 | Viper         |    71.8 |
|     13 | Faker 2013-16 |    70.9 |
Faker 2013-16 is #13 at 70.9. 13 players score above 70 in this version (the top is lower without one Faker at 100 trophies).

**What Knight needs** (only his trophies change, Faker wins nothing more):
| case             |   knight |   faker |   trophy_pts_added |
|:-----------------|---------:|--------:|-------------------:|
| now              |     71.9 |    88.5 |                  0 |
| +1 Worlds        |     75.6 |    88.5 |                106 |
| +1 Worlds +4 LPL |     77.6 |    88.5 |                163 |
| +2 Worlds        |     79.3 |    88.5 |                212 |
| +2 Worlds +2 MSI |     83   |    88.5 |                320 |
| +3 Worlds        |     83   |    88.5 |                318 |
| +3 Worlds +1 MSI |     84.8 |    88.5 |                372 |
| +4 Worlds        |     86.7 |    88.5 |                425 |
| +8 LPL           |     75.9 |    88.5 |                114 |
Knight with 6 Worlds (+5): 90.4, passes Faker 88.5. Lower bound: extra titles would also lift his big stage and clutch.

**Four Worlds each** (one player at a time):
| player   |   worlds_now |   worlds_added |   score_now |   score_with_4 |   faker |
|:---------|-------------:|---------------:|------------:|---------------:|--------:|
| Chovy    |            0 |              4 |        69.5 |           84.2 |    88.5 |
| Knight   |            1 |              3 |        71.9 |           83   |    88.5 |
| Ruler    |            1 |              3 |        65.5 |           76.5 |    88.5 |
| Caps     |            0 |              4 |        60.4 |           75.1 |    88.5 |
| Bin      |            1 |              3 |        62.6 |           73.7 |    88.5 |
| Keria    |            3 |              1 |        69.5 |           73.2 |    88.5 |
| Canyon   |            1 |              3 |        60.7 |           71.8 |    88.5 |
| Zeus     |            2 |              2 |        64.4 |           71.7 |    88.5 |
| Viper    |            2 |              2 |        60.7 |           68.1 |    88.5 |
| Gumayusi |            3 |              1 |        59.4 |           63.1 |    88.5 |
| Oner     |            3 |              1 |        59.3 |           63   |    88.5 |

**Ruler vs Chovy:** Chovy ahead by 4.0. Ruler wins trophies, Chovy wins skill, carry and intangibles. Ruler passes Chovy only when trophies are 60%+ of the score. Present as a real debate.

## Known limits (say them on screen)
- Bengi and other setup junglers: box scores can't see them (Bengi around #60).
- Best of five data starts 2016, so Faker's 2013 to 2015 series aren't in clutch.
- Intangibles are proxies (All-Pro votes, team record with and without).
