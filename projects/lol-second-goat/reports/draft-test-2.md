# DRAFT TEST 2 (League, algorithm v3): not the final ranking

Data: Leaguepedia scoreboards, 303 tournaments, 25,987 games (approx.), 1,915 players; pool 527 players with 150+ games. Faker is ranked like everyone else (ay, 17 Nov).

## What changed since test 1
1. Early-era gap filled: team kills, gold and CS rebuilt from game-level scoreboards for 2011-2015, so every game since 2013 has kill participation and a resource share (CS share stands in where gold was not recorded).
2. Fairness rule: big-stage form, winning, carry and clean play use each player's best 5 calendar years, not the career average. Before, every year past a peak pulled the average down, so a 13-year career scored worse than a 6-year one on the same peak. Longevity is still its own category. With career averages Faker ranks #12.
3. Worlds, MSI and First Stand MVP / Finals MVP awards added from Liquipedia (25 awards, data/manual/mvps.csv): Worlds 15 points, MSI 8, First Stand 5, full value.
4. Longevity: an elite year is 20+ games at 0.2 SD above the role average (was 0.35, which almost nobody reached).

## Overall top 15 (everyone, Faker included)

| # | Player | Role | Regions | Years | Worlds | MSI | Domestic | MVPs | Score | #1 in 1000 runs | #2 in 1000 runs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Faker | Mid | LCK | 2013-2026 | 6 | 2 | 10 | 3 | 91.6 | 98.9% | 1.0% |
| 2 | Keria | Support | LCK | 2020-2026 | 3 | 0 | 1 | 0 | 87.4 | 1.1% | 98.9% |
| 3 | Ruler | Bot | LCK/LPL | 2016-2026 | 1 | 2 | 6 | 1 | 86.7 | 0.0% | 0.0% |
| 4 | Knight | Mid | LPL | 2018-2026 | 1 | 1 | 8 | 2 | 86.4 | 0.0% | 0.1% |
| 5 | Chovy | Mid | LCK | 2018-2026 | 0 | 2 | 7 | 1 | 83.2 | 0.0% | 0.0% |
| 6 | Canyon | Jungle | LCK | 2019-2026 | 1 | 2 | 7 | 1 | 81.3 | 0.0% | 0.0% |
| 7 | Oner | Jungle | LCK | 2021-2026 | 3 | 0 | 1 | 0 | 80.0 | 0.0% | 0.0% |
| 8 | Peanut | Jungle | LCK/LPL | 2015-2025 | 0 | 1 | 8 | 0 | 79.6 | 0.0% | 0.0% |
| 9 | Viper | Bot | LCK/LPL | 2018-2026 | 2 | 0 | 5 | 0 | 78.8 | 0.0% | 0.0% |
| 10 | Zeus | Top | LCK | 2021-2026 | 2 | 1 | 2 | 2 | 78.7 | 0.0% | 0.0% |
| 11 | Bang | Bot | LCK/LCS | 2012-2021 | 2 | 2 | 4 | 0 | 78.2 | 0.0% | 0.0% |
| 12 | Kiin | Top | LCK | 2017-2026 | 0 | 2 | 4 | 0 | 78.0 | 0.0% | 0.0% |
| 13 | Bin | Top | LPL | 2020-2026 | 1 | 1 | 6 | 0 | 77.1 | 0.0% | 0.0% |
| 14 | Wolf | Support | LCK | 2013-2018 | 2 | 2 | 4 | 1 | 76.6 | 0.0% | 0.0% |
| 15 | Kanavi | Jungle | LCK/LPL | 2019-2026 | 0 | 2 | 5 | 0 | 76.3 | 0.0% | 0.0% |

Benchmark: Faker score 91.6, 6 Worlds, 2 MSI, 10 domestic; category scores: trophies 100, big_stage 85, peak 87, winning 100, longevity 94, carry 93, clean_play 92, consistency 64

## Players ay named

| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |
|---|---|---|---|---|---|---|
| Knight | 4 | 86.4 | 1 | 653 | 99 | 100 (2026) |
| Viper | 9 | 78.8 | 2 | 391 | 95 | 95 (2024) |
| Bin | 13 | 77.1 | 1 | 541 | 94 | 81 (2024) |

## Tipping point (trophy weight -> #1 overall, then #2)

