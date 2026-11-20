"""DRAFT scoring for "the 2nd greatest League player after Faker" (algorithm v3, see config/weights.yaml)."""
import json, os, re, sys
import numpy as np
import pandas as pd
import yaml
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import features

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = yaml.safe_load(open(os.environ.get("WEIGHTS") or os.path.join(ROOT, "config", "weights.yaml")))
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


_RD = {}
FS = int(os.environ.get("FAKER_SPLIT", 2019))   # last year of the first Faker
FA, FB = f"Faker 2013-{FS % 100:02d}", f"Faker {FS + 1}-26"


def redirect(l):
    if not _RD:
        rd = pd.read_csv(os.path.join(CSV, "player_redirects.csv"), dtype=str).dropna()
        _RD["exact"] = dict(zip(rd.AllName, rd.OverviewPage))
        _RD["lower"] = {k.lower(): v for k, v in _RD["exact"].items()}
    return _RD["exact"].get(l, _RD["lower"].get(str(l).lower(), l))


def load():
    t = pd.read_csv(os.path.join(CSV, "tournaments.csv"), dtype=str).fillna("")
    s = pd.read_csv(os.path.join(CSV, "player_event_stats.csv"))
    s["TCS"] = np.nan
    eg_path = os.path.join(CSV, "early_games.csv")
    if os.path.exists(eg_path):
        eg = pd.read_csv(eg_path)
        for c in ["Kills", "Gold", "CS"]:
            eg[c] = pd.to_numeric(eg[c], errors="coerce")
        tm = eg.groupby(["GameId", "Team"]).agg(tk=("Kills", "sum"), tcs=("CS", "sum"), tg=("Gold", "sum"),
                                                 gold_n=("Gold", "count"), n=("Link", "size")).reset_index()
        tm.loc[tm.gold_n < tm.n, "tg"] = np.nan          # team gold only when all five have gold
        eg = eg.merge(tm, on=["GameId", "Team"])
        agg = eg.groupby(["Page", "Link", "Role", "Team"]).agg(eTK=("tk", "sum"), eTCS=("tcs", "sum"),
                                                               eTG=("tg", lambda x: x.sum() if x.notna().all() else np.nan)).reset_index()
        s = s.merge(agg, on=["Page", "Link", "Role", "Team"], how="left")
        s["TK"] = s.TK.where(s.TK > 0, s.eTK)
        s["TG"] = s.TG.where(s.TG > 0, s.eTG)
        s["TCS"] = s.eTCS
        s = s.drop(columns=["eTK", "eTCS", "eTG"])
    s["Link"] = [redirect(l) for l in s.Link]
    s = s.groupby(["Page", "Link", "Role", "Team"], as_index=False).agg(
        {**{c: lambda x: x.sum(min_count=1) for c in ["G", "W", "K", "D", "A", "Gold", "CS", "Dmg", "TK", "TG", "Min", "TCS"]}, "First": "min", "Last": "max"})
    s = s.merge(t[["OverviewPage", "League", "Name", "IsPlayoffs"]], left_on="Page", right_on="OverviewPage", how="left")
    s["year"] = s.First.str[:4].astype(int)
    s["kind"] = np.where(s.League.isin(INTL.keys()), "intl", "dom")
    s["region"] = s.League.map(REGION).fillna("INTL")
    s["role"] = s.Role.map(ROLE)
    s = s[s.role.notna() & (s.G > 0)].copy()
    for c in ["K", "D", "A", "Gold", "CS", "Dmg", "TK", "TG", "Min", "W", "TCS"]:
        s[c] = pd.to_numeric(s[c], errors="coerce")
    s.loc[s.Dmg <= 0, "Dmg"] = np.nan
    s = fill_damage(s)
    s.loc[s.Gold <= 0, "Gold"] = np.nan
    s.loc[s.TG <= 0, "TG"] = np.nan
    s.loc[s.TK <= 0, "TK"] = np.nan
    s.loc[s.Min <= 0, "Min"] = np.nan
    s = features.add(s, display, OE_LEAGUE, redirect)
    return t, s


OE_LEAGUE = {"World Championship": ["WLDs"], "Mid-Season Invitational": ["MSI"], "LoL The Champions": ["OGN", "LCK"],
             "LoL Champions Korea": ["LCK"], "Tencent LoL Pro League": ["LPL"],
             "Europe League Championship Series": ["EU LCS"], "LoL EMEA Championship": ["LEC", "EU LCS"],
             "North America League Championship Series": ["NA LCS"], "League of Legends Championship Series": ["LCS", "NA LCS"],
             "LoL Master Series": ["LMS"], "Mid-Season Cup 2020": ["LCK", "LPL"], "First Stand": ["FST"],
             "League of Legends Championship of The Americas North": ["LTA N", "LCS"],
             "League of Legends Championship of The Americas": ["LTA", "LTA N", "LTA S"]}


def fill_damage(s):
    """Leaguepedia has champion damage only from mid-2020. Fill earlier rows with the player's damage per minute in that
    league and year from Oracle's Elixir (data/raw/oe, downloaded on ay's PC 17 Nov 2026), matched on name, league, year."""
    f = os.path.join(ROOT, "data", "raw", "oe", "oe_players_2014_2020.csv.gz")
    if not os.path.exists(f):
        return s
    o = pd.read_csv(f, usecols=["league", "year", "playername", "gamelength", "damagetochampions"], low_memory=False)
    o = o.dropna(subset=["damagetochampions", "gamelength", "playername"])
    o["key"] = o.playername.astype(str).str.lower()
    a = o.groupby(["key", "year", "league"]).agg(dmg=("damagetochampions", "sum"), sec=("gamelength", "sum")).reset_index()
    a["dpm_oe"] = a.dmg / (a.sec / 60)
    lut = {(r.key, r.year, r.league): r.dpm_oe for r in a.itertuples()}
    need = s.Dmg.isna() & s.Min.notna()
    filled = 0
    for i in s.index[need]:
        key = display(s.at[i, "Link"]).lower()
        for lg in OE_LEAGUE.get(s.at[i, "League"], []):
            v = lut.get((key, s.at[i, "year"], lg))
            if v is not None:
                s.at[i, "Dmg"] = v * s.at[i, "Min"]; filled += 1
                break
    print(f"damage filled from Oracle's Elixir: {filled} of {int(need.sum())} player-event rows without damage")
    return s


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
    out, field = {}, {}
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
        field[y] = {r: float(np.mean([1 / (1 + np.exp(th[o] - v)) for o in regs if o != r])) * 100 for r, v in th.items()}
    tab = pd.DataFrame(out).T.reindex(range(s.year.min(), s.year.max() + 1))
    tab = tab.ffill().bfill()
    for r in REGION.values():
        if r not in tab.columns:
            tab[r] = 0.5
    pd.DataFrame(field).T.sort_index().round(1).to_csv(os.path.join(CSV, "region_vs_field.csv"))
    return tab.clip(0.2, 1.0)


METRICS = ["kda", "kp", "dpm", "gold_share", "cs_share", "low_deaths", "kills_pm", "assists_pm", "dshare", "vis_pm",
           "gd15", "csd15", "xpd15"]


RATING_FEATS = ["kda", "kp", "dpm", "gold_share", "low_deaths", "kills_pm", "assists_pm", "dshare", "vis_pm",
                "gd15", "csd15", "xpd15", "gap"]


