"""Joins the ranking thread's CSVs onto league.json ids for the graph stills (read-only use of their outputs)."""
import csv, json, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
L = json.load(open(root / "video/src/data/league.json"))
by_link = {p["link"]: p["id"] for p in L["players"]}
def rows(n): return list(csv.DictReader(open(root / "data/csv" / n)))
out = {}
out["bigStage"] = {by_link[r["Link"]]: round(float(r["c_big_stage_clutch"]), 1) for r in rows("draft_scores.csv") if r["Link"] in by_link and r["c_big_stage_clutch"]}
out["intl"] = [[by_link.get(r["Link"], r["Link"].lower()), r["name"], float(r["score"])] for r in rows("whatif_intl_only.csv")][:10]
out["knightNeeds"] = [[r["case"], float(r["knight"]), float(r["faker"]), float(r["trophy_pts_added"])] for r in rows("whatif_knight_needs.csv")]
split = rows("draft_scores_split_faker.csv"); split.sort(key=lambda r: -float(r["score"]))
out["split"] = [[r["Link"], r["name"], r["years"], round(float(r["score"]), 1)] for r in split]
sh = {by_link.get(r["Link"], r["Link"]): [int(r["wins"]), int(r["seconds"])] for r in rows("shuffle_counts.csv")}
out["reruns"] = {k: v for k, v in sh.items() if v[0] or v[1]}
# champion pool board (unweighted, research/champpool/pool_board.py on the shared drive)
pb = list(csv.DictReader(open("/mnt/project-files/lol-second-goat/research/champpool/pool_board.csv")))
out["pool"] = [[by_link.get(r["Link"], r["Link"]), r["name"], int(float(r["games"])), int(r["champions"]), int(float(r["comfort"])), r["signature"]] for r in pb]
# script v4 stills (model v11)
ds = rows("draft_scores.csv")
f = lambda v: round(float(v), 2) if v not in ("", None) else None
idof = lambda r: by_link.get(r["Link"], r["Link"])
# the spoken measure (script 30-31): best-of-5 series won above expected, NOT draft_scores clutch_raw (weighted total
# with deciders, a different scale that pushed players off the axes in draft 10)
cl = list(csv.DictReader(open("/mnt/project-files/lol-second-goat/research/data/clutch_v15_3_per10.csv")))  # v15.3: per 10 big series, 40+ big series
out["clutch"] = [[by_link.get(r["Link"], r["player"].lower()), r["player"], int(float(r["big_series_weighted"])), float(r["series_above_per10"])] for r in cl]
im = list(csv.DictReader(open("/mnt/project-files/lol-second-goat/research/data/impact_v15_3_per100.csv")))  # v15.3: wins added per 100 games, 300+ games
out["impact"] = [[by_link.get(r["Link"], r["player"].lower()), r["player"], int(float(r["games"])), round(float(r["wins_added_per100"]), 1)] for r in im]
out["board"] = [[idof(r), r["name"], int(float(r["games"])), f(r["c_skill"]), f(r["c_big_stage"]), int(float(r["title_teams"] or 0)),
  int(float(r["worlds_titles"] or 0)) + int(float(r["msi_titles"] or 0)) + int(float(r["first_stand_titles"] or 0)) + int(float(r["domestic_titles"] or 0)),
  int(float(r["worlds_titles"] or 0)), f(r["vs_faker"]), f(r["intl_games"])] for r in ds]
ev = list(csv.DictReader(open("/mnt/project-files/lol-second-goat/research/data/event_values.csv")))
out["events"] = [[r["Page"], r["tier"], r["champ"], int(r["year"]), round(float(r["bits"]), 2)] for r in ev if r["REF"] == "1700"]
# kills per game by league and year (2016 on), and BLG's Worlds 2026 title credit
from collections import defaultdict
gk = defaultdict(lambda: [0, None, None])
for r in rows("games_2016on.csv"):
    pg = r["Page"]; rg = next((n for n in ("LCK", "LPL") if pg.startswith(n + "/")), None)
    if not rg: continue
    e = gk[r["GameId"]]; e[0] += int(float(r["Kills"] or 0)); e[1] = rg; e[2] = int(r["Date"][:4])
