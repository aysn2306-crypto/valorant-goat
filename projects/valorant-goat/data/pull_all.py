"""Full data pull: every counted VCT event 2021-2026 (see EVENTS), saved once.

    python -m data.pull_all          # resumable; every page is cached in data/raw/

Writes data/csv/: events.csv, stages.csv, stage_stats.csv (player x stage),
standings.csv, matches.csv. Player placements, IGL roles and MVPs come from
data/pull_players.py, which runs after this.
"""
import csv, re, sys, time, pathlib
import requests
from selectolax.lexbor import LexborHTMLParser as HP
import vlrdevapi

from data.sources.cache import cached

OUT = pathlib.Path(__file__).resolve().parent / "csv"
OUT.mkdir(exist_ok=True)
DELAY = 1.5
UA = {"User-Agent": "Mozilla/5.0 (valorant-goat research script)"}

# (event_id, year, tier) tiers: champions | masters | intl_league | challengers_qualifier
C, M, L, Q = "champions", "masters", "intl_league", "challengers_qualifier"
EVENTS = [
    # Champions
    (449, 2021, C), (1015, 2022, C), (1657, 2023, C), (2097, 2024, C), (2283, 2025, C), (2766, 2026, C),
    # Masters (LOCK//IN counted as Masters)
    (353, 2021, M), (466, 2021, M), (926, 2022, M), (1014, 2022, M), (1188, 2023, M), (1494, 2023, M),
    (1921, 2024, M), (1999, 2024, M), (2281, 2025, M), (2282, 2025, M), (2760, 2026, M), (2765, 2026, M),
    # International leagues and Kickoffs (2023+)
    (1189, 2023, L), (1190, 2023, L), (1191, 2023, L),
    (1923, 2024, L), (1924, 2024, L), (1925, 2024, L), (1926, 2024, L),
    (2004, 2024, L), (1998, 2024, L), (2002, 2024, L), (2006, 2024, L),
    (2095, 2024, L), (2094, 2024, L), (2005, 2024, L), (2096, 2024, L),
    (2274, 2025, L), (2275, 2025, L), (2276, 2025, L), (2277, 2025, L),
    (2347, 2025, L), (2380, 2025, L), (2379, 2025, L), (2359, 2025, L),
    (2501, 2025, L), (2498, 2025, L), (2500, 2025, L), (2499, 2025, L),
    (2682, 2026, L), (2683, 2026, L), (2684, 2026, L), (2685, 2026, L),
    (2860, 2026, L), (2863, 2026, L), (2775, 2026, L), (2864, 2026, L),
    (2977, 2026, L), (2976, 2026, L), (2776, 2026, L), (2978, 2026, L),
    # 2021 regional top level (Stage 1 regional Masters, Stage 2/3 Challengers finals/playoffs, LCQs)
    (333, 2021, Q), (334, 2021, Q), (338, 2021, Q), (340, 2021, Q), (342, 2021, Q), (344, 2021, Q),
    (347, 2021, Q), (351, 2021, Q), (352, 2021, Q),
    (372, 2021, Q), (376, 2021, Q), (366, 2021, Q), (398, 2021, Q), (429, 2021, Q), (441, 2021, Q), (426, 2021, Q),
    (578, 2021, Q), (547, 2021, Q), (536, 2021, Q), (621, 2021, Q), (570, 2021, Q), (540, 2021, Q), (595, 2021, Q),
    (558, 2021, Q), (559, 2021, Q), (560, 2021, Q), (561, 2021, Q),
    # 2022 Challengers (top regional level) and LCQs
    (799, 2022, Q), (854, 2022, Q), (829, 2022, Q), (850, 2022, Q), (853, 2022, Q), (884, 2022, Q), (925, 2022, Q),
    (800, 2022, Q), (984, 2022, Q), (911, 2022, Q), (998, 2022, Q), (1013, 2022, Q), (1063, 2022, Q), (1086, 2022, Q),
    (1130, 2022, Q), (1117, 2022, Q), (1111, 2022, Q), (1083, 2022, Q), (1084, 2022, Q),
    # 2023 LCQs
    (1658, 2023, Q), (1659, 2023, Q), (1660, 2023, Q),
]


def _get(url):
    def fetch():
        time.sleep(DELAY)
        for attempt in range(4):
            r = requests.get(url, headers=UA, timeout=60)
            if r.status_code in (429, 503):
                time.sleep(30 * (attempt + 1)); continue
            r.raise_for_status()
            return r.text
        r.raise_for_status()
    return cached("vlr_html", url, fetch)["data"]


