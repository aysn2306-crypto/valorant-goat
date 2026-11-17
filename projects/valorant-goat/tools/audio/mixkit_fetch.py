#!/usr/bin/env python3
"""Find and download Mixkit music and sound effects (Mixkit Free License: commercial use
including YouTube, no attribution needed). Python standard library + ffprobe.

Run on ay's PC (the cloud container can't reach mixkit.co).

    python tools/audio/mixkit_fetch.py list music cinematic            # candidates as JSON lines
    python tools/audio/mixkit_fetch.py list sfx whoosh
    python tools/audio/mixkit_fetch.py get <mp3-url> [<mp3-url> ...] --out video/public/music

Every download is logged in <out>/mixkit-manifest.json (page, url, title, licence, sha256,
duration). Category pages: https://mixkit.co/free-stock-music/<tag>/ and
https://mixkit.co/free-sound-effects/<tag>/ .
"""
import argparse
import hashlib
import html
import json
import pathlib
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from urllib.parse import urlparse
from urllib.request import Request, urlopen

UA = {"User-Agent": "Mozilla/5.0 (asset fetcher; personal video project)"}
BASES = {"music": "https://mixkit.co/free-stock-music/{tag}/", "sfx": "https://mixkit.co/free-sound-effects/{tag}/"}
MP3 = re.compile(r"https://assets\.mixkit\.co/[A-Za-z0-9_/.\-]+?\.mp3")
LICENCE = {"music": "Mixkit Stock Music Free License", "sfx": "Mixkit Sound Effects Free License"}


def fetch(url: str) -> bytes:
    with urlopen(Request(url, headers=UA), timeout=30) as r:
        return r.read()


def list_items(kind: str, tag: str, pages: int = 1):
    seen = []
    for p in range(1, pages + 1):
        url = BASES[kind].format(tag=tag) + (f"?page={p}" if p > 1 else "")
        page = fetch(url).decode("utf-8", "replace")
        for m in MP3.finditer(page):
            u = m.group(0)
            if u in (s["url"] for s in seen):
                continue
            # title: nearest heading-like text before the url
            before = page[max(0, m.start() - 3000):m.start()]
            t = re.findall(r'(?:title|alt|aria-label)="([^"]{3,80})"|<h\d[^>]*>\s*([^<]{3,80})\s*<', before)
            title = html.unescape(next((a or b for a, b in reversed(t) if (a or b).strip()), "")).strip()
            seen.append({"kind": kind, "tag": tag, "title": title, "url": u, "page": url})
        time.sleep(1.5)
    return seen


def duration(path: pathlib.Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    try:
        return round(float(r.stdout.strip()), 3)
    except ValueError:
        return -1.0


def get(urls, out: pathlib.Path, kind: str, titles: dict):
    out.mkdir(parents=True, exist_ok=True)
    man_p = out / "mixkit-manifest.json"
    man = json.loads(man_p.read_text(encoding="utf-8")) if man_p.exists() else []
    for u in urls:
        if urlparse(u).hostname != "assets.mixkit.co" or not u.endswith(".mp3"):
            print("skip (not a Mixkit mp3):", u, file=sys.stderr)
            continue
        data = fetch(u)
        if data[:3] != b"ID3" and data[:2] not in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2"):
            print("skip (not audio):", u, file=sys.stderr)
            continue
        slug = re.sub(r"[^a-z0-9]+", "-", (titles.get(u) or pathlib.Path(urlparse(u).path).stem).lower()).strip("-")
        dest = out / f"mixkit-{slug}.mp3"
        dest.write_bytes(data)
        row = {"file": dest.name, "url": u, "title": titles.get(u, ""), "licence": LICENCE[kind],
               "licence_url": "https://mixkit.co/license/", "sha256": hashlib.sha256(data).hexdigest(),
               "duration": duration(dest), "downloaded": datetime.now(timezone.utc).isoformat(timespec="seconds")}
        man = [m for m in man if m["file"] != dest.name] + [row]
        print(json.dumps(row))
        time.sleep(1.0)
    man_p.write_text(json.dumps(man, indent=1), encoding="utf-8")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    l = sub.add_parser("list")
    l.add_argument("kind", choices=["music", "sfx"])
    l.add_argument("tag")
    l.add_argument("--pages", type=int, default=1)
    g = sub.add_parser("get")
    g.add_argument("urls", nargs="+")
    g.add_argument("--out", required=True)
    g.add_argument("--kind", choices=["music", "sfx"], default="music")
    g.add_argument("--titles", help="JSON-lines file from `list`, to name files by title")
    a = ap.parse_args()
    if a.cmd == "list":
        for item in list_items(a.kind, a.tag, a.pages):
            print(json.dumps(item))
    else:
        titles = {}
        if a.titles:
            for line in pathlib.Path(a.titles).read_text(encoding="utf-8").splitlines():
                if line.strip():
                    d = json.loads(line)
                    titles[d["url"]] = d["title"]
        get(a.urls, pathlib.Path(a.out), a.kind, titles)
