import os
from PIL import Image, ImageDraw, ImageFont


def mmss(t):
    t = int(t); return f"{t//60:02d}:{t%60:02d}"


def font(sz):
    for f in ["C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf"]:
        if os.path.exists(f):
            return ImageFont.truetype(f, sz)
    return ImageFont.load_default()


def sheet(paths_times, vid, out, cols=4, rows=4, w=320):
    F = font(14)
    tiles = []
    for p, t in paths_times:
        im = Image.open(p).convert("RGB")
        im = im.resize((w, int(im.height * w / im.width)))
        d = ImageDraw.Draw(im)
        lab = f"{vid} {mmss(t)}" + (f".{int(round((t % 1) * 10))}" if t % 1 else "")
        d.rectangle([0, 0, 8 * len(lab) + 8, 18], fill=(0, 0, 0))
        d.text((4, 1), lab, fill=(255, 255, 0), font=F)
        tiles.append(im)
    h = tiles[0].height
    S = Image.new("RGB", (cols * w, rows * h), (20, 20, 20))
    for i, im in enumerate(tiles):
        S.paste(im, ((i % cols) * w, (i // cols) * h))
    S.save(out, quality=62)


