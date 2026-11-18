"""What would it take (ay 18 Nov): Knight and Chovy play k more dream seasons (k = 1..8), each one a Worlds, an MSI,
their best domestic year of 2024-26 and a copy of their title season's stats, plays, clutch series, plus-minus and
honours (Knight 2026, Chovy 2025). Every part of the score moves, not only trophies. Faker plays no more seasons.
Reads draft_scores_dream_<who>_<k>.csv (score.py with FUTURE=data/future/dream_<who>_<k>.json) and writes
data/csv/dream_seasons.csv."""
import os, pandas as pd, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
W = pd.Series(yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))["pillars"], dtype=float)
base = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0)
rows = []
for who, l in [("knight", "Knight (Zhuo Ding)"), ("chovy", "Chovy")]:
    for k in range(0, 9):
        f = os.path.join(CSV, f"draft_scores_dream_{who}_{k}.csv")
        P = base if k == 0 else (pd.read_csv(f, index_col=0) if os.path.exists(f) else None)
        if P is None:
            continue
        r = dict(player=P.loc[l, "name"], seasons=k, year=2026 + k, score=round(P.loc[l, "score"], 1),
                 faker=round(P.loc["Faker", "score"], 1), rank=int(P.score.rank(ascending=False)[l]),
                 worlds=int(P.loc[l, "worlds_titles"]))
        r.update({p: round(P.loc[l, "c_" + p], 1) for p in W.index})
        rows.append(r)
D = pd.DataFrame(rows)
D["passes_faker"] = D.score > D.faker
D.to_csv(os.path.join(CSV, "dream_seasons.csv"), index=False)
print(D.to_string(index=False))