def zscores(s, use_rating=True):
    s["kda"] = (s.K + s.A) / s.D.clip(lower=1)
    s["kp"] = (s.K + s.A) / s.TK.replace(0, np.nan)
    s["dpm"] = s.Dmg / s.Min
    s["gold_share"] = s.Gold / s.TG.replace(0, np.nan)
    s["cs_share"] = s.CS / s.TCS.replace(0, np.nan)
    s["low_deaths"] = -(s.D / s.Min.fillna(s.G * 32))
    s["kills_pm"] = s.K / s.Min.fillna(s.G * 32)
    s["assists_pm"] = s.A / s.Min.fillna(s.G * 32)
    # each stat is measured against the same role, year AND league (LPL games are faster and bloodier than LCK games,
    # so pooling leagues inflated LPL kill and damage numbers); region strength then handles the leagues' level
    s["grp"] = s.region if CFG.get("z_by_league", True) else "all"
    ref = s[s.G >= 3]
    for m in METRICS:
        g = ref.groupby(["role", "year", "grp"])
        mu = g.apply(lambda d: np.average(d[m].dropna(), weights=d.loc[d[m].notna(), "G"]) if d[m].notna().any() else np.nan, include_groups=False)
        sd = g[m].std()
        key = list(zip(s.role, s.year, s.grp))
        s["z_" + m] = (s[m].values - mu.reindex(key).values) / sd.reindex(key).values
    s["z_gold_share"] = s.z_gold_share.fillna(s.z_cs_share)   # early games without gold: CS share stands in
    for name, cols in [("impact", CFG["impact"]["impact"]), ("carry", CFG["impact"]["carry"]), ("clean", CFG["impact"]["clean"])]:
        s["z_" + name] = s[["z_" + c for c in cols]].mean(axis=1, skipna=True)
    for name, cols in CFG.get("league_stats", {}).items():
        s["z_" + name] = s[["z_" + c for c in cols]].mean(axis=1, skipna=True)
    # gap to teammates: own impact minus the games-weighted impact of the rest of the roster at that event
    zi = s.z_impact.fillna(0) * s.G
    tot = s.assign(zi=zi).groupby(["Page", "Team"]).agg(zi=("zi", "sum"), g=("G", "sum"))
    key = list(zip(s.Page, s.Team))
    others_g = tot.g.reindex(key).values - s.G.values
    s["mates_impact"] = (tot.zi.reindex(key).values - zi.values) / np.where(others_g > 0, others_g, np.nan)
    s["z_gap"] = s.z_impact - s.mates_impact
    f = os.path.join(ROOT, "config", "fitted_season_weights.json")
    if use_rating and os.path.exists(f):
        # season rating: the stat blend fitted to All-Pro selections (scoring/validate.py), win rate left out
        w = json.load(open(f))["weights"]
        r = sum(w[c] * s["z_" + c].fillna(0).clip(-4, 4) for c in RATING_FEATS)
        ref = s.G >= 3
        mu = r[ref].groupby([s.role[ref], s.year[ref], s.grp[ref]]).mean()
        sd = r[ref].groupby([s.role[ref], s.year[ref], s.grp[ref]]).std()
        key = list(zip(s.role, s.year, s.grp))
        s["z_impact_v3"] = s.z_impact
        s["z_impact"] = (r.values - mu.reindex(key).values) / sd.reindex(key).values
        zi = s.z_impact.fillna(0) * s.G
        tot = s.assign(zi=zi).groupby(["Page", "Team"]).agg(zi=("zi", "sum"), g=("G", "sum"))
        s["mates_impact"] = (tot.zi.reindex(key2 := list(zip(s.Page, s.Team))).values - zi.values) / np.where(others_g > 0, others_g, np.nan)
        s["z_gap"] = s.z_impact - s.mates_impact
    return s


def opponent_adjust(s):
    """A good game against a strong team is worth more. Each team's average opponent Elo at an event (2016 on,
    scoring/games.py) moves the season rating by the slope the data itself shows: inside the same player and year,
    how much his rating drops per Elo point of opposition. Earlier events stay as they are."""
    f = os.path.join(CSV, "event_opp.csv")
    if not os.path.exists(f):
        return s
    ev = pd.read_csv(f)
    s = s.drop(columns=[c for c in ["opp_elo"] if c in s.columns]).merge(ev[["Page", "Team", "opp_elo"]], on=["Page", "Team"], how="left")
    d = s[(s.G >= 3) & s.opp_elo.notna() & s.z_impact.notna()].copy()
    for c in ["opp_elo", "z_impact"]:
        d[c + "_c"] = d[c] - d.groupby(["Link", "year"])[c].transform("mean")
    b = float((d.opp_elo_c * d.z_impact_c * d.G).sum() / (d.opp_elo_c ** 2 * d.G).sum())   # within-player slope
    s["opp_slope"] = b
    s["z_impact_raw"] = s.z_impact
    s["z_impact"] = s.z_impact - b * (s.opp_elo.fillna(1500) - 1500)
    print(f"opponent adjustment: {-b * 100:.3f} SD per 100 Elo of opposition")
    return s


def wmean(d, col):
    m = d[col].notna()
    return np.average(d.loc[m, col], weights=d.loc[m, "G"]) if m.any() else np.nan


def shrink(x, n, k):
    return x * n / (n + k)


def bucket(table, place):
    keys = [k for k in table if k <= place]
    return table[max(keys)] if keys else 0