- trophy weight 0%: Knight first, Chovy next
- trophy weight 12%: Keria first, Knight next
- trophy weight 22%: Faker first, Keria next

## Side-board: Most Decorated (pure trophy points, no carry share)

1. Faker: 1382 pts (6 Worlds, 2 MSI, 10 domestic)
2. Ruler: 650 pts (1 Worlds, 2 MSI, 6 domestic)
3. Gumayusi: 630 pts (3 Worlds, 1 MSI, 1 domestic)
4. Keria: 620 pts (3 Worlds, 0 MSI, 1 domestic)
5. Oner: 606 pts (3 Worlds, 0 MSI, 1 domestic)

## Side-board: Most Dominant (individual categories only)

1. Chovy (Mid, 1018 games, peak 2024): 99.6
2. Knight (Mid, 1102 games, peak 2026): 99.4
3. Keria (Support, 995 games, peak 2024): 98.6
4. Ruler (Bot, 1177 games, peak 2019): 98.3
5. Kiin (Top, 1039 games, peak 2026): 97.2

## Every category top 5 (Faker included)

**trophies**: Faker 100, Keria 58, Ruler 56, Knight 53, Oner 49

**big_stage**: Piglet 100, Keria 100, Ben 100, Knight 99, Ruler 99

**peak**: Knight 100, Bdd 100, Chovy 100, Tarzan 99, Canna 99

**winning**: Chovy 100, Faker 100, Canyon 100, Ruler 99, Peanut 99

**longevity**: Ruler 100, Knight 100, Chovy 100, Viper 99, Keria 99

**carry**: Kanavi 100, Uzi 100, Chovy 100, Nuguri 99, Xiye 99

**clean_play**: Chovy 100, ShowMaker 100, Knight 100, Rekkles 99, Bdd 99

**consistency**: Chovy 100, Viper 100, Aiming 100, Knight 99, Ruler 99

## Worlds title carry shares (credit 0.5 to 1.5)

- Worlds Season 1 Fnatic: Shushei 1.12, Mellisan 1.06, LaMiaZeaLoT 1.00, Cyanide 0.99, XPeke 0.85
- Worlds Season 2 Taipei Assassins: Toyz 1.18, Stanley 1.10, BeBe 1.01, Lilballz 0.90, MiSTakE 0.81
- Worlds Season 3 SK Telecom T1: Piglet 1.23, Bengi 1.07, Impact 0.94, Faker 0.93, PoohManDu 0.83
- Worlds 2014 Samsung White: Mata 1.23, DanDy 1.10, Looper 1.04, PawN 0.93, Imp 0.70
- Worlds 2015 SK Telecom T1: Bang 1.26, Wolf 1.05, Faker 0.94, MaRin 0.88, Bengi 0.88
- Worlds 2016 SK Telecom T1: Wolf 1.09, Bang 1.08, Bengi 1.01, Blank 1.01, Faker 0.91, Duke 0.90
- Worlds 2017 Samsung Galaxy: CoreJJ 1.29, Ruler 1.05, CuVee 0.99, Ambition 0.86, Crown 0.82
- Worlds 2018 Invictus Gaming: Ning 1.08, Baolan 1.01, Rookie 1.01, TheShy 1.01, JackeyLove 0.89
- Worlds 2019 FunPlus Phoenix: Doinb 1.11, Crisp 1.09, Tian 1.08, Lwx 0.92, GimGoon 0.80
- Worlds 2020 DAMWON Gaming: Canyon 1.32, Nuguri 1.06, Ghost 0.96, ShowMaker 0.86, BeryL 0.81
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
- Leaguepedia scoreboards have champion damage only from mid-2020, so Carry before 2020 is gold share alone. Oracle's Elixir has damage from 2014 but is blocked from the cloud (Cloudflare); it can be downloaded on ay's PC.
- No laning numbers (gold or CS difference at 15 minutes) in Leaguepedia scoreboards; same fix.
- Finals MVP and event MVP awards are not counted yet (Liquipedia list to build, as in the Valorant data).
- Season 1 and 2 (2011-2012) have thin data and are discounted; LMS is the only minor region included.
- Region strength comes from cross-region games at Worlds, MSI, First Stand and the 2020 Mid-Season Cup.
