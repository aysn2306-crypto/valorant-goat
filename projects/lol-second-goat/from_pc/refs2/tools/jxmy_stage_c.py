"""Jxmy study stage C: HOW the graphs move. 10 fps frames of short graph moments, plus numbers a person can't read
off a still: camera shift per frame (phase correlation), how much of the frame changes and where (entrance order),
and audio onsets (where a whoosh, hit or click lands against the motion).
usage: python -I jxmy_stage_c.py <out_root> <work_root> <moments.json>
moments.json: [[vid, start_s, end_s, "label"], ...]
Writes <out_root>/<vid>/motion_10fps/<label>/ : sheet_XX.jpg (30 tiles = 3 s each, time on every tile),
motion.csv, onsets.csv. The downloaded clip is deleted at the end of each moment. Headless, no windows, low priority.
"""
import subprocess, sys, os, json, csv, glob, time, ctypes, shutil
import numpy as np
from PIL import Image
import scipy.io.wavfile as wf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)
except Exception:
    pass
from jxmy_common import sheet  # noqa

NOWIN, LOWPRI = 0x08000000, 0x4000
YT = [sys.executable, "-m", "yt_dlp", "--js-runtimes", "node", "--no-progress"]
OUT, WORK, MOM = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3], encoding="utf-8"))
FPS = 10


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore", creationflags=NOWIN | LOWPRI)


def fetch(vid, a, b, mp4):
    for t in range(5):
        r = run(YT + ["-f", "bv*[height<=720]+ba/b[height<=720]", "--download-sections", f"*{a}-{b}", "--force-keyframes-at-cuts",
                      "--merge-output-format", "mp4", "-o", mp4, f"https://www.youtube.com/watch?v={vid}"])
        if r.returncode == 0 and os.path.exists(mp4):
            return True
        if "429" in r.stderr:
            print(vid, "429, waiting 4 min", flush=True); time.sleep(240); continue
        print(vid, "yt-dlp err", r.stderr[-300:], flush=True); time.sleep(30)
    return False


def shift(a, b):
    """global translation b relative to a (pixels at 320 wide) by phase correlation, plus peak strength"""
    A, B = np.fft.fft2(a), np.fft.fft2(b)
    R = A * np.conj(B); R /= np.abs(R) + 1e-9
    r = np.abs(np.fft.ifft2(R))
    y, x = np.unravel_index(r.argmax(), r.shape)
    if y > a.shape[0] // 2: y -= a.shape[0]
    if x > a.shape[1] // 2: x -= a.shape[1]
    return -x, -y, float(r.max())


def scale_est(a, b):
    """zoom between frames: compare radial energy profile of the magnitude spectra (log-polar idea, 1D)"""
    def prof(im):
        F = np.abs(np.fft.fftshift(np.fft.fft2(im - im.mean())))
        h, w = F.shape; yy, xx = np.indices(F.shape)
        rr = np.hypot((yy - h / 2) / h, (xx - w / 2) / w)
        bins = np.linspace(0.01, 0.4, 60)
        return np.array([F[(rr >= bins[i]) & (rr < bins[i + 1])].mean() for i in range(len(bins) - 1)]), bins
    pa, bins = prof(a); pb, _ = prof(b)
    best, bs = 1.0, 1e18
    for s in np.linspace(0.9, 1.1, 41):
        q = np.interp(bins[:-1] / s, bins[:-1], pb)
        e = ((np.log(pa + 1) - np.log(q + 1)) ** 2).sum()
        if e < bs: bs, best = e, s
    return float(best)   # >1: content got bigger (zoom in)


