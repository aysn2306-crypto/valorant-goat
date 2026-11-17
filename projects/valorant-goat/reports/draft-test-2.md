# DRAFT TEST 2 (algorithm v2 fixes): not the final ranking

Same data as test 1 (106 VCT events, 212-player pool). Only the scoring changed.

## What changed since test 1
1. **Trophies use real points.** The best trophy haul scores 100 and everyone else is scaled to it. Before, a percentile squashed big gaps: 3 titles vs 0 titles was 100 vs 89. Now it is 100 vs 52.
2. **Consistency needs a long career to score high.** Short careers are pulled to the pool average (3,000-round adjustment). The test 1 top 5 had 1,000-1,800 rounds each; the new top 5 has 4,700-7,900.
3. **Leadership only counts the events where the player was actually the caller**, and it needs 100+ matches before it counts in full.
4. **IGL tag by period.** Liquipedia only stores today's role, so a current IGL counts as IGL for their current team stint only, not their whole career. Earlier stints come from a sourced list (so far FNS at Envy/OpTic/NRG). The fragging "calling tax" (0.16 SD, measured) is now added back only for the share of rounds spent calling.
5. **MVPs: 12 sourced, up from 5.** Each one is tagged with its source in data/manual/mvps.csv. 6 Masters events had no official MVP (2021-22 Masters, Tokyo 2023, Shanghai 2024); media awards are not counted.
6. **ACS stand-in is flagged.** vlr.gg has no Rating at 17 events (Masters Shanghai 2024, China league, 2021 Stage 1). ACS stands in there, and every player with 20%+ of rounds affected is listed below.

## Overall top 10, before and after
| Player | Test 1 rank | v2 rank | Change |
|---|---|---|---|
| Chronicle | 5 | 1 | +4 |
| d4v41 | 7 | 2 | +5 |
| Alfajer | 2 | 3 | -1 |
| Derke | 9 | 4 | +5 |
| aspas | 3 | 5 | -2 |
| trent | 4 | 6 | -2 |
| Leo | 1 | 7 | -6 |
| something | 12 | 8 | +4 |
| Less | 10 | 9 | +1 |
| MaKo | 6 | 10 | -4 |
| nAts | 8 | 12 | -4 |

| # | Player | Role | Score | Intl titles | GOAT % (1000 runs) | Top-5 % |
|---|---|---|---|---|---|---|
| 1 | Chronicle | controller | 83.4 | 3 | 100% | 100% |
| 2 | d4v41 | sentinel (IGL) | 79.8 | 1 | 0% | 100% |
| 3 | Alfajer | sentinel | 76.5 | 2 | 0% | 100% |
| 4 | Derke | duelist | 76.2 | 2 | 0% | 93% |
| 5 | aspas | duelist | 75.3 | 1 | 0% | 96% |
| 6 | trent | initiator | 73.4 | 0 | 0% | 2% |
| 7 | Leo | initiator | 73.0 | 2 | 0% | 8% |
| 8 | something | duelist | 71.0 | 1 | 0% | 0% |
| 9 | Less | controller | 70.9 | 1 | 0% | 0% |
| 10 | MaKo | controller | 70.3 | 0 | 0% | 0% |

## Trophies Honours top 5

1. Chronicle (controller, 9494 rnds) 100.0
2. f0rsakeN (controller, 9441 rnds) 88.3
3. d4v41 (sentinel, 9421 rnds) 86.8
4. Derke (duelist, 8335 rnds) 79.5
5. Jinggg (duelist, 8202 rnds) 78.9

## Fragging top 5

1. Leo (initiator, 4332 rnds) 100.0
2. Alfajer (sentinel, 7012 rnds) 99.5
3. nAts (sentinel, 7906 rnds) 99.1
4. lukxo (sentinel, 1985 rnds) 98.6
5. RieNs (initiator, 5110 rnds) 98.1

## Big Game Form top 5

1. Demon1 (duelist, 3222 rnds) 100.0
2. yay (sentinel, 4506 rnds) 99.5
3. spike (duelist, 1860 rnds) 99.1
4. erde (controller, 1208 rnds) 98.6
5. Shao (initiator, 5846 rnds) 98.1

## Peak Longevity top 5

1. aspas (duelist, 7827 rnds) 100.0
2. MaKo (controller, 8733 rnds) 99.5
3. Chronicle (controller, 9494 rnds) 99.1
4. Less (controller, 6329 rnds) 98.6
5. nAts (sentinel, 7906 rnds) 98.1

## Opening Duels top 5

