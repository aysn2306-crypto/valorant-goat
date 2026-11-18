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
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 82.1 | 63.5% | 36.4% |
| 2 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 80.7 | 36.5% | 63.5% |
| 3 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 76.1 | 0.0% | 0.0% |
| 4 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 75.7 | 0.0% | 0.1% |
| 5 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 71.2 | 0.0% | 0.0% |
| 6 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 69.2 | 0.0% | 0.0% |
| 7 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 67.0 | 0.0% | 0.0% |
| 8 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 66.7 | 0.0% | 0.0% |
| 9 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 66.7 | 0.0% | 0.0% |
| 10 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 65.6 | 0.0% | 0.0% |
| 11 | Uzi | Bot | LPL | 2013-2023 | 0 | 1 | 2 | 1 | 64.6 | 0.0% | 0.0% |
| 12 | Oner | Jungle | LCK | 2021-2026 | 3 | 0 | 1 | 0 | 64.4 | 0.0% | 0.0% |
| 13 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 62.6 | 0.0% | 0.0% |
| 14 | Meiko | Support | LPL | 2015-2026 | 1 | 1 | 4 | 0 | 62.2 | 0.0% | 0.0% |
| 15 | TheShy | Top | LPL | 2017-2026 | 1 | 0 | 1 | 0 | 62.0 | 0.0% | 0.0% |

Benchmark: Faker score 82.1, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 74, peak 81, winning 99, longevity 68, carry 79, clean_play 70, consistency 73, laning 75, killing 90, teamfight 64, vision 72, team_carry 62, solo_carry 53, recognition 70, team_lift 50, clutch 76, title_teams 90, individual 80, big_stage_clutch 83, carry_pillar 59, intangibles 60

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 2 | 80.7 | 1 | 641 | 88 | 100 (2026) |
| Viper | 8 | 66.7 | 2 | 473 | 79 | 76 (2022) |
| Bin | 6 | 69.2 | 1 | 577 | 83 | 75 (2020) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Knight first, Chovy next
- trophy weight 28%: Faker first, Knight next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1396 pts (6 Worlds, 2 MSI, 10 domestic)
2. Ruler: 683 pts (1 Worlds, 2 MSI, 6 domestic)
3. Canyon: 652 pts (1 Worlds, 2 MSI, 7 domestic)
4. Keria: 648 pts (3 Worlds, 0 MSI, 1 domestic)
5. Gumayusi: 640 pts (3 Worlds, 1 MSI, 1 domestic)

## Side-board: Most Dominant (individual categories only)

1. Knight (Mid, 1102 games, peak 2026): 91.3
2. Uzi (Bot, 645 games, peak 2018): 86.0
3. Keria (Support, 995 games, peak 2024): 85.0
4. Chovy (Mid, 1018 games, peak 2025): 84.8
5. Bin (Top, 937 games, peak 2020): 83.5

## Every category top 5 (Faker included)

**trophies**: Faker 100, Ruler 50, Keria 49, Canyon 48, Knight 47

**big_stage**: Keria 100, Zeus 89, Knight 88, Bin 83, Chovy 82

**peak**: Knight 100, Lehends 96, Kanavi 93, SofM 91, Tarzan 91

**winning**: Chovy 100, Faker 99, Canyon 99, Ruler 97, Peanut 92

**longevity**: Knight 100, Chovy 93, Keria 80, Ruler 79, Kanavi 78

**carry**: Chovy 100, Kanavi 97, Uzi 96, Knight 90, TheShy 89

**clean_play**: Chovy 100, Knight 98, Kiin 92, Ruler 92, Canyon 92

**consistency**: Chovy 100, Knight 98, Viper 97, Uzi 93, Nuguri 93

**laning**: TheShy 100, SofM 86, Knight 83, Bin 81, Nuguri 81

**killing**: Knight 100, TheShy 99, Kanavi 98, Chovy 96, Rookie 93

**teamfight**: Elk 100, Flandre 98, Lava 96, Doinb 96, Knight 96

**vision**: Chovy 100, Doinb 87, Deft 85, Viper 85, Rookie 82

**team_carry**: Froggen 100, PowerOfEvil 94, Max 92, Cabochard 90, Flandre 90

**solo_carry**: Uzi 100, Smeb 93, Bin 92, Bjergsen 90, Chovy 82

**recognition**: Chovy 100, Keria 87, Canyon 85, Caps 84, Rekkles 83

**team_lift**: DanDy 100, MMD 100, Ambition 95, Dhokla 93, Zest 89

**clutch**: Wolf 100, Zeka 96, Bengi 95, Biofrost 92, Blank 92

**title_teams**: Peanut 100, Impact 100, Mata 100, Faker 90, Deft 90

**individual**: Knight 100, Chovy 95, Keria 92, Kanavi 89, Uzi 85

**big_stage_clutch**: Zeus 100, Keria 100, Bin 98, Knight 97, Zeka 92

**carry_pillar**: Uzi 100, Bjergsen 98, Froggen 95, PowerOfEvil 92, Upset 88

**intangibles**: Chovy 100, Caliste 88, Inspired 88, Khan 83, CoreJJ 83

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.03, LaMiaZeaLoT 1.01, Cyanide 1.01, Mellisan 1.00, XPeke 0.97
- Worlds Season 2 Taipei Assassins: Toyz 1.03, Stanley 1.02, BeBe 1.01, Lilballz 0.97, MiSTakE 0.97
- Worlds Season 3 SK Telecom T1: Piglet 1.06, Bengi 1.00, Impact 0.99, Faker 0.97, PoohManDu 0.97
- Worlds 2014 Samsung White: Mata 1.01, Looper 1.01, DanDy 1.01, PawN 1.00, Imp 0.97
- Worlds 2015 SK Telecom T1: MaRin 1.03, Bang 1.03, Faker 1.01, Wolf 0.97, Bengi 0.96
- Worlds 2016 SK Telecom T1: Wolf 1.03, Bang 1.02, Faker 1.02, Bengi 0.99, Blank 0.99, Duke 0.96
- Worlds 2017 Samsung Galaxy: CuVee 1.05, CoreJJ 1.02, Ruler 1.01, Ambition 0.98, Crown 0.94
- Worlds 2018 Invictus Gaming: Rookie 1.04, TheShy 1.03, Baolan 1.00, JackeyLove 0.96, Ning 0.96
- Worlds 2019 FunPlus Phoenix: Tian 1.03, Doinb 1.02, Lwx 1.01, Crisp 1.00, GimGoon 0.94
- Worlds 2020 DAMWON Gaming: Canyon 1.08, Ghost 1.02, Nuguri 0.99, BeryL 0.97, ShowMaker 0.94
- Worlds 2021 EDward Gaming: Meiko 1.03, Flandre 1.02, Scout 1.00, Viper 0.99, Jiejie 0.96
- Worlds 2022 DRX: BeryL 1.06, Kingen 1.00, Zeka 1.00, Pyosik 0.98, Deft 0.97
- Worlds 2023 T1: Keria 1.07, Zeus 1.07, Faker 0.97, Gumayusi 0.95, Oner 0.95
- Worlds 2024 T1: Oner 1.05, Gumayusi 1.02, Keria 1.00, Zeus 1.00, Faker 0.93
- Worlds 2025 T1: Keria 1.07, Faker 1.00, Oner 1.00, Gumayusi 0.98, Doran 0.95
- Worlds 2026 Bilibili Gaming: Knight 1.09, Xun 1.01, Bin 0.99, Viper 0.98, ON 0.94

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
