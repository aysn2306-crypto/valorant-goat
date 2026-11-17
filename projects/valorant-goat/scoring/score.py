"""DRAFT TEST of Algorithm v2 (config/weights.yaml). Not the final ranking.

    python -m scoring.score            # reads data/csv/, writes scoring/out/

Inputs: events, stage_stats, matches (data.pull_all); players, placements, awards (data.pull_players).
Outputs: scoring/out/overall.csv, categories.csv, category_top5.md, anomalies.md

Known gaps in this test (see anomalies.md):
- match weight uses event tier x stage only (stats are per stage, not per map), so
  opponent strength and bracket-final / grand-final weights are not applied to stats yet;
- multikills are not on vlr.gg stage tables, so fragging uses rating/ADR/KPR only;
- IGL flag = current Liquipedia role, not historical.
"""
import math, pathlib, re, collections
import numpy as np
import pandas as pd
import yaml
import glicko2

ROOT = pathlib.Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "csv"
OUT = ROOT / "scoring" / "out"
CFG = yaml.safe_load(open(ROOT / "config" / "weights.yaml"))

ROLE = {}
for role, agents in {
    "duelist": "jett raze reyna phoenix yoru neon iso waylay",
    "initiator": "sova breach skye kayo fade gekko tejo",
    "controller": "brimstone omen viper astra harbor clove",
    "sentinel": "sage cypher killjoy chamber deadlock vyse veto",
}.items():
    for a in agents.split():
        ROLE[a] = role


def pct(s):
    return float(str(s).rstrip("%")) / 100 if str(s).strip() not in ("", "nan") else np.nan


def num(s):
    try:
        return float(s)
    except (TypeError, ValueError):
        return np.nan


def stage_weight(stage):
    s = str(stage).lower()
    w = CFG["match_weight"]["stage"]
    if any(k in s for k in ("playoff", "bracket", "knockout", "final")):
        return w["playoffs"]
    return w["group"]


def load_stats():
    ev = pd.read_csv(CSV / "events.csv")
    st = pd.read_csv(CSV / "stage_stats.csv", dtype={"player_id": str})
    st = st[st.player_id.notna() & (st.player_id != "")]
    st = st.merge(ev[["event_id", "year", "tier", "name"]], on="event_id")
    for c in ["maps", "rnd", "rating", "acs", "kd", "adr", "kpr", "apr", "k", "d", "a", "fk", "fd", "kmax"]:
        st[c] = st[c].map(num)
    for c in ["kast", "fkpr", "fdpr", "hsp", "clp"]:
        st[c] = st[c].map(pct)
    cl = st["cl"].astype(str).str.extract(r"(\d+)\s*/\s*(\d+)").astype(float)
    st["cl_won"], st["cl_att"] = cl[0].fillna(0), cl[1].fillna(0)
    st = st[st.rnd > 0].copy()
    first = st.agents.fillna("").str.split(";").str[0].str.lower()
    st["role"] = first.map(ROLE).fillna("flex")
    unknown = sorted(set(first[st.role == "flex"]) - {""})
    # derived per-row metrics
    st["fk_share"] = st.fk / (st.fk + st.fd).replace(0, np.nan)
    st["kpr2"] = st.k / st.rnd
    st["fkpr2"] = st.fk / st.rnd
    st["apr2"] = st.a / st.rnd
    st["neg_dpr"] = -(st.d / st.rnd)
    st["clutch_pct"] = st.cl_won / st.cl_att.replace(0, np.nan)
    st["clutch_p100"] = st.cl_won / st.rnd * 100
    st["w"] = st.tier.map(CFG["match_weight"]["event_tier"]).fillna(0) * st.stage.map(stage_weight)
    st["playoff"] = st.stage.map(stage_weight) > 1
    return st, unknown


METRICS = ["acs", "rating", "adr", "kpr2", "fkpr2", "fk_share", "clutch_pct", "clutch_p100", "kast", "apr2", "neg_dpr"]


def zscore_within(st):
    """z-score every metric within (season, role), rounds-weighted. Era + role fairness."""
    for m in METRICS:
        z = pd.Series(np.nan, index=st.index)
        for _, g in st.groupby(["year", "role"]):
            v, wt = g[m], g.rnd.where(g[m].notna(), 0)
            if wt.sum() == 0:
                continue
            mu = np.nansum(v * wt) / wt.sum()
            sd = math.sqrt(np.nansum(wt * (v - mu) ** 2) / wt.sum()) or 1
            z[g.index] = (v - mu) / sd
        st["z_" + m] = z
    # vlr.gg has no Rating/KAST/clutch data for events on Chinese servers (Masters Shanghai 2024,
    # China league 2024-25) or 2021 Stage 1 regionals: use ACS z as the rating stand-in there.
    st["rating_proxy"] = st.z_rating.isna() & st.z_acs.notna()
    st["z_rating"] = st.z_rating.fillna(st.z_acs)
    return st


