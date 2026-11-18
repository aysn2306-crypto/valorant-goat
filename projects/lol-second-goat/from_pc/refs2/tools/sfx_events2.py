"""SFX events on demucs no_vocals stem, whole video.
usage: <venv python> sfx_events2.py <sep_dir/htdemucs> <audio_dir> <refs2_dir> <out_dir> <plans_dir> <vid> [...]
"""
import sys, os, json, csv, glob, subprocess, ctypes
import numpy as np, librosa
from PIL import Image, ImageDraw, ImageFont

try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)
except Exception:
    pass
SEP, AUD, REFS, OUT, PLANS, IDS = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6:]
SR, HOP = 22050, 256
FT = HOP / SR
NOWIN = 0x08000000


def mmss(t):
    return f"{int(t)//60:02d}:{t % 60:04.1f}"


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-8))


def classify(S, freqs, rdb, f):
    n = len(rdb)
    pk = f + int(np.argmax(rdb[f:min(n, f + 8)]))
    p0, p1 = max(0, f - int(0.5 / FT)), max(1, f - int(0.05 / FT))
    bg = float(np.median(rdb[p0:p1]))
    exc = max(rdb[pk] - bg, 0.5)
    end = pk
    while end + 1 < n and rdb[end + 1] - bg > 0.5 * exc and end - pk < int(3.0 / FT):
        end += 1
    dur = (end - f + 1) * FT
    P = S ** 2
    post = P[:, f:max(f + 1, min(n, f + int(0.15 / FT)))].mean(1)
    prev = P[:, p0:p1].mean(1)
    D = np.maximum(post - prev, 0)
    tot = D.sum() + 1e-12
    low, high = D[freqs < 150].sum() / tot, D[freqs > 2000].sum() / tot
    dec = 1 - (rdb[min(n - 1, pk + int(0.3 / FT))] - bg) / exc
    flat = float(np.exp(np.mean(np.log(D[D > 0] + 1e-12))) / (np.mean(D) + 1e-12)) if (D > 0).sum() > 10 else 0.0
    seg = S[:, f:max(f + 2, end + 1)]
    cen = librosa.feature.spectral_centroid(S=seg, freq=freqs)[0]
    sweep = float(cen[-1] - cen[0]) if len(cen) > 2 else 0.0
    pre = rdb[max(0, f - int(2.5 / FT)):max(0, f - int(0.05 / FT))]
    rise = corr = 0.0
    if len(pre) > 40:
        rise = float(np.mean(pre[-10:]) - np.mean(pre[:10]))
        corr = float(np.corrcoef(np.arange(len(pre)), pre)[0, 1]) if np.std(pre) > 0 else 0.0
    if rise > 6 and corr > 0.7:
        lab = "riser (into this point)"
    elif low > 0.35 and dec > 0.6 and dur < 0.7:
        lab = "hit / low thump"
    elif dur < 0.12 and high > 0.5:
        lab = "pop / click"
    elif 0.15 <= dur <= 1.0 and high >= 0.15 and flat > 0.08 and abs(sweep) > 500:
        lab = "whoosh"
    elif high > 0.6 and flat > 0.15:
        lab = "noise burst (shutter/scratch/crowd?)"
    else:
        lab = "other"
    return lab, pk, bg, exc, dur, dict(low=round(float(low), 2), high=round(float(high), 2), flat=round(flat, 3),
                                         sweep=int(sweep), rise=round(rise, 1), corr=round(corr, 2))


