"""Jxmy big-gap study, stage A: subs, 360p video, 2 s labelled sheets, overview, loudness CSV, music-drop marks.
usage: python -I jxmy_stage_a.py <out_root> <work_root> <video_id> [<video_id> ...]
Keeps video.mp4 + audio.wav in work_root/<id>/ for stage B.
"""
import subprocess, sys, os, re, glob, time, json, csv, ctypes
import numpy as np
from PIL import Image, ImageDraw, ImageFont

try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)  # below normal
except Exception:
    pass
NOWIN, LOWPRI = 0x08000000, 0x4000
YT = [sys.executable, "-m", "yt_dlp", "--js-runtimes", "node", "--no-progress"]
OUT, WORK, IDS = sys.argv[1], sys.argv[2], sys.argv[3:]


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore",
                          creationflags=NOWIN | LOWPRI)


def yt(args, vid):
    r = None
    for t in range(5):
        r = run(YT + args)
        if r.returncode == 0:
            return r
        if "429" in r.stderr:
            print(vid, "429, waiting 4 min", flush=True); time.sleep(240); continue
        print(vid, "yt-dlp err", r.stderr[-300:], flush=True); time.sleep(30)
    return r


def yt1(args, vid):
    r = run(YT + args)
    if r.returncode != 0:
        print(vid, "subs failed (retry later):", r.stderr.strip()[-120:], flush=True)
    return r


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


def transcript(folder, vid):
    vtts = sorted(glob.glob(os.path.join(folder, "subs*.vtt")), key=lambda p: ("orig" not in p, len(p)))
    rows, last = [], ""
    if vtts:
        for block in open(vtts[0], encoding="utf-8", errors="ignore").read().split("\n\n"):
            m = re.search(r"(\d+):(\d+):(\d+)\.(\d+) -->", block)
            if not m:
                continue
            body = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", l)).strip() for l in block.split("-->", 1)[1].splitlines()[1:]]
            body = [l for l in body if l]
            if not body or body[-1] == last:
                continue
            last = body[-1]
            h, mi, s, ms = map(int, m.groups())
            rows.append((h * 3600 + mi * 60 + s + ms / 1000, last))
        for v in vtts:
            os.remove(v)
    return rows