def wavg(g, col, wcol):
    m = g[col].notna() & (g[wcol] > 0)
    if not m.any():
        return 0.0, 0.0
    return float(np.average(g.loc[m, col], weights=g.loc[m, wcol])), float(g.loc[m, "rnd"].sum())


def shrink(z, n, k):
    return z * n / (n + k)


def percentile(s):
    return s.rank(pct=True, method="average") * 100


def place_range(p):
    """'5th–6th' -> (5, 6); '1st' -> (1, 1)."""
    n = [int(x) for x in re.findall(r"(\d+)(?:st|nd|rd|th)", str(p))]
    return (n[0], n[-1]) if n else (None, None)


def trophy_points(tier, place):
    tbl = CFG["trophy_points"]["champions" if tier == "champions" else "masters" if tier == "masters" else "regional"]
    for k, v in tbl.items():
        k = str(k)
        lo, hi = (int(x) for x in k.split("-")) if "-" in k else (int(k), int(k))
        if lo <= place <= hi:
            return v
    return 0


def glicko_team_residuals(matches, events):
    """Chronological Glicko-2 over all counted matches. Returns per (event_id, team) sum of (won - expected)."""
    m = matches.merge(events[["event_id"]], on="event_id").sort_values("date")
    teams = collections.defaultdict(glicko2.Player)
    res = collections.defaultdict(float)
    cnt = collections.defaultdict(int)
    for r in m.itertuples():
        if r.winner not in (1, 2):
            continue
        a, b = teams[r.t1_id], teams[r.t2_id]
        phi_b = b.rd / 173.7178
        g_b = 1 / math.sqrt(1 + 3 * phi_b ** 2 / math.pi ** 2)
        e_a = 1 / (1 + math.exp(-g_b * (a.rating - b.rating) / 173.7178))  # Glicko-2 expected score
        s_a = 1.0 if r.winner == 1 else 0.0
        res[(r.event_id, r.t1)] += s_a - e_a
        res[(r.event_id, r.t2)] += (1 - s_a) - (1 - e_a)
        cnt[(r.event_id, r.t1)] += 1
        cnt[(r.event_id, r.t2)] += 1
        ra, rda, rb, rdb = a.rating, a.rd, b.rating, b.rd
        a.update_player([rb], [rdb], [s_a])
        b.update_player([ra], [rda], [1 - s_a])
    return res, cnt


def igl_periods(players, events):
    """Set of (player_id, event_id) where the player was the team's in-game leader.

    Liquipedia only stores the CURRENT role, so a Liquipedia IGL counts as IGL for their current
    stint (the unbroken run of counted events with their latest team). Earlier stints are added
    only from data/manual/igl_extra.csv, each row with a source."""
    pl = pd.read_csv(CSV / "placements.csv", dtype={"player_id": str})
    pl = pl[pl.event_id.isin(events.event_id)]
    m = pd.read_csv(CSV / "matches.csv")
    first = m.groupby("event_id").date.min()
    pl["date"] = pl.event_id.map(first).fillna(pl.year.astype(str) + "-01-01")
    pl = pl.sort_values("date").drop_duplicates(["player_id", "event_id"], keep="last")
    out, src = set(), {}
    flagged = set(players.loc[players.igl == 1, "player_id"])
    for pid, g in pl[pl.player_id.isin(flagged)].groupby("player_id"):
        teams = list(g.team)[::-1]; evs = list(g.event_id)[::-1]
        for t, e in zip(teams, evs):
            if t != teams[0]:
                break
            out.add((pid, e))
        src[pid] = f"Liquipedia current role ({teams[0]} stint)"
    ex = ROOT / "data" / "manual" / "igl_extra.csv"
    if ex.exists():
        for r in pd.read_csv(ex).itertuples():
            g = pl[(pl.player.str.lower() == r.player.lower()) & (pl.team == r.team) & pl.year.between(r.from_year, r.to_year)]
            for pid, e in zip(g.player_id, g.event_id):
                out.add((pid, e)); src[pid] = "; ".join(dict.fromkeys(filter(None, src.get(pid, "").split("; ") + [r.source])))
    return out, src


