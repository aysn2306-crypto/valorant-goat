"""1920x1080 PNG cards for the video: chapter cards and player stat cards.

    python -m graphics.cards    # renders the demo cards into graphics/out/
"""
from PIL import Image, ImageDraw, ImageFont

from graphics.style import (BG, PANEL, CYAN, GOLD, TEXT, MUTED, W, H, OUT,
                            TITLE_FONT, BODY_FONT)


def _font(path, size, weight=None):
    f = ImageFont.truetype(str(path), size)
    if weight and path == BODY_FONT:
        try:
            f.set_variation_by_axes([14, weight])  # opsz, wght
        except Exception:
            pass
    return f


def chapter_card(number: int, title: str, subtitle: str = "", gold: bool = False, out_name=None):
    """Big chapter card, e.g. chapter_card(3, "THE SCORING FORMULA", "How the AI judges a player")."""
    accent = GOLD if gold else CYAN
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle([0, H - 14, W, H], fill=accent)                       # bottom accent bar
    d.text((140, 300), f"CHAPTER {number:02d}", font=_font(BODY_FONT, 44, 600), fill=accent)
    d.text((134, 370), title.upper(), font=_font(TITLE_FONT, 170), fill=TEXT)
    if subtitle:
        d.text((140, 630), subtitle, font=_font(BODY_FONT, 52, 400), fill=MUTED)
    path = OUT / (out_name or f"chapter_{number:02d}.png")
    img.save(path)
    return path


def stat_card(player: str, team: str, headline: str, stats: list[tuple[str, str]],
              rank: str | None = None, gold: bool = False, source: str = "Data: vlr.gg, Liquipedia",
              out_name=None):
    """Player stat card. `stats` = up to 6 (label, value) pairs. `rank` like "#7" or "?" for a tease."""
    accent = GOLD if gold else CYAN
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    if rank:
        d.text((120, 90), rank, font=_font(TITLE_FONT, 260), fill=accent)
    x0 = 120 if not rank else 560
    d.text((x0, 120), player, font=_font(TITLE_FONT, 150), fill=TEXT)
    d.text((x0 + 6, 320), team.upper(), font=_font(BODY_FONT, 44, 600), fill=MUTED)
    d.text((120, 440), headline, font=_font(BODY_FONT, 56, 700), fill=accent)
    # stat tiles, 3 per row
    tw, th, gap = 540, 200, 30
    for i, (label, value) in enumerate(stats[:6]):
        cx = 120 + (i % 3) * (tw + gap)
        cy = 560 + (i // 3) * (th + gap)
        d.rounded_rectangle([cx, cy, cx + tw, cy + th], radius=18, fill=PANEL)
        d.text((cx + 36, cy + 28), label.upper(), font=_font(BODY_FONT, 30, 600), fill=MUTED)
        d.text((cx + 36, cy + 78), value, font=_font(TITLE_FONT, 90), fill=TEXT)
    d.text((120, H - 60), source, font=_font(BODY_FONT, 26, 400), fill=MUTED)
    path = OUT / (out_name or f"stat_{player.lower()}.png")
    img.save(path)
    return path


if __name__ == "__main__":
    print(chapter_card(1, "THE MISSION", "Can an AI settle the Valorant GOAT debate?"))
    print(chapter_card(9, "THE GOAT", "The final reveal", gold=True, out_name="chapter_goat.png"))
    # Demo card from real raw data (Champions 2022 event stats). Not a ranking.
    print(stat_card("yay", "OpTic Gaming", "Champions 2022: highest rating at the event",
                    [("Rating", "1.30"), ("ACS", "254"), ("ADR", "159.8"),
                     ("KAST", "73%"), ("K/D", "1.50"), ("Rounds", "492")],
                    out_name="stat_demo_yay.png"))