def titles(t, s, strength):
    r = pd.read_csv(os.path.join(CSV, "results_top16.csv"), dtype=str).fillna("")
    r = r[(r.Showmatch != "1") & (pd.to_numeric(r.PlaceN, errors="coerce") <= 16) & (r.Team != "")]
    if os.environ.get("VARIANT") == "geng_wins":   # what-if (ay 18 Nov): Gen.G win the Worlds 2026 final, BLG runners-up
        m = r.Page == "2026 Season World Championship"
        r.loc[m & (r.Team == "Gen.G"), ["Place", "PlaceN"]] = "1"
        r.loc[m & (r.Team == "Bilibili Gaming"), ["Place", "PlaceN"]] = "2"
    bad = re.compile(r"Play-In|Road to MSI|Showmatch|Regional|Qualif|Preseason|All Star|LPPL|Promotion|Rounds", re.I)
    r = r[~r.Name.str.contains(bad)]
    r["year"] = r.Date.str[:4].astype(int)
    if os.environ.get("CUTOFF"):
        r = r[r.year <= int(os.environ["CUTOFF"])]
    tp = CFG["trophy_points"]
    # leagues that crown several split champions a year plus one season champion (LEC 2023+, LPL 2025+, LCK Cup):
    # the season title counts in full, the split titles at half
    final_re = re.compile(r"Season Finals|Grand Finals|Season Playoffs|Championship", re.I)
    has_final = {(e.League, e.year) for e in r.itertuples() if final_re.search(e.Name) and e.League in REGION}
    # title difficulty (ay, 18 Nov: modest 0.85x to 1.15x): how strong the teams a champion met at that event were
    # (average opponent Elo, 2016 on), ranked against other titles of the same tier (domestic: same region, so region
    # strength is not counted twice). Earlier titles stay at 1.0.
    path_mult = {}
    f = os.path.join(CSV, "event_opp.csv")
    if os.path.exists(f):
        eo = pd.read_csv(f)
        # Worlds and MSI games sit on a "/Main Event" sub-page while results sit on the parent page:
        # roll every sub-page up to its parent, games-weighted (bug fixed 18 Nov: Worlds titles were all left at 1.0)
        eo["Page"] = eo.Page.str.replace(r"/Main Event$", "", regex=True)
        eo["w"] = eo.opp_elo * eo.games
        eo = eo.groupby(["Page", "Team"]).agg(w=("w", "sum"), games=("games", "sum"))
        ev = eo.w / eo.games
        champs = r[pd.to_numeric(r.PlaceN, errors="coerce") == 1].copy()
        champs["opp"] = [ev.get((pg, tm), np.nan) for pg, tm in zip(champs.Page, champs.Team)]
        champs["grp"] = [INTL.get(l, "dom_" + REGION.get(l, "x")) for l in champs.League]
        champs = champs.dropna(subset=["opp"])
        champs["pct"] = champs.groupby("grp").opp.rank(pct=True)
        lo, hi = CFG.get("title_difficulty", [0.85, 1.15])
        for row in champs.itertuples():
            path_mult[(row.Page, row.Team)] = lo + (hi - lo) * (row.pct - 0.5 / max(1, (champs.grp == row.grp).sum())) if (champs.grp == row.grp).sum() > 1 else 1.0
    rows = []
    yr_imp = s.groupby(["Link", "year"]).apply(lambda d: wmean(d, "z_impact"), include_groups=False).to_dict()
    for _, e in r.iterrows():
        if e.League in INTL:
            tier = INTL[e.League]
            if "/" in e.Page:      # parent page only (Main Event / Play-In sub-pages repeat the result)
                continue
            pts = bucket(tp[tier], int(e.PlaceN)) * (tp["early_worlds"].get(e.year, 1.0) if tier == "worlds" else 1.0)
        elif e.League in REGION:
            cup = e.Name.startswith("LCK Cup") or (e.League == "Tencent LoL Pro League" and "Split" in e.Name and e.IsPlayoffs == "1") \
                or ((e.League, e.year) in has_final and not final_re.search(e.Name) and e.IsPlayoffs == "1")
            champions_era = e.League == "LoL The Champions" and e.year < 2015
            if not (e.IsPlayoffs == "1" or cup or champions_era):
                continue
            reg = REGION[e.League]
            tier = "domestic"
            pts = bucket(tp["domestic"], int(e.PlaceN)) * strength.loc[e.year, reg] * (tp["domestic_cup"] if cup else 1.0)
            mt = tp.get("measured_title", {})
            if reg in mt:   # halfway blend (ay 18 Nov): our value and the measured difficulty, title = (20 x strength + measured) / 2
                b, ours = tp.get("blend", 0.5), tp["domestic"][1] * strength.loc[e.year, reg]
                pts *= (1 - b) + b * mt[reg] / ours
        else:
            continue
        if pts <= 0:
            continue
        ev = s[((s.Page == e.Page) | s.Page.str.startswith(e.Page + "/")) & (s.Team == e.Team)]
        if ev.empty:
            continue
        per = ev.groupby("Link").agg(G=("G", "sum")).reset_index()
        need = tp["min_share_of_games"] * per.G.max()
        zc = "z_impact"
        if os.environ.get("CREDIT_SUP"):   # what-if (ay 20 Nov): support play in the title share, half and half
            ev = ev.assign(z_credit=0.5 * ev.z_impact + 0.5 * ev[["z_vis_pm", "z_kp", "z_assists_pm"]].mean(axis=1, skipna=True).fillna(ev.z_impact))
            zc = "z_credit"
        imp = ev.groupby("Link").apply(lambda d: wmean(d, zc), include_groups=False)
        team_mean = imp[per.set_index("Link").G >= need].mean()
        path = path_mult.get((e.Page, e.Team), 1.0)
        for _, p in per.iterrows():
            if p.G < need:
                continue
            c = CFG["credit"]
            diff = shrink(imp[p.Link] - team_mean, p.G, c["shrink_games"]) if pd.notna(imp[p.Link]) else 0
            credit = float(np.clip(1 + c["alpha"] * diff, c["min"], c["max"]))
            c2 = CFG.get("lead", c)
            diff2 = shrink(imp[p.Link] - team_mean, p.G, c2["shrink_games"]) if pd.notna(imp[p.Link]) else 0
            lead = float(np.clip(1 + c2["alpha"] * diff2, c2["min"], c2["max"]))
            # teammates' strength = their whole-year rating (one event is too noisy: BLG's stars look average
            # in a 15-game Worlds box score, which wrongly made Knight a solo carrier)
            mates = np.nanmean([yr_imp.get((l, e.year), np.nan) for l in per[per.G >= need].Link if l != p.Link] or [np.nan])
            rows.append(dict(Link=p.Link, event=e.Name, page=e.Page, team=e.Team, year=e.year, tier=tier,
                             place=int(e.PlaceN), base=pts * path, path=path, credit=credit, lead=lead, pts=pts * path * credit, G=p.G,
                             mates=float(mates) if pd.notna(mates) else 0.0))
    return pd.DataFrame(rows)


def mvps(s):
    """Worlds / MSI / First Stand MVP awards from Liquipedia (data/manual/mvps.csv), full points, no carry share."""
    f = os.path.join(ROOT, "data", "manual", "mvps.csv")
    if not os.path.exists(f):
        return pd.DataFrame()
    m = pd.read_csv(f)
    if os.environ.get("VARIANT") == "geng_wins":   # the Finals MVP goes to Gen.G's mid laner in the what-if
        m.loc[(m.league == "World Championship") & (m.year == 2026), "player"] = "Chovy"
    pts = CFG["trophy_points"]["awards"]
    intl = s[s.kind == "intl"]
    rows = []
    for a in m.itertuples():
        nm = intl.Link.map(display).str.lower().str.replace(r" 20\d\d-\d\d$", "", regex=True)
        cand = intl[(intl.year == a.year) & (intl.League == a.league) & (nm == a.player.lower())]
        if cand.empty:
            print("MVP not matched:", a)
            continue
        link = cand.groupby("Link").G.sum().idxmax()
        p = pts[a.key]
        rows.append(dict(Link=link, event=f"{a.league} {a.year} {a.award}", page="", team="", year=a.year,
                         tier="award", place=0, base=p, credit=1.0, pts=p, G=0))
    return pd.DataFrame(rows)