def parse_stats(html):
    h = HP(html)
    head = h.css_first("thead tr")
    if head is None:
        return []
    cols = [th.attributes.get("data-col") for th in head.css("th")]
    rows = []
    for tr in h.css("tbody tr"):
        tds = tr.css("td")
        pl = tr.css_first("td.mod-player")
        if pl is None:
            continue
        a = pl.css_first("a")
        href = a.attributes.get("href", "") if a else ""
        m = re.match(r"/player/(\d+)/", href)
        name = pl.css_first(".st-pl-name")
        team = pl.css_first(".st-pl-country")
        row = {"player_id": m.group(1) if m else "", "player": name.text(strip=True) if name else "",
               "team_tag": team.text(strip=True) if team else ""}
        agents = []
        for img in tr.css("td.mod-agents img"):
            agents.append(img.attributes.get("src", "").split("/")[-1].split(".")[0])
        row["agents"] = ";".join(agents)
        for i, c in enumerate(cols):
            if c and c != "agents" and i < len(tds):
                row[c] = tds[i].text(strip=True)
        rows.append(row)
    return rows


def main():
    ev_rows, st_rows, stat_rows, sd_rows, m_rows = [], [], [], [], []
    for n, (eid, year, tier) in enumerate(EVENTS, 1):
        try:
            info = cached("vlr_event_info2", str(eid), lambda: (time.sleep(DELAY), vlrdevapi.event.info(event_id=eid).name)[1])["data"]
            stages = cached("vlr_stages", str(eid), lambda: (time.sleep(DELAY), [
                {"stage_id": s.id, "stage": s.name} for s in vlrdevapi.event.stages(event_id=eid).stages])[1])["data"]
            ev_rows.append({"event_id": eid, "name": info, "year": year, "tier": tier})
            for s in stages:
                st_rows.append({"event_id": eid, **s})
                html = _get(f"https://www.vlr.gg/event/stats/{eid}/?series_id={s['stage_id']}")
                for r in parse_stats(html):
                    stat_rows.append({"event_id": eid, "stage_id": s["stage_id"], "stage": s["stage"], **r})
            if not stages:
                for r in parse_stats(_get(f"https://www.vlr.gg/event/stats/{eid}/?series_id=all")):
                    stat_rows.append({"event_id": eid, "stage_id": "all", "stage": "all", **r})
            sd = cached("vlr_standings2", str(eid), lambda: (time.sleep(DELAY), [
                {"stage": st.stage_name, "place": e.place, "team_id": e.team.id if e.team else "",
                 "team": e.team.name if e.team else ""}
                for st in vlrdevapi.event.standings(event_id=eid).stages for e in st.standings])[1])["data"]
            for r in sd:
                sd_rows.append({"event_id": eid, **r})
            ms = cached("vlr_matches", str(eid), lambda: (time.sleep(DELAY), [
                {"match_id": mm.match_id, "stage": mm.stage, "phase": mm.phase,
                 "date": str(mm.match_date), "t1_id": mm.teams[0].id, "t1": mm.teams[0].name, "t1_score": mm.teams[0].score,
                 "t2_id": mm.teams[1].id, "t2": mm.teams[1].name, "t2_score": mm.teams[1].score,
                 "winner": 1 if mm.teams[0].winner else (2 if mm.teams[1].winner else 0)}
                for mm in vlrdevapi.event.matches(event_id=eid, state="completed").matches if len(mm.teams) == 2])[1])["data"]
            for r in ms:
                m_rows.append({"event_id": eid, **r})
            print(f"[{n}/{len(EVENTS)}] {eid} {info}: {len(stages)} stages, {len(ms)} matches", flush=True)
        except Exception as e:  # keep going; log the failure
            print(f"[{n}/{len(EVENTS)}] {eid} FAILED: {e!r}", flush=True)

    for name, rows in [("events", ev_rows), ("stages", st_rows), ("stage_stats", stat_rows),
                       ("standings", sd_rows), ("matches", m_rows)]:
        if not rows:
            continue
        keys = list(dict.fromkeys(k for r in rows for k in r))
        with open(OUT / f"{name}.csv", "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=keys)
            w.writeheader(); w.writerows(rows)
        print(name, len(rows))


if __name__ == "__main__":
    main()
