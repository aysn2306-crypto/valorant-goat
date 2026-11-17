"""DRAFT scoring for "the 2nd greatest League player after Faker" (algorithm v3, see config/weights.yaml)."""
import os, re, sys
import numpy as np
import pandas as pd
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))
CSV = os.path.join(ROOT, "data", "csv")
OUT = os.path.join(ROOT, "reports")

INTL = {"World Championship": "worlds", "Mid-Season Invitational": "msi", "First Stand": "first_stand",
        "Mid-Season Cup 2020": "msc"}
REGION = {"LoL The Champions": "LCK", "LoL Champions Korea": "LCK", "Tencent LoL Pro League": "LPL",
          "Europe League Championship Series": "LEC", "LoL EMEA Championship": "LEC",
          "North America League Championship Series": "LCS", "League of Legends Championship Series": "LCS",
          "League of Legends Championship of The Americas North": "LCS",
          "League of Legends Championship of The Americas": "LCS", "LoL Master Series": "LMS"}
ROLE = {"Top": "Top", "Jungle": "Jungle", "Mid": "Mid", "Bot": "Bot", "ADC": "Bot", "Support": "Support"}


def display(link):
    return re.sub(r"\s*\(.*\)$", "", link)


def load():
    t = pd.read_csv(os.path.join(CSV, "tournaments.csv"), dtype=str).fillna("")
    s = pd.read_csv(os.path.join(CSV, "player_event_stats.csv"))
    rd = pd.read_csv(os.path.join(CSV, "player_redirects.csv"), dtype=str).dropna()
    exact = dict(zip(rd.AllName, rd.OverviewPage))
    lower = {k.lower(): v for k, v in exact.items()}
    s["Link"] = [exact.get(l, lower.get(str(l).lower(), l)) for l in s.Link]
    s = s.groupby(["Page", "Link", "Role", "Team"], as_index=False).agg(
        {**{c: "sum" for c in ["G", "W", "K", "D", "A", "Gold", "CS", "Dmg", "TK", "TG", "Min"]}, "First": "min", "Last": "max"})
    s = s.merge(t[["OverviewPage", "League", "Name", "IsPlayoffs"]], left_on="Page", right_on="OverviewPage", how="left")
    s["year"] = s.First.str[:4].astype(int)
    s["kind"] = np.where(s.League.isin(INTL.keys()), "intl", "dom")
    s["region"] = s.League.map(REGION).fillna("INTL")
    s["role"] = s.Role.map(ROLE)
    s = s[s.role.notna() & (s.G > 0)].copy()
    for c in ["K", "D", "A", "Gold", "CS", "Dmg", "TK", "TG", "Min", "W"]:
        s[c] = pd.to_numeric(s[c], errors="coerce")
    s.loc[s.Dmg <= 0, "Dmg"] = np.nan
    s.loc[s.Min <= 0, "Min"] = np.nan
    return t, s


def region_strength(s):
    """Per year, Bradley-Terry strength of each region from cross-region games at Worlds/MSI/First Stand/MSC.
    Shown as 2 x P(beat the best region), so the best region is 1.0 and an even match is 1.0."""
    dom = s[s.kind == "dom"]
    by_year = dom.groupby(["year", "Team"]).region.agg(lambda x: x.mode().iat[0])
    any_year = dom.groupby("Team").region.agg(lambda x: x.mode().iat[0])
    g = pd.read_csv(os.path.join(CSV, "intl_team_games.csv"))
    g["year"] = g.First.str[:4].astype(int)
    reg = lambda y, tm: by_year.get((y, tm), any_year.get(tm))
    g["r1"] = [reg(y, a) for y, a in zip(g.year, g.Team)]
    g["r2"] = [reg(y, b) for y, b in zip(g.year, g.TeamVs)]
    g = g.dropna(subset=["r1", "r2"])
    g = g[g.r1 != g.r2]
    out = {}
    for y, d in g.groupby("year"):
        regs = sorted(set(d.r1) | set(d.r2))
        th = {r: 0.0 for r in regs}
        for _ in range(500):          # MM updates with a weak prior of one win and one loss vs an average region
            for r in regs:
                mine = d[d.r1 == r]
                wins = mine.W.sum() + 1
                denom = sum(row.G / (np.exp(th[r]) + np.exp(th[row.r2])) for row in mine.itertuples()) + 2 / (np.exp(th[r]) + 1)
                th[r] = np.log(wins / denom)
        best = max(th.values())
        out[y] = {r: 2 / (1 + np.exp(best - v)) for r, v in th.items()}
    tab = pd.DataFrame(out).T.reindex(range(s.year.min(), s.year.max() + 1))
    tab = tab.ffill().bfill()
    for r in REGION.values():
        if r not in tab.columns:
            tab[r] = 0.5
    return tab.clip(0.2, 1.0)