def onsets(wav, t0):
    sr, x = wf.read(wav)
    x = x.astype(np.float32) / 32768.0
    hop, n = sr // 100, 1024
    fr = [x[i:i + n] * np.hanning(n) for i in range(0, len(x) - n, hop)]
    S = np.abs(np.fft.rfft(np.array(fr), axis=1))
    flux = np.maximum(np.diff(np.log1p(S), axis=0), 0).sum(axis=1)
    hi = np.maximum(np.diff(np.log1p(S[:, n // 8:]), axis=0), 0).sum(axis=1)   # above ~2.7 kHz: whooshes, clicks, risers
    rms = 20 * np.log10(np.sqrt((np.array(fr) ** 2).mean(axis=1)) + 1e-9)
    thr = np.median(flux) + 3 * flux.std()
    out = []
    for i in range(1, len(flux) - 1):
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]:
            out.append((round(t0 + (i + 1) / 100, 2), round(float(flux[i]), 1), round(float(hi[i] / (flux[i] + 1e-9)), 2), round(float(rms[i + 1]), 1)))
    return out, [(round(t0 + i / 100, 2), round(float(r), 1)) for i, r in enumerate(rms[::10])]


for vid, a, b, label in MOM:
    od = os.path.join(OUT, vid, "motion_10fps", label); os.makedirs(od, exist_ok=True)
    if os.path.exists(os.path.join(od, "motion.csv")):
        print("skip", vid, label, flush=True); continue
    wd = os.path.join(WORK, f"{vid}_{label}"); os.makedirs(wd, exist_ok=True)
    mp4 = os.path.join(wd, "clip.mp4")
    if not fetch(vid, a, b, mp4):
        print("FAILED", vid, label, flush=True); continue
    fd = os.path.join(wd, "f"); os.makedirs(fd, exist_ok=True)
    run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-threads", "2", "-i", mp4, "-vf", f"fps={FPS},scale=640:-2", "-q:v", "4", os.path.join(fd, "%05d.jpg")])
    run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "22050", os.path.join(wd, "a.wav")])
    frames = sorted(glob.glob(os.path.join(fd, "*.jpg")))
    ts = [a + i / FPS for i in range(len(frames))]
    for k in range(0, len(frames), 30):
        sheet(list(zip(frames[k:k + 30], ts[k:k + 30])), vid, os.path.join(od, f"sheet_{k // 30:02d}.jpg"), cols=6, rows=5, w=320)
    rows, prev = [], None
    for p, t in zip(frames, ts):
        g = np.asarray(Image.open(p).convert("L").resize((320, 180)), dtype=np.float32)
        if prev is None:
            prev = g; continue
        dx, dy, pk = shift(prev, g)
        d = np.abs(g - prev) > 18
        share = float(d.mean())
        ys, xs = np.nonzero(d)
        cx, cy = (float(xs.mean()) / 320, float(ys.mean()) / 180) if len(xs) else (-1, -1)
        bbox = (round(xs.min() / 320, 2), round(ys.min() / 180, 2), round(xs.max() / 320, 2), round(ys.max() / 180, 2)) if len(xs) else ("", "", "", "")
        rows.append([round(t, 2), dx * 6, dy * 6, round(pk, 3), round(scale_est(prev, g), 3), round(share, 4), round(cx, 2), round(cy, 2), *bbox, round(float(g.mean()), 1)])
        prev = g
    with open(os.path.join(od, "motion.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["t_s", "cam_dx_px1920", "cam_dy_px1920", "shift_conf", "zoom_ratio", "changed_share", "change_cx", "change_cy",
                    "chg_x0", "chg_y0", "chg_x1", "chg_y1", "mean_luma"])
        w.writerows(rows)
    on, lv = onsets(os.path.join(wd, "a.wav"), a)
    with open(os.path.join(od, "onsets.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["t_s", "flux", "high_freq_share", "rms_db"]); w.writerows(on)
    with open(os.path.join(od, "level_0.1s.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["t_s", "rms_db"]); w.writerows(lv)
    shutil.rmtree(wd, ignore_errors=True)   # the clip and raw frames are deleted; only sheets and numbers stay
    print("done", vid, label, len(frames), "frames", flush=True)
