"""Step 3: the beat map. Turns "this graphic lands on this word" into frame numbers.

Each section has a beat map (edit/beatmaps/<section>.yaml). Every beat names the
script line it belongs to and the word the picture should land on. After the
voiceover is cut, this script finds those words in the cut audio and writes
video/src/data/beats/<section>.json, which the Remotion scene reads for its timing.
Re-record a line, re-run it, and the edit moves with the voice.

    python -m edit.beats edit/beatmaps/clutch.yaml edit/assets/vo_raw.clean.words.json

Beat map format:
    section: clutch
    fps: 30
    beats:
      - id: name          # what the scene calls this moment
        line: 1           # script line number (1-based)
        word: clutch      # word in that line the picture lands on (default: the line's first word)
        lead: 0.0         # seconds the picture lands BEFORE the word (default 0; text may lead speech slightly)
"""
import json
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9']", "", s.lower())


def build(beatmap: str, words_json: str) -> pathlib.Path:
    bm = yaml.safe_load(open(beatmap, encoding="utf-8"))
    data = json.loads(pathlib.Path(words_json).read_text(encoding="utf-8"))
    fps = bm.get("fps", 30)
    words = data["words"]
    out, problems = [], []
    for b in bm["beats"]:
        line_words = [w for w in words if w.get("line") == b["line"]]
        if not line_words:
            problems.append(f"{b['id']}: line {b['line']} has no words in the cut audio")
            continue
        hit = line_words[0]
        if b.get("word"):
            target = [norm(t) for t in str(b["word"]).split()]
            toks = [norm(w["w"]) for w in line_words]
            for i in range(len(toks)):
                if toks[i:i + len(target)] == target:
                    hit = line_words[i]
                    break
            else:
                problems.append(f"{b['id']}: word '{b['word']}' not found in line {b['line']}")
        t = max(0.0, hit["start"] - float(b.get("lead", 0)))
        out.append({"id": b["id"], "line": b["line"], "t": round(t, 3), "frame": round(t * fps),
                    "lineEnd": round(line_words[-1]["end"], 3)})
    end = max((w["end"] for w in words), default=0)
    dest = ROOT / "video" / "src" / "data" / "beats" / f"{bm['section']}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps({"section": bm["section"], "fps": fps, "voEnd": round(end, 3),
                                "durationInFrames": round((end + 1.5) * fps), "beats": out}, indent=1), encoding="utf-8")
    for p in problems:
        print("!!", p, file=sys.stderr)
    return dest


if __name__ == "__main__":
    print(build(sys.argv[1], sys.argv[2]))
