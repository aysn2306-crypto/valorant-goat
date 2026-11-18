# DRAFT TEST 4 (League, algorithm v3): not the final ranking

Data: Leaguepedia scoreboards, 303 tournaments, 25,987 games (approx.), 1,915 players; pool 527 players with 150+ games. Faker is ranked like everyone else (ay, 17 Nov).

## What changed since test 1
1. Early-era gap filled: team kills, gold and CS rebuilt from game-level scoreboards for 2011-2015, so every game since 2013 has kill participation and a resource share (CS share stands in where gold was not recorded).
2. Fairness rule: big-stage form, winning, carry and clean play use each player's best 5 calendar years, not the career average. Before, every year past a peak pulled the average down, so a 13-year career scored worse than a 6-year one on the same peak. Longevity is still its own category. With career averages Faker ranks #12.
3. Worlds, MSI and First Stand MVP / Finals MVP awards added from Liquipedia (25 awards, data/manual/mvps.csv): Worlds 15 points, MSI 8, First Stand 5, full value.
6. Placings count, not just wins: Worlds runner-up 60, semifinal 35, quarterfinal 15, last 16 5; MSI 30 / 18 / 8; First Stand 15 / 9 / 4; domestic final 10, semifinal 5 (times region strength).
5. Damage per minute for 2014-2020 filled from Oracle's Elixir (6,222 of 8,065 player-event rows that had none).
4. Longevity: an elite year is 20+ games at 0.2 SD above the role average (was 0.35, which almost nobody reached).

## Overall top 15 (everyone, Faker included)

| # | Player | Role | Regions | Years | Worlds | MSI | Domestic | MVPs | Score | #1 in 1000 runs | #2 in 1000 runs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 94.1 | 100.0% | 0.0% |
| 2 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 87.4 | 0.0% | 99.3% |
| 3 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 86.3 | 0.0% | 0.7% |
| 4 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 85.5 | 0.0% | 0.0% |
| 5 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 85.1 | 0.0% | 0.0% |
| 6 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 79.0 | 0.0% | 0.0% |
| 7 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 78.9 | 0.0% | 0.0% |
| 8 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 78.2 | 0.0% | 0.0% |
| 9 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 77.9 | 0.0% | 0.0% |
| 10 | Meiko | Support | LPL | 2015-2026 | 1 | 1 | 4 | 0 | 77.8 | 0.0% | 0.0% |
| 11 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 77.6 | 0.0% | 0.0% |
| 12 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 77.1 | 0.0% | 0.0% |
| 13 | Peanut | Jungle | LCK/LPL | 2015-2025 | 0 | 1 | 8 | 0 | 76.1 | 0.0% | 0.0% |
| 14 | Uzi | Bot | LPL | 2013-2023 | 0 | 1 | 2 | 1 | 75.5 | 0.0% | 0.0% |
| 15 | Khan | Top | LCK/LPL | 2014-2021 | 0 | 0 | 6 | 0 | 75.2 | 0.0% | 0.0% |

Benchmark: Faker score 94.1, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 98, peak 96, winning 100, longevity 98, carry 94, clean_play 92, consistency 75, laning 97, killing 96, teamfight 68, vision 91, team_carry 83, solo_carry 98, recognition 95, team_lift 48

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 2 | 87.4 | 1 | 725 | 100 | 100 (2026) |
| Viper | 6 | 79.0 | 2 | 451 | 97 | 93 (2024) |
| Bin | 11 | 77.6 | 1 | 592 | 98 | 89 (2020) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Knight first, Chovy next
- trophy weight 16%: Faker first, Knight next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1395 pts (6 Worlds, 2 MSI, 10 domestic)
2. Ruler: 670 pts (1 Worlds, 2 MSI, 6 domestic)
3. Keria: 648 pts (3 Worlds, 0 MSI, 1 domestic)
4. Gumayusi: 635 pts (3 Worlds, 1 MSI, 1 domestic)
5. Canyon: 635 pts (1 Worlds, 2 MSI, 7 domestic)

## Side-board: Most Dominant (individual categories only)

1. Knight (Mid, 1102 games, peak 2026): 99.7
2. Chovy (Mid, 1018 games, peak 2024): 98.4
3. Ruler (Bot, 1177 games, peak 2020): 96.4
4. Kanavi (Jungle, 837 games, peak 2022): 96.0
5. Viper (Bot, 1041 games, peak 2024): 96.0