1. lukxo (sentinel, 1985 rnds) 100.0
2. yay (sentinel, 4506 rnds) 99.5
3. N4RRATE (initiator, 4033 rnds) 99.1
4. Alfajer (sentinel, 7012 rnds) 98.6
5. Neon (sentinel, 1504 rnds) 98.1

## Clutch Factor top 5

1. Shao (initiator, 5846 rnds) 100.0
2. BeYN (initiator, 4214 rnds) 99.5
3. trent (initiator, 7749 rnds) 99.1
4. Timotino (duelist, 1705 rnds) 98.6
5. marteen (duelist, 3370 rnds) 98.1

## Team Play top 5

1. Leo (initiator, 4332 rnds) 100.0
2. johnqt (sentinel, 5014 rnds) 99.5
3. MaKo (controller, 8733 rnds) 99.1
4. Neon (sentinel, 1504 rnds) 98.6
5. Asuna (duelist, 7016 rnds) 98.1

## Consistency top 5

1. Alfajer (sentinel, 7012 rnds) 100.0
2. t3xture (duelist, 7877 rnds) 99.5
3. Cryocells (sentinel, 6240 rnds) 99.1
4. Karon (controller, 4710 rnds) 98.6
5. zekken (duelist, 7340 rnds) 98.1

## Leadership top 5

1. xavi8k (controller, 1762 rnds) 100.0
2. erde (controller, 1208 rnds) 97.1
3. vora (initiator, 1705 rnds) 94.1
4. Lakia (initiator, 4258 rnds) 91.2
5. Jamppi (initiator, 7672 rnds) 88.2

# Things that look off / limits of this test

- vlr.gg has no Rating/KAST/clutch data at 17 events (Champions Tour 2024: China Kickoff, Champions Tour 2024: China Stage 1, Champions Tour 2024: China Stage 2, Champions Tour 2024: Masters Shanghai, Champions Tour Brazil Stage 1: Masters, Champions Tour CIS Stage 1: Masters, Champions Tour Europe Stage 1: Masters, Champions Tour Japan Stage 1: Masters, Champions Tour Korea Stage 1: Masters, Champions Tour LATAM Stage 1: Masters, Champions Tour North America Stage 1: Masters, Champions Tour SEA Stage 1: Masters, Champions Tour Turkey Stage 1: Masters, VCT 2025: China Kickoff, VCT 2025: China Stage 1, VCT 2025: China Stage 2, VCT 2026: China Stage 2); ACS stands in for Rating there, KAST and clutch just skip them.
- Agents with no role mapping (counted as flex): none
- MVP awards not matched to a pool player: none
- Players without a clean Liquipedia player page: FiNESSE, mindfreak, BABYBAY, AtaKaptan, MOJJ, Neon
- IGL periods: AYRIN (20% of rounds), BeYN (92% of rounds), BerLIN (22% of rounds), Biank (8% of rounds), Boaster (100% of rounds), Boo (89% of rounds), Boostio (42% of rounds), FiNESSE (100% of rounds), Francis (100% of rounds), Haodong (50% of rounds), Jamppi (25% of rounds), Lakia (69% of rounds), MAGNUM (8% of rounds), MrFaliN (64% of rounds), Munchkin (22% of rounds), Redgar (10% of rounds), SiuFatBB (24% of rounds), SugarZ3ro (82% of rounds), adverso (8% of rounds), artzin (35% of rounds), d4v41 (100% of rounds), erde (100% of rounds), johnqt (86% of rounds), kiNgg (89% of rounds), koldamenta (24% of rounds), nAts (68% of rounds), saadhak (12% of rounds), sheydos (5% of rounds), sociablEE (49% of rounds), starxo (28% of rounds), valyn (81% of rounds), vanity (36% of rounds), vora (100% of rounds), xavi8k (100% of rounds)
- Players with 20%+ of rounds at events where ACS stood in for Rating: Yuicaw, S1Mon, Spring, CHICHOO, AAAAY, Kiles, nobody, Biank, Life, ZmjjKK, Lysoar, Haodong, Smoggy, Knight, whzy, yosemite, BerLIN, Autumn
- Intl wins NOT counted (player under 50% of team maps): none

## MVP sources

Masters Reykjavík 2021, Masters Berlin 2021, Masters Reykjavík 2022, Masters Copenhagen 2022, Masters Tokyo 2023, Masters Shanghai 2024.
Checked: Liquipedia event pages, event final reports (THESPIKE.GG, ESTNN, oneesports, Field Level Media).
Media-only awards NOT counted: THESPIKE.GG MVP trophy (Shao, Copenhagen 2022; Chronicle, Tokyo 2023);
a vlr.gg forum list (https://www.vlr.gg/post/6242520/international-mvps) is fan-made and disagrees with Liquipedia, so not used.
