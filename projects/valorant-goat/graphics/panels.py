"""Beat-based video panels (see the production plan, panel IDs P01-P20).

A panel is drawn by a function `draw(d, img, beat, t)`:
  beat = how many beats are revealed (0..n), t = 0..1 progress of the newest beat
  (used for count-ups and slides). Each panel exports one PNG per beat and a
  draft reveal video (default 2.5 s per beat), retimed later to the voiceover.

    python -m graphics.panels            # renders all mock-ups into graphics/out/mock/
"""
import subprocess
from dataclasses import dataclass, field
from typing import Callable

from PIL import Image, ImageDraw, ImageFont

from graphics.style import (BG, PANEL, CYAN, GOLD, RED, MINT, TEXT, MUTED, W, H, OUT,
                            TITLE_FONT, BODY_FONT)

MOCK_OUT = OUT / "mock"
SLIDE_S, COUNT_S = 0.3, 0.6


def font(path, size, weight=None):
    f = ImageFont.truetype(str(path), size)
    if weight and path == BODY_FONT:
        try:
            f.set_variation_by_axes([14, weight])
        except Exception:
            pass
    return f


def ease(t):
    return 1 - (1 - min(max(t, 0), 1)) ** 3


def hex_rgb(h, a=255):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


def trophy(d, x, y, s, color=GOLD):
    """Simple cup icon, s = height in px."""
    w = s * 0.8
    d.polygon([(x, y), (x + w, y), (x + w * 0.78, y + s * 0.5), (x + w * 0.22, y + s * 0.5)], fill=color)
    d.rectangle([x + w * 0.44, y + s * 0.5, x + w * 0.56, y + s * 0.78], fill=color)
    d.rectangle([x + w * 0.22, y + s * 0.78, x + w * 0.78, y + s * 0.9], fill=color)


def footer(d, text="Data: vlr.gg, Liquipedia (CC-BY-SA)"):
    d.text((120, H - 58), "MOCK-UP · placeholder data", font=font(BODY_FONT, 24, 600), fill=RED)
    tw = d.textlength(text, font=font(BODY_FONT, 24, 400))
    d.text((W - 120 - tw, H - 58), text, font=font(BODY_FONT, 24, 400), fill=MUTED)


def tile(d, x, y, w, h, label, value, color=TEXT):
    d.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=PANEL)
    d.text((x + 30, y + 22), label.upper(), font=font(BODY_FONT, 26, 600), fill=MUTED)
    d.text((x + 30, y + 64), value, font=font(TITLE_FONT, 80), fill=color)


@dataclass
class Panel:
    pid: str
    name: str
    beats: int
    draw: Callable
    beat_seconds: list = field(default_factory=list)

    def frame(self, beat, t=1.0):
        img = Image.new("RGBA", (W, H), hex_rgb(BG))
        d = ImageDraw.Draw(img)
        self.draw(d, img, beat, t)
        footer(d)
        return img.convert("RGB")

    def export(self, video=True, fps=30):
        MOCK_OUT.mkdir(parents=True, exist_ok=True)
        stem = f"{self.pid}_{self.name}"
        for b in range(1, self.beats + 1):
            self.frame(b).save(MOCK_OUT / f"{stem}_beat{b}.png")
        self.frame(self.beats).save(MOCK_OUT / f"{stem}.png")
        if not video:
            return
        secs = self.beat_seconds or [2.5] * self.beats
        out = MOCK_OUT / f"{stem}_reveal.mp4"
        p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                              "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-c:v", "libx264",
                              "-pix_fmt", "yuv420p", "-crf", "20", str(out)], stdin=subprocess.PIPE)
        for b, s in zip(range(1, self.beats + 1), secs):
            n = int(s * fps)
            for i in range(n):
                t = min(i / (fps * 1.0), 1.0)  # seconds into beat, capped at 1 s
                p.stdin.write(self.frame(b, t).tobytes())
        p.stdin.close()
        p.wait()
        return out