def zscores(s):
    s["kda"] = (s.K + s.A) / s.D.clip(lower=1)
    s["kp"] = (s.K + s.A) / s.TK.replace(0, np.nan)
    s["dpm"] = s.Dmg / s.Min
    s["gold_share"] = s.Gold / s.TG.replace(0, np.nan)
    s["low_deaths"] = -(s.D / s.Min.fillna(s.G * 32))
    ref = s[s.G >= 3]
    for m in ["kda", "kp", "dpm", "gold_share", "low_deaths"]:
        g = ref.groupby(["role", "year"])
        mu = g.apply(lambda d: np.average(d[m].dropna(), weights=d.loc[d[m].notna(), "G"]) if d[m].notna().any() else np.nan, include_groups=False)
        sd = g[m].std()
        key = list(zip(s.role, s.year))
        s["z_" + m] = (s[m].values - mu.reindex(key).values) / sd.reindex(key).values
    for name, cols in [("impact", CFG["impact"]["impact"]), ("carry", CFG["impact"]["carry"]), ("clean", CFG["impact"]["clean"])]:
        s["z_" + name] = s[["z_" + c for c in cols]].mean(axis=1, skipna=True)
    return s


def wmean(d, col):
    m = d[col].notna()
    return np.average(d.loc[m, col], weights=d.loc[m, "G"]) if m.any() else np.nan


def shrink(x, n, k):
    return x * n / (n + k)


def titles(t, s, strength):
    r = pd.read_csv(os.path.join(CSV, "results_top4.csv"), dtype=str).fillna("")
    r = r[(r.Showmatch != "1") & r.PlaceN.isin(["1", "2", "3"]) & (r.Team != "")]
    bad = re.compile(r"Play-In|Road to MSI|Showmatch|Regional|Qualif|Preseason|All Star|LPPL|Promotion|Rounds", re.I)
    r = r[~r.Name.str.contains(bad)]
    r["year"] = r.Date.str[:4].astype(int)
    tp = CFG["trophy_points"]
    rows = []
    for _, e in r.iterrows():
        if e.League in INTL:
            tier = INTL[e.League]
            if "/" in e.Page:      # parent page only (Main Event / Play-In sub-pages repeat the result)
                continue
            pts = tp[tier][int(e.PlaceN)] * (tp["early_worlds"].get(e.year, 1.0) if tier == "worlds" else 1.0)
        elif e.League in REGION:
            cup = e.Name.startswith("LCK Cup") or (e.League == "Tencent LoL Pro League" and "Split" in e.Name and e.IsPlayoffs == "1")
            champions_era = e.League == "LoL The Champions" and e.year < 2015
            if not (e.IsPlayoffs == "1" or cup or champions_era):
                continue
            reg = REGION[e.League]
            tier = "domestic"
            pts = tp["domestic"][int(e.PlaceN)] * strength.loc[e.year, reg] * (tp["domestic_cup"] if cup else 1.0)
        else:
            continue
        ev = s[((s.Page == e.Page) | s.Page.str.startswith(e.Page + "/")) & (s.Team == e.Team)]
        if ev.empty:
            continue
        per = ev.groupby("Link").agg(G=("G", "sum")).reset_index()
        need = tp["min_share_of_games"] * per.G.max()
        imp = ev.groupby("Link").apply(lambda d: wmean(d, "z_impact"), include_groups=False)
        team_mean = imp[per.set_index("Link").G >= need].mean()
        for _, p in per.iterrows():
            if p.G < need:
                continue
            c = CFG["credit"]
            diff = shrink(imp[p.Link] - team_mean, p.G, c["shrink_games"]) if pd.notna(imp[p.Link]) else 0
            credit = float(np.clip(1 + c["alpha"] * diff, c["min"], c["max"]))
            rows.append(dict(Link=p.Link, event=e.Name, page=e.Page, team=e.Team, year=e.year, tier=tier,
                             place=int(e.PlaceN), base=pts, credit=credit, pts=pts * credit, G=p.G))
    return pd.DataFrame(rows)


