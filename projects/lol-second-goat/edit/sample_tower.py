"""Scratch VO for the trophy tower sample; writes video/src/data/tower_vo.json (src, seconds)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts import say, ROOT
LINES = [
    "First award: the biggest trophy cabinet. Every trophy point, added up.",
    "The nominees are Ruler, Gumayusi, Canyon and Knight, all at just over 500 points.",
    "And then you go up the list.",
    "And up.",
    "Faker. 1,154 points.",
    "That's more than the next two players combined.",
    "In a league of his own.",
]
out = []
for t in LINES:
    src, d = say(t)
    out.append(dict(text=t, src=src, sec=round(d, 3)))
json.dump(out, open(os.path.join(ROOT, "video", "src", "data", "tower_vo.json"), "w"), indent=1)
for o in out: print(o["sec"], o["text"])
