# lol-second-goat

"Who is the second greatest League of Legends player after Faker?" Data, scoring and (later) the edit for ay's
YouTube video. Same method and pipeline as `projects/valorant-goat` (algorithm v3).

- `PLAN.md`: panels, scoring and sources (DRAFT).
- `config/weights.yaml`: weights, not approved yet.
- `data/`: Leaguepedia Cargo pullers (`cargo.py` caches every request in `data/raw/cargo`, rerun is free).
  Run in order: `pull_results.py`, `pull_stats.py`, `pull_redirects.py`, `pull_intl_games.py`.
- `scoring/score.py`: writes `data/csv/draft_scores.csv` and `reports/draft-test-1.md`.
