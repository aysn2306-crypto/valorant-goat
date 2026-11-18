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
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 94.6 | 100.0% | 0.0% |
| 2 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 84.4 | 0.0% | 86.4% |
| 3 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 84.1 | 0.0% | 13.6% |
| 4 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 83.2 | 0.0% | 0.0% |
| 5 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 81.4 | 0.0% | 0.0% |
| 6 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 80.4 | 0.0% | 0.0% |
| 7 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 78.7 | 0.0% | 0.0% |
| 8 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 78.5 | 0.0% | 0.0% |
| 9 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 77.0 | 0.0% | 0.0% |
| 10 | TheShy | Top | LPL | 2017-2026 | 1 | 0 | 1 | 0 | 76.4 | 0.0% | 0.0% |
| 11 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 75.5 | 0.0% | 0.0% |
| 12 | BeryL | Support | LCK | 2019-2025 | 2 | 0 | 3 | 0 | 75.5 | 0.0% | 0.0% |
| 13 | Peanut | Jungle | LCK/LPL | 2015-2025 | 0 | 1 | 8 | 0 | 75.1 | 0.0% | 0.0% |
| 14 | Caps | Mid | LEC | 2017-2026 | 0 | 1 | 18 | 1 | 75.0 | 0.0% | 0.0% |
| 15 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 74.2 | 0.0% | 0.0% |

Benchmark: Faker score 94.6, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 98, peak 94, winning 100, longevity 97, carry 94, clean_play 92, consistency 84, laning 97, killing 96, teamfight 68, vision 91, team_carry 69, solo_carry 73, recognition 95, team_lift 48, clutch 94, title_teams 99, individual 96, big_stage_clutch 99, carry_pillar 75, intangibles 76

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 2 | 84.4 | 1 | 643 | 100 | 100 (2026) |
| Viper | 7 | 78.7 | 2 | 469 | 97 | 95 (2024) |
| Bin | 6 | 80.4 | 1 | 576 | 99 | 89 (2020) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Knight first, Kanavi next
- trophy weight 12%: Faker first, Knight next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1396 pts (6 Worlds, 2 MSI, 10 domestic)
2. Ruler: 683 pts (1 Worlds, 2 MSI, 6 domestic)
3. Canyon: 652 pts (1 Worlds, 2 MSI, 7 domestic)
4. Keria: 648 pts (3 Worlds, 0 MSI, 1 domestic)
5. Gumayusi: 640 pts (3 Worlds, 1 MSI, 1 domestic)

## Side-board: Most Dominant (individual categories only)

1. Knight (Mid, 1102 games, peak 2026): 98.3
2. Kanavi (Jungle, 837 games, peak 2022): 98.3
3. TheShy (Top, 733 games, peak 2019): 97.4
4. Ruler (Bot, 1177 games, peak 2020): 96.8
5. Bjergsen (Mid, 712 games, peak 2016): 95.4

## Every category top 5 (Faker included)

**trophies**: Faker 100, Ruler 50, Keria 49, Canyon 48, Knight 47

**big_stage**: Keria 100, Knight 100, Uzi 100, Zeus 99, Bin 99

**peak**: Knight 100, Lehends 100, Keria 100, Smeb 99, Nuguri 99

**winning**: Chovy 100, Faker 100, Canyon 100, Ruler 99, Peanut 99

**longevity**: Knight 100, Chovy 100, Keria 100, Kanavi 99, Ruler 99

**carry**: Kanavi 100, Chovy 100, Uzi 100, Huni 99, Nuguri 99

**clean_play**: Chovy 100, ShowMaker 100, Knight 100, Rekkles 99, Bdd 99

**consistency**: Chovy 100, Knight 100, Viper 100, Nuguri 99, Kiin 99

**laning**: TheShy 100, SofM 100, Knight 100, Chovy 99, Bin 99

**killing**: TheShy 100, Knight 100, Kanavi 100, Uzi 99, Rookie 99

**teamfight**: Elk 100, Uzi 100, Doinb 100, Knight 99, Froggen 99

**vision**: Chovy 100, Doinb 100, Rookie 100, Baolan 99, Deft 99

**team_carry**: Froggen 100, PowerOfEvil 100, Flandre 100, Junhao 99, Max 99

**solo_carry**: Uzi 100, Zero 100, Smeb 100, Bjergsen 99, Spirit 99

**recognition**: Chovy 100, Keria 100, Canyon 100, Caps 99, Rekkles 99

**team_lift**: DanDy 100, MMD 100, Ambition 100, Dhokla 99, Zest 99

**clutch**: Wolf 100, Zeka 100, Bengi 100, Biofrost 99, Blank 99

**title_teams**: Peanut 100, Impact 100, Mata 100, Faker 99, Deft 99

**individual**: Knight 100, Chovy 100, Keria 100, Kanavi 99, Ruler 99

**big_stage_clutch**: Bin 100, Zeus 100, Knight 100, Zeka 99, Gumayusi 99

**carry_pillar**: Bjergsen 100, Froggen 100, Uzi 100, Upset 99, Ssumday 99

**intangibles**: Chovy 100, Inspired 100, Caliste 100, CoreJJ 99, Doinb 99

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.03, LaMiaZeaLoT 1.01, Cyanide 1.01, Mellisan 1.00, XPeke 0.97
- Worlds Season 2 Taipei Assassins: Toyz 1.04, BeBe 1.02, Stanley 1.01, MiSTakE 0.98, Lilballz 0.96
- Worlds Season 3 SK Telecom T1: Piglet 1.10, Bengi 1.01, Faker 0.97, Impact 0.96, PoohManDu 0.96
- Worlds 2014 Samsung White: Looper 1.06, DanDy 1.05, PawN 1.01, Imp 0.94, Mata 0.94
- Worlds 2015 SK Telecom T1: MaRin 1.06, Bang 1.04, Faker 1.01, Wolf 0.96, Bengi 0.93
- Worlds 2016 SK Telecom T1: Wolf 1.05, Faker 1.04, Bang 1.02, Bengi 0.99, Blank 0.98, Duke 0.94
- Worlds 2017 Samsung Galaxy: CuVee 1.07, Ruler 1.02, CoreJJ 1.01, Ambition 0.97, Crown 0.93
- Worlds 2018 Invictus Gaming: Rookie 1.04, TheShy 1.02, Baolan 0.99, Ning 0.98, JackeyLove 0.96
- Worlds 2019 FunPlus Phoenix: Tian 1.06, Crisp 1.03, Lwx 1.01, Doinb 0.99, GimGoon 0.91
- Worlds 2020 DAMWON Gaming: Canyon 1.12, Ghost 1.00, Nuguri 0.98, BeryL 0.97, ShowMaker 0.94
- Worlds 2021 EDward Gaming: Meiko 1.06, Flandre 1.03, Scout 0.99, Viper 0.98, Jiejie 0.94
- Worlds 2022 DRX: BeryL 1.07, Pyosik 1.02, Zeka 0.99, Kingen 0.98, Deft 0.94
- Worlds 2023 T1: Zeus 1.09, Keria 1.06, Oner 0.96, Faker 0.95, Gumayusi 0.94
- Worlds 2024 T1: Keria 1.02, Oner 1.02, Zeus 1.01, Gumayusi 1.01, Faker 0.94
- Worlds 2025 T1: Keria 1.06, Oner 1.01, Faker 1.01, Gumayusi 0.98, Doran 0.94
- Worlds 2026 Bilibili Gaming: Knight 1.11, Xun 1.00, Bin 0.98, Viper 0.97, ON 0.94

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
