"""Builds a rough cut from a YAML timeline: cards, charts and clips in order,
with crossfades, slow zooms on stills, ay's voiceover and a ducked music bed.
The rough cut is for timing; the final polish happens in an editor
(DaVinci Resolve or CapCut) using the same PNGs.

    python -m edit.rough_cut edit/timeline.yaml
"""
import sys
import yaml
from moviepy import (ImageClip, VideoFileClip, AudioFileClip, CompositeAudioClip,
                     concatenate_videoclips, vfx, afx)

W, H = 1920, 1080
FADE = 0.3


def _segment(seg):
    if "image" in seg:
        c = ImageClip(seg["image"]).with_duration(seg.get("duration", 3))
        z = seg.get("zoom")
        if z:
            d = c.duration
            from moviepy import CompositeVideoClip
            c = CompositeVideoClip([c.resized(lambda t: 1 + (z - 1) * t / d).with_position("center")], size=(W, H))
    else:
        c = VideoFileClip(seg["clip"])
        c = c.subclipped(seg.get("start", 0), seg.get("end", c.duration))
        if seg.get("mute"):
            c = c.without_audio()
        c = c.resized((W, H))
    return c.with_effects([vfx.FadeIn(FADE), vfx.FadeOut(FADE)])


def build(path):
    cfg = yaml.safe_load(open(path))
    video = concatenate_videoclips([_segment(s) for s in cfg["segments"]], method="compose", bg_color=(14, 17, 22))
    video = video.resized((W, H)) if video.size != [W, H] else video
    tracks = [video.audio] if video.audio else []
    if cfg.get("voiceover"):
        tracks.append(AudioFileClip(cfg["voiceover"]).with_duration(min(video.duration, AudioFileClip(cfg["voiceover"]).duration)))
    if cfg.get("music"):
        m = AudioFileClip(cfg["music"]).with_effects([afx.AudioLoop(duration=video.duration),
                                                       afx.MultiplyVolume(cfg.get("music_volume", 0.12)),
                                                       afx.AudioFadeOut(2)])
        tracks.append(m)
    if tracks:
        video = video.with_audio(CompositeAudioClip(tracks))
    video.write_videofile(cfg["output"], fps=cfg.get("fps", 30), codec="libx264", audio_codec="aac",
                          preset="medium", threads=4, logger=None)
    return cfg["output"]


if __name__ == "__main__":
    print(build(sys.argv[1] if len(sys.argv) > 1 else "edit/timeline.example.yaml"))