# ---------- P12 player stat panel ----------
def draw_player(d, img, beat, t):
    a = lambda b: 1.0 if beat > b else (t / SLIDE_S if beat == b else 0)  # noqa: E731
    slide = lambda b: int((1 - ease(a(b))) * -60)  # noqa: E731
    cnt = lambda b: 1.0 if beat > b else (ease(t / COUNT_S) if beat == b else 0)  # noqa: E731
    if beat >= 1:
        d.text((110, 70), "#7", font=font(TITLE_FONT, 230), fill=CYAN)
    if beat >= 2:
        d.text((430 + slide(2), 80), "PLAYER A", font=font(TITLE_FONT, 140), fill=TEXT)
        d.text((436 + slide(2), 270), "TEAM ONE 2021–22  ·  TEAM TWO 2023–26", font=font(BODY_FONT, 36, 600), fill=MUTED)
    if beat >= 3:
        d.text((436, 322), "DUELIST  ·  ACTIVE 2021–2026  ·  1,840 INTL ROUNDS", font=font(BODY_FONT, 32, 500), fill=CYAN)
    tw, th, gx, x0, y0 = 420, 180, 30, 120, 420
    stats = [(4, "Rating", 1.21, "{:.2f}"), (5, "ACS", 241, "{:.0f}"), (5, "ADR", 158.4, "{:.1f}"),
             (6, "KAST", 74, "{:.0f}%"), (6, "First kills − deaths", 0.05, "+{:.2f}/rd"), (6, "Clutch win", 18, "{:.0f}%")]
    for i, (b, label, val, fmt) in enumerate(stats):
        if beat >= b:
            x, y = x0 + (i % 3) * (tw + gx), y0 + (i // 3) * (th + gx)
            tile(d, x, y + (0 if beat > b else int((1 - ease(a(b))) * 30)), tw, th, label, fmt.format(val * cnt(b)))
    if beat >= 7:
        d.text((120, 840), "TITLES", font=font(BODY_FONT, 26, 600), fill=MUTED)
        for i, lab in enumerate(["CHAMPIONS 2024", "MASTERS 2023", "MASTERS 2025"]):
            if beat > 7 or t >= i * 0.25:
                x = 120 + i * 440
                trophy(d, x, 880, 70)
                d.text((x + 72, 895), lab, font=font(BODY_FONT, 28, 700), fill=GOLD)
    if beat >= 8:
        bx = 1460 + int((1 - ease(a(8))) * 500)
        d.rounded_rectangle([bx, 420, bx + 340, 810], radius=18, fill=CYAN)
        d.text((bx + 30, 446), "SIGNATURE\nSTAT", font=font(BODY_FONT, 30, 800), fill=BG, spacing=4)
        d.text((bx + 26, 540), "62%", font=font(TITLE_FONT, 120), fill=BG)
        d.multiline_text((bx + 30, 700), "of opening duels\nwon in grand finals", font=font(BODY_FONT, 26, 600), fill=BG, spacing=6)


# ---------- P13 head-to-head ----------
H2H = [("Rating", 1.24, 1.17, "{:.2f}"), ("ACS", 248, 221, "{:.0f}"), ("ADR", 161.2, 149.0, "{:.1f}"),
       ("KAST", 72, 77, "{:.0f}%"), ("Clutch win", 16, 21, "{:.0f}%"), ("Titles", 3, 4, "{:.0f}")]


def draw_h2h(d, img, beat, t):
    if beat >= 1:
        d.text((120, 70), "PLAYER B", font=font(TITLE_FONT, 120), fill=TEXT)
        tw = d.textlength("PLAYER C", font=font(TITLE_FONT, 120))
        d.text((W - 120 - tw, 70), "PLAYER C", font=font(TITLE_FONT, 120), fill=TEXT)
        d.text((W / 2 - 30, 110), "VS", font=font(TITLE_FONT, 80), fill=MUTED)
    for i, (lab, l, r, fmt) in enumerate(H2H):
        if beat >= i + 2:
            y = 280 + i * 118
            d.rounded_rectangle([120, y, W - 120, y + 100], radius=14, fill=PANEL)
            lw = d.textlength(lab.upper(), font=font(BODY_FONT, 30, 700))
            d.text((W / 2 - lw / 2, y + 32), lab.upper(), font=font(BODY_FONT, 30, 700), fill=MUTED)
            lwin = l > r
            d.text((160, y + 12), fmt.format(l), font=font(TITLE_FONT, 62), fill=CYAN if lwin else MUTED)
            rv = fmt.format(r)
            rw = d.textlength(rv, font=font(TITLE_FONT, 62))
            d.text((W - 160 - rw, y + 12), rv, font=font(TITLE_FONT, 62), fill=MUTED if lwin else CYAN)


# ---------- P07 recency reshuffle ----------
BEFORE = ["PLAYER D", "PLAYER E", "PLAYER F", "PLAYER G", "PLAYER H", "PLAYER J"]
AFTER = ["PLAYER F", "PLAYER D", "PLAYER H", "PLAYER E", "PLAYER J", "PLAYER G"]
SCORES = {"PLAYER D": 81.2, "PLAYER E": 78.9, "PLAYER F": 82.6, "PLAYER G": 70.3, "PLAYER H": 79.4, "PLAYER J": 72.0}


def draw_reshuffle(d, img, beat, t):
    d.text((120, 60), "TWIST: NEWER TITLES COUNT MORE", font=font(TITLE_FONT, 86), fill=TEXT)
    d.text((124, 180), "2021 ×0.85  →  2026 ×1.10", font=font(BODY_FONT, 34, 600), fill=CYAN)
    k = 0 if beat == 1 else ease(t / 0.8) if beat == 2 else 1
    for name in BEFORE:
        i0, i1 = BEFORE.index(name), AFTER.index(name)
        y = 270 + (i0 + (i1 - i0) * k) * 118
        d.rounded_rectangle([120, y, 1500, y + 100], radius=14, fill=PANEL)
        rank = i0 + 1 if k < 0.5 else i1 + 1
        d.text((150, y + 14), f"#{rank}", font=font(TITLE_FONT, 60), fill=TEXT)
        d.text((320, y + 14), name, font=font(TITLE_FONT, 60), fill=TEXT)
        if beat >= 3:
            sc = f"{SCORES[name]:.1f}"
            d.text((1280, y + 14), sc, font=font(TITLE_FONT, 60), fill=TEXT)
            delta = i0 - i1
            if delta:
                col, arrow = (MINT, "▲") if delta > 0 else (RED, "▼")
                d.text((1540, y + 26), f"{arrow} {abs(delta)}", font=font(BODY_FONT, 48, 800), fill=col)


# ---------- P06 trophy cabinet ----------
CAB = [("CHAMPIONS", 2022, "1st", 100, 0.90), ("MASTERS", 2023, "1st", 60, 0.95),
       ("MASTERS", 2024, "2nd", 36, 1.00), ("CHAMPIONS", 2025, "3rd–4th", 35, 1.05)]


def draw_cabinet(d, img, beat, t):
    d.text((120, 60), "PLAYER A  ·  TROPHY CABINET", font=font(TITLE_FONT, 86), fill=TEXT)
    total = 0
    for i, (ev, yr, fin, pts, mult) in enumerate(CAB):
        if beat >= i + 1:
            x = 120 + i * 430
            win = fin == "1st"
            drop = 0 if beat > i + 1 else int((1 - ease(t / SLIDE_S)) * -80)
            d.rounded_rectangle([x, 230, x + 400, 720], radius=18, fill=PANEL)
            trophy(d, x + 130, 280 + drop, 170, GOLD if win else MUTED)
            d.text((x + 30, 500), ev, font=font(TITLE_FONT, 56), fill=GOLD if win else TEXT)
            d.text((x + 30, 575), f"{yr}  ·  {fin}", font=font(BODY_FONT, 34, 600), fill=TEXT)
            d.text((x + 30, 630), f"{pts} × {mult:.2f} = {pts * mult:.1f}", font=font(BODY_FONT, 30, 500), fill=MUTED)
            total += pts * mult
    if beat >= len(CAB) + 1:
        d.text((120, 750), "TROPHY POINTS", font=font(BODY_FONT, 32, 700), fill=MUTED)
        d.text((120, 785), f"{total * (ease(t / COUNT_S) if beat == len(CAB) + 1 else 1):.1f}", font=font(TITLE_FONT, 140), fill=GOLD)


# ---------- P02 formula board ----------
PILLARS = [("TROPHIES", 28), ("FRAGGING", 15), ("BIG GAMES", 12), ("PEAK + LONGEVITY", 10),
           ("OPENING DUELS", 8), ("CLUTCH", 8), ("TEAM PLAY", 7), ("CONSISTENCY", 7), ("LEADERSHIP", 5)]


def draw_formula(d, img, beat, t):
    d.text((120, 50), "THE GOAT FORMULA", font=font(TITLE_FONT, 96), fill=CYAN)
    for i, (name, wgt) in enumerate(PILLARS):
        x, y = 120 + (i % 3) * 570, 220 + (i // 3) * 255
        d.rounded_rectangle([x, y, x + 540, y + 230], radius=18, outline=PANEL, width=4,
                            fill=PANEL if beat >= i + 1 else None)
        if beat >= i + 1:
            d.text((x + 32, y + 24), name, font=font(BODY_FONT, 30, 800), fill=GOLD if i == 0 else MUTED)
            v = wgt * (ease(t / COUNT_S) if beat == i + 1 else 1)
            d.text((x + 32, y + 70), f"{v:.0f}", font=font(TITLE_FONT, 120), fill=TEXT)
            d.text((x + 40 + d.textlength(f"{wgt}", font=font(TITLE_FONT, 120)), y + 150), "/ 100",
                   font=font(BODY_FONT, 30, 600), fill=MUTED)


# ---------- P14 big-game meter ----------
def draw_biggame(d, img, beat, t):
    d.text((120, 60), "PLAYER A: RISE OR SHRINK?", font=font(TITLE_FONT, 96), fill=TEXT)
    bars = [("Normal matches", 1.12, MUTED), ("International playoffs", 1.19, CYAN), ("Grand finals", 1.27, MINT)]
    for i, (lab, v, col) in enumerate(bars):
        if beat >= i + 1:
            y = 300 + i * 220
            k = ease(t / COUNT_S) if beat == i + 1 else 1
            d.text((120, y), lab.upper(), font=font(BODY_FONT, 34, 700), fill=MUTED)
            full = 1300 * (v / 1.4)
            d.rounded_rectangle([120, y + 55, 120 + max(full * k, 20), y + 155], radius=12, fill=col)
            d.text((140 + full * k, y + 62), f"{v * k:.2f}", font=font(TITLE_FONT, 80), fill=TEXT)


PANELS = [
    Panel("P12", "player_panel", 8, draw_player),
    Panel("P13", "head_to_head", 7, draw_h2h),
    Panel("P07", "recency_reshuffle", 3, draw_reshuffle),
    Panel("P06", "trophy_cabinet", 5, draw_cabinet),
    Panel("P02", "formula_board", 9, draw_formula, beat_seconds=[1.5] * 9),
    Panel("P14", "big_game_meter", 3, draw_biggame),
]

if __name__ == "__main__":
    for p in PANELS:
        print(p.pid, p.export(video=p.pid in {"P12", "P07"}))
