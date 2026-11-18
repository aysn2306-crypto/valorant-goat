"""What-ifs on the finished ranking (no rerun of the model): international trophies only, Knight's extra titles,
and where Knight finishes in the 1,000 weight shuffles. Reads data/csv/draft_scores.csv and title_credits.csv."""
import os, numpy as np, pandas as pd, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
CFG = yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))
W = pd.Series(CFG["pillars"], dtype=float)
P = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0)
T = pd.read_csv(os.path.join(CSV, "title_credits.csv"))
C = P[["c_" + k for k in W.index]].copy(); C.columns = W.index
KN = "Knight (Zhuo Ding)"

def score(pts):
    c = C.copy(); c["trophies"] = pts / pts.max() * 100
    return (c[W.index] * W).sum(axis=1) / W.sum()

base = score(P.trophy_pts)
print("check: max diff vs saved score", float((base - P.score).abs().max()))

intl = T[T.tier != "domestic"].groupby("Link").pts.sum().reindex(P.index).fillna(0)
s = score(intl).sort_values(ascending=False)
out = pd.DataFrame({"name": P.name[s.index], "score": s.round(1)}).head(10)
print("\nInternational trophies only:\n", out.to_string())
out.to_csv(os.path.join(CSV, "whatif_intl_only.csv"))

kt = T[(T.Link == KN) & (T.tier == "worlds") & (T.place == 1)].pts.iloc[-1]
km = T[(T.Link == KN) & (T.tier == "msi") & (T.place == 1)].pts
km = km.iloc[-1] if len(km) else 50 * 1.06
rows = []
for label, add in [("now", 0), ("+1 Worlds", kt), ("+2 Worlds", 2 * kt), ("+3 Worlds", 3 * kt), ("+2 Worlds +2 MSI", 2 * kt + 2 * km)]:
    p = P.trophy_pts.copy(); p[KN] += add
    sc = score(p)
    rows.append((label, round(sc[KN], 1), round(sc["Faker"], 1)))
k = pd.DataFrame(rows, columns=["case", "knight", "faker"])
print("\nWhat Knight needs (Faker wins nothing more):\n", k.to_string(index=False))
k.to_csv(os.path.join(CSV, "whatif_knight_needs.csv"), index=False)

rng = np.random.default_rng(7)
pos = []
for _ in range(CFG["robustness"]["runs"]):
    w = W * (1 + rng.uniform(-1, 1, len(W)) * CFG["robustness"]["max_weight_change"])
    o = list((C[W.index] * w).sum(axis=1).sort_values(ascending=False).index)
    pos.append((o.index(KN) + 1, P.name[o[1]]))
pos = pd.DataFrame(pos, columns=["knight_rank", "second"])
print("\nKnight's finish across reruns:", pos.knight_rank.value_counts().to_dict(), "| #2:", pos.second.value_counts().to_dict())