for vid in IDS:
    od, wd = os.path.join(OUT, vid), os.path.join(WORK, vid)
    os.makedirs(od, exist_ok=True); os.makedirs(wd, exist_ok=True)
    url = f"https://www.youtube.com/watch?v={vid}"
    # 1 subs + meta
    prev = glob.glob(os.path.join(os.path.dirname(os.path.abspath(OUT)), "..", "refs2", f"*_{vid}", "transcript.txt"))
    if prev and not os.path.exists(os.path.join(od, "transcript.txt")):
        tr = []
        for l in open(prev[0], encoding="utf-8"):
            m = re.match(r"\[(\d+)m(\d+)s\] (.*)", l.strip())
            if m:
                tr.append((int(m.group(1)) * 60 + int(m.group(2)), m.group(3)))
        with open(os.path.join(od, "transcript.txt"), "w", encoding="utf-8") as f:
            for t, txt in tr:
                f.write(f"[{mmss(t)}] {txt}\n")
        json.dump(tr, open(os.path.join(wd, "transcript.json"), "w", encoding="utf-8"))
        print(vid, "transcript from refs2", len(tr), flush=True)
    if not os.path.exists(os.path.join(od, "transcript.txt")):
        r = yt1(["--skip-download", "--write-auto-subs", "--sub-langs", "en.*,en", "--sub-format", "vtt", "--no-simulate",
                "--print", "%(upload_date)s\t%(duration)s\t%(view_count)s\t%(title)s",
                "-o", os.path.join(wd, "subs.%(ext)s"), url], vid)
        meta = (r.stdout.strip().splitlines() or [""])[-1].split("\t") if r else []
        keys = ["upload_date", "duration", "views", "title"]
        json.dump({"id": vid, **{k: (meta[i] if i < len(meta) else "") for i, k in enumerate(keys)}},
                  open(os.path.join(od, "meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        tr = transcript(wd, vid)
        if not tr:
            json.dump([], open(os.path.join(wd, "transcript.json"), "w"))
        with open(os.path.join(od, "transcript.txt"), "w", encoding="utf-8") as f:
            for t, txt in tr:
                f.write(f"[{mmss(t)}] {txt}\n")
        json.dump(tr, open(os.path.join(wd, "transcript.json"), "w", encoding="utf-8"))
        print(vid, "transcript lines", len(tr), flush=True)
        if not tr:
            os.remove(os.path.join(od, "transcript.txt"))
        time.sleep(20)
    # 2 video 360p
    mp4 = os.path.join(wd, "video.mp4")
    if not os.path.exists(mp4):
        yt(["-f", "bv*[height<=360][ext=mp4]+ba[ext=m4a]/b[height<=360]/18", "--merge-output-format", "mp4", "-o", mp4, url], vid)
    if not os.path.exists(mp4):
        print(vid, "VIDEO FAILED", flush=True); continue
    # 3 frames every 2 s -> 4x4 sheets; overview every 6 s -> 8x8
    fr = os.path.join(wd, "f2"); os.makedirs(fr, exist_ok=True)
    if not glob.glob(os.path.join(fr, "*.jpg")):
        run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-threads", "2", "-i", mp4, "-vf", "fps=0.5:start_time=0,scale=320:-2",
             "-q:v", "5", os.path.join(fr, "%05d.jpg")])
    frames = sorted(glob.glob(os.path.join(fr, "*.jpg")))
    pt = [(p, i * 2.0) for i, p in enumerate(frames)]
    sd = os.path.join(od, "sheets_2s"); os.makedirs(sd, exist_ok=True)
    for k in range(0, len(pt), 16):
        sheet(pt[k:k + 16], vid, os.path.join(sd, f"{vid}_2s_{mmss(pt[k][1]).replace(':', 'm')}s.jpg"))
    ov = os.path.join(wd, "overview"); os.makedirs(ov, exist_ok=True)
    pt6 = pt[::3]
    for k in range(0, len(pt6), 48):
        sheet(pt6[k:k + 48], vid, os.path.join(ov, f"ov_{k // 48}.jpg"), cols=8, rows=6, w=200)
    print(vid, "frames", len(frames), flush=True)
    # 4 audio: ebur128 momentary + floor (music-bed) per 0.5 s
    wav = os.path.join(wd, "audio.wav")
    run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "22050", wav])
    r = run(["ffmpeg", "-hide_banner", "-nostdin", "-i", wav, "-af", "ebur128", "-f", "null", "-"])
    mom = {}
    for m in re.finditer(r"t:\s*([\d.]+)\s+TARGET.*?M:\s*(-?[\d.]+|-inf)", r.stderr):
        b = int(float(m.group(1)) * 2)
        v = float(m.group(2)) if m.group(2) != "-inf" else -120.0
        mom.setdefault(b, []).append(v)
    import scipy.io.wavfile as wf
    sr, x = wf.read(wav)
    x = x.astype(np.float32) / 32768.0
    hop = int(sr * 0.05)
    n50 = len(x) // hop
    rms = np.sqrt(np.mean(x[:n50 * hop].reshape(n50, hop) ** 2, axis=1) + 1e-12)
    db50 = 20 * np.log10(rms)
    rows = []
    nb = len(x) // (sr // 2)
    for b in range(nb):
        seg = db50[b * 10:(b + 1) * 10]
        if len(seg) == 0:
            break
        M = float(np.mean(mom.get(b, [-120.0])))
        rows.append([b / 2, round(M, 1), round(float(np.mean(seg)), 1), round(float(np.min(seg)), 1)])
    # floor over 2 s sliding window = min 50 ms rms: music bed fills word gaps; when it drops, floor falls
    mins = np.array([r[3] for r in rows])
    fl = np.array([np.min(mins[max(0, i - 2):i + 2]) for i in range(len(mins))])
    with open(os.path.join(od, "loudness_0.5s.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["t_s", "mmss", "momentary_lufs", "rms_db", "min50ms_db", "bed_floor_2s_db"])
        for r_, v in zip(rows, fl):
            w.writerow([r_[0], mmss(r_[0]), r_[1], r_[2], r_[3], round(float(v), 1)])
    print(vid, "audio rows", len(rows), "median floor", round(float(np.median(fl)), 1), flush=True)
    print(vid, "STAGE A DONE", flush=True)
    time.sleep(15)
