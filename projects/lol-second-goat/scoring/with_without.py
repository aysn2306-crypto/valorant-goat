"""With and without records for the team impact chart (graphs thread, 18 Nov). Same window as score.py team_lift:
for each team a player played on, that team's domestic events within two years of his stint, split into events
with him on the roster and events without him. Counts are the team's own game wins and games, not region-scaled.
An event counts as 'with' if he played any game there."""
import os, sys
import numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(__file__))
import score as S

t, s = pd.read_pickle(os.path.join(S.ROOT, "data", "raw", "loaded.pkl"))
d = s[s.kind == "dom"]
team = d.groupby(["Page", "Team"]).agg(W=("W", "max"), G=("G", "max"), year=("year", "first")).reset_index()
roster = d.groupby(["Page", "Team"]).Link.agg(set)
ORG = {"SK Telecom T1": "T1", "SK Telecom T1 2": "T1", "SK Telecom T1 K": "T1", "KSV eSports": "Gen.G",
       "Samsung Galaxy": "Gen.G", "DragonX": "DRX", "Kingzone DragonX": "DRX"}
team["org"] = team.Team.map(lambda x: ORG.get(x, x))
rows = []
for name in sys.argv[1:] or ["Faker", "Knight", "Chovy", "Ruler", "Keria"]:
    cands = [k for k in d.Link.unique() if S.display(k) == name]
    l = max(cands, key=lambda k: d[d.Link == k].G.sum())   # the main player of that name (old 2013 Knight is someone else)
    mine = d[d.Link == l].assign(org=lambda x: x.Team.map(lambda y: ORG.get(y, y)))[["Page", "org", "year"]].drop_duplicates()
    for org, yrs in mine.groupby("org").year:
        lo, hi = min(yrs) - 2, max(yrs) + 2
        near = team[(team.org == org) & team.year.between(lo, hi)]
        w = near[[l in roster.get((p, tm), set()) for p, tm in zip(near.Page, near.Team)]]
        wo = near[[l not in roster.get((p, tm), set()) for p, tm in zip(near.Page, near.Team)]]
        rows.append(dict(player=name, team=org, stint=f"{min(yrs)}-{max(yrs)}", window=f"{lo}-{hi}",
                         with_W=int(w.W.sum()), with_L=int(w.G.sum() - w.W.sum()), with_G=int(w.G.sum()),
                         with_pct=round(100 * w.W.sum() / w.G.sum(), 1) if w.G.sum() else None,
                         without_W=int(wo.W.sum()), without_L=int(wo.G.sum() - wo.W.sum()), without_G=int(wo.G.sum()),
                         without_pct=round(100 * wo.W.sum() / wo.G.sum(), 1) if wo.G.sum() else None,
                         without_years=",".join(map(str, sorted(wo.year.unique())))))
o = pd.DataFrame(rows)
o.to_csv(os.path.join(S.CSV, "with_without.csv"), index=False)
print(o.to_string())
