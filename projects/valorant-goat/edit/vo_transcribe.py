"""Step 1 of the voiceover pipeline: transcribe ay's raw recording with word timestamps.

Runs on ay's PC (the cloud can't download Whisper models). Uses faster-whisper on CPU
or an NVIDIA GPU. Player names from research/glossary.csv are passed as a prompt so
Whisper spells them the way Liquipedia does.

    pip install faster-whisper==1.2.1
    python -m edit.vo_transcribe edit/assets/vo_raw.wav            # -> edit/assets/vo_raw.words.json
    python -m edit.vo_transcribe edit/assets/vo_raw.wav --model medium.en
"""
import argparse
import csv
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent


def glossary_prompt() -> str:
    path = ROOT / "research" / "glossary.csv"
    if not path.exists():
        return ""
    with open(path, newline="", encoding="utf-8") as f:
        names = [r["name_on_screen"] for r in csv.DictReader(f) if r.get("name_on_screen")]
    return "Valorant esports. Players: " + ", ".join(names) + "."


def transcribe(audio: str, model_name: str = "small.en", device: str = "auto") -> pathlib.Path:
    from faster_whisper import WhisperModel

    model = WhisperModel(model_name, device=device, compute_type="int8" if device != "cuda" else "float16")
    segments, info = model.transcribe(audio, language="en", word_timestamps=True, vad_filter=False,
                                      initial_prompt=glossary_prompt() or None, condition_on_previous_text=False)
    words = []
    for seg in segments:
        for w in seg.words or []:
            words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3),
                          "p": round(w.probability, 3)})
    out = pathlib.Path(audio).with_suffix(".words.json")
    out.write_text(json.dumps({"audio": str(audio), "duration": round(info.duration, 3), "model": model_name,
                               "words": words}, indent=1), encoding="utf-8")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--model", default="small.en", help="tiny.en / base.en / small.en / medium.en / large-v3")
    ap.add_argument("--device", default="auto")
    a = ap.parse_args()
    print(transcribe(a.audio, a.model, a.device))
