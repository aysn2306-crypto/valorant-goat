"""Scratch VO for the trophy dots sample; writes video/src/data/dots_vo.json (src, seconds)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts import say, ROOT
LINES = [
    "First award: the biggest trophy cabinet. Every trophy point, added up.",
    "The nominees: Knight, Canyon, Gumayusi and Ruler.",
    "And the winner is Ruler. Only one world title, but nobody in the race has more trophy points.",
    "Oh, and here's Faker, by the way.",
    "1,154.",
]
out = []
for t in LINES:
    src, d = say(t)
    out.append(dict(text=t, src=src, sec=round(d, 3)))
json.dump(out, open(os.path.join(ROOT, "video", "src", "data", "dots_vo.json"), "w"), indent=1)
for o in out: print(o["sec"], o["text"])
