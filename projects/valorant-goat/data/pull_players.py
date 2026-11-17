"""Second pass: for the candidate pool, pull each player's event placements (vlr.gg),
their Liquipedia role (IGL) and event MVP awards. Run after data.pull_all.

Pool = players with at least POOL_MIN_ROUNDS rounds at Champions + Masters events.
Writes data/csv/players.csv, placements.csv, awards.csv.
"""
import csv, re, time, pathlib
import pandas as pd
import vlrdevapi

from data.sources.cache import cached
from data.sources import liquipedia as lp

OUT = pathlib.Path(__file__).resolve().parent / "csv"
POOL_MIN_ROUNDS = 300
DELAY = 1.5


LP_EVENT_TITLES = {
    449: "VCT/2021/Champions", 1015: "VCT/2022/Champions", 1657: "VCT/2023/Champions", 2097: "VCT/2024/Champions",
    2283: "VCT/2025/Champions", 2766: "VCT/2026/Champions",
    353: "VALORANT Champions Tour/2021/Stage 2/Masters", 466: "VALORANT Champions Tour/2021/Stage 3/Masters",
    926: "VCT/2022/Stage 1/Masters", 1014: "VCT/2022/Stage 2/Masters", 1188: "VCT/2023/LOCK IN", 1494: "VCT/2023/Masters",
    1921: "VCT/2024/Stage 1/Masters", 1999: "VCT/2024/Stage 2/Masters", 2281: "VCT/2025/Stage 1/Masters",
    2282: "VCT/2025/Stage 2/Masters", 2760: "VCT/2026/Stage 1/Masters", 2765: "VCT/2026/Stage 2/Masters",
}


def pool():
    ev = pd.read_csv(OUT / "events.csv")
    st = pd.read_csv(OUT / "stage_stats.csv")
    st = st.merge(ev[["event_id", "tier"]], on="event_id")
    intl = st[st.tier.isin(["champions", "masters"])]
    r = intl.groupby(["player_id"]).agg(player=("player", "last"), rounds=("rnd", "sum")).reset_index()
    return r[r.rounds >= POOL_MIN_ROUNDS].sort_values("rounds", ascending=False)


def lp_title(name):
    return name[0].upper() + name[1:]


def main():
    p = pool()
    print("pool size", len(p), flush=True)
    # placements
    rows = []
    for i, (pid, name) in enumerate(zip(p.player_id, p.player), 1):
        def fetch(pid=pid):
            time.sleep(DELAY)
            pl = vlrdevapi.player.placements(player_id=int(pid))
            return [{"event_id": x.event_id, "event": x.event_name, "year": x.year, "stage": x.stage,
                     "placement": x.placement, "team": x.team_name} for x in pl.placements]
        try:
            for r in cached("vlr_placements", str(pid), fetch)["data"]:
                rows.append({"player_id": pid, "player": name, **r})
        except Exception as e:
            print("placements failed", pid, name, repr(e), flush=True)
        if i % 25 == 0:
            print(f"placements {i}/{len(p)}", flush=True)
    pd.DataFrame(rows).to_csv(OUT / "placements.csv", index=False)

    # Liquipedia roles (IGL flag is the CURRENT/listed role on the infobox)
    texts = lp.wikitext_many([lp_title(n) for n in p.player])
    prow = []
    for pid, name, rnd in zip(p.player_id, p.player, p.rounds):
        t = texts.get(lp_title(name), "")
        roles = re.search(r"\|\s*roles?\s*=\s*([^\n|]*)", t)
        roles = roles.group(1).strip().lower() if roles else ""
        is_player_page = "{{Infobox player" in t or "{{infobox player" in t.lower()
        prow.append({"player_id": pid, "player": name, "intl_rounds": rnd,
                     "liquipedia": "ok" if is_player_page else ("disambiguation/other" if t else "missing"),
                     "roles": roles, "igl": int("igl" in roles or "in-game leader" in roles)})
    pd.DataFrame(prow).to_csv(OUT / "players.csv", index=False)

    # Event MVP awards from the Liquipedia event pages (fixed titles; search picked wrong pages).
    # Only the event MVP counts (award == "MVP"), not day or match MVPs.
    ev = pd.read_csv(OUT / "events.csv")
    names = dict(zip(ev.event_id, ev.name)); years = dict(zip(ev.event_id, ev.year)); tiers = dict(zip(ev.event_id, ev.tier))
    texts = lp.wikitext_many(list(LP_EVENT_TITLES.values()))
    arows = []
    for eid, title in LP_EVENT_TITLES.items():
        for m in re.finditer(r"\{\{Slot\|award=([^|]+)\|\{\{Opponent\|([^|}]+)(?:\|[^}]*?team=([^}|]+))?", texts.get(title, "")):
            if m.group(1).strip().upper() != "MVP":
                continue
            arows.append({"event_id": eid, "event": names[eid], "year": years[eid], "tier": tiers[eid],
                          "liquipedia_page": title, "award": "MVP", "player": m.group(2).strip(), "team": (m.group(3) or "").strip()})
        print("awards", names[eid], "->", title, sum(r["event_id"] == eid for r in arows), flush=True)
    pd.DataFrame(arows).to_csv(OUT / "awards.csv", index=False)


if __name__ == "__main__":
    main()
