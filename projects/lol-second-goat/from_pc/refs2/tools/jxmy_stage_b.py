"""Jxmy study stage B: 0.5 s sheets around graph moments, music-drop list, 30 s mp3 clips + vocal/tempo check.
usage: python -I jxmy_stage_b.py <out_root> <work_root> <plan.json>
plan.json: {vid: {"graphs": [[start_s, end_s, "label"], ...], "clips": [[centre_s, "label"], ...], "normal": centre_s}}
"""
import subprocess, sys, os, json, csv, glob, ctypes
import numpy as np
import scipy.io.wavfile as wf
from scipy.signal import stft

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)
except Exception:
    pass
from jxmy_common import sheet, mmss  # noqa

NOWIN, LOWPRI = 0x08000000, 0x4000
OUT, WORK, PLAN = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3], encoding="utf-8"))


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore", creationflags=NOWIN | LOWPRI)


def music_drops(od, wd):
    rows = list(csv.DictReader(open(os.path.join(od, "loudness_0.5s.csv"))))
    t = np.array([float(r["t_s"]) for r in rows]); fl = np.array([float(r["bed_floor_2s_db"]) for r in rows])
    rm = np.array([float(r["rms_db"]) for r in rows])
    # bed level = rolling 20 s median of the floor; a drop = floor falls >=12 dB under that for >=1 s
    bed = np.array([np.median(fl[max(0, i - 40):i]) if i > 4 else fl[i] for i in range(len(fl))])
    drop = (fl < bed - 12) | (rm < -55)
    out, i = [], 0
    while i < len(drop):
        if drop[i]:
            j = i
            while j < len(drop) and drop[j]:
                j += 1
            if j - i >= 2 and t[i] > 3:
                out.append((t[i], t[j - 1] + 0.5, round(float(bed[i]), 1), round(float(fl[i:j].min()), 1), bool((rm[i:j] < -50).all())))
            i = j
        else:
            i += 1
    tr = json.load(open(os.path.join(wd, "transcript.json"), encoding="utf-8"))
    res = []
    for a, b, bedv, flv, full_sil in out:
        said = " ".join(x[1] for x in tr if a - 10 <= x[0] <= b + 5)
        before = " ".join(x[1] for x in tr if a - 8 <= x[0] <= a + 0.5)
        res.append({"start": a, "end": b, "start_mmss": mmss(a), "dur_s": round(b - a, 1), "bed_floor_db": bedv,
                    "floor_in_drop_db": flv, "whole_mix_silent": full_sil, "said_before": before, "said_around": said})
    return res


def analyse_clip(wav, a, dur=30):
    sr, x = wf.read(wav)
    x = x.astype(np.float32) / 32768.0
    seg = x[int(a * sr):int((a + dur) * sr)]
    if len(seg) < sr * 5:
        return {}
    f, tt, Z = stft(seg, sr, nperseg=1024, noverlap=512)
    P = np.abs(Z) ** 2
    def band(lo, hi):
        return P[(f >= lo) & (f < hi)].sum(axis=0) + 1e-12
    low, voc, high = band(30, 250), band(300, 3400), band(4000, 10000)
    tot = P.sum(axis=0) + 1e-12
    # quiet frames (narrator gaps): bottom 25 % total energy; vocal-band share there hints sung vocals in the bed
    q = tot <= np.percentile(tot, 25)
    voc_share_gaps = float(np.median(voc[q] / tot[q]))
    voc_share_all = float(np.median(voc / tot))
    # tempo: spectral-flux onset envelope autocorrelation, 60-180 bpm
    flux = np.maximum(np.diff(np.log(P + 1e-10), axis=1), 0).sum(axis=0)
    flux = flux - flux.mean()
    fps = sr / 512
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    lags = np.arange(len(ac)) / fps
    ok = (lags >= 60 / 180) & (lags <= 60 / 60)
    best = lags[ok][np.argmax(ac[ok])]
    strength = float(ac[ok].max() / (ac[0] + 1e-9))
    low_share = float(np.median(low / tot)); high_share = float(np.median(high / tot))
    return {"tempo_bpm": round(60 / best, 1), "beat_strength": round(strength, 3), "vocal_band_share_in_gaps": round(voc_share_gaps, 3),
            "vocal_band_share_all": round(voc_share_all, 3), "bass_share": round(low_share, 3), "hi_share": round(high_share, 3)}


