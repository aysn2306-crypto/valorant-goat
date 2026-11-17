# DRAFT TEST 3 (League, algorithm v3): not the final ranking

Data: Leaguepedia scoreboards, 303 tournaments, 25,987 games (approx.), 1,915 players; pool 527 players with 150+ games. Faker is ranked like everyone else (ay, 17 Nov).

## What changed since test 1
1. Early-era gap filled: team kills, gold and CS rebuilt from game-level scoreboards for 2011-2015, so every game since 2013 has kill participation and a resource share (CS share stands in where gold was not recorded).
2. Fairness rule: big-stage form, winning, carry and clean play use each player's best 5 calendar years, not the career average. Before, every year past a peak pulled the average down, so a 13-year career scored worse than a 6-year one on the same peak. Longevity is still its own category. With career averages Faker ranks #12.
3. Worlds, MSI and First Stand MVP / Finals MVP awards added from Liquipedia (25 awards, data/manual/mvps.csv): Worlds 15 points, MSI 8, First Stand 5, full value.
5. Damage per minute for 2014-2020 filled from Oracle's Elixir (6,222 of 8,065 player-event rows that had none).
4. Longevity: an elite year is 20+ games at 0.2 SD above the role average (was 0.35, which almost nobody reached).

## Overall top 15 (everyone, Faker included)

| # | Player | Role | Regions | Years | Worlds | MSI | Domestic | MVPs | Score | #1 in 1000 runs | #2 in 1000 runs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 92.8 | 100.0% | 0.0% |
| 2 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 87.5 | 0.0% | 100.0% |
| 3 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 86.4 | 0.0% | 0.0% |
| 4 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 86.4 | 0.0% | 0.0% |
| 5 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 83.3 | 0.0% | 0.0% |
| 6 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 82.2 | 0.0% | 0.0% |
| 7 | Bang | Bot | LCK/LCS | 2012-2021 | 2 | 2 | 4 | 0 | 81.1 | 0.0% | 0.0% |
| 8 | Oner | Jungle | LCK | 2021-2026 | 3 | 0 | 1 | 0 | 80.2 | 0.0% | 0.0% |
| 9 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 79.0 | 0.0% | 0.0% |
| 10 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 78.3 | 0.0% | 0.0% |
| 11 | Peanut | Jungle | LCK/LPL | 2015-2025 | 0 | 1 | 8 | 0 | 77.9 | 0.0% | 0.0% |
| 12 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 77.7 | 0.0% | 0.0% |
| 13 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 77.5 | 0.0% | 0.0% |
| 14 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 76.5 | 0.0% | 0.0% |
| 15 | Uzi | Bot | LPL | 2013-2023 | 0 | 1 | 2 | 1 | 75.9 | 0.0% | 0.0% |

Benchmark: Faker score 92.8, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 87, peak 89, winning 100, longevity 97, carry 94, clean_play 92, consistency 66

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 3 | 86.4 | 1 | 651 | 100 | 100 (2026) |
| Viper | 10 | 78.3 | 2 | 391 | 93 | 95 (2024) |
| Bin | 13 | 77.5 | 1 | 541 | 95 | 83 (2024) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Knight first, Chovy next
- trophy weight 12%: Keria first, Knight next
- trophy weight 18%: Faker first, Keria next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1382 pts (6 Worlds, 2 MSI, 10 domestic)
2. Ruler: 650 pts (1 Worlds, 2 MSI, 6 domestic)
3. Gumayusi: 630 pts (3 Worlds, 1 MSI, 1 domestic)
4. Keria: 620 pts (3 Worlds, 0 MSI, 1 domestic)
5. Oner: 606 pts (3 Worlds, 0 MSI, 1 domestic)

## Side-board: Most Dominant (individual categories only)

1. Chovy (Mid, 1018 games, peak 2024): 99.6
2. Knight (Mid, 1102 games, peak 2026): 99.5
3. Keria (Support, 995 games, peak 2024): 98.7
4. Ruler (Bot, 1177 games, peak 2022): 97.4
5. Viper (Bot, 1041 games, peak 2024): 96.6

## Every category top 5 (Faker included)

**trophies**: Faker 100, Keria 58, Ruler 58, Knight 53, Oner 49

**big_stage**: Piglet 100, Keria 100, Knight 100, Ruler 99, DanDy 99

**peak**: Knight 100, Chovy 100, Bdd 100, Ninja 99, Keria 99

**winning**: Chovy 100, Faker 100, Canyon 100, Ruler 99, Peanut 99

**longevity**: Ruler 100, Knight 100, Chovy 100, Keria 99, Meiko 99

**carry**: Kanavi 100, Chovy 100, Uzi 100, Huni 99, Nuguri 99

**clean_play**: Chovy 100, ShowMaker 100, Knight 100, Rekkles 99, Bdd 99

