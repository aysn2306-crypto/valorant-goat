"""Joins the ranking thread's CSVs onto league.json ids for the graph stills (read-only use of their outputs)."""
import csv, json, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
L = json.load(open(root / "video/src/data/league.json"))
by_link = {p["link"]: p["id"] for p in L["players"]}
def rows(n): return list(csv.DictReader(open(root / "data/csv" / n)))
out = {}
out["bigStage"] = {by_link[r["Link"]]: round(float(r["c_big_stage_clutch"]), 1) for r in rows("draft_scores.csv") if r["Link"] in by_link and r["c_big_stage_clutch"]}
out["intl"] = [[by_link.get(r["Link"], r["Link"].lower()), r["name"], float(r["score"])] for r in rows("whatif_intl_only.csv")][:10]
out["knightNeeds"] = [[r["case"], float(r["knight"]), float(r["faker"])] for r in rows("whatif_knight_needs.csv")]
split = rows("draft_scores_split_faker.csv"); split.sort(key=lambda r: -float(r["score"]))
out["split"] = [[r["Link"], r["name"], r["years"], round(float(r["score"]), 1)] for r in split]
json.dump(out, open(root / "video/src/data/stills.json", "w"), indent=1)
print(json.dumps(out)[:1500])
