"""Everything the Remotion video reads, in one file: video/src/data/league.json.
Run after scoring/score.py (main run plus VARIANT=career_avg and VARIANT=no_region) and scoring/validate.py."""
import json, os, re, sys
import numpy as np
import pandas as pd
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
CFG = yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))
PHOTOS = os.path.join(ROOT, "video", "public", "players")
REGION_COLOR = {"LCK": "#22D3EE", "LPL": "#FF5A5F", "LEC": "#F59E0B", "LCS": "#A78BFA", "LMS": "#34D399"}


RAW = dict(trophies="trophy_pts", big_stage="big_stage_raw", peak="peak_raw", winning="win_raw", longevity="elite_years",
           consistency="consistency_raw", laning="laning_raw", killing="killing_raw", teamfight="teamfight_raw",
           clean_play="clean_raw", vision="vision_raw", team_carry="team_carry_raw", solo_carry="solo_carry_pts",
           recognition="recognition_raw", team_lift="team_lift_raw")


def slug(n):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"\s*\(.*\)$", "", str(n)).lower()).strip("-")


def photo(n):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        if os.path.exists(os.path.join(PHOTOS, slug(n) + ext)):
            return "players/" + slug(n) + ext
    return None


def main_region(r):
    r = str(r) if isinstance(r, str) else ""
    parts = r.split("/")
    return parts[0] if parts and parts[0] in REGION_COLOR else ("LCK" if not r else parts[0])


def rnd(x, k=2):
    return None if x is None or (isinstance(x, float) and np.isnan(x)) else round(float(x), k)


