"""What would it take (ay 20 Nov): the titles Knight, Chovy and Gumayusi need to reach Faker's CURRENT score, with Faker
frozen (he plays no more seasons and his score does not move).

Each run is score.py with FUTURE=data/future/silver_<who>_<mix>_<n>.json: n more seasons that copy the player's title
season (stats, plays, clutch series, plus-minus, honours), each with the titles in the mix. Every part moves.

Audit 20 Nov: the earlier version read the what-if player's parts from the what-if run, where he is often the new best
player in a part and so capped at 100 (the same flaw as the Gumayusi trophy cap, in big games, skill, longevity and
recognition), and compared that with Faker's score on today's scale. Here every part of the what-if player is scored
on TODAY's scale (today's pool median = 50, today's best = 100) with no cap, which is what "Faker frozen at his current
score" means. The same-world check (the full model rerun with those seasons in it, Faker's score included) is kept
beside it for reference.

Writes data/csv/silverware_needed.csv."""
import glob, json, os, re
import numpy as np, pandas as pd, yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
W = pd.Series(yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))["pillars"], dtype=float)
P0 = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0)
WHO = {"knight": ("Knight", "Knight (Zhuo Ding)", 3), "chovy": ("Chovy", "Chovy", 2), "guma": ("Gumayusi", "Gumayusi", 2)}
MIX = {"full": "Worlds + MSI + all league titles each season", "w": "Worlds only", "wl": "Worlds + all league titles (no MSI)"}


def lin(x, ref):
    """Today's scale, no cap: today's pool median = 50, today's best = 100."""
    med, top = ref.median(), ref.max()
    return max(0.0, 50 + 50 * (x - med) / (top - med))


def frozen_parts(p, P=P0):
    cl = P.clutch_raw.fillna(P.clutch_raw.median())
    return {"trophies": p.trophy_pts / P.loc["Faker", "trophy_pts"] * 100,
            "big_stage_clutch": lin(0.6 * lin(p.big_stage_raw, P.big_stage_raw) + 0.4 * lin(cl.median() if pd.isna(p.clutch_raw) else p.clutch_raw, cl),
                                    0.6 * P.c_big_stage + 0.4 * P.c_clutch),
            "skill": lin(0.7 * lin(p.individual_raw, P.individual_raw) + 0.3 * lin(p.peak_raw, P.peak_raw),
                         0.7 * P.c_individual + 0.3 * P.c_peak),
            "impact": lin(p.impact_raw, P.impact_raw),
            "longevity": lin(p.longevity_raw + p.games / 1e6, P.longevity_raw + P.games / 1e6),
            "intangibles": lin(p.recognition_raw, P.recognition_raw)}


def frozen_score(p):
    parts = frozen_parts(p)
    return sum(W[k] * v for k, v in parts.items()) / W.sum(), parts


if __name__ == "__main__":
    for l in ["Faker", "Knight (Zhuo Ding)", "Chovy", "Gumayusi"]:   # today's scale reproduces today's score
        assert abs(frozen_score(P0.loc[l])[0] - P0.loc[l, "score"]) < 1e-6, l
    faker_now = P0.loc["Faker", "score"]
    rows = []
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "future", "silver_*.json"))):
        who, mix, n = re.match(r"silver_(\w+?)_(full|wl|w)_(\d+)", os.path.basename(f)).groups()
        name, link, per = WHO[who]
        cfg = json.load(open(f))
        P = pd.read_csv(os.path.join(CSV, f"draft_scores_{os.path.basename(f)[:-5]}.csv"), index_col=0)
        sc, parts = frozen_score(P.loc[link])
        n = int(n)
        rows.append(dict(player=name, link=link, mix=MIX[mix], extra_worlds=n, extra_msi=sum(cfg.get("msi", [])),
                         extra_league_titles=per * n if cfg.get("dom_pts", 0) > 0 else 0,
                         worlds_total=int(P0.loc[link, "worlds_titles"]) + n,
                         **{f"part_{k}": round(v, 1) for k, v in parts.items()},
                         score=round(sc, 1), faker_now=round(faker_now, 1), reaches_faker=sc > faker_now,
                         same_world_score=round(P.loc[link, "score"], 1), same_world_faker=round(P.loc["Faker", "score"], 1),
                         same_world_rank=int(P.score.rank(ascending=False)[link])))
    D = pd.DataFrame(rows).sort_values(["player", "mix", "extra_worlds"])
    first = D[D.reaches_faker].groupby(["player", "mix"]).extra_worlds.min()
    D["smallest"] = [r.reaches_faker and first.get((r.player, r.mix)) == r.extra_worlds for r in D.itertuples()]
    D.to_csv(os.path.join(CSV, "silverware_needed.csv"), index=False)
    print(D[["player", "mix", "extra_worlds", "score", "faker_now", "reaches_faker", "smallest", "same_world_score",
             "same_world_faker", "same_world_rank"]].to_string(index=False))
