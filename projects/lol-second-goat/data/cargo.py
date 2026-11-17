"""Leaguepedia Cargo API helper (lol.fandom.com), cached, paginated, polite."""
import gzip, hashlib, json, os, time, urllib.parse, urllib.request

API = "https://lol.fandom.com/api.php"
UA = "lol-research/0.1 (fan video research)"
CACHE = os.path.join(os.path.dirname(__file__), "raw", "cargo")
os.makedirs(CACHE, exist_ok=True)


def _get(params):
    q = urllib.parse.urlencode(params)
    key = hashlib.md5(q.encode()).hexdigest()
    f = os.path.join(CACHE, key + ".json")
    if os.path.exists(f):
        return json.load(open(f))
    for attempt in range(6):
        req = urllib.request.Request(API + "?" + q, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
        try:
            raw = urllib.request.urlopen(req, timeout=60).read()
            try:
                raw = gzip.decompress(raw)
            except OSError:
                pass
            d = json.loads(raw)
            if "error" in d:
                if "ratelimited" in json.dumps(d):
                    time.sleep(10 * (attempt + 1)); continue
                raise RuntimeError(d["error"])
            json.dump(d, open(f, "w"))
            time.sleep(1.0)
            return d
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                time.sleep(10 * (attempt + 1)); continue
            raise
    raise RuntimeError("cargo request failed: " + q)


def query(tables, fields, where="", join_on="", group_by="", order_by="", page=500):
    out, offset = [], 0
    while True:
        p = {"action": "cargoquery", "format": "json", "tables": tables, "fields": fields,
             "limit": page, "offset": offset}
        if where: p["where"] = where
        if join_on: p["join_on"] = join_on
        if group_by: p["group_by"] = group_by
        if order_by: p["order_by"] = order_by
        rows = [r["title"] for r in _get(p).get("cargoquery", [])]
        out += rows
        if len(rows) < page:
            return out
        offset += page
