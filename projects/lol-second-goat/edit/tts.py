"""Scratch narration with edge-tts (Microsoft neural voice), cached by text. ay re-records the real VO."""
import hashlib, json, os, re, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "video", "public", "vo")
os.makedirs(OUT, exist_ok=True)
VOICE = os.environ.get("VO_VOICE", "en-GB-RyanNeural")
RATE = os.environ.get("VO_RATE", "+6%")


# how names are spoken (captions keep the written form): the scratch voice read "Gen.G" as "General G"
SPOKEN = {"Gen.G": "Jen Jee", "T1": "T one", "BLG": "B L G", "LCK": "L C K", "LPL": "L P L", "LEC": "L E C", "LCS": "L C S"}


def spoken(text):
    for k, v in SPOKEN.items():
        text = re.sub(r"(?<![\w.])" + re.escape(k) + r"(?![\w])", v, text)
    return text


def say(text):
    text = spoken(text)
    key = hashlib.md5(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()[:16]
    f = os.path.join(OUT, key + ".mp3")
    if not os.path.exists(f) or os.path.getsize(f) < 1000:
        env = dict(os.environ, SSL_CERT_FILE="/root/.ccr/ca-bundle.crt")
        for _ in range(4):
            r = subprocess.run(["edge-tts", "--proxy", os.environ["HTTPS_PROXY"], "--voice", VOICE, f"--rate={RATE}", "--text", text,
                                "--write-media", f], env=env, capture_output=True, text=True)
            if r.returncode == 0 and os.path.getsize(f) > 1000:
                break
        else:
            raise RuntimeError("tts failed: " + r.stderr[-400:])
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode().strip())
    return "vo/" + os.path.basename(f), d