def percentile(x):
    return x.rank(pct=True) * 100


def main():
    t, s = load()
    strength = region_strength(s)
    s = zscores(s)
    pen = CFG["impact"]["region_penalty_sd"]
    st = np.array([strength.loc[y, r] if r in strength.columns else 1.0 for y, r in zip(s.year, s.region)])
    s["strength"] = np.where(s.kind == "dom", st, 1.0)
    for c in ["impact", "carry", "clean"]:
        s["a_" + c] = s["z_" + c] - pen * (1 - s.strength)
    s["a_win"] = (s.W / s.G - 0.5) * s.strength
    T = titles(t, s, strength)

    games = s.groupby("Link").G.sum()
    pool = games[games >= CFG["pool"]["min_games"]].index
    k = CFG["impact"]["shrink_games"]
    P = pd.DataFrame(index=pool)
    P["name"] = [display(l) for l in pool]
    P["games"] = games[pool]
    P["role"] = s[s.Link.isin(pool)].groupby("Link").apply(lambda d: d.groupby("role").G.sum().idxmax(), include_groups=False)
    P["regions"] = s[s.Link.isin(pool) & (s.kind == "dom")].groupby("Link").region.agg(lambda x: "/".join(sorted(set(x))))
    P["years"] = s[s.Link.isin(pool)].groupby("Link").year.agg(lambda x: f"{x.min()}-{x.max()}")
    g = s[s.Link.isin(pool)].groupby("Link")
    intl = s[s.Link.isin(pool) & (s.kind == "intl")].groupby("Link")
    P["intl_games"] = intl.G.sum().reindex(pool).fillna(0)
    P["big_stage_raw"] = shrink(intl.apply(lambda d: wmean(d, "z_impact"), include_groups=False).reindex(pool).fillna(0), P.intl_games, k)
    yr = s[s.Link.isin(pool)].groupby(["Link", "year"]).apply(lambda d: pd.Series({"imp": wmean(d, "a_impact"), "G": d.G.sum()}), include_groups=False).reset_index()
    yr["imp_s"] = shrink(yr.imp.fillna(0), yr.G, k)
    best = yr.loc[yr.groupby("Link").imp_s.idxmax()].set_index("Link")
    P["peak_raw"], P["peak_year"] = best.imp_s, best.year
    P["elite_years"] = yr[(yr.G >= 20) & (yr.imp_s >= 0.35)].groupby("Link").size().reindex(pool).fillna(0)
    P["win_raw"] = shrink(g.apply(lambda d: wmean(d, "a_win"), include_groups=False), P.games, k)
    P["carry_raw"] = shrink(g.apply(lambda d: wmean(d, "a_carry"), include_groups=False), P.games, k)
    P["clean_raw"] = shrink(g.apply(lambda d: wmean(d, "a_clean"), include_groups=False), P.games, k)
    ev = s[s.Link.isin(pool) & (s.G >= 5)]
    cons = ev.groupby("Link").apply(lambda d: pd.Series({"n": len(d), "up": (d.a_impact > 0).sum()}), include_groups=False)
    P["consistency_raw"] = ((cons.up + 2) / (cons.n + 4)).reindex(pool)   # shrink toward 50%
    tp = T.groupby("Link").agg(trophy_pts=("pts", "sum"), raw_pts=("base", "sum"))
    P = P.join(tp).fillna({"trophy_pts": 0, "raw_pts": 0})
    for tier in ["worlds", "msi", "first_stand", "domestic"]:
        P[tier + "_titles"] = T[(T.tier == tier) & (T.place == 1)].groupby("Link").size().reindex(pool).fillna(0).astype(int)

    C = pd.DataFrame(index=pool)
    C["trophies"] = P.trophy_pts / P.trophy_pts.max() * 100
    C["big_stage"] = percentile(P.big_stage_raw)
    C["peak"] = percentile(P.peak_raw)
    C["winning"] = percentile(P.win_raw)
    C["longevity"] = percentile(P.elite_years + P.games / 10000)
    C["carry"] = percentile(P.carry_raw)
    C["clean_play"] = percentile(P.clean_raw)
    C["consistency"] = percentile(P.consistency_raw)
    W = pd.Series(CFG["categories"], dtype=float)
    P["score"] = (C[W.index] * W).sum(axis=1) / W.sum()
    fk = [l for l in pool if display(l) == CFG["pool"]["benchmark"]][0]
    P["vs_faker"] = P.score / P.loc[fk, "score"] * 100
    P = P.join(C.add_prefix("c_"))
    P["decorated"] = P.raw_pts
    P["dominant"] = C[["big_stage", "peak", "winning", "carry", "clean_play", "consistency"]].mean(axis=1)

    # robustness and tipping point, Faker left out of the ranking
    R = P.drop(fk)
    rng = np.random.default_rng(7)
    wins = pd.Series(0, index=R.index)
    for _ in range(CFG["robustness"]["runs"]):
        w = W * (1 + rng.uniform(-1, 1, len(W)) * CFG["robustness"]["max_weight_change"])
        sc = (C.loc[R.index, W.index] * w).sum(axis=1)
        wins[sc.idxmax()] += 1
    sweep = []
    for tw in range(0, 61, 2):
        w = W.copy(); rest = W.drop("trophies"); w[rest.index] = rest / rest.sum() * (100 - tw); w["trophies"] = tw
        sc = (C.loc[R.index, W.index] * w).sum(axis=1)
        sweep.append((tw, R.name[sc.idxmax()], R.name[sc.sort_values().index[-2]]))

    P.to_csv(os.path.join(CSV, "draft_scores.csv"))
    T.to_csv(os.path.join(CSV, "title_credits.csv"), index=False)
    strength.round(2).to_csv(os.path.join(CSV, "region_strength.csv"))
    report(P, R, T, C, wins, sweep, strength, fk, s)


