"""Square player tiles with the face in frame: data/raw/photos (one file per exact Leaguepedia Link) ->
video/public/players/<id>.png, where <id> is the id the video uses (league.json). Haar face detection; the face
sits a little above centre and fills about 40% of the width. No face found: top-centre square crop."""
import csv, json, os, re, sys
import cv2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw", "photos")
OUT = os.path.join(ROOT, "video", "public", "players")
SIZE = 600


def slug(n):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"\s*\(.*\)$", "", str(n)).lower()).strip("-")


def crop(img, casc):
    h, w = img.shape[:2]
    g = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
    if img.shape[2] == 4:   # transparent portrait: detect on a grey backdrop, keep the alpha in the tile
        a = img[:, :, 3:4] / 255.0
        g = (cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY) * a[:, :, 0] + 40 * (1 - a[:, :, 0])).astype("uint8")
    faces = casc.detectMultiScale(g, 1.1, 6, minSize=(max(24, w // 10), max(24, w // 10)))
    faces = [f for f in faces if f[1] + f[3] / 2 < h * 0.55]   # a face in a portrait is in the upper half
    if len(faces):
        faces = list(faces)
        x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
        side = int(min(max(fw / 0.42, fw * 1.8), w, h))
        cx, cy = x + fw / 2, y + fh / 2
        x0 = int(min(max(cx - side / 2, 0), w - side))
        y0 = int(min(max(cy - side * 0.44, 0), h - side))
        ok = True
    else:
        side = min(w, h)
        x0, y0 = (w - side) // 2, 0
        ok = False
    return cv2.resize(img[y0:y0 + side, x0:x0 + side], (SIZE, SIZE), interpolation=cv2.INTER_AREA), ok


def main():
    casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    d = json.load(open(os.path.join(ROOT, "video", "src", "data", "league.json")))
    id_of = {p["link"]: p["id"] for p in d["players"]}
    pool_ids = set(id_of.values())
    rows = list(csv.DictReader(open(os.path.join(RAW, "credits.csv"))))
    # several Links can be the same person in different spellings (Rookie, RooKie, ROOKIE): the newest photo wins
    yr = lambda r: max([int(y) for y in re.findall(r"20\d\d", r["source"])] or [0])
    rows.sort(key=yr)
    nofaces, out = [], []
    for r in rows:
        link = r["player"]
        src = os.path.join(RAW, r["file"])
        img = cv2.imread(src, cv2.IMREAD_UNCHANGED)
        if img is not None and img.ndim == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        if img is None:
            continue
        tile, ok = crop(img, casc)
        pid = id_of.get(link)
        if pid is None:   # not in the pool: never overwrite a pool player's tile that shares a short name
            pid = slug(link) if slug(link) not in pool_ids else re.sub(r"[^a-z0-9]+", "-", link.lower()).strip("-")
        cv2.imwrite(os.path.join(OUT, pid + ".png"), tile)
        out.append(dict(player=link, file=pid + ".png", team=r["team"], source=r["source"]))
        if not ok:
            nofaces.append(link)
    with open(os.path.join(OUT, "credits.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["player", "file", "team", "source"]); w.writeheader(); w.writerows(out)
    print(len(out), "tiles; no face found (top crop used):", nofaces)


if __name__ == "__main__":
    main()
