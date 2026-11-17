"""Step 2: keep the last clean take of every script line and cut everything else.

ay reads the script top to bottom and simply repeats a line when it goes wrong.
This finds every take of each line in the Whisper words, keeps the LAST one that
matches the script well enough, joins the kept takes with a short pause, and lists
exactly what was removed (so nothing disappears silently).

    python -m edit.vo_cut edit/assets/vo_raw.wav edit/script/clutch.txt
      -> edit/assets/vo_raw.clean.wav          the cut voiceover
         edit/assets/vo_raw.clean.words.json   word times on the CUT audio (+ line numbers)
         edit/assets/vo_raw.removed.txt        every removed stretch with its words

Script file: one spoken line per row; blank rows and rows starting with # are ignored.
"""
import argparse
import json
import pathlib
import re
import subprocess
from difflib import SequenceMatcher

PAD_IN, PAD_OUT = 0.10, 0.18      # keep a little air around each take (s)
GAP = 0.28                         # pause inserted between kept lines (s)
MIN_MATCH = 0.78                   # share of the line's words a take must match


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9']", "", s.lower())


def read_script(path: str) -> list[str]:
    rows = pathlib.Path(path).read_text(encoding="utf-8").splitlines()
    return [r.strip() for r in rows if r.strip() and not r.strip().startswith("#")]


def find_takes(words: list[dict], line: str, start_idx: int) -> list[tuple[int, int, float]]:
    """All (i, j, score) spans words[i:j] after start_idx that read as `line`."""
    target = [norm(t) for t in line.split() if norm(t)]
    n = len(target)
    toks = [norm(w["w"]) for w in words]
    found = []
    for i in range(start_idx, len(words)):
        if toks[i] not in target[:3]:          # a take starts on one of the first 3 words
            continue
        best = None
        for j in range(i + max(1, n - 2), min(len(words), i + n + 3) + 1):
            r = SequenceMatcher(None, toks[i:j], target, autojunk=False).ratio()
            if best is None or r > best[2]:
                best = (i, j, r)
        if best and best[2] >= MIN_MATCH:
            found.append(best)
    # drop overlapping spans, keeping the better score
    out = []
    for s in sorted(found, key=lambda x: -x[2]):
        if all(s[1] <= o[0] or s[0] >= o[1] for o in out):
            out.append(s)
    return sorted(out)


def plan_cut(words: list[dict], lines: list[str]):
    kept, cursor = [], 0
    for li, line in enumerate(lines):
        takes = find_takes(words, line, cursor)
        if not takes:
            kept.append({"line": li + 1, "text": line, "missing": True})
            continue
        # takes that start before the NEXT line's first take belong to this line; keep the last
        nxt = find_takes(words, lines[li + 1], takes[0][1]) if li + 1 < len(lines) else []
        limit = nxt[0][0] if nxt else len(words)
        mine = [t for t in takes if t[0] < limit] or takes[:1]
        i, j, score = mine[-1]
        kept.append({"line": li + 1, "text": line, "i": i, "j": j, "score": round(score, 2), "takes": len(mine)})
        cursor = j
    return kept


def main(audio: str, script: str):
    audio_p = pathlib.Path(audio)
    data = json.loads(audio_p.with_suffix(".words.json").read_text(encoding="utf-8"))
    words, dur = data["words"], data["duration"]
    lines = read_script(script)
    kept = plan_cut(words, lines)

    spans, new_words, removed, t_out, prev_end = [], [], [], 0.0, 0.0
    for k in kept:
        if k.get("missing"):
            removed.append(f"!! line {k['line']} NOT FOUND in the recording: {k['text']}")
            continue
        a = max(0.0, words[k["i"]]["start"] - PAD_IN)
        b = min(dur, words[k["j"] - 1]["end"] + PAD_OUT)
        if a > prev_end + 0.05:
            gone = [w["w"] for w in words if w["start"] >= prev_end and w["end"] <= a]
            removed.append(f"{prev_end:8.2f}-{a:8.2f}s  removed: {' '.join(gone) or '(silence)'}")
        for w in words[k["i"]:k["j"]]:
            new_words.append({**w, "start": round(w["start"] - a + t_out, 3), "end": round(w["end"] - a + t_out, 3),
                              "line": k["line"]})
        spans.append((a, b))
        t_out += (b - a) + GAP
        prev_end = b
    if prev_end < dur - 0.05:
        removed.append(f"{prev_end:8.2f}-{dur:8.2f}s  removed: tail")

    # ffmpeg: trim each span, 10 ms fades against clicks, join with GAP of silence
    parts, labels = [], []
    for n, (a, b) in enumerate(spans):
        parts.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,"
                     f"afade=t=out:st={max(0, b - a - 0.01):.3f}:d=0.01,apad=pad_dur={GAP}[s{n}]")
        labels.append(f"[s{n}]")
    graph = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(spans)}:v=0:a=1[out]"
    out_wav = audio_p.with_suffix(".clean.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(audio_p), "-filter_complex", graph, "-map", "[out]",
                    "-ar", "48000", str(out_wav)], check=True)

    audio_p.with_suffix(".clean.words.json").write_text(json.dumps(
        {"audio": str(out_wav), "lines": lines, "words": new_words}, indent=1), encoding="utf-8")
    report = [f"{k['line']:3d} kept take {k.get('takes', 0)} of {k.get('takes', 0)} (match {k.get('score', 0)}): {k['text']}"
              for k in kept if not k.get("missing")]
    audio_p.with_suffix(".removed.txt").write_text("\n".join(report + [""] + removed) + "\n", encoding="utf-8")
    print(out_wav)
    print("\n".join(r for r in removed if r.startswith("!!")) or "all lines found")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("script")
    a = ap.parse_args()
    main(a.audio, a.script)
