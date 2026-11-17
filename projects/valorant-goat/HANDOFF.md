# Valorant GOAT: handoff (paused 17 Nov 2026)

ay paused this video to make a League one first. Everything below is committed. Nothing is running.

## State
- **Data: done.** 106 counted VCT events (2021-2026), 10,348 player-stage stat rows, 4,073 matches, placements/IGL/MVP for a 212-player pool (300+ Champions/Masters rounds).
  - Code: `data/pull_all.py` (event stats/standings/matches), `data/pull_players.py` (placements, Liquipedia roles, MVPs).
  - CSVs: `data/csv/`.
  - Raw cache: `/mnt/project-files/valorant-goat/data/raw` (a rerun is free).
- **Sourced manual data:** `data/manual/mvps.csv` (12 event MVPs, each with a source URL), `mvps_not_found.md`, `igl_extra.csv` (earlier IGL stints, each with a source).
- **Scoring:** `scoring/score.py` + `config/weights.yaml` (still `approved: false`). Run `python -m scoring.score`; it writes `scoring/out/`.
- **Reports:** `reports/draft-test-1.md`, `-2.md`, `-3.md`.

## Algorithm v3 (current draft)
- **Principle:** GOAT = individual dominance x how much you drove winning.
- **9 categories** (trophies 28, fragging 15, big games 12, peak+longevity 10, opening 8, clutch 8, team play 7, consistency 7, IGL leadership 5).
  - Stats are role- and season-adjusted z-scores, shrunk toward average (k=1000 rounds).
- **Trophies:** full value by tier (ay: no diminishing returns), times a title **credit share** of 0.5-1.5.
  - The credit share is the player's role-adjusted impact vs teammates in that run, with playoff rounds counted double.
- **Peak:** 60% best rolling 12 months + 40% longevity.
- **Excluded:** showmatches and open qualifiers.

## Results (draft test 3)
- **Overall:** Chronicle, Alfajer, d4v41, trent, aspas, Leo, Derke, MaKo, Less, nAts. Chronicle is #1 in 100% of 1,000 weight-jitter runs.
- **Most Decorated:** Chronicle, f0rsakeN, d4v41, Derke, Jinggg.
- **Most Dominant:** Leo, Shao, trent, MaKo, aspas.
- **Tipping point:** with trophy weight 0-18%, Leo is #1. From 19% up, Chronicle is #1 (19% is a 3-way tie between Chronicle, Alfajer and Leo).
- **Other philosophies:**
  - Stats-only: Leo.
  - Best 12 months: near tie between marteen, Alfajer, Sacy and Leo (Chronicle is 22nd).
  - International LANs only: Chronicle.
- **Story beat:** aspas was the Champions 2022 MVP, but had LOUD's lowest vlr Rating there (0.99; checked on the full-event page).

## Open items
1. ay has not signed off the weights (`approved: false`). The narrative question is "decorated vs dominant": Chronicle vs Leo.
2. **IGL history:** Liquipedia only stores the current role. Earlier IGL stints need sourced rows in `igl_extra.csv` (only FNS so far).
3. **No per-map stats yet,** so opponent strength and grand-final weights are not applied to stats. Title credit uses playoff rounds as a proxy for finals.
4. **vlr.gg has no Rating/KAST/clutch at 17 events** (Masters Shanghai 2024, the China league, 2021 Stage 1 regionals). ACS stands in for Rating and the affected players are flagged.
5. **No official MVP** for 2021-22 Masters, Tokyo 2023 or Shanghai 2024.
6. **Leadership (Glicko over-performance) favours short underdog runs:** xavi8k, erde, vora top it.
7. **Not started:** final ranking run, video panels with real data, script.