def tile(vid, t):
    i = int(t // 2)
    sheets = sorted(glob.glob(os.path.join(REFS, vid, "sheets_2s", "*.jpg")))
    k, j = i // 16, i % 16
    if k >= len(sheets):
        return None, ""
    im = Image.open(sheets[k])
    w = im.width // 4
    h = im.height // 4
    return im.crop(((j % 4) * w, (j // 4) * h, (j % 4 + 1) * w, (j // 4 + 1) * h)), f"sheets_2s/{os.path.basename(sheets[k])} tile {j + 1}"


for vid in IDS:
    od = os.path.join(OUT, vid)
    os.makedirs(os.path.join(od, "sfx_clips"), exist_ok=True)
    nv, _ = librosa.load(os.path.join(SEP, vid, "no_vocals.wav"), sr=SR, mono=True)
    vo, _ = librosa.load(os.path.join(SEP, vid, "vocals.wav"), sr=SR, mono=True)
    S = np.abs(librosa.stft(nv, n_fft=1024, hop_length=HOP))
    freqs = librosa.fft_frequencies(sr=SR, n_fft=1024)
    rdb = db(librosa.feature.rms(S=S, frame_length=1024, hop_length=HOP)[0])
    MEL = np.log1p(librosa.feature.melspectrogram(S=S ** 2, sr=SR, n_mels=32))
    vrms = db(librosa.feature.rms(y=vo, frame_length=1024, hop_length=HOP)[0])
    env = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S), sr=SR, hop_length=HOP)
    on = librosa.onset.onset_detect(onset_envelope=env, sr=SR, hop_length=HOP, backtrack=True, units="frames")
    tempo, beats = librosa.beat.beat_track(onset_envelope=env, sr=SR, hop_length=HOP)
    per = 60 / float(np.atleast_1d(tempo)[0]) if float(np.atleast_1d(tempo)[0]) > 0 else 0.6
    st = env[np.minimum(on + 2, len(env) - 1)]
    tr = json.load(open(os.path.join(REFS, "..", "..", "..", "..", "..", "refs3_jxmy_tr", vid + ".json"), encoding="utf-8")) if False else []
    trp = os.path.join(REFS, vid, "transcript.txt")
    lines = []
    if os.path.exists(trp):
        for l in open(trp, encoding="utf-8"):
            if l.startswith("["):
                mm, ss = l[1:6].split(":")
                lines.append((int(mm) * 60 + int(ss), l[8:].strip()))
    an = json.load(open(os.path.join(REFS, vid, "audio_analysis.json"), encoding="utf-8"))
    drops = [d["start"] for d in an["music_drops"]]
    sw = [int(x["t"][:2]) * 60 + int(x["t"][3:5]) for x in an.get("music_switches", [])]
    plan = {}
    for pf in glob.glob(os.path.join(PLANS, "plan_*.json")):
        plan.update(json.load(open(pf, encoding="utf-8")))
    graphs = plan.get(vid, {}).get("graphs", [])
    ev = []
    for f, s in zip(on, st):
        t = f * FT
        loc = st[(on * FT > t - 8) & (on * FT < t + 8)]
        if s < np.percentile(loc, 90) or t < 1:
            continue
        # skip beat-like: similar-strength onsets one beat before AND after
        near = lambda dt: np.any((np.abs(on * FT - (t + dt)) < 0.04) & (st > 0.6 * s))
        if near(per) and near(-per):
            continue
        lab, pk, bg, exc, dur, feat = classify(S, freqs, rdb, int(f))
        if exc < 4:
            continue
        # recurring-sound test: same spectral shape + similar strength within +-4 s at >= 2 other onsets = part of the music
        def shape(fr):
            v = MEL[:, fr:fr + 4].mean(1)
            return v / (np.linalg.norm(v) + 1e-9)
        me = shape(int(f))
        others = on[(np.abs(on * FT - t) < 4) & (np.abs(on * FT - t) > 0.08)]
        rep = sum(1 for o in others if float(me @ shape(int(o))) > 0.97 and abs(rdb[min(len(rdb) - 1, o + 3)] - rdb[pk]) < 3)
        if rep >= 2:
            continue
        v0, v1 = max(0, int((t - 5) / FT)), min(len(vrms), int((t + 5) / FT))
        vact = vrms[v0:v1]
        vlev = float(np.percentile(vact, 90)) if len(vact) else -60
        rel = round(float(rdb[pk]) - vlev, 1)
        if rel < -24:
            continue
        moment = []
        for a, b2, gl in graphs:
            if a - 1 <= t <= b2:
                moment.append("graph " + gl + (" (appears)" if t - a < 3 else ""))
        if any(abs(t - d) < 1.5 for d in drops):
            moment.append("at a music drop / reveal")
        if any(abs(t - s2) < 3 for s2 in sw):
            moment.append("bed change / chapter")
        said = " ".join(x[1] for x in lines if t - 3 <= x[0] <= t + 1)
        ev.append(dict(t=round(t, 2), mmss=mmss(t), type=lab, dur_s=round(dur, 2), excess_over_bed_db=round(exc, 1),
                       level_vs_voice_db=rel, moment="; ".join(moment) or "footage / talk", said=said[-160:], **feat))
    dur_min = len(nv) / SR / 60
    # clearest 10: prefer labelled types, biggest excess
    ranked = sorted(ev, key=lambda e: (e["type"] == "other", -e["excess_over_bed_db"]))[:10]
    ranked = sorted(ranked, key=lambda e: e["t"])
    wav = os.path.join(AUD, vid + ".wav")
    tiles, F = [], ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 13)
    for i, e in enumerate(ranked, 1):
        a = max(0, e["t"] - 1.5)
        fn = f"{vid}_sfx{i:02d}_{e['mmss'].replace(':', 'm').replace('.', 's')}_{e['type'].split()[0].replace('/', '')}.mp3"
        subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error", "-y", "-ss", str(a), "-t", "3", "-i", wav,
                        "-ac", "1", "-b:a", "64k", os.path.join(od, "sfx_clips", fn)], creationflags=NOWIN | 0x4000)
        e["clip"] = fn
        im, ref = tile(vid, e["t"])
        e["screen_tile"] = ref
        if im:
            im = im.resize((320, int(320 * im.height / im.width)))
            d = ImageDraw.Draw(im)
            d.rectangle([0, im.height - 20, 320, im.height], fill=(0, 0, 0))
            d.text((4, im.height - 18), f"#{i} {e['mmss']} {e['type'][:18]}", fill=(0, 255, 255), font=F)
            tiles.append(im)
    if tiles:
        h = tiles[0].height
        B = Image.new("RGB", (5 * 320, 2 * h), (20, 20, 20))
        for i, im in enumerate(tiles):
            B.paste(im, ((i % 5) * 320, (i // 5) * h))
        B.save(os.path.join(od, f"{vid}_sfx_top10_board.jpg"), quality=70)
    with open(os.path.join(od, "sfx_events.csv"), "w", newline="", encoding="utf-8") as fh:
        keys = list(ev[0].keys()) if ev else []
        w = csv.DictWriter(fh, fieldnames=keys + ["clip", "screen_tile"])
        w.writeheader()
        for e in ev:
            w.writerow(e)
    cnt = {}
    for e in ev:
        cnt[e["type"]] = cnt.get(e["type"], 0) + 1
    mom = {}
    for e in ev:
        k = "graph" if e["moment"].startswith("graph") else ("drop/reveal" if "drop" in e["moment"] else ("chapter" if "chapter" in e["moment"] else "footage/talk"))
        mom[k] = mom.get(k, 0) + 1
    summ = dict(video=vid, minutes=round(dur_min, 1), events=len(ev), per_min=round(len(ev) / dur_min, 2), types=cnt, moments=mom,
                median_level_vs_voice_db=float(np.median([e["level_vs_voice_db"] for e in ev])) if ev else None,
                bed_tempo_bpm=round(60 / per, 1), top10=ranked)
    json.dump(summ, open(os.path.join(od, "sfx_summary.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False, default=float)
    print(vid, "events", len(ev), "per min", summ["per_min"], cnt, flush=True)