def music_switches(wav, top=4):
    """Where the backing track changes style: compare the bed (quiet frames between words) spectrum 8 s before vs after."""
    sr, x = wf.read(wav)
    x = x.astype(np.float32) / 32768.0
    f, tt, Z = stft(x, sr, nperseg=2048, noverlap=1024)
    P = np.abs(Z) ** 2
    edges = [30, 120, 250, 500, 1000, 2000, 4000, 8000, 11000]
    B = np.stack([P[(f >= a) & (f < b)].sum(axis=0) for a, b in zip(edges[:-1], edges[1:])]) + 1e-12
    fps = sr / 1024
    n = int(len(tt) / fps)
    vec = []
    for s in range(n):
        seg = B[:, int(s * fps):int((s + 1) * fps)]
        tot = seg.sum(axis=0)
        q = tot <= np.percentile(tot, 30)
        v = np.log10(seg[:, q].mean(axis=1))
        vec.append(v - v.mean())
    vec = np.array(vec)
    W = 8
    nov = np.zeros(n)
    for s in range(W, n - W):
        nov[s] = np.linalg.norm(vec[s - W:s].mean(axis=0) - vec[s:s + W].mean(axis=0))
    picks = []
    for s in np.argsort(-nov):
        if nov[s] <= 0 or len(picks) >= top:
            break
        if all(abs(s - p) > 30 for p in picks):
            picks.append(int(s))
    return sorted(picks), float(np.median(nov[W:n - W])), {int(s): round(float(nov[s]), 2) for s in picks}


for vid, p in PLAN.items():
    od, wd = os.path.join(OUT, vid), os.path.join(WORK, vid)
    mp4, wav = os.path.join(wd, "video.mp4"), os.path.join(wd, "audio.wav")
    gd = os.path.join(od, "graphs_0.5s"); os.makedirs(gd, exist_ok=True)
    for a, b, lab in p.get("graphs", []):
        tmp = os.path.join(wd, "g_tmp"); os.makedirs(tmp, exist_ok=True)
        for f in glob.glob(os.path.join(tmp, "*.jpg")):
            os.remove(f)
        run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-threads", "2", "-ss", str(a), "-t", str(b - a), "-i", mp4,
             "-vf", "fps=2,scale=480:-2", "-q:v", "4", os.path.join(tmp, "%04d.jpg")])
        fr = sorted(glob.glob(os.path.join(tmp, "*.jpg")))
        pt = [(f, a + i * 0.5) for i, f in enumerate(fr)]
        for k in range(0, len(pt), 16):
            sheet(pt[k:k + 16], vid, os.path.join(gd, f"{vid}_{lab}_{mmss(pt[k][1]).replace(':', 'm')}s.jpg"), w=480)
    cd = os.path.join(od, "audio_clips"); os.makedirs(cd, exist_ok=True)
    info = []
    sw, sw_med, sw_score = music_switches(wav)
    clips = [(c, lab) for c, lab in p.get("clips", [])] + ([(p["normal"], "normal_talk_over_graph")] if "normal" in p else [])
    clips += [(s, f"music_switch_{i+1}") for i, s in enumerate(sw)]
    for c, lab in clips:
        a = max(0, c - 15)
        out = os.path.join(cd, f"{vid}_{lab}_{mmss(a).replace(':', 'm')}s.mp3")
        run(["ffmpeg", "-hide_banner", "-nostdin", "-y", "-ss", str(a), "-t", "30", "-i", mp4, "-vn", "-ac", "1", "-b:a", "64k", out])
        info.append({"file": os.path.basename(out), "start": mmss(a), "label": lab, **analyse_clip(wav, a)})
    drops = music_drops(od, wd)
    json.dump({"clips": info, "music_drops": drops,
               "music_switches": [{"t": mmss(s), "score": sw_score[s], "median_score": round(sw_med, 2)} for s in sw]}, open(os.path.join(od, "audio_analysis.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(vid, "graphs", len(p.get("graphs", [])), "clips", len(info), "drops", len(drops), "STAGE B DONE", flush=True)
