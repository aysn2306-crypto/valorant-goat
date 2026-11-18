"""script.py -> scratch VO (edge-tts) -> video/src/data/timeline.json. Run from the project root:
python3 edit/build_timeline.py [--no-tts]"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import script
from tts import say

FPS = 30
LEAD, GAP = 8, 9
ROOT = script.ROOT
MUSIC = json.load(open(os.path.join(ROOT, "edit", "music.json"))) if os.path.exists(os.path.join(ROOT, "edit", "music.json")) else {}


def resolve(x, starts, dur):
    if isinstance(x, str) and x.startswith("@"):
        m = re.match(r"@(end|\d+)([+-]\d+)?$", x)
        if not m:
            return x
        base = dur if m.group(1) == "end" else starts[min(int(m.group(1)), len(starts) - 1)] if starts else 0
        return base + int(m.group(2) or 0)
    if isinstance(x, dict):
        return {k: resolve(v, starts, dur) for k, v in x.items()}
    if isinstance(x, list):
        return [resolve(v, starts, dur) for v in x]
    return x


def main():
    beats, lines, sfx = [], [], []
    t = 0
    for k, b in enumerate(script.B):
        starts, cur = [], LEAD
        for text in b["lines"]:
            audio, d = say(text)
            fr = int(round(d * FPS))
            starts.append(cur)
            lines.append(dict(start=t + cur, dur=fr, audio=audio, text=text, beat=k))
            cur += fr + GAP
        dur = max(cur - GAP + b["tail"], 45)
        props = resolve(b["props"], starts, dur)
        beats.append(dict(id=f"b{k:03d}", scene=b["scene"], chapter=b["chapter"], start=t, dur=dur, props=props))
        for src, at, vol in b["sfx"]:
            a = resolve(at, starts, dur) if isinstance(at, str) else at
            sfx.append(dict(src="sfx/" + src, at=t + a - 2, vol=vol))
        t += dur
    music = []
    for m in MUSIC.get("beds", []):
        a = next(b["start"] for b in beats if b["chapter"] and b["chapter"].startswith(m["from_chapter"]))
        nxt = [b["start"] for b in beats if m.get("to_chapter") and b["chapter"] and b["chapter"].startswith(m["to_chapter"])]
        e = nxt[0] if nxt else t
        music.append(dict(src=m["src"], from_=a, dur=e - a, vol=m.get("vol", 0.16), skip=int(m.get("skip", 0) * FPS)))
    for m in music:
        m["from"] = m.pop("from_")
    out = dict(fps=FPS, total=t, beats=beats, lines=lines, sfx=sfx, music=music)
    json.dump(out, open(os.path.join(ROOT, "video", "src", "data", "timeline.json"), "w"), indent=0)
    chapters = []
    for b in beats:
        c = (b["chapter"] or "").split(" · ")[0]
        if not chapters or chapters[-1][1] != c:
            chapters.append((b["start"], c))
    print(f"{len(beats)} beats, {len(lines)} lines, {t / FPS / 60:.1f} min")
    for s, c in chapters:
        print(f"  {int(s / FPS // 60)}:{int(s / FPS % 60):02d} {c}")
    with open(os.path.join(ROOT, "edit", "SCRIPT.md"), "w") as f:
        f.write("# League #2 after Faker: script (generated from edit/script.py)\n\n")
        cur = None
        for b in beats:
            c = (b["chapter"] or "").split(" · ")[0]
            if c != cur:
                f.write(f"\n## {c}\n\n"); cur = c
            ls = [l for l in lines if l["beat"] == int(b["id"][1:])]
            if ls:
                f.write(f"*[{int(b['start'] / FPS // 60)}:{int(b['start'] / FPS % 60):02d}, on screen: {b['scene']}]*\n\n")
                for l in ls:
                    f.write(l["text"] + "\n\n")


if __name__ == "__main__":
    main()