def recognition(s, pool, strength=None):
    """Intangibles proxy 1: what voters saw. All-Pro points (1st 3, 2nd 2, 3rd 1) plus 3 per season MVP, per split
    played in seasons where Leaguepedia records the vote (LCK/LPL from 2020, EU/NA from 2015), shrunk toward zero.
    Players with no covered split get the pool median, so missing votes neither help nor hurt."""
    f = os.path.join(CSV, "individual_achievements.csv")
    a = pd.read_csv(f, dtype=str).fillna("")
    a["Link"] = [redirect(l) for l in a.Player]
    # major leagues only: academy and minor region picks (LCK CL, LTA South) have no games behind them here (audit 18 Nov)
    a = a[a.OverviewPage.str.match(r"^(LCK|LPL|LEC|LCS|EU LCS|NA LCS|Champions|LMS|LTA North)/")]
    if os.environ.get("CUTOFF"):
        a = a[a.OverviewPage.str.extract(r"(20\d\d)")[0].astype(float).fillna(0) <= int(os.environ["CUTOFF"])]
    if os.environ.get("VARIANT") == "split_faker":
        yr = a.OverviewPage.str.extract(r"(20\d\d)")[0].astype(float)
        m = a.Link == "Faker"
        a.loc[m, "Link"] = np.where(yr[m] <= FS, FA, FB)
    tier = {"All Pro Team": 3, "1st All-Pro Team": 3, "2nd All Pro Team": 2, "2nd All-Pro Team": 2, "3rd All Pro Team": 1, "3rd All-Pro Team": 1}
    ap = a[a.Display.isin(tier)].assign(pts=lambda d: d.Display.map(tier))
    covered = set(ap.OverviewPage)
    mv = a[a.Display.isin(["Most Valuable Player", "Player of the Split", "Regular Season MVP", "MVP"])].assign(pts=3)
    if AUDIT20:
        # audit 20 Nov: (1) one MVP per player per split: Leaguepedia lists some MVPs twice under two names
        # ("Most Valuable Player" + "Player of the Split": Chovy 2024 Spring, Keria 2023 Spring, Ruler 2022 Summer,
        # Bdd 2020 Spring), which counted the same honour twice. (2) season MVPs only, as documented: playoff-page
        # MVPs are finals MVPs, recorded that way only for LCK 2015-2020 ("Finals MVP" rows after that were never
        # counted), so they favoured one era.
        mv = mv[~mv.OverviewPage.str.contains("Playoff|Finals", regex=True)]
        mv = mv.groupby(["OverviewPage", "Link"]).pts.max().reset_index()
    pts = pd.concat([ap.groupby(["OverviewPage", "Link"]).pts.max().reset_index(), mv[["OverviewPage", "Link", "pts"]]])
    tot = pts.groupby("Link").pts.sum().reindex(pool).fillna(0)
    played = s[s.Page.isin(covered) & s.Link.isin(pool)].groupby("Link").Page.nunique().reindex(pool).fillna(0)
    # v13 (ay 18 Nov): the LCK held no All-Pro vote before 2020 and the LPL none before 2020, so a prime spent
    # there counted nothing. Each regular-season split of a major league in a year with no vote gets a model
    # All-Pro instead: the top three at each role by impact rating (1st 3, 2nd 2, 3rd 1), among players with at
    # least half the role's most games. Real votes are used wherever they exist.
    MAJOR = r"^(LCK|LPL|LEC|LCS|EU LCS|NA LCS|Champions|LMS|LTA North)/"
    lg = lambda pg: pg.str.extract(MAJOR)[0].replace({"Champions": "LCK"}) + " " + pg.str.extract(r"(20\d\d)")[0]
    voted = set(lg(pd.Series(sorted(covered))))
    rs = s[(s.kind == "dom") & s.Page.str.match(MAJOR) & ~s.Page.str.contains("Playoff|Preseason|Cup|Road to|Regional|Qualifier|Finals|Promotion", regex=True)].copy()
    if AUDIT20:
        # audit 20 Nov: a league-year with a vote for only one of its two splits (LPL 2020, EU/NA LCS 2015, LMS 2019)
        # left the other split with no honours at all, so that split gets a model All-Pro like any unvoted split.
        # Only the two-split years whose sibling split has a vote are filled; other formats name their vote pages
        # differently (LEC 2023-24 votes sit on season pages), so they stay covered by league and year.
        sib = rs.Page.str.replace("Spring Season", "@").str.replace("Summer Season", "Spring Season").str.replace("@", "Summer Season")
        gap = rs.Page.str.contains(r"(Spring|Summer) Season$", regex=True) & sib.isin(covered) & ~rs.Page.isin(covered)
        rs = rs[~lg(rs.Page).isin(voted) | gap]
    else:
        rs = rs[~lg(rs.Page).isin(voted)]
    rs = rs[rs.G >= rs.groupby(["Page", "role"]).G.transform("max") * 0.5]
    rs["rk"] = rs.groupby(["Page", "role"]).a_impact.rank(ascending=False, method="first")
    filled = rs[rs.rk <= 3].assign(pts=lambda d: 4 - d.rk)[["Page", "Link", "pts"]].rename(columns={"Page": "OverviewPage"})
    if V15 and strength is not None:
        # v15 (ay 20 Nov): an honour is worth what its league is worth. An LEC or LCS All-Pro vote (or MVP) counts
        # at that league's strength that year (LCK about 1.0, LEC/LCS about 0.3 to 0.6), the same scale the model
        # already uses for league titles and stats.
        RG = {"Champions": "LCK", "LCK": "LCK", "LPL": "LPL", "LEC": "LEC", "EU LCS": "LEC", "LCS": "LCS", "NA LCS": "LCS",
              "LMS": "LMS", "LTA North": "LCS"}
        def wtd(d):
            rg = d.OverviewPage.str.extract(r"^([^/]+)/")[0].map(RG)
            yr = d.OverviewPage.str.extract(r"(20\d\d)")[0].astype(float)
            w = [strength.loc[int(y), r] if (r in strength.columns and y == y and int(y) in strength.index) else 1.0 for y, r in zip(yr, rg)]
            return d.assign(pts=d.pts * np.array(w))
        pts, filled = wtd(pts), wtd(filled)
        tot = pts.groupby("Link").pts.sum().reindex(pool).fillna(0)
    tot = tot.add(filled.groupby("Link").pts.sum().reindex(pool).fillna(0), fill_value=0)
    played = played + rs[rs.Link.isin(pool)].groupby("Link").Page.nunique().reindex(pool).fillna(0)
    # v13: honours are counted in full, the way All-NBA selections are counted in a Hall of Fame case. A rate per
    # split punished a long career: every late season with no vote watered down the ones he won at his peak.
    if FUTURE_CFG:   # what-if seasons win the honours of the season they copy
        l, base, sy = FUTURE_CFG["link"], int(FUTURE_CFG.get("from_year", 2026)), FUTURE_CFG.get("src_year")
        allp = pd.concat([pts, filled])
        allp["yr"] = allp.OverviewPage.str.extract(r"(20\d\d)")[0].astype(float)
        mine = allp[allp.Link == l]
        add = sum(mine[mine.yr == (sy or (base - 1 if i % 2 else base))].pts.sum() for i in range(len(FUTURE_CFG["worlds"])))
        if l in tot.index:
            tot[l] += add
    rate = tot.copy()
    rate[played == 0] = np.nan
    return rate.fillna(rate.median()), tot, played


def team_lift(s, pool, strength):
    """Intangibles proxy 2: does the team win more with him? For each team-year he played, the team's win rate with
    him minus the same team's win rate in the two years before and after without him (domestic events, region-scaled),
    games-weighted and shrunk. Noisy: roster moves rarely change one player at a time."""
    d = s[s.kind == "dom"]
    team = d.groupby(["Page", "Team"]).agg(W=("W", "max"), G=("G", "max"), year=("year", "first"), region=("region", "first")).reset_index()
    roster = d.groupby(["Page", "Team"]).Link.agg(set)
    out = {}
    for l in pool:
        mine = d[d.Link == l][["Page", "Team", "year"]].drop_duplicates()
        if mine.empty:
            out[l] = np.nan; continue
        diffs, ws = [], []
        for tm, yrs in mine.groupby("Team").year:
            yrs = set(yrs)
            near = team[(team.Team == tm) & team.year.between(min(yrs) - 2, max(yrs) + 2)]
            w_ = near[[l in roster.get((p, tm), set()) for p in near.Page]]
            wo = near[[l not in roster.get((p, tm), set()) for p in near.Page]]
            if w_.G.sum() < 10 or wo.G.sum() < 10:
                continue
            diffs.append(w_.W.sum() / w_.G.sum() - wo.W.sum() / wo.G.sum()); ws.append(min(w_.G.sum(), wo.G.sum()))
        out[l] = shrink(np.average(diffs, weights=ws), sum(ws), 40) if diffs else np.nan
    r = pd.Series(out)
    return r.fillna(r.median())   # never played without his team (Faker): no evidence either way, so the pool median


def percentile(x):
    """Category score. Percentiles squash every elite player to 99-100, so the gaps at the top vanish; the default
    is now a linear scale: pool median = 50, the best player = 100 (below the median it keeps going down, floor 0)."""
    if CFG.get("scale", "linear") == "percentile":
        return x.rank(pct=True) * 100
    x = x.astype(float)
    med, top = x.median(), x.max()
    if not np.isfinite(top) or top == med:
        return x.rank(pct=True) * 100
    return (50 + 50 * (x - med) / (top - med)).clip(lower=0)



