"""Build index.md per video from notes JSON + audio_analysis.json + sheets on disk.
usage: python jxmy_index.py <out_root> <notes.json>
"""
import sys, os, json, glob

OUT, NOTES = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
for vid, n in NOTES.items():
    od = os.path.join(OUT, vid)
    a = json.load(open(os.path.join(od, "audio_analysis.json"), encoding="utf-8"))
    L = [f"# {n['title']} ({vid})", "", f"https://www.youtube.com/watch?v={vid}  ", f"Channel: {n['channel']}. Style: {n['style']}", ""]
    L += ["## Graph moments", "", "| Time | Chart type | Axis / range | Motion | Sound |", "|---|---|---|---|---|"]
    for g in n["graphs"]:
        L.append(f"| {g['t']} | {g['type']} | {g['axis']} | {g['motion']} | {g.get('sound', '')} |")
    L += ["", "0.5 s frame sheets for each one are in `graphs_0.5s/` (file name = chart label + start time). Every 2 s across the whole video: `sheets_2s/`.", ""]
    if n.get("notes"):
        L += ["## What to copy", ""] + [f"- {x}" for x in n["notes"]] + [""]
    L += ["## Where the music stops", "",
          "Detected from `loudness_0.5s.csv`: the bed floor (quietest 50 ms in each 2 s, i.e. the music under the gaps between words) falls 12 dB or more below its 20 s level for 1 s or longer. Some drops in clip-heavy videos are TV/interview audio with no music bed; these are marked in my notes.", "",
          "| Starts | Length | Said just before (transcript) |", "|---|---|---|"]
    for d in a["music_drops"]:
        L.append(f"| {d['start_mmss']} | {d['dur_s']} s | {d['said_before'][-140:] or '(no transcript)'} |")
    L += ["", "## Music style switches (bed spectrum change, 8 s before vs after)", ""]
    for s in a.get("music_switches", []):
        L.append(f"- {s['t']} (change score {s['score']}, median {s['median_score']})")
    L += ["", "## Audio clips (30 s, 64 kbps mono, in `audio_clips/`)", "",
          "Tempo is a rough autocorrelation estimate (can read half or double). 'Vocal-band share in gaps' = share of 300-3400 Hz energy in the quietest quarter of frames (between narrator words); high values there can mean a sung or spoken layer in the bed, but this is a hint only, listen to confirm.", "",
          "| File | Label | Tempo bpm | Beat strength | Vocal-band share in gaps | Bass share |", "|---|---|---|---|---|---|"]
    for c in a["clips"]:
        L.append(f"| {c['file']} | {c['label']} | {c.get('tempo_bpm', '')} | {c.get('beat_strength', '')} | {c.get('vocal_band_share_in_gaps', '')} | {c.get('bass_share', '')} |")
    if n.get("music"):
        L += ["", "## Music notes", ""] + [f"- {x}" for x in n["music"]]
    L += ["", "## Files", "", "- `transcript.txt` timestamps [mm:ss]" + (" (missing: YouTube 429 on subtitles)" if not os.path.exists(os.path.join(od, "transcript.txt")) else ""),
          "- `loudness_0.5s.csv` columns: t_s, mmss, momentary_lufs (ebur128 M), rms_db, min50ms_db, bed_floor_2s_db",
          "- `audio_analysis.json` all numbers above", ""]
    open(os.path.join(od, "index.md"), "w", encoding="utf-8").write("\n".join(L))
    print(vid, "index written")
