"""Step 5: self-review of a rendered section, before ay sees it.

Checks what can be measured, and builds frame strips for what has to be looked at.
From Duncan Rogoff's six-mistake list (ay's editing-refs), adapted to a voiceover-only video:

 1. animation playing twice       -> strips around every cut: look for a repeat
 2. graphic flashing for a split second -> two cuts closer than 0.4 s are flagged
 3. text landing too late to read  -> each beat must hold 0.5 s + 0.3 s per on-screen word
 4. graphic over a face            -> n/a (no face cam); applies to gameplay clips: look at strips
 5. a repeated word in the VO      -> same word twice in a row in the cut transcript
 6. lip-sync drift                 -> n/a; instead: VO ends before the video does
 + loudness: integrated -14 LUFS (+/-1), true peak at or under -1 dBTP

    python -m edit.review video/out/clutch.mp4 [--beats video/src/data/beats/clutch.json]
      [--words edit/assets/vo_raw.clean.words.json] [--text-words beat_id=4,beat_id2=7]
    -> video/out/review/<name>/REVIEW.md and cut strips (10 fps, -0.3 s to +0.3 s around each cut)
"""
import argparse
import json
import pathlib
import re
import subprocess


def cuts(video: str, thr: float = 0.3) -> list[float]:
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", video, "-vf", f"select='gt(scene,{thr})',showinfo",
                        "-f", "null", "-"], capture_output=True, text=True)
    return [float(m) for m in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


def loudness(video: str) -> tuple[float, float]:
    r = subprocess.run(["ffmpeg", "-nostats", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    s = r.stderr[r.stderr.rfind("Summary"):]
    i = re.search(r"I:\s+(-?[0-9.]+) LUFS", s)
    p = re.search(r"Peak:\s+(-?[0-9.inf]+) dBFS", s)
    return (float(i.group(1)) if i else float("nan"), float(p.group(1)) if p else float("nan"))


def duration(video: str) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def strip(video: str, t: float, dest: pathlib.Path):
    a = max(0.0, t - 0.3)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.2f}", "-t", "0.6", "-i", video, "-vf",
                    "fps=10,scale=384:-2,tile=6x1", "-frames:v", "1", str(dest)], check=True)


def main(a):
    video = a.video
    name = pathlib.Path(video).stem
    out = pathlib.Path(video).parent / "review" / name
    out.mkdir(parents=True, exist_ok=True)
    notes = []

    c = cuts(video, a.thr)
    for x, y in zip(c, c[1:]):
        if y - x < 0.4:
            notes.append(f"P0 flash: shot from {x:.2f}s to {y:.2f}s lasts {y - x:.2f}s (under 0.4 s)")
    for n, t in enumerate(c):
        strip(video, t, out / f"cut_{n:02d}_{t:06.2f}s.jpg")

    if a.beats:
        beats = json.loads(pathlib.Path(a.beats).read_text(encoding="utf-8"))["beats"]
        counts = dict(kv.split("=") for kv in a.text_words.split(",")) if a.text_words else {}
        for b, nxt in zip(beats, beats[1:] + [None]):
            hold = (nxt["t"] if nxt else duration(video)) - b["t"]
            need = 0.5 + 0.3 * int(counts.get(b["id"], 3))
            if hold < need:
                notes.append(f"P0 too short to read: beat '{b['id']}' holds {hold:.2f}s, needs {need:.2f}s")
            strip(video, b["t"] + 0.3, out / f"beat_{b['id']}_{b['t']:06.2f}s.jpg")  # the landing, 0 to +0.6 s

    if a.words:
        ws = json.loads(pathlib.Path(a.words).read_text(encoding="utf-8"))["words"]
        toks = [re.sub(r"[^a-z0-9']", "", w["w"].lower()) for w in ws]
        for i in range(1, len(toks)):
            if toks[i] and toks[i] == toks[i - 1] and toks[i] not in {"that", "had", "very"}:
                notes.append(f"P1 repeated word '{ws[i]['w']}' at {ws[i]['start']:.2f}s")
        vo_end = max(w["end"] for w in ws)
        if vo_end > duration(video):
            notes.append(f"P0 voiceover runs {vo_end - duration(video):.2f}s past the end of the video")

    i_lufs, peak = loudness(video)
    if not (-15 <= i_lufs <= -13):
        notes.append(f"P1 loudness {i_lufs} LUFS (target -14 +/- 1)")
    if peak > -1:
        notes.append(f"P1 true peak {peak} dBTP (keep at or under -1)")

    report = [f"# Review: {name}", "", f"- hard cuts found: {len(c)}; strips in this folder at 10 fps: cut_* (-0.3 to +0.3 s), beat_* (0 to +0.6 s after each beat)",
              f"- loudness: {i_lufs} LUFS integrated, true peak {peak} dBTP (measured, not heard)", "",
              "## Notes", *(notes or ["- nothing flagged by the measurable checks"]), "",
              "## Look at by eye", "- each cut strip: does any animation play twice, jump or pop on with no move?",
              "- gameplay clips: is a graphic covering the action or a face?",
              "- phone check: open the beat frames at 360 px wide; can every line be read?"]
    (out / "REVIEW.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(out / "REVIEW.md")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--beats")
    ap.add_argument("--words")
    ap.add_argument("--thr", type=float, default=0.3, help="scene-change threshold; motion graphics on dark grounds score low, so beats are the main unit")
    ap.add_argument("--text-words", default="", help="beat_id=N words of on-screen text, comma separated")
    main(ap.parse_args())