def add_future(s, T, fut):
    """What-if (ay 18 Nov): play a player's next seasons at his current level, so every part moves with the titles.
    fut = {"link": ..., "worlds": [1, 0, ...] one flag per future season, "msi": [...] optional}.
    Each future season copies his 2025 and 2026 seasons in turn (stats, international games, opponents already
    adjusted); trophies per season = his 2024-26 average from domestic play, plus the Worlds/MSI titles asked for,
    at his own average title credit."""
    l, base = fut["link"], int(fut.get("from_year", 2026))
    sy = fut.get("src_year")   # dream seasons: every future season copies one chosen year (his title year)
    src = {y: s[(s.Link == l) & (s.year == y)] for y in {base - 1, base, sy or base}}
    mine = T[T.Link == l]
    credit = mine[mine.place == 1].credit.mean() if (mine.place == 1).any() else 1.0
    dom = mine[(mine.tier == "domestic") & mine.year.between(base - 2, base)].pts.sum() / 3
    if "dom_pts" in fut:   # silverware what-if: exactly the league titles asked for (0 = none)
        dom = float(fut["dom_pts"])
    elif fut.get("dream"):   # a title season at home: his best domestic year of the last three, not his average
        dom = mine[(mine.tier == "domestic") & mine.year.between(base - 2, base)].groupby("year").pts.sum().max()
    tp = CFG["trophy_points"]
    add_s, add_t = [], []
    for i, w in enumerate(fut["worlds"]):
        y = base + 1 + i
        r = src[sy or (base - 1 if i % 2 else base)].copy()
        if AUDIT20:   # audit 20 Nov: a copied season only keeps the international events that season is asked to win
            m_ = fut.get("msi")
            if not (m_ and m_[i]):
                r = r[~r.League.isin(["Mid-Season Invitational", "First Stand"])]
            if not w:
                r = r[r.League != "World Championship"]
        r["year"] = y
        r["Page"] = r.Page + f" (future {y})"
        add_s.append(r)
        rows = [("domestic", dom, 1)] if dom > 0 else []
        if w:
            rows.append(("worlds", tp["worlds"][1], 1))
        if fut.get("msi") and fut["msi"][i]:
            rows.append(("msi", tp["msi"][1], 1))
        for tier, b, place in rows:
            add_t.append(dict(Link=l, event=f"future {tier} {y}", page=f"future {tier} {y}", team="future", year=y, tier=tier,
                              place=place, base=b, path=1.0, credit=credit, lead=credit, pts=b * (1 if tier == "domestic" else credit),
                              G=0, mates=0.0, cast=0.0, carry_pts=0.0))
    s = pd.concat([s] + add_s, ignore_index=True)
    T = pd.concat([T, pd.DataFrame(add_t)], ignore_index=True)
    # clutch and plus-minus: the same seasons copied (a Worlds-winning season copies his latest title season's series)
    global FUTURE_CFG
    FUTURE_CFG = dict(fut, credit=credit)
    return s, T

FUTURE_CFG = None
AUDIT20 = os.environ.get("AUDIT20", "1") != "0"
V15 = os.environ.get("V15", "1") != "0"   # ay's three fan-check fixes of 20 Nov (V15=0 reproduces v14.1)   # audit fixes of 20 Nov (AUDIT20=0 reproduces v14 exactly)

