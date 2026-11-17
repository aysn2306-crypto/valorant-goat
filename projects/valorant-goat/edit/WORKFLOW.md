# Editing workflow (Remotion pipeline)

Adapted from ay's editing research (Duncan Rogoff "I taught Claude how to edit videos", Christian Peverelli
"I Fully Automated My Video Editing Using Claude Code", in ay's `Documents\editing-refs`) to the pipeline ay picked:
**Remotion for every graphic and the final edit**, ffmpeg for audio and checks.

## The six jobs (never one-shot a whole video)

| Job | What happens | Tool in this repo |
| --- | --- | --- |
| 1. Script | Hook and format copied from 3 niche videos that beat their channel's average; one spoken line per row | `edit/script/<section>.txt` |
| 2. Cut the voiceover | ay reads top to bottom, repeats any line that goes wrong. Whisper word timestamps, keep the last clean take, list what was cut | `edit/vo_transcribe.py`, `edit/vo_cut.py` |
| 3. Beat map | Every idea in the script and what is on screen while it is said. One graphic per idea, held long enough to read, not one per sentence | `edit/beatmaps/<section>.yaml`, `edit/beats.py` |
| 4. Design | Palette, type and chart rules from the style guide and the reference frame sheets | `video/src/theme.ts`, style spec |
| 5. Motion graphics | One Remotion scene per panel (P01 to P26), timed from the beat map | `video/src/` |
| 6. Review and feedback | Measured checks plus frame strips; after each round of ay's notes, write the rule that would have prevented each note into this file | `edit/review.py` |

## Voiceover to timed edit

```bash
pip install faster-whisper==1.2.1                                   # once, on the PC
python -m edit.vo_transcribe edit/assets/vo_raw.wav                 # word timestamps (player names from research/glossary.csv)
python -m edit.vo_cut edit/assets/vo_raw.wav edit/script/clutch.txt # -> vo_raw.clean.wav + removed.txt
python -m edit.beats edit/beatmaps/clutch.yaml edit/assets/vo_raw.clean.words.json  # -> video/src/data/beats/clutch.json
```

Whisper runs on the PC (the cloud can't download its models). `small.en` is fast on CPU; use `medium.en` if names come out wrong.
Parakeet (Peverelli's choice) is more accurate on English but needs NVIDIA NeMo; faster-whisper is the simpler install on Windows.

## Render rules

- Drafts at half size: `npm run draft -- <Composition> out/<name>_draft.mp4` (960x540, CRF 28, 4 threads).
- Full quality only after ay approves the cut: `npm run final -- <Composition> out/<name>.mp4` (1080p, CRF 18).
- At most 4 renders at once (Rogoff crashed his PC at 9). Long renders overnight.
- One composition per section; join finished sections with ffmpeg concat `-c copy`, add the final mix with `-c:v copy`.
- Before any full render, render 4 to 6 stills at the busiest moments and look at them.

## Review checklist (run before ay sees anything)

`python -m edit.review video/out/<name>.mp4 --beats video/src/data/beats/<section>.json --words edit/assets/vo_raw.clean.words.json`

1. Animation playing twice (look at the beat strips)
2. A graphic flashing for a split second (flagged: shots under 0.4 s)
3. Text landing too late to read (flagged: each beat holds 0.5 s + 0.3 s per on-screen word)
4. A graphic over a face or the action (gameplay clips; look)
5. A repeated word in the voiceover (flagged)
6. Voiceover running past the picture (flagged)
7. Loudness -14 LUFS integrated, true peak at or under -1 dBTP (flagged; measured, not heard)
8. Phone check: beat frames at 360 px wide

No self-scores. Put our frame next to the reference frame and list the differences.

## Sound

- Every effect has a cause on screen; its peak lands one frame after the picture. Rotate two or three takes of a repeated sound.
- SFX: Pixabay-licensed pack in `video/public/sfx` (free, commercial use, no attribution needed).
- Music under the voice at about 0.14 volume. **Music source not chosen yet** (needs ay: see the open question in the thread).