**consistency**: Chovy 100, Knight 100, Viper 100, Aiming 99, Ruler 99

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.12, Mellisan 1.06, LaMiaZeaLoT 1.00, Cyanide 0.99, XPeke 0.85
- Worlds Season 2 Taipei Assassins: Toyz 1.18, Stanley 1.10, BeBe 1.01, Lilballz 0.90, MiSTakE 0.81
- Worlds Season 3 SK Telecom T1: Piglet 1.23, Bengi 1.07, Impact 0.94, Faker 0.93, PoohManDu 0.83
- Worlds 2014 Samsung White: DanDy 1.17, Mata 1.07, Looper 1.05, PawN 0.93, Imp 0.77
- Worlds 2015 SK Telecom T1: Bang 1.23, Wolf 0.99, MaRin 0.98, Faker 0.94, Bengi 0.87
- Worlds 2016 SK Telecom T1: Wolf 1.15, Bang 1.15, Bengi 0.99, Faker 0.93, Blank 0.92, Duke 0.89
- Worlds 2017 Samsung Galaxy: Ruler 1.16, CoreJJ 1.14, CuVee 1.05, Ambition 0.84, Crown 0.81
- Worlds 2018 Invictus Gaming: Ning 1.13, TheShy 1.11, Rookie 0.99, Baolan 0.93, JackeyLove 0.83
- Worlds 2019 FunPlus Phoenix: Tian 1.19, Doinb 1.09, Crisp 1.02, Lwx 0.88, GimGoon 0.83
- Worlds 2020 DAMWON Gaming: Canyon 1.35, Nuguri 1.06, Ghost 0.94, ShowMaker 0.85, BeryL 0.80
- Worlds 2021 EDward Gaming: Meiko 1.24, Flandre 1.08, Scout 0.95, Viper 0.89, Jiejie 0.83
- Worlds 2022 DRX: BeryL 1.18, Pyosik 1.09, Zeka 0.99, Kingen 0.92, Deft 0.82
- Worlds 2023 T1: Zeus 1.20, Keria 1.20, Oner 0.99, Faker 0.84, Gumayusi 0.76
- Worlds 2024 T1: Zeus 1.13, Keria 1.08, Oner 1.05, Gumayusi 1.03, Faker 0.72
- Worlds 2025 T1: Keria 1.19, Faker 1.04, Oner 1.00, Gumayusi 0.92, Doran 0.86
- Worlds 2026 Bilibili Gaming: Knight 1.46, Xun 1.02, Viper 0.92, Bin 0.87, ON 0.73

## Region strength by year (international game win share, best region = 1.0)

|      |   LCS |   LEC |   LCK |   LMS |   LPL |
|-----:|------:|------:|------:|------:|------:|
| 2011 |  0.44 |  1    |  0.53 |  1    |  0.53 |
| 2012 |  0.2  |  0.2  |  0.53 |  1    |  0.53 |
| 2013 |  0.32 |  0.67 |  1    |  1    |  0.93 |
| 2014 |  0.57 |  0.48 |  1    |  0.27 |  0.81 |
| 2015 |  0.23 |  0.51 |  1    |  0.36 |  0.52 |
| 2016 |  0.61 |  0.2  |  1    |  0.34 |  0.53 |
| 2017 |  0.4  |  0.53 |  1    |  0.28 |  0.7  |
| 2018 |  0.6  |  0.79 |  0.6  |  0.36 |  1    |
| 2019 |  0.4  |  0.88 |  0.92 |  0.2  |  1    |
| 2020 |  0.39 |  0.78 |  0.93 |  0.28 |  1    |
| 2021 |  0.53 |  0.63 |  1    |  0.28 |  0.86 |
| 2022 |  0.2  |  0.41 |  1    |  0.28 |  0.86 |
| 2023 |  0.27 |  0.36 |  1    |  0.28 |  0.98 |
| 2024 |  0.43 |  0.53 |  1    |  0.28 |  0.93 |
| 2025 |  0.35 |  0.31 |  1    |  0.28 |  0.57 |
| 2026 |  0.57 |  0.56 |  0.94 |  0.28 |  1    |

## Known gaps (fix before the final run)
- Champion damage: Leaguepedia from mid-2020, Oracle's Elixir (downloaded on ay's PC) fills 2014-2020 by player, league and year. Still missing: 2011-2013, most of Korea 2014 and some LPL rows (name mismatches); those games use gold or CS share alone for Carry.
- Laning numbers (gold and CS difference at 15) are in the Oracle's Elixir file for 2014-2020 but not used: Leaguepedia has none, so a laning category would only cover part of history.
- Finals MVP and event MVP awards are not counted yet (Liquipedia list to build, as in the Valorant data).
- Season 1 and 2 (2011-2012) have thin data and are discounted; LMS is the only minor region included.
- Region strength comes from cross-region games at Worlds, MSI, First Stand and the 2020 Mid-Season Cup.
