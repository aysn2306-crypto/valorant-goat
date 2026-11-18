"""Backtest: does the stat model agree with independent expert picks?
Target: Leaguepedia season awards (All-Pro 1st/2nd/3rd teams, season MVP) for LCK, LPL, LEC/EU LCS, LCS/NA LCS, LMS.
Each split: rank the players of each role by a model, compare with who the voters picked.
Train on seasons up to 2021, test on 2022-2026 (held out, never used to fit)."""
import json, os, re, sys
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.linear_model import Ridge, LogisticRegression

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import score

ROOT = score.ROOT
FEATS = ["kda", "kp", "dpm", "gold_share", "low_deaths", "kills_pm", "assists_pm", "dshare", "vis_pm", "gd15", "csd15", "xpd15", "gap"]
TIER = {"All Pro Team": 3, "1st All-Pro Team": 3, "2nd All Pro Team": 2, "2nd All-Pro Team": 2, "3rd All Pro Team": 1, "3rd All-Pro Team": 1}


def awards():
    a = pd.read_csv(os.path.join(score.CSV, "individual_achievements.csv"), dtype=str).fillna("")
    a["Link"] = [score.redirect(l) for l in a.Player]
    ap = a[a.Display.isin(TIER)].copy()
    ap["pts"] = ap.Display.map(TIER)
    ap = ap.groupby(["OverviewPage", "Link"]).pts.max().reset_index()
    mvp = a[a.Display.isin(["Most Valuable Player", "Player of the Split", "Regular Season MVP", "MVP"])][["OverviewPage", "Link"]].drop_duplicates()
    mvp["mvp"] = 1
    return ap, mvp


def table():
    cache = os.path.join(score.CSV, "..", "raw", "s_zscored.pkl")
    if os.environ.get("REUSE") and os.path.exists(cache):
        s = pd.read_pickle(cache)
    else:
        t, s = score.load()
        s = score.zscores(s, use_rating=False)
        s.to_pickle(cache)
    ap, mvp = awards()
    pages = set(ap.OverviewPage)
    c = s[s.Page.isin(pages)].copy()
    c = c[c.G >= 0.4 * c.groupby("Page").G.transform("max")]
    c = c.groupby(["Page", "Link", "role"]).apply(lambda d: d.loc[d.G.idxmax()], include_groups=False).reset_index()
    c = c.merge(ap.rename(columns={"OverviewPage": "Page"}), on=["Page", "Link"], how="left")
    c = c.merge(mvp.rename(columns={"OverviewPage": "Page"}), on=["Page", "Link"], how="left")
    c["pts"] = c.pts.fillna(0); c["mvp"] = c.mvp.fillna(0)
    c["wr"] = c.W / c.G
    c["z_wr"] = c.groupby("Page").wr.transform(lambda x: (x - x.mean()) / (x.std() or 1))
    for f in FEATS:
        c["f_" + f] = c["z_" + f].fillna(0).clip(-4, 4)
    c["f_wr"] = c.z_wr.fillna(0)
    # keep only splits where the voters picked a full first team we can see
    ok = c.groupby("Page").apply(lambda d: (d.pts == 3).sum() >= 4, include_groups=False)
    c = c[c.Page.isin(ok[ok].index)]
    return c


def evaluate(c, col):
    top1, top3, rho, n = 0, 0, [], 0
    for (p, r), d in c.groupby(["Page", "role"]):
        if (d.pts == 3).sum() != 1 or len(d) < 4:
            continue
        o = d.sort_values(col, ascending=False)
        top1 += int(o.pts.iat[0] == 3)
        picked = set(d[d.pts > 0].Link)
        top3 += len(set(o.Link[:len(picked)]) & picked) / max(len(picked), 1)
        rr = spearmanr(d[col], d.pts).statistic
        if not np.isnan(rr):
            rho.append(rr)
        n += 1
    mv, m_n = 0, 0
    for p, d in c.groupby("Page"):
        if d.mvp.sum() == 0:
            continue
        mv += int(d.sort_values(col, ascending=False).mvp.iloc[:3].sum() > 0); m_n += 1
    return dict(model=col, role_slots=n, first_team_hit=top1 / n, all_pro_overlap=top3 / n, spearman=np.mean(rho),
                mvp_in_top3=mv / max(m_n, 1), mvp_splits=m_n, chance_first_team=np.mean([1 / k for k in c.groupby(["Page", "role"]).size()]))


def main():
    c = table()
    c["year"] = c.First.str[:4].astype(int)
    train, test = c[c.year <= 2021].copy(), c[c.year >= 2022].copy()
    X = ["f_" + f for f in FEATS] + ["f_wr"]
    # v3 hand-picked blend (what the draft used)
    for d in (train, test, c):
        d["m_win_only"] = d.f_wr
        d["m_v3_impact"] = d[["f_kda", "f_kp", "f_dpm", "f_gold_share", "f_low_deaths"]].mean(axis=1)
        d["m_v3_plus_win"] = d.m_v3_impact + 0.5 * d.f_wr
    lr = LogisticRegression(C=0.5, max_iter=2000).fit(train[X], (train.pts > 0).astype(int))
    rg = Ridge(alpha=5).fit(train[X], train.pts)
    for d in (train, test, c):
        d["m_fitted"] = lr.decision_function(d[X])
        d["m_fitted_ridge"] = rg.predict(d[X])
    rows = []
    for name, d in [("train (<=2021)", train), ("held-out test (2022-2026)", test)]:
        for m in ["m_win_only", "m_v3_impact", "m_v3_plus_win", "m_fitted", "m_fitted_ridge"]:
            rows.append({"set": name, **evaluate(d, m)})
    R = pd.DataFrame(rows)
    coef = pd.Series(lr.coef_[0], index=[x[2:] for x in X]).sort_values(ascending=False)
    # refit on everything for use in the score (weights fixed before the final ranking is looked at)
    lr_all = LogisticRegression(C=0.5, max_iter=2000).fit(c[X], (c.pts > 0).astype(int))
    w = dict(zip([x[2:] for x in X], lr_all.coef_[0].round(4)))
    json.dump({"weights": w, "intercept": float(lr_all.intercept_[0]), "n_player_splits": int(len(c)),
               "note": "logistic fit of All-Pro selection on per-split stats (z inside role+year); wr = win rate inside the split"},
              open(os.path.join(ROOT, "config", "fitted_season_weights.json"), "w"), indent=1)
    R.to_csv(os.path.join(score.CSV, "validation_results.csv"), index=False)
    print(R.round(3).to_string())
    print("\nfitted weights (train):\n", coef.round(3).to_string())
    print("\nsplits:", c.Page.nunique(), "player-splits:", len(c), "train/test:", len(train), len(test))
    return R, coef, c


if __name__ == "__main__":
    main()
