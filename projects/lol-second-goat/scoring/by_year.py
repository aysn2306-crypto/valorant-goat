"""Run the model at the end of every year (CUTOFF=Y runs of score.py write draft_scores_cutY.csv): every player's
overall score and rank as his career stood on 31 Dec of each year. Writes data/csv/rank_by_year.csv (top 20 per year,
the old file) and data/csv/score_by_year_all.csv (every player in every year's pool, with the gap to #1 and to Faker)."""
import os, json, pandas as pd
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
import re
def slug(l):   # the same ids as video/src/data/league.json (export_league.slug)
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"\s*\(.*\)$", "", l).lower()).strip("-")
ids = {}
rows = []
for y in range(2011, 2027):
    f = os.path.join(CSV, f"draft_scores_cut{y}.csv")
    if not os.path.exists(f):
        continue
    P = pd.read_csv(f, index_col=0).sort_values("score", ascending=False)
    P["rank"] = range(1, len(P) + 1)
    fk = P.score.get("Faker")
    for l, r in P.iterrows():
        rows.append(dict(year=y, player_id=slug(l), link=l, name=r["name"], score=round(r.score, 1), rank=r["rank"],
                         pool=len(P), gap_to_first=round(P.score.iloc[0] - r.score, 1),
                         gap_to_faker=round(fk - r.score, 1) if fk is not None else None))
A = pd.DataFrame(rows)
A.to_csv(os.path.join(CSV, "score_by_year_all.csv"), index=False)
A[A["rank"] <= 20][["year", "player_id", "link", "name", "score", "rank", "pool"]].to_csv(os.path.join(CSV, "rank_by_year.csv"), index=False)
for y, d in A.groupby("year"):
    t = d.head(3)
    print(y, d.pool.iloc[0], " | ".join(f"{n} {s}" for n, s in zip(t.name, t.score)), "| Faker", d[d.link == "Faker"]["rank"].tolist())
