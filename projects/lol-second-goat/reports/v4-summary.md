# League model v4: validation, categories, top 10, movers

Who is the greatest League player after Faker. Data: Leaguepedia scoreboards and awards, Oracle's Elixir laning stats, Liquipedia MVPs. Pool: players with 150+ games.

## Is it tested?

Yes. The season rating was fitted on seasons up to 2021 and then tested on 2022 to 2026, which it never saw. The test asks: in each league split, does the model's best player in each role match the voters' first-team All-Pro pick?

| Model (held-out 2022-2026) | First-team pick matched | Any All-Pro overlap | MVP in model's top 3 |
|---|---|---|---|
| Win rate only | 57.5% | 72.1% | 31.2% |
| Old v3 formula | 37.6% | 60.8% | 43.8% |
| Old v3 plus win rate | 49.5% | 71.9% | 56.2% |
| v4 fitted rating (used) | 62.9% | 74.7% | 43.8% |
| v4 ridge variant | 57.0% | 74.0% | 50.0% |

Picking at random would match 11.5% of the time. At career level, the model's order agrees with how often players got votes (Spearman 0.63 for players with 6+ voted splits, 0.72 for 10+), with the vote category itself left out so it isn't marking its own homework.

## Blind spots

- Shotcalling, comms and leadership are not in any public dataset. The two intangible categories (votes, team lift) are labelled proxies with 6% weight together.
- Laning stats (gold, CS and XP lead at 15) are missing for 2021 to 2026 until the Oracle's Elixir file on ay's PC is pushed, so the laning board leans toward older players right now.
- All-Pro votes only exist for LCK and LPL from 2020, so the vote proxy gives uncovered players the median.
- Junglers and supports who win through setup (Bengi is the example: #137) look ordinary in box scores.
- Region strength is estimated from international results, so a region with few international games has a wider error.

## Top 10

| # | Player | Role | Score | v3 rank |
|---|---|---|---|---|
| 1 | Faker | Mid | 94.1 | 1 |
| 2 | Knight | Mid | 87.4 | 3 |
| 3 | Keria | Support | 86.3 | 2 |
| 4 | Ruler | Bot | 85.5 | 4 |
| 5 | Chovy | Mid | 85.1 | 5 |
| 6 | Viper | Bot | 79.0 | 9 |
| 7 | Canyon | Jungle | 78.9 | 6 |
| 8 | Kanavi | Jungle | 78.2 | 15 |
| 9 | Zeus | Top | 77.9 | 10 |
| 10 | Meiko | Support | 77.8 | 14 |

In 1,000 runs with the category weights shaken up, Faker is #1 every time and Knight is #2 in 99.3% of them.

## Category top 5s

- **Trophies**: Faker, Keria, Ruler, Knight, Chovy
- **Big stage**: Keria, Uzi, Knight, Meiko, Zeus
- **Peak**: Knight, Lehends, Smeb, Nuguri, BeryL
- **Longevity**: Ruler, Knight, Kiin, Chovy, Scout
- **Winning**: Chovy, Faker, Canyon, Ruler, Peanut
- **Consistency**: Chovy, Knight, Kanavi, Viper, Froggen
- **Laning (2021-2026 missing)**: TheShy, SofM, Knight, Chovy, Bin
- **Killing**: TheShy, Knight, Kanavi, Uzi, Rookie
- **Teamfighting**: Elk, Uzi, Doinb, Knight, Froggen
- **Clean play**: Chovy, ShowMaker, Knight, Rekkles, Bdd
- **Team carry**: Knight, Froggen, Bjergsen, Kanavi, Uzi
- **Solo carry**: Uzi, Knight, Keria, Chovy, Huni
- **Vision (supports)**: Baolan, Meiko, Ming, Mata, Mikyx
- **Votes (proxy)**: Chovy, Keria, Canyon, Caps, Rekkles
- **Team lift (proxy)**: DanDy, MMD, Ambition, Dhokla, Zest

## Movers since v3

- Wolf: 22 to 103
- Caps: 89 to 17
- TheShy: 86 to 23
- JackeyLove: 85 to 35
- Karsa: 67 to 37
- Aiming: 35 to 62
- Gumayusi: 27 to 53
- Rookie: 39 to 16
- Huni: 55 to 34
- 369: 49 to 31