def main():
    variant = os.environ.get("VARIANT", "")
    if os.environ.get("LONG_CAP"):
        CFG["longevity"]["year_cap"] = float(os.environ["LONG_CAP"])
    if os.environ.get("CLUTCH_MODE"):
        CFG["clutch_mode"] = os.environ["CLUTCH_MODE"]
    if variant == "career_avg":
        CFG["best_years"] = 0
    cache = os.path.join(ROOT, "data", "raw", "loaded.pkl")
    if os.environ.get("REUSE") and os.path.exists(cache):
        t, s = pd.read_pickle(cache)
    else:
        t, s = load()
        pd.to_pickle((t, s), cache)
    CUT = int(os.environ["CUTOFF"]) if os.environ.get("CUTOFF") else None
    if CUT:   # career so far: everything as it stood at the end of year CUT (rank race, ay 18 Nov)
        s = s[s.year <= CUT].copy()
        variant = variant or f"cut{CUT}"
    if variant == "split_faker":
        # ay's twist: Faker's career as two players, split into even halves by years (ay 18 Nov 17:23):
        # 2013-19 (Worlds 2013, 2015, 2016) and 2020-26 (Worlds 2023, 2024, 2025)
        s = s.copy()
        m = s.Link == "Faker"
        s.loc[m, "Link"] = np.where(s.loc[m, "year"] <= FS, FA, FB)
    strength = region_strength(s)
    if variant == "no_region":
        strength[:] = 1.0
    s = zscores(s)
    s = opponent_adjust(s)
    pen = CFG["impact"]["region_penalty_sd"]
    st = np.array([strength.loc[y, r] if r in strength.columns else 1.0 for y, r in zip(s.year, s.region)])
    s["strength"] = np.where(s.kind == "dom", st, 1.0)
    for c in ["impact", "carry", "clean"]:
        s["a_" + c] = s["z_" + c] - pen * (1 - s.strength)
    s["a_win"] = (s.W / s.G - 0.5) * s.strength
    for c in CFG.get("league_stats", {}):
        s["a_" + c] = s["z_" + c] - pen * (1 - s.strength)
    T = titles(t, s, strength)
    if CUT:
        T = T[T.year <= CUT]
    FUT = json.load(open(os.environ["FUTURE"])) if os.environ.get("FUTURE") else None
    if FUT:
        s, T = add_future(s, T, FUT)

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
    N = CFG.get("best_years", 0)

    def best_years(d_all, col, kk, pad=False):
        """Per calendar year: games-weighted value, shrunk toward the role average. Career mode (N=0) averages
        every game; best-years mode averages the player's best N years, so playing on past a peak never lowers
        a score (longevity is scored on its own)."""
        if not N:
            return shrink(d_all.groupby("Link").apply(lambda d: wmean(d, col), include_groups=False), d_all.groupby("Link").G.sum(), kk)
        y = d_all.groupby(["Link", "year"]).apply(lambda d: pd.Series({"v": wmean(d, col), "G": d.G.sum()}), include_groups=False).reset_index()
        y["v"] = shrink(y.v.fillna(0), y.G, kk)
        if pad or CFG.get("pad_short_careers"):   # missing years count as average (0): sustained form, not one hot event
            return y.groupby("Link").v.apply(lambda v: v.nlargest(N).sum() / N)
        return y.groupby("Link").v.apply(lambda v: v.nlargest(N).mean())

    bs = s[s.Link.isin(pool) & (s.kind == "intl")].assign(big=lambda d: d.z_impact)
    # v14 (ay 19 Nov): domestic playoffs and finals in every region are big games too. Each game counts by what the
    # model already says that title is worth next to a Worlds title (LCK split about 0.44, LPL 0.30, LEC/LCS about
    # 0.1), so no weight is picked by hand. Ratings are region-adjusted, as every domestic rating is.
    if os.environ.get("BIG_DOM", "title") != "off":
        dt = T[(T.tier == "domestic") & (T.place == 1)].drop_duplicates("page")
        wpage = (dt.base / dt.path / CFG["trophy_points"]["worlds"][1]).groupby(dt.page).first()
        dp = s[s.Link.isin(pool) & (s.kind == "dom") & (s.IsPlayoffs.astype(str) == "1")].copy()
        fixed = os.environ.get("BIG_DOM", "title")
        if fixed != "title":
            w = pd.Series(float(fixed), index=dp.index)
        else:
            w = dp.Page.str.replace(r" \(future \d+\)$", "", regex=True).map(wpage)   # a dream season copies its real page
            ry = dp.region + dp.year.astype(str)
            w = w.fillna(w.groupby(ry).transform("median")).fillna(w.median())   # play-ins: that league's value that year
        dp["big"] = dp.a_impact
        dp["G"] = dp.G * w.values
        if AUDIT20:
            # audit 20 Nov: title events whose group stage and knockouts share one page (OGN Champions 2012-14, LCK Cup)
            # are not flagged as playoffs, so their quarterfinals, semifinals and finals were left out of big games
            # (Faker's 2013 and 2013-14 OGN finals among them). Count each player's knockout games there, at the
            # event's rating and the title's value.
            ga = os.path.join(CSV, "games_all.csv")
            kp = [p for p in wpage.index if p in set(s.Page) and (s.loc[s.Page == p, "IsPlayoffs"].astype(str) != "1").all()]
            if kp and os.path.exists(ga):
                gg = pd.read_csv(ga, usecols=["Page", "Link", "Team", "GameId"])
                gg = gg[gg.Page.isin(kp)].copy()
                gg["Link"] = [redirect(l) for l in gg.Link]
                gg["rnd"] = [gid[len(p) + 1:].rsplit("_", 2)[0] for gid, p in zip(gg.GameId, gg.Page)]
                if variant == "split_faker":
                    yy = gg.Page.str.extract(r"(20\d\d)")[0].astype(int)
                    m = gg.Link == "Faker"
                    gg.loc[m, "Link"] = np.where(yy[m] <= FS, FA, FB)
                ko = gg[gg.rnd.str.contains(r"Final|Semi|Quarter|Third|Playoffs Round", regex=True)]
                n = ko.drop_duplicates(["GameId", "Link"]).groupby(["Page", "Link", "Team"]).size().rename("koG").reset_index()
                ex = s[s.Link.isin(pool)].assign(base=lambda d: d.Page.str.replace(r" \(future \d+\)$", "", regex=True))
                ex = ex[ex.base.isin(kp)].merge(n.rename(columns={"Page": "base"}), on=["base", "Link", "Team"]).drop(columns="base")
                ex["big"] = ex.a_impact
                ex["G"] = ex.koG * ex.Page.str.replace(r" \(future \d+\)$", "", regex=True).map(wpage).values
                dp = pd.concat([dp, ex.drop(columns="koG")], ignore_index=True)
        bs = pd.concat([bs, dp[dp.G > 0]], ignore_index=True)
    P["big_stage_raw"] = best_years(bs, "big", 15, pad=True).reindex(pool).fillna(0)
    yr = s[s.Link.isin(pool)].groupby(["Link", "year"]).apply(lambda d: pd.Series({"imp": wmean(d, "a_impact"), "G": d.G.sum()}), include_groups=False).reset_index()
    yr["imp_s"] = shrink(yr.imp.fillna(0), yr.G, k)
    # v15.2 (ay 20 Nov 18:08, "Fix it and rerun"): 2013-15 seasons are built from fewer tracked stats (no laning stats
    # before 2014, no damage before 2020) and fewer recorded games, so their best seasons sat lower than every year from
    # 2017 on. Each year is scaled so its top 10 seasons (40+ games) average the same as 2016-2026; years with fewer
    # than 20 such players (2012) are left alone. ERA_SCALE=0 reproduces v15.1.
    era_f = pd.Series(dtype=float)
    if os.environ.get("ERA_SCALE", "1") != "0":
        q = yr[yr.G >= 40]
        t10 = q.groupby("year").imp_s.apply(lambda x: x.nlargest(10).mean())
        ref_t = t10[t10.index >= 2016].mean()
        era_f = (ref_t / t10).where(q.groupby("year").size() >= 20, 1.0)
        yr["imp_s"] = yr.imp_s * yr.year.map(era_f).fillna(1.0)
    if not variant:
        yr.to_csv(os.path.join(CSV, "season_ratings.csv"), index=False)   # per player-year season rating (for charts and checks)
    best = yr.loc[yr.groupby("Link").imp_s.idxmax()].set_index("Link")
    P["peak_raw"], P["peak_year"] = best.imp_s, best.year
    LG = CFG.get("longevity", {"min_games": 20, "min_impact": 0.35})
    P["elite_years"] = yr[(yr.G >= LG["min_games"]) & (yr.imp_s >= LG["min_impact"])].groupby("Link").size().reindex(pool).fillna(0)
    # longevity as value above the elite line (CORP / Tennis Abstract): a monster year counts more than a barely elite one
    ok = yr[yr.G >= LG["min_games"]]
    above = (ok.imp_s - LG["min_impact"]).clip(lower=0)
    # a year also counts as elite on results: starter on a Worlds top-4 or domestic-final team (weight audit 18 Nov)
    rt = T[((T.tier == "worlds") & (T.place <= 4)) | ((T.tier == "domestic") & (T.place <= 2))]
    ry = set(zip(rt.Link, rt.year))
    res = np.array([(l, y) in ry for l, y in zip(ok.Link, ok.year)])
    above = np.where(res, np.maximum(above, LG.get("result_year", 0.3)), above)
    if LG.get("year_cap"):   # a monster year counts as one great year, not three ordinary ones (ay 18 Nov)
        above = np.minimum(above, LG["year_cap"])
    P["longevity_raw"] = pd.Series(above, index=ok.index).groupby(ok.Link).sum().reindex(pool).fillna(0)
    P["individual_raw"] = best_years(s[s.Link.isin(pool)].assign(a_impact=lambda d: d.a_impact * d.year.map(era_f).fillna(1.0)), "a_impact", k)
    cf = os.path.join(CSV, "clutch.csv")
    if os.path.exists(cf):
        cl = pd.read_csv(cf)
        cl["Link"] = cl.Link.map(redirect)
        if os.environ.get("VARIANT") == "geng_wins":
            m = cl.match == "2026 Season World Championship/Main Event_Finals_1"
            cl.loc[m, "won"] = 1 - cl.loc[m, "won"]
        if os.environ.get("CUTOFF"):
            cl = cl[cl.year <= int(os.environ["CUTOFF"])]
        if os.environ.get("VARIANT") == "split_faker":
            m = cl.Link == "Faker"
            cl.loc[m, "Link"] = np.where(cl.loc[m, "year"] <= FS, FA, FB)
        # Worlds/MSI/First Stand knockouts count double: the biggest best-of-fives in the game
        if FUTURE_CFG:
            l, base = FUTURE_CFG["link"], int(FUTURE_CFG.get("from_year", 2026))
            mine = cl[cl.Link == l]
            tyears = sorted(mine[mine.Page.str.contains("World Championship") & (mine.won == 1) & (mine.kind == "bo5")].year.unique())
            extra = []
            for i, w in enumerate(FUTURE_CFG["worlds"]):
                y = base + 1 + i
                yy = FUTURE_CFG.get("src_year") or (base - 1 if i % 2 else base)
                r = mine[(mine.year == yy) & ~mine.Page.str.contains("World Championship")].copy()
                if AUDIT20 and not (FUTURE_CFG.get("msi") and FUTURE_CFG["msi"][i]):
                    r = r[~r.Page.str.contains("Mid-Season Invitational|First Stand", regex=True)]
                if w and tyears:
                    r = pd.concat([r, mine[(mine.year == tyears[-1]) & mine.Page.str.contains("World Championship")]])
                elif w and AUDIT20:
                    # audit 20 Nov: a player with no Worlds title yet (Chovy) won a what-if Worlds without a single
                    # Worlds series in clutch. Use his latest Worlds knockout run, every series won.
                    wy = mine[mine.Page.str.contains("World Championship")].year
                    if len(wy):
                        r = pd.concat([r, mine[(mine.year == wy.max()) & mine.Page.str.contains("World Championship")].assign(won=1)])
                r["year"] = y; r["Page"] = r.Page + f" (future {y})"
                if "match" in r: r["match"] = r["match"].astype(str) + f" f{y}"
                extra.append(r)
            cl = pd.concat([cl] + extra, ignore_index=True)
        cl["w"] = np.where(cl.Page.str.contains("World Championship|Mid-Season Invitational|First Stand", regex=True), 2.0, 1.0)
        cl["d"] = (cl.won - cl.exp) * cl.w
        g = cl.groupby("Link").agg(n=("w", "sum"), d=("d", "sum"))
        if CFG.get("clutch_mode") == "total":   # wins above expectation over a whole career, not a per-series rate
            P["clutch_raw"] = g.d.reindex(pool)
        else:
            P["clutch_raw"] = (g.d / (g.n + CFG.get("clutch_shrink", 25))).reindex(pool)
        P["clutch_n"] = g.n.reindex(pool).fillna(0).astype(int)
        # v15 (ay 20 Nov): big games also count results. Every best-of-five (playoffs, finals, Worlds, MSI, First
        # Stand) won is +1 and lost is -1, international ones doubled as in clutch: net big series won over a career.
        b5 = cl[cl.kind == "bo5"]
        P["big_results_raw"] = ((2 * b5.won - 1) * b5.w).groupby(b5.Link).sum().reindex(pool).fillna(0)
    else:
        P["clutch_raw"], P["clutch_n"] = np.nan, 0
    sp = s[s.Link.isin(pool)]
    P["win_raw"] = best_years(sp, "a_win", k)
    P["carry_raw"] = best_years(sp, "a_carry", k)
    P["clean_raw"] = best_years(sp, "a_clean", k)
    for c in CFG.get("league_stats", {}):
        P[c + "_raw"] = best_years(sp[sp["z_" + c].notna()], "a_" + c, k).reindex(pool).fillna(0)
    sp = sp.assign(z_gap_w=np.where(sp.z_gap > 0, sp.z_gap * np.clip(1 - sp.mates_impact.fillna(0), 0.25, 1.75), sp.z_gap))
    P["team_carry_raw"] = best_years(sp, "z_gap_w", k)
    P["recognition_raw"], P["allpro_pts"], P["covered_splits"] = recognition(s, pool, strength)
    P["team_lift_raw"] = team_lift(s, pool, strength)
    ev = s[s.Link.isin(pool) & (s.G >= 5)]
    cons = ev.groupby("Link").apply(lambda d: pd.Series({"n": len(d), "up": (d.a_impact > 0).sum()}), include_groups=False)
    P["consistency_raw"] = ((cons.up + 2) / (cons.n + 4)).reindex(pool)   # shrink toward 50%
    M = mvps(s)
    if not M.empty:
        if os.environ.get("CUTOFF"):
            M = M[M.year <= int(os.environ["CUTOFF"])]
        T = pd.concat([T, M], ignore_index=True)
    # solo carry: placement points earned above his own teammates, worth more when those teammates were weak
    # (cast from teammates' whole-year ratings; a stacked roster gets none)
    T["mates"] = T.get("mates", pd.Series(0.0, index=T.index)).fillna(0)
    T["cast"] = np.clip(1 - T.mates / 0.4, 0, 1.5)   # 1 = teammates at league average for their role-year, 0 = teammates 0.4 SD above (a strong roster gets no solo-carry credit)
    T["lead"] = T.get("lead", T.credit).fillna(T.credit)
    T["carry_pts"] = (T.base * (T.lead - 1)).clip(lower=0) * T.cast
    if V15 and os.environ.get("DOM_CAP", "0") != "0":   # v15.1 (ay 13:25): no cap on league titles; DOM_CAP=1 or 2 restores a cap of that many Worlds
        # v15 (ay 20 Nov): all of a player's league results together can be worth at most one Worlds title, so no
        # pile of league titles outweighs a Worlds. Each league result keeps its share of that cap.
        cap = CFG["trophy_points"]["worlds"][1] * float(os.environ.get("DOM_CAP", 1))   # DOM_CAP=2: what-if, two Worlds' worth
        dm = T.tier == "domestic"
        dsum = T[dm].groupby("Link").pts.transform("sum")
        T.loc[dm, "pts"] = T.loc[dm, "pts"] * np.minimum(1.0, cap / dsum)
    tp = T.groupby("Link").agg(trophy_pts=("pts", "sum"), raw_pts=("base", "sum"), solo_carry_pts=("carry_pts", "sum"))
    P = P.join(tp).fillna({"trophy_pts": 0, "raw_pts": 0, "solo_carry_pts": 0})
    P["mvps"] = T[T.tier == "award"].groupby("Link").size().reindex(pool).fillna(0).astype(int) if (T.tier == "award").any() else 0
    for tier in ["worlds", "msi", "first_stand", "domestic"]:
        P[tier + "_titles"] = T[(T.tier == tier) & (T.place == 1)].groupby("Link").size().reindex(pool).fillna(0).astype(int)
    won = T[(T.place == 1) & (T.tier != "award")]
    # count organisations, not team names (SK Telecom T1 = T1; MVP Ozone, Samsung White/Blue/Galaxy = Gen.G; ...)
    org = {"SK Telecom T1": "T1", "SK Telecom T1 2": "T1", "SK Telecom T1 K": "T1", "MVP Ozone": "Gen.G",
           "Samsung White": "Gen.G", "Samsung Blue": "Gen.G", "Samsung Galaxy": "Gen.G", "Longzhu Gaming": "Kingzone",
           "Kingzone DragonX": "Kingzone", "DAMWON Gaming": "DWG", "DWG KIA": "DWG", "KT Rolster Arrows": "KT Rolster",
           "Azubu Frost": "CJ", "Team WE": "WE"}
    won = won.assign(org=won.team.map(lambda t: org.get(t, t)))
    P["title_teams"] = won.groupby("Link").org.nunique().reindex(pool).fillna(0).astype(int)

    C = pd.DataFrame(index=pool)
    C["trophies"] = percentile(P.trophy_pts) if CFG.get("trophy_scale") == "linear" else P.trophy_pts / P.trophy_pts.max() * 100
    C["big_stage"] = percentile(P.big_stage_raw)
    if V15 and "big_results_raw" in P:   # half how he played in big games, half whether his team won them
        C["big_stage"] = percentile(0.5 * C.big_stage + 0.5 * percentile(P.big_results_raw))
    C["peak"] = percentile(P.peak_raw)
    C["winning"] = percentile(P.win_raw)
    C["longevity"] = percentile(P.longevity_raw + P.games / 1e6)
    C["carry"] = percentile(P.carry_raw)
    C["clean_play"] = percentile(P.clean_raw)
    C["consistency"] = percentile(P.consistency_raw)
    for c in CFG.get("league_stats", {}):
        C[c] = percentile(P[c + "_raw"])
    C["team_carry"] = percentile(P.team_carry_raw)
    C["solo_carry"] = percentile(P.solo_carry_pts + P.team_carry_raw.fillna(0) / 100)
    C["recognition"] = percentile(P.recognition_raw)
    C["team_lift"] = percentile(P.team_lift_raw)
    C["clutch"] = percentile(P.clutch_raw.fillna(P.clutch_raw.median()))
    C["title_teams"] = percentile(P.title_teams + P.trophy_pts / 1e5)
    C["individual"] = percentile(P.individual_raw)
    # pillars (research 18 Nov): correlated stat boards are merged before weighting, so kills and damage are not
    # counted four or five times under different names. Every board is still shown in the video, unweighted.
    C["big_stage_clutch"] = percentile(0.6 * C.big_stage + 0.4 * C.clutch)
    C["carry_pillar"] = percentile(C.team_carry + C.solo_carry)
    # skill (audit 18 Nov): peak and individual are the same yearly rating (Spearman 0.90), so one part, not two
    C["skill"] = percentile(0.7 * C.individual + 0.3 * C.peak)
    # team impact (v10, ay 18 Nov): plus-minus over every game from 2016 on (scoring/rapm.py), best 5 seasons;
    # a career that began before 2016 averages its covered seasons, so missing years don't count as zero
    rf = os.path.join(CSV, "rapm_seasons.csv")
    if os.path.exists(rf):
        ps = pd.read_csv(rf)
        ps = ps[ps.G >= 10].copy()
        if os.environ.get("CUTOFF"):
            ps = ps[ps.year <= int(os.environ["CUTOFF"])]
        if FUTURE_CFG:
            l, base = FUTURE_CFG["link"], int(FUTURE_CFG.get("from_year", 2026))
            mine = ps[ps.Link == l]
            ps = pd.concat([ps] + [mine[mine.year == (FUTURE_CFG.get("src_year") or (base - 1 if i % 2 else base))].assign(year=base + 1 + i)
                                   for i in range(len(FUTURE_CFG["worlds"]))], ignore_index=True)
        ps["Link"] = ps.Link.map(redirect)
        if os.environ.get("VARIANT") == "split_faker":
            m = ps.Link == "Faker"
            ps.loc[m, "Link"] = np.where(ps.loc[m, "year"] <= FS, FA, FB)
        first = s.groupby("Link").year.min()
        imp = {}
        for l, dd in ps.groupby("Link"):
            r = dd.r.sort_values(ascending=False)
            n = 5   # rapm_seasons covers 2011 on, so every career is measured the same way (audit 18 Nov)
            imp[l] = r.head(n).sum() / n
        P["impact_raw"] = pd.Series(imp).reindex(P.index).fillna(0)
        C["impact"] = percentile(P.impact_raw)
    # v13: recognition is honours only. The with/without half could not measure a player who never left his team
    # (Faker got the pool median) and plus-minus (impact) now measures the same thing properly.
    C["intangibles"] = C.recognition.copy()
    W = pd.Series(CFG["pillars"] if "pillars" in CFG else CFG["categories"], dtype=float)
    P["score"] = (C[W.index] * W).sum(axis=1) / W.sum()
    fk = ([l for l in pool if display(l) == CFG["pool"]["benchmark"]] or [P.score.idxmax()])[0]
    P["vs_faker"] = P.score / P.loc[fk, "score"] * 100
    P = P.join(C.add_prefix("c_"))
    P["decorated"] = P.raw_pts
    P["dominant"] = C[["big_stage_clutch", "peak", "individual", "carry_pillar"]].mean(axis=1)

    # robustness and tipping point, Faker left out of the ranking
    R = P
    rng = np.random.default_rng(7)
    wins = pd.Series(0, index=R.index)
    seconds = pd.Series(0, index=R.index)
    for _ in range(CFG["robustness"]["runs"]):
        w = W * (1 + rng.uniform(-1, 1, len(W)) * CFG["robustness"]["max_weight_change"])
        sc = (C.loc[R.index, W.index] * w).sum(axis=1)
        o = sc.sort_values(ascending=False).index
        wins[o[0]] += 1
        seconds[o[1]] += 1
    sweep = []
    for tw in range(0, 61, 2):
        w = W.copy(); rest = W.drop("trophies"); w[rest.index] = rest / rest.sum() * (100 - tw); w["trophies"] = tw
        sc = (C.loc[R.index, W.index] * w).sum(axis=1)
        sweep.append((tw, R.name[sc.idxmax()], R.name[sc.sort_values().index[-2]]))

    if variant:
        if variant == "split_faker":
            print("shuffle #1:", wins[wins > 0].sort_values(ascending=False).to_dict(), "#2:", seconds[seconds > 0].sort_values(ascending=False).to_dict())
        P.to_csv(os.path.join(CSV, f"draft_scores_{variant}.csv"))
        return
    P.to_csv(os.path.join(CSV, "draft_scores.csv"))
    pd.DataFrame({"wins": wins, "seconds": seconds}).to_csv(os.path.join(CSV, "shuffle_counts.csv"))
    pd.DataFrame(sweep, columns=["trophy_weight", "first", "second"]).to_csv(os.path.join(CSV, "trophy_sweep.csv"), index=False)
    T.to_csv(os.path.join(CSV, "title_credits.csv"), index=False)
    strength.round(2).to_csv(os.path.join(CSV, "region_strength.csv"))
    report(P, R, T, C, wins, seconds, sweep, strength, fk, s)