ky = defaultdict(list)
for k, rg, yr in gk.values(): ky[(rg, yr)].append(k)
out["kills"] = {rg: {yr: round(sum(v) / len(v), 1) for (g2, yr), v in sorted(ky.items()) if g2 == rg} for rg in ("LCK", "LPL")}
out["killsAll"] = {rg: round(sum(sum(v) for (g2, _), v in ky.items() if g2 == rg) / sum(len(v) for (g2, _), v in ky.items() if g2 == rg), 1) for rg in ("LCK", "LPL")}
out["blgCredit"] = [[by_link.get(r["Link"], r["Link"]), r["Link"].split(" (")[0], round(float(r["credit"]), 3)] for r in rows("title_credits.csv")
  if r["page"] == "2026 Season World Championship" and r["team"] == "Bilibili Gaming"]
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
print(json.dumps(out)[:1500])
# bump chart sample (ay 18:32): all-time rank at the end of each year, 2016-2026, everyone who was top 10 in any of those years
_rb = list(rows("rank_by_year.csv"))
_ids = sorted({r["player_id"] for r in _rb if 2016 <= int(r["year"]) <= 2026 and int(r["rank"]) <= 10})
out["bump"] = [[i, next(r["name"] for r in _rb if r["player_id"] == i),
  [next((int(r["rank"]) for r in _rb if r["player_id"] == i and int(r["year"]) == y), None) for y in range(2016, 2027)]] for i in _ids]
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
# with/without sample (ay 18:37 Jxmy ref; Faker off, ay 18:50: 0 games without): team record with him vs without, domestic, within 2 years of his stint
_ww = {(r["player"], r["team"]): r for r in rows("with_without.csv")}
out["withWithout"] = [[i, t, abbr, int(_ww[(p, t)]["with_W"]), int(_ww[(p, t)]["with_L"]), int(_ww[(p, t)]["without_W"]), int(_ww[(p, t)]["without_L"]), _ww[(p, t)]["without_years"]]
  for i, p, t, abbr in [("knight", "Knight", "Bilibili Gaming", "BLG"), ("chovy", "Chovy", "Gen.G", "GEN.G"), ("ruler", "Ruler", "JD Gaming", "JDG")]]
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
# round 4 shapes (ay 18:52: vary the chart types)
_tc = list(rows("title_credits.csv"))
_ds = {r["Link"]: r for r in rows("draft_scores.csv")}
_top = sorted(_ds.values(), key=lambda r: -float(r["trophy_pts"] or 0))[:8]
def _tier(link, tiers): return round(sum(float(r["pts"]) for r in _tc if r["Link"] == link and r["tier"] in tiers))
out["cabinetStack"] = [[by_link.get(r["Link"], r["Link"].lower()), _tier(r["Link"], ["worlds"]), _tier(r["Link"], ["msi"]), _tier(r["Link"], ["domestic"]),
  _tier(r["Link"], ["first_stand", "msc", "award"]), round(float(r["trophy_pts"]))] for r in _top]
ORG = {"ROX Tigers": "ROX", "SK Telecom T1": "SKT", "Kingzone DragonX": "KZ", "Gen.G": "GEN", "Samsung Galaxy": "GEN", "Hanwha Life Esports": "HLE",
  "Samsung Blue": "SSB", "EDward Gaming": "EDG", "KT Rolster": "KT", "DRX": "DRX", "MVP Ozone": "SSW", "Samsung White": "SSW", "Royal Never Give Up": "RNG",
  "Top Esports": "TES", "JD Gaming": "JDG", "Bilibili Gaming": "BLG"}
out["titleTimeline"] = []
for pid, link in [("peanut", "Peanut"), ("deft", "Deft"), ("mata", "Mata"), ("knight", "Knight (Zhuo Ding)")]:
  ts = sorted([(int(r["year"]), ORG.get(r["team"], r["team"])) for r in _tc if r["Link"] == link and r["place"] == "1" and r["tier"] != "award"])
  out["titleTimeline"].append([pid, ts])
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
