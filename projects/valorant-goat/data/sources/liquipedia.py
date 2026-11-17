"""Liquipedia (Valorant wiki) via its public MediaWiki API.

Rules we follow (liquipedia.net/api-terms-of-use):
- at most one request every 2 seconds, gzip on, a descriptive generic user agent
- never use action=parse in bulk (that has a 30 s limit); we read raw wikitext
- data shown on screen is credited to Liquipedia (CC-BY-SA 3.0)
"""
import re, time
import requests

from .cache import cached

API = "https://liquipedia.net/valorant/api.php"
HEADERS = {"User-Agent": "valorant-goat-research/0.1 (non-commercial research script)",
           "Accept-Encoding": "gzip"}
DELAY_S = 2.1
_last = 0.0


def _get(params: dict) -> dict:
    global _last
    wait = DELAY_S - (time.time() - _last)
    if wait > 0:
        time.sleep(wait)
    for attempt in range(4):
        r = requests.get(API, params={**params, "format": "json"}, headers=HEADERS, timeout=60)
        _last = time.time()
        if r.status_code != 429:
            break
        # rate limited: back off (honour Retry-After when given)
        time.sleep(int(r.headers.get("Retry-After", 0)) or 60 * (attempt + 1))
    r.raise_for_status()
    return r.json()


def wikitext(title: str) -> str:
    def fetch():
        d = _get({"action": "query", "prop": "revisions", "rvprop": "content",
                  "rvslots": "main", "titles": title, "redirects": 1})
        page = next(iter(d["query"]["pages"].values()))
        return page["revisions"][0]["slots"]["main"]["*"]
    return cached("liquipedia", title, fetch)["data"]


def event_awards(title: str) -> list[dict]:
    """MVP-style awards listed on an event page, e.g. {{Slot|award=MVP|{{Opponent|aspas|team=LOUD}}}}."""
    out = []
    for m in re.finditer(r"\{\{Slot\|award=([^|]+)\|\{\{Opponent\|([^|}]+)(?:\|team=([^}|]+))?", wikitext(title)):
        out.append({"event": title, "award": m.group(1).strip(), "player": m.group(2).strip(),
                    "team": (m.group(3) or "").strip()})
    return out