def report(P, R, T, C, wins, seconds, sweep, strength, fk, s):
    R = R.sort_values("score", ascending=False)
    L = ["# DRAFT TEST 4 (League, algorithm v3): not the final ranking", "",
         f"Data: Leaguepedia scoreboards, {s.Page.nunique()} tournaments, {int(s.G.sum() / 10):,} games (approx.), "
         f"{s.Link.nunique():,} players; pool {len(P)} players with {CFG['pool']['min_games']}+ games. "
         "Faker is ranked like everyone else (ay, 17 Nov).", "",
         "## What changed since test 1",
         "1. Early-era gap filled: team kills, gold and CS rebuilt from game-level scoreboards for 2011-2015, so every game "
         "since 2013 has kill participation and a resource share (CS share stands in where gold was not recorded).",
         "2. Fairness rule: big-stage form, winning, carry and clean play use each player's best 5 calendar years, not the "
         "career average. Before, every year past a peak pulled the average down, so a 13-year career scored worse than a "
         "6-year one on the same peak. Longevity is still its own category. With career averages Faker ranks #12.",
         "3. Worlds, MSI and First Stand MVP / Finals MVP awards added from Liquipedia (25 awards, data/manual/mvps.csv): "
         "Worlds 15 points, MSI 8, First Stand 5, full value.",
         "6. Placings count, not just wins: Worlds runner-up 60, semifinal 35, quarterfinal 15, last 16 5; MSI 30 / 18 / 8; "
         "First Stand 15 / 9 / 4; domestic final 10, semifinal 5 (times region strength).",
         "5. Damage per minute for 2014-2020 filled from Oracle's Elixir (6,222 of 8,065 player-event rows that had none).",
         "4. Longevity: an elite year is 20+ games at 0.2 SD above the role average (was 0.35, which almost nobody reached).", "",
         "## Overall top 15 (everyone, Faker included)", "",
         "| # | Player | Role | Regions | Years | Worlds | MSI | Domestic | MVPs | Score | #1 in 1000 runs | #2 in 1000 runs |",
         "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for i, (l, p) in enumerate(R.head(15).iterrows(), 1):
        L.append(f"| {i} | {p['name']} | {p.role} | {p.regions} | {p.years} | {p.worlds_titles} | {p.msi_titles} | {p.domestic_titles} | "
                 f"{p.mvps} | {p.score:.1f} | {wins.get(l, 0) / 10:.1f}% | {seconds.get(l, 0) / 10:.1f}% |")
    f = P.loc[fk]
    L += ["", f"Benchmark: Faker score {f.score:.1f}, {f.worlds_titles} Worlds, {f.msi_titles} MSI, {f.domestic_titles} domestic; "
          f"category scores: " + ", ".join(f"{c} {f['c_' + c]:.0f}" for c in C.columns), ""]
    L += ["## Players ay named", "", "| Player | Rank | Score | Worlds | Trophy pts | Big stage | Peak (year) |", "|---|---|---|---|---|---|---|"]
    ranks = {l: i for i, l in enumerate(R.index, 1)}
    for n in ["Knight", "Viper", "Bin"]:
        for l in R.index[R.name == n]:
            p = R.loc[l]
            L.append(f"| {n} | {ranks[l]} | {p.score:.1f} | {p.worlds_titles} | {p.trophy_pts:.0f} | {p.c_big_stage:.0f} | {p.c_peak:.0f} ({int(p.peak_year)}) |")
    L += ["", "## Tipping point (trophy weight -> #1 overall, then #2)", ""]
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
    L += ["", "## Every category top 5 (Faker included)", ""]
    for c in C.columns:
        L.append(f"**{c}**: " + ", ".join(f"{R.loc[l, 'name']} {R.loc[l, 'c_' + c]:.0f}" for l in R.sort_values('c_' + c, ascending=False).head(5).index))
        L.append("")
    L += ["## Worlds title carry shares (credit 0.5 to 1.5)", ""]
    for (ev, team), d in T[(T.tier == "worlds") & (T.place == 1)].groupby(["event", "team"], sort=False):
        L.append(f"- {ev} {team}: " + ", ".join(f"{display(r.Link)} {r.credit:.2f}" for r in d.sort_values("credit", ascending=False).itertuples()))
    L += ["", "## Region strength by year (international game win share, best region = 1.0)", "",
          strength.round(2).to_markdown()]
    L += ["", "## Known gaps (fix before the final run)",
          "- Champion damage: Leaguepedia from mid-2020, Oracle's Elixir (downloaded on ay's PC) fills 2014-2020 by player, "
          "league and year. Still missing: 2011-2013, most of Korea 2014 and some LPL rows (name mismatches); those games "
          "use gold or CS share alone for Carry.",
          "- Laning numbers (gold and CS difference at 15) are in the Oracle's Elixir file for 2014-2020 but not used: "
          "Leaguepedia has none, so a laning category would only cover part of history.",
          "- Finals MVP and event MVP awards are not counted yet (Liquipedia list to build, as in the Valorant data).",
          "- Season 1 and 2 (2011-2012) have thin data and are discounted; LMS is the only minor region included.",
          "- Region strength comes from cross-region games at Worlds, MSI, First Stand and the 2020 Mid-Season Cup."]
    open(os.path.join(OUT, "draft-test-4.md"), "w").write("\n".join(L) + "\n")
    print("\n".join(L[:40]))


if __name__ == "__main__":
    main()
