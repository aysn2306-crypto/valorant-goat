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
out["clutch"] = [[idof(r), r["name"], int(r["clutch_n"]), f(r["clutch_raw"])] for r in ds if r["clutch_raw"] not in ("", None) and int(r["clutch_n"]) > 0]
out["impact"] = [[by_link.get(r["Link"], r["Link"]), r["Link"].split(" (")[0], int(float(r["G"])), round(float(r["waa"]), 1)] for r in rows("rapm_career.csv")]
out["board"] = [[idof(r), r["name"], int(float(r["games"])), f(r["c_skill"]), f(r["c_big_stage"]), int(float(r["title_teams"] or 0)),
  int(float(r["worlds_titles"] or 0)) + int(float(r["msi_titles"] or 0)) + int(float(r["first_stand_titles"] or 0)) + int(float(r["domestic_titles"] or 0)),
  int(float(r["worlds_titles"] or 0)), f(r["vs_faker"]), f(r["intl_games"])] for r in ds]
ev = list(csv.DictReader(open("/mnt/project-files/lol-second-goat/research/data/event_values.csv")))
out["events"] = [[r["Page"], r["tier"], r["champ"], int(r["year"]), round(float(r["bits"]), 2)] for r in ev if r["REF"] == "1700"]
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
print(json.dumps(out)[:1500])
