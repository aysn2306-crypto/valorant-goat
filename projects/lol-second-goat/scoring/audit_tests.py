"""Sanity tests on the saved model outputs (audit 20 Nov). Run from the project folder after score.py:
    python3 scoring/audit_tests.py
The full super-Faker test (a copy of Faker with better stats, one more clutch win, a better plus-minus and one more
Finals MVP must rank #1, with Faker #2) needs a rerun on a copied data folder; it passed on 20 Nov (SuperFaker 98.5,
Faker 87.8, Knight 71.1)."""
import os, sys
import numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import silverware as SW
CSV = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "csv")
P = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0)
T = pd.read_csv(os.path.join(CSV, "title_credits.csv"))
ok = True
def check(name, cond):
    global ok
    ok &= bool(cond); print(("PASS " if cond else "FAIL ") + name)

check("527 players, 150+ games each", len(P) == 527 and P.games.min() >= 150)
f = P.loc["Faker"]
check("Faker: 6 Worlds, 2 MSI, 10 LCK titles", (f.worlds_titles, f.msi_titles, f.domestic_titles) == (6, 2, 10))
check("each title credited once per player", not T[T.tier != "award"].duplicated(["Link", "page"]).any())
n = T[(T.place == 1) & (T.tier != "award")].groupby(["page", "team"]).size()
check("5 or 6 credited players per title", n.between(5, 6).all())
check("every Worlds 2011-2026 has a champion", set(T[(T.tier == "worlds") & (T.place == 1)].year) == set(range(2011, 2027)))
check("title credit stays inside 0.85-1.15", T[T.tier != "award"].credit.between(0.85, 1.15).all())
for c in ["c_trophies", "c_big_stage_clutch", "c_skill", "c_impact", "c_longevity", "c_intangibles"]:
    check(f"{c}: 0 to 100, best = 100, median = 50", P[c].between(0, 100.0001).all() and abs(P[c].max() - 100) < 1e-9
          and (abs(P[c].median() - 50) < 1 or c == "c_trophies"))
W = SW.W
check("score = weighted sum of the six parts", np.allclose((P[["c_" + k for k in W.index]].values * W.values).sum(1) / 100, P.score))
check("today's-scale scorer reproduces every score", all(abs(SW.frozen_score(P.loc[l])[0] - P.loc[l, "score"]) < 1e-6 for l in P.index))
# monotonic: more trophy points never lowers a score (others fixed)
for l in ["Knight (Zhuo Ding)", "Chovy", "Gumayusi"]:
    p = P.loc[l].copy(); base = SW.frozen_score(p)[0]; p["trophy_pts"] += 100
    check(f"{P.loc[l, 'name']}: one more Worlds-sized title raises the score", SW.frozen_score(p)[0] > base)
# more of everything than Faker ranks above Faker on today's scale
p = P.loc["Faker"].copy()
for c in ["trophy_pts", "big_stage_raw", "clutch_raw", "individual_raw", "peak_raw", "impact_raw", "longevity_raw", "recognition_raw"]:
    p[c] = p[c] + abs(p[c]) * 0.05 + 0.01
check("a player with more of everything than Faker outscores him", SW.frozen_score(p)[0] > P.loc["Faker", "score"])
sw = pd.read_csv(os.path.join(CSV, "silverware_needed.csv"))
mono = all((g.sort_values("extra_worlds").score.diff().dropna() > 0).all() for _, g in sw.groupby(["player", "mix"]))
check("silverware: every extra season raises the score (no cap)", mono)
print("ALL PASS" if ok else "SOME FAILED")
sys.exit(0 if ok else 1)
