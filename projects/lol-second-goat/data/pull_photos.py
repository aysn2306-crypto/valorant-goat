"""Player photos from Leaguepedia (lol.fandom.com, Players.Image = current profile photo) for the video.
Writes video/public/players/<slug>.png|jpg and video/public/players/credits.csv (file page, for the credits list)."""
import csv, json, os, re, sys, time, urllib.parse, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
import cargo
import pandas as pd
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "video", "public", "players")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "lol-research/0.1 (fan video research)"}


def slug(n):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"\s*\(.*\)$", "", n).lower()).strip("-")


def main(extra):
    P = pd.read_csv(os.path.join(ROOT, "data", "csv", "draft_scores.csv"), index_col=0).sort_values("score", ascending=False)
    links = list(P.index[:60])
    for c in [c for c in P.columns if c.startswith("c_")]:
        links += list(P.sort_values(c, ascending=False).index[:6])
    links += [l for l in P.index if re.sub(r"\s*\(.*\)$", "", l) in extra]
    J = os.path.join(ROOT, "video", "src", "data", "league.json")
    if os.path.exists(J):
        d = json.load(open(J)); byid = {p["id"]: p["link"] for p in d["players"]}
        ids = [i for b in d["boards"].values() for i in b] + [i for rb in d["roleBoards"].values() for b in rb.values() for i in b]
        ids += [x[0] for w in d["worlds"] for x in w["players"]]
        links += [byid[i] for i in ids if i in byid]
    links = list(dict.fromkeys(links))
    rows = []
    for i in range(0, len(links), 20):
        ch = links[i:i + 20]
        where = "Link IN (%s)" % ",".join('"%s"' % l.replace('"', '\\"') for l in ch)
        rows += cargo.query("PlayerImages", "FileName,Link,Team,Tournament", where=where)
    best = {}
    for r in rows:
        y = re.findall(r"20\d\d", (r.get("Tournament") or "") + " " + (r.get("FileName") or ""))
        r["y"] = max(map(int, y)) if y else 0
        if r["Link"] not in best or r["y"] > best[r["Link"]]["y"]:
            best[r["Link"]] = r
    rows = [dict(OverviewPage=k, Image=v["FileName"], Team=v["Team"]) for k, v in best.items()]
    cred = []
    for r in rows:
        if not r.get("Image"):
            continue
        q = urllib.parse.urlencode({"action": "query", "titles": "File:" + r["Image"], "prop": "imageinfo", "iiprop": "url",
                                    "iiurlwidth": 600, "format": "json"})
        d = json.load(urllib.request.urlopen(urllib.request.Request("https://lol.fandom.com/api.php?" + q, headers=UA), timeout=60))
        info = next(iter(d["query"]["pages"].values())).get("imageinfo")
        if not info:
            continue
        url = info[0].get("thumburl") or info[0]["url"]
        ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or ".png"
        if ext not in (".png", ".jpg", ".jpeg", ".webp"):
            ext = ".png"
        f = os.path.join(OUT, slug(r["OverviewPage"]) + ext)
        if not os.path.exists(f):
            open(f, "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())
            time.sleep(0.5)
        cred.append(dict(player=r["OverviewPage"], file=os.path.basename(f), team=r["Team"], source="https://lol.fandom.com/wiki/File:" + r["Image"].replace(" ", "_")))
    with open(os.path.join(OUT, "credits.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["player", "file", "team", "source"]); w.writeheader(); w.writerows(cred)
    print(len(cred), "photos of", len(links), "players")


if __name__ == "__main__":
    main(["Uzi", "Bengi", "Caps", "Rekkles", "Bjergsen", "Doublelift", "Perkz", "TheShy", "Rookie", "Deft", "Gumayusi",
          "Oner", "Piglet", "Mata", "Imp", "Smeb", "Pray", "Bang", "Wolf", "Ambition", "MaRin", "Score", "Mystic", "Scout",
          "Jankos", "ShowMaker", "Clid", "Tian", "Ning", "Shy", "Lehends", "Kingen", "Doran", "Elk", "Xun", "ON", "JackeyLove"])