def main():
    OUT.mkdir(exist_ok=True)
    k = CFG["fairness"]["shrinkage_rounds_k"]
    events = pd.read_csv(CSV / "events.csv")
    st, unknown_agents = load_stats()
    st = zscore_within(st)
    players = pd.read_csv(CSV / "players.csv", dtype={"player_id": str})
    pool = set(players.player_id)
    sp = st[st.player_id.isin(pool)]
    names = dict(zip(players.player_id, players.player))
    igl_ev, igl_src = igl_periods(players, events)

    rows = []
    for pid, g in sp.groupby("player_id"):
        g = g.copy()
        g["wr"] = g.rnd * g.w
        g["igl_row"] = [(pid, e) in igl_ev for e in g.event_id]
        igl_share = float(g.loc[g.igl_row, "rnd"].sum() / g.rnd.sum())
        r = {"player_id": pid, "player": names.get(pid), "igl": int(igl_share > 0), "igl_share": round(igl_share, 2),
             "igl_source": igl_src.get(pid, ""),
             "acs_standin_share": round(float(g.loc[g.rating_proxy, "rnd"].sum() / g.rnd.sum()), 2),
             "rounds": int(g.rnd.sum()), "main_role": g.groupby("role").rnd.sum().idxmax(),
             "first_year": int(g.year.min()), "last_year": int(g.year.max())}
        zs = {}
        for m in METRICS:
            z, n = wavg(g, "z_" + m, "wr")
            zs[m] = shrink(z, n, k)
        r.update({"z_" + m: v for m, v in zs.items()})
        # big-game form: Champions/Masters playoffs vs own baseline
        big = g[g.playoff & g.tier.isin(["champions", "masters"])]
        zb, nb = wavg(big, "z_rating", "rnd")
        r["big_rounds"] = int(nb)
        r["z_big"] = shrink(zb, nb, k)
        r["z_big_vs_base"] = shrink(zb - zs["rating"], nb, k)
        zc, nc = wavg(g[g.playoff], "z_clutch_p100", "wr")
        r["z_playoff_clutch"] = shrink(zc, nc, k)
        # consistency: per-event rating z
        ez = g.groupby("event_id").apply(lambda e: wavg(e, "z_rating", "rnd")[0], include_groups=False)
        r["n_events"] = len(ez)
        kc = CFG["fairness"].get("consistency_k", 3000)
        sh = g.rnd.sum() / (g.rnd.sum() + kc)  # v2: stronger pull to average for short careers
        r["c_above"] = (ez > 0).mean() * sh + 0.5 * (1 - sh)
        r["c_std"] = ez.std() if len(ez) > 1 else np.nan
        r["c_sh"] = sh
        # peak + longevity: best seasons, decaying weights
        sz = g.groupby("year").apply(lambda e: shrink(*wavg(e, "z_rating", "wr"), 400), include_groups=False)
        vals = sorted((max(0.0, v + 1.0) for v in sz), reverse=True)
        r["peak_long"] = sum(v * w for v, w in zip(vals, CFG["category_inputs"]["peak_longevity"]["season_weights"]))
        r["best_season"] = int(sz.idxmax()) if len(sz) else None
        rows.append(r)
    P = pd.DataFrame(rows).set_index("player_id")
    # v2: pull a short career's event-to-event swing toward the pool's typical swing (not toward zero swing)
    P["c_swing"] = -(P.c_sh * P.c_std.fillna(P.c_std.mean()) + (1 - P.c_sh) * P.c_std.mean())

    # IGL calling tax: measured gap in fragging z between IGLs and non-IGLs (same role-season scale)
    frag_raw = 0.4 * P.z_rating + 0.3 * P.z_adr + 0.2 * P.z_kpr2 + 0.1 * P.z_kpr2 * 0  # multikills unavailable
    frag_raw = frag_raw / 0.9
    # v2: tax measured from players who called for most of their rounds vs players who never did
    tax = float(frag_raw[P.igl_share == 0].mean() - frag_raw[P.igl_share >= 0.5].mean()) if (P.igl_share >= 0.5).any() else 0.0
    tax = max(tax, 0.0)
    frag_adj = frag_raw + tax * P.igl_share  # added back only for the share of rounds spent calling
    open_adj = 0.5 * P.z_fkpr2 + 0.5 * P.z_fk_share

    # trophies + honours
    pl = pd.read_csv(CSV / "placements.csv", dtype={"player_id": str})
    pl_raw = pl.copy()
    pl = pl.merge(events[["event_id", "tier"]], on="event_id")
    rng_ = pl.placement.map(place_range)
    pl["lo"], pl["hi"] = rng_.str[0], rng_.str[1]
    pl = pl.dropna(subset=["lo"])
    # one row per player-event: the narrowest placement range (the final result, not a nested bracket range)
    pl["width"] = pl.hi - pl.lo
    pl = pl.sort_values(["width", "lo"]).drop_duplicates(["player_id", "event_id"])
    # a range only earns a bucket's points if the whole range sits in that bucket; otherwise use its worst end
    pl["place"] = [int(lo) if trophy_points(t, int(lo)) == trophy_points(t, int(hi)) else int(hi) for t, lo, hi in zip(pl.tier, pl.lo, pl.hi)]
    # started rule: >= min share of the team's maps at that event
    mshare = CFG["trophy_points"]["min_share_of_maps_started"]
    pm = st.groupby(["event_id", "player_id", "team_tag"]).maps.sum().reset_index()
    pm["team_max"] = pm.groupby(["event_id", "team_tag"]).maps.transform("max")
    pm["share"] = pm.maps / pm.team_max
    share = pm.groupby(["event_id", "player_id"]).share.max()
    pl["share"] = [share.get((e, p), 0.0) for e, p in zip(pl.event_id, pl.player_id)]
    pl["counted"] = pl.share >= mshare
    rec = {int(y): v for y, v in CFG["trophy_points"]["recency_boost"].items()}
    pl["pts"] = [trophy_points(t, int(p)) * rec.get(int(y), 1.0) if c else 0 for t, p, y, c in zip(pl.tier, pl.place, pl.year, pl.counted)]
    tro = pl.groupby("player_id").pts.sum()
    P["trophy_pts"] = tro.reindex(P.index).fillna(0)
    P["intl_titles"] = pl[pl.counted & (pl.hi == 1) & pl.tier.isin(["champions", "masters"])].groupby("player_id").size().reindex(P.index).fillna(0).astype(int)
    P["champs_titles"] = pl[pl.counted & (pl.hi == 1) & (pl.tier == "champions")].groupby("player_id").size().reindex(P.index).fillna(0).astype(int)
    aw = pd.read_csv(ROOT / "data" / "manual" / "mvps.csv")  # v2: sourced list, one row per event MVP
    P["mvps"], P["mvp_pts"] = 0, 0.0
    unmatched_mvp = []
    if len(aw):
        for a in aw.itertuples():
            # match by name AND team at that event (avoids name collisions like Neon)
            cand = pl_raw[(pl_raw.event_id == a.event_id) & (pl_raw.player.str.lower() == str(a.player).lower())]
            pid = cand.player_id.iloc[0] if len(cand) and cand.player_id.iloc[0] in P.index else None
            if pid is None:
                unmatched_mvp.append(f"{a.player} ({a.event})"); continue
            P.loc[pid, "mvps"] += 1
            P.loc[pid, "mvp_pts"] += CFG["trophy_points"]["awards"]["champions_mvp" if a.tier == "champions" else "masters_mvp"] * rec.get(int(a.year), 1.0)
    P["honours"] = P.trophy_pts + P.mvp_pts

    # leadership: IGL's teams vs Glicko-2 expectation
    matches = pd.read_csv(CSV / "matches.csv")
    resid, cnt = glicko_team_residuals(matches, events)
    lead = {}
    kl = CFG["fairness"].get("leadership_k_matches", 100)
    for pid, g in pl[pl.player_id.isin(P.index[P.igl == 1])].groupby("player_id"):
        g = g[[(pid, e) in igl_ev for e in g.event_id]]  # v2: only events where they were the caller
        s = sum(resid.get((e, t), 0.0) for e, t in zip(g.event_id, g.team))
        n = sum(cnt.get((e, t), 0) for e, t in zip(g.event_id, g.team))
        lead[pid] = s / (n + kl) if n else 0.0  # wins above expected per match, shrunk toward 0 (k matches)
    P["lead_matches"] = pd.Series({pid: sum(cnt.get((e, t), 0) for e, t in zip(g.event_id, g.team) if (pid, e) in igl_ev)
                                   for pid, g in pl[pl.player_id.isin(P.index)].groupby("player_id")}).reindex(P.index).fillna(0).astype(int)
    P["lead_raw"] = pd.Series(lead).reindex(P.index)

    C = pd.DataFrame(index=P.index)
    C["trophies_honours"] = P.honours / P.honours.max() * 100  # v2: real points (best = 100), not percentile
    C["fragging"] = percentile(frag_adj)
    C["big_game_form"] = percentile(0.6 * P.z_big_vs_base + 0.4 * P.z_big)
    C["peak_longevity"] = percentile(P.peak_long)
    C["opening_duels"] = percentile(open_adj)
    C["clutch_factor"] = percentile(0.5 * P.z_clutch_pct + 0.3 * P.z_clutch_p100 + 0.2 * P.z_playoff_clutch)
    C["team_play"] = percentile(0.5 * P.z_kast + 0.3 * P.z_apr2 + 0.2 * P.z_neg_dpr)
    C["consistency"] = percentile(0.6 * P.c_above + 0.4 * P.c_swing)
    il = P.lead_raw.dropna()
    C["leadership"] = (il.rank(pct=True) * 100).reindex(P.index).fillna(0)  # IGL-only bonus
    W = CFG["categories"]
    cats = list(W)
    P["overall"] = sum(C[c] * W[c] for c in cats) / 100

    # robustness: 1000 runs, every weight moved by up to +-30%
    rng = np.random.default_rng(7)
    base = np.array([W[c] for c in cats], float)
    M = C[cats].to_numpy()
    wins = collections.Counter(); top5 = collections.Counter()
    for _ in range(CFG["robustness"]["runs"]):
        w = base * rng.uniform(1 - CFG["robustness"]["max_weight_change"], 1 + CFG["robustness"]["max_weight_change"], len(base))
        s = M @ w / w.sum()
        order = np.argsort(-s)
        wins[P.index[order[0]]] += 1
        for i in order[:5]:
            top5[P.index[i]] += 1
    runs = CFG["robustness"]["runs"]
    P["goat_prob"] = [wins[p] / runs for p in P.index]
    P["top5_prob"] = [top5[p] / runs for p in P.index]

    full = P.join(C.add_prefix("cat_")).sort_values("overall", ascending=False)
    full.insert(0, "rank", range(1, len(full) + 1))
    full.round(3).to_csv(OUT / "overall.csv")

    # report
    lines = ["# DRAFT TEST: not the final ranking", "",
             f"Pool: {len(P)} players with 300+ rounds at Champions/Masters. Data: vlr.gg stage stats + placements, Liquipedia roles/MVPs.",
             f"Weights: config/weights.yaml v2 (approved: {CFG['approved']}). IGL calling tax measured: {tax:.2f} SD added back to IGL fragging.", ""]
    lines += ["## Overall top 10", "", "| # | Player | Role | Score | Intl titles | GOAT % (1000 runs) | Top-5 % |", "|---|---|---|---|---|---|---|"]
    for pid, r in full.head(10).iterrows():
        lines.append(f"| {r['rank']} | {r.player} | {r.main_role}{' (IGL)' if r.igl else ''} | {r.overall:.1f} | {r.intl_titles} | {r.goat_prob*100:.0f}% | {r.top5_prob*100:.0f}% |")
    for c in cats:
        lines += ["", f"## {c.replace('_', ' ').title()} top 5", ""]
        sub = full.sort_values("cat_" + c, ascending=False).head(5)
        for i, (pid, r) in enumerate(sub.iterrows(), 1):
            lines.append(f"{i}. {r.player} ({r.main_role}, {r.rounds} rnds) {r['cat_' + c]:.1f}")
    (OUT / "category_top5.md").write_text("\n".join(lines) + "\n")

    an = ["# Things that look off / limits of this test", ""]
    px = st[st.rating_proxy]
    an.append(f"- vlr.gg has no Rating/KAST/clutch data at {px.event_id.nunique()} events ({', '.join(sorted(px.name.unique()))}); ACS stands in for Rating there, KAST and clutch just skip them.")
    an.append(f"- Agents with no role mapping (counted as flex): {', '.join(unknown_agents) or 'none'}")
    an.append(f"- MVP awards not matched to a pool player: {', '.join(unmatched_mvp) or 'none'}")
    an.append(f"- Players without a clean Liquipedia player page: {', '.join(players[players.liquipedia != 'ok'].player)}")
    an.append(f"- IGL periods: {', '.join(f'{n} ({sh:.0%} of rounds)' for n, sh in sorted(zip(P[P.igl == 1].player, P[P.igl == 1].igl_share)))}")
    an.append(f"- Players with 20%+ of rounds at events where ACS stood in for Rating: {', '.join(P[P.acs_standin_share >= 0.2].player) or 'none'}")
    nodata = pl[~pl.counted & (pl.hi == 1) & pl.tier.isin(['champions', 'masters'])]
    an.append(f"- Intl wins NOT counted (player under 50% of team maps): {', '.join(f'{a} {b}' for a, b in zip(nodata.player, nodata.event)) or 'none'}")
    (OUT / "anomalies.md").write_text("\n".join(an) + "\n")
    print("\n".join(lines)); print(); print("\n".join(an))


if __name__ == "__main__":
    main()
