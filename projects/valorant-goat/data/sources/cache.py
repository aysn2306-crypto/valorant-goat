"""Tiny disk cache: every raw response is saved once under data/raw/ and
never fetched again. Delete a file to force a refetch."""
import hashlib, json, os, pathlib

RAW = pathlib.Path(os.environ.get("VG_RAW") or pathlib.Path(__file__).resolve().parents[1] / "raw")


def cached(namespace: str, key: str, fetch):
    path = RAW / namespace / (hashlib.sha1(key.encode()).hexdigest()[:16] + ".json")
    if path.exists():
        return json.loads(path.read_text())
    data = fetch()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"key": key, "data": data}, default=str))
    return {"key": key, "data": data}
