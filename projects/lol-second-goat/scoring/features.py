"""Extra League numbers per player and tournament, added to the scoring table:
damage share, vision per minute, kills per minute (game-level Leaguepedia scoreboards, 2016 on),
laning gold / CS / XP difference at 15 and damage share before 2020 (Oracle's Elixir, by player, league and year)."""
import glob, os
import numpy as np
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
OE = os.path.join(ROOT, "data", "raw", "oe")


def game_level(redirect):
    f = os.path.join(CSV, "games_2016on.csv")
    if not os.path.exists(f):
        return pd.DataFrame()
    g = pd.read_csv(f, low_memory=False)
    g["Link"] = [redirect(l) for l in g.Link]
    for c in ["Kills", "Deaths", "Assists", "Gold", "CS", "Dmg", "Vision", "Min"]:
        g[c] = pd.to_numeric(g[c], errors="coerce")
    g.loc[g.Dmg <= 0, "Dmg"] = np.nan
    g.loc[g.Vision <= 0, "Vision"] = np.nan
    team = g.groupby(["GameId", "Team"]).agg(tdmg=("Dmg", lambda x: x.sum() if x.notna().all() else np.nan),
                                             tk=("Kills", "sum")).reset_index()
    g = g.merge(team, on=["GameId", "Team"])
    g["dshare"] = g.Dmg / g.tdmg
    a = g.groupby(["Page", "Link", "Team"]).agg(gK=("Kills", "sum"), gMin=("Min", "sum"), gVis=("Vision", "sum"),
                                                gVisMin=("Min", lambda x: x[g.loc[x.index, "Vision"].notna()].sum()),
                                                dshare=("dshare", "mean")).reset_index()
    a["vis_pm"] = a.gVis / a.gVisMin.replace(0, np.nan)
    return a[["Page", "Link", "Team", "vis_pm", "dshare"]]


def oe_table():
    files = sorted(glob.glob(os.path.join(OE, "oe_players_*.csv.gz")))
    if not files:
        return pd.DataFrame()
    cols = ["gameid", "league", "year", "playername", "teamname", "position", "damagetochampions",
            "golddiffat15", "csdiffat15", "xpdiffat15", "visionscore", "gamelength"]
    o = pd.concat([pd.read_csv(f, usecols=lambda c: c in cols, low_memory=False) for f in files], ignore_index=True)
    o = o[o.position != "team"].dropna(subset=["playername"])
    td = o.groupby(["gameid", "teamname"]).damagetochampions.transform("sum")
    o["dshare_oe"] = o.damagetochampions / td.replace(0, np.nan)
    if "visionscore" in o:
        o["vis_pm_oe"] = o.visionscore / (o.gamelength / 60)
    else:
        o["vis_pm_oe"] = np.nan
    o["key"] = o.playername.astype(str).str.lower()
    agg = o.groupby(["key", "year", "league"]).agg(gd15=("golddiffat15", "mean"), csd15=("csdiffat15", "mean"),
                                                   xpd15=("xpdiffat15", "mean"), dshare_oe=("dshare_oe", "mean"),
                                                   vis_pm_oe=("vis_pm_oe", "mean"), n_lane=("golddiffat15", "count")).reset_index()
    return agg


def add(s, display, oe_league, redirect):
    gl = game_level(redirect)
    if not gl.empty:
        s = s.merge(gl, on=["Page", "Link", "Team"], how="left")
    else:
        s["vis_pm"] = np.nan; s["dshare"] = np.nan
    o = oe_table()
    for c in ["gd15", "csd15", "xpd15"]:
        s[c] = np.nan
    if not o.empty:
        lut = o.set_index(["key", "year", "league"])
        hit = 0
        for i in s.index:
            key = display(s.at[i, "Link"]).lower()
            for lg in oe_league.get(s.at[i, "League"], []):
                k = (key, s.at[i, "year"], lg)
                if k in lut.index:
                    r = lut.loc[k]
                    if r.n_lane >= 3:
                        s.at[i, "gd15"], s.at[i, "csd15"], s.at[i, "xpd15"] = r.gd15, r.csd15, r.xpd15
                    if pd.isna(s.at[i, "dshare"]):
                        s.at[i, "dshare"] = r.dshare_oe
                    if pd.isna(s.at[i, "vis_pm"]):
                        s.at[i, "vis_pm"] = r.vis_pm_oe
                    hit += 1
                    break
        print(f"Oracle's Elixir matched {hit} of {len(s)} player-event rows (laning, damage share, vision)")
    return s