def main():
    P = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0).sort_values("score", ascending=False)
    P["rank"] = np.arange(1, len(P) + 1)
    t, s = pd.read_pickle(os.path.join(ROOT, "data", "raw", "loaded.pkl"))
    s = s[s.Link.isin(P.index)].copy()
    W = pd.Series(CFG["categories"], dtype=float)
    cats = list(W.index)

    def wm(d, col):
        m = d[col].notna() & d.G.notna()
        return np.average(d.loc[m, col], weights=d.loc[m, "G"]) if m.any() else np.nan

    stats = {}
    for l, d in s.groupby("Link"):
        intl = d[d.kind == "intl"]
        stats[l] = dict(
            gd15=rnd(wm(d, "gd15"), 0), csd15=rnd(wm(d, "csd15"), 1), xpd15=rnd(wm(d, "xpd15"), 0),
            kills_pg=rnd(d.K.sum() / d.G.sum(), 2), deaths_pg=rnd(d.D.sum() / d.G.sum(), 2),
            kda=rnd((d.K.sum() + d.A.sum()) / max(d.D.sum(), 1), 2),
            kp=rnd(100 * (d.K + d.A).sum() / d.TK[d.TK.notna()].sum() if d.TK.notna().any() else np.nan, 1),
            dshare=rnd(100 * wm(d, "dshare"), 1), vis_pm=rnd(wm(d, "vis_pm"), 2),
            dpm=rnd(d.Dmg.sum() / d.Min[d.Dmg.notna()].sum() if d.Dmg.notna().any() else np.nan, 0),
            wr=rnd(100 * d.W.sum() / d.G.sum(), 1), intl_games=int(intl.G.sum()),
            intl_wr=rnd(100 * intl.W.sum() / intl.G.sum() if len(intl) else np.nan, 1),
            teams=list(dict.fromkeys(d.sort_values("First").Team.tolist()))[-6:])

    players = []
    for l, p in P.iterrows():
        players.append(dict(
            id=slug(l), link=l, name=p["name"], role=p.role, region=main_region(p.regions), regions=p.regions, years=p.years,
            games=int(p.games), rank=int(p["rank"]), score=rnd(p.score, 1), vsFaker=rnd(p.vs_faker, 1), photo=photo(p["name"]),
            color=REGION_COLOR.get(main_region(p.regions), "#22D3EE"),
            cats={c: rnd(p["c_" + c], 1) for c in cats},
            raw={c: rnd(p[RAW[c]], 3) for c in cats},
            titles=dict(worlds=int(p.worlds_titles), msi=int(p.msi_titles), first_stand=int(p.first_stand_titles),
                        domestic=int(p.domestic_titles), mvps=int(p.mvps)),
            trophyPts=rnd(p.trophy_pts, 0), rawPts=rnd(p.raw_pts, 0), soloCarryPts=rnd(p.solo_carry_pts, 0),
            allpro=rnd(p.allpro_pts, 0), coveredSplits=int(p.covered_splits), eliteYears=int(p.elite_years),
            peakYear=int(p.peak_year) if pd.notna(p.peak_year) else None, teamLift=rnd(100 * p.team_lift_raw, 1),
            stats=stats.get(l, {})))
    by = {p["link"]: p for p in players}
    C = P[["c_" + c for c in cats]].copy(); C.columns = cats

    def top(sc, n=10):
        return [by[l]["id"] for l in sc.sort_values(ascending=False).index[:n]]

    boards = {c: top(C[c] + P.score / 1e4, 10) for c in cats}       # ties broken by overall score
    role_boards = {c: {r: top((C[c] + P.score / 1e4)[P.role == r], 5) for r in ["Top", "Jungle", "Mid", "Bot", "Support"]}
                   for c in ["laning", "killing", "teamfight", "vision", "team_carry"]}
    sweep = []
    for tw in range(0, 61, 1):
        w = W.copy(); rest = W.drop("trophies"); w[rest.index] = rest / rest.sum() * (100 - tw); w["trophies"] = tw
        sc = (C[W.index] * w).sum(axis=1) / 100
        sweep.append(dict(w=tw, top=[[by[l]["id"], rnd(sc[l], 1)] for l in sc.sort_values(ascending=False).index[:8]]))
    sh = pd.read_csv(os.path.join(CSV, "shuffle_counts.csv"), index_col=0)
    shuffle = dict(first=[[by[l]["id"], int(v)] for l, v in sh.wins.sort_values(ascending=False).items() if v > 0][:8],
                   second=[[by[l]["id"], int(v)] for l, v in sh.seconds.sort_values(ascending=False).items() if v > 0][:8])
    variants = {}
    for v in ["career_avg", "no_region"]:
        f = os.path.join(CSV, f"draft_scores_{v}.csv")
        if os.path.exists(f):
            V = pd.read_csv(f, index_col=0).sort_values("score", ascending=False)
            V["rank"] = np.arange(1, len(V) + 1)
            variants[v] = dict(top=[[by[l]["id"], rnd(V.loc[l, "score"], 1)] for l in V.index[:15] if l in by],
                               rank={by[l]["id"]: int(V.loc[l, "rank"]) for l in V.index if l in by})
    T = pd.read_csv(os.path.join(CSV, "title_credits.csv"))
    worlds = []
    for (ev, team, yr), d in T[(T.tier == "worlds") & (T.place == 1)].groupby(["event", "team", "year"], sort=False):
        worlds.append(dict(year=int(yr), team=team, players=[[by[l]["id"] if l in by else slug(l), re.sub(r"\s*\(.*\)$", "", l),
                                                             rnd(c, 2)] for l, c in zip(d.Link, d.credit)]))
    worlds.sort(key=lambda x: x["year"])
    # region of each champion team from its own domestic league results (Season 1-2 teams predate the leagues)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from score import REGION
    res = pd.read_csv(os.path.join(CSV, "results_top16.csv"), dtype=str).fillna("")
    res = res[res.League.isin(REGION)]
    res["reg"] = res.League.map(REGION)
    res["year"] = res.Date.str[:4].astype(int)
    early = {"Fnatic": "LEC", "Taipei Assassins": "LMS"}
    for w in worlds:
        d = res[res.Team == w["team"]]
        d = d.iloc[(d.year - w["year"]).abs().argsort()] if len(d) else d
        w["region"] = early.get(w["team"]) or (d.reg.iat[0] if len(d) else "")
        w["regionColor"] = REGION_COLOR.get(w["region"], "#6B7685")
    rs = pd.read_csv(os.path.join(CSV, "region_strength.csv"), index_col=0)
    val = pd.read_csv(os.path.join(CSV, "validation_results.csv"))
    fw = json.load(open(os.path.join(ROOT, "config", "fitted_season_weights.json")))
    games = int(round(s.G.sum() / 10)) if False else None
    t2, s_all = pd.read_pickle(os.path.join(ROOT, "data", "raw", "loaded.pkl"))
    meta = dict(tournaments=int(s_all.Page.nunique()), games=int(round(s_all.G.sum() / 10)), players=int(s_all.Link.nunique()),
                pool=len(P), minGames=CFG["pool"]["min_games"], firstYear=int(s_all.year.min()), lastYear=int(s_all.year.max()),
                weights={k: float(v) for k, v in W.items()}, trophyPoints=CFG["trophy_points"])
    out = dict(meta=meta, players=players, boards=boards, roleBoards=role_boards, sweep=sweep, shuffle=shuffle,
               variants=variants, worlds=worlds, regionStrength={str(y): {r: rnd(v, 2) for r, v in row.items()} for y, row in rs.iterrows()},
               validation=val.round(3).to_dict(orient="records"), fittedWeights=fw["weights"])
    f = os.path.join(ROOT, "video", "src", "data", "league.json")
    json.dump(out, open(f, "w"), ensure_ascii=False, indent=0, allow_nan=False, default=lambda o: None)
    print(f, os.path.getsize(f) // 1024, "KB;", "top 10:", [p["name"] for p in players[:10]])


if __name__ == "__main__":
    main()
