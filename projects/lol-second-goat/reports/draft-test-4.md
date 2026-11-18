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
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 84.3 | 100.0% | 0.0% |
| 2 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 74.9 | 0.0% | 97.5% |
| 3 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 73.3 | 0.0% | 2.5% |
| 4 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 72.4 | 0.0% | 0.0% |
| 5 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 67.5 | 0.0% | 0.0% |
| 6 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 66.3 | 0.0% | 0.0% |
| 7 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 63.5 | 0.0% | 0.0% |
| 8 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 62.2 | 0.0% | 0.0% |
| 9 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 61.8 | 0.0% | 0.0% |
| 10 | Caps | Mid | LEC | 2017-2026 | 0 | 1 | 18 | 1 | 61.1 | 0.0% | 0.0% |
| 11 | Oner | Jungle | LCK | 2021-2026 | 3 | 0 | 1 | 0 | 60.8 | 0.0% | 0.0% |
| 12 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 60.3 | 0.0% | 0.0% |
| 13 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 59.9 | 0.0% | 0.0% |
| 14 | Gumayusi | Bot | LCK | 2021-2026 | 3 | 1 | 1 | 1 | 59.3 | 0.0% | 0.0% |
| 15 | Peanut | Jungle | LCK/LPL | 2015-2025 | 0 | 1 | 8 | 0 | 58.2 | 0.0% | 0.0% |

Benchmark: Faker score 84.3, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 77, peak 76, winning 99, longevity 79, carry 79, clean_play 70, consistency 78, laning 74, killing 90, teamfight 64, vision 72, team_carry 63, solo_carry 75, recognition 70, team_lift 50, clutch 76, title_teams 60, individual 78, big_stage_clutch 80, carry_pillar 73, intangibles 60

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 2 | 74.9 | 1 | 507 | 95 | 100 (2026) |
| Viper | 8 | 62.2 | 2 | 399 | 79 | 73 (2026) |
| Bin | 7 | 63.5 | 1 | 421 | 83 | 83 (2026) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Chovy first, Knight next
- trophy weight 16%: Knight first, Chovy next
- trophy weight 22%: Faker first, Knight next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1167 pts (6 Worlds, 2 MSI, 10 domestic)
2. Gumayusi: 515 pts (3 Worlds, 1 MSI, 1 domestic)
3. Ruler: 511 pts (1 Worlds, 2 MSI, 6 domestic)
4. Canyon: 507 pts (1 Worlds, 2 MSI, 7 domestic)
5. Knight: 489 pts (1 Worlds, 1 MSI, 8 domestic)

## Side-board: Most Dominant (individual categories only)

1. Chovy (Mid, 1018 games, peak 2025): 90.2
2. Knight (Mid, 1102 games, peak 2026): 89.1
3. Keria (Support, 995 games, peak 2024): 87.2
4. Zeus (Top, 744 games, peak 2025): 83.4
5. Kiin (Top, 1039 games, peak 2026): 79.6

## Every category top 5 (Faker included)

**trophies**: Faker 100, Ruler 45, Gumayusi 44, Canyon 44, Knight 44

**big_stage**: Keria 100, Zeus 99, Knight 95, Chovy 88, Bin 83

**peak**: Knight 100, Chovy 97, Kiin 94, Keria 91, Zeus 91

**winning**: Chovy 100, Faker 99, Canyon 99, Ruler 97, Peanut 92

**longevity**: Knight 100, Chovy 100, Keria 86, Kiin 81, Ruler 79

**carry**: Chovy 100, Kanavi 97, Uzi 96, Knight 90, TheShy 89

**clean_play**: Chovy 100, Knight 98, Kiin 92, Ruler 92, Canyon 92

**consistency**: Viper 100, Knight 99, Chovy 98, Keria 98, Zeus 96

**laning**: Chovy 100, 1xn 89, TheShy 89, Knight 88, Kiin 85

**killing**: Knight 100, TheShy 99, Kanavi 98, Chovy 96, Rookie 93

**teamfight**: Elk 100, Flandre 98, Lava 96, Doinb 96, Knight 96

**vision**: Chovy 100, Doinb 87, Viper 85, Deft 85, Rookie 82

**team_carry**: Froggen 100, DuDu 96, Max 94, Cabochard 92, Flandre 90

**solo_carry**: Bjergsen 100, BeryL 92, Hauntzer 91, Chovy 89, Smeb 79

**recognition**: Chovy 100, Keria 87, Canyon 85, Caps 84, Rekkles 83

**team_lift**: DanDy 100, MMD 100, Ambition 95, Dhokla 93, Zest 89

**clutch**: Wolf 100, Zeka 96, Bengi 95, Biofrost 92, Blank 92

**title_teams**: Peanut 100, Deft 90, Mata 90, Knight 80, Viper 80

**individual**: Chovy 100, Knight 99, Keria 96, Zeus 90, Kanavi 88

**big_stage_clutch**: Zeus 100, Knight 95, Keria 93, Bin 91, Gumayusi 89

**carry_pillar**: Bjergsen 100, Chovy 90, Hauntzer 87, Froggen 86, BeryL 84

**intangibles**: Chovy 100, Caliste 88, Inspired 88, Khan 83, CoreJJ 83

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.03, LaMiaZeaLoT 1.01, Cyanide 1.01, Mellisan 0.99, XPeke 0.98
- Worlds Season 2 Taipei Assassins: BeBe 1.02, Toyz 1.01, Stanley 1.01, Lilballz 0.99, MiSTakE 0.97
- Worlds Season 3 SK Telecom T1: Piglet 1.03, Bengi 1.00, Impact 1.00, PoohManDu 0.98, Faker 0.98
- Worlds 2014 Samsung White: Looper 1.02, DanDy 1.01, Mata 1.00, PawN 1.00, Imp 0.97
- Worlds 2015 SK Telecom T1: MaRin 1.03, Faker 1.02, Bang 1.01, Bengi 0.97, Wolf 0.97
- Worlds 2016 SK Telecom T1: Bang 1.03, Wolf 1.02, Faker 1.02, Blank 0.99, Bengi 0.99, Duke 0.96
- Worlds 2017 Samsung Galaxy: CuVee 1.05, Ruler 1.01, CoreJJ 1.00, Ambition 0.99, Crown 0.95
- Worlds 2018 Invictus Gaming: Rookie 1.04, TheShy 1.03, Baolan 1.00, JackeyLove 0.97, Ning 0.96
- Worlds 2019 FunPlus Phoenix: Tian 1.03, Doinb 1.02, Crisp 1.01, Lwx 1.01, GimGoon 0.93
- Worlds 2020 DAMWON Gaming: Canyon 1.07, Ghost 1.02, Nuguri 1.01, BeryL 0.97, ShowMaker 0.94
- Worlds 2021 EDward Gaming: Flandre 1.01, Jiejie 1.00, Viper 1.00, Scout 1.00, Meiko 0.99
- Worlds 2022 DRX: BeryL 1.03, Zeka 1.00, Kingen 1.00, Deft 0.99, Pyosik 0.98
- Worlds 2023 T1: Zeus 1.06, Keria 1.05, Oner 0.97, Faker 0.96, Gumayusi 0.96
- Worlds 2024 T1: Oner 1.04, Gumayusi 1.02, Zeus 1.01, Keria 1.00, Faker 0.93
- Worlds 2025 T1: Keria 1.03, Faker 1.01, Gumayusi 1.00, Oner 0.98, Doran 0.98
- Worlds 2026 Bilibili Gaming: Knight 1.06, Xun 1.03, Bin 0.99, Viper 0.98, ON 0.94

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