def report(P, R, T, C, wins, sweep, strength, fk, s):
    R = R.sort_values("score", ascending=False)
    L = ["# DRAFT TEST 1 (League, algorithm v3): not the final ranking", "",
         f"Data: Leaguepedia scoreboards, {s.Page.nunique()} tournaments, {int(s.G.sum() / 10):,} games (approx.), "
         f"{s.Link.nunique():,} players; pool {len(P)} players with {CFG['pool']['min_games']}+ games. "
         f"Faker is scored as the benchmark (100) and left out of the ranking.", "",
         "## Overall top 15 (Faker left out)", "",
         "| # | Player | Role | Regions | Years | Worlds | MSI | Domestic | Score | % of Faker | #1 in 1000 runs |",
         "|---|---|---|---|---|---|---|---|---|---|---|"]
    for i, (l, p) in enumerate(R.head(15).iterrows(), 1):
        L.append(f"| {i} | {p['name']} | {p.role} | {p.regions} | {p.years} | {p.worlds_titles} | {p.msi_titles} | {p.domestic_titles} | "
                 f"{p.score:.1f} | {p.vs_faker:.0f}% | {wins.get(l, 0) / 10:.1f}% |")
    f = P.loc[fk]
    L += ["", f"Benchmark: Faker score {f.score:.1f}, {f.worlds_titles} Worlds, {f.msi_titles} MSI, {f.domestic_titles} domestic; "
          f"category scores: " + ", ".join(f"{c} {f['c_' + c]:.0f}" for c in C.columns), ""]
    L += ["## Players ay named", "", "| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |", "|---|---|---|---|---|---|---|"]
    ranks = {l: i for i, l in enumerate(R.index, 1)}
    for n in ["Knight", "Viper", "Bin"]:
        for l in R.index[R.name == n]:
            p = R.loc[l]
            L.append(f"| {n} | {ranks[l]} | {p.score:.1f} | {p.worlds_titles} | {p.trophy_pts:.0f} | {p.c_big_stage:.0f} | {p.c_peak:.0f} ({int(p.peak_year)}) |")
    L += ["", "## Tipping point (trophy weight -> #2 overall, then #3)", ""]
    prev = None
    for tw, a, b in sweep:
        if a != prev:
            L.append(f"- trophy weight {tw}%: {a} first, {b} next")
            prev = a
    L += ["", "## Side-board: Most Decorated (pure trophy points, no carry share)", ""]
    for i, (l, p) in enumerate(R.sort_values("decorated", ascending=False).head(5).iterrows(), 1):
        L.append(f"{i}. {p['name']}: {p.decorated:.0f} pts ({p.worlds_titles} Worlds, {p.msi_titles} MSI, {p.domestic_titles} domestic)")
    L += ["", "## Side-board: Most Dominant (individual categories only)", ""]
    for i, (l, p) in enumerate(R.sort_values("dominant", ascending=False).head(5).iterrows(), 1):
        L.append(f"{i}. {p['name']} ({p.role}, {int(p.games)} games, peak {int(p.peak_year)}): {p.dominant:.1f}")
    L += ["", "## Every category top 5 (Faker left out)", ""]
    for c in C.columns:
        L.append(f"**{c}**: " + ", ".join(f"{R.loc[l, 'name']} {R.loc[l, 'c_' + c]:.0f}" for l in R.sort_values('c_' + c, ascending=False).head(5).index))
        L.append("")
    L += ["## Worlds title carry shares (credit 0.5 to 1.5)", ""]
    for (ev, team), d in T[(T.tier == "worlds") & (T.place == 1)].groupby(["event", "team"], sort=False):
        L.append(f"- {ev} {team}: " + ", ".join(f"{display(r.Link)} {r.credit:.2f}" for r in d.sort_values("credit", ascending=False).itertuples()))
    L += ["", "## Region strength by year (international game win share, best region = 1.0)", "",
          strength.round(2).to_markdown()]
    L += ["", "## Known gaps (fix before the final run)",
          "- Leaguepedia scoreboards have champion damage only from mid-2020, so Carry before 2020 is gold share alone. "
          "Oracle's Elixir has damage from 2014 but is blocked from the cloud (Cloudflare); it can be downloaded on ay's PC.",
          "- No laning numbers (gold or CS difference at 15 minutes) in Leaguepedia scoreboards; same fix.",
          "- Finals MVP and event MVP awards are not counted yet (Liquipedia list to build, as in the Valorant data).",
          "- Season 1 and 2 (2011-2012) have thin data and are discounted; LMS is the only minor region included.",
          "- Region strength comes from cross-region games at Worlds, MSI, First Stand and the 2020 Mid-Season Cup."]
    open(os.path.join(OUT, "draft-test-1.md"), "w").write("\n".join(L) + "\n")
    print("\n".join(L[:40]))


if __name__ == "__main__":
    main()