## Every category top 5 (Faker included)

**trophies**: Faker 100, Keria 64, Ruler 57, Knight 57, Chovy 50

**big_stage**: Keria 100, Uzi 100, Knight 100, Meiko 99, Zeus 99

**peak**: Knight 100, Lehends 100, Smeb 100, Nuguri 99, BeryL 99

**winning**: Chovy 100, Faker 100, Canyon 100, Ruler 99, Peanut 99

**longevity**: Ruler 100, Knight 100, Kiin 100, Chovy 99, Scout 99

**carry**: Kanavi 100, Chovy 100, Uzi 100, Huni 99, Nuguri 99

**clean_play**: Chovy 100, ShowMaker 100, Knight 100, Rekkles 99, Bdd 99

**consistency**: Chovy 100, Knight 100, Kanavi 100, Viper 99, Froggen 99

**laning**: TheShy 100, SofM 100, Knight 100, Chovy 99, Bin 99

**killing**: TheShy 100, Knight 100, Kanavi 100, Uzi 99, Rookie 99

**teamfight**: Elk 100, Uzi 100, Doinb 100, Knight 99, Froggen 99

**vision**: Chovy 100, Doinb 100, Rookie 100, Baolan 99, Deft 99

**team_carry**: Knight 100, Froggen 100, Bjergsen 100, Kanavi 99, Uzi 99

**solo_carry**: Uzi 100, Knight 100, Keria 100, Chovy 99, Huni 99

**recognition**: Chovy 100, Keria 100, Canyon 100, Caps 99, Rekkles 99

**team_lift**: DanDy 100, MMD 100, Ambition 100, Dhokla 99, Zest 99

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.17, LaMiaZeaLoT 1.07, Cyanide 1.05, Mellisan 0.97, XPeke 0.78
- Worlds Season 2 Taipei Assassins: Toyz 1.24, BeBe 1.12, Stanley 1.04, MiSTakE 0.86, Lilballz 0.74
- Worlds Season 3 SK Telecom T1: Piglet 1.50, Bengi 1.05, Faker 0.85, Impact 0.79, PoohManDu 0.76
- Worlds 2014 Samsung White: Looper 1.37, DanDy 1.30, PawN 1.04, Imp 0.66, Mata 0.63
- Worlds 2015 SK Telecom T1: MaRin 1.35, Bang 1.24, Faker 1.06, Wolf 0.76, Bengi 0.59
- Worlds 2016 SK Telecom T1: Wolf 1.26, Faker 1.21, Bang 1.14, Bengi 0.91, Blank 0.87, Duke 0.68
- Worlds 2017 Samsung Galaxy: CuVee 1.43, Ruler 1.12, CoreJJ 1.06, Ambition 0.80, Crown 0.59
- Worlds 2018 Invictus Gaming: Rookie 1.21, TheShy 1.15, Baolan 0.95, Ning 0.89, JackeyLove 0.79
- Worlds 2019 FunPlus Phoenix: Tian 1.33, Crisp 1.19, Lwx 1.03, Doinb 0.95, GimGoon 0.50
- Worlds 2020 DAMWON Gaming: Canyon 1.50, Ghost 0.99, Nuguri 0.90, BeryL 0.81, ShowMaker 0.63
- Worlds 2021 EDward Gaming: Meiko 1.34, Flandre 1.16, Scout 0.96, Viper 0.88, Jiejie 0.66
- Worlds 2022 DRX: BeryL 1.39, Pyosik 1.12, Zeka 0.95, Kingen 0.88, Deft 0.66
- Worlds 2023 T1: Zeus 1.50, Keria 1.35, Oner 0.76, Faker 0.69, Gumayusi 0.65
- Worlds 2024 T1: Keria 1.11, Oner 1.09, Zeus 1.08, Gumayusi 1.06, Faker 0.66
- Worlds 2025 T1: Keria 1.36, Oner 1.06, Faker 1.05, Gumayusi 0.88, Doran 0.65
- Worlds 2026 Bilibili Gaming: Knight 1.50, Xun 1.02, Bin 0.89, Viper 0.83, ON 0.64

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
